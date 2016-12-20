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

*_$.Fun* - Object
>jfunc基础方法

```javascript
_$.Fun.allOf(/* funs */); // All functions' return judge
```

```javascript
_$.Fun.anyOf(/* funs */); // All functions' return judge
```

```javascript
_$.Fun.complement(pred); // Complementary set 
```

```javascript
_$.Fun.cat(); // Concat 
```

```javascript
_$.Fun.construct(head, tail); // Element concat with array
```

```javascript
_$.Fun.mapcat(fun, coll); // Dealing elements and concat
```

```javascript
_$.Fun.butLast(coll); // Except last element of array
```

```javascript
_$.Fun.interpose(inter, coll); // Insert element to every interspace of array
```

```javascript
_$.Fun.dereplicate(coll); // Remove repeat elements of array
```

```javascript
_$.Fun.project(table, keys); // Select keys of a table and return a new table
```

```javascript
_$.Fun.rename(obj, newNames); // Rename key of object
```

```javascript
_$.Fun.as(table, newNames); // Rename keys of table
```

```javascript
_$.Fun.restrict(table, pred); // Conditions select and return a new table
```

```javascript
_$.Fun.plucker(field); // Pluck object's key or coll's number

var best = {title: "Infinite Jest", author: "DFW"};
var getTitle = _$.Fun.plucker('title');
getTitle(best); //=> "Infinite Jest"

var books = [{title: "Chthon"}, {stars: 5}, {title: "Botchan"}];
var third = _$.Fun.plucker(2);
third(books); //=> {title: "Botchan"}
_.filter(books, getTitle); //=> [{title: "Chthon"}, {title: "Botchan"}]
```

```javascript
_$.Fun.finder(valueFun, bestFun, coll); // Compare elements of coll and return bestFun element

_$.Fun.finder(_.identity, Math.max, [1, 2, 3, 4, 5]); //=> 5

var people = [
  {name: "Fred", age: 65},
  {name: "Lucy", age: 36},
];

_$.Fun.finder(_$.Fun.plucker('age'), Math.max, people);
//=> {name: "Fred", age: 65}

_$.Fun.finder(
  _$.Fun.plucker('name'), 
  function (x, y) { return (x.charAt(0) === "L") ? x : y}, 
  people
);
//=> {name: "Lucy", age: 36}
```

```javascript
_$.Fun.best(fun, coll); // Brief of Fun.finder

_$.Fun.best(function (x, y) { return x > y }, [1, 2, 3, 4, 5]);
//=> 5
```

```javascript
_$.Fun.repeatly(times, fun); // Repeat a fun with times

_$.Fun.repeatly(3, function () { return "Odelay!"; });
//=> ["Odelay!", "Odelay!", "Odelay!"]
```

```javascript
_$.Fun.iterateUntil(fun, check, init); // Evolution for Fun.repeatly

_$.Fun.iterateUntil(
  function (n) { return n+n; },
  function (n) { return n <= 1024 },
  1
);
//=> [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]
```

```javascript
_$.Fun.always(value); // Combinator function
```

```javascript
_$.Fun.invoker(name, method); // Receive a method，that apply to defined targets

var rev = _$.Fun.invoker('reverse', Array.prototype.reverse);
_.map([[1, 2, 3]], rev); //=> [[3, 2, 1]]
```

```javascript
_$.Fun.fnull(fun /*, defaults*/); // Any null or undefined args use default to replace

var nums = [1, 2, 3, null, 5];
var safeMult = _$.Fun.fnull(function (total, n) { return total * n; }, 1, 1);
_.reduce(nums, safeMult); //=> 30
```

```javascript
_$.Fun.defaults(conf); // Object default config

function doSomething (config) {
  var lookup = _$.Fun.defaults({critical: 108});
  
  return lookup(config, 'critical');
};
doSomething({critical: 9}); //=> 9
doSomething({}); //=> 108
```

```javascript
_$.Fun.checker(/* validators */); // Fun that receive validators and return true or false

var alwaysPasses = _$.Fun.checker(_$.Fun.always(true), _$.Fun.always(true));
alwaysPasses({}); //=> []

var fails = _$.Fun.always(false);
fails.message = "a failuere in life";
var alwaysFails = _$.Fun.checker(fails);
alwaysFails({}); //=> ["a failuere in life"]
```

```javascript
_$.Fun.validator = function (message, fun); // Special API that create validators to grace Fun.checker

var gonnaFail = _$.Fun.checker(_$.Fun.validator("ZOMG!", _$.Fun.always(false)));
gonnaFail(100); //=> ["ZOMG!"]

function aMap (obj) { return _.isObject(obj); };
var checkCommand = _$.Fun.checker(_$.Fun.validator("must be a map", aMap));
checkCommand({}); //=> []
checkCommand(42); //=> ["must be a map"]
```

```javascript
_$.Fun.hasKeys = function (/* keys */); // Validate object has keys

function aMap (obj) { return _.isObject(obj); };
var checkCommand = _$.Fun.checker(
  _$.Fun.validator("must be a map", aMap),
  _$.Fun.hasKeys("msg", "type")
);
checkCommand({msg: "blah", type: "display"}); //=> []
checkCommand(32); //=> ["must be a map", "Must have values for keys: msg type"]
checkCommand({}); //=> ["Must have values for keys: msg type"]
```