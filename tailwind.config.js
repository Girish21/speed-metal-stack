const theme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
