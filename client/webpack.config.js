const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let config = {
  entry: { main: './src/index.tsx' },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.resolve('./src'), path.resolve('./node_modules')]
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    port: 3000,
    historyApiFallback: true
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.(graphql|gql)$/, loader: 'graphql-tag/loader', exclude: /node_modules/ },
      {
        test: /\.scss$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'medias/[name].[hash].[ext]'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[hash].[ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/style.[contenthash].css'
    }),
    new CopyWebpackPlugin(['public']),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: './src/index.html',
      filename: 'index.html',
      favicon: './public/favicon.ico'
    }),
    new CleanWebpackPlugin('build', {}),
    new CompressionPlugin({ algorithm: 'gzip' })
  ]
};

module.exports = config;
