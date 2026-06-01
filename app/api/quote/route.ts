import { NextRequest, NextResponse } from 'next/server';

interface QuoteRequest {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
}

interface QuoteResponse {
  amountOut: string;
  priceImpact: number;
  slippage: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json();
    const { tokenIn, tokenOut, amountIn } = body;

    if (!tokenIn || !tokenOut || !amountIn) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch token prices from CoinGecko via our prices endpoint
    const priceRes = await fetch(
      `${request.nextUrl.origin}/api/prices?ids=ethereum,aave,chainlink`,
      { cache: 'no-store' }
    );

    if (!priceRes.ok) {
      throw new Error('Failed to fetch prices');
    }

    const prices = await priceRes.json();
    const tokenInPrice = prices['aave']?.usd || 1;
    const tokenOutPrice = prices['chainlink']?.usd || 1;

    // Simplified quote calculation (0.3% fee)
    const amountInNumber = parseFloat(amountIn);
    const feePercentage = 0.003;
    const amountAfterFee = amountInNumber * (1 - feePercentage);
    const amountOut = (amountAfterFee * tokenInPrice) / tokenOutPrice;

    const quote: QuoteResponse = {
      amountOut: amountOut.toString(),
      priceImpact: 0.5,
      slippage: 0.3
    };

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Quote error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    );
  }
}
