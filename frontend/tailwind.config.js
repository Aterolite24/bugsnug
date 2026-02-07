/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom dark theme colors
        dark: {
          bg: '#1a1b26', // Example dark bg
          card: '#24283b',
          text: '#a9b1d6',
          primary: '#7aa2f7',
        }
      }
    },
  },
  plugins: [],
}
