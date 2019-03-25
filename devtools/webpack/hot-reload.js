/* eslint-disable */
const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const appConfig = require("../config");
const configUtils = require("../utils");

module.exports = env => {
  const args = configUtils.parseArgs(env, appConfig);
  const { SRC_PATH: src, DIST_PATH: dist, port, address } = appConfig;
  const { skin, appName } = args;
  const paths = {
    script: `${src}/index.jsx`,
    style: [src].concat(`${src}/skins/${skin}`),
    html: `${src}/index.html`
  };
  const sassLoaders = [
    "style-loader",
    "css-loader?sourceMap",
    "sass-loader?includePaths[]=" +
      `${path.resolve("node_modules/xbem/src/")}` +
      `&includePaths[]=${path.resolve("node_modules/react-dates/lib/css/")}` +
      `&includePaths[]=${src}/skins/${skin}` +
      `&includePaths[]=${src}/skins/shared/`
  ];
  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ["react", "immutable", "redux"],
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || "false"))
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      title: "Patternex",
      template: paths.html,
    }),
    new FaviconsWebpackPlugin({
      logo: 'favicon.png',
      inject: true,
      title: 'PatternEx',
      developerName: 'Pattern Ex',
      developerURL: 'https://www.patternex.com/',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: true,
        yandex: false,
        windows: false,
      },
    }),
  ];

  return {
    entry: {
      app:
      [
        "webpack/hot/only-dev-server",
        paths.script,
        `webpack-dev-server/client?http://${appConfig.address}:${appConfig.port}`
      ],
      react: [
        "react",
        "react-dom",
        "react-router"
      ],
    },
    output: {
      filename: "static/app/js/[name].[hash].js",
      path: `${dist}`,
      publicPath: "/"
    },
    performance: {
      hints: false
    },
    resolve: {
      modules: [src, "node_modules"],
      extensions: [".js", ".jsx", ".scss"]
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          use: ["babel-loader"],
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: sassLoaders,
          include: paths.style
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ],
          include: [
            path.resolve("node_modules/xbem/src/"),
            path.resolve(`src/skins/shared`),
            path.resolve(`src/skins/${skin}`)
          ]
        },
        {
          test: /(\.(json))/,
          use: [
            {
              loader: 'json-loader'
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|ttf|eot|svg)(\?[a-z0-9=&.]+)?$/i,
          use: [
            {
              loader: "file-loader",
              query: {
                hash: "sha512",
                digest: "hex",
                name: "static/app/public/[name].[ext]"
              }
            }
          ]
        },
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader?limit=10000&mimetype=application/font-woff&name=static/[name].[ext]"
        },
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader?limit=10000&mimetype=application/font-woff&name=static/[name].[ext]"
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader?limit=10000&mimetype=application/octet-stream&name=static/[name].[ext]"
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader?limit=10000&mimetype=application/vnd.ms-fontobject&name=static/[name].[ext]"
        },
      ]
    },
    plugins,
    devServer: {
      port,
      historyApiFallback: true,
      hot: true,
      inline: true,
      compress: false,
      host: address,
      disableHostCheck: true,
      contentBase: src,
      stats: {
        assets: false,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: "\u001b[32m"
        }
      }
    }
  };
};
