// runDetached jQuery plugin.
// Detach this element, call a function (optional), then re-attach the element.
// Function passed in is called in the scope of the current jQuery object
// Only supports single-element jQuery object.
;(function(jQuery) {
    jQuery.fn.runDetached = function(toDo) {
        var $prev = this.prev();
        if ( $prev.length == 0 ) {
            var $parent = this.parent();
        }
        this.detach();
        if ( typeof toDo == "function" ) {
            toDo.call(this);
        }
        if ( $prev.length == 0 ) {
            this.appendTo($parent);
        } else {
            this.insertAfter($prev);
        }
    }
})(jQuery);