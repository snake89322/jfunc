/*
 * @author zehui-chen /  https://github.com/snake89322
 * 
 * */

// Create a safe reference to the Underscore object for use below.
var _ = require('underscore');

// Create a safe reference to the Method object for use below.
var Method = function (obj) {
  if (obj instanceof Method) return obj;
  if (!(this instanceof Method)) return new Method(obj);
  this._wrapped = obj;
};

// Internal function that returns existy
function existy (x) { return x != null };
// Internal function that returns truthy
function truthy (x) { return (x !== false) && existy(x) };

// All functions' return judge
Method.allOf = function (/* funs */) {
	return _.reduceRight(arguments, function (truth, f){
		return truth && f();
	}, true);
};

// All functions' return judge
Method.anyOf = function (/* funs */) {
	return _.reduceRight(arguments, function (truth, f) {
		return truth || f();
	}, false);
};

// Complementary set 
Method.complement = function (pred) {
	return function () {
		return !pred.apply(null, _.toArray(arguments));
	};
};

// Concat 
Method.cat = function () {
	var head = _.first(arguments);
	if (existy(head))
		return head.concat.apply(head, _.rest(arguments));
	else
		return [];
};

// Element concat with array
Method.construct = function (head, tail) {
	return Method.cat([head], _.toArray(tail));
};

// Dealing elements and concat
Method.mapcat = function (fun, coll) {
	return Method.cat.apply(null, _.map(coll, fun));
};

// Except last element of array
Method.butLast = function (coll) {
	return _.toArray(coll).slice(0, -1);
};

// Insert element to every interspace of array
Method.interpose = function (inter, coll) {
	return Method.butLast( Method.mapcat(function (e) {
		return Method.construct(e, [inter]);
	}, coll));
};

// Remove repeat elements of array
Method.dereplicate = function (coll) {
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
Method.project = function (table, keys) {
	return _.map(table, function (obj) {
		return _.pick.apply(null, Method.construct(obj, _.isArray(keys) ? keys : [keys]));
	});
};

// Rename key of object
Method.rename = function (obj, newNames) {
	return _.reduce(newNames, function (o, nu, old) {
			if (_.has(obj, old)) {
				o[nu] = obj[old];
				return o ;
			} else {
				return o;
			}
		},
		_.omit.apply(null, Method.construct(obj, _.keys(newNames))));
};

// Rename keys of table
Method.as = function (table, newNames) {
	return _.map(table, function (obj) {
		return Method.rename(obj, newNames);
	});
};

// Conditions select and return a new table
Method.restrict = function (table, pred) {
	return _.reduce(table, function (newTable, obj) {
		if (truthy(pred(obj)))
			return newTable;
		else 
			return _.without(newTable, obj);
	}, table);
};

// Pluck object's key or coll's number
Method.plucker (field) {
	return function (obj) {
		return (obj && obj[field]);
	};
};

// Compare elements of coll and return bestFun element
Method.finder (valueFun, bestFun, coll) {
	return _.reduce(coll, function (best, current) {
		var bestValue = valueFun(best);
		var currentValue = valueFun(current);

		return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
	});
};

export { Method };
