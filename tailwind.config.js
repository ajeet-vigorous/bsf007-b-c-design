/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 👇 This applies your custom font globally (font-sans)
        sans: [
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        // 'primary': '#9F4636',
        // 'primary90': '#9F4636E6',
        // 'primary65': '#0088cca5',
        // 'matchLagai': '#72bbef',
        // 'matchKhai': '#FAA9BA',
        // 'result-color': '#355e3b',
        // 'primary-text': '#ffffff',
        // 'secondary': '#6C2D2C',
        // 'secondary70': '#6C2D2CB3',
        // 'secondary85': '#6C2D2CD9',
        // 'input-border': '#dbdbdb',
        // 'input-border-hover': '#b5b5b5',
        // 'sidebar-menu-link-bg': '#bbbbbb',
        // 'sidebar-menu-link-color': '#000000',
        // 'sidebar-menu-link-border': '#9e9e9e',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 5s linear infinite',
        slideInFromTop: 'slideInFromTop 0.5s ease-out forwards',
      },
      width: {
        'calc-custom': 'calc(100% - 452px)',
      },
    },
  },
  plugins: [],
}
