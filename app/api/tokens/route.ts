import { NextRequest, NextResponse } from 'next/server';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
}

const tokenList: Token[] = [
  {
    symbol: 'AURA',
    name: 'Aurora Token',
    address: '0x0000000000000000000000000000000000000001',
    decimals: 18,
    logoURI: '/tokens/aura.svg'
  },
  {
    symbol: 'NEB',
    name: 'Nebula Token',
    address: '0x0000000000000000000000000000000000000002',
    decimals: 18,
    logoURI: '/tokens/neb.svg'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0xfFf9976782d46CC05630D4aE5e7261855Ac06e5E',
    decimals: 18,
    logoURI: '/tokens/eth.svg'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
    decimals: 6,
    logoURI: '/tokens/usdc.svg'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = tokenList;
  if (query) {
    filtered = tokenList.filter(
      (t) =>
        t.symbol.toLowerCase().includes(query) ||
        t.name.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ tokens: filtered });
}
