(function(){function e(c,d){var b=document.createElement("script");b.onload=b.onreadystatechange=function(){if(!this.readyState||g.test(this.readyState))b.onload=b.onreadystatechange=null,d&&d(b),b=null};b.async=!0;b.src=c;h.insertBefore(b,f)}var f=document.getElementsByTagName("script")[0],h=f.parentNode,g=/ded|co/;window.sssl=function(c,d){if("string"==typeof c)e(c,d);else{var b=c.shift();e(b,function(){c.length?window.a(c,d):d&&d()})}}})();

//if (!!window.WebGLRenderingContext)
if(0) sssl(["/assets/js/webgl.js"]);
else sssl(["/assets/js/mobile.js"]);