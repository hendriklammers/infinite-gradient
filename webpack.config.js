var path = require('path')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'src/index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0']
          }
        }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  performance: {
    hints: false
  },
  devServer: {
    contentBase: __dirname + '/public',
    inline: true,
    port: 8000
  }
}
