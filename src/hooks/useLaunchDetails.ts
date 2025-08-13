import { useEffect, useState, useCallback } from 'react';
import { fetchLaunch, fetchLaunchpad } from '../api/spacex';
import { Launch, Launchpad } from '../types/spacex';

export function useLaunchDetails(launchId: string) {
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [launchpad, setLaunchpad] = useState<Launchpad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const launchData = await fetchLaunch(launchId);
      setLaunch(launchData);

      if (launchData.launchpad) {
        const launchpadData = await fetchLaunchpad(launchData.launchpad);
        setLaunchpad(launchpadData);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [launchId]);

  useEffect(() => {
    load();
  }, [load]);

  return { launch, launchpad, loading, error, refresh: load };
}
