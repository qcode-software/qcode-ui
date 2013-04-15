;(function($, undefined) {
    jQuery.widget('qcode.ganttRow', {
        options: {
            table: undefined,
            columns: {
                startDate: "[name=start_date]",
                finishDate: "[name=finish_date]"
            }
        },
        _create: function() {
            this.row = this.element;
            this.chart = this.options.table.ganttChart('getChart');
            this.bar = $('<div>')
                .addClass('ganttBar')
                .appendTo(this.chart);
        },
        draw: function() {
            var rowPosition = this.row.positionRelativeTo(this.chart);
            this.startDate = this.getStartDate();
            this.finishDate = this.getFinishDate();
            if ( isNaN(this.startDate.getDate()) || isNaN(this.finishDate.getDate()) ) {
                this.bar.hide();
            } else {
                this.bar
                    .css('top', rowPosition.top)
                    .css('left', this.options.table.ganttChart('date2positionLeft', this.startDate))
                    .css('right', this.options.table.ganttChart('date2positionRight', this.finishDate))
                    .show();
            }
        },
        widget: function() {
            return this.bar;
        },
        destroy: function() {
            this.bar.remove();
        },
        getStartDate: function() {
            return new Date(this.row.find(this.options.columns.startDate).text());
        },
        getFinishDate: function() {
            return new Date(this.row.find(this.options.columns.finishDate).text());
        }
    });
})(jQuery);