// tailwind.config.js
// const colors = require("tailwindcss/colors");

module.exports = {
  // prefix: "tw-",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    // color: {
    //   white: colors.white,
    //   offWhite: colors.coolGray[50],

    //   bgPrimary: colors.coolGray[200],
    //   bgSecondary: colors.coolGray[400],

    //   primary: "#2563EB",
    //   primaryDark: "#1E40AF",
    //   primaryLight: "#60A5FA",
    //   // secondary: ,
    //   // colors.blue[400],
    //   // tertiary: colors.blue[200],
    // },
    fontFamily: {
      regular: ['"Roboto"'],
      title: ['"Ubuntu"'],
    },

    // backgroundColor: (theme) => ({
    //   ...theme("colors"),
    // }),
    extend: {
      colors: {
        primary: {
          100: "#EBF5FF",
          200: "#C2E0FF",
          300: "#99CCFF",
          400: "#70B8FF",
          500: "#47A3FF",
          600: "#1F8FFF",
          700: "#007AF5",
          800: "#0066CC",
          900: "#0052A3",
        },
        // secondary: "#ICA7EC",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
