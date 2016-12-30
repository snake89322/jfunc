## jfunc基础方法

```javascript
// Infomation tip
_$.Fun.fail(); 
_$.Fun.warn(); 
_$.Fun.note(); 
```

```javascript
_$.Fun.allOf(/* funs */); // All functions' return judge
```

```javascript
_$.Fun.anyOf(/* funs */); // All functions' return judge
```

```javascript
_$.Fun.isIndexed(data); // Judge if array index
```

```javascript
_$.Fun.nth(a, index); // Abstract array width index

var letters = ['a', 'b', 'c'];
_$.Fun.nth(letters, 1); //=> "b"
_$.Fun.nth("abc", 0); //=> "a"
_$.Fun.nth({}, 2); //=> "Not supported on non-indexed type"
_$.Fun.nth(letters, 4000); //=> "Index value is out of bounds"
_$.Fun.nth(letters, "aaa"); //=> "Expected a number as the index"
```

```javascript
_$.Fun.second(a); // Second element of array
```

```javascript
_$.Fun.complement(pred); // Complementary set 
```

```javascript
_$.Fun.isEven(n); // Is even
```

```javascript
_$.Fun.isOdd(n); // Is odd
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
_$.Fun.sqr = function (n); // sqr

_$.Fun.sqr(10); //=> 100
_$.Fun.sqr(0); // Error: cannot be zero
_$.Fun.sqr(''); // Error: arg must be a number
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

```javascript
_$.Fun.stringReverse = function (s); // Reverse string

_$.Fun.stringReverse("abc"); //=> "cba"
_$.Fun.stringReverse(1); //=> undefined
```

```javascript
_$.Fun.dispatch = function (/* funs */); // Try to call evey fun to target until return undefined 

var str = _$.Fun.dispatch(
  _$.Fun.invoker('toString', Array.prototype.toString),
  _$.Fun.invoker('toString', String.prototype.toString)
);
str("a"); //=> "a"
str(_.range(10)); //=> "0,1,2,3,4,5,6,7,8,9"

var rev = _$.Fun.dispatch(
  _$.Fun.invoker('reverse', Array.prototype.reverse),
  _$.Fun.stringReverse
);
rev([1, 2, 3]); //=> [3, 2, 1]
rev("abc"); //=> "cba"

var sillyReverse = _$.Fun.dispatch(rev, _$.Fun.always(42));
sillyReverse([1, 2, 3]); //=> [3, 2, 1]
sillyReverse("abc"); //=> "cba"
sillyReverse(10000); //=> 42

var notify = changeView = shutdown = _.identity;
function isa (type, action) {
  return function (obj) {
    if(type === obj.type)
      return action(obj);
  };
};
var performCommand = _$.Fun.dispatch(
  isa('notify', function (obj) { return notify(obj.message); }),
  isa('join', function (obj) { return changeView(obj.target); }),
  function (obj) { return _.identity(obj.type) }
);
var performAdminCommand = _$.Fun.dispatch(
  isa('kill', function (obj) { return shutdown(obj.hostname); }),
  performCommand
);
performAdminCommand({type: 'kill', hostname: 'localhost'}); 
//=> "localhost"
performAdminCommand({type: 'fail'}); 
//=> "fail"
performAdminCommand({type: 'join', target: 'foo'}); 
//=> "foo"

var performTrialUserCommand = _$.Fun.dispatch(
  isa('join', function (obj) { alert('禁止显示！重载限制行为！')}),
  performCommand
);
performTrialUserCommand({type: 'join', target: 'foo'}); 
//=> "禁止显示！重载限制行为！"
performTrialUserCommand({type: 'notify', message: 'Hi new user'}); 
//=> "Hi new user"
```

```javascript
// To string
Fun.str(sth);
```

```javascript
// Auto curry args
_$.Fun.curry1 = function (fun); // 1 arg of fun
_$.Fun.curry2 = function (fun); // 2 args of fun
_$.Fun.curry3 = function (fun); // 3 args of fun

["11", "11", "11", "11"].map(parseInt); 
//=> [11, NaN, 3, 4]
["11", "11", "11", "11"].map(_$.Fun.curry1(parseInt));
//=> [11, 11, 11, 11]
["11", "11", "11", "11"].map(_$.Fun.curry2(parseInt)(2));
//=> [3, 3, 3, 3]

