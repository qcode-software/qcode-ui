// calendar plugin. Call on a canvas to draw a calendar
;(function($, undefined) {
    jQuery.widget('qcode.calendar', {
        options: {
            bodyHeight: 150,
            headerHeight: 40,
            startDate: undefined,
            finishDate: undefined,
            pxPerDay: 20,
            styles: {
                weekends: 'rgba(220,220,220,1)',
                lines: 'rgba(200,200,200,1)',
                text: 'rgba(100,100,100,1)'
            },
            barHeight: 15
        },
        _create: function() {
            var canvas = this.element[0];
            this.element.wrap('<div class="calendar">');
            this.wrapper = this.element.parent();
            if ( ! canvas.getContext ) {
                $.error("Plugin qcode.calendar currently requires a canvas");
            }
            this.ctx = canvas.getContext('2d');
            this.highlighters = [];
            this.newDateHighlighter(Date.today, 'rgba(160,200,240,1)');
            this.bars = [];
        },
        draw: function() {
            var ctx = this.ctx;
            var options = this.options;

            // Update the canvas width/height in case options have changed, then clear the canvas.
            options.width = (Date.daysBetween(options.finishDate, options.startDate) + 1) * options.pxPerDay;
            this.wrapper
                .width(options.width)
                .height(options.bodyHeight + options.headerHeight);
            this.element
                .attr('width', options.width)
                .attr('bodyHeight', options.bodyHeight + options.headerHeight);

            ctx.clearRect(0, 0, options.width, options.bodyHeight);

            var x = 0.5;
            ctx.beginPath();
            ctx.textBaseline = "middle";

            // Loop over all days from start date to finish date
            var date = new Date(options.startDate.getTime());
            while( date.getTime() <= options.finishDate.getTime() ) {

                // Header text
                ctx.fillStyle = options.styles.text;
                if ( date.getDay() == 1 ) {
                    // Label start of week on mondays
                    ctx.textAlign = "left";
                    ctx.fillText(date.getDate() + " " + date.getMonthShort(), x, (options.headerHeight / 4));
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, options.headerHeight);
                }
                ctx.textAlign = "center";
                ctx.fillText(date.getDayLetter(), x + (options.pxPerDay / 2), (3 * options.headerHeight / 4));

                // Highlight weekends
                if ( date.getDay() == 0 || date.getDay() == 6 ) {
                    ctx.fillStyle = this.options.styles.weekends;
                    ctx.fillRect(x, options.headerHeight, options.pxPerDay, options.bodyHeight);
                } else {
                    ctx.moveTo(x + options.pxPerDay, options.headerHeight);
                    ctx.lineTo(x + options.pxPerDay, options.bodyHeight + options.headerHeight);
                }
                x += options.pxPerDay;
                date.incrDays(1);
            }

            // Draw all the lines
            ctx.strokeStyle = options.styles.lines;
            ctx.stroke();

            // Redraw bars and highlights
            $.each(this.highlighters, function(i, highlighter) {
                highlighter.draw();
            });
            $.each(this.bars, function(i, bar) {
                bar.draw();
            });
        },
        date2positionLeft: function(date) {
            // Return the px distance from the left edge of the calendar to the left edge of the given date
            var left = Date.daysBetween(date, this.options.startDate) * this.options.pxPerDay;
            return left;
        },
        date2positionRight: function(date) {
            // Return the px distance from the right edge of the calendar to the right edge of the given date
            var right = Date.daysBetween(this.options.finishDate, date) * this.options.pxPerDay;
            return right;
        },
        widget: function() {
            return this.wrapper;
        },
        newDateHighlighter: function(date, color) {
            var highlighter = new DateHighlighter(this, date, color);
            this.highlighters.push(highlighter);
            return highlighter;
        },
        newBar: function(options) {
            var bar = new Bar($.extend({
                barHeight: this.options.barHeight,
                calendarWidget: this
            }, options));
            this.bars.push(bar);
            return bar;
        }
    });

    function DateHighlighter(calendarWidget, date, color) {
        this.calendarWidget = calendarWidget;
        this.element = $('<div class="dateHighlighter">');
        this.element.appendTo(calendarWidget.wrapper);
        this.setDate(date);
        this.setColor(color);
    }
    $.extend(DateHighlighter.prototype, {
        setDate: function(newDate) {
            this.date = newDate;
            this.draw();
        },
        setColor: function(newColor) {
            this.element.css({
                background: newColor
            });
        },
        remove: function() {
            this.element.remove();
        },
        draw: function() {
            this.element.css({
                top: this.calendarWidget.options.headerHeight,
                bottom: 0,
                left: this.calendarWidget.date2positionLeft(this.date),
                right: this.calendarWidget.date2positionRight(this.date)
            });
        }
    });

    function Bar(options) {
        this.options = $.extend({
            startDate: undefined,
            finishDate: undefined,
            barHeight: 15,
            verticalPosition: undefined,
            addClasses: "",
            calendarWidget: undefined
        }, options);
        this.element = $('<div>');
        this.element.appendTo(this.options.calendarWidget.wrapper);
        this.draw();
    }
    $.extend(Bar.prototype, {
        draw: function() {
            var classes = ["bar"].concat(this.options.addClasses);
            if ( this.options.startDate.getTime() > Date.today.getTime() ) {
                classes.push("future");
            } else if ( this.options.finishDate.getTime() < Date.today.getTime() ) {
                classes.push("past");
            } else {
                classes.push("present");
            }
            this.element
                .removeClass(this.element.attr('class'))
                .addClass(classes.join(" "))
                .css({
                    height: this.options.barHeight,
                    left: this.options.calendarWidget.date2positionLeft(this.options.startDate),
                    right: this.options.calendarWidget.date2positionRight(this.options.finishDate)
                })
                .css({
                    top: this.options.verticalPosition - (this.element.height() / 2)
                });
        },
        remove: function() {
            this.element.remove();
        }
    });
})(jQuery);