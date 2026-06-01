# Development Guide

## Quick Start

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Useful Commands

### Development
```bash
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Run production build
npm run lint                   # Run ESLint
npm run typecheck              # Run TypeScript check
```

### Testing
```bash
npm run test                   # Run Hardhat + Jest tests
npm run coverage               # Generate coverage report
npx hardhat test              # Run only contract tests
npm run test -- __tests__      # Run only component tests
```

### Blockchain
```bash
npx hardhat node              # Start local Hardhat node
npm run deploy:sepolia        # Deploy to Sepolia testnet
npx hardhat compile           # Compile contracts
npx hardhat clean             # Clean artifacts
```

---

## Project Structure

```
neon-dex/
├── app/                      # Next.js App Router
│   ├── api/                  # Backend API routes
│   │   ├── prices/route.ts   # CoinGecko proxy
│   │   ├── tokens/route.ts   # Token list
│   │   ├── quote/route.ts    # Swap quotes
│   │   └── transactions/route.ts
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── swap/
│   ├── pools/
│   └── portfolio/
├── components/               # React components
├── hooks/                    # Custom hooks
├── lib/                      # Utilities
├── contracts/                # Solidity contracts
├── scripts/                  # Deployment scripts
├── test/                     # Hardhat tests
├── __tests__/                # Jest component tests
└── public/                   # Static assets
```

---

## Environment Variables

### Required for Sepolia Deployment
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_ID
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=YOUR_KEY
```

### Required for Frontend
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_ID
```

---

## Frontend Development

### Adding a New Page
1. Create folder in `app/`
2. Create `page.tsx` inside
3. Add route to Navbar

### Adding a New Component
1. Create `.tsx` file in `components/`
2. Export default function
3. Use `'use client'` for interactive components

### Adding a New Hook
1. Create `.ts` file in `hooks/`
2. Export default function
3. Use in components with `const { ... } = useYourHook()`

### Styling
- Use TailwindCSS classes
- Custom colors defined in `tailwind.config.js`:
  - `bg-night` — dark background
  - `bg-neon` — purple accent button
  - `glass-card` — glassmorphism container

---

## Smart Contract Development

### Adding a New Function
1. Edit `contracts/UniswapClone.sol`
2. Update ABI in `lib/abi.ts`
3. Create/update hook in `hooks/`
4. Add tests in `test/UniswapClone.test.ts`
5. Test locally: `npm run test`

### Local Testing
```bash
npx hardhat test
```

### Sepolia Testing
1. Deploy contract: `npm run deploy:sepolia`
2. Update `NEXT_PUBLIC_CONTRACT_ADDRESS`
3. Test via frontend at `/swap`

---

## Backend API Development

### Adding a New Endpoint
1. Create `app/api/yourroute/route.ts`
2. Export `GET` or `POST` function
3. Return `NextResponse.json(data)`

### Example API Route
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Your logic
    return NextResponse.json({ data: 'value' });
  } catch (error) {
    return NextResponse.json(
      { error: 'message' },
      { status: 500 }
    );
  }
}
```

---

## Debugging

### Frontend
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Use React DevTools extension

### Smart Contracts
1. Use `console.log()` in contracts during testing
2. Check Hardhat output for errors
3. Use Etherscan to inspect transactions

### MetaMask Issues
1. Clear extension cache: Chrome Settings → Extensions → Details
2. Reset account: MetaMask → Settings → Advanced → Reset Account
3. Check network is correct in MetaMask

---

## Common Tasks

### Swap Testing Flow
1. Connect wallet in UI
2. Select token pair
3. Enter amount
4. Click "Swap Now"
5. Approve in MetaMask
6. Wait for confirmation
7. Check transaction on Etherscan

### Adding Liquidity
1. Go to `/pools`
2. Click pool (or navigate to liquidity page)
3. Enter amounts for both tokens
4. Approve both tokens
5. Click "Add Liquidity"
6. Wait for confirmation

### Checking Balances
1. Connected wallet displays balance in navbar
2. Portfolio page shows token holdings
3. Etherscan shows on-chain state

---

## Performance Tips

### Frontend
- Use `React.memo()` for static components
- Lazy load heavy components with `dynamic()`
- Use `useCallback()` for event handlers
- Minimize re-renders

### API Routes
- Cache external API calls (prices are cached 5min)
- Use `next/cache` for revalidation
- Compress responses

### Smart Contracts
- Minimize storage writes
- Use events instead of storing history
- Batch operations when possible

---

## Testing Best Practices

### Unit Tests
- Test one function at a time
- Mock external dependencies
- Cover edge cases

### Integration Tests
- Test component interactions
- Mock wallet connections
- Test API calls

### End-to-End Tests
- Test full swap flow
- Test contract deployment
- Test frontend + backend + contract

---

## Git Workflow

```bash
git clone <repo>
cd neon-dex
npm install
npm run dev

# Make changes
git add .
git commit -m "feat: description"
git push origin main
```

---

## Deployment Checklist

- [ ] All tests passing (`npm run test`)
- [ ] TypeScript strict mode (`npm run typecheck`)
- [ ] ESLint clean (`npm run lint`)
- [ ] Environment variables set
- [ ] Contract deployed to Sepolia
- [ ] Frontend points to correct contract
- [ ] MetaMask tested with real transactions
- [ ] API endpoints tested

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [ethers.js Docs](https://docs.ethers.org/)
- [Solidity Docs](https://docs.soliditylang.org/)
- [Hardhat Docs](https://hardhat.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

### Tools
- [Etherscan](https://sepolia.etherscan.io) — View contracts & transactions
- [MetaMask](https://metamask.io) — Wallet
- [Infura](https://infura.io) — RPC Provider
- [OpenZeppelin](https://docs.openzeppelin.com/) — Smart contract libraries

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Node Modules Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### Contract Compilation Error
```bash
npx hardhat clean
npm run test
```

### MetaMask RPC Error
- Check RPC URL is correct
- Verify Infura API key
- Try different RPC provider

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feat/new-feature`
3. Commit changes: `git commit -m "feat: description"`
4. Push to branch: `git push origin feat/new-feature`
5. Open Pull Request

---

## Support

- Check GitHub Issues
- Review API_ARCHITECTURE.md
- Review DEPLOYMENT.md
- Check error logs in console
