import { useCallback, useEffect, useState } from 'react';
import { fetchLiveRates, type LiveRates } from '../lib/rates';

export function useLiveRates() {
  const [rates, setRates] = useState<LiveRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetchLiveRates();
      setRates(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر جلب الأسعار الحالية');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rates, loading, error, refresh };
}
