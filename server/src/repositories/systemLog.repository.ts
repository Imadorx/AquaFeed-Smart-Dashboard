import { SystemLogModel, SystemLogAttributes } from "../models/SystemLog";

export class SystemLogRepository {
  async record(action: string, reason: string): Promise<SystemLogAttributes> {
    const doc = await SystemLogModel.create({ action, reason, createdAt: new Date() });
    return doc.toObject();
  }

  async findRecent(limit = 100): Promise<SystemLogAttributes[]> {
    return SystemLogModel.find().sort({ createdAt: -1 }).limit(limit).lean<SystemLogAttributes[]>();
  }
}

export const systemLogRepository = new SystemLogRepository();
