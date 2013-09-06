// Column Resize plugin
// Uses jQuery UI resizable, but resizes the entire column
// If the content does not fit the column, use behaviour defined by overflow options:
// - normal: do nothing, let the underlying css/UA handle it. Usually means the column just won't shrink any further.
// - shrink: reduce the font size (down to min-font-size) until the content fits.
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
            var index = th.index();
            var table = th.closest('table');
            var tableCSS = table.scopedCSS();
            var colSelector = 'col:nth-child('+(index+1)+'), td:nth-child('+(index+1)+'), th:nth-child('+(index+1)+')';
            var col = table.find('col').filter(':nth-child('+(index+1)+')');
            hashValueSet(tableCSS, colSelector, 'width', col.width() + "px");
            col.css('width', '');
            var cells = table.find('td').filter(':nth-child('+(index+1)+')');

            switch ( options.overflow ) {
            case 'shrink-one-line':
                hashValueSet(tableCSS, colSelector, 'white-space', "nowrap");
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
            table.scopedCSS(tableCSS);
        });

        function onResize(e, ui) {
            var th = $(this);
            th.css('width', '');
            var index = th.index();
            var table = th.closest('table');
            var col = table.find('col').filter(':nth-child('+(index+1)+')');
            var cells = table.find('td').filter(':nth-child('+(index+1)+')');
            var colSelector = 'col:nth-child('+(index+1)+'), td:nth-child('+(index+1)+'), th:nth-child('+(index+1)+')';
            var tableCSS = table.scopedCSS();

            switch ( options.overflow ) {
            case 'break-word':
                hashValueSet(tableCSS, colSelector, 'word-break', 'normal');
                hashValueSet(tableCSS, colSelector, 'width', ui.size.width + "px");
                if ( th.width() > ui.size.width ) {
                    hashValueSet(tableCSS, colSelector, 'word-break', 'break-all');
                }
                table.scopedCSS(tableCSS);
                break;

            case 'shrink-one-line':
            case 'shrink':
                hashValueSet(tableCSS, colSelector, 'width', ui.size.width + "px");
                th.add(cells).add(col).each(function() {
                    $(this).css('font-size', $(this).data('original-font-size'));
                });
                
                var tooSmall = false;
                table.scopedCSS(tableCSS);
                while ( th.width() > ui.size.width && ! tooSmall ) {
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
                hashValueSet(tableCSS, colSelector, 'width', ui.size.width + "px");
                table.scopedCSS(tableCSS);
                break;
            }
            event.stopPropagation;
            table.trigger('resize');
        }
        return this;
    }
})(jQuery);