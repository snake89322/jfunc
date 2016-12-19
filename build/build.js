import * as jFunc from '../src/jfunc.js';

var root = typeof self == 'object' && self.self === self && self ||
           typeof global == 'object' && global.global === global && global ||
           this;
root.jFunc = root._$ = jFunc; 
root._ = require('underscore');