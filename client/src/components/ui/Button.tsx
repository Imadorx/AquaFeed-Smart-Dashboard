import { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-water text-base hover:bg-water/85",
  ghost: "bg-surface text-ink-primary hover:bg-surface-hover border border-base-border",
  danger: "bg-danger/90 text-white hover:bg-danger",
};

export function Button({ variant = "ghost", className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-water",
        VARIANT_STYLES[variant],
        className
      )}
      {...rest}
    />
  );
}
