export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        ink: "#0a0b0f",
        panel: "#111218",
        line: "#1e2028",
        violet: "#6C63FF",
        lavender: "#A78BFA",
        gold: "#C9A84C",
      },
      boxShadow: {
        glow: "0 0 20px rgba(108, 99, 255, 0.2)",
      },
    },
  },
  plugins: [],
};
