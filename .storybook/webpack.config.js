const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fs = require("fs");

module.exports = ({config}) => {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  )
  config.resolve.modules = [
    ...(config.resolve.modules || []),
    path.resolve(__dirname, "../src"),
    'node_modules'
  ];

  config.resolve.alias = {
    ...config.resolve.alias,
    "../../theme.config$": path.join(__dirname, "../styleguide/theme.config"),
    "../semantic-ui/site": path.join(__dirname, "../styleguide/site")
  }
  config.module.rules = [
    {
      test: /\.less$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              mode: "local",
              auto: true,
              exportGlobals: true,
              localIdentName: "[local]--[hash:base64:5]",
            },
          },
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              math: 'always',
            },
            additionalData: (content) => {
              const variables = fs.readFileSync('src/components/variables.less');
              return variables + content;
            },
          },
        },
      ],
    },
    {
      test: /\.(png|jpe?g|gif|jp2|webp)$/,
      type: 'asset/resource',
      generator: {
        filename: 'img/[name][ext]'
      }
    },
    {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name][ext]'
      }
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
    {test: /\.css$/i, use: ['style-loader', 'css-loader']}
  ];
  config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx');
  config.profile = true;
  config.parallelism = 1;
  return config;
};
