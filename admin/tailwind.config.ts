import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#D4AF37', light: '#F0D060' },
        sidebar: '#0D0D0D',
        card: '#111111',
        border: '#1E1E1E',
      },
    },
  },
  plugins: [],
};

export default config;
