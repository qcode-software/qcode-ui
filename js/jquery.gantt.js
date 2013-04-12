;(function($, undefined) {
    var currentDate = new Date();
    jQuery.widget('qcode.gantt', {
        options: {
            width: "500px",
            height: "500px"
        },
        _create: function() {
            this.table = this.element;

            this.chart = $('<div>')
                .data('gantt', this)
                .addClass('ganttChart')
                .width(this.options.width)
                .height(this.options.height)
                .insertAfter(this.table);

            this.rows = this.table.children('tbody').children('tr');
            this.rows.each(function() {
                
            });
        },
        widget: function() {
            return this.chart;
        },
        destroy: function() {
            this.chart.remove();
        }
    });

    jQuery.widget('qcode.ganttRow', {
    });
})(jQuery);