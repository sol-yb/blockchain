import { NextRequest, NextResponse } from 'next/server';

interface CoinGeckoPrice {
  [key: string]: { usd: number };
}

const CACHE_DURATION = 60 * 5; // 5 minutes
let priceCache: { data: CoinGeckoPrice; timestamp: number } | null = null;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids')?.split(',') || ['ethereum', 'aave', 'chainlink'];

  // Check cache
  const now = Date.now();
  if (priceCache && now - priceCache.timestamp < CACHE_DURATION * 1000) {
    return NextResponse.json(priceCache.data);
  }

  try {
    const idString = ids.join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${idString}&vs_currencies=usd`
    );

    if (!response.ok) {
      throw new Error('CoinGecko API error');
    }

    const data: CoinGeckoPrice = await response.json();
    priceCache = { data, timestamp: now };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Price fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
