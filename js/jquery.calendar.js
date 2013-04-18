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
            barHeight: "10px"
        },
        _create: function() {
            var domCanvas = this.element[0];
            this.element.wrap('<div class="calendar">');
            this.wrapper = this.element.parent();
            if ( ! domCanvas.getContext ) {
                $.error("Plugin qcode.calendar currently requires a canvas");
            }
            this.context = domCanvas.getContext('2d');
            this.highlighters = [];
            this.bars = [];
            this.newDateHighlighter(Date.today, 'rgba(160,200,240,1)');
        },
        draw: function() {
            // draw (or redraw) the calendar
            var ctx = this.context;
            var options = this.options;

            // Recalculate width/height in case options have changed
            options.width = (Date.daysBetween(options.finishDate, options.startDate) + 1) * options.pxPerDay;
            this.wrapper
                .width(options.width)
                .height(options.bodyHeight + options.headerHeight);
            // Canvas html width/height attributes function differently to css width/height
            this.element
                .attr('width', options.width)
                .attr('height', options.bodyHeight + options.headerHeight);
            // Clear the canvas
            ctx.clearRect(0, 0, options.width, options.bodyHeight);

            // Offset path to account for line width, and begin a path to draw all the grid lines
            var x = 0.5;
            ctx.beginPath();
            ctx.textBaseline = "middle";

            // Loop over all days from start date to finish date
            var date = new Date(options.startDate.getTime());
            while( date.getTime() <= options.finishDate.getTime() ) {

                // Header text
                ctx.fillStyle = options.styles.text;
                // Label start of week on mondays
                if ( date.getDay() == 1 ) {
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
                }
                // Draw vertical lines at the end of each day
                ctx.moveTo(x + options.pxPerDay, options.headerHeight);
                ctx.lineTo(x + options.pxPerDay, options.bodyHeight + options.headerHeight);
                
                x += options.pxPerDay;
                date.incrDays(1);
            }

            // Actually draw all the lines
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
            // Create and return a date highlighter attached to this calendar (see class defs. below)
            var highlighter = new DateHighlighter(this, date, color);
            this.highlighters.push(highlighter);
            return highlighter;
        },
        newBar: function(options) {
            // Create and return a horizontal bar attached to this calendar (see class defs. below)
            var bar = new Bar($.extend({
                barHeight: this.options.barHeight,
                calendarWidget: this
            }, options));
            this.bars.push(bar);
            return bar;
        }
    });
    // End of calendar widget


    // DateHighlighter class
    // This object highlights a single date in a calendar.
    function DateHighlighter(calendarWidget, date, color) {
        this.calendarWidget = calendarWidget;
        this.element = $('<div class="dateHighlighter">');
        this.element.appendTo(calendarWidget.wrapper);
        this.setColor(color);
        this.setDate(date);
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
    // End of DateHighlighter class


    // Bar class
    // A horizontal bar added to the calendar
    function Bar(options) {
        this.options = $.extend({
            startDate: undefined,
            finishDate: undefined,
            barHeight: "10px",
            verticalPosition: undefined,
            addClasses: "",
            calendarWidget: undefined
        }, options);
        this.element = $('<div>');
        this.element.appendTo(this.options.calendarWidget.wrapper);
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
    // End of Bar class
})(jQuery);