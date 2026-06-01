'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { getRpcProvider } from '@/lib/provider';
import { UNISWAP_CLONE_ABI, ERC20_ABI } from '@/lib/abi';

interface LiquidityParams {
  pairKey: string;
  amountA: string;
  amountB: string;
  tokenAAddress: string;
  tokenBAddress: string;
}

interface RemoveLiquidityParams {
  pairKey: string;
  liquidity: string;
}

interface LiquidityState {
  isLoading: boolean;
  error: string | null;
  addLiquidity: (params: LiquidityParams) => Promise<string | null>;
  removeLiquidity: (params: RemoveLiquidityParams) => Promise<{ amountA: string; amountB: string } | null>;
}

export default function useLiquidity(): LiquidityState {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLiquidity = async (params: LiquidityParams): Promise<string | null> => {
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
      const tokenA = new ethers.Contract(params.tokenAAddress, ERC20_ABI, signer);
      const tokenB = new ethers.Contract(params.tokenBAddress, ERC20_ABI, signer);

      const amountA = ethers.parseUnits(params.amountA, 18);
      const amountB = ethers.parseUnits(params.amountB, 18);

      // Approve tokens
      const approveTxA = await tokenA.approve(contractAddress, amountA);
      await approveTxA.wait();

      const approveTxB = await tokenB.approve(contractAddress, amountB);
      await approveTxB.wait();

      // Add liquidity
      const tx = await router.addLiquidity(params.pairKey, amountA, amountB);
      const receipt = await tx.wait();

      return receipt?.hash || tx.hash;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Add liquidity failed';
      setError(message);
      console.error('Add liquidity error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const removeLiquidity = async (params: RemoveLiquidityParams) => {
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
      const liquidity = ethers.parseUnits(params.liquidity, 18);

      const tx = await router.removeLiquidity(params.pairKey, liquidity);
      const receipt = await tx.wait();

      return { amountA: '0', amountB: '0' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Remove liquidity failed';
      setError(message);
      console.error('Remove liquidity error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, addLiquidity, removeLiquidity };
}