var plays = [
  {artist: "Burial", track: "Archangel"},
  {artist: "Ben Frost", track: "Stomp"},
  {artist: "Ben Frost", track: "Stomp"},
  {artist: "Burial", track: "Archangel"},
  {artist: "Emeralds", track: "Snores"},
  {artist: "Burial", track: "Archangel"},  
];
function songToString (song) {
  return [song.artist, song.track].join("-");
};

var songCount = _$.Fun.curry2(_.countBy)(songToString);
songCount(plays);
/*=>
{"Ben Frost-Stomp":2
 "Burial-Archangel":3
 "Emeralds-Snores":1}
*/

var songsPlayed = _$.Fun.curry3(_.uniq)(false)(songToString);
songsPlayed(plays);
/*=>
[
  {artist: "Burial", track: "Archangel"},
  {artist: "Ben Frost", track: "Stomp"},
  {artist: "Emeralds", track: "Snores"}
]
*/

var greaterThan = _$.Fun.curry2(function (lhs, rhs) { return lhs > rhs; });
var lessThan = _$.Fun.curry2(function (lhs, rhs) { return lhs < rhs; });
var withinRange = _$.Fun.checker(
  _$.Fun.validator("arg must be greater than 10", greaterThan(10)),
  _$.Fun.validator("arg must be less than 20", lessThan(20))
);
withinRange(15); //=> []
withinRange(1); //=> ["arg must be greater than 10"]
withinRange(100); //=> ["arg must be less than 20"]
```

```javascript
_$.Fun.toHex = function (n); // Int to hex
```

```javascript
_$.Fun.rgbToHexString = function (r, g, b); // RGB to hex string

_$.Fun.rgbToHexString(255, 255, 255); //=> "#ffffff"

var blueGreenish = _$.Fun.curry3(_$.Fun.rgbToHexString)(255)(200);
blueGreenish(0); //=> "00c8ff"
```

```javascript
// Partial application for certain args
_$.Fun.partial1 = function (fun, arg1); // 1 arg of fun
_$.Fun.partial2 = function (fun, arg1, arg2); // 2 args of fun
_$.Fun.partial = function (fun /*, pargs*/); // any args of fun

function div (n, d) { return n/d; };

var over10Part1 = _$.Fun.partial1(div, 10);
over10Part1(5); //=> 2

var div10by2 = _$.Fun.partial2(div, 10, 2);
div10by2(); //=> 5

var over10Partial = _$.Fun.partial(div, 10);
over10Partial(2); //=> 5

var div10By2By4By5000Partial = _$.Fun.partial(div, 10, 2, 4, 5000);
div10By2By4By5000Partial(); //=> 5
```

```javascript
_$.Fun.condition1 = function (/* validators */); // Precondition with Fun.validator

var zero = _$.Fun.validator("cannot be zero", function (n) { return 0 === n; });
var number =  _$.Fun.validator("arg must be a number", _.isNumber);

var sqrPre = _$.Fun.condition1(
  _$.Fun.validator("arg must not be zero", _$.Fun.complement(zero)),
  _$.Fun.validator("arg must be a number", _.isNumber)
);
function uncheckedSqr (n) { return n * n;};
var checkedSqr = _$.Fun.partial1(sqrPre, uncheckedSqr);
checkedSqr(10); //=> 10
checkedSqr(""); //=> Error: "arg must be a number"
checkedSqr(0); //=> Error: "arg must not be zero"

var sillySquare = _$.Fun.partial1(
  _$.Fun.condition1(_$.Fun.validator("should be even", _$.Fun.isEven)),
  checkedSqr
);
sillySquare(10); //=> 100
sillySquare(11); //=> Error: "should be even"
sillySquare(""); //=> Error: "arg must be a number"
sillySquare(0); //=> Error: "arg must not be zero"

var sqrPost = _$.Fun.condition1(
  _$.Fun.validator("result should be a number", _.isNumber),
  _$.Fun.validator("result should not be zero", _$.Fun.complement(zero)),
  _$.Fun.validator("result should be positive", greaterThan(0))
);
var megaCheckedSqr = _.compose(_$.Fun.partial(sqrPost, _.identity), checkedSqr);
megaCheckedSqr(10); //=> 100
megaCheckedSqr(0); //=> Error: "result should not be zero"
```

```javascript
_$.Fun.myLength = function (ary); // Array's length

var a = _.range(10);
_$.Fun.myLength(a); //=> 10
a; //=> [0,1,2,3,4,5,6,7,8,9]
```

```javascript
_$.Fun.tcLength = function (ary, n); // Tail comsume of array's length

