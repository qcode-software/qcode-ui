// positionRelative to plugin - returns the position of the first element in the selection relative to the target.
// nb. if either element is in the offset parent chain of the other, position will account for scrolling of that element.
(function ($, undefined) {
    $.fn.positionRelativeTo = function(target) {
        if ( ! this.length ) {
            $.error('positionRelativeTo called on empty object');
        }
	var target = $(target);
        if ( ! target.length ) {
            $.error('positionRelativeTo called with empty target');
        }
	var $body = $('body');

	// Find chain of offset parents from this element to body
	var myOffsetParents = this;
	var current = this;
	while ( ! current.is($body) ) {
	    current = current.offsetParent();
	    myOffsetParents = myOffsetParents.add(current);
            if ( current.length !== 1 ) {
                $.error('Offset chain error - perhaps positionRelativeTo was called on a detached object?');
            }
	}

	// Search offset parents from target element up until a common offset parent is found
	current = target;
	while ( ! current.is(myOffsetParents) ) {
	    current = current.offsetParent();
            if ( current.length !== 1 ) {
                $.error('Offset chain error - perhaps positionRelativeTo was called with a detached target?');
            }
	}
	var commonOffsetParent = current;

	// Find position of this element relative to the common offset parent
	var myPosition = {
	    left: 0,
	    top: 0
	}
	current = this;
	while ( ! current.is(commonOffsetParent) ) {
	    var positionOfCurrent = current.position();
	    myPosition.left += positionOfCurrent.left;
	    myPosition.top += positionOfCurrent.top;
            if ( current != this ) {
                myPosition.left += parseFloat(current.css('border-left-width'))
                        + parseFloat(current.css('margin-left'));
                myPosition.top += parseFloat(current.css('border-top-width'))
                        + parseFloat(current.css('margin-top'));
            }
	    current = current.offsetParent();
	}
	if ( ! (this.is(commonOffsetParent) || commonOffsetParent.is('body')) ) {
	    myPosition.left += commonOffsetParent.scrollLeft();
	    myPosition.top += commonOffsetParent.scrollTop();
	}

	// Find position of target element relative to the common offset parent
	var targetPosition = {
	    left: 0,
	    top: 0
	}
	current = target;
	while ( ! current.is(commonOffsetParent) ) {
	    var positionOfCurrent = current.position();
	    targetPosition.left += positionOfCurrent.left;
	    targetPosition.top += positionOfCurrent.top;
            if ( current != target ) {
                targetPosition.left += parseFloat(current.css('border-left-width'))
                        + parseFloat(current.css('margin-left'));
                targetPosition.top += parseFloat(current.css('border-top-width'))
                        + parseFloat(current.css('margin-top'));
            }
	    current = current.offsetParent();
	}
	if ( ! (target.is(commonOffsetParent) || commonOffsetParent.is('body')) ) {
	    targetPosition.left += commonOffsetParent.scrollLeft();
	    targetPosition.top += commonOffsetParent.scrollTop();
	}

	// Return the difference of the two calculated positions
	return {
	    left: myPosition.left - targetPosition.left,
	    top: myPosition.top - targetPosition.top
	}
    };
})(jQuery);