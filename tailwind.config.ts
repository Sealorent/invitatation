import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        blush: {
          50: '#fdf6f0',
          100: '#fae8d8',
          200: '#f5cfb0',
          300: '#efad7f',
          400: '#e7824c',
          500: '#e0622a',
          600: '#d24b1f',
          700: '#ae391c',
          800: '#8c301e',
          900: '#72291b',
        },
        cream: {
          50: '#fffef7',
          100: '#fffce8',
          200: '#fff8c5',
          300: '#fff1a0',
          400: '#ffe86e',
          500: '#ffd73b',
          600: '#f0b800',
          700: '#c08b00',
          800: '#9a7000',
          900: '#7d5b00',
        },
        gold: {
          50: '#fdfaee',
          100: '#f9f1cc',
          200: '#f3e195',
          300: '#ebcc5a',
          400: '#e2b82e',
          500: '#d19f18',
          600: '#b47d12',
          700: '#905c12',
          800: '#784a17',
          900: '#653d19',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
        elegant: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'petal-fall': 'petalFall 8s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        petalFall: {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      },
      backgroundImage: {
        'romantic-gradient': 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 25%, #fdf4ff 50%, #f5e0ff 75%, #ede9fe 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d19f18 0%, #e2b82e 50%, #b47d12 100%)',
        'rose-gradient': 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)',
      }
    },
  },
  plugins: [],
} satisfies Config
