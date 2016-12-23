/*
 * @author zehui-chen /  https://github.com/snake89322
 * 
 * */

// Create a safe reference to the Underscore object for use below.
var _ = require('underscore');

// Create a safe reference to the Fun object for use below.
var Fun = function (obj) {
  if (obj instanceof Fun) return obj;
  if (!(this instanceof Fun)) return new Fun(obj);
  this._wrapped = obj;
};

// Internal function that returns existy
function existy (x) { return x != null; };
// Internal function that returns truthy
function truthy (x) { return (x !== false) && existy(x); };
// Internal function that infomation tip
function fail (thing) { throw new Error(thing); };
function warn (thing) { console.log(["WARNING:", thing].join(' ')); };
function note (thing) { console.log(["NOTE:", thing].join(' ')); };
// Internal function that do action() judged by cond
function doWhen (cond, action) {
	if (truthy(cond))
		return action();
 	else
	 	return undefined;
};

// All functions' return judge like &&
Fun.allOf = function (/* funs */) {
	return _.reduceRight(arguments, function (truth, f){
		return truth && f();
	}, true);
};

// All functions' return judge like ||
Fun.anyOf = function (/* funs */) {
	return _.reduceRight(arguments, function (truth, f) {
		return truth || f();
	}, false);
};

// Judge if array index
Fun.isIndexed = function (data) {
	return _.isArray(data) || _.isString(data);
};

// Abstract array width index
Fun.nth = function (a, index) {
	if (!_.isNumber(index)) fail("Expected a number as the index");
	if (!Fun.isIndexed(a)) fail("Not supported on non-indexed type");
	if ((index < 0) || (index > a.length - 1))
		fail("Index value is out of bounds");
	
	return a[index];
};

// Second element of array
Fun.second = function (a) {
	return Fun.nth(a, 1);
};

// Complementary set 
Fun.complement = function (pred) {
	return function () {
		return !pred.apply(null, _.toArray(arguments));
	};
};

// Is even
Fun.isEven = function (n) {
	return (n%2) === 0;
};

// Is odd
Fun.isOdd = Fun.complement(Fun.isEven);

// Concat 
Fun.cat = function () {
	var head = _.first(arguments);
	if (existy(head))
		return head.concat.apply(head, _.rest(arguments));
	else
		return [];
};

// Element concat with array
Fun.construct = function (head, tail) {
	return Fun.cat([head], _.toArray(tail));
};

// Dealing elements and concat
Fun.mapcat = function (fun, coll) {
	return Fun.cat.apply(null, _.map(coll, fun));
};

// Except last element of array
Fun.butLast = function (coll) {
	return _.toArray(coll).slice(0, -1);
};

// Insert element to every interspace of array
Fun.interpose = function (inter, coll) {
	return Fun.butLast( Fun.mapcat(function (e) {
		return Fun.construct(e, [inter]);
	}, coll));
};

// Remove repeat elements of array
Fun.dereplicate = function (coll) {
	coll.sort();
	var re = [coll[0]];
	for (var i = 1, l = coll.length; i < l; i++) {
		if ( coll[i] !== re[re.length - 1] && !_.isUndefined(coll[i]) ) {
			re.push(coll[i]);
		}
	}
	return re;
};

// Select keys of a table and return a new table
Fun.project = function (table, keys) {
	return _.map(table, function (obj) {
		return _.pick.apply(null, Fun.construct(obj, _.isArray(keys) ? keys : [keys]));
	});
};

// Rename key of object
Fun.rename = function (obj, newNames) {
	return _.reduce(newNames, function (o, nu, old) {
			if (_.has(obj, old)) {
				o[nu] = obj[old];
				return o ;
			} else {
				return o;
			}
		},
		_.omit.apply(null, Fun.construct(obj, _.keys(newNames))));
};

// Rename keys of table
Fun.as = function (table, newNames) {
	return _.map(table, function (obj) {
		return Fun.rename(obj, newNames);
	});
};

// Conditions select and return a new table
Fun.restrict = function (table, pred) {
	return _.reduce(table, function (newTable, obj) {
		if (truthy(pred(obj)))
			return newTable;
		else 
			return _.without(newTable, obj);
	}, table);
};

// Pluck object's key or coll's number
Fun.plucker = function (field) {
	return function (obj) {
		return (obj && obj[field]);
	};
};

// Compare elements of coll and return bestFun element
Fun.finder = function (valueFun, bestFun, coll) {
	return _.reduce(coll, function (best, current) {
		var bestValue = valueFun(best);
		var currentValue = valueFun(current);

		return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
	});
};

// Brief of Fun.finder
Fun.best = function (fun, coll) {
	return _.reduce(coll, function (x, y) {
		return fun(x, y) ? x : y;
	});
};

// Repeat a fun with times
Fun.repeatly = function (times, fun) {
	return _.map(_.range(times), fun);
};

// Evolution for Fun.repeatly
Fun.iterateUntil = function (fun, check, init) {
	var ret = [];
	var result = fun(init);

	while (check(result)) {
		ret.push(result);
		result = fun(result);
	};

	return ret;
};

// Combinator function
Fun.always = function (value) {
	return function () {
		return value;
	};
};

