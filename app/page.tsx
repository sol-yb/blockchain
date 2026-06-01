import Link from 'next/link';
import { motion } from 'framer-motion';
import WalletWidget from '@/components/WalletWidget';

const stats = [
  { label: 'Total Volume', value: '$1.2M', change: '+12.5%' },
  { label: 'Active Pools', value: '9', change: '+2' },
  { label: 'Wallets Connected', value: '24K', change: '+8.2%' }
];

const features = [
  {
    title: 'Multi-Pair AMM',
    description: 'Support for unlimited token pairs with dynamic liquidity pools and LP tokenization.'
  },
  {
    title: 'Real-Time Quotes',
    description: 'Instant swap quotes with price impact calculation from our backend API.'
  },
  {
    title: 'MetaMask Integration',
    description: 'Seamless wallet connection, network switching, and transaction signing.'
  },
  {
    title: 'Backend Proxy',
    description: 'CoinGecko price feeds with 5-minute caching, token search, and transaction tracking.'
  },
  {
    title: 'Reentrancy Protection',
    description: 'Smart contracts secured against reentrancy attacks with OpenZeppelin guards.'
  },
  {
    title: 'Sepolia Ready',
    description: 'Fully deployable to Ethereum Sepolia testnet with one command.'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-sm font-semibold text-purple-300">
              ✨ Production-ready DEX infrastructure
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Neon DEX — Modern DeFi for Sepolia
            </h1>
            <p className="text-slate-300 sm:text-lg">
              A full-stack decentralized exchange MVP with multi-pair liquidity pools, real-time pricing, backend API proxy, and MetaMask wallet integration.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/swap" className="rounded-full bg-neon px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500">
                Launch Swap
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 transition hover:bg-white/10">
                View on GitHub
              </a>
            </div>
          </div>
          <div className="glass-card relative overflow-hidden p-8 shadow-glow backdrop-blur-xl lg:w-[420px]">
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-violet-500/20 to-transparent" />
            <WalletWidget />
          </div>
        </div>

        {/* Stats Section */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-xs text-emerald-400">{stat.change}</p>
            </motion.div>
          ))}
        </section>

        {/* Features Grid */}
        <section className="mt-16 space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white">Built for production</h2>
            <p className="mt-2 text-slate-400">Complete infrastructure with smart contracts, backend APIs, and modern React components.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 transition hover:-translate-y-1 hover:shadow-glow"
              >
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white">Frontend</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>• Next.js 14 (App Router)</li>
              <li>• React 18 + TypeScript</li>
              <li>• TailwindCSS + Framer Motion</li>
              <li>• ethers.js v6</li>
            </ul>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white">Backend</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>• Next.js API Routes</li>
              <li>• CoinGecko proxy (cached)</li>
              <li>• Token search & list</li>
              <li>• Transaction tracking</li>
            </ul>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white">Blockchain</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>• Solidity ^0.8.20</li>
              <li>• Hardhat + Chai</li>
              <li>• OpenZeppelin</li>
              <li>• Sepolia Testnet</li>
            </ul>
          </div>
        </section>

        {/* API Overview */}
        <section className="mt-16 glass-card p-8">
          <h2 className="text-2xl font-semibold text-white">Backend API</h2>
          <p className="mt-2 text-slate-400">RESTful endpoints for prices, tokens, quotes, and transaction tracking.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="font-mono text-sm text-violet-300">GET /api/prices</p>
              <p className="mt-1 text-xs text-slate-400">Token prices with 5min cache</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="font-mono text-sm text-violet-300">GET /api/tokens</p>
              <p className="mt-1 text-xs text-slate-400">Search and list tokens</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="font-mono text-sm text-violet-300">POST /api/quote</p>
              <p className="mt-1 text-xs text-slate-400">Swap quotes with price impact</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="font-mono text-sm text-violet-300">GET/POST /api/transactions</p>
              <p className="mt-1 text-xs text-slate-400">Track user activity</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">Ready to deploy?</h2>
          <p className="mt-2 text-slate-400">Follow the README for local development, testing, and Sepolia deployment.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/swap" className="rounded-full bg-neon px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500">
              Start Swapping
            </Link>
            <Link href="/pools" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 transition hover:bg-white/10">
              View Pools
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
