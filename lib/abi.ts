// Uniswap Clone Contract ABI
export const UNISWAP_CLONE_ABI = [
  'function createPair(address tokenA, address tokenB) external returns (bytes32)',
  'function addLiquidity(bytes32 pairKey, uint256 amountA, uint256 amountB) external returns (uint256)',
  'function removeLiquidity(bytes32 pairKey, uint256 liquidity) external returns (uint256 amountA, uint256 amountB)',
  'function swap(bytes32 pairKey, uint256 amountIn, uint256 minAmountOut, bool swapAToB) external returns (uint256)',
  'function getReserves(bytes32 pairKey) external view returns (uint256, uint256)',
  'function getPair(bytes32 pairKey) external view returns (address, address)',
  'function getPairsCount() external view returns (uint256)',
  'function quote(uint256 amountA, uint256 reserveA_, uint256 reserveB_) public pure returns (uint256)',
  'event PairCreated(address indexed tokenA, address indexed tokenB, address indexed lpToken)',
  'event LiquidityAdded(bytes32 indexed pairKey, address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity)',
  'event LiquidityRemoved(bytes32 indexed pairKey, address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity)',
  'event TokenSwapped(bytes32 indexed pairKey, address indexed sender, address indexed tokenIn, uint256 amountIn, address indexed tokenOut, uint256 amountOut)'
];

// ERC20 Token ABI
export const ERC20_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];
