/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ideactiti: {
          red: '#E51A1A', // Dainik Bhaskar Signature Red
          darkRed: '#B30B0B',
          navy: '#0E1E38',
          accent: '#FFC72C', // Yellow highlight
        }
      },
      fontFamily: {
        sans: ['"Noto Sans Devanagari"', 'Hind', 'Mukta', 'Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
