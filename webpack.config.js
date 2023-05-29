"use strict";

const path = require("path");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LinkTypePlugin =
  require("html-webpack-link-type-plugin").HtmlWebpackLinkTypePlugin;


module.exports = {
  mode: "development",
  entry: {
    home: './src/js/home.js',
    search: './src/js/search.js'
  },
  output: {
    filename: "[path][name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: 'src/assets/images/[name].[ext]'
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 8080,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home',
      filename: 'home.html',
      template: './src/pages/home/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'Search',
      filename: 'search.html',
      template: './src/pages/search/index.html',
    }),
    new LinkTypePlugin({
      "*.css": "text/css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: "style-loader",
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: "css-loader",
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: () => [autoprefixer],
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
