// 订阅 & 发布
var ee = new EventEmitter();

var cmd = {
	SHOW_POP: 'ee:showPop',
	CLOSE_POP: 'ee:closePop',
};

(function() {
	// 元素
	var $elem = {};

	// 初始化弹层
	var initPop = function() {
		$(document).on('click', '.pop [data-close]', function(evt) {
			var pop_name = $(this).attr('data-close');

			closePop(pop_name);
		});

		// 发布 - 显示弹层
		ee.on(cmd.SHOW_POP, showPop);

		// 发布 - 关闭弹层
		ee.on(cmd.CLOSE_POP, closePop);
	};

	/**
	 * 显示弹层
	 * @param (string) name 元素名称
	 **/
	var showPop = function(name) {
		if (typeof name === 'undefined') {
			return;
		}

		var obj = $(name);

		if (!$('.pop').hasClass('fadeIn')) {
			$('.pop').css({
				'display': 'block'
			});

			setTimeout(function() {
				$('.pop').addClass('fadeIn');
				obj.addClass('zoomIn');
			}, 10);
		} else {
			$('.pop section').removeClass('zoomIn');
			obj.addClass('zoomIn');
		}
	};

	/**
	 * 关闭弹层
	 * @param (string) name 元素名称
	 **/
	var closePop = function(name) {
		if (typeof name === 'undefined') {
			$('.pop section').removeClass('zoomIn');
		} else {
			var obj = $(name);

			obj.removeClass('zoomIn');
		}

		$('.pop').removeClass('fadeIn');

		setTimeout(function() {
			$('.pop').css({
				'display': 'none'
			});
		}, 600);
	};

	// 初始化
	var init = function() {
		// 初始化弹层
		if ($('.pop').length) {
			initPop();
		}
	};

	init();
})();