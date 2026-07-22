import { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service";
import { simulationRuntime } from "../realtime/simulationRuntime";

export class DashboardController {
  async getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const latest = simulationRuntime.getLatestReading();
      const reading = latest ?? (await dashboardService.getLastPersistedReading());

      if (!reading) {
        res.status(503).json({ message: "Simulation has not produced a reading yet" });
        return;
      }

      const snapshot = await dashboardService.buildSnapshot(reading);
      res.json(snapshot);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
