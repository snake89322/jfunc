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
```

```javascript
_$.Method.anyOf(/* funs */); // All functions' return judge
```

```javascript
_$.Method.complement(pred); // Complementary set 
```

```javascript
_$.Method.cat(); // Concat 
```

```javascript
_$.Method.construct(head, tail); // Element concat with array
```

```javascript
_$.Method.mapcat(fun, coll); // Dealing elements and concat
```

```javascript
_$.Method.butLast(coll); // Except last element of array
```

```javascript
_$.Method.interpose(inter, coll); // Insert element to every interspace of array
```

```javascript
_$.Method.dereplicate(coll); // Remove repeat elements of array
```

```javascript
_$.Method.project(table, keys); // Select keys of a table and return a new table
```

```javascript
_$.Method.rename(obj, newNames); // Rename key of object
```

```javascript
_$.Method.as(table, newNames); // Rename keys of table
```

```javascript
_$.Method.restrict(table, pred); // Conditions select and return a new table
```

```javascript
_$.Method.plucker(field); // Pluck object's key or coll's number

var best = {title: "Infinite Jest", author: "DFW"};
var getTitle = _$.Method.plucker('title');
getTitle(best) //=> "Infinite Jest"

var books = [{title: "Chthon"}, {stars: 5}, {title: "Botchan"}];
var third = _$.Method.plucker(2);
third(books) //=> {title: "Botchan"}
_.filter(books, getTitle); //=> [{title: "Chthon"}, {title: "Botchan"}]
```

```javascript
_$.Method.finder(valueFun, bestFun, coll); // Compare elements of coll and return bestFun element

_$.Method.finder(_.identity, Math.max, [1, 2, 3, 4, 5]); //=> 5

var people = [
  {name: "Fred", age: 65},
  {name: "Lucy", age: 36},
];

_$.Method.finder(_$.Method.plucker('age'), Math.max, people);
//=> {name: "Fred", age: 65}

_$.Method.finder(
  _$.Method.plucker('name'), 
  function (x, y) { return (x.charAt(0) === "L") ? x : y}, 
  people
);
//=> {name: "Lucy", age: 36}
```

```javascript
_$.Method.best(fun, coll); // Brief of Method.finder

best(function (x, y) { return x > y }, [1, 2, 3, 4, 5]);
//=> 5
```
