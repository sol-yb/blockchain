import SwapCard from '@/components/SwapCard';

export default function SwapPage() {
  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold text-white">Swap</h1>
          <p className="mt-2 text-slate-300">Instantly swap token pairs using your connected MetaMask wallet.</p>
        </div>
        <SwapCard />
      </div>
    </main>
  );
}
