import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
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