/*
 * @author zehui-chen /  https://github.com/snake89322
 * 
 * */
import { Fun } from '../core/Fun.js';
var _ = require('underscore');

// Isa to excute action
function isa (fun, action) {
  return function (arg) {
    if(fun(arg)) 
      return action(arg);
  };
};

// Dispatch to deal arg, return [strs]
function LoaderProcesser (arg, src) {
  if ( !Fun.existy(src) )
    var src = [];
  
  Fun.dispatch(
    isa(_.isString, function (str) {
      src.push(str);
    }),
    isa(_.isObject, function (obj) {
      for(var key in obj) {
        if ( _.isObject(obj[key]) || _.isString(obj[key]) )
          LoaderProcesser(obj[key], src);
      }
    })
  )(arg);

  return src;
};

// Class Loader
function Loader (step, callback, /* ,args*/) {
  this.step = step;
  this.callback = callback;
  this.args = _.rest(_.rest(arguments));
  this.argsLen = this.args.length;
  this.src = [];
  this.size = 0;
  this.percent = 0;
  this.rate = 0;

  // Get args that coll of sources
  for(var argIndex = 0; argIndex < this.argsLen; argIndex++)
    this.src = Fun.cat(this.src, LoaderProcesser(this.args[argIndex]));
  // Set Loader size and rate
  this.size =  this.rate = this.src.length;  

  // Start Loader
   _.map(this.src, function (str) {
    if (/\.js$/.test(str)) 
      this.LoadJs(str);
    else if (/\.css$/.test(str)) 
      this.LoadCss(str);
    else 
      this.LoadImg(str);
  }.bind(this));
};
Loader.prototype = {
  constructor: Loader,

  LoadJs: function (str) { // Load js
    var script = document.createElement('script');
    script.type= 'text/javascript';
    script.src= str;
    // script.async = true;
    document.body.appendChild(script);
    script.onload = script.onerror = script.onabort = function () {
      this.LoaderHandle();
    }.bind(this);
  },
  LoadCss: function (str) { // Load css
    var link = document.createElement('link');
    link.type = "text/css";
    link.rel="stylesheet";
    link.href = str;
    document.head.appendChild(link);
    link.onload = link.onerror = link.onabort = function () {
      this.LoaderHandle();
    }.bind(this);
  },
  LoadImg: function (str) { // Load img
    var img = new Image();
    img.src = str;

    if (img.complete) 
      this.LoaderHandle();
    else
      img.onload = img.onerror= img.onabort = function () {
        this.LoaderHandle();
      }.bind(this);
    
  },
  LoaderHandle: function () { // Async call
    this.rate--;
    this.percent = ((this.size - this.rate) / this.size).toFixed(2) * 100;
    // console.log(this.percent + ' to ', this);
    this.step();
    if (this.rate <= 0) 
      this.callback(); 
  }
}

export { Loader };
