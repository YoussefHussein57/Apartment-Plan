import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ItemTotals, Section, Status, Priority } from '../types';

export function useItems(section?: Section) {
  const [items, setItems] = useState<ItemTotals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    let query = supabase.from('item_totals').select('*').order('sort_order', { ascending: true });
    if (section) query = query.eq('section', section);
    const { data, error } = await query;
    if (error) setError(error.message);
    else setItems(data as ItemTotals[]);
    setLoading(false);
  }, [section]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateItem = useCallback(
    async (id: string, patch: Partial<{ status: Status; priority: Priority; budget: number; notes: string; start_date: string | null; end_date: string | null; purchase_date: string | null; name: string }>) => {
      if (!supabase) return;
      const { error } = await supabase.from('items').update(patch).eq('id', id);
      if (error) setError(error.message);
      else refresh();
    },
    [refresh]
  );

  const addItem = useCallback(
    async (item: { section: Section; name: string; budget: number }) => {
      if (!supabase) return;
      const { error } = await supabase.from('items').insert(item);
      if (error) setError(error.message);
      else refresh();
    },
    [refresh]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) setError(error.message);
      else refresh();
    },
    [refresh]
  );

  return { items, loading, error, refresh, updateItem, addItem, deleteItem };
}
