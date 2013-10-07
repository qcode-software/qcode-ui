;/*
    qcode.style
   
    Append css rules to the page

    Accepts a single argument - an object mapping selectors to objects mapping css properties to values -
    or 3 arguments - a selector, followed by a css property name, followed by a value.

    New values will overwite old values, empty strings will delete.

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
    qcode.style({
        '#mytable': ""
    });
*/

// Ensure qcode namespace object exists
if ( typeof qcode === "undefined" ) {
    var qcode = {};
}

// Use a closure to hide helper functions and local variables
(function(jQuery, undefined) {
    // Hold a reference to the stylesheet between function calls
    var sheet;

    qcode.style = function(styleChanges) {
        // --------------------------------------------------------------------------------
        // 1. Parse the arguments, read the existing styles, and product 2 objects - oldStyles and newStyles

        // If called with 3 arguments, translate into a single object
        if ( arguments.length === 3 ) {
            var selectorString = arguments[0];
            var property = arguments[1];
            var value = arguments[2];
            var styleChanges = {};
            styleChanges[selectorString] = {};
            styleChanges[selectorString][property] = value;

        } else if ( arguments.length !== 1 ) {
            jQuery.error('Invalid usage of qcode.style - requires 1 or 3 arguments');
        }

        // On first call, attach <style> element to head.
        if ( sheet === undefined ) {
            sheet = $('<style>').appendTo('head')[0].sheet;
        }

        // Read existing styles from the styleSheet
        var oldStyles = {};
        jQuery.each(sheet.cssRules, function(i, cssRule) {
            var selector = cleanCSSSelector(cssRule.selectorText);
            if ( oldStyles[selector] === undefined ) {
                oldStyles[selector] = {};
            }
            for ( var i = 0 ; i < cssRule.style.length ; i++ ) {
                var attribute = cssRule.style.item(i);
                var value = cssRule.style.getPropertyValue(attribute);
                oldStyles[selector][attribute] = value;
            }
        });

        // Copy the styles object
        var newStyles = jQuery.extend(true, {}, oldStyles);

        // Clean selectors and extend new styles object.
        jQuery.each(styleChanges, function(selectorString, declarationChanges) {
            var selector = cleanCSSSelector(selectorString);
            newStyles[selector] = jQuery.extend(newStyles[selector], declarationChanges);
        });
        deleteEmptyStrings(newStyles, true);
        deleteEmptyObjects(newStyles);


        // --------------------------------------------------------------------------------
        // 2. Compare oldStyles with newStyles and determine which rules and declarations need to be added/updated/removed

        var ruleAdditions = {};
        var ruleRemovals = [];
        var declarationUpdates = {};
        var declarationRemovals = {};

        jQuery.each(oldStyles, function(selector, declarations) {
            if ( newStyles[selector] === undefined ) {
                // DELETE RULE
                ruleRemovals.push(selector);
            }
        });

        jQuery.each(newStyles, function(selector, declarations) {
            if ( oldStyles[selector] === undefined ) {
                // ADD RULE
                ruleAdditions[selector] = declarations;

            } else {
                // UPDATE RULE (if changed)
                var newDeclarations = newStyles[selector];
                var oldDeclarations = oldStyles[selector];

                declarationRemovals[selector] = [];
                jQuery.each(oldDeclarations, function(attribute, value) {
                    if ( newDeclarations[attribute] === undefined ) {
                        // REMOVE DECLARATION
                        declarationRemovals[selector].push(attribute);
                    }
                });

                declarationUpdates[selector] = {};
                jQuery.each(newDeclarations, function(attribute, value) {
                    if ( oldDeclarations[attribute] === undefined || oldDeclarations[attribute] !== value ) {
                        // ADD/UPDATE DECLARATION
                        declarationUpdates[selector][attribute] = value;
                    }
                });
                
            }
        });


        // --------------------------------------------------------------------------------
        // 3. Apply the required changes

        // Remove old rules
        jQuery.each(ruleRemovals, function(j, toRemove) {
            for ( var i = sheet.cssRules.length - 1 ; i >= 0 ; i-- ) {
                var cssRule = sheet.cssRules[i];
                var selector = cleanCSSSelector(cssRule.selectorText);
                if ( selector === toRemove ) {
                    sheet.deleteRule(i);
                };
            };
        });

        // Update existing rules
        for ( var i = sheet.cssRules.length - 1 ; i >= 0 ; i-- ) {
            var cssRule = sheet.cssRules[i];
            var selector = cleanCSSSelector(cssRule.selectorText);
            var declarationBlock = cssRule.style;
            jQuery.each(declarationUpdates[selector], function(attribute, value) {
                declarationBlock.setProperty(attribute, value);
            });
            jQuery.each(declarationRemovals[selector], function(i, attribute) {
                declarationBlock.removeProperty(attribute);
            });
        }

        // Add new rules
        jQuery.each(ruleAdditions, function(selector, declarations) {
            var declarationBlock = declarations2cssBlock(declarations);
            sheet.insertRule(selector + ' { ' + declarationBlock + ' } ', sheet.cssRules.length);
        });

        // --------------------------------------------------------------------------------


        // ================================================================================
        // Helper functions:

        function declarations2cssBlock(declarations) {
            // Takes a declaration object mapping attributes to values,
            // outputs a string css declaration block.
            var declarationBlock = "";
            jQuery.each(declarations, function(attribute, value) {
                declarationBlock += attribute + ': ' + value + '; ';
            });
            return declarationBlock;
        }

        function deleteEmptyStrings(object, recursive) {
            // Delete empty strings from an object
            jQuery.each(object, function(key, value) {
                if ( value === "" ) {
                    delete object[key];
                } else if ( recursive && jQuery.isPlainObject(object[key]) ) {
                    deleteEmptyStrings(object[key], true);
                }
            });
        }

        function deleteEmptyObjects(object, recursive) {
            // Delete empty nested objects from an object
            jQuery.each(object, function(key, value) {
                if ( jQuery.isPlainObject(value) && jQuery.isEmptyObject(value) ) {
                    delete object[key];
                } else if ( recursive && jQuery.isPlainObject(object[key]) ) {
                    deleteEmptyObjects(object[key], true);
                }
            });
        }

        function cleanCSSSelector(selector) {
            // "Clean up" a css selector, in an attempt to make string representations consistent.
            selector = selector.replace(/\s*([>+~])\s*/g, " $1 ");
            selector = selector.replace(/\s+/g, ' ');
            selector = selector.trim();
            return selector.toLowerCase();
        }
        // ================================================================================
    }
})(jQuery);