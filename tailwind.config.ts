import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        fig: ["Figtree", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "primary-orange": "#FF5722",
        "accent-gray": "#f0eef4",
        "light-black": "#121212",
      },
      keyframes: {
        like_effect: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        like: "like_effect 400ms ease",
        spin: "spin 2s linear infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeInFast: "fadeIn 0.2s ease-in-out",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: any) {
      addUtilities({
        ".bg-accent-purple-transparent": {
          backgroundColor: "rgba(128, 0, 128, 0.25)",
        },
        ".bg-accent-gray-transparent": {
          backgroundColor: "#eaeaea70",
        },
        ".border-t-accent-orange": {
          borderTopColor: "#FF5722",
        },
        ".border-t-accent-red": {
          borderTopColor: "#FF0000",
        },
      });
    }),
  ],
};
export default config;
