/*
scopedCSS plugin

Append css rules to the page, scoped to affect descendants of the target element(s)
Subsequent calls to scopedCSS on the same element will erase previously set styles;
Call with no arguments to retrieve previosly set styles
Uses an id selector to control scope, provides an id if none exists.

Example:
$('table').scopedCSS({
    'td:nth-child(3)': {
        'color': 'black',
        'font-weight': 'bold'
    }
    'td:nth-child(2)': {
        'color': 'red'
    }
});
*/

// Plugin start
;(function($, undefined) {
    var nextID = 0;

    $.fn.scopedCSS = function(rules) {
        // Called with no arguments - return the rules object
        if ( rules === undefined ) {
            var styleBlock = this.first().data('scopedCSSstyleBlock');
            if ( styleBlock !== undefined ) {
                return styleBlock.data('scopedCSSrules');
            } else {
                return {};
            }
        }

        // Called with a rules object, iterate over target elements.
        this.each(function() {
            var element = $(this);

            // Assign a unique ID if none exists
            if ( element.attr('id') === undefined ) {
                element.attr('id', 'scopedCSS_ID_' + (nextID++));
            }
            var id = $(element).attr('id');

            // Create a style element and append to head (once only per element)
            if ( element.data('scopedCSSstyleBlock') === undefined ) {
                element.data('scopedCSSstyleBlock', $('<style>').appendTo('head'));
            }
            var styleBlock = element.data('scopedCSSstyleBlock');

            // Store a copy of the rules object for retrieval later
            styleBlock.data('scopedCSSrules', $.extend({}, rules));

            // Set the innerHTML of the style element
            var css = "";
            $.each(rules, function(selector, declarations) {
                var declarationString = "";
                $.each(declarations, function(attribute, value) {
                    declarationString = declarationString + attribute + ': ' + value + ';\n';
                });
                css = css + '#' + id + ' ' + selector + ' { ' + declarationString + ' }\n';
            });
            styleBlock.html(css);
        });

        return this;
    }
})(jQuery);