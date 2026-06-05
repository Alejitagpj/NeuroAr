import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0A0E1A', soft: '#0F1424', elev: '#151B30' },
        ink: { DEFAULT: '#E7ECF5', dim: '#9AA5BD', faint: '#5A6680' },
        line: { DEFAULT: 'rgba(255,255,255,0.08)', strong: 'rgba(255,255,255,0.14)' },
        cyan: { DEFAULT: '#7AE7FF', glow: '#7AE7FF' },
        violet: { DEFAULT: '#A78BFA' },
        good: { DEFAULT: '#34D399' },
        warn: { DEFAULT: '#FBBF24' },
        bad: { DEFAULT: '#FB7185' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      animation: {
        'shimmer': 'shimmer 2.4s linear infinite',
        'blink': 'blink 1s steps(2, end) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: { '50%': { opacity: '0' } },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'glass-grad': 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        'cyan-glow': 'radial-gradient(circle at center, rgba(122,231,255,0.25), transparent 70%)',
      },
    },
  },
  plugins: [animate],
};
export default config;
