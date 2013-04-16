;(function($, undefined) {
    jQuery.widget('qcode.ganttRow', {
        options: {
            table: undefined,
            barHeight: 10,
            columns: {
                startDate: "[name=start_date]",
                finishDate: "[name=finish_date]",
                barClass: "[name=state]"
            }
        },
        _create: function() {
            this.row = this.element;
            this.chart = this.options.table.ganttChart('getChart');
            this.calendar = this.options.table.ganttChart('getCalendar');
            this.classes = "ganttBar";
            this.bar = $('<div class="ganttBar">').appendTo(this.chart);
        },
        draw: function() {
            var rowPosition = this.row.positionRelativeTo(this.chart);
            var rowHeight = this.row.outerHeight();
            var startDate = this.getStartDate();
            var finishDate = this.getFinishDate();
            if ( isNaN(startDate.getDate()) || isNaN(finishDate.getDate()) ) {
                this.bar.hide();
            } else {
                var left = this.calendar.calendar('date2positionLeft', startDate);
                var right = this.calendar.calendar('date2positionRight', finishDate);
                var oldClasses = this.classes;
                this.classes = this.getClasses();
                this.bar
                    .show()
                    .removeClass(oldClasses)
                    .addClass(this.classes)
                    .css('height', this.options.barHeight)
                    .css('left', left)
                    .css('right', right)
                    .css('top', rowPosition.top + ((rowHeight - this.bar.height()) / 2));
            }
        },
        widget: function() {
            return this.bar;
        },
        destroy: function() {
            this.bar.remove();
        },
        getStartDate: function() {
            return new Date(this.getValue('startDate'));
        },
        getFinishDate: function() {
            return new Date(this.getValue('finishDate'));
        },
        getValue: function(colName) {
            return this.row.find(this.options.columns[colName]).text()
        },
        getClasses: function() {
            var classes = ["ganttBar"];
            if ( this.options.columns.barClass !== undefined ) {
                classes.push(this.getValue('barClass'));
            }
            var startDate = this.getStartDate();
            var finishDate = this.getFinishDate();
            if ( ! (isNaN(startDate.getDate()) || isNaN(finishDate.getDate())) ) {
                if ( startDate.getTime() > Date.today.getTime() ) {
                    classes.push("future");
                } else if ( finishDate.getTime() < Date.today.getTime() ) {
                    classes.push("past");
                } else {
                    classes.push("present");
                }
            }
            return classes.join(" ");
        }
    });
})(jQuery);