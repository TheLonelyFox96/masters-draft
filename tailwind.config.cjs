/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        row: "var(--color-row)",
        rowHover: "var(--color-row-hover)",
        "row-hover": "var(--color-row-hover)",
        "row-alt": "var(--color-row-alt)",
        divider: "var(--color-divider)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        name: "var(--color-name)",
        gold: "var(--color-gold)",
        under: "var(--color-under)",
        over: "var(--color-over)",
        even: "var(--color-even)",
        headerBg: "var(--color-header-bg)",
        bg: "var(--color-bg)",
      },
      borderRadius: {
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};
