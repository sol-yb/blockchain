# Web3 DEX MVP

A modern decentralized exchange MVP inspired by Uniswap, built with Next.js, TypeScript, TailwindCSS, ethers.js, Hardhat and Solidity.

## Features
- Wallet connection via MetaMask
- Wallet balance and token balances
- Swap interface with real-time token pricing quotes
- Multi-pair liquidity pool system with dynamic pair creation
- Liquidity provider shares with ERC20 LP tokens
- Transaction history and tracking API
- CoinGecko price feeds with backend caching
- Dark mode with neon glassmorphism UI
- Ethereum Sepolia testnet deployment ready
- Backend API proxy for quotes, tokens, prices, and transactions

## Architecture
- `app/` — Next.js app routes for `Home`, `Swap`, `Pools`, `Portfolio`
- `app/api/` — Backend proxy routes for prices, tokens, quotes, and transaction tracking
- `components/` — reusable UI and wallet components
- `hooks/` — wallet, price, swap, and liquidity hooks
- `lib/` — provider, ABI, and API helpers
- `contracts/` — Solidity ERC20 token and multi-pair DEX contract
- `scripts/` — deployment scripts
- `test/` — Hardhat contract tests

## Backend API Endpoints

### `/api/prices`
- **GET** — Fetch cached token prices from CoinGecko with 5-minute TTL
- **Query**: `ids=ethereum,aave,chainlink`

### `/api/tokens`
- **GET** — Search token list by symbol or name
- **Query**: `q=AURA`

### `/api/quote`
- **POST** — Generate swap quotes with price impact and slippage
- **Body**: `{ tokenIn, tokenOut, amountIn }`

### `/api/transactions`
- **GET** — Fetch user transaction history
- **POST** — Record swap or liquidity transactions
- **Query**: `address=0x...`

## Getting Started

1. Install dependencies
```bash
npm install
```

2. Copy environment variables
```bash
cp .env.example .env
```

3. Fill `.env` with:
   - Sepolia RPC URL (from Infura or Alchemy)
   - Private key of deployer wallet
   - Etherscan API key (for contract verification)
   - Deployed contract address (after deployment)

4. Start development server
```bash
npm run dev
```

5. Run contract tests
```bash
npm run test
```

## Smart Contract Deployment

### Local Testing
```bash
npm run test
```

### Sepolia Testnet
```bash
npm run deploy:sepolia
```

This will:
- Deploy TestToken (AURA)
- Deploy TestToken (NEB)
- Deploy TestToken (CRYS)
- Deploy UniswapClone router
- Create trading pairs: AURA/NEB, AURA/CRYS, NEB/CRYS
- Save deployment info to `deployments.json`

## Frontend Integration

After deploying to Sepolia:

1. Copy the UniswapClone contract address from `deployments.json`
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   ```
3. Frontend will auto-connect and enable on-chain swaps and liquidity operations

## Smart Contract Features

### `UniswapClone.sol`
- Multi-pair constant product AMM
- Dynamic pair creation with `createPair(tokenA, tokenB)`
- Liquidity add/remove with ERC20 LP shares
- Token swap with 0.3% fee
- Reentrancy protection
- Event logging for all operations

### `TestToken.sol`
- Standard ERC20 token
- Mintable for demo purposes

## Testing

### Unit Tests (Hardhat)
```bash
npm run test
```

Tests cover:
- Pair creation
- Liquidity add/remove
- Swaps with fee calculation
- Quote calculations
- Multi-pair operations

### Component Tests (Jest)
```bash
npm run test -- __tests__
```

## Deployment

### To Vercel (Frontend)
```bash
vercel deploy
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_SEPOLIA_RPC`

### Contract Verification
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed DEX router address |
| `NEXT_PUBLIC_SEPOLIA_RPC` | Fallback RPC for read-only calls |
| `SEPOLIA_RPC_URL` | Deployment RPC endpoint |
| `PRIVATE_KEY` | Deployer wallet private key |
| `ETHERSCAN_API_KEY` | For contract verification |

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS + Framer Motion
- ethers.js v6

### Backend
- Next.js API Routes
- CoinGecko API proxy
- In-memory transaction tracking

### Blockchain
- Solidity ^0.8.20
- Hardhat
- OpenZeppelin contracts
- Chai + Hardhat testing

## Notes

- The contract uses a constant product AMM (x*y=k) formula
- 0.3% swap fee is applied
- All numbers use 18 decimal places for consistency
- LP tokens are deployed per pair as separate ERC20 contracts
- Real production contracts require auditing

## Future Enhancements

- [ ] Persistent transaction database (MongoDB/PostgreSQL)
- [ ] Advanced order types (limit orders, DCA)
- [ ] Flash swaps
- [ ] Multi-signature wallet support
- [ ] Governance token
- [ ] Mainnet deployment
