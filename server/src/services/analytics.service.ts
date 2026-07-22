import { sensorDataRepository } from "../repositories/sensorData.repository";
import { SensorDataAttributes } from "../models/SensorData";

export interface HistoryQuery {
  hours: number;
}

export interface AnalyticsStatistics {
  dailyAverage: {
    temperature: number;
    humidity: number;
    waterLevel: number;
    solarPower: number;
  };
  weeklyAverage: {
    temperature: number;
    humidity: number;
    waterLevel: number;
    solarPower: number;
  };
  sampleCount: {
    daily: number;
    weekly: number;
  };
}

function average(docs: SensorDataAttributes[], key: keyof SensorDataAttributes): number {
  if (docs.length === 0) return 0;
  const total = docs.reduce((sum, doc) => sum + Number(doc[key]), 0);
  return Number((total / docs.length).toFixed(2));
}

export class AnalyticsService {
  async getHistory(query: HistoryQuery): Promise<SensorDataAttributes[]> {
    return sensorDataRepository.findRecent(query.hours);
  }

  async getStatistics(): Promise<AnalyticsStatistics> {
    const [daily, weekly] = await Promise.all([
      sensorDataRepository.findRecent(24),
      sensorDataRepository.findRecent(24 * 7),
    ]);

    return {
      dailyAverage: {
        temperature: average(daily, "temperature"),
        humidity: average(daily, "humidity"),
        waterLevel: average(daily, "waterLevel"),
        solarPower: average(daily, "solarPower"),
      },
      weeklyAverage: {
        temperature: average(weekly, "temperature"),
        humidity: average(weekly, "humidity"),
        waterLevel: average(weekly, "waterLevel"),
        solarPower: average(weekly, "solarPower"),
      },
      sampleCount: {
        daily: daily.length,
        weekly: weekly.length,
      },
    };
  }
}

export const analyticsService = new AnalyticsService();