_$.Fun.tcLength(_.range(10)); //=> 10
_$.Fun.tcLength(_.range(10), 5); //=> 15
```

```javascript
_$.Fun.cycle = function (times, ary); // Cycle array to consume times

_$.Fun.cycle(2, [1, 2, 3]);
//=> [1,2,3,1,2,3]
_.take(_$.Fun.cycle(20, [1, 2, 3]), 11);
//=> [1,2,3,1,2,3,1,2,3,1,2]
```

```javascript
_$.Fun.constructPair = function (pair, rests); // Step to zipped pair of array

_$.Fun.constructPair(['a', 1], [[], []]);
//=> [['a'], [1]]
_.zip(['a'], [1]);
//=> [[a, 1]]
_.zip.apply(null, _$.Fun.constructPair(['a', 1], [[], []]));
//=> [[a, 1]]
_$.Fun.constructPair(
  ['a', 1],
  _$.Fun.constructPair(
    ['b', 2],
    _$.Fun.constructPair(
      ['c', 3],
      [[], []]
    )
  )
);
//=> [['a', 'b', 'c'], [1, 2, 3]]
```

```javascript
_$.Fun.unzip = function (pairs); // Unzip of reverse of _.zip

_$.Fun.unzip(_.zip([1, 2, 3], [4, 5, 6]));
//=> [[1, 2, 3], [4, 5, 6]]
```

```javascript
_$.Fun.nexts = function (graph, node); // Comsume traversal of [pair arrays]

var influence = [
  ['Lisp', 'Smalltalk'],
  ['Lisp', 'Scheme'],
  ['Smalltalk', 'Self'],
  ['Scheme', 'JavaScript'],
  ['Scheme', 'Lua'],
  ['Self', 'Lua'],
  ['Self', 'JavaScript'],
];
_$.Fun.nexts(influence, 'Lisp');
//=> ['Smalltalk', 'Scheme']
```

```javascript
_$.Fun.depthSearch = function (graph, nodes, seen); // Depth search and save node to seen

_$.Fun.depthSearch(influence, ['Lisp'], []);
//=> ["Lisp", "Smalltalk", "Self", "Lua", "JavaScript", "Scheme"]
_$.Fun.depthSearch(influence, ['Smalltalk', 'Self'], []);
//=> ["Smalltalk", "Self", "Lua", "JavaScript"]
_$.Fun.depthSearch(_$.Fun.construct(['Lua', 'Io'], influence), ['Lisp'], []);
//=> ["Lisp", "Smalltalk", "Self", "Lua", "Io", "JavaScript", "Scheme"]
```

```javascript
_$.Fun.andify = function (/* preds */); // Fun.checker of comsume
_$.Fun.orify = function (/* preds */); // Fun.checker of comsume

var evenNums = _$.Fun.andify(_.isNumber, _$.Fun.isEven);   
evenNums(1, 2); //=> false
evenNums(2, 4, 6, 8); //=> true
evenNums(2, 4, 6, 8, 9); //=> false

var zero = _$.Fun.validator("cannot be zero", function (n) { return 0 === n; });
var zeroOrOdd = _$.Fun.orify(_$.Fun.isOdd, zero);
zeroOrOdd(); //=> false
zeroOrOdd(0, 2, 4, 6); //=> true
zeroOrOdd(2, 4, 6); //=> false
```

```javascript
// Each other comsume 
_$.Fun.evenSteven = function (n);
_$.Fun.oddJohn = function (n);

_$.Fun.evenSteven(4); //=> true
_$.Fun.oddJohn(9); //=> true

// ***BAD!***
_$.Fun.evenSteven(100000);
//=> Uncaught RangeError: Maximum call stack size exceeded
```

```javascript
_$.Fun.flat = function (array); // Flat number in arrays, more clever use _.flatten

_$.Fun.flat([[1, 2], [3, 4]]);
//=> [1, 2, 3, 4]
_$.Fun.flat([[1, 2], [3, 4, [5, 6, [[[7]]], 8]]]);
//=> [1, 2, 3, 4, 5, 6, 7, 8]

// use _.flatten more classical
_.flatten([[1, 2], [3, 4, [5, 6, [[[7]]], 8]]]);
//=> [1, 2, 3, 4, 5, 6, 7, 8]
```

```javascript
_$.Fun.deepClone = function (obj); // Deep clone

