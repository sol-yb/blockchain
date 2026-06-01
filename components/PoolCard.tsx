'use client';

interface PoolCardProps {
  pool: {
    title: string;
    tvl: string;
    apy: string;
    liquidity: string;
  };
}

export default function PoolCard({ pool }: PoolCardProps) {
  return (
    <div className="glass-card p-6 transition hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{pool.title}</h3>
          <p className="text-sm text-slate-400">Liquidity pool overview</p>
        </div>
        <span className="rounded-2xl bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Live</span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">TVL</p>
          <p className="mt-2 text-lg font-semibold text-white">{pool.tvl}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">APY</p>
          <p className="mt-2 text-lg font-semibold text-white">{pool.apy}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Liquidity</p>
          <p className="mt-2 text-lg font-semibold text-white">{pool.liquidity}</p>
        </div>
      </div>
    </div>
  );
}
