const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');

// For Typescript
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': 'http://127.0.0.1:5000',
    },
  },
  entry: {
    // For Typescript
    'js/app': ['./src/index.tsx'],
  },
  module: {
    rules: [
      // For Typescript
      {
        test: /\.(ts|tsx)$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    // For typescript
    new ForkTsCheckerWebpackPlugin(),
  ]
};