/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff4d4d",
        secondary: "#2d3436",
        accent: "#fab1a0"
      }
    },
  },
  plugins: [],
}