;(function($, undefined) {
    jQuery.widget('qcode.ganttCalendar', {
        options: {
            height: 150,
            headerHeight: 40,
            startDate: undefined,
            finishDate: undefined,
            pxPerDay: 20,
            highlightDays: [{
                date: Date.today,
                fillStyle: 'rgba(160,200,240,1)'
            }, {
                day_of_week: 0,
                fillStyle: 'rgba(220,220,220,1)'
            }, {
                day_of_week: 6,
                fillStyle: 'rgba(220,220,220,1)'
            }],
            styles: {
                lines: 'rgba(200,200,200,1)',
                text: 'rgba(100,100,100,1)'
            }
        },
        _create: function() {
            var canvas = this.element[0];
            if ( ! canvas.getContext ) {
                $.error("Plugin ganttCalendar currently requires a canvas");
            }
            this.ctx = canvas.getContext('2d');
        },
        addHighlight: function(highlight) {
            this.options.highlightDays.push(highlight);
        },
        draw: function() {
            var ctx = this.ctx;
            var options = this.options;

            // Update the canvas width/height in case options have changed, then clear the canvas.
            options.width = (Date.daysBetween(options.finishDate, options.startDate) + 1) * options.pxPerDay;
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

                // Days to highlight - today, weekends, etc.
                var highlighted = false;
                $.each(options.highlightDays, function(i, highlight) {
                    if ( (highlight.date !== undefined && Date.daysBetween(highlight.date, date) == 0)
                         || (( ! highlighted) && highlight.day_of_week !== undefined && date.getDay() == highlight.day_of_week)
                       ) {
                        ctx.fillStyle = highlight.fillStyle;
                        ctx.fillRect(x, options.headerHeight, options.pxPerDay, options.height);
                        highlighted = true;
                    }
                });

                // For all non-highlighted days, draw a line for the end of the day.
                if ( ! highlighted ) {
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
            var left = Date.daysBetween(date, this.options.startDate) * this.options.pxPerDay;
            return left;
        },
        date2positionRight: function(date) {
            var right = Date.daysBetween(this.options.finishDate, date) * this.options.pxPerDay;
            return right;
        }
    });
})(jQuery);