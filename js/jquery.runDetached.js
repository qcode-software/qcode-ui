// runDetached jQuery plugin.
// Detach selected elements, call a function (optional), then re-attach.
// function is called in scope of the jQuery object
// If the function returns a value, return that. Otherwise return the jQuery object for chaining.
;(function(jQuery) {
    jQuery.fn.runDetached = function(toDo) {
        var returnValue;

        // For each element, store a re-insertion point. This will either be the previous sibling, or the parent.
        var previousSibling = {};
        var parent = {};
        this.each(function(index) {
            previousSibling[index] = $(this).prev();
            if ( previousSibling[index].length === 0 ) {
                parent[index] = $(this).parent();
            }
        });

        // Detach the elements
        this.detach();

        // Run the function
        if ( typeof toDo == "function" ) {
            returnValue = toDo.call(this);
        }

        // Re-attach the elements
        this.each(function(index) {
            if ( previousSibling[index].length === 0 ) {
                $(this).prependTo(parent[index]);
            } else {
                $(this).insertAfter(previousSibling[index]);
            }
        });

        return coalesce(returnValue, this);
    }
})(jQuery);