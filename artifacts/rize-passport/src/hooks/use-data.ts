import { useState, useEffect } from 'react';

export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(`Failed to load ${url}`, e);
        setError(e);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

export function formatINR(val: number) {
  if (val >= 100000) {
    return `Rs ${(val / 100000).toFixed(1)}L`;
  }
  return `Rs ${val.toLocaleString('en-IN')}`;
}

export function formatPercent(val: number) {
  return `${(val * 100).toFixed(1)}%`;
}
