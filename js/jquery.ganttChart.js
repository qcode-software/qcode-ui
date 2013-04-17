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
            this.bars = $([]);
            this.table = this.element;
            this.rows = this.table.children('tbody').children('tr');

            this.table.wrap('<div class="ganttChart wrapper">');
            this.wrapper = this.table.parent();
            this.wrapper.css('width', this.options.width);

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
            var ganttChart = this;

            // Calculate a suitable range of dates for the calendar
            var minDate = new Date();
            var maxDate = new Date();
            this.rows.each(function(rowIndex, domRow) {
                var startDate = ganttChart.getRowStartDate(rowIndex);
                var finishDate = ganttChart.getRowFinishDate(rowIndex);
                if ( ! isNaN(startDate.getTime()) ) {
                    minDate = Date.min(minDate,startDate);
                    maxDate = Date.max(maxDate,startDate);
                }
                if ( ! isNaN(finishDate.getTime()) ) {
                    minDate = Date.min(minDate,finishDate);
                    maxDate = Date.max(maxDate,finishDate);
                }
            });
            minDate.incrDays(-7);
            maxDate.incrDays(14);
            var startDate = minDate.getWeekStart();
            var finishDate = maxDate.getWeekEnd();

            // Draw the calendar
            this.calendar
                .calendar({
                    bodyHeight: this.table.find('tbody').outerHeight(),
                    headerHeight: this.options.headerHeight,
                    startDate: startDate,
                    finishDate: finishDate,
                    pxPerDay: this.options.pxPerDay,
                    barHeight: this.options.barHeight
                })
                .calendar('draw');

            // Draw the bars (remove any existing bars first)
            this.bars.remove();
            this.bars = $([]);
            this.rows.each(function(rowIndex, domRow) {
                var startDate = ganttChart.getRowStartDate(rowIndex);
                var finishDate = ganttChart.getRowFinishDate(rowIndex);
                if ( ! (isNaN(startDate.getDate()) || isNaN(finishDate.getDate())) ) {
                    var rowTop = $(domRow).positionRelativeTo(ganttChart.wrapper).top;
                    var bar = ganttChart.calendar.calendar('newBar', {
                        startDate: startDate,
                        finishDate: finishDate,
                        verticalPosition: rowTop + ($(domRow).height() / 2),
                        addClasses: ganttChart.getCellValue('barClass', rowIndex)
                    });
                    ganttChart.bars = ganttChart.bars.add(bar);
                }
            });
        },
        getRowStartDate: function(rowIndex) {
            return new Date(this.getCellValue('startDate', rowIndex));
        },
        getRowFinishDate: function(rowIndex) {
            return new Date(this.getCellValue('finishDate', rowIndex));
        },
        getCellValue: function(colName, rowIndex) {
            return this.rows.eq(rowIndex).find(this.options.columns[colName]).text();
        },
        newDateHighlighter: function(date, style) {
            return this.calendar.calendar('newDateHighlighter', date, style);
        },
        widget: function() {
            return this.wrapper;
        },
        getCalendar: function() {
            return this.calendar;
        },
        destroy: function() {
            this.bars.remove();
            this.calendar.calendar('destroy').remove();
            this.calendarFrame.remove();
            this.table.unwrap().css('margin-top', this.oldMargin);
        }
    });
})(jQuery);