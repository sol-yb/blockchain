'use client';

import { useEffect, useState } from 'react';
import useWallet from '@/hooks/useWallet';

export default function WalletButton() {
  const { address, connectWallet, disconnectWallet, network } = useWallet();
  const [shortAddress, setShortAddress] = useState('');

  useEffect(() => {
    if (address) {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [address]);

  return (
    <div className="flex items-center gap-3">
      {address ? (
        <>
          <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200">{shortAddress}</span>
          <button
            onClick={disconnectWallet}
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-500"
        >
          Connect Wallet
        </button>
      )}
      {network ? <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400 sm:inline-flex">{network}</span> : null}
    </div>
  );
}
