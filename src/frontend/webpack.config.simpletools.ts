// @ts-ignore
import path from 'path';
import * as webpack from 'webpack';
// @ts-ignore
import * as webpackDevServer from 'webpack-dev-server';
import * as fs from 'fs';
// @ts-ignore
import HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const host = process.env.HOST || 'localhost';

const child_process = require('child_process');

function git(command: string) {
  return child_process.execSync(`git ${command}`, {encoding: 'utf8'}).trim();
}

//https://github.com/webpack/webpack/blob/main/examples/multi-compiler/webpack.config.js
//https://stackoverflow.com/a/38132106


module.exports = (env: any, argv: any) => {
  const config: webpack.Configuration = {
    entry: {
      simpletools: './src/simpletools/index.ts',
    },
    module: {
      rules: [
        {
          test: /\.(less)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  mode: 'local',
                  auto: true,
                  exportGlobals: true,
                  localIdentName: '[local]--[hash:base64:5]',
                },
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  math: 'always',
                },
                additionalData: (content: string) => {
                  const variables = fs.readFileSync('src/common/components/variables.less');
                  return variables + content;
                },
              },
            },
          ],
        },
        {
          test: /\.csv$/,
          use: ['csv-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]',
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {test: /\.css$/i, use: ['style-loader', 'css-loader']},
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[fullhash:8].css',
      }),
      new HtmlWebpackPlugin({
        title: 'simpletools',
        template: './public/simpletools/index.html',
        filename: 'index.html',
      }),
      new webpack.EnvironmentPlugin({
        GIT_RELEASE: git('describe --tags --always --dirty=+'),
        GIT_RELEASE_DATE: git('log -1 --format=%aI'),
        MOCKSERVER_ENABLED: !!env.mockserver,
      }),
      new CopyPlugin({
        patterns: [{
          from: 'public/simpletools',
          to: './',
          globOptions: {
            ignore: [
              '**/index.html',
            ],
          },
        }],
      }),
      new Dotenv(),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.css', '.json'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        '../../theme.config$': path.join(__dirname, 'styleguide/theme.config'),
        '../semantic-ui/site': path.join(__dirname, 'styleguide/site'),
      },
      // for react 17 and webpack 5 compatibility
      fallback: {
        'react/jsx-runtime': 'react/jsx-runtime.js',
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist/simpletools'),
      publicPath: '/',
      filename: '[name].[fullhash:8].js',
      chunkFilename: '[name].[fullhash:8].js',
    },
  };

  if ('development' === argv.mode) {
    config.devtool = 'inline-source-map';
    config.mode = argv.mode;
    config.devServer = {
      allowedHosts: 'all',
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      static: {
        directory: path.resolve(__dirname, 'public/simpletools'),
        watch: true,
      },
      compress: true,
      host: host,
      port: 4000,
    };
  }
  if ('production' === argv.mode) {
    config.mode = 'production';
    config.devtool = 'source-map';
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          test: [
            /\.less$/i,
            /\.(js)$/,
          ],
        }),
        new CssMinimizerPlugin({
          test: /\.css$/i,
        }),
      ],
      minimize: true,
      splitChunks: {
        chunks: 'all',
      },
    };
  }
  return config;
};