var x = [{a: [1, 2, 3], b: 42}, {c: {d: []}}];
var y = _.clone(x);
var z = _$.Fun.deepClone(x);
y; //=> [{a: [1, 2, 3], b: 42}, {c: {d: []}}]
x[1]['c']['d'] = 100;
y; //=> [{a: [1, 2, 3], b: 42}, {c: {d: 100}}]
z; //=> [{a: [1, 2, 3], b: 42}, {c: {d: []}}]
```

```javascript
_$.Fun.deepFreeze = function (obj); // Deep freeze

var x = [{a: [1, 2, 3], b: 42}, {c: {d: []}}];
_$.Fun.deepFreeze(x);
x[0] = null;
x; //=> [{a: [1, 2, 3], b: 42}, {c: {d: []}}]
x[1]['c']['d'] = 42;
x; //=> [{a: [1, 2, 3], b: 42}, {c: {d: []}}]
```

```javascript
_$.Fun.visit = function (mapFun, resultFun, array); // Further processing array 

_$.Fun.visit(_.identity, _.isNumber, 42); //=> true
_$.Fun.visit(_.isNumber, _.identity, [1, 2, null, 3]);
//=> [true, true, false, true]
_$.Fun.visit(
  function(n) {return n*2}, 
  _$.Fun.invoker('reverse', Array.prototype.reverse),
  _.range(10)
);//=> [18, 16, 14, 12, 10, 8, 6, 4, 2, 0]
```

```javascript
_$.Fun.postDepth = function (fun, ary); // Depth search after extend every nodes 
_$.Fun.preDepth = function (fun, ary); // Depth search before extend every nodes 

_$.Fun.postDepth(_.identity, influence);
//=> [['Lisp, 'Smalltalk'], ['Lisp', 'Scheme'], ... 
_$.Fun.postDepth(
  function (x) {
    if ('Lisp' === x)
      return "LISP";
    else 
      return x;
  }, 
  influence
);
//=> [['LISP, 'Smalltalk'], ['LISP', 'Scheme'], ... 
```

```javascript
_$.Fun.influencedWithStrategy = function (strategy, lang, graph); // Build influenced language array

_$.Fun.influencedWithStrategy(_$.Fun.postDepth, "Lisp", influence);
//=> ["Smalltalk", "Scheme"]

var groupFrom = _$.Fun.curry2(_.groupBy)(_.first);
var groupTo = _$.Fun.curry2(_.groupBy)(_$.Fun.second);

function influenced (graph, node) {
  return _.map(groupFrom(graph)[node], _$.Fun.second)
};
influenced(influence, "Lisp");
//=> ["Smalltalk", "Scheme"]
```

```javascript
// Each other comsume advanced
_$.Fun.evenOline = function (n); 
_$.Fun.oddOline = function (n); 

_$.Fun.evenOline(0); //=> true
_$.Fun.oddOline(0); //=> false

_$.Fun.oddOline(3); //=> function ...
_$.Fun.oddOline(3)(); //=> function ...
_$.Fun.oddOline(3)()(); //=> function ...
_$.Fun.oddOline(3)()()(); //=> true

_$.Fun.oddOline(20000001)()()(); /// ... a bunch more ()s
//=> true
```

```javascript
// Flat handle return of function until it not a function
_$.Fun.trampoline = function (fun /* ,args */); 

_$.Fun.trampoline(_$.Fun.oddOline, 3); //=> true
_$.Fun.trampoline(_$.Fun.evenOline, 200000); //=> true
_$.Fun.trampoline(_$.Fun.oddOline, 300000); //=> false
_$.Fun.trampoline(_$.Fun.oddOline, 2000000); //=> false
// wait a few seconds
//=> true
```

```javascript
// Safe each other comsume advanced
_$.Fun.isEvenSafe = function (n); 
_$.Fun.isOddSafe = function (n); 

_$.Fun.isOddSafe(2000001); //=> true 
_$.Fun.isEvenSafe(2000001) //=> false
```

```javascript
// Generator by comsume
_$.Fun.generator = function (seed, current, step); 
_$.Fun.genHead = function (gen); // get generator head
_$.Fun.genTail = function (gen); // get generator tail
_$.Fun.genTake = function (n, gen); // more powerful

var ints = _$.Fun.generator(0, _.identity, function (n) { return n + 1; });

_$.Fun.genHead(ints); //=> 0
_$.Fun.genTail(ints); 
// (console) forced
//=> {head: 1, tail: function}

