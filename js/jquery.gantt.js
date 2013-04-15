;(function($, undefined) {
    var scrollBarWidth = 18;
    jQuery.widget('qcode.ganttChart', {
        options: {
            width: "1000px",
            headerHeight: 40,
            columns: {
                startDate: "[name=start_date]",
                finishDate: "[name=finish_date]"
            },
            grid: {
                pxPerDay: 20
            }
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
                .width(parseInt(this.options.width) - this.table.outerWidth())
                .insertAfter(this.table);

            this.chart = $('<div class="ganttChart">')
                .appendTo(this.chartFrame);

            var minDate = new Date();
            var maxDate = new Date();
            this.rows.each(function() {
                var Row = $(this);
                Row.ganttRow({
                    table: GanttChart.table,
                    columns: GanttChart.options.columns
                });
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
            this.startDate = minDate;
            this.finishDate = maxDate;

            this.chart.width((Date.daysBetween(this.finishDate, this.startDate)+1) * this.options.grid.pxPerDay);

            this.canvas = $('<canvas>')
                .attr('width', (Date.daysBetween(this.finishDate, this.startDate)+1) * this.options.grid.pxPerDay)
                .attr('height', this.table.find('tbody').outerHeight() + this.options.headerHeight)
                .ganttCalendar({
                    startDate: this.startDate,
                    finishDate: this.finishDate,
                    pxPerDay: this.options.grid.pxPerDay,
                    headerHeight: this.options.headerHeight
                })
                .appendTo(this.chart);
            this.draw();
        },
        draw: function() {
            this.rows.each(function() {
                $(this).ganttRow('draw');
            });
        },
        widget: function() {
            return this.wrapper;
        },
        getChart: function() {
            return this.chart;
        },
        destroy: function() {
            this.rows.each(function() {
                $(this).ganttRow('destroy');
            });
            this.chart.remove();
        },
        date2positionLeft: function(date) {
            return Date.daysBetween(date, this.startDate) * this.options.grid.pxPerDay;
        },
        date2positionRight: function(date) {
            return this.chart.width() - (Date.daysBetween(this.finishDate, date) * this.options.grid.pxPerDay);
        }
    });
})(jQuery);