import { alertRepository } from "../repositories/alert.repository";

export class ReminderService {
  private lastReminderAt = Date.now();
  private intervalHours = 4;

  setIntervalHours(hours: number): void {
    this.intervalHours = hours;
  }

  getNextReminderInMs(): number {
    const intervalMs = this.intervalHours * 60 * 60 * 1000;
    const elapsed = Date.now() - this.lastReminderAt;
    return Math.max(0, intervalMs - elapsed);
  }

  async checkAndTrigger(): Promise<void> {
    if (this.getNextReminderInMs() > 0) return;
    await alertRepository.create({
      type: "IRRIGATION_REMINDER",
      severity: "info",
      message: "Time to irrigate the plants.",
    });
    this.lastReminderAt = Date.now();
  }
}

export const reminderService = new ReminderService();
