const path = require('path');
const { merge } = require('webpack-merge');
const CommonConfig = require('./webpack.common.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

module.exports = merge(CommonConfig, {
  output: {
    path: path.join(__dirname, '../dev'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dev'),
    },
    port: 3000,
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new HTMLInlineCSSWebpackPlugin(),
  ]
});

