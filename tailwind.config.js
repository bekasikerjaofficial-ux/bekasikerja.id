/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Design system: heylaw-design-system (BCA skin) — token biru #005cab
      colors: {
        brand: {
          blue: '#005cab',
          'blue-dark': '#004a89',
          'blue-light': '#00b6f1',
          red: '#f80000',
          teal: '#00ceb7',
          gold: '#f49c31',
          navy: '#212529',
        },
        // Bootstrap gray (matches BCA app.css) — dipakai bareng utility class
        bca: {
          900: '#212529', 800: '#343a40', 700: '#495057', 600: '#6c757d',
          500: '#adb5bd', 400: '#ced4da', 300: '#dee2e6', 200: '#e9ecef',
          100: '#f8f9fa', 50: '#f8f9fa',
        },
      },
      fontFamily: {
        // HeyLaw/BCA design system: Open Sans untuk semua (body + display)
        sans: ['Open Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Open Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '16px', '3xl': '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.1)',
        'card-hover': '0 8px 24px rgba(0,0,0,.12)',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};
