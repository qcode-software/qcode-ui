// Hover Scroller plugin - Create controls at the top and bottom of a scrollable box that scroll the box on mouse hover.
// Clicking the controls will quickly scroll to the end.
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
	var scrollBox = settings.scrollBox.addClass('hover-scroller');
	var container = settings.container.addClass('hover-scroller-container');
	var scrollSpeed = settings.scrollSpeed;
	var snapTime = settings.snapTime;
        var scrollTarget = scrollBox.scrollTop();
        var destination = 0;
        var scrollDuration = 1000;

        scrollBox.on('mousewheel', function(event) {
            if ( event.originalEvent.wheelDeltaY < 0 ) {
                destination = Math.max(destination, scrollBox.scrollTop());
                scrollTo(destination + 100);
            } else {
                destination = Math.min(destination, scrollBox.scrollTop());
                scrollTo(destination - 100);
            }
            event.preventDefault();
            event.stopPropagation();
        });

        var threshold = 10;
        scrollBox.on('mousedown', function(event) {
            var dragMouseFrom = event.pageY;
            var scrollFrom = scrollBox.scrollTop();
            var dragging = false;
            scrollBox.on('mousemove.dragListener', function(event) {
                if ( dragging || Math.abs(event.pageY - dragMouseFrom) > threshold ) {
                    dragging = true;
                    destination = scrollFrom - (event.pageY - dragMouseFrom);
                    scrollBox.scrollTop(destination);
                }
            });
            scrollBox.one('mouseup mouseleave', function() {
                scrollBox.off('mousemove.dragListener');
            });
            $(event.target).one('click', function(event) {
                if ( dragging ) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            });
        });

	// A div which appears at the bottom of the container, which scrolls the scrollBox down when you hover the mouse over it
	var downScroller = $('<div>')
	    .appendTo(container)
	    .addClass('down scroller')
	    .on('mouseenter', function() {
		// When the mouse enter the scroller, make the scroller more opaque then start scrolling
		downScroller.stop().fadeTo(0, 0.5);
		upScroller.stop().fadeTo(0, 0.2);
                startScrollingDown();
	    })
	    .on('mouseleave', function() {
		downScroller.stop().fadeTo(0, 0.2);
		stopScrolling();
	    })
	    .on('click', function() {
                snapTo(scrollBox.prop('scrollHeight') - scrollBox.height());
	    });

	// A div which appears at the top of the container, which scrolls the scrollBox up when you hover the mouse over it
	var upScroller = $('<div>')
	    .prependTo(container)
	    .addClass('up scroller')
	    .on('mouseenter', function(){
		// When the mouse enter the scroller, make the scroller more opaque then start scrolling
		upScroller.stop().fadeTo(0, 0.5);
		downScroller.stop().fadeTo(0, 0.2);
		startScrollingUp();
	    })
	    .on('mouseleave', function(){
		if ( scrollBox.is('.scrolling') ) {
		    // If the mouse leaves the upwards scroller before scrolling is finished, stop scrolling and return the scroller to its base opacity
		    upScroller.stop().fadeTo(0, 0.2);
		    stopScrolling();
		}
	    })
	    .on('click', function() {
                snapTo(0);
	    });


	scrollBox.on('scroll', function() {
	    updateControls();
	});
	$(window).on('resize.hoverScroller', updateControls);
	updateControls();

	// End of hover scroller plugin; return original target for jQuery chainability
	return this;

	// Only display the scroller controls when the content is overflowing - listen for resize events to indicate that this may have changed.
	function updateControls() {
	    if ( ! scrollBox.is('.scrolling') ) {
		if ( parseInt(scrollBox.prop('scrollHeight')) == parseInt(scrollBox.height()) ) {
		    upScroller.add(downScroller)
                        .stop()
                        .fadeOut(0);
		} else {
		    if ( scrollBox.scrollTop() > 0 ) {
			upScroller.fadeTo(0, 0.2);
		    } else {
			upScroller.fadeOut();
		    }
		    if ( scrollBox.scrollTop() + scrollBox.height() < scrollBox.prop('scrollHeight') ) {
			downScroller.fadeTo(0, 0.2);
		    } else {
			downScroller.fadeOut();
		    }
		}
	    }
	}

        function scrollTo(newDestination) {
            destination = newDestination;
            scrollBox
                .stop()
                .addClass('scrolling')
                .animate(
                    {'scrollTop': destination},
                    scrollDuration,
                    stopScrolling
                );
        }
        function snapTo(newDestination) {
            destination = newDestination;
            scrollBox
                .stop()
                .addClass('scrolling')
                .animate(
                    {'scrollTop': destination},
                    snapTime,
                    stopScrolling
                );
        }
        function startScrollingUp() {
            destination = 0;
            var duration = scrollBox.scrollTop() / scrollSpeed;
            scrollBox
                .stop()
                .addClass('scrolling')
                .animate(
                    {'scrollTop': 0},
                    duration,
                    stopScrolling
                );
        }
        function startScrollingDown() {
            destination = scrollBox.prop('scrollHeight') - scrollBox.height();
            var duration = (destination - scrollBox.scrollTop()) / scrollSpeed;
            scrollBox
                .stop()
                .addClass('scrolling')
                .animate(
                    {'scrollTop': destination},
                    duration,
                    stopScrolling
                );
        }
        function stopScrolling() {
            destination = scrollBox.scrollTop();
            scrollBox
                .stop()
                .removeClass('scrolling');
            updateControls();
        }
    }
})(jQuery);