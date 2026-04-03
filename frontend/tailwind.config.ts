import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Core tokens for Light Theme SaaS ── */
        surface: {
          DEFAULT: "#ffffff",
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
        },
        ink: {
          DEFAULT: "#0f172a", // main text
          dim:     "#334155",
          lighter: "#475569",
        },
        slate: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // secondary action
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a", // primary brand
        },
        accent: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // accent (coral/amber)
          600: "#d97706",
          700: "#b45309",
        },
        /* ── Status and Category Colors ── */
        success: {
          100: "#d1fae5",
          600: "#059669",
          800: "#065f46"
        },
        warning: {
          100: "#fef3c7",
          600: "#d97706",
          800: "#92400e"
        },
        danger: {
          100: "#ffe4e6",
          600: "#e11d48",
          800: "#9f1239"
        },
        blue:   "#3b82f6",
        green:  "#10b981",
        amber:  "#f59e0b",
        purple: "#8b5cf6",
        red:    "#f43f5e",
        cyan:   "#06b6d4",
        lime:   "#84cc16",
        orange: "#fb923c",
        pink:   "#e879f9",
      },

      boxShadow: {
        soft:   "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        card:   "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
        panel:  "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
        glow:   "0 0 20px rgba(37, 99, 235, 0.15)",
        amber:  "0 10px 28px rgba(245,158,11,0.25)",
      },

      fontFamily: {
        sans:    ["var(--font-jakarta)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-jakarta)", "sans-serif"],
        mono:    ["ui-monospace", "monospace"],
      },

      borderRadius: {
        "xl":  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      animation: {
        "fade-up": "fadeUp 0.4s ease both",
        shimmer:   "skeletonShimmer 1.6s ease-in-out infinite",
        "float":   "float 6s ease-in-out infinite",
      },

      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        skeletonShimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition:  "400px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      },
    },
  },
  plugins: [],
};

export default config;