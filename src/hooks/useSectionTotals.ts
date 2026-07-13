import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { SectionTotal } from '../types';

export function useSectionTotals() {
  const [totals, setTotals] = useState<SectionTotal[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('section_totals').select('*');
    if (!error) setTotals(data as SectionTotal[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { totals, loading, refresh };
}
