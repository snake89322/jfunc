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
Fun.existy = function (x) { return x != null; };
// Internal function that returns truthy
Fun.truthy = function (x) { return (x !== false) && Fun.existy(x); };

// Internal function that do action() judged by cond
Fun.doWhen = function (cond, action) {
	if (Fun.truthy(cond))
		return action();
 	else
	 	return undefined;
};
// Infomation tip
Fun.fail = function (thing) { throw new Error(thing); };
Fun.warn = function (thing) { console.log(["WARNING:", thing].join(' ')); };
Fun.note = function (thing) { console.log(["NOTE:", thing].join(' ')); };

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
	if (!_.isNumber(index)) Fun.fail("Expected a number as the index");
	if (!Fun.isIndexed(a)) Fun.fail("Not supported on non-indexed type");
	if ((index < 0) || (index > a.length - 1))
		Fun.fail("Index value is out of bounds");
	
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
	if (Fun.existy(head))
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
		if (Fun.truthy(pred(obj)))
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
		if (!Fun.existy(target)) Fun.fail("Must provide a target");

		var targetMethod = target[name];
		var args = _.rest(arguments);

		return Fun.doWhen((Fun.existy(targetMethod) && method === targetMethod), function () {
			return targetMethod.apply(target, args);
		});
	};
};