_$.Fun.genTail(_$.Fun.genTail(ints)); 
// (console) forced
// (console) forced
//=> {head: 2, tail: function}

_$.Fun.genTake(10, ints);
// (console) forced * 10
//=> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

```javascript
_$.Fun.rand = function (n);  // Rand
_$.Fun.randString = function (len); // Rand string

_$.Fun.rand(10); //=> 7
_$.Fun.repeatly(10, _$.Fun.partial1(_$.Fun.rand, 10));
//=> [2, 6, 6, 7, 7, 4, 4, 10, 8, 5]
_.take(_$.Fun.repeatly(10, _$.Fun.partial1(_$.Fun.rand, 10)), 5);
//=> [9, 6, 6, 4, 6]

_$.Fun.randString(0); //=> ""
_$.Fun.randString(1); //=> "n"
_$.Fun.randString(10); //=> "kd31cndokg"
```

```javascript
// Generate random charcater
_$.Fun.generateRandomCharacter = function ();  
// Generate random charcater, effect same as Fun.randString 
_$.Fun.generateString = function (charGen, len);

_$.Fun.generateString(_$.Fun.generateRandomCharacter, 20);
//=> "ln4eommlqbabmnqaaimk"

var composedRandomString = _$.Fun.partial1(_$.Fun.generateString, _$.Fun.generateRandomCharacter);
composedRandomString(10); //=> "3o1o3l155b"
```

```javascript
// Skip take elements of coll
_$.Fun.skipTake = function (n, coll);  

_$.Fun.skipTake(2, [1, 2, 3, 4]); //=> [1, 3]
_$.Fun.skipTake(2, _.range(20));
//=> [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

```javascript
// Sum in array
_$.Fun.summ = function (n, coll);  
_$.Fun.summRec = function (n, coll);  

_$.Fun.summ(_.range(1, 11)); //=> 55
_$.Fun.summRec(_.range(1, 11), 0); //=> 55
```

```javascript
// Merge obj do not change origin obj
_$.Fun.merge = function (obj);  

var person = {fname: 'Simon'};
_.extend(person, {lname: 'Petrikov'}, {age: 28}, {age: 108});
//=> {fname: "Simon", lname: "Petrikov", age: 108}
person; //=> {fname: "Simon", lname: "Petrikov", age: 108}

var person = {fname: 'Simon'};
_$.Fun.merge(person, {lname: 'Petrikov'}, {age: 28}, {age: 108});
//=> {fname: "Simon", lname: "Petrikov", age: 108}
person; //=> {fname: 'Simon'}
```

```javascript
// Pipe line
_$.Fun.pipeline = function (seed, /* ,args */);  

_$.Fun.pipeline(); //=> undefined
_$.Fun.pipeline(42); //=> 42
_$.Fun.pipeline(42, function (n) { return -n; }); //=> -42

function fifth (a) {
  return _$.Fun.pipeline (a
    , _.rest
    , _.rest
    , _.rest
    , _.rest
    , _.first
  );
};
fifth([1,2,3,4,5]); //=> 5

function negativeFifth (a) {
  return _$.Fun.pipeline (a
    , fifth
    , function (n) { return -n }
  );
};
negativeFifth([1,2,3,4,5,6,7,8,9]); //=> -5

var library = [
  {title: "SICP", isbn: "0262010711", ed: 1},
  {title: "SICP", isbn: "0262010811", ed: 2},
  {title: "Joy of Clojure", isbn: "1935182461", ed: 1},
]
var RQL = {
  select: _$.Fun.curry2(_$.Fun.project),
  as: _$.Fun.curry2(_$.Fun.as),
  where: _$.Fun.curry2(_$.Fun.restrict)
};
function allFirstEditions (table) {
  return _$.Fun.pipeline(table
    , RQL.as({ed: 'edition'})
    , RQL.select(['title', 'edition', 'isbn'])
    , RQL.where(function (book) { return book.edition === 1; })
  )
};
allFirstEditions(library);
```

```javascript
// Actions according pipeline and lazyChain
_$.Fun.actions(acts, done);

function mSqr () {
  return function (state) {
    var ans = _$.Fun.sqr(state);
    return { answer: ans, state: ans };
  };
};
var doubleSquareAction = _$.Fun.actions(
  [ mSqr(), mSqr()],
  function (values) { return values }
);
doubleSquareAction(10); //=> [100, 10000]

