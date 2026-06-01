'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  address: string | null;
  balance: string | null;
  network: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const defaultState: WalletState = {
  address: null,
  balance: null,
  network: null,
  connectWallet: async () => {},
  disconnectWallet: () => {}
};

export default function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('MetaMask is required to connect a wallet.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      const chain = await provider.getNetwork();
      const ethBalance = await provider.getBalance(walletAddress);

      setAddress(walletAddress);
      setNetwork(chain.name);
      setBalance(ethers.formatEther(ethBalance).slice(0, 8));
      localStorage.setItem('dexWalletConnected', 'true');
    } catch (error) {
      console.error('connectWallet', error);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
    setNetwork(null);
    localStorage.removeItem('dexWalletConnected');
  };

  useEffect(() => {
    const initialize = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum && localStorage.getItem('dexWalletConnected')) {
        await connectWallet();
      }
    };

    initialize();

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', initialize);
      (window as any).ethereum.on('chainChanged', initialize);
    }

    return () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', initialize);
        (window as any).ethereum.removeListener('chainChanged', initialize);
      }
    };
  }, []);

  return { address, balance, network, connectWallet, disconnectWallet };
}
