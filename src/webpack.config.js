    
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, './static'), // Dev Source
  entry: [
    'webpack/hot/only-dev-server',
    './js/index.js',
  ],
  output: {
    path: path.resolve(__dirname, './build'), // Build folder
    filename: '[name].bundle.js',
    publicPath: '' // The Build folder root
  },
  devServer: {
    contentBase: path.resolve(__dirname, './static'), // Dev Source
    watchContentBase: true,
    hot: true,
    inline: true,
    port: 8080
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'index.html',
      template: 'views/index.html' // Index HTML file
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { 
            presets: ['es2015'],
            plugins: ['transform-class-properties']
          }
        }],
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        loaders: 'style-loader!css-loader?minimize=true'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loaders: 'url-loader'
      }
    ],
  },
}