// Any null or undefined args use default to replace
Fun.fnull = function (fun /*, defaults*/) {
	var defaults = _.rest(arguments);

	return function (/* args */) {
		var args = _.map(arguments, function (e, i) {
			return Fun.existy(e) ? e : defaults[i];
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

// Sqr
Fun.sqr = function (n) {
	var zero = Fun.validator('cannot be zero', function (n) { return 0 === n; });
	var number = Fun.validator('arg must be a number', _.isNumber);
	if (!number(n)) throw new Error(number.message);
	if (zero(n)) throw new Error(zero.message);

	return n * n;
}

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

			if (Fun.existy(ret)) return ret;
		}

		return ret;
	}
};

// To string
Fun.str = Fun.dispatch(
  Fun.invoker('toString', Array.prototype.toString),
  Fun.invoker('toString', String.prototype.toString)
);

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

// Tail comsume of array's length
Fun.tcLength = function (ary, n) {
	var l = n ? n : 0;

	if (_.isEmpty(ary)) 
		return l;
	else 
		return Fun.tcLength(_.rest(ary), l + 1);
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

// Depth search and save node to seen
Fun.depthSearch = function (graph, nodes, seen) {
	if (_.isEmpty(nodes)) return Fun.invoker('reverse', Array.prototype.reverse)(seen);

	var node = _.first(nodes);
	var more = _.rest(nodes);

	if (_.contains(seen, node))
		return Fun.depthSearch(graph, more, seen);
	else 
		return Fun.depthSearch(
			graph,
			Fun.cat(Fun.nexts(graph, node), more),
			Fun.construct(node, seen)
		);
};

// Fun.checker of comsume
Fun.andify = function (/* preds */) {
	var preds = _.toArray(arguments);

	return function (/* args */) {
		var args = _.toArray(arguments);

		var everything = function (ps, truth) {
			if (_.isEmpty(ps))
				return truth;
			else 
				return _.every(args, _.first(ps))
					&& everything(_.rest(ps), truth);
		};

		return everything(preds, true);
	};
};

// Fun.checker of comsume
Fun.orify = function (/* preds */) {
	var preds = _.toArray(arguments);

	return function (/* args */) {
		var args = _.toArray(arguments);

		var something = function (ps, truth) {
			if (_.isEmpty(ps))
				return truth;
			else
				return _.some(args, _.first(ps))
					|| something(_.rest(ps), truth);
		};

		return something(preds, false);
	};
};

// Each other comsume
Fun.evenSteven = function (n) {
	if ( 0 === n ) 
		return true;
	else 
		return Fun.oddJohn(Math.abs(n) - 1);
}
Fun.oddJohn = function (n) {
	if ( 0 === n ) 
		return false;
	else 
		return Fun.evenSteven(Math.abs(n) - 1);
}

// Flat number in arrays, more clever use _.flatten
Fun.flat = function (array) {
	if (_.isArray(array))
		return Fun.cat.apply(Fun.cat, _.map(array, Fun.flat));
	else 
		return [array];
};

// Deep clone
Fun.deepClone = function (obj) {
	if (!Fun.existy(obj) || !_.isObject(obj))
		return obj;
	var temp = new obj.constructor();
	for (var key in obj)
		if (obj.hasOwnProperty(key))
			temp[key] = Fun.deepClone(obj[key]);

	return temp;
};

// Deep freeze
Fun.deepFreeze = function (obj) {
	if (!Object.isFrozen(obj))
		Object.freeze(obj);
	
	for(var key in obj) {
		if (!obj.hasOwnProperty(key) || !_.isObject(obj[key]))
			continue;

		Fun.deepFreeze(obj[key]);
	}
};

// Further processing array 
Fun.visit = function (mapFun, resultFun, array) {
	if (_.isArray(array)) 
		return resultFun(_.map(array, mapFun));
	else
		return resultFun(array);
};

// Depth search after extend every nodes 
Fun.postDepth = function (fun, ary) {
	return Fun.visit(Fun.partial1(Fun.postDepth, fun), fun, ary);
};

// Depth search before extend every nodes 
Fun.preDepth = function (fun, ary) {
	return Fun.visit(Fun.partial1(Fun.preDepth), fun, fun(ary));
};

// Build influenced language array
Fun.influencedWithStrategy = function (strategy, lang, graph) {
	var results = [];

	strategy(function (x) {
		if (_.isArray(x) && _.first(x) === lang)
			results.push(Fun.second(x));
		
		return x;
	}, graph);

	return results;
};

// Each other comsume advanced
Fun.evenOline = function (n) {
	if ( 0 === n) 
		return true;
	else
		return Fun.partial1(Fun.oddOline, Math.abs(n) - 1);
};
Fun.oddOline = function (n) {
	if ( 0 === n) 
		return false;
	else
		return Fun.partial1(Fun.evenOline, Math.abs(n) - 1);
};

// Flat handle return of function until it not a function
Fun.trampoline = function (fun /* ,args */) {
	var result = fun.apply(fun, _.rest(arguments));

	while (_.isFunction(result)) {
		result = result();
	};

	return result;
};

// Safe each other comsume advanced
Fun.isEvenSafe = function (n) {
	if ( 0 === n )
		return true;
	else
		return Fun.trampoline(Fun.partial1(Fun.oddOline, Math.abs(n) - 1));
};
Fun.isOddSafe = function (n) {
	if ( 0 === n)
		return false;
	else 
		return Fun.trampoline(Fun.partial1(Fun.evenOline, Math.abs(n) - 1));
};

// Generator by comsume
Fun.generator = function (seed, current, step) {
	return {
		head: current(seed),
		tail: function () {
			console.log("forced");
			return Fun.generator(step(seed), current, step);
		}
	};
};
Fun.genHead = function (gen) {
	return gen.head;
};
Fun.genTail = function (gen) {
	return gen.tail();
};
Fun.genTake = function (n, gen) {
	var doTake = function (x, g, ret) {
		if ( 0 === x ) 
			return ret;
		else
			return Fun.partial(doTake, x-1, Fun.genTail(g), Fun.cat(ret, Fun.genHead(g)));
	};

	return Fun.trampoline(doTake, n, gen, []);
};

// Rand num
Fun.rand = Fun.partial1(_.random, 1);

// Rand string
Fun.randString = function (len) {
	var ascii = Fun.repeatly(len, Fun.partial(Fun.rand, 26));

	return _.map(ascii, function (n) {
		return n.toString(36)
	}).join('');
}

// Generate random charcater
Fun.generateRandomCharacter = function () {
  return Fun.rand(26).toString(36);
};

// Generate random charcater, effect same as Fun.randString 
Fun.generateString = function (charGen, len) {
  return Fun.repeatly(len, charGen).join('');
};

// Skip take elements of coll
Fun.skipTake = function (n, coll) {
	var ret = [];
	var sz = _.size(coll);

	for (var index = 0; index < sz; index += n) {
		ret.push(coll[index]);
	}

	return ret;
}

// Sum in array
Fun.summ = function (array) {
	var result = 0;
	var sz = array.length;

	for (var i = 0; i < sz; i++) 
		result += array[i];

	return result;
};
Fun.summRec = function (array, seed) {
	if (_.isEmpty(array))
		return seed;
	else 
		return Fun.summRec(_.rest(array),_.first(array) + seed);
};

// Merge obj do not change origin obj
Fun.merge = function (obj) {
	return _.extend.apply(null, Fun.construct({}, arguments));
};

// Pipe line
Fun.pipeline = function (seed, /* ,args */) {
	return _.reduce(
		_.rest(arguments),
		function (l, r) { return r(l); },
		seed
	);
}

// Actions according pipline and lazyChain
Fun.actions = function (acts, done) {
	return function (seed) {
		var init = { values: [], state: seed };

		var intermediate = _.reduce(acts, function (stateObj, action) {
			var result = action(stateObj.state);
			var values = Fun.cat(stateObj.values, [result.state]);

			return { values: values, state: result.state };
		}, init);

		var keep = _.filter(intermediate.values, Fun.existy);

		return done(keep, intermediate.state);
	};
};

// Brief create actions
Fun.lift = function (answerFun, stateFun) {
	return function (/* args */) {
		var args = _.toArray(arguments);

		return function (state) {
			var ans = answerFun.apply(null, Fun.construct(state, args));
			var s = stateFun ? stateFun(state) : ans;
			console.log(stateFun)
			return { answer: ans, state: s };
		};
	};
};

// lazyChain create by functional
Fun.lazyChain = function (obj) {
	var calls = [];

	return {
		invoke: function (methodName /* ,args */) {
			var args = _.rest(arguments);
			calls.push(function (target) {
				var meth = target[methodName];
				
				return meth.apply(target, args);
			});

			return this;
		},
		force: function () {
			return _.reduce(calls, function (ret, thunk) {
				return thunk(ret);
			}, obj);
		}
	}
};

// Classical to string
Fun.polyToString = Fun.dispatch(
	function (s) { return _.isString(s) ? s : undefined; },
	function (s) { return _.isArray(s) ? Fun.stringifyArray(s) : undefined; },
	function (s) { return _.isObject(s) ? JSON.stringify(s) : undefined; },
	function (s) { return s.toString() }
);
Fun.stringifyArray = function (ary) {
	return ["[", _.map(ary, Fun.polyToString).join(","), "]"].join('');
};
  
export { Fun };
  