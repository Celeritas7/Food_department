/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, earthy palette for a cooking app
        'cream': '#FDF8F3',
        'warm-white': '#FAF7F2',
        'terracotta': '#C4704F',
        'terracotta-dark': '#A85A3B',
        'sage': '#87A878',
        'sage-dark': '#6B8F5B',
        'charcoal': '#2D3436',
        'warm-gray': '#636E72',
        'light-gray': '#B2BEC3',
        'butter': '#F6E58D',
        'tomato': '#E55039',
        'tomato-light': '#FFEAA7',
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'body': ['system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
