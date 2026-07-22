import { useState } from "react";
import { Droplet } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { setPump } from "../../services/api";

export function PumpControlCard({ automationEnabled }: { automationEnabled: boolean }) {
  const [pending, setPending] = useState<"on" | "off" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSet(on: boolean) {
    setPending(on ? "on" : "off");
    setMessage(null);
    try {
      await setPump(on);
    } catch (error: unknown) {
      const detail =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not reach the pump.";
      setMessage(detail);
    } finally {
      setPending(null);
    }
  }

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">
          Manual Pump Override
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-water/10 text-water">
          <Droplet size={16} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="primary"
          className="flex-1"
          disabled={pending !== null}
          onClick={() => handleSet(true)}
        >
          {pending === "on" ? "Turning on..." : "Turn on"}
        </Button>
        <Button
          variant="ghost"
          className="flex-1"
          disabled={pending !== null}
          onClick={() => handleSet(false)}
        >
          {pending === "off" ? "Turning off..." : "Turn off"}
        </Button>
      </div>
      <p className="text-xs text-ink-faint">
        {automationEnabled
          ? "Automation is currently controlling the pump. Disable it in Settings for manual control."
          : "Automation is disabled — you have direct control of the pump."}
      </p>
      {message && <p className="text-xs text-warning">{message}</p>}
    </GlassCard>
  );
}
