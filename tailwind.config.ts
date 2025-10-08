import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', '"Helvetica Neue"', "Arial", "sans-serif"]
      },
      borderRadius: {
        "2xl": "1rem"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,.06)"
      }
    }
  },
  plugins: []
} satisfies Config;
