// Column Resize plugin
// Uses jQuery UI resizable, but resizes the entire column
// If the content does not fit the column, use behaviour defined by overflow options:
// - normal: do nothing, let the underlying css/UA handle it. Usually means the column just won't shrink any further.
// - hidden: clip the overflow.
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

            case 'hidden':
                qcode.style('#'+id+' > thead > tr > th:nth-child('+nth+')', 'overflow-x', "hidden");
            case 'normal':
                break;

            case 'break-word':
                break;

            default:
                $.error('Unrecognised value for options.overflow - supported options are "shrink", "shrink-one-line", "normal", "break-word"');
                break;
            }
        });
        var handleWidth = 10;
        var minWidth = 10;
        var dragging = false;
        this.each(function() {
            var table = $(this);
            var id = table.getID();
            table.on('mousemove', 'th', function(event) {
                if ( dragging ) {
                    return;
                }
                var thHover = $(this);
                var left = thHover.offset().left;
                var right = left + thHover.width();
                var resizeLeft = false;
                var resizeRight = false;
                if ( left + handleWidth > event.pageX ) {
                    if ( event.pageX - left > right - event.pageX ) {
                        resizeRight = true;
                    } else {
                        resizeLeft = true;
                    }
                } else if ( right - handleWidth < event.pageX ) {
                    resizeRight = true;
                }

                if ( resizeLeft || resizeRight ) {
                    table.children('thead').css('cursor', 'e-resize');
                } else {
                    table.children('thead').css('cursor', 'auto');
                }
            });
        });
        this.on('mouseout', 'th', function() {
            $(this).closest('table').children('thead').css('cursor', 'auto');
        });
        this.on('mousedown', 'th', dragStart);
        this.on('mousedragStart', 'th', function(event, data) {
            var thHover = $(this);
            var table = thHover.closest('table');

            var left = thHover.offset().left;
            var right = left + thHover.width();
            var resizeLeft = false;
            var resizeRight = false;
            if ( left + handleWidth > data.pageX ) {
                if ( data.pageX - left > right - data.pageX ) {
                    resizeRight = true;
                } else {
                    resizeLeft = true;
                }
            } else if ( right - handleWidth < data.pageX ) {
                resizeRight = true;
            }

            if ( resizeLeft || resizeRight ) {
                dragging = true;
                if ( resizeLeft ) {
                    var thToResize = thHover.prev();
                    while ( thToResize.length > 0 && ! thToResize.is(':visible') ) {
                        thToResize = thToResize.prev();
                    }
                } else {
                    var thToResize = thHover;
                }

                if ( thToResize.length == 0 ) {
                    return;
                }

                var handle = $('<div class="column-resize-handle">');
                var left = data.pageX - table.offset().left;
                handle.appendTo(thHover);
                handle.css('left', left + "px");

                var width = thToResize.outerWidth();

                thHover.on('mousedrag', function(event, data) {
                    handle.css('left', (left + data.offset) + "px");
                    width = handle.offset().left - thToResize.offset().left;
                    if ( width < minWidth ) {
                        handle.css('left', '+='+ (minWidth - width));
                        width = minWidth;
                    }
                });

                thHover.one('mousedragEnd', function(event) {
                    dragging = false;
                    handle.remove();
                    resize(thToResize, width);
                    thHover.off('mousedrag');
                });
            }
        });

        function resize(th, width) {
            var nth = th.index() + 1;
            var table = th.closest('table');
            var id = table.getID();
            var col = table.find('col').filter(':nth-child('+nth+')');
            var cells = table.find('td').filter(':nth-child('+nth+')');
            var colSelector = '#'+id+' > colgroup > col:nth-child('+nth+')';
            var cellSelector = '#'+id+' > * > tr > :nth-child('+nth+')';
            qcode.style(colSelector, 'width', width + "px");

            switch ( options.overflow ) {
            case 'break-word':
                qcode.style(cellSelector, 'word-break', "normal");
                if ( th.width() > width ) {
                    qcode.style(cellSelector, 'word-break', 'break-all');
                }
                break;

            case 'shrink-one-line':
            case 'shrink':
                var fontSize = th.data('original-font-size');
                qcode.style(cellSelector, 'font-size', fontSize + 'px');

                var measuredWidth = th.width();
                var lastChangeFontSize = fontSize;
                while ( measuredWidth > width ) {
                    fontSize--;
                    if (fontSize < options['min-font-size']) {
                        break;
                    }
                    qcode.style(cellSelector, 'font-size', fontSize + 'px');
                    if ( th.width() < measuredWidth ) {
                        lastChangeFontSize = fontSize;
                    }
                    measuredWidth = th.width();
                }
                qcode.style(cellSelector, 'font-size', lastChangeFontSize + 'px');
                break;
            }
            table.trigger('resize');
        }
        return this;
    }

    function dragStart(event) {
        var target = $(event.target);
	event.preventDefault();
        $(window)
                .on('mousemove.dragListener', drag.bind(this, target, event.pageX))
                .on('mouseup.dragListener', dragEnd.bind(this, target, event.pageX));
        target.trigger('mousedragStart', [{
            'pageX': event.pageX
        }]);
    }
    function drag(target, initialX, event) {
	event.preventDefault();
	target.trigger('mousedrag', [{
	    'offset': event.pageX - initialX
	}]);
    }
    function dragEnd(target, initialX, event) {
        $(window).off('.dragListener');
        target.trigger('mousedragEnd');
    }
})(jQuery);