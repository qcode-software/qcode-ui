// Hover Scroller plugin - Create controls at the top and bottom of a scrollable box that scroll the box on mouse hover. Clicking the controls will quickly scroll to the end.
;(function($, undefined){
    $.fn.hoverScroller = function(options){
	// scrollbox is the box to scroll,
	// container is the element to add the controls to (normally the scrollbox's parent)
	// scrollSpeed is measured in pixels/millisecond and determines how fast the box scrolls (only a single fixed speed is currently supported)
	// snapTime how fast (in milliseconds) the scrollbox will scroll to the end if one of the controls is clicked.
	var settings = $.extend({
	    scrollBox: $(this),
	    container: $(this).parent(),
	    scrollSpeed: 0.3,
	    snapTime: 100
	}, options);
	var scrollBox = settings.scrollBox;
	var container = settings.container;
	var scrollSpeed = settings.scrollSpeed;
	var snapTime = settings.snapTime;

	// A div which appears at the bottom of the container, which scrolls the scrollBox down when you hover the mouse over it
	var downScroller = $('<div>')
	    .appendTo(container)
	    .addClass('down scroller')
	    .on('mouseenter', function() {
		// When the mouse enter the scroller, make the scroller more opaque then start scrolling
		downScroller.stop().fadeTo(0, 0.5);
		upScroller.stop().fadeTo(0, 0.1);
		var scrollTo = scrollBox.prop('scrollHeight') - scrollBox.height();
		var duration = (scrollTo - scrollBox.scrollTop()) / scrollSpeed;
		scrollBox.addClass('scrolling')
		    .animate(
			{ 'scrollTop': scrollTo },
			duration,
			function() {
			    // When scrolling is finished (reaches the bottom), hide the downwards scroller
			    downScroller.stop().fadeOut();
			    scrollBox.removeClass('scrolling');
			}
		    );
	    })
	    .on('mouseleave', function() {
		if ( scrollBox.is('.scrolling') ) {
		    // If the mouse leaves the downwards scroller before scrolling is finished, stop scrolling and return the scroller to its base opacity
		    downScroller.stop().fadeTo(0, 0.1);
		    scrollBox.stop();
		}
	    })
	    .on('click', function() {
		if ( scrollBox.is('.scrolling') ) {
		    var scrollTo = scrollBox.prop('scrollHeight') - scrollBox.height();
		    scrollBox.
			stop()
			.animate(
			    { 'scrollTop': scrollTo },
			    snapTime,
			    function() {
				// When scrolling is finished (reaches the bottom), hide the downwards scroller
				downScroller.stop().fadeOut();
				scrollBox.removeClass('scrolling');
			    }
			);
		}
	    });

	// A div which appears at the top of the container, which scrolls the scrollBox up when you hover the mouse over it
	var upScroller = $('<div>')
	    .prependTo(container)
	    .addClass('up scroller')
	    .on('mouseenter', function(){
		// When the mouse enter the scroller, make the scroller more opaque then start scrolling
		upScroller.stop().fadeTo(0, 0.5);
		downScroller.stop().fadeTo(0, 0.1);
		var duration = scrollBox.scrollTop() / scrollSpeed;
		scrollBox.addClass('scrolling')
		    .animate(
			{ 'scrollTop': 0 },
			duration,
			function(){
			    // When scrolling is finished (reaches the top), hide the upwards scroller
			    upScroller.stop().fadeOut();
			    scrollBox.removeClass('scrolling');
			}
		    );
	    })
	    .on('mouseleave', function(){
		if ( scrollBox.is('.scrolling') ) {
		    // If the mouse leaves the upwards scroller before scrolling is finished, stop scrolling and return the scroller to its base opacity
		    upScroller.stop().fadeTo(0, 0.1);
		    scrollBox.stop();
		}
	    })
	    .on('click', function() {
		if ( scrollBox.is('.scrolling') ) {
		    scrollBox.
			stop()
			.animate(
			    { 'scrollTop': 0 },
			    snapTime,
			    function() {
				// When scrolling is finished (reaches the bottom), hide the downwards scroller
				upScroller.stop().fadeOut();
				scrollBox.removeClass('scrolling');
			    }
			);
		}
	    });


	// Only display the scroller controls when the content is overflowing - listen for resize events to indicate that this may have changed.
	function updateControls() {
	    if ( ! scrollBox.is('.scrolling') ) {
		if ( parseInt(scrollBox.prop('scrollHeight')) == parseInt(scrollBox.height()) ) {
		    upScroller.add(downScroller).stop().fadeOut(0);
		} else {
		    if ( scrollBox.scrollTop() > 0 ) {
			upScroller.fadeTo(0, 0.1);
		    } else {
			upScroller.fadeOut();
		    }
		    if ( scrollBox.scrollTop() + scrollBox.height() < scrollBox.prop('scrollHeight') ) {
			downScroller.fadeTo(0, 0.1);
		    } else {
			downScroller.fadeOut();
		    }
		}
	    }
	}
	scrollBox.on('scroll', function() {
	    updateControls();
	});
	$(window).on('resize.hoverScroller', updateControls);
	updateControls();

	// Hide scrollbars.
	// TO DO: extend this to work for other layouts, use a wrapper if needed
	if ( scrollBox.css('left') !== "auto"
	     && scrollBox.css('right') === "0px"
	     && settings.container.css('overflow-x') === "hidden" ) {
	    var scrollBarWidth = scrollBox.width() - scrollBox[0].scrollWidth;
	    scrollBox.css('right', 0 - scrollBarWidth);
	}

	// End of hover scroller plugin; return original target for jQuery chainability
	return this;
    }
})(jQuery);