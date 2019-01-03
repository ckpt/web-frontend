const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// assets.js
const Assets = require('./assets');

module.exports = {
    entry: {
        app: "./js/app.js",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: "bundle.min.js"
    },
    /* optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
 */    plugins: [
        new CopyWebpackPlugin(
            Assets.JS.map(asset => {
                return {
                    from: path.resolve(__dirname, `./node_modules/${asset}`),
                    to: path.resolve(__dirname, './dist/js')
                };
            })),
        new CopyWebpackPlugin(
            Assets.CSS.map(asset => {
                return {
                    from: path.resolve(__dirname, `./node_modules/${asset}`),
                    to: path.resolve(__dirname, './dist/css')
                };
            })),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './node_modules/font-awesome/fonts'),
                to: path.resolve(__dirname, "./dist/fonts")
            }
        ]),
    ]
};