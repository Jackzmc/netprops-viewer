let publicPath = (process.env.PUBLIC_PATH) ? process.env.PUBLIC_PATH : '/'
module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.xml$/i,
                    use: 'raw-loader',
                },
            ],
        },
    },
    devServer: {
        disableHostCheck: true
    },
    publicPath
}