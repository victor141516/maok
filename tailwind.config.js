const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.emerald,
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('contentEditable', '&[contentEditable="true"]')
    }),
  ],
}
