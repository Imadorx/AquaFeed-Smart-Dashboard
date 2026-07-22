import { alertRepository } from "../repositories/alert.repository";
import { AlertAttributes } from "../models/Alert";

export class AlertService {
  async listActive(): Promise<AlertAttributes[]> {
    return alertRepository.findActive();
  }

  async listHistory(limit?: number): Promise<AlertAttributes[]> {
    return alertRepository.findHistory(limit);
  }

  async resolve(id: string): Promise<AlertAttributes | null> {
    return alertRepository.resolve(id);
  }
}

export const alertService = new AlertService();
