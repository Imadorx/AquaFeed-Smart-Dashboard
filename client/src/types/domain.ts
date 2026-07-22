export type AlertType =
  | "HIGH_TEMPERATURE"
  | "LOW_WATER"
  | "PUMP_FAILURE"
  | "COOLING_FAILURE"
  | "HUMIDITY_TOO_LOW"
  | "IRRIGATION_REMINDER";

export type AlertSeverity = "info" | "warning" | "critical";
export type SystemHealthStatus = "healthy" | "warning" | "critical";

export interface SensorReading {
  temperature: number;
  humidity: number;
  waterLevel: number;
  solarPower: number;
  pumpStatus: boolean;
  coolingStatus: boolean;
  waterRecycle: boolean;
  timestamp: string;
}

export interface DashboardSnapshot {
  current: SensorReading;
  systemHealth: SystemHealthStatus;
  activeAlerts: number;
  nextIrrigationInMs: number;
  connected: boolean;
}

export interface Alert {
  _id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface Settings {
  temperatureThreshold: number;
  humidityThreshold: number;
  automationEnabled: boolean;
  notificationIntervalHours: number;
}

export interface HistoryPoint {
  temperature: number;
  humidity: number;
  waterLevel: number;
  solarPower: number;
  timestamp: string;
}

export interface AnalyticsAverages {
  temperature: number;
  humidity: number;
  waterLevel: number;
  solarPower: number;
}

export interface AnalyticsStatistics {
  dailyAverage: AnalyticsAverages;
  weeklyAverage: AnalyticsAverages;
  sampleCount: { daily: number; weekly: number };
}
