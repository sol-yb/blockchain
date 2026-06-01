import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  // Deploy tokens
  const initialSupply = ethers.parseUnits('1000000', 18);
  const TestToken = await ethers.getContractFactory('TestToken');

  const tokenA = await TestToken.deploy('Aurora Token', 'AURA', initialSupply);
  await tokenA.waitForDeployment();
  console.log('Aurora Token deployed to:', tokenA.target);

  const tokenB = await TestToken.deploy('Nebula Token', 'NEB', initialSupply);
  await tokenB.waitForDeployment();
  console.log('Nebula Token deployed to:', tokenB.target);

  const tokenC = await TestToken.deploy('Crystal Token', 'CRYS', initialSupply);
  await tokenC.waitForDeployment();
  console.log('Crystal Token deployed to:', tokenC.target);

  // Deploy DEX router
  const UniswapClone = await ethers.getContractFactory('UniswapClone');
  const router = await UniswapClone.deploy();
  await router.waitForDeployment();
  console.log('UniswapClone deployed to:', router.target);

  // Create trading pairs
  console.log('\nCreating trading pairs...');
  const pairAB = await router.createPair(tokenA.target, tokenB.target);
  await pairAB.wait();
  console.log('Pair AURA/NEB created');

  const pairAC = await router.createPair(tokenA.target, tokenC.target);
  await pairAC.wait();
  console.log('Pair AURA/CRYS created');

  const pairBC = await router.createPair(tokenB.target, tokenC.target);
  await pairBC.wait();
  console.log('Pair NEB/CRYS created');

  // Save deployment addresses
  const deploymentInfo = {
    tokenA: tokenA.target,
    tokenB: tokenB.target,
    tokenC: tokenC.target,
    router: router.target,
    deployer: deployer.address,
    network: 'sepolia',
    timestamp: new Date().toISOString()
  };

  const deploymentPath = path.join(__dirname, '../deployments.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('\nDeployment info saved to:', deploymentPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

