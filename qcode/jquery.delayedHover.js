(function($, window, undefined) {
    $.fn.delayedHover = function(options){
	var settings = $.extend({
	    inTime: 200,
	    outTime: 200
	}, options);

	function mouseEnter(event) {
	    var target = $(this);
	    var timer = target.data('delayedHoverTimer');
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    timer = window.setTimeout(function() {
		target.trigger('delayedHoverIn');
	    }, settings.inTime)
	    target.data('delayedHoverTimer', timer);
	}
	function mouseLeave(event) {
	    var target = $(this);
	    var timer = target.data('delayedHoverTimer');
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    timer = window.setTimeout(function() {
		target.trigger('delayedHoverOut');
	    }, settings.outTime)
	    target.data('delayedHoverTimer', timer);
	}

	if ( settings.selector === undefined ) {
	    $(this)
		.on('mouseenter', mouseEnter)
		.on('mouseleave', mouseLeave);
	} else {
	    $(this)
		.on('mouseenter', settings.selector, mouseEnter)
		.on('mouseleave', settings.selector, mouseLeave);
	}
    }

    // delayedGroupHover plugin - trigger callback functions when the mouse hovers over or out of a group of elements for enough time.
    $.fn.delayedGroupHover = function(options) {
	var settings = $.extend({
	    inTime: 200,
	    outTime: 200
	}, options);

	var timer;
	function mouseEnter(event) {
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    if ( typeof settings.hoverIn === "function" ) {
		timer = window.setTimeout(settings.hoverIn, settings.inTime);
	    }
	}
	function mouseLeave(event) {
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    if ( typeof settings.hoverOut === "function" ) {
		timer = window.setTimeout(settings.hoverOut, settings.outTime);
	    }
	}

	$(this)
	    .on('mouseenter', mouseEnter)
	    .on('mouseleave', mouseLeave);
    }
})(jQuery, window);