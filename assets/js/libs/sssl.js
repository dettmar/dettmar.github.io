(function(){function e(c,d){var b=document.createElement("script");b.onload=b.onreadystatechange=function(){if(!this.readyState||g.test(this.readyState))b.onload=b.onreadystatechange=null,d&&d(b),b=null};b.async=!0;b.src=c;h.insertBefore(b,f)}var f=document.getElementsByTagName("script")[0],h=f.parentNode,g=/ded|co/;window.sssl=function(c,d){if("string"==typeof c)e(c,d);else{var b=c.shift();e(b,function(){c.length?window.a(c,d):d&&d()})}}})();

sssl(["/assets/js/mobile.js"], function(){
	
	var hasClicked = false;
	
	document.getElementById("hand").onclick = function() {
		if(hasClicked) return;
		hasClicked = true;
		easterTime = true;
		setTimeout(function(){
			sssl(["/assets/js/webgl.js"]);	
		}, 500);
		
	};
});

document.getElementById("email").setAttribute("href", "mailto:dettmar@gmail.com");


//if (!!window.WebGLRenderingContext)
