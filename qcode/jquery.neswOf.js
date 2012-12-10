;(function($, window, document, undefined) {
    $.fn.northOf(selection) {
        // Returns the field above the target, or undefined if none exists
	var fromField = $(this);
        var nextField;
        var fromFieldTop = fromField.offset().top;
        var fields = selection.filter(':visible').not(fromField);
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
    }
    $.fn.eastOf(selection) {
    }
    $.fn.southOf(selection) {
    }
    $.fn.westOf(selection {
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