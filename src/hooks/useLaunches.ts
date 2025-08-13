import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchLaunches } from '../api/spacex';
import { Launch } from '../types/spacex';

export function useLaunches(limit = 10) {
  const [data, setData] = useState<Launch[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadLaunches = useCallback(
    async (pageNum = 1, refresh = false) => {
      try {
        if (pageNum === 1 && !refresh) setLoading(true);
        if (refresh) setRefreshing(true);

        const launches = await fetchLaunches(pageNum, limit);
        setData((prev) => {
          const merged = pageNum === 1 ? launches : [...prev, ...launches];
          const unique = merged.filter(
            (item, index, self) => index === self.findIndex((t) => t.id === item.id)
          );
          return unique;
        });
        
        setPage(pageNum);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [limit]
  );

  const refresh = () => loadLaunches(1, true);
  const loadMore = () => loadLaunches(page + 1);

  useEffect(() => {
    loadLaunches(1);
  }, [loadLaunches]);

  // Client-side filtering by mission name
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((launch) =>
      launch.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return {
    data: filteredData,
    loading,
    error,
    refreshing,
    refresh,
    loadMore,
    search,
    setSearch,
    page, // ✅ now included
  };
}
