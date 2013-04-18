// ganttChart plugin. Call on a table to make it into a gantt chart.
// options -
//  width: any css width, width of the entire chart (table + calendar)
//  headerHeight: integer, height of the chart header
//  columns: object mapping keys to any jQuery selector/element/elementArray/object
//   use "columns" to match columns containing the row start dates, finish dates and bar colors
//  pxPerDay: integer, width of 1 day in the calendar
//  barHeight: any css height, height of the bars
;(function($, undefined) {
    jQuery.widget('qcode.ganttChart', {
        options: {
            width: "100%",
            headerHeight: 40,
            columns: {
                startDate: "[name=start_date]",
                finishDate: "[name=finish_date]",
                barColor: "[name=bar_color]"
            },
            pxPerDay: 15,
            barHeight: "0.5em"
        },
        _create: function() {
            // Get options from custom attributes
            $.each(this.options, (function(name, value) {
                this.options[name] = coalesce(this.element.attr(name), value);
            }).bind(this));
            this.options = $.extend(this.element.data(this.widgetName), this.options);

            // Initialise some properties
            this.bars = [];
            this.table = this.element;
            this.rows = this.table.children('tbody').children('tr');

            // Wrap the whole thing in a div
            this.table.wrap('<div class="ganttChart wrapper">');
            this.wrapper = this.table.parent();
            this.wrapper.css('width', this.options.width);

            // Record the old margin in case we want to destroy this widget
            this.oldMargin = this.table.css('margin-top');
            this.table.css('margin-top', this.options.headerHeight - this.table.find('thead').outerHeight());

            // Create a scrolling window for the calendar
            this.calendarFrame = $('<div class="calendarFrame">')
                .width(this.wrapper.width() - this.table.outerWidth())
                .insertAfter(this.table);

            // Create a canvas for the calendar
            this.calendar = $('<canvas>').appendTo(this.calendarFrame);

            // In case the table is a dbGrid, listen for updates.
            this._on({'dbRowActionReturn': this.draw});

            this.draw();
        },
        draw: function() {
            // Draw (or redraw) this gantt chart
            var ganttChart = this;

            // Calculate a suitable range of dates for the calendar
            var minDate = Date.today;
            var maxDate = Date.today;
            this.rows.each(function(rowIndex, domRow) {
                var startDate = ganttChart.getRowStartDate(rowIndex);
                var finishDate = ganttChart.getRowFinishDate(rowIndex);
                if ( Date.isValid(startDate) && Date.isValid(finishDate) ) {
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
                if ( Date.isValid(startDate) && Date.isValid(finishDate) ) {
                    var verticalPosition = $(domRow).positionRelativeTo(ganttChart.wrapper).top + ($(domRow).height() / 2);
                    var bar = ganttChart.calendar.calendar('newBar', {
                        startDate: startDate,
                        finishDate: finishDate,
                        verticalPosition: verticalPosition,
                        color: ganttChart.getCellValue('barColor', rowIndex)
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
            return this.rows.eq(rowIndex).findByColumn(this.options.columns[colName]).text();
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