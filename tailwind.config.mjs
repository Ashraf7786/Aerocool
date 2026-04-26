/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/frontend/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#254EDB',
          dark: '#1a3bb5',
          light: '#EEF2FF',
        },
        lime: {
          DEFAULT: '#EEFF41',
          dark: '#d4e428',
        },
      },
    },
  },
  plugins: [],
}