function mNote () {
  return function (state) {
    _$.Fun.note(state);
    return { answer: undefined, state: state };
  };
};
function mNeg () {
  return function (state) {
    return { answer: -state, state: -state };
  };
};
var negativeSqrAction = _$.Fun.actions(
  [ mSqr(), mNote(), mNeg()],
  function (_, state) { return state;}
);
negativeSqrAction(9);
// NOTE: 81
//=> -81
```

```javascript
// Brief create actions
_$.Fun.lift(answerFun, stateFun);

var mSqr2 = _$.Fun.lift(_$.Fun.sqr);
var mNote2 = _$.Fun.lift(_$.Fun.note, _.identity);
var mNeg2 = _$.Fun.lift(function (n) { return -n; });
var negativeSqrAction = _$.Fun.actions(
  [ mSqr2(), mNote2(), mNeg2()],
  function (_, state) { return state;}
);
negativeSqrAction(100);
// NOTE: 10000
//=> -10000

var push = _$.Fun.lift(function (stack, e) { return _$.Fun.construct(e, stack)});
var pop = _$.Fun.lift( _.first, _.rest );
var stackAction = _$.Fun.actions(
  [push(1), push(2), pop()],
  function (values, state) { return values; }
);
stackAction([]);
//=> [ [1], [2, 1], [1]]

_$.Fun.pipeline(
  []
  , stackAction
  , _.chain
).each(function (elem) {
  console.log(elem);
});
// (console) [1]
// (console) [2, 1]
// (console) [1]
```

```javascript
// lazyChain create by functional
_$.Fun.lazyChain(obj);

var lazyOp = _$.Fun.lazyChain([2, 1, 3])
  .invoke('concat', [7,7,8,9,0])
  .invoke('sort');
lazyOp.force(); //=> [0,1,2,3,5,6,7,7,8,9]

function deferredSort (ary) {
  return _$.Fun.lazyChain(ary).invoke('sort');
};
var deferredSorts = _.map([[2,1,3], [7,7,1], [0,9,5]], deferredSort);
//=> [<thunk>, <thunk>, <thunk>]
function force (thunk) {
  return thunk.force();
};
_.map(deferredSorts, force);
//=> [[1,2,3], [1,7,7], [0,5,9]]

var validateTriples = _$.Fun.validator(
  "Each array should have three elements",
  function (arrays) {
    return _.every(arrays, function (a) {
      return a.length === 3;
    });
  }
);
var validateTripleStore = _$.Fun.partial1(_$.Fun.condition1(validateTriples), _.identity);
validateTripleStore([[2,1,3], [7,7,1], [0,9,5]]);
//=> [[2,1,3], [7,7,1], [0,9,5]]
validateTripleStore([[2,1,3], [7,7,1], [0,9,5,7,7,7,7,7,7]]);
// Uncaught Error: Each array should have three elements

function postProcess (arrays) {
  return _.map(arrays, _$.Fun.second);
};
function processTriples (data) {
  return _$.Fun.pipeline(data
    , JSON.parse
    , validateTripleStore
    , deferredSort
    , force
    , postProcess
    , _$.Fun.invoker('sort', Array.prototype.sort)
    , _$.Fun.str
  )
};
processTriples("[[2,1,3], [7,7,1], [0,9,5]]");
```

```javascript
// Classical to string
_$.Fun.polyToString(s);
_$.Fun.stringifyArray(ary)

_$.Fun.polyToString(42); //=> "42"
_$.Fun.polyToString([1,2,[3,4]]); //=> "[1,2,[3,4]]"
_$.Fun.polyToString([1,2,{"a": 42, "b": [4,5,6]},77]); 
//=> "[1,2,{"a": 42, "b": [4,5,6]},77]"
_$.Fun.polyToString(new Date()); 
//=> ""2016-12-30T06:00:35.466Z""
```

```javascript
// Container class simple instantiation
function Container (init) {
  this._value = init;
};

Container.prototype = {
  constructor: Container,

  update: function (fun /*,args*/) {
    var args = _.rest(arguments);
    var oldValue = this._value;

    this._value = fun.apply(this, _$.Fun.construct(oldValue, args));

    return this._value;
  },
  toString: function () {
    return ["@<", _$.Fun.polyToString(this._value), ">"].join('');
  }
};

(new Container(42)).toString(); //=> "@<42>"

var aNumber = new Container(42);
aNumber.update(function (n) {return n + 1;}); //=> 43
aNumber; //=> {_value: 43}
aNumber.update(function (n, x, y, z) { return n/x/y/z}, 1, 2, 3);
//=> 7.166666666666667

