/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5865F2',
        secondary: '#4f545c',
        danger: '#ed4245',
        success: '#43b581',
        warning: '#faa61a',
        discord: {
          dark: '#36393f',
          darker: '#2f3136',
          darkest: '#202225',
          light: '#dcddde',
          lighter: '#b9bbbe',
          lightest: '#8e9297',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '112': '28rem',
        '128': '32rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      boxShadow: {
        'discord': '0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05)',
        'discord-dark': '0 1px 0 rgba(0,0,0,0.2),0 1.5px 0 rgba(0,0,0,0.05),0 2px 0 rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
} 