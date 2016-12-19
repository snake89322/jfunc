###webpack&babel-compile

compile floder:
npm install --save babel-loader
npm install --save babel-core
npm install --save-dev babel-preset-es2015

create webpack.config.js

module.exports = {
    // configuration
    entry: "./es2015/index.js", //代表入口(总)文件，可以写多个
    output: {
        path: "./es2015/", //输出文件夹
        filename: "index-webpack.js" //最终打包生成的文件名
    },
    module: {
        loaders: [
            {
                test: /\.js|jsx$/, //是一个正则，代表js或者jsx后缀的文件要使用下面的loader
                loader: "babel",
                query: {presets: ['es2015']}
            }

        ]
    }
};

这样我们就可以利用webpack打包es2015的js了，终端执行webpack后，es2015文件夹下生成index-webpack.js，然后我们在html中引入

reference:
https://segmentfault.com/q/1010000006005280/a-1020000006008290
http://blog.csdn.net/github_26672553/article/details/52089824
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
