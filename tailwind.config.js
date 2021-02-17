module.exports = {
  purge: {
    mode: "all",
    content: ["./**/*.html"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
    },
    fontFamily: {
      heading: 'Aleo, Georgia, Times, "Times New Roman", serif',
      body: 'Avenir, "Avenir Next", "Segoe UI", system-ui, Helvetica, "Helvetica Neue", sans-serif'
    }
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")]
};
