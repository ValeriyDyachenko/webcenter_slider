function webcenter_slider(initParams) {
	
	this.$s = undefined,
	this.id = undefined,
	
	this.params = {
		mode: initParams.mode || 'standard', //standard, infinite
		selector: initParams.selector,
		step: parseInt(initParams.step, 10) || 250,
		right: initParams.right,
		left: initParams.left,
		width: initParams.width || '330px',		
	},
	
	this.states = {
		infinite: false,
		next_margin: 0
	},

	this.getMargin = function () { 
		return parseInt(this.$s.css('margin-left'), 10);
	},
	this.getWidth =  function(){
		return parseInt(this.$s.width());
	},
	this.getWorkScale = function() {
		return this.getWidth() - this.wrapper.getWidth();
	},
	this.doLeft = function() {
		if (this.getMargin() === 0 && this.params.mode === 'infinite') {
			this.states.next_margin = this.getWorkScale() * -1;
		} else if (this.getMargin() + this.params.step > 0) {
			this.states.next_margin = 0;
		} else {
			this.states.next_margin = this.getMargin() + this.params.step;
		}
		this.$s.animate({'margin-left': this.states.next_margin }, 'fast');
	},
	this.doRight = function() {
		if (this.getWorkScale() * -1 > this.getMargin() - this.params.step) {
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
			this.states.next_margin = this.getMargin() - this.params.step;
		}
		this.$s.animate({'margin-left': this.states.next_margin }, 'fast');
	},	
	this.setMode = function(mode) {
		var modes = ['standard', 'infinite']
		if (wcHelper.inArray(mode, modes)) {
			this.params.mode = mode;
		}
		console.log(mode);
		console.log(this.params.mode);
	},
	
	this.left = function(selector) {
		var slider = this;
		$(selector).addClass('wc_left_arrow ' + this.id);
		$(document).on('click', '.wc_left_arrow.' + this.id, function() {
			slider.doLeft();
		});  		
	},
	this.right = function(selector) {
		var slider = this;
		$(selector).addClass('wc_right_arrow ' + this.id);
		$(document).on('click', '.wc_right_arrow.' + this.id, function() {
			slider.doRight();
		});		
	},

	this.wrapper = {
		$w: undefined,
		getWidth: function() {
			return this.$w.width();
		}
	},
	
	this.init = function() {
		this.id = 'id_' + wcHelper.getRandInt(0, 100000);
		this.$s = $(this.params.selector);
		this.$s.addClass('wc_slider_container');
		this.$s.wrap("<div class='wc_slider_wrapper'></div>");
		this.wrapper.$w = this.$s.closest('.wc_slider_wrapper');
		this.params.step = this.params.step;
		this.wrapper.$w.css('width', this.params.width);
		this.params.right && this.right(this.params.right);
		this.params.left && this.left(this.params.left);
	},
	
	this.init();
} 

var wcHelper = {
	getRandInt: function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	},
	inArray: function (unit, arr) {
		var finded = false;
		$.each(arr, function(key, val) {
			if (unit === val) {
				finded = true;
				return false;
			}
		});
		return finded;
	},
	noSelect: function(selector) {
		$(selector).css('-webkit-user-select', 'none');
		$(selector).css('-moz-user-select', 'none');
		$(selector).css('-ms-user-select', 'none');
		$(selector).css('-o-user-select', 'none');
		$(selector).css('user-select', 'none');
	}
}