import { Request, Response, NextFunction } from "express";
import { simulationRuntime } from "../realtime/simulationRuntime";

export class PumpController {
  async turnOn(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await simulationRuntime.requestPumpOverride(true);
      if (!result.ok) {
        res.status(409).json({ message: result.reason });
        return;
      }
      res.json({ pumpStatus: true });
    } catch (error) {
      next(error);
    }
  }

  async turnOff(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await simulationRuntime.requestPumpOverride(false);
      if (!result.ok) {
        res.status(409).json({ message: result.reason });
        return;
      }
      res.json({ pumpStatus: false });
    } catch (error) {
      next(error);
    }
  }
}

export const pumpController = new PumpController();
