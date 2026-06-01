import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Neon DEX | Web3 DeFi Dashboard',
  description: 'Modern Web3 DEX MVP with MetaMask wallet, token swap, liquidity pools, and portfolio analytics.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
