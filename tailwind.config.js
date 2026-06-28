/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0E1A',
        surface: '#131A2E',
        hairline: '#232A3A',
        ink: '#E6EAF5',
        muted: '#8B95B5',
        brand: {
          indigo: '#6366F1',
          cyan: '#22D3EE',
          violet: '#A855F7',
          emerald: '#34D399',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
