module.exports = {
  plugins: [
    require(`tailwindcss`)(`./tailwind.config.js`),
    require(`autoprefixer`),
    require(`postcss-import`),
    ...(process.env.NODE_ENV === "production"
      ? [
          require(`cssnano`)({
            preset: "default",
          }),
        ]
      : []),
  ],
};
