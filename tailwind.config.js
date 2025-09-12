/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Culori custom pentru Tetris
        tetris: {
          cyan: '#00f5ff',
          yellow: '#ffff00', 
          purple: '#800080',
          green: '#00ff00',
          red: '#ff0000',
          blue: '#0000ff',
          orange: '#ffa500'
        }
      },
      animation: {
        // Animații pentru efecte speciale
        'line-clear': 'lineClear 0.3s ease-in-out',
        'piece-drop': 'pieceDrop 0.2s ease-out',
        'tetris-flash': 'tetrisFlash 0.5s ease-in-out'
      },
      keyframes: {
        lineClear: {
          '0%': { opacity: '1', backgroundColor: '#ffffff' },
          '50%': { opacity: '0.5', backgroundColor: '#ffff00' },
          '100%': { opacity: '0' }
        },
        pieceDrop: {
          '0%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0)' }
        },
        tetrisFlash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3', backgroundColor: '#ffd700' }
        }
      },
      fontFamily: {
        mono: ['Monaco', 'Consolas', 'Courier New', 'monospace']
      },
      screens: {
        'xs': '375px',
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
      }
    },
  },
  plugins: [],
}