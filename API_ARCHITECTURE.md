# API Architecture

## Overview
The DEX MVP is a full-stack application with a hybrid frontend/backend and on-chain smart contracts.

## System Architecture

```
┌─────────────────────┐
│   Frontend (Next.js)│
│  React Components   │
│   Hooks & UI        │
└──────────┬──────────┘
           │
    ┌──────▼──────────────────────────┐
    │   Backend API Routes (Next.js)   │
    │ ├─ /api/prices (CoinGecko proxy) │
    │ ├─ /api/tokens (token list)      │
    │ ├─ /api/quote (swap pricing)     │
    │ └─ /api/transactions (tracking)  │
    └──────┬──────────────────────────┘
           │
    ┌──────▼───────────────────────────┐
    │ Smart Contracts (Solidity)        │
    │ ├─ UniswapClone Router            │
    │ ├─ TestToken (ERC20)              │
    │ └─ LPToken (per-pair ERC20)       │
    └──────┬───────────────────────────┘
           │
    ┌──────▼────────────────────────┐
    │  External Services            │
    │ ├─ CoinGecko API (prices)     │
    │ ├─ MetaMask (wallet)          │
    │ └─ Sepolia RPC (blockchain)   │
    └───────────────────────────────┘
```

## Frontend Components

### Pages
- **`app/page.tsx`** — Landing page with hero, stats, and wallet widget
- **`app/swap/page.tsx`** — Swap interface with real-time quotes
- **`app/pools/page.tsx`** — Liquidity pool overview
- **`app/portfolio/page.tsx`** — User portfolio and transaction history

### Components
- **`Navbar.tsx`** — Navigation and wallet connect button
- **`WalletButton.tsx`** — Wallet connection UI
- **`WalletWidget.tsx`** — Wallet status and balance display
- **`SwapCard.tsx`** — Swap form with quote API integration
- **`PoolCard.tsx`** — Liquidity pool info card
- **`PortfolioSummary.tsx`** — Portfolio overview with holdings

### Hooks
- **`useWallet()`** — MetaMask connection, account detection, network switching
- **`usePrice()`** — Token price fetching with caching
- **`useSwap()`** — Execute on-chain swaps via ethers.js
- **`useLiquidity()`** — Add/remove liquidity operations

## Backend API Routes

### GET `/api/prices`
Fetch cached token prices from CoinGecko.

**Query Parameters:**
- `ids` — Comma-separated CoinGecko token IDs (default: `ethereum,aave,chainlink`)

**Response:**
```json
{
  "ethereum": { "usd": 2500 },
  "aave": { "usd": 150 },
  "chainlink": { "usd": 25 }
}
```

**Cache:** 5 minutes

---

### GET `/api/tokens`
Search available tokens.

**Query Parameters:**
- `q` — Search query (symbol or name)

**Response:**
```json
{
  "tokens": [
    {
      "symbol": "AURA",
      "name": "Aurora Token",
      "address": "0x...",
      "decimals": 18,
      "logoURI": "/tokens/aura.svg"
    }
  ]
}
```

---

### POST `/api/quote`
Generate swap quotes with price impact and slippage.

**Body:**
```json
{
  "tokenIn": "AURA",
  "tokenOut": "NEB",
  "amountIn": "100"
}
```

**Response:**
```json
{
  "amountOut": "95.24",
  "priceImpact": 0.5,
  "slippage": 0.3
}
```

---

### GET/POST `/api/transactions`
Track user transactions.

**GET Parameters:**
- `address` — User's wallet address

**GET Response:**
```json
{
  "transactions": [
    {
      "id": "1234567890",
      "type": "swap",
      "tokenIn": "AURA",
      "tokenOut": "NEB",
      "amountIn": "100",
      "amountOut": "95.24",
      "hash": "0x...",
      "timestamp": 1715000000000,
      "status": "success"
    }
  ]
}
```

**POST Body:**
```json
{
  "address": "0x...",
  "type": "swap",
  "tokenIn": "AURA",
  "tokenOut": "NEB",
  "amountIn": "100",
  "amountOut": "95.24",
  "hash": "0x..."
}
```

---

## Smart Contracts

### UniswapClone (Multi-Pair Router)

**State:**
- `pairs: mapping(bytes32 => Pair)` — All token pairs
- `pairExists: mapping(bytes32 => bool)` — Pair existence tracking
- `pairKeys: bytes32[]` — All pair identifiers

**Key Functions:**

```solidity
// Create a new token pair
function createPair(address tokenA, address tokenB) external returns (bytes32)

// Add liquidity to a pair
function addLiquidity(bytes32 pairKey, uint256 amountA, uint256 amountB) external returns (uint256 liquidity)

// Remove liquidity from a pair
function removeLiquidity(bytes32 pairKey, uint256 liquidity) external returns (uint256 amountA, uint256 amountB)

// Swap tokens in a pair
function swap(bytes32 pairKey, uint256 amountIn, uint256 minAmountOut, bool swapAToB) external returns (uint256 amountOut)

// Get pair reserves
function getReserves(bytes32 pairKey) external view returns (uint256, uint256)

// Quote swap output
function quote(uint256 amountA, uint256 reserveA_, uint256 reserveB_) public pure returns (uint256)
```

**Events:**
- `PairCreated` — New pair created
- `LiquidityAdded` — Liquidity added
- `LiquidityRemoved` — Liquidity removed
- `TokenSwapped` — Swap executed

**Fee:** 0.3% on swaps

**Reentrancy:** Protected with `ReentrancyGuard`

---

### LPToken (Per-Pair LP Token)

Standard ERC20 token deployed for each liquidity pair. Minted when liquidity is added, burned when removed.

**Functions:**
- `mint(address to, uint256 amount)` — Owner-only minting
- `burn(address from, uint256 amount)` — Owner-only burning

---

### TestToken (ERC20)

Mintable ERC20 token for testing and demos.

---

## Data Flow Examples

### Swap Flow
1. User enters swap amount in `SwapCard`
2. Frontend calls `POST /api/quote` with tokenIn, tokenOut, amountIn
3. Backend calculates output with prices from CoinGecko
4. Frontend displays quote to user
5. User clicks "Swap Now"
6. Frontend calls `swap()` on smart contract via ethers.js
7. Contract executes swap and emits `TokenSwapped` event
8. Frontend records transaction via `POST /api/transactions`

### Liquidity Flow
1. User navigates to Pools page
2. Frontend displays pool overview from `PoolCard` component
3. User adds liquidity via `useLiquidity` hook
4. Hook calls `addLiquidity()` on contract via ethers.js
5. Contract mints LP tokens to user
6. Frontend tracks LP balance

---

## Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | String | Deployed UniswapClone router address on Sepolia |
| `NEXT_PUBLIC_SEPOLIA_RPC` | URL | Fallback RPC for read-only contract calls |
| `SEPOLIA_RPC_URL` | URL | RPC for contract deployment |
| `PRIVATE_KEY` | String | Deployer account private key (keep secret) |
| `ETHERSCAN_API_KEY` | String | For contract verification on Etherscan |

---

## Performance & Caching

- **Price Cache:** `/api/prices` caches for 5 minutes
- **Token List:** Served statically from backend
- **Quotes:** Calculated on-demand with fresh prices
- **Transactions:** Stored in-memory (upgrade to database for production)

---

## Security Considerations

- ✅ Reentrancy protection on swap and liquidity functions
- ✅ Input validation on all contract functions
- ⚠️ Frontend validation on quote slippage
- ⚠️ MetaMask integration (user-controlled approvals)
- ⚠️ No private key storage on frontend
- ⚠️ Requires full audit before mainnet deployment
