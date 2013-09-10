/*
theadFixed plugin

Makes the body + foot of a table scrollable, while making the head "fixed"
Creates 3 levels of wrapping - from the outermost first these wrappers are assigned
the classes "thead-fixed-wrapper", "scroll-wrapper", and "scroll-box".

Much of the functionality is down to the css - see theadFixed.css
*/
;(function($, undefined) {
    $.widget('qcode.theadFixed', {
	options: {
	    'height': "500px"
	},
	_create: function() {
            // Some handy references
            this.table = this.element;
            this.thead = this.element.children('thead');
            this.tbody = this.element.children('tbody');
            this.headerCells = this.thead.children('tr').first().children('th');


            // Create the wrappers
            // Use class "repainting" until column widths have been calculated
            this.table.wrap('<div class="scroll-box">');
            this.scrollBox = this.table.parent().wrap('<div class="scroll-wrapper">');
            this.scrollWrapper = this.scrollBox.parent().wrap('<div class="thead-fixed-wrapper repainting">');
            this.wrapper = this.scrollWrapper.parent().css({height: this.options.height});

            // Calculate and apply column widths
            var css = {};
            this.headerCells.each(function(i, th) {
                var width = $(th).outerWidth();
                css['/*theadFixed*/ tr>*:nth-child('+(i+1)+')'] = {width: width + "px"};
            });

            var widget = this;
            this.wrapper.runDetached(function() {
                widget.table.scopedCSS(css);
                widget.wrapper.removeClass('repainting');
            });

            // Create space for the thead
            this.scrollWrapper.css('top', this.thead.outerHeight() + "px");


            // Add the resize event listeners
            this._on({
                resize: function(event) {
                    // If part of the table (or the table itself) is resized,
                    // flag the event as it bubbles
                    event.isTableResize = true;
                }
            });
            var windowWidth = $(window).width();
            var widget = this;
            this._on($(window), {
                'resize': function(event) {
                    // Repaint if the table was resized, or if the window width
                    // has changed.
                    if ( event.isTableResize ) {
                        this.repaint();

                    } else {
                        // Right now, this is a hack to ensure that the maximizeHeight
                        // plugin has had a chance to get rid of the window's vertical
                        // scrollbar before we test to see if the window width has changed.
                        window.setZeroTimeout(function() {
                            if ( windowWidth != $(window).width() ) {
                                widget.repaint();
                                windowWidth = $(window).width();
                            }
                        });
                    }
                }
            });
	},
	repaint: function(async) {
            // If asychronous, schedule the table to be repainted when the current event handlers are finished
            // Otherwise, repaint immediately and clear any scheduled repaint
            var async = coalesce(async, true);
            var theadFixed = this;
            if ( async ) {
                if ( this.repaintTimeout === undefined ) {
                    this.repaintTimeout = window.setZeroTimeout(function() {
                        theadFixed._repaintNow();
                        theadFixed.repaintTimeout = undefined;
                    });
                }
            } else {
                this._repaintNow();
                window.clearZeroTimeout(this.repaintTimeout);
                this.repaintTimeout = undefined;
            }
        },
        _repaintNow: function() {
            // Re-calculate and re-apply column widths
            var widget = this;

            // Remove existing column width css defined by this plugin
            // Using comments in the selectors keeps these rules separate from those declared by other plugins
            // To Do: Investigate a better design for scopedCSS plugin so that this comments trick isn't needed
            var css = {};
            widget.headerCells.each(function(i, th) {
                css['/*theadFixed*/ tr>*:nth-child('+(i+1)+')'] = {width: ""};
            });
            widget.table.scopedCSS(css);
            var theadHeight = widget.thead.outerHeight();
            widget.wrapper.addClass('repainting');

            // Calculate and apply new column widths
            var css = {};
            this.headerCells.each(function(i, th) {
                var width = $(th).outerWidth();
                css['/*theadFixed*/ tr>*:nth-child('+(i+1)+')'] = {width: width + "px"};
            });
            this.wrapper.runDetached(function() {
                // Run detached so that the table only has to be re-flowed once
                widget.table.scopedCSS(css);
                widget.wrapper.removeClass('repainting');
                widget.scrollWrapper.css('top', theadHeight + "px");
            });
	},
	getWrapper: function() {
	    return this.wrapper;
	},
	getScrollWrapper: function() {
	    return this.scrollWrapper;
	},
	getScrollBox: function() {
	    return this.scrollBox;
	},
	getTable: function() {
	    return this.table;
	}
    });
})(jQuery);