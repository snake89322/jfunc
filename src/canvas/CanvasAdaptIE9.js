/*
 * @author zehui-chen /  https://github.com/snake89322
 * 
 * */
import { UserAgent } from '../useragent/UserAgent.js';

function CanvasAdaptIE9 () {
	if ( UserAgent.ie9 ) { 
		// Missing in IE9
		(function() {
		    var lastTime = 0;
		    var vendors = ['webkit', 'moz'];
		    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		        window.cancelAnimationFrame =
		        	window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
		    }
		    if (!window.requestAnimationFrame)
		        window.requestAnimationFrame = function(callback, element) {
		            var currTime = new Date().getTime();
		            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
		              timeToCall);
		            lastTime = currTime + timeToCall;
		            return id;
		        };
		
		    if (!window.cancelRequestAnimationFrame)
		        window.cancelRequestAnimationFrame = function(id) {
		            clearTimeout(id);
		        };
		}());
		console.info('canvas AnimationFrame is adapted in IE9.');
		return true;
	} 
	return false;
}

export { CanvasAdaptIE9 };


