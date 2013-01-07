;(function($, window, document, undefined) {
    // Navigate Class constructor
    var Navigate = function(container, selector) {
        var navigate = this;
        this.container = container;
        this.selector = selector;

        // Default selector
        if (selector === undefined) {
            this.selector = ':input:not(:button,:submit)';
        }

        // Events     
        container.on('keydown', function(event) {
            var currentElement = jQuery(event.target)
            var nextElement;
            var fields = jQuery(this.selector, this.container);
            switch (event.which) {
            case 37:
                // left arrow key pressed - move left (if at selectionStart)
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtStart) {
                    nextElement = currentElement.westOf(fields);
                }
                break;
            case 39:
                // right arrow key pressed - move right (if at SelectionEnd) 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtEnd) {
                    nextElement = currentElement.eastOf(fields);
                }
                break;
            case 38:
                // up arrow key pressed - move up 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtStart) {
                    nextElement = currentElement.northOf(fields);
                }
                break;
            case 40:
                // down arrow key pressed - move down
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtEnd) {
                    nextElement = currentElement.southOf(fields);
                }
                break;
            case 13:
                // return key pressed - move down 
                nextElement = currentElement.southOf(fields);
                break;
            case 9:
                // tab key pressed - default tab action
                return true;
                break;
            default:
                return true;
            }

            // if nextElement exists change focus and prevent event defaults
            if (nextElement.length === 1) {
                navigate.changeFocus(currentElement, nextElement);
                event.preventDefault();
                return false;
            }
        });
    };
    Navigate.prototype.changeFocus = function(fromField, nextField) {
        // Collapse current textrange selection
        if (fromField.is('input[type=text],textarea,[contenteditable=true]')) {
            fromField.textrange('set','start','start');
        }

        // Move focus to nextField and select text contents
        nextField.focus();
        if (nextField.is('input[type=text],textarea,[contenteditable=true]')) {
            nextField.textrange('set','all');
        }
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
}(jQuery, window, document));