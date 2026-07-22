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
  timestamp: Date;
}

export interface DashboardSnapshot {
  current: SensorReading;
  systemHealth: SystemHealthStatus;
  activeAlerts: number;
  nextIrrigationInMs: number;
  connected: boolean;
}
