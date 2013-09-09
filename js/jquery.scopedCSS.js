/*
scopedCSS plugin

Append css rules to the page, scoped to affect descendants of the target element(s)

Accepts a single object mapping selectors to objects mapping css properties to values,
or a string selector followed by an object mapping css properties to values,
or a selector, followed by a css property name, followed by a value,
or call with no arguments to retrieve previously set styles,
or with an empty string to remove all scoped css set for this element.

New values will overwite old values, use an empty string to remove.
Uses an id selector to control scope, provides an id if none exists.

Examples:
# Set 1 style
$('table').scopedCSS('th', 'font-weight', 'bold');

# Set multiple styles with 1 selector:
$('table').scopedCSS('tfoot', {
    background: 'grey',
    color: 'white'
});

# Set styles with multiple selectors
$('table').scopedCSS({
    'td:nth-child(3)': {
        'color': 'black',
        'font-weight': 'bold'
    }
    'td:nth-child(2)': {
        'color': 'red'
    }
});

# Remove a declaration
$('table').scopedCSS({'td:nth-child(3)': {'color': ""}});

# Remove a rule
$('table').scopedCSS({'td:nth-child(2)': ""});

# Remove all rules
$('table').scopedCSS("");

# Retrieve a map of all rules 
var rules = $('table').scopedCSS
*/

// Plugin start
;(function($, undefined) {
    var nextID = 0;

    $.fn.scopedCSS = function() {
        // Called with no arguments - return the rules object
        if ( arguments.length === 0 ) {
            var styleBlock = this.first().data('scopedCSSstyleBlock');
            if ( styleBlock !== undefined ) {
                // Return values, not a reference to the internal object
                return $.extend({}, styleBlock.data('scopedCSSrules'));
            } else {
                return {};
            }
        }

        // Called with 3 arguments, create a rules object
        if ( arguments.length === 3 ) {
            var rules = {};
            rules[arguments[0]] = {};
            rules[arguments[0]][arguments[1]] = arguments[2];
        }

        // Called with 2 arguments, create a rules object
        if ( arguments.length === 2 ) {
            var rules = {};
            rules[arguments[0]] = arguments[1];
        }

        // Called with 1 argument, a rules object or empty string
        if ( arguments.length === 1 ) {
            var rules = arguments[0];
        }

        // Called with a rules object, iterate over target elements.
        this.each(function() {
            var element = $(this);

            // Assign a unique ID if none exists
            if ( element.attr('id') === undefined ) {
                element.attr('id', 'scopedCSS_ID_' + (nextID++));
            }
            var id = $(element).attr('id');

            // Create a style element and append to head
            if ( element.data('scopedCSSstyleBlock') === undefined ) {
                element.data('scopedCSSstyleBlock', $('<style>').appendTo('head'));
            }
            var styleBlock = element.data('scopedCSSstyleBlock');

            // Get any existing scoped css rules for this element
            var oldRules = styleBlock.data('scopedCSSrules');

            // For an empty string, erase existing rules
            if ( rules === "" ) {
                newRules == {}
            } else {
                // Otherwise, extend existing rules (recursively)
                newRules = jQuery.extend(true, oldRules, rules);
            }

            // Create the innerHTML for the style block
            var css = "";
            $.each(newRules, function(selectorGroup, declarations) {
                // Use an empty string to remove all css from a selector.
                if ( declarations === "" ) {
                    delete newRules[selector];

                } else {
                    // Create the declaration block string
                    var declarationBlock = "";
                    $.each(declarations, function(attribute, value) {
                        if ( value === "" ) {
                            delete newRules[selectorGroup][attribute];
                        } else {
                            declarationBlock = declarationBlock + '\t' + attribute + ': ' + value + ';\n';
                        }
                    });

                    // A selector group may consist of one or more selectors in a comma-separated list
                    // Prepend the id selector to each one.
                    var selectorArray = [];
                    $.each(selectorGroup.split(','), function(i, selector) {
                        selectorArray.push('#' + id + ' ' + selector.trim());
                    });

                    // Add the rule set to the css string
                    css = css + selectorArray.join(',\n') + ' {\n ' + declarationBlock + ' }\n';
                }
            });

            styleBlock.data('scopedCSSrules', newRules);
            styleBlock.html(css);
        });

        // Enable jQuery plugin chaining
        return this;
    }
})(jQuery);