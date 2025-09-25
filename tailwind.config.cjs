/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 24px -12px rgba(37, 99, 235, .4)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
