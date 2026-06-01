import PoolCard from '@/components/PoolCard';

const pools = [
  { title: 'AURA / NEB', tvl: '$480K', apy: '8.4%', liquidity: '620K' },
  { title: 'ETH / AURA', tvl: '$330K', apy: '6.2%', liquidity: '470K' }
];

export default function PoolsPage() {
  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold text-white">Pools</h1>
          <p className="mt-2 text-slate-300">Check active liquidity pools, view TVL, and manage your LP positions.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {pools.map((pool) => (
            <PoolCard key={pool.title} pool={pool} />
          ))}
        </div>
      </div>
    </main>
  );
}
