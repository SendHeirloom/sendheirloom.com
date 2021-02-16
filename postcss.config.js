module.exports = {
  plugins: [
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
