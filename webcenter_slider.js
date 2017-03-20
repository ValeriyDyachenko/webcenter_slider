function webcenter_slider(initParams) {
	
	var self = this;
	this.$s = undefined;
	this.id = undefined;
	
	this.params = {
		mode: initParams.mode || 'standard', //standard, infinite
		selector: initParams.selector,
		step: parseInt(initParams.step, 10) || 250,
		right: initParams.right,
		left: initParams.left,
		width: initParams.width || '330px',
		auto_step: initParams.auto_step
	}
	
	this.states = {
		infinite: false,
		next_margin: 0,
		auto_next_margins: [],
		strategy: undefined
	}
	
	this.model = {
		strategy: {
			fit: { 
				getPos: function() {
					var i = 0;
					var widthSum = 0;
					var margin = self.getMargin();
					if (margin < 0) 
					{
						margin *= -1;
					}
					var arWidth = self.states.auto_next_margins;
					$.each(arWidth, function(k, width) {
						widthSum += width;
						if (widthSum > margin) 
						{
							return false;
						} else {
							++i;
						}
					});
					return i;
				},
				doRight: function() {
					var pass_slides = self.params.auto_step;
					var margin_offcet = 0;
					var count_slides = self.states.auto_next_margins.length;
					var current_position = self.model.strategy.fit.getPos(); 
					for (var i = 0; i < current_position + pass_slides; i++) 
					{
						if (i + 1 < count_slides) {
							margin_offcet += self.states.auto_next_margins[i];
						}
					}
					self.$s.animate({'margin-left': margin_offcet * -1 }, 'fast');	
				},
				doLeft: function() {
					var pass_slides = self.params.auto_step;
					var margin = 0;
					var current_position = self.model.strategy.fit.getPos();
					var next_position = current_position - pass_slides;
					for (var i = 1; i <= next_position; i++) 
					{
						margin = margin + self.states.auto_next_margins[i-1];
					}
					self.$s.animate({'margin-left': margin * -1}, 'fast');	
				},				
				
				getCorrectionSpace: function() {
					var slider_width = self.getWidth();
					var childs_width = 0;
					var childs_count = 0;
					 $.each(self.states.auto_next_margins, function(k, width) {
						childs_width += width;
						++childs_count;
					 });
					 var result = (slider_width - childs_width) / childs_count;
					 return Math.ceil(result);
				},
				setAutoNextMarginVariable: function() {
					var states = self.states;
					var slider = self.$s.children();
					var widths = [];
					$.each(slider, function(key, val){
						states.auto_next_margins.push($(val).width());
					});
					var correction_koeff = self.model.strategy.fit.getCorrectionSpace();
					states.auto_next_margins = states.auto_next_margins.map(function(val){
						return val + correction_koeff;
					});
				}				
			},
			static: {
				doRight: function() {
					if (self.getWorkScale() * -1 > self.getMargin() - self.params.step) {
						if (self.states.infinite) {
							self.states.next_margin = 0;
							self.states.infinite = false;
						} else {
							self.states.next_margin = self.getWorkScale() * -1;
							if (self.params.mode === 'infinite') {
								self.states.infinite = true;
							}
						}
					} else {
						self.states.next_margin = self.getMargin() - self.params.step;
					}
					self.$s.animate({'margin-left': self.states.next_margin }, 'fast');					
				},
				doLeft: function() {
					if (self.getMargin() === 0 && self.params.mode === 'infinite') {
						self.states.next_margin = self.getWorkScale() * -1;
					} else if (self.getMargin() + self.params.step > 0) {
						self.states.next_margin = 0;
					} else {
						self.states.next_margin = self.getMargin() + self.params.step;
					}
					self.$s.animate({'margin-left': self.states.next_margin }, 'fast');					
				}
			}
		}
	}
	
	this.getMargin = function () { 
		return parseInt(this.$s.css('margin-left'), 10);
	}
	
	this.getWidth =  function(){
		return parseInt(this.$s.width());
	}
	
		this.getWorkScale = function() {
		return this.getWidth() - this.wrapper.getWidth();
	}
	
	this.doLeft = function() {
		if (this.states.strategy === 'static') 
		{
			this.model.strategy.static.doLeft();
		} 
		else if (this.states.strategy === 'fit') 
		{
			this.model.strategy.fit.doLeft();
		}
	}
	
	this.doRight = function() {
		if (this.states.strategy === 'static') {
			this.model.strategy.static.doRight();
		}
		else if (this.states.strategy === 'fit') 
		{
			this.model.strategy.fit.doRight();
		}		
	}
	
	this.setMode = function(mode) {
		var modes = ['standard', 'infinite']
		if (wcHelper.inArray(mode, modes)) {
			this.params.mode = mode;
		}
	}
	
	this.left = function(selector) {
		$(selector).addClass('wc_left_arrow ' + this.id);
		$(document).on('click', '.wc_left_arrow.' + this.id, function() {
			self.doLeft();
		});  		
	}
	
	this.right = function(selector) {
		$(selector).addClass('wc_right_arrow ' + this.id);
		$(document).on('click', '.wc_right_arrow.' + this.id, function() {
			self.doRight();
		});		
	}
	
	this.getStrategy = function() {
		if (this.params.auto_step) { 
			this.states.strategy = 'fit';
		} else {
			this.states.strategy = 'static';
		}
	}

	this.wrapper = {
		$w: undefined,
		getWidth: function() {
			return this.$w.width();
		}
	}
	
	this.init = function() {
		this.id = 'id_' + wcHelper.getRandInt(0, 100000);
		this.$s = $(this.params.selector);
		this.$s.addClass('wc_slider_container');
		this.$s.wrap("<div class='wc_slider_wrapper'></div>");
		this.wrapper.$w = this.$s.closest('.wc_slider_wrapper');
		this.params.auto_step && this.model.strategy.fit.setAutoNextMarginVariable();
		this.getStrategy();
		this.wrapper.$w.css('width', this.params.width);
		this.params.right && this.right(this.params.right);
		this.params.left && this.left(this.params.left);
	}
	
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
