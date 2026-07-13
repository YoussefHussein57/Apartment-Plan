import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Payment } from '../types';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('payments').select('*').order('date', { ascending: false });
    if (error) setError(error.message);
    else setPayments(data as Payment[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPayment = useCallback(
    async (payment: { item_id: string; date: string; amount: number; method?: string; notes?: string }) => {
      if (!supabase) return;
      const { error } = await supabase.from('payments').insert(payment);
      if (error) setError(error.message);
      else refresh();
    },
    [refresh]
  );

  const deletePayment = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error } = await supabase.from('payments').delete().eq('id', id);
      if (error) setError(error.message);
      else refresh();
    },
    [refresh]
  );

  return { payments, loading, error, refresh, addPayment, deletePayment };
}
