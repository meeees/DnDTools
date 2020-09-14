const path = require('path');
const webpack = require('webpack');
const htmlwebpack = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets/'
        }
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '@assets': path.resolve(__dirname, 'public/'),
      '@src': path.resolve(__dirname, 'src/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/')
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/DnDTools/',
    filename: 'dndtools.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new htmlwebpack({
      hash: true,
      filename: './index.html',
      template: 'public/prod_index.html',
      favicon: './public/favicon.ico'
    })
  ]
};
