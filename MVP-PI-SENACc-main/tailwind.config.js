/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdfcfa',
          100: '#faf8f4',
          200: '#f5f1ea',
          300: '#ede7db',
        },
        ink: {
          900: '#1a1814',
          800: '#2a2620',
          700: '#3a352e',
          600: '#4a443c',
          500: '#6b6359',
          400: '#8a8175',
          300: '#a8a095',
          200: '#c4bdb0',
          100: '#e0dbd1',
        },
        accent: {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fad8a5',
          300: '#f7bd6e',
          400: '#f49b3a',
          500: '#e87d12',
          600: '#cf6a0a',
          700: '#a85209',
          800: '#874210',
          900: '#6e3810',
        },
      },
      letterSpacing: {
        'editorial': '0.08em',
        'wider-editorial': '0.12em',
        'widest-editorial': '0.18em',
      },
      keyframes: {
        'slide-in': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-slow': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.35s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-slow': 'fade-in-slow 0.5s ease-out',
      },
      transitionDuration: {
        '350': '350ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
};