// Receive a method，that apply to defined targets
Fun.invoker = function (name, method) {
	return function (target /* args */) {
		if (!existy(target)) fail("Must provide a target");

		var targetMethod = target[name];
		var args = _.rest(arguments);

		return doWhen((existy(targetMethod) && method === targetMethod), function () {
			return targetMethod.apply(target, args);
		});
	};
};

// Any null or undefined args use default to replace
Fun.fnull = function (fun /*, defaults*/) {
	var defaults = _.rest(arguments);

	return function (/* args */) {
		var args = _.map(arguments, function (e, i) {
			return existy(e) ? e : defaults[i];
		});

		return fun.apply(null, args);
	};
};

// Object default config
Fun.defaults = function (conf) {
	return function (o, k) {
		var val = Fun.fnull(_.identity, conf[k]);
		return o && val(o[k]);
	};
};

// Fun that receive validators and return true or false
Fun.checker = function (/* validators */) {
	var validators = _.toArray(arguments);

	return function (obj) {
		return _.reduce(validators, function (errs, check) {
			if (check(obj))
				return errs;
			else 
				return _.chain(errs).push(check.message).value();
		}, []);
	};
};

// Special API that create validators to grace Fun.checker
Fun.validator = function (message, fun) {
	var f = function (/* args */) {
		return fun.apply(fun, arguments);
	};

	f['message'] = message;
	return f;
};

// Validate object has keys
Fun.hasKeys = function (/* keys */) {
	var KEYS = _.toArray(arguments);

	var fun = function (obj) {
		return _.every(KEYS, function (k) {
			return _.has(obj, k);
		});
	};

	fun.message = Fun.cat(["Must have values for keys:"], KEYS).join(" ");
	return fun;
};

// Reverse string
Fun.stringReverse = function (s) {
	if (!_.isString(s)) return undefined;
	return s.split('').reverse().join("");
};

// Try to call evey fun to target until return undefined 
Fun.dispatch = function (/* funs */) {
	var funs = _.toArray(arguments);
	var size = funs.length;

	return function (target /*, args*/) {
		var ret = undefined;
		var args = _.rest(arguments);

		for (var funIndex = 0; funIndex < size; funIndex++) {
			var fun = funs[funIndex];
			ret = fun.apply(fun, Fun.construct(target, args));

			if (existy(ret)) return ret;
		}

		return ret;
	}
};

// Auto curry args
Fun.curry1 = function (fun) {
	return function (arg) {
		return fun(arg);
	};
};
Fun.curry2 = function (fun) {
	return function (secondArg) {
		return function (firstArg) {
			return fun(firstArg, secondArg);
		};
	};
};
Fun.curry3 = function (fun) {
	return function (last) {
		return function (middle) {
			return function (first) {
				return fun(first, middle, last);
			};
		};
	};
};

// Int to hex
Fun.toHex = function (n) {
	var hex = n.toString(16);
	return (hex.length < 2) ? [0, hex].join('') : hex;
};

// RGB to hex string
Fun.rgbToHexString = function (r, g, b) {
	return ['#', Fun.toHex(r), Fun.toHex(g), Fun.toHex(b)].join('');
};

// Partial application for certain args
Fun.partial1 = function (fun, arg1) {
	return function (/* args */) {
		var args = Fun.construct(arg1, arguments);
		return fun.apply(fun, args);
	};
};
Fun.partial2 = function (fun, arg1, arg2) {
	return function (/* args */) {
		var args = Fun.cat([arg1, arg2], arguments);
		return fun.apply(fun, args);
	};
};
Fun.partial = function (fun /*, pargs*/) {
	var pargs = _.rest(arguments);
	return function (/* args */) {
		var args = Fun.cat(pargs, _.toArray(arguments));
		return fun.apply(fun, args);
	};
};

// Precondition with Fun.validator
Fun.condition1 = function (/* validators */) {
	var validators = _.toArray(arguments);

	return function (fun, arg) {
		var errors = Fun.mapcat(function (isValid) {
			return isValid(arg) ? [] : [isValid.message];
		}, validators);

		if (!_.isEmpty(errors))
			throw new Error(errors.join(","));
		
		return fun(arg);
	}
};

// Array's length
Fun.myLength = function (ary) {
	if (_.isEmpty(ary))
		return 0;
	else 
		return 1 + Fun.myLength(_.rest(ary));
};

// Cycle array to consume times
Fun.cycle = function (times, ary) {
	if (times <= 0)
		return [];
	else 
		return Fun.cat(ary, Fun.cycle(times - 1, ary));
};

// Step to zipped pair of array
Fun.constructPair = function (pair, rests) {
	return [
		Fun.construct(_.first(pair), _.first(rests)),
		Fun.construct(Fun.second(pair), Fun.second(rests))
	];
};

// Unzip of reverse of _.zip
Fun.unzip = function (pairs) {
	if (_.isEmpty(pairs)) return [[], []];

	return Fun.constructPair(_.first(pairs), Fun.unzip(_.rest(pairs)));
};

// Comsume traversal of [pair arrays]
Fun.nexts = function (graph, node) {
	if (_.isEmpty(graph)) return [];

	var pair = _.first(graph);
	var from = _.first(pair);
	var to = Fun.second(pair);
	var more = _.rest(graph);

	if (_.isEqual(node, from))
		return Fun.construct(to, Fun.nexts(more, node));
	else
		return Fun.nexts(more, node);
};

export { Fun };
  