// runDetached jQuery plugin. Detach current element from the DOM, call a function (optional), then re-attach.
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