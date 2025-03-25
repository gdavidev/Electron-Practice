const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/renderer.js',  // Entry file (your frontend code)
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),  // Output to /dist/bundle.js
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css', // Outputs CSS as a separate file
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',  // Your source HTML
      filename: 'index.html',        // Output in /dist/index.html
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    alias: {
      '@libs': path.resolve(__dirname, './src/libs/'),
      '@classes': path.resolve(__dirname, './src/classes/')
    },
  },
};