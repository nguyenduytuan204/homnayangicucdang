/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#060b14',
          secondary: '#0a1120',
          panel: '#0d1626',
          card: '#101828',
          hover: '#131f30',
        },
        border: {
          dim: '#1a2d45',
          glow: '#1e3a5f',
          bright: '#2563ab',
        },
        accent: {
          purple: '#a855f7',
          'purple-dim': '#7c3aed',
          'purple-glow': '#c084fc',
          gold: '#f59e0b',
          'gold-bright': '#fbbf24',
          'gold-glow': '#fde68a',
          green: '#10b981',
          'green-bright': '#34d399',
          cyan: '#06b6d4',
          'cyan-bright': '#22d3ee',
          red: '#ef4444',
        },
        rarity: {
          common: '#64748b',
          rare: '#3b82f6',
          epic: '#a855f7',
          secret: '#f59e0b',
        },
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#475569',
          gold: '#fbbf24',
          purple: '#c084fc',
          green: '#34d399',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.15)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.2)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.15)',
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.5)',
        'panel': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'roulette': 'roulette 0.1s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scanline': 'scanline 4s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(245,158,11,0.4), 0 0 30px rgba(245,158,11,0.15)' },
          '50%': { boxShadow: '0 0 25px rgba(245,158,11,0.7), 0 0 50px rgba(245,158,11,0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(30,58,95,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,95,0.15) 1px, transparent 1px)",
        'hero-gradient': 'radial-gradient(ellipse at top, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(245,158,11,0.08) 0%, transparent 50%)',
        'card-gradient': 'linear-gradient(135deg, rgba(13,22,38,0.9) 0%, rgba(10,17,32,0.95) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        'rarity-common': 'linear-gradient(90deg, #475569, #64748b)',
        'rarity-rare': 'linear-gradient(90deg, #1d4ed8, #3b82f6)',
        'rarity-epic': 'linear-gradient(90deg, #7c3aed, #a855f7)',
        'rarity-secret': 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
      },
      gridTemplateColumns: {
        'food-desktop': 'repeat(6, minmax(0, 1fr))',
        'food-tablet': 'repeat(3, minmax(0, 1fr))',
        'food-mobile': 'repeat(2, minmax(0, 1fr))',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}
