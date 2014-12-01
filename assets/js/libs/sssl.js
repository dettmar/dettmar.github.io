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