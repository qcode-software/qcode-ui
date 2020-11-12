// positionRelative to plugin - returns the position of the first element in the selection relative to the target.
// nb. if either element is in the offset parent chain of the other, position will account for scrolling of that element.
(function ($, undefined) {
    $.fn.positionRelativeTo = function(target) {
        if ( $(this).length == 0 ) {
            $.error('positionRelativeTo called on empty object');
        }
        if ( $(target).length == 0 ) {
            $.error('positionRelativeTo called with empty target');
        }
        
	var myOffsetAncestors = getOffsetParentChain(this);
	var commonOffsetAncestor = getCommonOffsetAncestor(
            target, myOffsetAncestors
        );
        var myPosition = positionRelativeToOffsetAncestor(
            this, commonOffsetAncestor
        );
	var targetPosition = positionRelativeToOffsetAncestor(
            target, commonOffsetAncestor
        );
	return {
	    left: myPosition.left - targetPosition.left,
	    top: myPosition.top - targetPosition.top
	}
    };

    function getOffsetParentChain(element) {
        var chain = $(element);
        var current = $(element)[0];
        while ( current.offsetParent ) {
            current = current.offsetParent;
            chain = chain.add(current);
        }
        return chain;
    }

    function getCommonOffsetAncestor(element, chain) {
        var current = $(element)[0];
        while ( chain.index(current) == -1 ) {
            current = current.offsetParent;
            if ( current === null ) {
                $.error('Offset chain error - perhaps positionRelativeTo was called with a detached target?');
            }
        }
        return current;
    }

    function positionRelativeToOffsetAncestor(element, ancestor) {
        var position = {left: 0, top: 0};
        var current = $(element);
        while ( current.length > 0 && ! current.is(ancestor) ) {
            position.top += current[0].offsetTop;
            position.left += current[0].offsetLeft;
            if ( ! current.is(element) ) {
                position.top += parseFloat(current.css('border-top-width'))
                        + parseFloat(current.css('margin-top'));
                position.left += parseFloat(current.css('border-left-width'))
                        + parseFloat(current.css('margin-left'));
            }
            current = $(current[0].offsetParent);
        }
        if ( ! ( $(element).is(ancestor)
                 || $(ancestor)[0].offsetParent === null )
           ) {
	    position.left += $(ancestor).scrollLeft();
	    position.top += $(ancestor).scrollTop();            
        }
        return position;
    }
})(jQuery);
