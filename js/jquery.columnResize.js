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

        if ( options.overflow === 'hidden' ) {
            var styles = {};
            this.filter('table').each(function() {
                var $table = $(this);
                if ( $table.css('table-layout') === 'auto' ) {
                    var id = $table.getID();
                    styles['#'+id] = {
                        "table-layout": "fixed",
                        "width": "0"
                    };
                    $table.children('thead').first().children('tr').first().children('th').each(function() {
                        var $th = $(this);
                        var nth = $th.index() + 1;
                        styles['#'+id+' > colgroup > col:nth-child('+nth+')'] = {
                            "width": $th.width() + 'px'
                        };
                    });
                }
            });
            qcode.style(styles);
        }

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
                qcode.style('#'+id+' > * > tr > *:nth-child('+nth+')', 'overflow-x', "hidden");
                break;

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

        // Change the cursor when the mouse moves over a hotspot
        this.each(function() {
            var table = $(this);
            var id = table.getID();
            table.on('mousemove', 'th', function(event) {
                if ( dragging ) {
                    return;
                }
                var thHover = $(this);
                var left = thHover.offset().left;
                var right = left + thHover.outerWidth();
                // Over the left hotspot or right hotspot
                if ( left + handleWidth > event.pageX || right - handleWidth < event.pageX ) {
                    table.children('thead').css('cursor', 'e-resize');
                } else {
                    table.children('thead').css('cursor', 'auto');
                }
            });
        });
        this.on('mouseout', 'th', function() {
            $(this).closest('table').children('thead').css('cursor', 'auto');
        });

        // Listen for mouse dragging
        this.on('mousedown', 'th', function(mouseDownEvent) {
            var thHover = $(this);
	    mouseDownEvent.preventDefault();

            var table = thHover.closest('table');

            var thLeftPageX = thHover.offset().left;
            var thRightPageX = thLeftPageX + thHover.width();
            // Identify which th is to be resized if any.
            if ( thLeftPageX + handleWidth > mouseDownEvent.pageX ) {
                if ( mouseDownEvent.pageX - thLeftPageX > thRightPageX - mouseDownEvent.pageX ) {
                    var thToResize = thHover;
                } else {
                    var thToResize = thHover.prev();
                    while ( thToResize.length > 0 && ! thToResize.is(':visible') ) {
                        thToResize = thToResize.prev();
                    }
                    if ( thToResize.length == 0 ) {
                        return;
                    }
                }
            } else if ( thRightPageX - handleWidth < mouseDownEvent.pageX ) {
                var thToResize = thHover;
            } else {
                return;
            }
            dragging = true;

            // init handle
            var handle = $('<div class="column-resize-handle">');
            var initialHandlePositionLeft = mouseDownEvent.pageX - table.offset().left;
            handle.appendTo(thHover);
            handle.css('left', initialHandlePositionLeft + "px");

            var width = thToResize.outerWidth();

            // Mousemove and mouse up when dragging
            $(window)
                    .on('mousemove.dragListener', function(mouseMoveEvent) {
	                mouseMoveEvent.preventDefault();
                        handle.css('left', (mouseMoveEvent.pageX - table.offset().left) + "px");
                        width = handle.offset().left - thToResize.offset().left;
                        if ( width < minWidth ) {
                            handle.css('left', '+='+ (minWidth - width));
                            width = minWidth;
                        }
                    })
                    .one('mouseup', function(mouseUpEvent) {
                        $(window).off('.dragListener');
                        dragging = false;
                        handle.remove();
                        resize(thToResize, width);
                    });
        });

        function resize(th, width) {
            // Resize the column associated with this th
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
})(jQuery);