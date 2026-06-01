import PortfolioSummary from '@/components/PortfolioSummary';

export default function PortfolioPage() {
  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold text-white">Portfolio</h1>
          <p className="mt-2 text-slate-300">Track your token balances, liquidity positions, and recent transaction history.</p>
        </div>
        <PortfolioSummary />
      </div>
    </main>
  );
}
