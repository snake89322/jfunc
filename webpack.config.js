var webpack = require('webpack');
module.exports = {
    // configuration
    entry: { //代表入口(总)文件，可以写多个
       jfunc: "./build/build.js", 
    },
    output: {
        path: "./build/", //输出文件夹
        filename: "jfunc.js" //最终打包生成的文件名
    },
    module: {
        loaders: [
            {
                test: /\.js|jsx$/, //是一个正则，代表js或者jsx后缀的文件要使用下面的loader
                loader: "babel",
                query: {
                	presets: ['es2015'],
                	plugins: [
                		"transform-es2015-modules-simple-commonjs",
                	],
                }
            }

        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ]
};