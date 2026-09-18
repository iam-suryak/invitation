/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          gold: '#D4AF37',
          lightgold: '#F3E5AB',
          darkgold: '#AA7C11',
          maroon: '#4A0E17',
          deepmaroon: '#2B070C',
          emerald: '#0B3B24',
          rose: '#E8A598',
          cream: '#FFFDD0',
          velvet: '#1A0B2E'
        }
      },
      fontFamily: {
        serif: ['"Cinzel Decorative"', 'serif'],
        cursive: ['"Great Vibes"', 'cursive'],
        body: ['"Montserrat"', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
}
