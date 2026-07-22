import { Request, Response, NextFunction } from "express";
import { settingsService } from "../services/settings.service";
import { reminderService } from "../services/reminder.service";

export class SettingsController {
  async getSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.getSettings();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.updateSettings(req.body);
      reminderService.setIntervalHours(settings.notificationIntervalHours);
      res.json(settings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
