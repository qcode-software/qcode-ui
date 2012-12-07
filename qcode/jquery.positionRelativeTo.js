// positionRelative to plugin - returns the position of the first element in the selection relative to the target.
// nb. if either element is in the offset parent chain of the other, position will account for scrolling of that element.
(function ($, undefined) {
    $.fn.positionRelativeTo = function(target) {
	var target = $(target);
	var $body = $('body');

	// Find chain of offset parents from this element to body
	var myOffsetParents = this;
	var current = this;
	while ( ! current.is($body) ) {
	    current = current.offsetParent();
	    myOffsetParents = myOffsetParents.add(current);
	}

	// Search offset parents from target element up until a common offset parent is found
	current = target;
	while ( ! current.is(myOffsetParents) ) {
	    current = current.offsetParent();
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
	    current = current.offsetParent();   
	}
	if ( ! this.is(commonOffsetParent) ) {
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
	    current = current.offsetParent();   
	}
	if ( ! target.is(commonOffsetParent) ) {
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