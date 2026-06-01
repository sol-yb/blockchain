import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('UniswapClone', function () {
  let tokenA: any;
  let tokenB: any;
  let tokenC: any;
  let router: any;
  let deployer: any;
  let pairKeyAB: string;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();
    const initialSupply = ethers.parseUnits('1000000', 18);

    const TestToken = await ethers.getContractFactory('TestToken');
    tokenA = await TestToken.deploy('Aurora Token', 'AURA', initialSupply);
    await tokenA.waitForDeployment();

    tokenB = await TestToken.deploy('Nebula Token', 'NEB', initialSupply);
    await tokenB.waitForDeployment();

    tokenC = await TestToken.deploy('Crystal Token', 'CRYS', initialSupply);
    await tokenC.waitForDeployment();

    const UniswapClone = await ethers.getContractFactory('UniswapClone');
    router = await UniswapClone.deploy();
    await router.waitForDeployment();

    // Create pair AB
    const createPairTx = await router.createPair(tokenA.target, tokenB.target);
    const receipt = await createPairTx.wait();
    pairKeyAB = ethers.keccak256(ethers.solidityPacked(['address', 'address'], 
      tokenA.target < tokenB.target ? [tokenA.target, tokenB.target] : [tokenB.target, tokenA.target]
    ));
  });

  it('creates multiple pairs', async function () {
    const pairCountBefore = await router.getPairsCount();
    
    const createPairTx = await router.createPair(tokenA.target, tokenC.target);
    await createPairTx.wait();

    const pairCountAfter = await router.getPairsCount();
    expect(pairCountAfter).to.equal(pairCountBefore + 1n);
  });

  it('adds liquidity to a pair and issues LP shares', async function () {
    const amountA = ethers.parseUnits('1000', 18);
    const amountB = ethers.parseUnits('500', 18);

    await tokenA.approve(router.target, amountA);
    await tokenB.approve(router.target, amountB);

    const addLiqTx = await router.addLiquidity(pairKeyAB, amountA, amountB);
    await addLiqTx.wait();

    const [reserveA, reserveB] = await router.getReserves(pairKeyAB);
    expect(reserveA).to.equal(amountA);
    expect(reserveB).to.equal(amountB);
  });

  it('swaps token A for token B in a pair', async function () {
    const amountA = ethers.parseUnits('1000', 18);
    const amountB = ethers.parseUnits('500', 18);

    // Add liquidity first
    await tokenA.approve(router.target, amountA);
    await tokenB.approve(router.target, amountB);
    await router.addLiquidity(pairKeyAB, amountA, amountB);

    // Perform swap
    const swapAmount = ethers.parseUnits('10', 18);
    await tokenA.approve(router.target, swapAmount);

    await expect(router.swap(pairKeyAB, swapAmount, 0, true)).to.emit(router, 'TokenSwapped');

    const [reserveA, reserveB] = await router.getReserves(pairKeyAB);
    expect(reserveA).to.be.gt(amountA);
    expect(reserveB).to.be.lt(amountB);
  });

  it('removes liquidity from a pair', async function () {
    const amountA = ethers.parseUnits('1000', 18);
    const amountB = ethers.parseUnits('500', 18);

    await tokenA.approve(router.target, amountA);
    await tokenB.approve(router.target, amountB);

    const addLiqTx = await router.addLiquidity(pairKeyAB, amountA, amountB);
    const addLiqReceipt = await addLiqTx.wait();

    // Get LP token address from events
    const lpTokenAddr = addLiqReceipt?.logs?.[0]?.address;

    // Remove liquidity
    const lpBalance = ethers.parseUnits('100', 18);
    await expect(router.removeLiquidity(pairKeyAB, lpBalance)).to.emit(router, 'LiquidityRemoved');
  });

  it('calculates quotes correctly', async function () {
    const amountA = ethers.parseUnits('1000', 18);
    const reserveA = ethers.parseUnits('1000', 18);
    const reserveB = ethers.parseUnits('500', 18);

    const quote = await router.quote(amountA, reserveA, reserveB);
    expect(quote).to.equal(ethers.parseUnits('500', 18));
  });
});
