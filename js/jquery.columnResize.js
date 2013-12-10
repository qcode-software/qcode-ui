// Column Resize plugin
// Uses jQuery UI resizable, but resizes the entire column
// If the content does not fit the column, use behaviour defined by overflow options:
// - normal: do nothing, let the underlying css/UA handle it. Usually means the column just won't shrink any further.
// - shrink: reduce the font size (down to min-font-size) until the content fits. Supports only a single font size for the column.
// - shrink-one-line (default): as shrink, but force no wrapping
// - break-word: force word break to try and make the content fit.
;(function($, undefined) {
    $.fn.columnResize = function(options) {
        var options = $.extend({
            overflow: "shrink-one-line",
            'min-font-size': 1
        }, options);

        this.find('th').each(function() {
            var th = $(this);
            var nth = th.index() + 1;
            var id = th.closest('table').getID();

            qcode.style('#'+id+' > colgroup > col:nth-child('+nth+')', 'width', th.innerWidth() + "px");

            switch ( options.overflow ) {
            case 'shrink-one-line':
                qcode.style('#'+id+' > * > tr > :nth-child('+nth+')', 'white-space', "nowrap");

            case 'shrink':
                th.data('original-font-size', parseInt(th.css('font-size')));
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
            qcode.style('#'+id+' > thead > tr > th:nth-child('+nth+') > .ui-resizable-handle', "width", "9px");
        });

        function onResize(e, ui) {
            var th = $(this);
            th.css('width', '');

            var nth = th.index() + 1;
            var table = th.closest('table');
            var id = table.getID();
            var col = table.find('col').filter(':nth-child('+nth+')');
            var cells = table.find('td').filter(':nth-child('+nth+')');
            var colSelector = '#'+id+' > colgroup > col:nth-child('+nth+')';
            var cellSelector = '#'+id+' > * > tr > :nth-child('+nth+')';

            switch ( options.overflow ) {
            case 'break-word':
                qcode.style(cellSelector, 'word-break', "normal");
                qcode.style(colSelector, 'width', ui.size.width + "px");
                if ( th.width() > ui.size.width ) {
                    qcode.style(cellSelector, 'word-break', 'break-all');
                }
                break;

            case 'shrink-one-line':
            case 'shrink':
                qcode.style(colSelector, 'width', ui.size.width + "px");

                var fontSize = th.data('original-font-size');
                qcode.style(cellSelector, 'font-size', fontSize + 'px');

                var width = th.width();
                var lastChangeFontSize = fontSize;
                while ( width > ui.size.width ) {
                    fontSize--;
                    if (fontSize < options['min-font-size']) {
                        break;
                    }
                    qcode.style(cellSelector, 'font-size', fontSize + 'px');
                    if ( th.width() < width ) {
                        lastChangeFontSize = fontSize;
                    }
                    width = th.width();
                }
                qcode.style(cellSelector, 'font-size', lastChangeFontSize + 'px');
                break;

            default:
                qcode.style(colSelector, 'width', ui.size.width + "px");
                break;
            }
            event.stopPropagation();
            table.trigger('resize');
        }
        return this;
    }
})(jQuery);