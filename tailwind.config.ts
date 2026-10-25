import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lv: {
          dark: "#0E0E0E",
          canvas: "#F6F5F3",
          border: "#E8E7E4",
          gold: "#8A6D3B",
          accent: "#C5A880",
          sand: "#DFD9D0",
          cream: "#FBF9F6",
        },
        brand: {
          50: "#fbf9f5",
          100: "#f5f0e6",
          200: "#ebdcc8",
          300: "#dec0a3",
          400: "#cda07b",
          500: "#b88358",
          600: "#a26e47",
          700: "#83553a",
          800: "#694532",
          900: "#55392b",
          gold: "#C5A880",
          "gold-dark": "#9E7B4F",
          navy: "#0C1427",
          "navy-light": "#1B2541",
          cream: "#FAF8F5",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
        "luxury-lg": "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
      },
      letterSpacing: {
        luxury: "0.25em",
        ultra: "0.35em",
        subtle: "0.08em",
      },
      animation: {
        marquee: "marquee-scroll 28s linear infinite",
      },
      keyframes: {
        "marquee-scroll": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
