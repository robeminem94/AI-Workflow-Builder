import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        muted: "#65758b",
        line: "#d8e0ea",
        cloud: "#f5f7fb",
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          500: "#2876dd",
          600: "#1f5fb5",
          700: "#1d4d90"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 32, 51, 0.08)"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;
