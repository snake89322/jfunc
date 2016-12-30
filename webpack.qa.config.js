module.exports = {
    // any necessary webpack configuration
    devtool: 'inline-source-map',
    module:{
        loaders:[{
            test:/\.js$/,
            loader:'babel',
            query:{
                compact: false,
                presets:['es2015'],
                plugins: ['istanbul'], // kamra-coverage覆盖率测试关键插件
            },
            exclude:[
               /node_modules/,
            ]
        }]
    }
};