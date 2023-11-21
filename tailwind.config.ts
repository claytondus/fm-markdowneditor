import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: "var(--font-mono)",
        serif: "var(--font-serif)",
        sans: "var(--font-sans)",
      },
      colors: {
        grey: {
          100: "#ffffff",
          200: "#f5f5f5",
          300: "#e4e4e4",
          400: "#c1c4cb",
          500: "#7c8187",
          600: "#5a6069",
          700: "#35393f",
          800: "#2b2d31",
          900: "#1d1f22",
          1000: "#151619",
        },
        orange: {
          300: "#fe9765",
          700: "#e46643",
        },
      },
    },
  },
  plugins: [typography],
};
export default config;
