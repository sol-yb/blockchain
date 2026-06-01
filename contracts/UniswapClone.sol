// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract UniswapClone is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Pair {
        IERC20 tokenA;
        IERC20 tokenB;
        uint256 reserveA;
        uint256 reserveB;
        string lpTokenName;
        address lpToken;
    }

    mapping(bytes32 => Pair) public pairs;
    mapping(bytes32 => bool) public pairExists;
    bytes32[] public pairKeys;

    event PairCreated(address indexed tokenA, address indexed tokenB, address indexed lpToken);
    event LiquidityAdded(bytes32 indexed pairKey, address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(bytes32 indexed pairKey, address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event TokenSwapped(bytes32 indexed pairKey, address indexed sender, address indexed tokenIn, uint256 amountIn, address indexed tokenOut, uint256 amountOut);

    function _getPairKey(address tokenA, address tokenB) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenA < tokenB ? tokenA : tokenB, tokenA < tokenB ? tokenB : tokenA));
    }

    function _deployLPToken(string memory name) private returns (address) {
        return address(new LPToken(name));
    }

    function createPair(address tokenA, address tokenB) external returns (bytes32) {
        require(tokenA != tokenB, 'IDENTICAL_TOKENS');
        bytes32 key = _getPairKey(tokenA, tokenB);
        require(!pairExists[key], 'PAIR_EXISTS');

        address lpToken = _deployLPToken('Uniswap Clone LP');
        pairExists[key] = true;
        pairKeys.push(key);
        pairs[key] = Pair(IERC20(tokenA), IERC20(tokenB), 0, 0, 'Uniswap Clone LP', lpToken);

        emit PairCreated(tokenA, tokenB, lpToken);
        return key;
    }

    function _updateReserves(bytes32 key) private {
        uint256 balanceA = pairs[key].tokenA.balanceOf(address(this));
        uint256 balanceB = pairs[key].tokenB.balanceOf(address(this));
        pairs[key].reserveA = balanceA;
        pairs[key].reserveB = balanceB;
    }

    function addLiquidity(bytes32 pairKey, uint256 amountA, uint256 amountB) external nonReentrant returns (uint256 liquidity) {
        require(pairExists[pairKey], 'PAIR_NOT_FOUND');
        require(amountA > 0 && amountB > 0, 'INVALID_AMOUNTS');

        Pair storage pair = pairs[pairKey];
        uint256 totalSupply = LPToken(pair.lpToken).totalSupply();

        pair.tokenA.safeTransferFrom(msg.sender, address(this), amountA);
        pair.tokenB.safeTransferFrom(msg.sender, address(this), amountB);

        if (totalSupply == 0) {
            liquidity = sqrt(amountA * amountB);
            require(liquidity > 0, 'INSUFFICIENT_LIQUIDITY');
        } else {
            uint256 liquidityA = (amountA * totalSupply) / pair.reserveA;
            uint256 liquidityB = (amountB * totalSupply) / pair.reserveB;
            liquidity = liquidityA < liquidityB ? liquidityA : liquidityB;
            require(liquidity > 0, 'INSUFFICIENT_LIQUIDITY');
        }

        LPToken(pair.lpToken).mint(msg.sender, liquidity);
        _updateReserves(pairKey);
        emit LiquidityAdded(pairKey, msg.sender, amountA, amountB, liquidity);
    }

    function removeLiquidity(bytes32 pairKey, uint256 liquidity) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        require(pairExists[pairKey], 'PAIR_NOT_FOUND');
        require(liquidity > 0, 'INVALID_LIQUIDITY');

        Pair storage pair = pairs[pairKey];
        uint256 totalSupply = LPToken(pair.lpToken).totalSupply();

        amountA = (liquidity * pair.reserveA) / totalSupply;
        amountB = (liquidity * pair.reserveB) / totalSupply;
        require(amountA > 0 && amountB > 0, 'INSUFFICIENT_AMOUNT');

        LPToken(pair.lpToken).burn(msg.sender, liquidity);
        pair.tokenA.safeTransfer(msg.sender, amountA);
        pair.tokenB.safeTransfer(msg.sender, amountB);

        _updateReserves(pairKey);
        emit LiquidityRemoved(pairKey, msg.sender, amountA, amountB, liquidity);
    }

    function swap(bytes32 pairKey, uint256 amountIn, uint256 minAmountOut, bool swapAToB) external nonReentrant returns (uint256 amountOut) {
        require(pairExists[pairKey], 'PAIR_NOT_FOUND');
        require(amountIn > 0, 'INVALID_INPUT');

        Pair storage pair = pairs[pairKey];
        IERC20 tokenIn = swapAToB ? pair.tokenA : pair.tokenB;
        IERC20 tokenOut = swapAToB ? pair.tokenB : pair.tokenA;
        uint256 reserveIn = swapAToB ? pair.reserveA : pair.reserveB;
        uint256 reserveOut = swapAToB ? pair.reserveB : pair.reserveA;

        tokenIn.safeTransferFrom(msg.sender, address(this), amountIn);

        uint256 amountInWithFee = (amountIn * 997) / 1000;
        amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
        require(amountOut >= minAmountOut && amountOut > 0, 'INSUFFICIENT_OUTPUT');

        tokenOut.safeTransfer(msg.sender, amountOut);

        _updateReserves(pairKey);
        emit TokenSwapped(pairKey, msg.sender, address(tokenIn), amountIn, address(tokenOut), amountOut);
    }

    function getReserves(bytes32 pairKey) external view returns (uint256, uint256) {
        require(pairExists[pairKey], 'PAIR_NOT_FOUND');
        return (pairs[pairKey].reserveA, pairs[pairKey].reserveB);
    }

    function getPair(bytes32 pairKey) external view returns (address, address) {
        require(pairExists[pairKey], 'PAIR_NOT_FOUND');
        return (address(pairs[pairKey].tokenA), address(pairs[pairKey].tokenB));
    }

    function getPairsCount() external view returns (uint256) {
        return pairKeys.length;
    }

    function quote(uint256 amountA, uint256 reserveA_, uint256 reserveB_) public pure returns (uint256) {
        require(amountA > 0, 'INSUFFICIENT_AMOUNT');
        require(reserveA_ > 0 && reserveB_ > 0, 'INSUFFICIENT_LIQUIDITY');
        return (amountA * reserveB_) / reserveA_;
    }

    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}

contract LPToken is ERC20 {
    address public owner;

    constructor(string memory name) ERC20(name, 'UCLP') {
        owner = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, 'UNAUTHORIZED');
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == owner, 'UNAUTHORIZED');
        _burn(from, amount);
    }
}

