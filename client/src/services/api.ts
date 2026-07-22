import { apiClient } from "./apiClient";
import {
  Alert,
  AnalyticsStatistics,
  DashboardSnapshot,
  HistoryPoint,
  Settings,
} from "../types/domain";

export async function fetchDashboard(): Promise<DashboardSnapshot> {
  const { data } = await apiClient.get<DashboardSnapshot>("/dashboard");
  return data;
}

export async function fetchHistory(hours: number): Promise<HistoryPoint[]> {
  const { data } = await apiClient.get<{ points: HistoryPoint[] }>("/history", {
    params: { hours },
  });
  return data.points;
}

export async function fetchStatistics(): Promise<AnalyticsStatistics> {
  const { data } = await apiClient.get<AnalyticsStatistics>("/history/statistics");
  return data;
}

export async function fetchActiveAlerts(): Promise<Alert[]> {
  const { data } = await apiClient.get<Alert[]>("/alerts");
  return data;
}

export async function fetchAlertHistory(): Promise<Alert[]> {
  const { data } = await apiClient.get<Alert[]>("/alerts/history");
  return data;
}

export async function resolveAlert(id: string): Promise<Alert> {
  const { data } = await apiClient.post<Alert>(`/alerts/${id}/resolve`);
  return data;
}

export async function fetchSettings(): Promise<Settings> {
  const { data } = await apiClient.get<Settings>("/settings");
  return data;
}

export async function updateSettings(input: Partial<Settings>): Promise<Settings> {
  const { data } = await apiClient.put<Settings>("/settings", input);
  return data;
}

export async function setPump(on: boolean): Promise<{ pumpStatus: boolean }> {
  const { data } = await apiClient.post<{ pumpStatus: boolean }>(`/pump/${on ? "on" : "off"}`);
  return data;
}
