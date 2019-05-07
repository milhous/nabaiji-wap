;
(function() {
	var root = document.getElementsByTagName('html')[0];
	var NATIVE_W = 750;

	function flexible() {
		var w = document.documentElement.clientWidth;
		w = w > NATIVE_W ? NATIVE_W : w;
		var cw = w / (NATIVE_W / 100);
		root.style.fontSize = cw + 'px';
	}

	flexible();

	window.onresize = function() {
		flexible();
	};
})();