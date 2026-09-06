/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0d1b2a',
        navy2: '#12263a',
        gold: '#d4af37',
        electric: '#4aa8ff',
        ink: '#e8edf4',
        muted: '#9fb0c3'
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
