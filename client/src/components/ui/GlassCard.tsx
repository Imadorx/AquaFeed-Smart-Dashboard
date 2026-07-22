import { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glowColor?: string;
}

export function GlassCard({ children, className, glowColor, style, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn("glass-panel rounded-2xl p-5", className)}
      style={{ ...(glowColor ? { boxShadow: `0 0 40px -22px ${glowColor}` } : {}), ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
