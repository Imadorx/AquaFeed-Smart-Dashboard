import { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service";

export class AnalyticsController {
  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hours = Number(req.query.hours ?? 24);
      const safeHours = Number.isFinite(hours) && hours > 0 ? Math.min(hours, 24 * 30) : 24;
      const history = await analyticsService.getHistory({ hours: safeHours });
      res.json({ hours: safeHours, points: history });
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statistics = await analyticsService.getStatistics();
      res.json(statistics);
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
