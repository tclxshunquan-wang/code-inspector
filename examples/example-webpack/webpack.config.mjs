import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import TerserPlugin from 'terser-webpack-plugin';
import { createLaunchEditorMiddleware } from '@hyperse/inspector-middleware';

const isDev = process.env.NODE_ENV === 'development';

const config = {
  context: process.cwd(),
  mode: isDev ? 'development' : 'production',
  devServer: {
    setupMiddlewares(middlewares) {
      /**
       * @hyperse/inspector server config for webpack
       */
      middlewares.unshift(createLaunchEditorMiddleware({}));
      return middlewares;
    },
  },
  entry: {
    main: './src/main.tsx',
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js',
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.css', '.less'],
  },
  cache: {
    type: 'memory',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              '@babel/preset-typescript',
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                },
              ],
            ],
            plugins: [
              resolve(
                fileURLToPath(import.meta.url),
                '../../../packages/inspector-babel-plugin/dist/index.js'
              ),
            ],
          },
        },
      },
    ],
  },
  performance: {
    maxEntrypointSize: 10 * 512 * 1024,
    maxAssetSize: 10 * 512 * 1024,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};

export default config;
