/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-green": "#65B3AD",
        "primary-black": "#15171A",
        "primary-gray": "#1A1E23",
        "secondary-gray": "rgba(255, 255, 255, 0.13)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
