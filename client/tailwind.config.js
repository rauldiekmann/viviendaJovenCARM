/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens:{
      'responsiveSellerPage': '430px'
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],}