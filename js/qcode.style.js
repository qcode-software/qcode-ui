;/*
   qcode.style
   
   Append css rules to the page

   Accepts a single object mapping selectors to objects mapping css properties to values,
   or a selector, followed by a css property name, followed by a value.

   New values will overwite old values, use an empty string to remove.

   Examples:
   # Set 1 style
   qcode.style('#mytable th', 'font-weight', 'bold');

   # Set styles with multiple selectors
    qcode.style({
        '#mytable td:nth-child(3)': {
            'color': 'black',
            'font-weight': 'bold'
        }
        '#mytable td:nth-child(2)': {
            'color': 'red'
        }
    });

    # Remove a declaration
    qcode.style('body', 'background', "");

    # Remove a rule
    qcode.style('table', "");
*/

// Ensure qcode namespace object exists
if ( typeof qcode === "undefined" ) {
    var qcode = {};
}

(function($, undefined) {
    var styleBlock;
    qcode.style = function(rules) {
        // Called with 3 arguments, create a rules object
        if ( arguments.length === 3 ) {
            var selector = arguments[0];
            var property = arguments[1];
            var value = arguments[2];
            var rules = {};
            rules[selector] = {};
            rules[selector][property] = value;
        }

        // Append a <style> element to the head the first time this plugin is called
        if ( styleBlock === undefined ) {
            styleBlock = $('<style>').appendTo('head');
        }

        // Get any existing scoped css rules for this element
        var oldRules = styleBlock.data('scopedCSSrules');

        // Extend existing rules (recursively)
        newRules = jQuery.extend(true, oldRules, rules);

        // Create the innerHTML for the style block
        var css = "";
        $.each(newRules, function(selector, declarations) {
            // Use an empty string to remove all css from a selector.
            if ( declarations === "" ) {
                delete newRules[selector];

            } else {
                // Create the declaration block string
                var declarationBlock = "";
                $.each(declarations, function(attribute, value) {
                    if ( value === "" ) {
                        delete newRules[selector][attribute];
                    } else {
                        declarationBlock = declarationBlock + '\t' + attribute + ': ' + value + ';\n';
                    }
                });

                // Add the rule set to the css string
                css = css + selector + ' {\n ' + declarationBlock + ' }\n';
            }
        });

        styleBlock.data('scopedCSSrules', newRules);
        styleBlock.html(css);
    }
})(jQuery);