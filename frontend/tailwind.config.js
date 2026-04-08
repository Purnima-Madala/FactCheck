/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      colors: {
        arena: {
          bg: "#050510",
          panel: "#0b1121",
          cyan: "#00F5FF",
          steel: "#64748b",
          amber: "#f59e0b",
          emerald: "#14b8a6",
          rose: "#94a3b8"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 245, 255, 0.25)"
      }
    }
  },
  plugins: []
};