aNumber.update(_.compose(megaCheckedSqr, _$.Fun.always(0)));
// Error: arg must not be zero
```

```javascript
// Lazy chain 
function LazyChain (obj) {
  this._calls = [];
  this._target = obj;
};

LazyChain.prototype = {
  constructor: LazyChain,
  invoke: function (methodName/*, args*/) {
    var args = _.rest(arguments);

    this._calls.push(function (target) {
      var meth = target[methodName];

      return meth.apply(target, args);
    });

    return this;
  },
  force: function () {
    return _.reduce(this._calls, function (target, thunk) {
      return thunk(target);
    }, this._target);
  },
  tap: function (fun) {
    this._calls.push(function (target) {
      fun(target);
      return target;
    });
    return this;
  }
}

new LazyChain([2, 1, 3]).invoke('sort')._calls;
//=> [function(target) {...}]
new LazyChain([2, 1, 3]).invoke('sort')._calls[0]();
//=> Uncaught TypeError: Cannot read property 'sort' of undefined
new LazyChain([2, 1, 3]).invoke('sort')._calls[0]([2, 1, 3]);
//=> [1, 2, 3]

new LazyChain([2, 1, 3]).invoke('sort').force();
//=> [1, 2, 3]
new LazyChain([2, 1, 3])
  .invoke('concat', [8, 5, 7, 6])
  .invoke('sort')
  .invoke('join', '-')
  .force();
//=> "1-2-3-5-6-7-8"

new LazyChain([2, 1, 3])
  .invoke('sort')
  .tap(alert)
  .force();
//=> alert box pops update
//=> [1,2,3]

var deferredSort = new LazyChain([2, 1, 3])
  .invoke('sort')
  .tap(alert);
deferredSort; //=> LazyChain
deferredSort.force();
//=> alert box pops update
//=> [1,2,3]

function LazyChainChainChain (obj) {
  var isLC = (obj instanceof LazyChain);

  this._calls = isLC ? _$.Fun.cat(obj._calls, []) : [];
  this._target = isLC ? obj._target : obj;
}
LazyChainChainChain.prototype = new LazyChain;

new LazyChainChainChain(deferredSort)
  .invoke('toString')
  .force();
//=> alert box pops update
//=> "1,2,3"
```

```javascript
// jQuery promise
function go () {
  var d = $.Deferred();

  $.when("")
   .then(function () {
     setTimeout(function () { console.log("sub-task 1"); }, 1000);
   })
   .then(function () {
     setTimeout(function () { console.log("sub-task 2"); }, 2000);
   })
   .then(function () {
     setTimeout(function () { d.resolve("done done done done"); console.log(d.promise().state()) }, 3000);
   });
}
```

```javascript
// Layer of class
function ContainerClass () { Container.apply(this, _.toArray(arguments)) };
function ObservedContainerClass () { ContainerClass.apply(this, _.toArray(arguments)); };
function HoleClass () { ObservedContainerClass.apply(this, _.toArray(arguments)); };
function CASClass () { HoleClass.apply(this, _.toArray(arguments)); };
function TableBaseClass () { HoleClass.apply(this, _.toArray(arguments)); };

ObservedContainerClass.prototype = new ContainerClass();
HoleClass.prototype = new ObservedContainerClass();
CASClass.prototype = new HoleClass();
TableBaseClass.prototype = new HoleClass();

(new CASClass()) instanceof HoleClass; //=> true
(new TableBaseClass()) instanceof HoleClass; //=> true
(new HoleClass()) instanceof CASClass; //=> false
(new CASClass()) instanceof ContainerClass; //=> true

ContainerClass.prototype = _.extend(Container.prototype, {
  init: function (val) {
    this._value = val;
  },
});
var c = new ContainerClass(42);
c; //=> Container {_value: 42}
c instanceof Container //=> true

ObservedContainerClass.prototype = _.extend(ContainerClass.prototype, {
  observe: function (f) { _$.Fun.note("set observer") },
  notify: function () { _$.Fun.note("notifying observers") }
});

HoleClass.prototype = _.extend(ObservedContainerClass.prototype, {
  init: function (val) { this.setValue(val) },
  setValue: function (val) {
    this._value = val;
    this.notify();
    return val;
  }
});
var h = new HoleClass(44);

