(function($, window, undefined) {
    // Delayed hover plugin.
    // Triggers "delayedHoverIn" or "delayedHoverOut" if the user hovers over, or out of, a single element for more than a given time.
    // Each element in the current jQuery object is handled separately, but a selector can be used to delegate the listeners
    // (eg. if delayedHover events will need to be triggered on elements that are added to the DOM later)
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
		window.clearTimeout(timer);
	    }
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
	    $(this)
		.on('mouseenter', options.selector, mouseEnter)
		.on('mouseleave', options.selector, mouseLeave);
	}
    }

    // Delayed Group Hover plugin.
    // Treats all the elements in the current jQuery object as a single "group";
    // Invokes a user-defined callback when the user hovers over one element from the current jQuery object for more than a given time,
    // or when they hover out of all the elements of the current jQuery object for more than a given time.
    $.fn.delayedGroupHover = function(options) {
	// hoverIn and hoverOut are optional callback functions.
	var options = $.extend({
	    inTime: 200,
	    outTime: 200,
	    hoverIn: undefined,
	    hoverOut: undefined
	}, options);

	var timer;
	var group = this;
	function mouseEnter(event) {
	    if ( $(event.relatedTarget).is(group) ) {
		return;
	    }
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    if ( typeof options.hoverIn === "function" ) {
		timer = window.setTimeout(options.hoverIn.bind(group), options.inTime);
	    }
	}
	function mouseLeave(event) {
	    if ( $(event.relatedTarget).is(group) ) {
		return;
	    }
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    if ( typeof options.hoverOut === "function" ) {
		timer = window.setTimeout(options.hoverOut.bind(group), options.outTime);
	    }
	}

	group
	    .on('mouseenter', mouseEnter)
	    .on('mouseleave', mouseLeave);
    }
})(jQuery, window);