'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useWallet from '@/hooks/useWallet';
import usePrice from '@/hooks/usePrice';
import useSwap from '@/hooks/useSwap';

const tokens = [
  { symbol: 'AURA', address: '0x0000000000000000000000000000000000000001' },
  { symbol: 'NEB', address: '0x0000000000000000000000000000000000000002' }
];

export default function SwapCard() {
  const { address, connectWallet } = useWallet();
  const { prices, isLoading } = usePrice();
  const { executeSwap, isLoading: isSwapping, error: swapError } = useSwap();
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState('0.00');
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Fetch quote from backend
  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || isNaN(Number(amount))) {
        setQuote('0.00');
        return;
      }

      setIsLoadingQuote(true);
      try {
        const response = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokenIn: fromToken.symbol,
            tokenOut: toToken.symbol,
            amountIn: amount
          })
        });

        if (!response.ok) throw new Error('Quote fetch failed');
        const data = await response.json();
        setQuote(data.amountOut || '0.00');
      } catch (error) {
        console.error('Quote error:', error);
        // Fallback to simple calculation
        const fromPrice = prices[fromToken.symbol] || 0;
        const toPrice = prices[toToken.symbol] || 1;
        const fallbackQuote = ((Number(amount) * fromPrice) / toPrice).toFixed(4);
        setQuote(fallbackQuote);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    const timer = setTimeout(fetchQuote, 300);
    return () => clearTimeout(timer);
  }, [amount, fromToken, toToken, prices]);

  const handleSwap = async () => {
    if (!address) {
      await connectWallet();
      return;
    }

    setLocalError(null);
    setTxHash(null);

    try {
      // In a real scenario, you'd use the contract's pair key
      // For demo, we use a mock pair key
      const pairKey = '0x' + '0'.repeat(64);

      const hash = await executeSwap({
        pairKey,
        amountIn: amount,
        swapAToB: true,
        minAmountOut: (Number(quote) * 0.95).toString() // 5% slippage
      });

      if (hash) {
        setTxHash(hash);
        setAmount('');
        setQuote('0.00');

        // Record transaction
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            type: 'swap',
            tokenIn: fromToken.symbol,
            tokenOut: toToken.symbol,
            amountIn: amount,
            amountOut: quote,
            hash
          })
        }).catch(console.error);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Swap failed';
      setLocalError(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card mx-auto max-w-3xl p-6 shadow-glow"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Token Swap</h2>
          <p className="mt-1 text-slate-400">Swap tokens on the Sepolia testnet with your connected wallet.</p>
        </div>
      </div>

      {txHash && (
        <div className="mb-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-300">✓ Transaction submitted!</p>
          <p className="mt-1 break-all text-xs text-emerald-200">{txHash}</p>
        </div>
      )}

      {(swapError || localError) && (
        <div className="mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-300">✗ {swapError || localError}</p>
        </div>
      )}

      <div className="space-y-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <label className="mb-3 block text-sm font-medium text-slate-300">From</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <select
              value={fromToken.symbol}
              onChange={(event) => setFromToken(tokens.find((token) => token.symbol === event.target.value) ?? tokens[0])}
              className="w-full rounded-2xl border border-white/10 bg-night/90 px-4 py-3 text-slate-100 outline-none"
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
            <input
              type="text"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="w-full rounded-2xl border border-white/10 bg-night/90 px-4 py-3 text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <label className="mb-3 block text-sm font-medium text-slate-300">To</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <select
              value={toToken.symbol}
              onChange={(event) => setToToken(tokens.find((token) => token.symbol === event.target.value) ?? tokens[1])}
              className="w-full rounded-2xl border border-white/10 bg-night/90 px-4 py-3 text-slate-100 outline-none"
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
            <div className="w-full rounded-2xl border border-white/10 bg-night/90 px-4 py-3 text-slate-100">
              {isLoadingQuote ? '...' : quote}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>Exchange Rate</span>
            <span className="text-white">{(Number(quote) / Number(amount || 1)).toFixed(6)}</span>
          </div>
          <div className="mt-2 flex justify-between text-slate-400">
            <span>Slippage</span>
            <span className="text-white">0.5%</span>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={isSwapping || !amount || !address}
          className={`w-full rounded-full px-6 py-4 text-base font-semibold transition ${
            isSwapping || !amount || !address
              ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
              : 'bg-neon text-slate-950 hover:bg-violet-500'
          }`}
        >
          {isSwapping ? 'Swapping...' : address ? 'Swap Now' : 'Connect Wallet to Swap'}
        </button>
      </div>
    </motion.div>
  );
}
