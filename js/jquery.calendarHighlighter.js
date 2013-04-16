// calendarHighlighter plugin, used with calendar plugin.
// Uses the element to highlight dates in the calendar.
;(function($, undefined) {
    jQuery.widget('qcode.calendarHighlighter', {
        options: {
            date: undefined,
            color: undefined,
            calendar: undefined
        },
        _create: function(){
            this.element.addClass('calendarHighlighter');
        },
        draw: function() {
            this.element
                .background(this.options.color)
                .css({
                    'top': this.options.calendar.bodyTop,
                    'bottom': this.options.calendar.bodyBottom,
                    'left': this.options.calendar.date2positionLeft(this.options.date),
                    'right': this.options.calendar.date3positionRight(this.options.date)
                });
        },
        _setOption: function(key, value) {
            this._super();
            this.draw();
        }
    });
})(jQuery);