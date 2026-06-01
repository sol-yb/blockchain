export async function fetchTokenPrices(ids: string[]) {
  const query = new URLSearchParams({ ids: ids.join(',') });
  const response = await fetch(`/api/prices?${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch price data');
  }
  return response.json();
}

export async function fetchTokens(query?: string) {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  const response = await fetch(`/api/tokens?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tokens');
  }
  return response.json();
}
