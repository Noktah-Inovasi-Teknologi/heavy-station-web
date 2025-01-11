/** @type {import('tailwindcss').Config} */
import primeui from "tailwindcss-primeui";

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
        fontFamily: {
          kanit: ['Kanit', 'sans-serif'],
          tomorrow: ['Tomorrow', 'sans-serif'],
        }
    }
  },
  plugins: [primeui],
};
