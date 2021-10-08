module.exports = {
  mode: 'jit',
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
      serif: 'Aleo,Georgia,Times,"Times New Roman",serif',
      sans: 'Avenir,"Avenir Next","Segoe UI",system-ui,Helvetica,"Helvetica Neue",sans-serif'
    }
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")]
};
