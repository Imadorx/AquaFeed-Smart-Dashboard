import { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

const TONE_STYLES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-surface text-ink-muted",
  success: "bg-leaf/10 text-leaf",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-water/10 text-water",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-mono tracking-wide",
        TONE_STYLES[tone]
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone = "neutral", pulse = false }: { tone?: BadgeProps["tone"]; pulse?: boolean }) {
  const dotColor: Record<NonNullable<BadgeProps["tone"]>, string> = {
    neutral: "bg-ink-faint",
    success: "bg-leaf",
    warning: "bg-warning",
    danger: "bg-danger",
    info: "bg-water",
  };
  return (
    <span className="relative inline-flex h-2 w-2">
      {pulse && (
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping", dotColor[tone])} />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotColor[tone])} />
    </span>
  );
}
