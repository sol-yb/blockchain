import { ethers } from 'ethers';

export function getRpcProvider() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }

  const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC;
  return new ethers.JsonRpcProvider(rpcUrl);
}
