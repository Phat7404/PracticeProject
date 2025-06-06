const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  externals: [nodeExternals()],
  mode: 'production',
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@nestjs/microservices': path.resolve(__dirname, 'node_modules/@nestjs/microservices'),
      '@nestjs/websockets': path.resolve(__dirname, 'node_modules/@nestjs/websockets'),
      '@nestjs/platform-express': path.resolve(__dirname, 'node_modules/@nestjs/platform-express'),
    },
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}; 