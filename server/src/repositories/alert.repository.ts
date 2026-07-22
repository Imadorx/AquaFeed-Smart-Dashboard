import { AlertModel, AlertAttributes } from "../models/Alert";
import { AlertSeverity, AlertType } from "../types/domain";

export interface CreateAlertInput {
  type: AlertType;
  severity: AlertSeverity;
  message: string;
}

export class AlertRepository {
  async create(input: CreateAlertInput): Promise<AlertAttributes> {
    const doc = await AlertModel.create({ ...input, resolved: false, createdAt: new Date() });
    return doc.toObject();
  }

  async findActive(): Promise<AlertAttributes[]> {
    return AlertModel.find({ resolved: false }).sort({ createdAt: -1 }).lean<AlertAttributes[]>();
  }

  async findHistory(limit = 100): Promise<AlertAttributes[]> {
    return AlertModel.find().sort({ createdAt: -1 }).limit(limit).lean<AlertAttributes[]>();
  }

  async findActiveByType(type: AlertType): Promise<AlertAttributes | null> {
    return AlertModel.findOne({ type, resolved: false }).lean<AlertAttributes | null>();
  }

  async resolve(id: string): Promise<AlertAttributes | null> {
    return AlertModel.findByIdAndUpdate(
      id,
      { resolved: true, resolvedAt: new Date() },
      { new: true }
    ).lean<AlertAttributes | null>();
  }

  async countActive(): Promise<number> {
    return AlertModel.countDocuments({ resolved: false });
  }

  async countActiveBySeverity(severity: AlertSeverity): Promise<number> {
    return AlertModel.countDocuments({ resolved: false, severity });
  }
}

export const alertRepository = new AlertRepository();
