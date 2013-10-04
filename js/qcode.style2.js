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

(function(jQuery, undefined) {
    var sheet;
    var styles = {};
    qcode.style = function(styleChanges) {
        if ( arguments.length === 3 ) {
            var selectorString = arguments[0];
            var property = arguments[1];
            var value = arguments[2];
            var styleChanges[selectorString] = {};
            var styleChanges[selectorString][property] = value;
        }

        if ( sheet === undefined ) {
            sheet = $('<style>').appendTo('head')[0].sheet;
        }

        var newStyles = copy(styles);
        jQuery.each(styleChanges, function(selectorString, declarationChanges) {
            var selector = cleanCSSSelector(selectorString);
            newStyles[selector] = jQuery.extend(newStyles[selector], declarationChanges);
        });

        deleteEmptyStrings(newStyles, true);

        deleteEmptyObjects(newStyles);

        var additions = {};
        var removals = [];
        jQuery.each(newStyles, function(selector, declarations) {
            if ( style[selector] === undefined ) {
                additions[selector] = declarations;

            } else {
                
            }
        });
        jQuery.each(styles, function(selector, declarations) {
            if ( newStyles[selector] === undefined ) {
                removals.push(selector);
            }
        });
    }

    function declarations2cssBlock(declarations) {
    }

    function differencesOnLeft(leftObject, rightObject) {
        var diff = {};
        jQuery.each(leftObject, function(key, leftValue) {
            var rightValue = rightObject[key];
            if ( leftValue !== rightValue ) {
                diff[key] = leftValue;
            }
        });
        return diff;
    }

    function deleteEmptyStrings(object, recursive) {
        jQuery.each(object, function(key, value) {
            if ( value === "" ) {
                delete object[key];
            } else if ( recursive && jQuery.isPlainObject(object[key]) ) {
                deleteEmptyStrings(object[key], true);
            }
        });
    }

    function deleteEmptyObjects(object, recursive) {
        jQuery.each(object, function(key, value) {
            if ( jQuery.isPlainObject(value) && jQuery.isEmptyObject(value) ) {
                delete object[key];
            } else if ( recursive && jQuery.isPlainObject(object[key]) ) {
                deleteEmptyObjects(object[key], true);
            }
        });
    }

    function cleanCSSSelector(selector) {
        selector = selector.replace(/\s([>+~])\s*/, " $1 ");
        selector = selector.replace(/\s+/, ' ');
        selector = selector.trim();
        return selector.toLowerCase();
    }

    function copy(target) {
        if ( jQuery.isPlainObject(target) ) {
            return jQuery.extend(true, {}, target);
        } else {
            return target;
        }
    }
})(jQuery);