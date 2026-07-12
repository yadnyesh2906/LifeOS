/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all app screens and custom component files for Tailwind classes
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
