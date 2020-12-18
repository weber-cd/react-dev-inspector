// this webpack file that is config to run examples demo
const { DefinePlugin } = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { createLaunchEditorMiddleware } = require('./../plugins')
module.exports = {
  mode: 'development',
  entry: './examples/index.tsx',
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'], // @babel/preset-stage-0
              plugins: ['@babel/plugin-proposal-class-properties']
            }
          },
          {
            loader: './plugins/inspector-loader',
          }
      ]
      },
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './examples/index.html'
    }),
    new DefinePlugin({
      'process.env.PWD': JSON.stringify(process.cwd())
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devServer: {
    before: (app) => {
      app.use(createLaunchEditorMiddleware()) // to open file in IDE according to the request
    }
  }
}