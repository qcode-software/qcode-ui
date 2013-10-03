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
    qcode.style({
        '#mytable': ""
    });
*/

// Ensure qcode namespace object exists
if ( typeof qcode === "undefined" ) {
    var qcode = {};
}

(function($, undefined) {
    var styleBlock;
    qcode.style = function(ruleChanges) {
        // Called with 3 arguments, create a rules object
        if ( arguments.length === 3 ) {
            var selector = arguments[0];
            var property = arguments[1];
            var value = arguments[2];
            var ruleChanges = {};
            ruleChanges[selector] = {};
            ruleChanges[selector][property] = value;
        }

        // Append a <style> element to the head the first time this plugin is called
        if ( styleBlock === undefined ) {
            styleBlock = $('<style>').appendTo('head');
        }

        // Get any existing scoped css rules for this element
        var oldRules = styleBlock.data('scopedCSSrules');

        // Extend existing rules (recursively)
        newRules = jQuery.extend(true, {}, oldRules, ruleChanges);

        // Array of selectors for rules to remove
        var toRemove = [];

        // Array of rules to add
        var toAdd = [];

        // For each rule in the new rules object
        $.each(newRules, function(selector, declarations) {
            if ( declarations === "" ) {
                // An empty declaration string means to delete the rule, if it exists
                if ( oldRules[selector] !== undefined ) {
                    toRemove.push(selector);
                }
                delete newRules[selector];

            } else {
                // Add or update the rule, if it has changed
                // An update consists of a delete and an insert
                var needsInsert = false;

                if ( oldRules[selector] === undefined ) {
                    // The old rule did not exist, so this is a change
                    needsInsert = true;
                }

                // Construct a css declaration block string from the declarations object
                var declarationBlock = "";
                $.each(declarations, function(attribute, value) {

                    // If the rule has changed, delete the old rule and insert the new rule
                    if (( ! needsInsert) && oldRules[selector][attribute] !== value) {
                        needsInsert = true;
                        toRemove.push(selector);
                    }

                    // Remove empty values from the rules
                    if ( value === "" ) {
                        delete newRules[selector][attribute];
                    } else {
                        declarationBlock = declarationBlock + '\t' + attribute + ': ' + value + ';\n';
                    }
                });

                // If all the declarations have been removed, remove the entire rule
                if ( declarationBlock === "" ) {
                    if ( oldRules[selector] !== undefined ) {
                        toRemove.push(selector);
                    }
                    delete newRules[selector];

                } else if ( needsInsert ) {
                    toAdd.push(selector + ' {\n ' + declarationBlock + ' }\n');
                }
            }
        });

        // Store the new rules object for later reference
        styleBlock.data('scopedCSSrules', newRules);

        // Map each selector in the current rules to the index of that rule.
        var sheet = styleBlock[0].sheet;
        var ruleIndices = {};
        $.each(sheet.cssRules, function(index, cssRule) {
            ruleIndices[cssRule.selectorText] = index;
        });

        // Remove the existing rules
        $.each(toRemove, function(i, selector) {
            if ( ruleIndices[selector] !== undefined
                 && ruleIndices[selector] >= 0
                 && ruleIndices[selector] < sheet.cssRules.length ) {
                sheet.deleteRule(ruleIndices[selector]);
            } else {
                // Not sure why this is occuring, but it doesn't appear to be a problem. TO DO - look at this.
                console.warn('attempted to delete a non-existant rule for ' + selector);
            }
        });

        // Add the new rules
        $.each(toAdd, function(i, rule) {
            sheet.insertRule(rule, sheet.cssRules.length);
        });
    }
})(jQuery);