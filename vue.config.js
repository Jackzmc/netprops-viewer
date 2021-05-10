let publicPath = (process.env.PUBLIC_PATH) ? process.env.PUBLIC_PATH : '/'
const path = require('path')
module.exports = {
    // configureWebpack: {
    //     module: {
    //         rules: [
    //             {
    //                 test: /\.xml$/,
    //                 use: [
    //                     { loader: path.resolve(__dirname, 'netprop-converter.js') },
    //                 ],
    //             },
    //         ],
    //     },
    // },
    devServer: {
        disableHostCheck: true
    },
    publicPath
}