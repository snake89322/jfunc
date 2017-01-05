## jFunc

### 1 开发说明
npm依赖
```sh
npm install
```

功能定制
* 找到 "./src/jfunc.js"

```javascript
import './polyfills.js';

// 功能定制区 - 保留需要功能
export { UserAgent } from './useragent/UserAgent.js';
export { CanvasAdaptIE9 } from './canvas/CanvasAdaptIE9.js';
...

export * from './constants.js';
```

* 项目根目录使用命令行生成jfunc.js
```sh
webpack
```

### 2 通用说明
1、jFunc引入了underscore，" script " 中使用 " _ " 调用。

2、jFunc全局变量root.jFunc 或者 root._$

### 3 功能
*_$.Loader* - Class
>Loader类,加载js(body结尾),css(head结尾),img
>args可以是字符串,数组,json对象
```javascript
new Loader(step, callback, /* ,args*/);
```

*_$.UserAgent* - Object
>列出所有UserAgent，判断匹配情况

*_$.CanvasAdaptIE9()* - Function
>canvas在IE9下进行适配

*_$.Fun* - Object
>jfunc基础方法



