const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

function resolveURL(env) {
    switch (env) {
        case 'development':
            return JSON.stringify('http://localhost:19999');
        case 'production':
            return JSON.stringify('https://offerpoint.zikra.xyz');
    }
}

module.exports = function(env){
    return {
        entry: "./src/index.js",
        output:{
            path: path.resolve(__dirname, 'build'),
            filename: '[contenthash].js',
            clean: true,
            publicPath : '/'
        },
        mode:'none',
        module:{
            rules: [
                {
                    test: /\.js$/i,
                    use:[
                        {
                            loader: 'babel-loader',
                            options:{
                                presets: ['@babel/preset-react']
                            }
                        }
                    ]
                },
                {
                    test: /\.s?css$/i,
                    use: [
                        {loader: MiniCssExtractPlugin.loader},
                        {loader: 'css-loader'},
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require('sass'),
                                additionalData: '$baseURL: "http://localhost:19999"; ',
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpeg|jpg|gif)$/i,
                    use: [{loader: 'file-loader'}]
                }
            ]
        },
        plugins:[
            new MiniCssExtractPlugin({filename: '[contenthash].css'}),
            new HtmlWebPackPlugin({
                template: './src/index.html',
                inject:'body'
            }),
            new Dotenv({
                path : `./environments/${env.config}.env`,
                safe : true 
            }),
            new CopyPlugin({
                patterns: [
                    { from: './src/assets/images', to: 'assets/images' }
                ],
            })
        ],
        devServer: {
            static: path.resolve(__dirname, 'build'),
            compress: true,
            port: 19999,
            open: { app: 'chrome' },
            historyApiFallback: true
        },
    
    }
};