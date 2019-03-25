/* eslint-disable */
const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const appConfig = require("../config");
const configUtils = require("../utils");

module.exports = env => {
  const args = configUtils.parseArgs(env, appConfig);
  const { SRC_PATH: src, DIST_PATH: dist } = appConfig;
  const { skin, appName } = args;
  const paths = {
    script: `${src}/index.jsx`,
    style: [src].concat(`${src}/skins/${skin}`),
    html: `${src}/index.html`
  };

  const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      parallel: true,
      output: {
        comments: false
      }
    }),
    new CompressionPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: 'static/app/js/[name].[chunkhash].js.map',
      columns: false,
    }),
    new webpack.HashedModuleIdsPlugin(),
    // This plugin moves all the CSS into a separate stylesheet
    new ExtractTextPlugin({
      filename: "static/app/css/all.css",
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: 'static/app/js/vendor.[chunkhash].js',
      minChunks: module => {
        // This assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),
    new HtmlWebpackPlugin({
      filename: "app.html",
      title: "Patternex",
      template: paths.html,
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true
      }
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
      app: paths.script
    },
    output: {
      filename: "static/app/js/[name].[chunkhash].js",
      path: `${dist}`,
      publicPath: "/"
    },
    performance: {
      hints: false
    },
    resolve: {
      modules: [src, src, "node_modules"],
      extensions: [".js", ".jsx", ".scss"]
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          use: ["babel-loader"],
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: "css-loader"
              },
              {
                loader: "sass-loader",
                options: {
                  includePaths: [
                    path.resolve("node_modules/xbem/src/"),
                    path.resolve(`src/skins/shared`),
                    path.resolve(`src/skins/${skin}`)
                  ]
                }
              }
            ]
          })
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
                name: "static/app/public/[hash].[ext]"
              }
            }
          ]
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use:
            "url-loader?limit=10000&mimetype=application/font-woff&name=static/app/[name].[ext]"
        }
      ]
    },
    plugins: plugins,
    stats: {
      children: false
    }
  };
};
