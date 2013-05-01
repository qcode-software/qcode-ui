// Column Resize plugin
// Uses jQuery UI resizable, but resizes the entire column
// If the content does not fit the column, use behaviour defined by overflow options:
// - normal: do nothing, let the underlying css/UA handle it. Usually means the column just won't shrink any further.
// - shrink: reduce the font size (down to min-font-size) until the content fits.
// - shrink-one-line (default): as shrink, but force no wrapping
// - word-break: force word-break to try and make the content fit.
;(function($, undefined) {
    $.fn.columnResize = function(options) {
        var options = $.extend({
            overflow: "shrink-one-line",
            'min-font-size': 1
        }, options);

        this.find('th').each(function() {
            var th = $(this);
            var index = th.index();
            var table = th.closest('table');
            var col = table.find('col').filter(':nth-child('+(index+1)+')');
            var cells = table.find('td').filter(':nth-child('+(index+1)+')');

            switch ( options.overflow ) {
            case 'shrink-one-line':
                th.add(cells).add(col).css('white-space', "nowrap");
            case 'shrink':
                th.add(cells).add(col).each(function() {
                    $(this).data('original-font-size', parseInt($(this).css('font-size')));
                });
                break;
            case 'normal':
            case 'break-word':
                break;
            default:
                $.error('Unrecognised value for options.overflow - supported options are "shrink", "shrink-one-line", "normal", "break-word"');
                break;
            }

            th.resizable({
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

            switch ( options.overflow ) {
            case 'break-word':
                th.add(cells).add(col).css('word-break', 'normal');
                th.add(col).add(cells).width(ui.size.width);
                if ( th.width() != ui.size.width ) {
                    th.add(cells).add(col).css('word-break', 'break-all');
                }
                break;

            case 'shrink-one-line':
            case 'shrink':
                th.add(col).add(cells).width(ui.size.width);
                th.add(cells).add(col).each(function() {
                    $(this).css('font-size', $(this).data('original-font-size'));
                });
                
                var tooSmall = false;
                while ( th.width() != ui.size.width && ! tooSmall ) {
                    th.add(cells).add(col).each(function() {
                        var fontSize = parseInt($(this).css('font-size')) - 1;
                        if (fontSize < options['min-font-size']) {
                            tooSmall = true;
                        } else {
                            $(this).css('font-size', fontSize);
                        }
                    });
                }
                break;

            default:
                col.add(cells).width(ui.size.width);
                break;
            }
            event.stopPropagation;
            table.trigger('resize');
        }
        return this;
    }
})(jQuery);