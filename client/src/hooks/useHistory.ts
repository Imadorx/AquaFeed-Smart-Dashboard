import { useEffect, useState } from "react";
import { fetchHistory } from "../services/api";
import { HistoryPoint } from "../types/domain";

export function useHistory(hours: number, refreshMs = 15000) {
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const points = await fetchHistory(hours);
        if (!cancelled) setData(points);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, refreshMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [hours, refreshMs]);

  return { data, loading };
}
