const path = require('path');
const webpack = require('webpack');
require('dotenv').config();
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development', // For production, change this to 'production'
  devtool: 'source-map', // Use source-map instead of eval-based source maps
  entry: {
    content: './src/content.js',
    background: './src/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      // Inject the API key into your code.
      'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/popup.html', to: 'popup.html' },
        { from: 'src/icon.png', to: 'icon.png' }, // If you have an icon
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Optional: use Babel if you need to transpile your code
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
