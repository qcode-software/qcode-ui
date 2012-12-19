;(function($, window, undefined) {
    // Delayed Group Hover plugin.
    // Treats all the elements in the current jQuery object as a single "group";
    // Invokes a user-defined callback when the user hovers over elements of the current jQuery object for more than a given time,
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
		// mouse was already in the group
		return;
	    }
	    if ( timer !== undefined ) {
		// reset the timer
		window.clearTimeout(timer);
	    }
	    if ( typeof options.hoverIn === "function" ) {
		// schedule the hoverIn function to be called
		timer = window.setTimeout(options.hoverIn.bind(group), options.inTime);
	    }
	}
	function mouseLeave(event) {
	    if ( $(event.relatedTarget).is(group) ) {
		// mouse isn't leaving the group
		return;
	    }
	    if ( timer !== undefined ) {
		// reset the timer
		window.clearTimeout(timer);
	    }
	    if ( typeof options.hoverOut === "function" ) {
		// schedule the hoverOut function to be called
		timer = window.setTimeout(options.hoverOut.bind(group), options.outTime);
	    }
	}
	// bind events
	group
	    .on('mouseenter', mouseEnter)
	    .on('mouseleave', mouseLeave);
    }
})(jQuery, window);