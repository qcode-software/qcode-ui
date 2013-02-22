// runDetached jQuery plugin.
// Detach this element, call a function (optional), then re-attach.
// function is called in scope of element,
// Only supports detaching a single element at a time
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