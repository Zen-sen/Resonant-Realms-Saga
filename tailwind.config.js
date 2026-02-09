/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'san-gold': '#FFD700',
        'bridge-pink': '#ec4899',
      }
    },
  },
  plugins: [],
}
