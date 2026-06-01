import { NextRequest, NextResponse } from 'next/server';

interface TransactionRecord {
  id: string;
  type: 'swap' | 'liquidity-add' | 'liquidity-remove';
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  hash: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
}

// In-memory storage (use a database in production)
const transactions: Map<string, TransactionRecord[]> = new Map();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter required' },
      { status: 400 }
    );
  }

  const userTransactions = transactions.get(address.toLowerCase()) || [];
  return NextResponse.json({ transactions: userTransactions });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, type, tokenIn, tokenOut, amountIn, amountOut, hash } = body;

    if (!address || !type || !hash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction: TransactionRecord = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      tokenIn,
      tokenOut,
      amountIn,
      amountOut,
      hash,
      timestamp: Date.now(),
      status: 'pending'
    };

    const key = address.toLowerCase();
    const userTransactions = transactions.get(key) || [];
    userTransactions.unshift(transaction);
    transactions.set(key, userTransactions.slice(0, 50)); // Keep last 50

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Transaction record error:', error);
    return NextResponse.json(
      { error: 'Failed to record transaction' },
      { status: 500 }
    );
  }
}
