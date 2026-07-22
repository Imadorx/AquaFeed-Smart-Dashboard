import { sensorDataRepository } from "../repositories/sensorData.repository";
import { alertRepository } from "../repositories/alert.repository";
import { systemHealthService } from "./systemHealth.service";
import { reminderService } from "./reminder.service";
import { DashboardSnapshot, SensorReading } from "../types/domain";

export class DashboardService {
  async buildSnapshot(liveReading: SensorReading): Promise<DashboardSnapshot> {
    const [systemHealth, activeAlerts] = await Promise.all([
      systemHealthService.calculate(),
      alertRepository.countActive(),
    ]);

    return {
      current: liveReading,
      systemHealth,
      activeAlerts,
      nextIrrigationInMs: reminderService.getNextReminderInMs(),
      connected: true,
    };
  }

  async getLastPersistedReading(): Promise<SensorReading | null> {
    const doc = await sensorDataRepository.findLatest();
    if (!doc) return null;
    return {
      temperature: doc.temperature,
      humidity: doc.humidity,
      waterLevel: doc.waterLevel,
      solarPower: doc.solarPower,
      pumpStatus: doc.pumpStatus,
      coolingStatus: doc.coolingStatus,
      waterRecycle: doc.waterRecycle,
      timestamp: doc.timestamp,
    };
  }
}

export const dashboardService = new DashboardService();
