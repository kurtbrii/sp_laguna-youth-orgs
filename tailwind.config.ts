import { type Config } from "tailwindcss";


export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      screens: {
        'phone': { 'min': '0px', 'max': '639px' },
        // => @media (min-width: 375px and max-width: 639px) { ... }

        'tablet': { 'min': '640px', 'max': '1023px' },
        // => @media (min-width: 640px and max-width: 1023px) { ... }

        'laptop': { 'min': '1024px', 'max': '1279px' },
        // => @media (min-width: 1024px and max-width: 1279px) { ... }

        'desktop': { 'min': '1280px', 'max': '1535px' },
        // => @media (min-width: 1280px and max-width: 1535px) { ... }
      },
      fontFamily: {
        'custom-epilogue': ["Epilogue", "sans-serif"],
        'custom-lexend': ['Lexend', 'sans-serif'],

        // 'changa': ['changa one']
      },
      colors: {
        // customFontChanga: "var(--changa)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        cutomRed: "var(--red)",
        customBlack: {
          100: '#021422',
          75: 'rgba(2, 20, 34, 0.75)',
          50: 'rgba(2, 20, 34, 0.5)',
          25: 'rgba(2, 20, 34, 0.25)',
          10: 'rgba(2, 20, 34, 0.1)',
        },
      }
    },
  },
  // plugins: [
  //   require('tailwindcss-border-gradient-radius'),
  // ],
} satisfies Config;