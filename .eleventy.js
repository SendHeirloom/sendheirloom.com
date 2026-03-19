const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, widths, sizes, classes) {
  // widths is a argument specify which sizes to actually encode the image in (defined only in widths)
  // For example "800px 1200px"
  // sizes is a argument specifying which size image to load in which situation.
  // For example "(min-width: 30em) 1200px, 800px"
  let metadata = await Image(src, {
    formats: ["webp", "png", "jpeg"],
    widths: (widths && widths.split(" ")) || [null],
    outputDir: "./_site/img/",
  });

  let imageAttributes = {
    alt,
    sizes,
    class: classes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("stripHtml", (string) => {
    return string.replace(/<[^>]+>/g, "").trim();
  });
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Add plugins
  // This fellow also gives us the absoluteUrl filter:
  eleventyConfig.addPlugin(pluginRss);

  // Human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "d LLL yyyy"
    );
  });

  // To Support .yaml Extension in _data
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  eleventyConfig.addWatchTarget("./_tmp/static/css/*");

  eleventyConfig.addPassthroughCopy({
    "./_tmp/static/css/style.css": "./static/css/style.css",
    "./_tmp/static/css/tailwind.css": "./static/css/tailwind.css",
    "./src/admin/config.yml": "./admin/config.yml",
    "./src/robots.txt": "./robots.txt",
    "./src/llms.txt": "./llms.txt",
    "./src/static/well-known/*": "./.well-known",
  });

  eleventyConfig.addPassthroughCopy("./src/static/images");
  eleventyConfig.addPassthroughCopy("./src/static/js");
  eleventyConfig.addPassthroughCopy("./src/static/audio");
  eleventyConfig.addPassthroughCopy("./src/static/press");
  eleventyConfig.addPassthroughCopy("./src/static/videos");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  eleventyConfig.addPassthroughCopy({
    'node_modules/jquery/dist/jquery.min.js': 'assets/jquery.min.js',
    'node_modules/owl.carousel/dist/owl.carousel.min.js': 'assets/owl.carousel.min.js',

    'node_modules/shopify-buy/index.umd.js': 'assets/shopify-buy.js',

    'node_modules/owl.carousel/dist/assets/owl.carousel.min.css': 'assets/owl.carousel.min.css',
    'node_modules/owl.carousel/dist/assets/owl.theme.default.min.css': 'assets/owl.theme.default.min.css',
  });

  eleventyConfig.addPassthroughCopy("./src/config.json");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addFilter('uppercase', (string) => {
    return string.toUpperCase();
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
