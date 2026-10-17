import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#070d1f',
          900: '#0a1128',
          800: '#101a3a',
          700: '#16224d',
          600: '#1e2d63',
        },
        cream: {
          50: '#fbf8f3',
          100: '#f5efe4',
          200: '#eadfc9',
        },
        coral: {
          300: '#ffb4a4',
          400: '#ff8a75',
          500: '#ff6b5e',
          600: '#f1503e',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
