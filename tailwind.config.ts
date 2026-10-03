import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-vazir)", "Tahoma", "sans-serif"] },
      colors: {
        brand: {
          50: "#fdf8f3", 100: "#f8ecdf", 200: "#f0d5b8", 300: "#e6b98a",
          400: "#d9955a", 500: "#cf7a3a", 600: "#b9622f", 700: "#9a4c29",
          800: "#7c3f27", 900: "#653523", 950: "#371a10",
        },
        coffee: { 900: "#1c1310", 800: "#2a1d18", 700: "#3a2a22" },
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(55,26,16,.25)",
        glow: "0 0 0 4px rgba(207,122,58,.15)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "none" } },
        "slide-in": { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "none" } },
        "pop": { "0%": { transform: "scale(.6)" }, "60%": { transform: "scale(1.15)" }, "100%": { transform: "scale(1)" } },
        "float": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: {
        "fade-up": "fade-up .6s ease both",
        "slide-in": "slide-in .3s ease both",
        pop: "pop .35s ease both",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
