import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF5200',
          light: '#FF7340',
          dark: '#E84700',
          50: '#FFF3EE',
          100: '#FFE4D6',
        },
        veg: '#60B246',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#FFF8F5',
          muted: '#F8F8F8',
        },
        ink: {
          DEFAULT: '#1C1C1C',
          light: '#686B78',
          lighter: '#93959F',
          line: '#E9E9EB',
        },
        // backwards-compat aliases so existing code keeps working
        gold: {
          DEFAULT: '#FF5200',
          light: '#FF7340',
          dark: '#E84700',
        },
        dark: {
          DEFAULT: '#1C1C1C',
          card: '#FFFFFF',
          border: '#E9E9EB',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FF5200, #FF8C00)',
        'brand-gradient': 'linear-gradient(135deg, #FF5200, #FF8C00)',
        'hero-gradient': 'linear-gradient(135deg, #FF5200 0%, #FF8C00 60%, #FFB347 100%)',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '108': '1.08',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 32px rgba(0,0,0,0.14)',
        nav: '0 2px 12px rgba(0,0,0,0.07)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease',
        'slide-up': 'slideUp 0.4s ease',
        'bounce-in': 'bounceIn 0.3s ease-out',
        'cart-pulse': 'cartPulse 0.4s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        cartPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
