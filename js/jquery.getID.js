;/*
getID -
Returns a unique id for the first matched element
uses the existing id if it has one
 */
(function($, undefined) {
    var nextID = 0;
    $.fn.getID = function() {
        var element = this.first();

        // Assign a unique ID if none exists
        if ( element.attr('id') === undefined ) {
            element.attr('id', 'qcode_jquery_id_' + (nextID++));
        }

        return element.attr('id');
    }
})(jQuery);