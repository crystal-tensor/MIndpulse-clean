/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 赛博朋克色调
        cyber: {
          primary: '#00FFFF',
          secondary: '#FF00FF',
          accent: '#FFFF00',
          dark: '#0a0a0a',
          gray: '#1a1a2e',
          blue: '#16213e',
        },
        // 唯美未来色调
        ethereal: {
          primary: '#667eea',
          secondary: '#764ba2',
          pearl: '#f8f9ff',
          gold: '#ffd89b',
          silver: '#c9d6ff',
        },
        // 中国虚幻空间色调
        mystical: {
          ink: '#1a1a1a',
          jade: '#00a693',
          cinnabar: '#e63946',
          gold: '#f7931e',
          mist: '#f8f9fa',
        },
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        'gradient-ethereal': 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        'gradient-dragon': 'conic-gradient(from 0deg, #00a693, #f7931e, #e63946, #00a693)',
        'gradient-phoenix': 'radial-gradient(circle, rgba(231,57,70,0.3) 0%, transparent 70%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        cyber: ['Orbitron', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'rotate-slow': 'rotate-slowly 20s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'data-flow': 'dataFlow 10s linear infinite',
        'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px var(--cyber-primary)' },
          '100%': { boxShadow: '0 0 30px var(--cyber-primary), 0 0 40px var(--cyber-primary)' },
        },
        'rotate-slowly': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-10px) scale(1.2)', opacity: '1' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        'dataFlow': {
          '0%': { transform: 'translateX(-200px)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateX(calc(100vw + 200px))', opacity: '0' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 255, 255, 0.5)',
        'ethereal': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'mystical': '0 4px 20px rgba(0, 166, 147, 0.3)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  darkMode: 'class',
}; 