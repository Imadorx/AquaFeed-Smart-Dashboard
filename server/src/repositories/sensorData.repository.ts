import { SensorDataModel, SensorDataAttributes } from "../models/SensorData";
import { SensorReading } from "../types/domain";

export class SensorDataRepository {
  async insertSnapshot(reading: SensorReading): Promise<SensorDataAttributes> {
    const doc = await SensorDataModel.create(reading);
    return doc.toObject();
  }

  async findHistory(from: Date, to: Date, limit = 500): Promise<SensorDataAttributes[]> {
    return SensorDataModel.find({ timestamp: { $gte: from, $lte: to } })
      .sort({ timestamp: 1 })
      .limit(limit)
      .lean<SensorDataAttributes[]>();
  }

  async findLatest(): Promise<SensorDataAttributes | null> {
    return SensorDataModel.findOne().sort({ timestamp: -1 }).lean<SensorDataAttributes | null>();
  }

  async findRecent(hours: number): Promise<SensorDataAttributes[]> {
    const from = new Date(Date.now() - hours * 60 * 60 * 1000);
    return SensorDataModel.find({ timestamp: { $gte: from } })
      .sort({ timestamp: 1 })
      .lean<SensorDataAttributes[]>();
  }
}

export const sensorDataRepository = new SensorDataRepository();
