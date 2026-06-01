'use client';

import { useEffect, useState } from 'react';
import { fetchTokenPrices } from '@/lib/coingecko';

interface PriceState {
  prices: Record<string, number>;
  isLoading: boolean;
}

export default function usePrice(): PriceState {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetchTokenPrices(['ethereum', 'aave', 'chainlink']);
      setPrices({ AURA: response['aave'] || 0, NEB: response['chainlink'] || 0 });
    } catch (error) {
      console.error('price fetch', error);
      setPrices({ AURA: 0, NEB: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return { prices, isLoading };
}
