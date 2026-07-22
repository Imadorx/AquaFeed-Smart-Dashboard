import { useEffect, useRef, useState } from "react";
import { getSocket } from "../services/socket";
import { fetchDashboard } from "../services/api";
import { DashboardSnapshot } from "../types/domain";

interface UseRealtimeDashboardResult {
  snapshot: DashboardSnapshot | null;
  connected: boolean;
  error: string | null;
}

export function useRealtimeDashboard(): UseRealtimeDashboardResult {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bootstrapped = useRef(false);

  useEffect(() => {
    const socket = getSocket();

    if (!bootstrapped.current) {
      bootstrapped.current = true;
      fetchDashboard()
        .then((data) => setSnapshot(data))
        .catch(() => setError("Waiting for the first sensor reading..."));
    }

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleUpdate = (data: DashboardSnapshot) => {
      setSnapshot(data);
      setError(null);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("dashboard:update", handleUpdate);
    setConnected(socket.connected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("dashboard:update", handleUpdate);
    };
  }, []);

  return { snapshot, connected, error };
}
