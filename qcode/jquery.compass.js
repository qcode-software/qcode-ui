;(function($, window, document, undefined) {
    $.fn.northOf = function(selection) {
        // Returns the element above the target, or undefined if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementTop = fromElement.offset().top;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementTop = element.offset().top;
            if (sameColumn(fromElement, element) && elementTop < fromElementTop && (nextElement === undefined || elementTop > nextElementTop)) {
                nextElement = element;
                nextElementTop = elementTop;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementTop = element.offset().top;
                if (leftOfColumn(fromElement, element) && (nextElement === undefined || rightOfColumn(nextElement, element) || (sameColumn(element, nextElement) && elementTop > nextElementTop))) {
                    nextElement = element;
                    nextElementTop = elementTop;
                };
            });
        }
        return nextElement;
    }
    $.fn.eastOf = function(selection) {
        // Returns the element right of the target, or undefined if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementLeft = fromElement.offset().left;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementLeft = element.offset().left;
            if (sameRow(element, fromElement) && elementLeft > fromElementLeft && (nextElement === undefined || elementLeft < nextElementLeft)) {
                nextElement = element;
                nextElementLeft = elementLeft;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementLeft = $(element).offset().left;
                if (belowRow(fromElement, element) && (nextElement === undefined || aboveRow(nextElement, element) || (sameRow(element, nextElement) && elementLeft < nextElementLeft))) {
                    nextElement = element;
                    nextElementLeft = elementLeft;
                }
            });
        }
        return nextElement;
    }
    $.fn.southOf = function(selection) {
        // Returns the element below the target, or undefined if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementTop = fromElement.offset().top;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementTop = element.offset().top;
            if (sameColumn(fromElement, element) && elementTop > fromElementTop && (nextElement === undefined || elementTop < nextElementTop)) {
                nextElement = element;
                nextElementTop = elementTop;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementTop = element.offset().top;
                if (rightOfColumn(fromElement, element) && (nextElement === undefined || leftOfColumn(nextElement, element) || (sameColumn(element, nextElement) && elementTop < nextElementTop))) {
                    nextElement = element;
                    nextElementTop = elementTop;
                }
            });
        }
        return nextElement;
    }
    $.fn.westOf = function(selection) {
        // Returns the element left of the target, or undefined if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementLeft = fromElement.offset().left;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementLeft = element.offset().left;
            if (sameRow(element, fromElement) && elementLeft < fromElementLeft && (nextElement === undefined || elementLeft > nextElementLeft)) {
                nextElement = element;
                nextElementLeft = elementLeft;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementLeft = $(element).offset().left;
                if (aboveRow(fromElement, element) && (nextElement === undefined || belowRow(nextElement, element) || (sameRow(element, nextElement) && elementLeft > nextElementLeft))) {
                    nextElement = element;
                    nextElementLeft = elementLeft;
                }
            });
        }
        return nextElement;
    }

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
})(jQuery, window, document);