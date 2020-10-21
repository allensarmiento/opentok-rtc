const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    index: 'landing.html',
    port: 9000,
    writeToDisk: true
  },
  entry: {
    'landing': './src/js/landing.js',
    'room': './src/js/room.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          variable: 'data',
          interpolate: '\\{\\{(.+?)\\}\\}',
          evaluate: '\\[\\[(.+?)\\[\\]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            plugins: ['transform-class-properties']
          }
        }
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: ['file-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'landing.html',
      chunks: ['landing'],
      title: 'Landing Page',
      description: 'Landing page',
      template: 'src/templates/landing.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'room.html',
      chunks: ['room'],
      title: 'Room Page',
      description: 'Room page',
      template: 'src/templates/room.ejs'
    }),
  ]
};

