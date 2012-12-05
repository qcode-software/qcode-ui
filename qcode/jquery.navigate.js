(function($, window, document, undefined) {
    // Navigate Class constructor
    var Navigate = function(container, selector) {
        var navigate = this;
        this.container = container;
        this.selector = selector;

        // Default selector
        if (selector === undefined) {
            selector = ':input:not(:button,:submit)';
        }

        // Events     
        container.on('keydown', function(event) {
            var currentElement = jQuery(event.target)
            var nextElement
            switch (event.which) {
            case 37:
                // left arrow key pressed - move left (if at selectionStart)
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || atEditStart(currentElement[0])) {
                    nextElement = navigate.prevLeft(currentElement)
                }
                break;
            case 39:
                // right arrow key pressed - move right (if at SelectionEnd) 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || atEditEnd(currentElement[0])) {
                    nextElement = navigate.nextRight(currentElement)
                }
                break;
            case 38:
                // up arrow key pressed - move up 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || atEditStart(currentElement[0])) {
                    nextElement = navigate.prevUp(currentElement)
                }
                break;
            case 40:
                // down arrow key pressed - move down
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || atEditEnd(currentElement[0])) {
                    nextElement = navigate.nextDown(currentElement)
                }
                break;
            case 13:
                // return key pressed - move down 
                nextElement = navigate.nextDown(currentElement)
                break;
            case 9:
                // tab key pressed - default tab action
                return true;
                break;
            default:
                return true;
            }

            // if nextElement exists change focus and prevent event defaults
            if (nextElement !== undefined) {
                navigate.changeFocus(currentElement, nextElement);
                event.preventDefault();
                return false;
            }
        });
    };
    Navigate.prototype.changeFocus = function(fromField, nextField) {
        // Collapse current textrange selection
        if (fromField.is('input[type=text],textarea,[contenteditable=true]')) {
            document.selection.empty();
        }

        // Move focus to nextField and select text contents
        nextField.focus();
        if (nextField.is('input[type=text],textarea,[contenteditable=true]')) {
            if (nextField.is(':input') && nextField[0].createTextRange) {
                // createTextRange directly supported on input DOM elements
                var elmtRange = nextField[0].createTextRange();
            } else {
                // createTextRange is not directly supported on contenteditable DOM elements
                var elmtRange = document.body.createTextRange();
                elmtRange.moveToElementText(nextField[0]);
            }
            elmtRange.select();
        }
    };
    Navigate.prototype.prevLeft = function(fromField) {
        // Returns the field left of the target, or undefined if none exists
        var nextField;
        var fromFieldLeft = fromField.offset().left;
        var fields = jQuery(this.selector + ':visible', this.container).not(fromField);
        fields.each(function() {
            var field = $(this);
            var fieldLeft = field.offset().left;
            if (sameRow(field, fromField) && fieldLeft < fromFieldLeft && (nextField === undefined || fieldLeft > nextFieldLeft)) {
                nextField = field;
                nextFieldLeft = fieldLeft;
            }
        });
        if (nextField === undefined) {
            fields.each(function() {
                var field = $(this);
                var fieldLeft = $(field).offset().left;
                if (aboveRow(fromField, field) && (nextField === undefined || belowRow(nextField, field) || (sameRow(field, nextField) && fieldLeft > nextFieldLeft))) {
                    nextField = field;
                    nextFieldLeft = fieldLeft;
                }
            });
        }
        return nextField;
    };
    Navigate.prototype.nextRight = function(fromField) {
        // Returns the field right of the target, or undefined if none exists
        var nextField;
        var fromFieldLeft = fromField.offset().left;
        var fields = jQuery(this.selector + ':visible', this.container).not(fromField);
        fields.each(function() {
            var field = $(this);
            var fieldLeft = field.offset().left;
            if (sameRow(field, fromField) && fieldLeft > fromFieldLeft && (nextField === undefined || fieldLeft < nextFieldLeft)) {
                nextField = field;
                nextFieldLeft = fieldLeft;
            }
        });
        if (nextField === undefined) {
            fields.each(function() {
                var field = $(this);
                var fieldLeft = $(field).offset().left;
                if (belowRow(fromField, field) && (nextField === undefined || aboveRow(nextField, field) || (sameRow(field, nextField) && fieldLeft < nextFieldLeft))) {
                    nextField = field;
                    nextFieldLeft = fieldLeft;
                }
            });
        }
        return nextField;
    };
    Navigate.prototype.prevUp = function(fromField) {
        // Returns the field above the target, or unedfined if none exists
        var nextField;
        var fromFieldTop = fromField.offset().top;
        var fields = jQuery(this.selector + ':visible', this.container).not(fromField);
        fields.each(function() {
            var field = $(this);
            var fieldTop = field.offset().top;
            if (sameColumn(fromField, field) && fieldTop < fromFieldTop && (nextField === undefined || fieldTop > nextFieldTop)) {
                nextField = field;
                nextFieldTop = fieldTop;
            }
        });
        if (nextField === undefined) {
            fields.each(function() {
                var field = $(this);
                var fieldTop = field.offset().top;
                if (leftOfColumn(fromField, field) && (nextField === undefined || rightOfColumn(nextField, field) || (sameColumn(field, nextField) && fieldTop > nextFieldTop))) {
                    nextField = field;
                    nextFieldTop = fieldTop;
                };
            });
        }
        return nextField;
    };
    Navigate.prototype.nextDown = function(fromField) {
        // Returns the field below the target, or undefined if none exists
        var nextField;
        var fromFieldTop = fromField.offset().top;
        var fields = jQuery(this.selector + ':visible', this.container).not(fromField);
        fields.each(function() {
            var field = $(this);
            var fieldTop = field.offset().top;
            if (sameColumn(fromField, field) && fieldTop > fromFieldTop && (nextField === undefined || fieldTop < nextFieldTop)) {
                nextField = field;
                nextFieldTop = fieldTop;
            }
        });
        if (nextField === undefined) {
            fields.each(function() {
                var field = $(this);
                var fieldTop = field.offset().top;
                if (rightOfColumn(fromField, field) && (nextField === undefined || leftOfColumn(nextField, field) || (sameColumn(field, nextField) && fieldTop < nextFieldTop))) {
                    nextField = field;
                    nextFieldTop = fieldTop;
                }
            });
        }
        return nextField;
    };

    // Make Navigate Class available as a jQuery plugin   
    $.fn.navigate = function(selector) {
        var containers = this;
        for (var i = 0; i < containers.size(); i++) {
            var container = containers.eq(i);
            if (!container.data('navigate')) {
                container.data('navigate', new Navigate(container, selector));
            }
        }
        return containers;
    };

    // Basic Navigation functions, used by Navigate Objects

    function sameRow(a, b) {
        // Takes two elements and returns true if they are on the same row
        return (a.offset().top <= (b.offset().top + b.outerHeight())) && ((a.offset().top + a.outerHeight()) >= b.offset().top);
    }

    function belowRow(a, b) {
        // Takes two elements and returns true if "b" is on a row below "a"
        return b.offset().top > (a.offset().top + a.outerHeight());
    }

    function aboveRow(a, b) {
        // Takes two elements and returns true if "b" is on a row above "a"
        return (b.offset().top + b.outerHeight()) < a.offset().top;
    }

    function sameColumn(a, b) {
        // Takes two elements and returns true if they are in the same column
        return (a.offset().left <= (b.offset().left + b.outerWidth())) && ((a.offset().left + a.outerWidth()) >= b.offset().left);
    }

    function leftOfColumn(a, b) {
        // Takes two elements and returns true if "b" is in a column left of "a"
        return (b.offset().left + b.outerWidth()) < a.offset().left;
    }

    function rightOfColumn(a, b) {
        // Takes two elements and returns true if "b" is in a column right of "a"
        return (a.offset().left + a.outerWidth()) < b.offset().left;
    }
}(jQuery, window, document));