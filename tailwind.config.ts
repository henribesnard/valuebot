import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vb: {
          bg: "#0E1116",
          "bg-card": "rgba(22,27,34,0.6)",
          "bg-card-solid": "rgba(22,27,34,0.5)",
          "bg-card-subtle": "rgba(22,27,34,0.55)",
          green: "#16C784",
          "green-dark": "#0FA76C",
          "green-bg": "rgba(22,199,132,0.12)",
          "green-bg-strong": "rgba(22,199,132,0.14)",
          cyan: "#22D3EE",
          "cyan-light": "#7DE6F5",
          "cyan-bg": "rgba(34,211,238,0.12)",
          purple: "#7C5CFC",
          "purple-bg": "rgba(124,92,252,0.14)",
          red: "#EA3943",
          "red-light": "#FF6B74",
          "red-bg": "rgba(234,57,67,0.12)",
          text: "#E6EDF3",
          "text-secondary": "#8B98A5",
          "text-muted": "#5B6772",
          "text-body": "#C9D3DD",
          "text-tag": "#9AA7B4",
          border: "rgba(255,255,255,0.08)",
          "border-hover": "rgba(34,211,238,0.4)",
          "border-strong": "rgba(255,255,255,0.12)",
          "border-subtle": "rgba(255,255,255,0.06)",
          "border-input": "rgba(255,255,255,0.12)",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-ibm-plex-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
        narrow: "980px",
        form: "430px",
        checkout: "960px",
      },
      screens: {
        mobile: "760px",
        wide: "1120px",
      },
      keyframes: {
        vbPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.8)" },
        },
        vbFade: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "vb-pulse": "vbPulse 1.8s infinite",
        "vb-fade": "vbFade 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
