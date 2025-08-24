/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ktp-dark-blue': '#234c8b',
        'light-blue': '#F6FBFF',
      },
      screens: {
        lg: '1100px', // Custom lg breakpoint
      },
    },
  },
  plugins: [],
}
