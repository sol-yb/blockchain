# Deployment Guide

## Local Development

### 1. Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension
- Git

### 2. Installation
```bash
cd blockchain\ aasignment
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

For local testing, you can use mock values in `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

### 5. Run Tests Locally
```bash
# Run Hardhat contract tests
npm run test

# Run Jest component tests
npm run test -- __tests__
```

---

## Sepolia Testnet Deployment

### 1. Get Testnet Funds
- Visit [Sepolia Faucet](https://sepoliafaucet.com) or [Alchemy Faucet](https://sepoliafaucet.com)
- Fund your deployer wallet with SepoliaETH

### 2. Configure Infura/Alchemy
- Sign up at [Infura.io](https://infura.io) or [Alchemy.com](https://alchemy.com)
- Create a project
- Copy your Project ID or RPC URL

### 3. Update `.env.local`
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=0x... (your private key, NO 0x prefix needed, or with it)
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
```

### 4. Deploy Smart Contracts
```bash
npm run deploy:sepolia
```

Output will show:
```
Deploying contracts with account: 0x...
Aurora Token deployed to: 0x123...
Nebula Token deployed to: 0x456...
Crystal Token deployed to: 0x789...
UniswapClone deployed to: 0xabc...

Creating trading pairs...
Pair AURA/NEB created
Pair AURA/CRYS created
Pair NEB/CRYS created

Deployment info saved to: deployments.json
```

### 5. Update Frontend Configuration
Copy the `router` address from `deployments.json`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xabc... (from deployment output)
NEXT_PUBLIC_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

### 6. Test Frontend with Sepolia
```bash
npm run dev
```

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. MetaMask should prompt you to switch to Sepolia
4. Navigate to `/swap` and test swaps

---

## Production Deployment (Vercel)

### 1. Build Locally
```bash
npm run build
```

### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel deploy
```

Or connect your GitHub repo to Vercel for automatic deploys.

### 3. Set Environment Variables in Vercel
In Vercel project settings → Environment Variables:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SEPOLIA_RPC=https://sepolia.infura.io/v3/...
```

### 4. Verify Deployment
Visit your Vercel URL and test all features.

---

## Docker Deployment

### 1. Build Docker Image
```bash
docker build -t neon-dex .
```

### 2. Run Container
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_CONTRACT_ADDRESS=0x... \
  -e NEXT_PUBLIC_SEPOLIA_RPC=https://... \
  neon-dex
```

### 3. Push to Registry
```bash
docker tag neon-dex your-registry/neon-dex:latest
docker push your-registry/neon-dex:latest
```

---

## Contract Verification on Etherscan

### 1. Get Etherscan API Key
- Sign up at [Etherscan.io](https://etherscan.io)
- Go to API Keys
- Create a new key

### 2. Verify Contract
```bash
npx hardhat verify --network sepolia 0xYOUR_CONTRACT_ADDRESS
```

### 3. View on Etherscan
Visit `https://sepolia.etherscan.io/address/0xYourContractAddress`

---

## Troubleshooting

### MetaMask Connection Issues
- Ensure Sepolia network is added to MetaMask
- Check that contract address is correct
- Verify RPC endpoint is responsive

### Transaction Fails
- Check account has sufficient SepoliaETH
- Verify token approvals before swap/liquidity
- Check gas prices aren't too high

### API Not Responding
- Verify CoinGecko API is accessible
- Check Infura/Alchemy RPC limits
- Check browser console for errors

### Contract Deployment Fails
- Verify private key is correct (without 0x prefix usually)
- Ensure account has sufficient SepoliaETH
- Check RPC endpoint is working

---

## Performance Optimization

### Frontend
- Images optimized with Next.js Image component
- Code splitting with dynamic imports
- CSS minified with Tailwind
- API routes have caching headers

### Backend
- CoinGecko prices cached for 5 minutes
- In-memory transaction history (upgrade to DB for production)
- No database queries on swap path

### Smart Contracts
- Optimized Solidity with compiler settings
- Minimal storage writes
- Efficient math operations

---

## Security Checklist

- [ ] Private key stored in `.env.local` (never committed)
- [ ] Contract reviewed by security audit
- [ ] MetaMask approval flows tested
- [ ] Slippage protection enabled on swaps
- [ ] Reentrancy guard active
- [ ] Input validation on all functions
- [ ] Rate limiting on API routes
- [ ] No sensitive data in frontend

---

## Monitoring

### Transaction Monitoring
- Check deployment addresses on Etherscan
- Monitor gas usage and costs
- Track swap fees collected

### Uptime Monitoring
- Use Uptime Robot or similar for `/api/health`
- Monitor RPC endpoint availability
- Set up alerts for failures

### Error Tracking
- Enable Sentry or similar
- Monitor API error rates
- Track contract call failures

---

## Rollback Procedures

If issues arise after deployment:

1. **Revert Frontend:** Redeploy previous version on Vercel
2. **Pause Contract:** Call `pause()` if implemented (update contract to add this)
3. **Migrate Liquidity:** Manual LP withdrawal and redeposit if needed

---

## Cost Estimation

### Testnet
- Deployment: ~0.05-0.1 SepoliaETH
- Test transactions: ~0.001-0.01 SepoliaETH each

### Mainnet (Estimates)
- Deployment: ~0.1-0.3 ETH (~$200-600)
- Per swap: ~0.005-0.02 ETH (~$10-40)
- Liquidity add: ~0.01-0.03 ETH (~$20-60)

**Always check current gas prices on [gasprice.io](https://gasprice.io)**

---

## Next Steps After Deployment

1. Add real liquidity to pools
2. Implement governance token
3. Transition to mainnet
4. Conduct security audit
5. Add advanced features (limits orders, flash swaps)
6. Integrate analytics dashboard