h.init(55);
// NOTE: notifying observers
h.observe(null)
// NOTE: set observer
h.setValue(108);
// NOTE: notifying observers
//=> 108

CASClass.prototype = _.extend(HoleClass.prototype, {
  swap: function (oldVal, newVal) {
    if (!_.isEqual(oldVal, this._value)) _$.Fun.fail("No match");

    return this.setValue(newVal);
  }
});
var c = new CASClass(42);
c.swap(42, 43);
// NOTE: notifying observers
//=> 43
c.swap("not the value", 44);
// Uncaught Error: No match
```

```javascript
// Mixin functions to extend
function Container (val) {
  this._value = val;
  this.init(val);
};
Container.prototype = {
  constructor: Container,
  init: _.identity,
};

var Hole = function (val) {
  Container.call(this, val);
};
/*
Hole.prototype = {
  constructor: Hole,
  validate: function (value) { _$.Fun.note("validate: " + value) },
  notify: function () { _$.Fun.note("notifying observers") },
}
*/

var HoleMixin = {
  setValue: function (newValue) {
    var oldVal = this._value;

    this.validate(newValue);
    this._value = newValue;
    this.notify(oldVal, newValue);

    return newValue;
  }
};

var h = new Hole(42);
// uncaught TypeError: this.init is not a function

var ObserverMixin = (function () {
  var _watchers = [];

  return {
    watch: function (fun) {
      _watchers.push(fun);
      return _.size(_watchers);
    },
    notify: function (oldVal, newVal) {
      _.each(_watchers, function (watcher) {
        watcher.call(this, oldVal, newVal);
      });

      return _.size(_watchers);
    }
  }
})();

var ValidateMixin = {
  addValidator: function (fun) {
    this._validator = fun;
  },
  init: function (val) {
    this.validate(val);
  },
  validate: function (val) {
    var existy = function (x) { return x != null; };
    if ( existy(this._validator) && !this._validator(val) )
      _$.Fun.fail("Attempted to set invalid value " + _$.Fun.polyToString);
  }
};

_.extend(Hole.prototype
  , HoleMixin
  , ValidateMixin
  , ObserverMixin
);

var h = new Hole(42);
h.addValidator(_$.Fun.always(false));
h.setValue(9);
// Uncaught Error: Attempted to set invalid value undefined
h.addValidator(_$.Fun.isEven);
h.setValue(108); //=> 108
h.setValue(9);
// Uncaught Error: Attempted to set invalid value undefined
h.watch(function (old, nu) {
  _$.Fun.note(["changing", old, "to", nu].join(' '));
}); 
//=> 1
h.setValue(42);
// NOTE: changing 108 to 42
//=> 42
h.watch(function (old, nu) {
  _$.Fun.note(["Veranderende", old, "tot", nu].join(' '));
}); 
//=> 2
h.setValue(36);
// NOTE: changing 42 to 36
// NOTE: Veranderende 42 tot 36
//=> 36

var SwapMixin = {
  swap: function (fun /* , args... */) {
    var args = _.rest(arguments);
    var newValue = fun.apply(this, _$.Fun.construct(this._value, args));

    return this.setValue(newValue);
  }
};

var o = {_value: 0, setValue: _.identity};
_.extend(o, SwapMixin);
o.swap(_$.Fun.construct, [1, 2, 3]);
//=> [0, 1, 2, 3]

var SnapshotMixin = {
  snapshot: function () {
    return _$.Fun.deepClone(this._value);
  }
};

_.extend(Hole.prototype
  , HoleMixin
  , ValidateMixin
  , ObserverMixin
  , SwapMixin
  , SnapshotMixin
);

var h = new Hole(42);
h.snapshot(); //=> 42
h.swap(_$.Fun.always(99)); //=> 99
h.snapshot(); //=> 99

var CAS = function (val) {
  Hole.call(this, val);
};
var CASMixin = {
  swap: function (oldVal, f) {
    if (this._value === oldVal) {
      this.setValue(f(this._value));
      return this._value;
    } else {
      return undefined;
    }
  }
};

_.extend(CAS.prototype
  , HoleMixin
  , ValidateMixin
  , ObserverMixin
  , SwapMixin
  , CASMixin
  , SnapshotMixin
);

var c = new CAS(42);
c.swap(42, _$.Fun.always(-1)); //=> -1
c.snapshot(); //=> -1
c.swap('not the value', _$.Fun.always(-1)); //=> undefined
c.snapshot(); //=> -1
```