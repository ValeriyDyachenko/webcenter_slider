var wc_Slider = (function () {

	var defParams = {
		mode: 'standard',
		selector: 'wc_slider',
		step: 250,
		right: '.next',
		left: 'prev',
		width: '330px',
		auto_step: false,
		auto_play: false,
		auto_play_timer: 0
	};

	var id = 1;

	var strateges = {
		fit: {
			doLeft: function () { },
			doRight: function () { }
		},
		static: {
			doLeft: function () {
				if (this.getMargin() === 0 && this.params.mode === 'infinite') {
					this.states.next_margin = this.getWorkScale() * -1;
				} else if (this.getMargin() + parseInt(this.params.step) > 0) {
					this.states.next_margin = 0;
				} else {
					this.states.next_margin = this.getMargin() + parseInt(this.params.step);
				}
				this.$s.animate({
					'margin-left': this.states.next_margin
				}, 'fast');
			},

			doRight: function () {
				if (this.getWorkScale() * -1 > this.getMargin() - parseInt(this.params.step)) {
					if (this.states.infinite) {
						this.states.next_margin = 0;
						this.states.infinite = false;
					} else {
						this.states.next_margin = this.getWorkScale() * -1;
						if (this.params.mode === 'infinite') {
							this.states.infinite = true;
						}
					}
				} else {
					this.states.next_margin = this.getMargin() - parseInt(this.params.step);
				}
				this.$s.animate({
					'margin-left': this.states.next_margin
				}, 'fast');
			}
		}
	}

	function initArrow(selector, class_name, event_name) {
		var element = document.querySelector(selector);
		element.className = class_name;
		element.onclick = event_name;
	};

	var sliderProto = {
		getMargin: function () {
			var style = window.getComputedStyle(this.s, null);
			var left = style.marginLeft;
			return parseInt(left, 10);
		},
		getWidth: function () {
			var box = this.s.getBoundingClientRect();
			return parseInt(box.width, 10);
		},
		getWorkScale: function () {
			var result = this.getWidth() - this.wrapper.getWidth();
			return result;
		}
	}

	return function WC_Slider(userParams) {
		this.params = {};
		this.__proto__ = sliderProto;
		Object.assign(this.params, defParams, userParams);
		this.id = id++;

		this.states = {};

		this.states.infinite = false;
		this.states.next_margin = 0;
		this.states.auto_next_margins = [];

		this.s = document.querySelector(this.params.selector);
		this.s.className = 'wc_slider_container';

		// это я пока не знаю как переделать на ванилу
		this.$s = $(this.params.selector);
		this.$s.addClass('wc_slider_container');
		this.$s.wrap("<div class='wc_slider_wrapper'></div>");
		this.wrapper = {};
		this.wrapper.$w = this.$s.closest('.wc_slider_wrapper');
		this.wrapper.$w.css('width', this.params.width);
		this.wrapper.getWidth = function () {
			return this.$w.width()
		};
		// end

		if (this.params.auto_step) setAutoNextMarginVariable();

		var strategy = this.params.auto_step ? 'fit' : 'static';
		var doLeft = strateges[strategy].doLeft.bind(this);
		var doRight = strateges[strategy].doRight.bind(this);

		initArrow(this.params.right, 'wc_right_arrow' + this.id, doRight);
		initArrow(this.params.left, 'wc_left_arrow' + this.id, doLeft);

		if (this.params.auto_play) {
			this.player = setInterval(doRight, this.params.auto_play_timer);
		}
	}



})();

var noSelect = function (selector) {
	var $result = $(selector);
	$result.css('-webkit-user-select', 'none');
	$result.css('-moz-user-select', 'none');
	$result.css('-ms-user-select', 'none');
	$result.css('-o-user-select', 'none');
	$result.css('user-select', 'none');
}