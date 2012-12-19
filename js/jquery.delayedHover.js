;(function($, window, undefined) {
    // Delayed hover plugin.
    // Triggers custom events "delayedHoverIn" and "delayedHoverOut".
    // Optionally takes a selector which tracks delayed mouse events on each element.
    $.fn.delayedHover = function(options){
	var options = $.extend({
	    inTime: 200,
	    outTime: 200,
	    selector: undefined
	}, options);

	function mouseEnter(event) {
	    var target = $(this);
	    var timer = target.data('delayedHoverTimer');
	    if ( timer !== undefined ) {
		// reset the timer
		window.clearTimeout(timer);
	    }
	    // schedule event to be triggered
	    timer = window.setTimeout(function() {
		target.trigger('delayedHoverIn');
	    }, options.inTime)
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
	    }, options.outTime)
	    target.data('delayedHoverTimer', timer);
	}

	if ( options.selector === undefined ) {
	    $(this)
		.on('mouseenter', mouseEnter)
		.on('mouseleave', mouseLeave);
	} else {
	    // Apply to each element matching the selector
	    $(this)
		.on('mouseenter', options.selector, mouseEnter)
		.on('mouseleave', options.selector, mouseLeave);
	}
    }
})(jQuery, window);