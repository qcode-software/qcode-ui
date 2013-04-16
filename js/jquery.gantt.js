;(function($, undefined) {
    var scrollBarWidth = 18;
    jQuery.widget('qcode.ganttChart', {
        options: {
            width: "100%",
            headerHeight: 40,
            columns: {
                startDate: "[name=start_date]",
                finishDate: "[name=finish_date]",
                barClass: "[name=state]"
            },
            pxPerDay: 15
        },
        _create: function() {
            var GanttChart = this;
            this.table = this.element;
            this.rows = this.table.children('tbody').children('tr');
            this.table.css('margin-top', this.options.headerHeight - this.table.find('thead').outerHeight());

            this.table.wrap('<div class="ganttWrapper">');
            this.wrapper = this.table.parent();
            this.wrapper.css('width', this.options.width);

            this.chartFrame = $('<div class="ganttChartFrame">')
                .width(this.wrapper.width() - this.table.outerWidth())
                .insertAfter(this.table);

            this.chart = $('<div class="ganttChart">')
                .appendTo(this.chartFrame);

            this.calendar = $('<canvas class="ganttCalendar">')
                .appendTo(this.chart);

            this.rows.each(function() {
                var Row = $(this);
                Row.ganttRow({
                    table: GanttChart.table,
                    columns: GanttChart.options.columns
                });
            });

            this._on({
                'dbRowActionReturn': this.draw
            });

            this.draw();
            var scrollLeftDate = Date.today.getWeekStart();
            scrollLeftDate.incrDays(-14);
            this.chartFrame.scrollLeft(this.calendar.ganttCalendar('date2positionLeft', scrollLeftDate));
        },
        draw: function() {
            var minDate = new Date();
            var maxDate = new Date();
            this.rows.each(function() {
                var Row = $(this);
                var startDate = Row.ganttRow('getStartDate');
                var finishDate = Row.ganttRow('getFinishDate');
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
            this.startDate = minDate.getWeekStart();
            this.finishDate = maxDate.getWeekEnd();


            this.calendar
                .ganttCalendar({
                    height: this.table.find('tbody').outerHeight(),
                    headerHeight: this.options.headerHeight,
                    startDate: this.startDate,
                    finishDate: this.finishDate,
                    pxPerDay: this.options.pxPerDay
                })
                .ganttCalendar('draw');
            this.chart.width(this.calendar.width());
            this.rows.each(function() {
                $(this).ganttRow('draw');
            });
        },
        setHighlight: function(name, highlight) {
            this.calendar.ganttCalendar('option', 'highlightDays', jQuery.qcode.ganttCalendar.prototype.options.highlightDays.concat([highlight]));
        },
        widget: function() {
            return this.wrapper;
        },
        getChart: function() {
            return this.chart;
        },
        getCalendar: function() {
            return this.calendar;
        },
        destroy: function() {
            this.calendar.ganttCalendar('destroy');
            this.rows.each(function() {
                $(this).ganttRow('destroy');
            });
            this.chart.remove();
        }
    });
})(jQuery);