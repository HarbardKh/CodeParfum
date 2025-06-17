/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b78846",
        secondary: "#1e1e2d",
        accent: "#e2c992",
        light: "#f6f6f6",
      },
      fontFamily: {
        sans: ['Jost', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        logo: ['Tangerine', 'cursive'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
