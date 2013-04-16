;(function($, undefined) {
    jQuery.widget('qcode.calendar', {
        options: {
            height: 150,
            headerHeight: 40,
            startDate: undefined,
            finishDate: undefined,
            pxPerDay: 20,
            styles: {
                weekends: 'rgba(220,220,220,1)',
                lines: 'rgba(200,200,200,1)',
                text: 'rgba(100,100,100,1)'
            }
        },
        _create: function() {
            var canvas = this.element[0];
            this.element.wrap('<div class="calendar">');
            this.wrapper = this.element.parent();
            if ( ! canvas.getContext ) {
                $.error("Plugin qcode.calendar currently requires a canvas");
            }
            this.ctx = canvas.getContext('2d');
            this.highlighters = [
                this.createHighlighter(Date.today, 'rgba(160,200,240,1)')
            ];
        },
        draw: function() {
            var ctx = this.ctx;
            var options = this.options;

            // Update the canvas width/height in case options have changed, then clear the canvas.
            options.width = (Date.daysBetween(options.finishDate, options.startDate) + 1) * options.pxPerDay;
            this.wrapper
                .width(options.width)
                .height(options.height);
            this.element
                .attr('width', options.width)
                .attr('height', options.height + options.headerHeight);

            ctx.clearRect(0, 0, options.width, options.height);

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
                    ctx.fillRect(x, options.headerHeight, options.pxPerDay, options.height);
                } else {
                    ctx.moveTo(x + options.pxPerDay, options.headerHeight);
                    ctx.lineTo(x + options.pxPerDay, options.height + options.headerHeight);
                }
                x += options.pxPerDay;
                date.incrDays(1);
            }

            // Draw all the lines
            ctx.strokeStyle = options.styles.lines;
            ctx.stroke();
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
        createHighlighter: function(date, color) {
            // Create a calendarHighlighter, and return it
            var calendar = $('<div>').appendTo(this.wrapper);
            calendar.calendarHighlighter({
                date: date,
                color: color,
                calendar: this
            });
            return calendar;
        }
    });
})(jQuery);