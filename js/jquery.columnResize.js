// Column Resize plugin
// Uses jQuery UI resizable, but resizes the entire column
// If the content does not fit the column, use behaviour defined by overflow options:
// - normal: do nothing, let the underlying css/UA handle it. Usually means the column just won't shrink any further.
// - shrink: reduce the font size (down to min-font-size) until the content fits. Supports only a single font size for the column.
// - shrink-one-line (default): as shrink, but force no wrapping to keep on one-line
// - break-word: force word break to try and make the content fit.
;(function($, undefined) {
    $.fn.columnResize = function(options) {
        var options = $.extend({
            overflow: "shrink-one-line",
            'min-font-size': 1
        }, options);

        // Initialisation
        this.addClass('qc-column-resize');
        this.find('th').each(function() {
            var th = $(this);
            var nth = th.index() + 1;
            var id = th.closest('table').getID();

            switch ( options.overflow ) {
            case 'shrink-one-line':
                qcode.style('#'+id+' > * > tr > :nth-child('+nth+')', 'white-space', "nowrap");

            case 'shrink':
                th.data('original-font-size', parseInt(th.css('font-size')));
                break;

            case 'normal':
                if ( th.css('overflow-x') !== "hidden" ) {
                    break;
                }
            case 'hidden':
                th.wrapInner('<div class="column-resize-wrapper"></div>');
                qcode.style('#'+id+' > thead > tr > th:nth-child('+nth+')', 'overflow-x', 'visible');
                break;

            case 'break-word':
                break;

            default:
                $.error('Unrecognised value for options.overflow - supported options are "shrink", "shrink-one-line", "normal", "break-word"');
                break;
            }

            th.append('<div class="column-resize-handle"></div>');
        });
        this.on('mousedown', '.column-resize-handle', dragStart);
        this.on('mousedrag', 'th', onResize);

        // Resize event handler
        function onResize(e, ui) {
            var th = $(this);

            var nth = th.index() + 1;
            var table = th.closest('table');
            var id = table.getID();
            var col = table.find('col').filter(':nth-child('+nth+')');
            var cells = table.find('td').filter(':nth-child('+nth+')');
            var colSelector = '#'+id+' > colgroup > col:nth-child('+nth+')';
            var cellSelector = '#'+id+' > * > tr > :nth-child('+nth+')';
            var width = (ui.width + parseInt(th.css('padding-left')) + parseInt(th.css('padding-right')) + parseInt(th.css('border-left-width')));

            switch ( options.overflow ) {
            case 'break-word':
                qcode.style(cellSelector, 'word-break', "normal");
                qcode.style(colSelector, 'width', width + "px");
                if ( th.width() > ui.size.width ) {
                    qcode.style(cellSelector, 'word-break', 'break-all');
                }
                break;

            case 'shrink-one-line':
            case 'shrink':
                qcode.style(colSelector, 'width', width + "px");

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
                qcode.style(colSelector, 'width', width + "px");
                break;
            }
            event.stopPropagation();
            table.trigger('resize');
        }
        return this;
    }

    function dragStart(event) {
        console.log('dragStart');
        var target = $(event.target);
	event.preventDefault();
        var width = target.closest('th').innerWidth();
        $(window)
                .on('mousemove.dragListener', drag.bind(this, target, event.pageX, width))
                .on('mouseup.dragListener', dragEnd.bind(this, target, event.pageX, width));
        target.trigger('mousedragStart');
    }
    function drag(target, initialX, initialWidth, event) {
	event.preventDefault();
	target.trigger('mousedrag', [{
	    'width': initialWidth + event.pageX - initialX
	}]);
    }
    function dragEnd(target, initialX, initalWidth, event) {
        $(window).off('.dragListener');
        target.trigger('mousedragEnd');
    }
})(jQuery);