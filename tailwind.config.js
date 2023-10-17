/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ["var(--font-jost)"],
      },
      colors: {
        text: "#191B1E",
        background: "#F7F7F7",
        background_dark: "#2C2738",
        background_secondary: "#EBF4F8",
        background_secondary_dark: "#756F86",
        success: "#14A38B",
        warning: "#F2AC57",
        error: "#FF7171",
        neutral: "#0880AE",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
