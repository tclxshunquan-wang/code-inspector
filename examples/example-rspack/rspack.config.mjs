import { createLaunchEditorMiddleware } from '@hyperse/inspector-launch-editor';
import { DefinePlugin, HtmlRspackPlugin, ProgressPlugin } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';

const isDev = process.env.NODE_ENV === 'development';
const publicPath = isDev ? '/' : '/rspack/';

const config = {
  context: process.cwd(),
  devServer: {
    setupMiddlewares(middlewares) {
      /**
       * react-dev-inspector server config for rspack
       */
      middlewares.unshift(createLaunchEditorMiddleware({}));
      return middlewares;
    },
  },

  entry: {
    main: './src/main.tsx',
  },
  output: {
    publicPath,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js',
    assetModuleFilename: '[name].[hash].[ext]',
    uniqueName: Math.random().toString(36).slice(2),
  },
  devtool: false,
  optimization: {
    minimize: false,
  },

  resolve: {
    extensions: ['...', '.ts', '.tsx', '.css', '.less'],
  },
  module: {
    rules: [
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
            plugins: ['../../packages/inspector-babel-plugin/dist/index.js'],
          },
        },
      },
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.css$/,
        type: 'css',
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  'tailwindcss/nesting': {},
                  tailwindcss: {},
                  autoprefixer: {},
                },
              },
            },
          },
        ],
      },
      // {
      //   test: /\.tsx?$/,
      //   exclude: [/[\\/]node_modules[\\/]/],
      //   loader: 'builtin:swc-loader',
      //   options: {
      //     sourceMap: isDev,
      //     jsc: {
      //       parser: {
      //         syntax: 'typescript',
      //         decorators: true,
      //         jsx: true,
      //       },
      //       externalHelpers: true,
      //       transform: {
      //         decoratorMetadata: true,
      //         // useDefineForClassFields: true,
      //         react: {
      //           runtime: 'automatic',
      //           development: isDev,
      //           // https://www.rspack.dev/blog/announcing-0-4#deprecating-builtinreactrefresh
      //           refresh: isDev,
      //         },
      //       },
      //     },
      //   },
      // },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new ProgressPlugin({}),
    new HtmlRspackPlugin({
      template: './index.html',
    }),
    isDev && new ReactRefreshPlugin(),
  ],
};

export default config;
