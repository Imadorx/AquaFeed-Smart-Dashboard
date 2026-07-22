/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "var(--color-base)",
          raised: "var(--color-base-raised)",
          border: "var(--color-base-border)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          hover: "var(--color-surface-hover)",
        },
        ink: {
          primary: "var(--color-ink-primary)",
          muted: "var(--color-ink-muted)",
          faint: "var(--color-ink-faint)",
        },
        water: "#2DD4BF",
        solar: "#F5A623",
        leaf: "#7CD46B",
        danger: "#F2554C",
        warning: "#F5C542",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glass: "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 8px 32px -12px rgba(0,0,0,0.6)",
        glow: "0 0 24px -4px var(--tw-shadow-color)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        scan: "scan 2.6s linear infinite",
      },
    },
  },
  plugins: [],
};
