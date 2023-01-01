const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseUrl = 'https://www.freefitnesstools.com';
const paths = [
  '',
  '/max-lifts/',
  '/tdee/'
];

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/js/main.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][contenthash].js',
    clean: true,
    assetModuleFilename: '[name][ext]',
    publicPath: '/',
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: false,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|webmanifest)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Free Fitness Tools',
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new HtmlWebpackPlugin({
      title: '404 Not Found',
      filename: '404.html',
      template: 'src/404.html',
    }),
    new HtmlWebpackPlugin({
      title: 'Max Lift Calculator',
      filename: 'max-lifts/index.html',
      template: 'src/html/max-lifts.html',
    }),
    new HtmlWebpackPlugin({
      title: 'TDEE Calculator',
      filename: 'tdee/index.html',
      template: 'src/html/tdee.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
    }),
    new SitemapPlugin({
      base: baseUrl,
      paths,
      options: {
        lastmod: true,
        changefreq: 'monthly',
        priority: 0.4,
        skipgzip: true
      }
    }),
    new MiniCssExtractPlugin({
      'filename': '[name].css',
    }),
  ],
}