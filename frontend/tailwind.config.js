/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spanish-gray': 'var(--spanish-gray)',
        'sonic-silver': 'var(--sonic-silver)',
        'eerie-black': 'var(--eerie-black)',
        'salmon-pink': 'var(--salmon-pink)',
        'sandy-brown': 'var(--sandy-brown)',
        'bittersweet': 'var(--bittersweet)',
        'ocean-green': 'var(--ocean-green)',
        'davys-gray': 'var(--davys-gray)',
        'cultured': 'var(--cultured)',
        'white': 'var(--white)',
        'onyx': 'var(--onyx)',
        'colordarkblue': 'var(--colordarkblue)',
        'colornavyblue': 'var(--colornavyblue)',
        'peach': 'var(--peach)',
        'babypink': 'var(--babypink)',
        // Mapping old names to new palette for compatibility (or refactor later)
        primary: 'var(--salmon-pink)',
        secondary: 'var(--bittersweet)',
        'dark-bg': 'var(--babypink)',
        'dark-surface': 'var(--white)',
        'dark-text': 'var(--eerie-black)',
        'dark-muted': 'var(--sonic-silver)',
        'dark-border': 'var(--cultured)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'md': 'var(--border-radius-md)',
        'sm': 'var(--border-radius-sm)',
      },
      boxShadow: {
        'card': '0 0 10px hsla(0, 0%, 0%, 0.1)',
        'card-hover': '0 0 20px hsla(0, 0%, 0%, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
