import { Request, Response, NextFunction } from "express";
import { alertService } from "../services/alert.service";

export class AlertController {
  async getActive(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const alerts = await alertService.listActive();
      res.json(alerts);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit ?? 100);
      const alerts = await alertService.listHistory(Number.isFinite(limit) ? limit : 100);
      res.json(alerts);
    } catch (error) {
      next(error);
    }
  }

  async resolve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resolved = await alertService.resolve(id);
      if (!resolved) {
        res.status(404).json({ message: "Alert not found" });
        return;
      }
      res.json(resolved);
    } catch (error) {
      next(error);
    }
  }
}

export const alertController = new AlertController();
