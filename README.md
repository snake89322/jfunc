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

*_$.UserAgent* - Object
>列出所有UserAgent，判断匹配情况

*_$.CanvasAdaptIE9()* - Function
>canvas在IE9下进行适配

*_$.Method* - Object
>jfunc基础方法
```javascript
_$.Method.allOf(/* funs */); // All functions' return judge

_$.Method.anyOf(/* funs */); // All functions' return judge

_$.Method.complement(pred); // Complementary set 

_$.Method.cat(); // Concat 

_$.Method.construct(head, tail); // Element concat with array

_$.Method.mapcat(fun, coll); // Dealing elements and concat

_$.Method.butLast(coll); // Except last element of array

_$.Method.interpose(inter, coll); // Insert element to every interspace of array

_$.Method.dereplicate(coll); // Remove repeat elements of array

_$.Method.project(table, keys); // Select keys of a table and return a new table

_$.Method.rename(obj, newNames); // Rename key of object

_$.Method.as(table, newNames); // Rename keys of table

_$.Method.restrict(table, pred); // Conditions select and return a new table
```


