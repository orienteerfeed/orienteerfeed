import path from 'path';
import webpack from 'webpack';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  name: 'oricloud',
  mode: 'development',
  target: 'node',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [
    nodeExternals({
      modulesFromFile: true,
    }),
  ], // in order to ignore all modules in node_modules folder
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env']],
          },
        },
      },
    ],
  },
  devtool: 'source-map',
  stats: {
    colors: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {},
    }),
  ],
};
