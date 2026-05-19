/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af', // синій
        secondary: '#000000', // чорний
        accent: '#ffffff', // білий
      },
    },
  },
  plugins: [],
}