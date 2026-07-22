import { alertRepository } from "../repositories/alert.repository";
import { SystemHealthStatus } from "../types/domain";

export class SystemHealthService {
  async calculate(): Promise<SystemHealthStatus> {
    const criticalCount = await alertRepository.countActiveBySeverity("critical");
    if (criticalCount > 0) return "critical";

    const warningCount = await alertRepository.countActiveBySeverity("warning");
    if (warningCount > 0) return "warning";

    return "healthy";
  }
}

export const systemHealthService = new SystemHealthService();
