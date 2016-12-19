/*
 * @author zehui-chen /  https://github.com/snake89322
 * 
 * */
var _ = require('underscore');

var UserAgent = (function () {
  var ua = (window.navigator && navigator.userAgent) || "";
  var av = (window.navigator && navigator.appVersion) || "";
  var ua2L = navigator.userAgent.toLowerCase();
  
  var result = Object.create(null);
  
  var table = { //移动终端浏览器版本信息
	  ie: /msie/i.test(ua), //IE内核
	  ie6: /msie 6/i.test(ua),
	  ie7: /msie 7/i.test(ua),
	  ie8: /msie 8/i.test(ua),
	  ie9: /msie 9/i.test(ua),
	  ie10: /msie 10/i.test(ua),
	  ie11: /Trident.*rv[ :]*11\./.test(ua),
	  opera: /opera/i.test(ua), //opera内核
	  presto: ua.indexOf('Presto') > -1, //opera内核
	  safari: /webkit\W(?!.*chrome).*safari\W/i.test(ua), //苹果内核
	  chrome: /webkit\W.*(chrome|chromium)\W/i.test(ua), //谷歌内核
	  webkit: /webkit\W/i.test(ua),
	//firefox: /firefox/i.test(ua), 
	//gecko: /gecko/i.test(ua), 
	  gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, //火狐内核
	  mobile: /iphone|ipod|(android.*?mobile)|blackberry|nokia/i.test(ua), //是否为移动终端
	//mobile: !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	  ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	  android: ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1, //android终端或uc浏览器
	  iPhone: ua.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
	  iPad: ua.indexOf('iPad') > -1, //是否iPad
	  webApp: ua.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
	  iosv: ua.substr(ua.indexOf('iPhone OS') + 9, 3),
	  weixin: ua2L.match(/MicroMessenger/i) == "micromessenger",
	  ali: ua.indexOf('AliApp') > -1,
	  tablet: /ipad|android(?!.*mobile)/i.test(ua),
		desktop: function () { return (!this.mobile && !this.tablet) },
	  kindle: /kindle|silk/i.test(ua),
	  tv: /googletv|sonydtv|appletv|roku|smarttv/i.test(ua),
	  online: navigator.onLine,
		offline: function () { return !this.online },
	  windows: /win/i.test(av),
	  mac: /mac/i.test(av),
	  unix: /x11/i.test(av),
	  linux: /linux/i.test(av)
  };
  
  _.bindAll(table, 'desktop', 'offline');
  
  _.map(table, function (value, index) {
  	_.isFunction(value) ? result[index] = (value)() : result[index] = value;
  });
  
  return result;
})();

Object.freeze(UserAgent);

export { UserAgent };
