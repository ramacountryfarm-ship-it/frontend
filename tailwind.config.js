/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#81251d',
          highlight: '#D5B251',
          pearl: '#F2EEE8'
        },
        surface: {
          bg: '#dce1e9',
          card: '#ffffff',
          muted: '#eef0f4',
          input: '#f0f2f5'
        },
        ink: {
          dark: '#1a1d26',
          body: '#3d4251',
          muted: '#8a8fa0',
          faint: '#b4b9c8'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'nav': '0 1px 8px rgba(0, 0, 0, 0.08)',
        'soft': '0 1px 4px rgba(0, 0, 0, 0.04)',
        'elevated': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'dropdown': '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
