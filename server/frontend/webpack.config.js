const webpack = require("webpack");
const copyWebpackPlugin = require('copy-webpack-plugin');

const develBuild = process.env.TTY_SHARE_ENV === 'development';

let mainConfig  = {
    entry: {
        'tty-share': './tty-share/main.ts',
    },
    output: {
        path: __dirname + '/public/',
        filename: '[name].js',
    },
    mode: develBuild ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /node_modules.+xterm.+\.map$/,
                use: ['ignore-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      fallback: {
          "buffer": require.resolve("buffer/")
        },
    },
    plugins: [
      new copyWebpackPlugin({
        patterns: [
          {
              from:   'templates'
          },
        ],
    }),
    ],
};

if (develBuild) {
    mainConfig.devtool = 'inline-source-map';
}

module.exports = mainConfig;
