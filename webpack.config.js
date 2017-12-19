var path = require('path');
var webpack = require('webpack');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: ["./client/index.js"]
    },
    output: {
        path: path.resolve(__dirname, "public/js"),
        publicPath: "/public/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
            // ,
            // {
            //     test: /\.scss$/,
            //     use: [{
            //         loader: "style-loader" // creates style nodes from JS strings
            //     }, {
            //         loader: "css-loader" // translates css into CommonJS
            //     }, {
            //         loader: "resolve-url-loader" // translates css into CommonJS
            //     }, {
            //         loader: "sass-loader" // compiles Sass to css
            //     }]
            // }
        ]
    }
    // ,
    // plugins: [
    //     new ExtractTextPlugin('public/css/bundle.css')
    // ]
};/**
 * Created by mikey on 11.05.17.
 */
