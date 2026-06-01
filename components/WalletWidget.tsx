'use client';

import { useEffect, useState } from 'react';
import useWallet from '@/hooks/useWallet';

export default function WalletWidget() {
  const { address, balance, network, connectWallet } = useWallet();
  const [shortAddress, setShortAddress] = useState('');

  useEffect(() => {
    if (address) {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [address]);

  return (
    <div className="relative z-10 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Wallet</p>
          <h2 className="text-2xl font-semibold text-white">{address ? shortAddress : 'Not connected'}</h2>
        </div>
        <div className="rounded-2xl bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">{network || 'No network'}</div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
        <p className="text-sm text-slate-400">Balance</p>
        <p className="mt-2 text-3xl font-semibold text-white">{balance ?? '...'}</p>
      </div>
      <button
        onClick={connectWallet}
        className="w-full rounded-full bg-neon px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500"
      >
        {address ? 'Refresh Wallet' : 'Connect MetaMask'}
      </button>
    </div>
  );
}
