'use strict';

var webpack = require("webpack");

module.exports = {
    entry: "./js/app.js",
    output: {
        path: __dirname + '/dist',
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};