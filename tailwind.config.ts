import { type Config } from "tailwindcss";


export default {
  content: ["./src/**/*.tsx", "./src/**/*.{html,js}",
    "./node_modules/tw-elements/dist/js/**/*.js"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "light", // name of one of the included themes for dark mode
    base: false, // applies background color and foreground color for root element by default
    styled: false, // include daisyUI colors and design decisions for all components
    utils: false, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
  theme: {
    darkMode: "class",
    extend: {
      screens: {
        'phone': { 'max': '767px' },
        'tablet': { 'min': '768px', 'max': '991px' },
        'laptop': { 'min': '992px', 'max': '1199px' },
        'desktop': { 'min': '1200px' },
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