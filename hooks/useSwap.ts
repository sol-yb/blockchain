'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { getRpcProvider } from '@/lib/provider';
import { UNISWAP_CLONE_ABI, ERC20_ABI } from '@/lib/abi';

interface SwapParams {
  pairKey: string;
  amountIn: string;
  swapAToB: boolean;
  minAmountOut?: string;
}

interface SwapState {
  isLoading: boolean;
  error: string | null;
  executeSwap: (params: SwapParams) => Promise<string | null>;
}

export default function useSwap(): SwapState {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeSwap = async (params: SwapParams): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask is required');
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }

      const router = new ethers.Contract(contractAddress, UNISWAP_CLONE_ABI, signer);
      const amountIn = ethers.parseUnits(params.amountIn, 18);
      const minAmountOut = params.minAmountOut ? ethers.parseUnits(params.minAmountOut, 18) : 0;

      const tx = await router.swap(params.pairKey, amountIn, minAmountOut, params.swapAToB);
      const receipt = await tx.wait();

      return receipt?.hash || tx.hash;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Swap failed';
      setError(message);
      console.error('Swap error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, executeSwap };
}
