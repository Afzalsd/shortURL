/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',
        inkSoft: '#111A2E',
        paper: '#F5F3EE',
        signal: '#5EEAD4',
        signalDim: '#2DD4BF',
        amber: '#F5A623',
        slate: '#8B98B3',
        mist: '#1B2740'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(94,234,212,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.06) 1px, transparent 1px)'
      },
      backgroundSize: {
        grid: '32px 32px'
      }
    }
  },
  plugins: []
};
