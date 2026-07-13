import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Settings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error) setError(error.message);
    else setSettings(data as Settings);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSettings = useCallback(
    async (patch: Partial<Settings>) => {
      if (!supabase) return;
      const { error } = await supabase.from('settings').update(patch).eq('id', 1);
      if (error) setError(error.message);
      else refresh();
    },
    [refresh]
  );

  return { settings, loading, error, refresh, updateSettings };
}
