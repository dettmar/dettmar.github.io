/*! Isomer v0.2.4 | (c) 2014 Jordan Scales | jdan.github.io/isomer/license.txt */
!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.Isomer=t()}}(function(){return function t(n,e,r){function i(s,a){if(!e[s]){if(!n[s]){var h="function"==typeof require&&require;if(!a&&h)return h(s,!0);if(o)return o(s,!0);throw new Error("Cannot find module '"+s+"'")}var p=e[s]={exports:{}};n[s][0].call(p.exports,function(t){var e=n[s][1][t];return i(e?e:t)},p,p.exports,t,n,e,r)}return e[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(t,n){n.exports=t("./js/isomer")},{"./js/isomer":4}],2:[function(t,n){function e(t){this.elem=t,this.ctx=this.elem.getContext("2d"),this.width=t.width,this.height=t.height}e.prototype.clear=function(){this.ctx.clearRect(0,0,this.width,this.height)},e.prototype.path=function(t,n){this.ctx.beginPath(),this.ctx.moveTo(t[0].x,t[0].y);for(var e=1;e<t.length;e++)this.ctx.lineTo(t[e].x,t[e].y);this.ctx.closePath(),this.ctx.save(),this.ctx.fillStyle=this.ctx.strokeStyle=n.toHex(),this.ctx.stroke(),this.ctx.fill(),this.ctx.restore()},n.exports=e},{}],3:[function(t,n){function e(t,n,e){this.r=parseInt(t||0),this.g=parseInt(n||0),this.b=parseInt(e||0),this.loadHSL()}e.prototype.toHex=function(){var t=(256*this.r*256+256*this.g+this.b).toString(16);return t.length<6&&(t=new Array(6-t.length+1).join("0")+t),"#"+t},e.prototype.lighten=function(t,n){n=n||new e(255,255,255);var r=new e(n.r/255*this.r,n.g/255*this.g,n.b/255*this.b);return r.l=Math.min(r.l+t,1),r.loadRGB(),r},e.prototype.loadHSL=function(){var t,n,e=this.r/255,r=this.g/255,i=this.b/255,o=Math.max(e,r,i),s=Math.min(e,r,i),a=(o+s)/2;if(o===s)t=n=0;else{var h=o-s;switch(n=a>.5?h/(2-o-s):h/(o+s),o){case e:t=(r-i)/h+(i>r?6:0);break;case r:t=(i-e)/h+2;break;case i:t=(e-r)/h+4}t/=6}this.h=t,this.s=n,this.l=a},e.prototype.loadRGB=function(){var t,n,e,r=this.h,i=this.s,o=this.l;if(0===i)t=n=e=o;else{var s=.5>o?o*(1+i):o+i-o*i,a=2*o-s;t=this._hue2rgb(a,s,r+1/3),n=this._hue2rgb(a,s,r),e=this._hue2rgb(a,s,r-1/3)}this.r=parseInt(255*t),this.g=parseInt(255*n),this.b=parseInt(255*e)},e.prototype._hue2rgb=function(t,n,e){return 0>e&&(e+=1),e>1&&(e-=1),1/6>e?t+6*(n-t)*e:.5>e?n:2/3>e?t+(n-t)*(2/3-e)*6:t},n.exports=e},{}],4:[function(t,n){function e(t,n){n=n||{},this.canvas=new r(t),this.angle=Math.PI/6,this.scale=n.scale||70,this.originX=n.originX||this.canvas.width/2,this.originY=n.originY||.9*this.canvas.height,this.lightPosition=n.lightPosition||new h(2,-1,3),this.lightAngle=this.lightPosition.normalize(),this.colorDifference=.2,this.lightColor=n.lightColor||new i(255,255,255)}var r=t("./canvas"),i=t("./color"),o=t("./path"),s=t("./point"),a=t("./shape"),h=t("./vector");e.prototype.setLightPosition=function(t,n,e){this.lightPosition=new h(t,n,e),this.lightAngle=this.lightPosition.normalize()},e.prototype._translatePoint=function(t){var n=new s(t.x*this.scale*Math.cos(this.angle),t.x*this.scale*Math.sin(this.angle)),e=new s(t.y*this.scale*Math.cos(Math.PI-this.angle),t.y*this.scale*Math.sin(Math.PI-this.angle)),r=this.originX+n.x+e.x,i=this.originY-n.y-e.y-t.z*this.scale;return new s(r,i)},e.prototype.add=function(t,n){if("[object Array]"==Object.prototype.toString.call(t))for(var e=0;e<t.length;e++)this.add(t[e],n);else if(t instanceof o)this._addPath(t,n);else if(t instanceof a){var r=t.orderedPaths();for(var e in r)this._addPath(r[e],n)}},e.prototype._addPath=function(t,n){n=n||new i(120,120,120);var e=h.fromTwoPoints(t.points[1],t.points[0]),r=h.fromTwoPoints(t.points[2],t.points[1]),o=h.crossProduct(e,r).normalize(),s=h.dotProduct(o,this.lightAngle);color=n.lighten(s*this.colorDifference,this.lightColor),this.canvas.path(t.points.map(this._translatePoint.bind(this)),color)},e.Canvas=r,e.Color=i,e.Path=o,e.Point=s,e.Shape=a,e.Vector=h,n.exports=e},{"./canvas":2,"./color":3,"./path":5,"./point":6,"./shape":7,"./vector":8}],5:[function(t,n){function e(t){this.points="[object Array]"===Object.prototype.toString.call(t)?t:Array.prototype.slice.call(arguments)}var r=t("./point");e.prototype.push=function(t){this.points.push(t)},e.prototype.reverse=function(){var t=Array.prototype.slice.call(this.points);return new e(t.reverse())},e.prototype.translate=function(){var t=arguments;return new e(this.points.map(function(n){return n.translate.apply(n,t)}))},e.prototype.rotateZ=function(){var t=arguments;return new e(this.points.map(function(n){return n.rotateZ.apply(n,t)}))},e.prototype.scale=function(){var t=arguments;return new e(this.points.map(function(n){return n.scale.apply(n,t)}))},e.prototype.depth=function(){var t,n=0;for(t=0;t<this.points.length;t++)n+=this.points[t].depth();return n/(this.points.length||1)},e.Rectangle=function(t,n,i){void 0===n&&(n=1),void 0===i&&(i=1);var o=new e([t,new r(t.x+n,t.y,t.z),new r(t.x+n,t.y+i,t.z),new r(t.x,t.y+i,t.z)]);return o},e.Circle=function(t,n,i){i=i||20;var o,s=new e;for(o=0;i>o;o++)s.push(new r(n*Math.cos(2*o*Math.PI/i),n*Math.sin(2*o*Math.PI/i),0));return s.translate(t.x,t.y,t.z)},e.Star=function(t,n,i,o){var s,a,h=new e;for(s=0;2*o>s;s++)a=s%2===0?n:i,h.push(new r(a*Math.cos(s*Math.PI/o),a*Math.sin(s*Math.PI/o),0));return h.translate(t.x,t.y,t.z)},n.exports=e},{"./point":6}],6:[function(t,n){function e(t,n,r){return this instanceof e?(this.x="number"==typeof t?t:0,this.y="number"==typeof n?n:0,this.z="number"==typeof r?r:0,void 0):new e(t,n,r)}e.ORIGIN=new e(0,0,0),e.prototype.translate=function(t,n,r){return new e(this.x+t,this.y+n,this.z+r)},e.prototype.scale=function(t,n,e,r){var i=this.translate(-t.x,-t.y,-t.z);return void 0===e&&void 0===r?e=r=n:r="number"==typeof r?r:1,i.x*=n,i.y*=e,i.z*=r,i.translate(t.x,t.y,t.z)},e.prototype.rotateZ=function(t,n){var e=this.translate(-t.x,-t.y,-t.z),r=e.x*Math.cos(n)-e.y*Math.sin(n),i=e.x*Math.sin(n)+e.y*Math.cos(n);return e.x=r,e.y=i,e.translate(t.x,t.y,t.z)},e.prototype.depth=function(){return this.x+this.y-2*this.z},e.distance=function(t,n){var e=n.x-t.x,r=n.y-t.y,i=n.z-t.z;return Math.sqrt(e*e+r*r+i*i)},n.exports=e},{}],7:[function(t,n){function e(t){this.paths="[object Array]"===Object.prototype.toString.call(t)?t:Array.prototype.slice.call(arguments)}var r=t("./path"),i=t("./point");e.prototype.push=function(t){this.paths.push(t)},e.prototype.translate=function(){var t=arguments;return new e(this.paths.map(function(n){return n.translate.apply(n,t)}))},e.prototype.rotateZ=function(){var t=arguments;return new e(this.paths.map(function(n){return n.rotateZ.apply(n,t)}))},e.prototype.scale=function(){var t=arguments;return new e(this.paths.map(function(n){return n.scale.apply(n,t)}))},e.prototype.orderedPaths=function(){var t=this.paths.slice();return t.sort(function(t,n){return n.depth()-t.depth()})},e.extrude=function(t,n){n="number"==typeof n?n:1;var i,o=t.translate(0,0,n),s=new e;for(s.push(t.reverse()),s.push(o),i=0;i<t.points.length;i++)s.push(new r([o.points[i],t.points[i],t.points[(i+1)%t.points.length],o.points[(i+1)%o.points.length]]));return s},e.Prism=function(t,n,o,s){n="number"==typeof n?n:1,o="number"==typeof o?o:1,s="number"==typeof s?s:1;var a=new e,h=new r([t,new i(t.x+n,t.y,t.z),new i(t.x+n,t.y,t.z+s),new i(t.x,t.y,t.z+s)]);a.push(h),a.push(h.reverse().translate(0,o,0));var p=new r([t,new i(t.x,t.y,t.z+s),new i(t.x,t.y+o,t.z+s),new i(t.x,t.y+o,t.z)]);a.push(p),a.push(p.reverse().translate(n,0,0));var u=new r([t,new i(t.x+n,t.y,t.z),new i(t.x+n,t.y+o,t.z),new i(t.x,t.y+o,t.z)]);return a.push(u.reverse()),a.push(u.translate(0,0,s)),a},e.Pyramid=function(t,n,o,s){n="number"==typeof n?n:1,o="number"==typeof o?o:1,s="number"==typeof s?s:1;var a=new e,h=new r([t,new i(t.x+n,t.y,t.z),new i(t.x+n/2,t.y+o/2,t.z+s)]);a.push(h),a.push(h.rotateZ(t.translate(n/2,o/2),Math.PI));var p=new r([t,new i(t.x+n/2,t.y+o/2,t.z+s),new i(t.x,t.y+o,t.z)]);return a.push(p),a.push(p.rotateZ(t.translate(n/2,o/2),Math.PI)),a},e.Cylinder=function(t,n,i,o){n="number"==typeof n?n:1;var s=r.Circle(t,n,i),a=e.extrude(s,o);return a},n.exports=e},{"./path":5,"./point":6}],8:[function(t,n){function e(t,n,e){this.i="number"==typeof t?t:0,this.j="number"==typeof n?n:0,this.k="number"==typeof e?e:0}e.fromTwoPoints=function(t,n){return new e(n.x-t.x,n.y-t.y,n.z-t.z)},e.crossProduct=function(t,n){var r=t.j*n.k-n.j*t.k,i=-1*(t.i*n.k-n.i*t.k),o=t.i*n.j-n.i*t.j;return new e(r,i,o)},e.dotProduct=function(t,n){return t.i*n.i+t.j*n.j+t.k*n.k},e.prototype.magnitude=function(){return Math.sqrt(this.i*this.i+this.j*this.j+this.k*this.k)},e.prototype.normalize=function(){var t=this.magnitude();return new e(this.i/t,this.j/t,this.k/t)},n.exports=e},{}]},{},[1])(1)});
(function(){var a,b,c,d,e,f,g,h,i=[].slice,j=function(a,b){return function(){return a.apply(b,arguments)}};window.raf=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,window.cancelRaf=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame,window.easterTime=!1,e=Isomer.Shape,d=Isomer.Point,a=Isomer.Color,c=Isomer.Path,h=function(a,b,c){var d,e;return null==b&&(b=100),e=void 0,d=void 0,function(){var f,g,h;f=1<=arguments.length?i.call(arguments,0):[],g=c||this,h=+new Date,e&&h<e+b?(clearTimeout(d),d=setTimeout(function(){e=h,a.apply(g,f)},b)):(e=h,a.apply(g,f))}},g=function(a,b,c){var d;return d=void 0,function(){var e,f,g,h;g=this,e=arguments,h=function(){d=null,c||a.apply(g,e)},f=c&&!d,clearTimeout(d),d=setTimeout(h,b),f&&a.apply(g,e)}},b=function(){function a(){this.hide=j(this.hide,this),this.setupElements(),this.listen(),this.tower=new f(this),this.tower.done(function(){return ga("send","event","yolo","timeout")})}return a.prototype.setupElements=function(){return this.canvas=document.createElement("canvas"),this.canvas.setAttribute("class","mobile_bg"),this.bg=document.getElementById("background"),this.bg.appendChild(this.canvas),this.bg.setAttribute("class","loaded"),this.canvas.width=2*window.innerWidth,this.canvas.height=2*window.innerHeight,this.iso=new Isomer(this.canvas)},a.prototype.listen=function(){return window.onresize=g(function(a){return function(){return a.tower.x=f.prototype.blockSideAmount,a.tower.y=f.prototype.blockSideAmount,a.tower.z=0,a.tower.step=0,a.tower.xTarget=f.prototype.blockSideAmount,a.tower.yTarget=f.prototype.blockSideAmount,a.tower.zTarget=f.prototype.blockSideAmount,a.tower.xLevel=f.prototype.blockSideAmount,a.tower.yLevel=f.prototype.blockSideAmount,a.canvas.width=2*window.innerWidth,a.canvas.height=2*window.innerHeight,a.iso.originX=a.canvas.width/2,a.iso.originY=.9*a.canvas.height}}(this),250)},a.prototype.hide=function(){return this.bg.setAttribute("class",""),setTimeout(this.canvas.parentElement.removeChild.bind(this.canvas.parentElement),500,this.canvas)},a}(),f=function(){function b(a){this.scene=a,this.render=j(this.render,this),this.cube=e.Prism(d.ORIGIN,this.cubeSize,this.cubeSize,this.cubeSize),this.render(!1),{done:this.done}}var c;return b.prototype.beginning=Date.now(),b.prototype.end=Date.now(),b.prototype.blockSideAmount=6,b.prototype.layerSteps=Math.pow(b.prototype.blockSideAmount+1,2),b.prototype.cubeSteps=Math.pow(b.prototype.blockSideAmount+1,3),b.prototype.x=b.prototype.blockSideAmount,b.prototype.y=b.prototype.blockSideAmount,b.prototype.z=0,b.prototype.xTarget=b.prototype.blockSideAmount,b.prototype.yTarget=b.prototype.blockSideAmount,b.prototype.zTarget=b.prototype.blockSideAmount,b.prototype.xLevel=b.prototype.blockSideAmount,b.prototype.yLevel=b.prototype.blockSideAmount,b.prototype.hasTurned=!1,b.prototype.step=0,b.prototype.cubeSize=.5,b.prototype.rStart=219,b.prototype.gStart=1,b.prototype.bStart=26,b.prototype.rEnd=235,b.prototype.gEnd=175,b.prototype.bEnd=28,b.prototype.getColor=function(b,c){var d,e,f,g;return f=(b+c*this.layerSteps)/this.cubeSteps,g=Math.round((this.rEnd-this.rStart)*f+this.rStart),e=Math.round((this.gEnd-this.gStart)*f+this.gStart),d=Math.round((this.bEnd-this.bStart)*f+this.bStart),new a(g,e,d)},c=[],b.prototype.render=function(a,b){if(window.easterTime)return this.scene.hide();if(this.beginning=Date.now(),this.scene.iso.add(this.cube.translate(this.x*this.cubeSize,this.y*this.cubeSize,this.z*this.cubeSize),this.getColor(this.step,this.z)),this.y===this.blockSideAmount&&0===this.x&&(this.hasTurned=!0),0===this.x&&0===this.y){if(this.z===8*this.blockSideAmount)return"function"==typeof this.next?this.next():void 0;this.hasTurned=!1,this.x=this.blockSideAmount,this.y=this.blockSideAmount,this.xTarget=this.blockSideAmount,this.yTarget=this.blockSideAmount,this.xLevel=this.blockSideAmount,this.yLevel=this.blockSideAmount,this.step=0,this.z++}else this.x===this.xTarget&&this.y===this.yTarget?this.hasTurned?(this.y=--this.yLevel,this.xTarget=this.y,this.yTarget=0,this.x=0):(this.x=--this.xLevel,this.xTarget=this.blockSideAmount,this.yTarget=this.x,this.y=this.blockSideAmount):(this.y--,this.x++,this.step++);return this.end=Date.now(),this.diff=Math.max(this.end-this.beginning,0),this.delay=20-this.diff,setTimeout(raf,this.delay,this.render)},b.prototype.done=function(a){this.next=a},b}(),new b}).call(this);
(function(){function e(c,d){var b=document.createElement("script");b.onload=b.onreadystatechange=function(){if(!this.readyState||g.test(this.readyState))b.onload=b.onreadystatechange=null,d&&d(b),b=null};b.async=!0;b.src=c;h.insertBefore(b,f)}var f=document.getElementsByTagName("script")[0],h=f.parentNode,g=/ded|co/;window.sssl=function(c,d){if("string"==typeof c)e(c,d);else{var b=c.shift();e(b,function(){c.length?window.a(c,d):d&&d()})}}})();

var hasClicked = false,
	hand = document.getElementById("hand");

if (!!window.WebGLRenderingContext && hand)
	hand.onclick = function() {
		if(hasClicked) return;
		hasClicked = true;
		easterTime = true;
		ga('send', 'event', 'duck', 'click');
		setTimeout(sssl, 500, "/assets/js/webgl.js");
	};

var emails = document.getElementsByClassName("email") || [];
for(var i = 0, len = emails.length; i < len; i++)
	emails[i].setAttribute("href", "mailto:dettmar@gmail.com");

var	trackClick = function(e) {
		
		if(e.target && e.target.innerHTML && ga)
			ga('send', 'event', 'link', 'click', e.target.innerHTML);
	},
	links = document.getElementsByTagName("a");

for(var i = 0, len = links.length; i < len; i++)
	links[i].onclick = trackClick;