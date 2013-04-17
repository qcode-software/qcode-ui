// ganttChart plugin. Call on a table to make it into a gantt chart.
;(function($, undefined) {
    jQuery.widget('qcode.ganttChart', {
        options: {
            width: "100%",
            headerHeight: 40,
            columns: {
                startDate: "[name=start_date]",
                finishDate: "[name=finish_date]",
                barClass: "[name=state]"
            },
            pxPerDay: 15,
            barHeight: "0.5em"
        },
        _create: function() {
            this.bars = [];
            this.table = this.element;
            this.rows = this.table.children('tbody').children('tr');

            this.table.wrap('<div class="ganttChart wrapper">');
            this.wrapper = this.table.parent();
            this.wrapper.css('width', this.options.width);

            // Record the old margin in case we want to destroy this widget
            this.oldMargin = this.table.css('margin-top');
            this.table.css('margin-top', this.options.headerHeight - this.table.find('thead').outerHeight());

            this.calendarFrame = $('<div class="calendarFrame">')
                .width(this.wrapper.width() - this.table.outerWidth())
                .insertAfter(this.table);

            this.calendar = $('<canvas>').appendTo(this.calendarFrame);

            this._on({'dbRowActionReturn': this.draw});

            this.draw();
            /*var scrollLeftDate = Date.today.getWeekStart();
            scrollLeftDate.incrDays(-14);
            this.chartFrame.scrollLeft(this.calendar.calendar('date2positionLeft', scrollLeftDate));*/
        },
        draw: function() {
            // Draw (or redraw) this gantt chart
            var ganttChart = this;

            // Calculate a suitable range of dates for the calendar
            var minDate = new Date();
            var maxDate = new Date();
            this.rows.each(function(rowIndex, domRow) {
                var startDate = ganttChart.getRowStartDate(rowIndex);
                var finishDate = ganttChart.getRowFinishDate(rowIndex);
                if ( ! (isNaN(startDate.getTime()) || isNaN(finishDate.getTime())) ) {
                    minDate = Date.min(minDate,startDate);
                    maxDate = Date.max(maxDate,finishDate);
                }
            });
            minDate.incrDays(-7);
            maxDate.incrDays(14);
            var startDate = minDate.getWeekStart();
            var finishDate = maxDate.getWeekEnd();

            // Initialize the calendar
            this.calendar.calendar({
                bodyHeight: this.table.find('tbody').outerHeight(),
                headerHeight: this.options.headerHeight,
                startDate: startDate,
                finishDate: finishDate,
                pxPerDay: this.options.pxPerDay,
                barHeight: this.options.barHeight
            })

            // Draw the bars (remove any existing bars first)
            $.each(this.bars, function(i, bar) {
                bar.remove();
            });
            this.bars = [];
            this.rows.each(function(rowIndex, domRow) {
                var startDate = ganttChart.getRowStartDate(rowIndex);
                var finishDate = ganttChart.getRowFinishDate(rowIndex);
                if ( ! (isNaN(startDate.getDate()) || isNaN(finishDate.getDate())) ) {
                    var verticalPosition = $(domRow).positionRelativeTo(ganttChart.wrapper).top + ($(domRow).height() / 2);
                    var bar = ganttChart.calendar.calendar('newBar', {
                        startDate: startDate,
                        finishDate: finishDate,
                        verticalPosition: verticalPosition,
                        addClasses: ganttChart.getCellValue('barClass', rowIndex)
                    });
                    ganttChart.bars.push(bar);
                }
            });

            // Draw the calendar
            this.calendar.calendar('draw');
        },
        getRowStartDate: function(rowIndex) {
            // Get the start date of a given row
            return new Date(this.getCellValue('startDate', rowIndex));
        },
        getRowFinishDate: function(rowIndex) {
            // Get the finish date of a given row
            return new Date(this.getCellValue('finishDate', rowIndex));
        },
        getCellValue: function(colName, rowIndex) {
            // Using the column selector from this.options.columns with the key colName,
            // find the first matching cell in the indexed row, and return the contents.
            return this.rows.eq(rowIndex).find(this.options.columns[colName]).text();
        },
        newDateHighlighter: function(date, style) {
            // Create and return a new date highlighter object
            return this.calendar.calendar('newDateHighlighter', date, style);
        },
        widget: function() {
            return this.wrapper;
        },
        getCalendar: function() {
            return this.calendar;
        },
        destroy: function() {
            // Destroy this widget and return the table to its initial state
            this.bars.remove();
            this.calendar.calendar('destroy').remove();
            this.calendarFrame.remove();
            this.table.unwrap().css('margin-top', this.oldMargin);
        }
    });
})(jQuery);