import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        'custom-changa-one': ['Changa One', 'sans-serif'],
        'custom-lexend': ['Lexend', 'sans-serif'],
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
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