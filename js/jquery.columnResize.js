// Column Resize plugin
// Uses jQuery UI resizable, but resizes the entire column and breaks words if the column gets too small
;(function($, undefined) {
    $.fn.columnResize = function(options) {
        var options = $.extend({
            'word-break': "auto"
        }, options);

        this.find('th').each(function() {
            $(this).resizable({
                handles: "e",
                resize: onResize
            });                
        });

        function onResize(e, ui) {
            var th = $(this);
            var index = th.index();
            var table = th.closest('table');
            var col = table.find('col').filter(':nth-child('+(index+1)+')');
            var cells = table.find('td').filter(':nth-child('+(index+1)+')');
            if ( options['word-break'] === "auto" ) {
                th.add(cells).add(col).css('word-break', 'normal');
                th.add(col).add(cells).width(ui.size.width);
                if ( th.width() != ui.size.width ) {
                    th.add(cells).add(col).css('word-break', 'break-all');
                }
            } else {
                col.add(cells).width(ui.size.width);
            }
            event.stopPropagation;
            table.trigger('resize');
        }
    }
})(jQuery);