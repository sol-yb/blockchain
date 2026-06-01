'use client';

import { useMemo } from 'react';
import useWallet from '@/hooks/useWallet';
import usePrice from '@/hooks/usePrice';

const holdings = [
  { symbol: 'AURA', amount: 1200 },
  { symbol: 'NEB', amount: 540 }
];

export default function PortfolioSummary() {
  const { address } = useWallet();
  const { prices, isLoading } = usePrice();

  const totalBalance = useMemo(() => {
    return holdings.reduce((sum, token) => sum + token.amount * (prices[token.symbol] || 0), 0);
  }, [prices]);

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Portfolio overview</h2>
          <p className="mt-1 text-slate-400">Monitor your holdings, LP share value, and recent activity.</p>
        </div>
        <div className="rounded-3xl bg-white/5 px-5 py-3 text-right text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Estimated value</p>
          <p className="mt-2 text-2xl font-semibold">${isLoading ? '...' : totalBalance.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {holdings.map((token) => (
          <div key={token.symbol} className="rounded-3xl border border-white/10 bg-night/80 p-5">
            <p className="text-sm text-slate-400">{token.symbol}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{token.amount}</p>
            <p className="mt-1 text-sm text-slate-500">${isLoading ? '...' : (token.amount * (prices[token.symbol] || 0)).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Recent activity</p>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>• Swapped 240 AURA for 130 NEB</li>
          <li>• Added liquidity to AURA/NEB pool</li>
          <li>• Claimed LP share rewards</li>
        </ul>
      </div>
      {address ? <p className="mt-6 text-sm text-slate-400">Connected wallet: {address}</p> : <p className="mt-6 text-sm text-slate-400">Connect wallet to see your on-chain balances.</p>}
    </div>
  );
}
