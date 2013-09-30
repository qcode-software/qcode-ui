/*
theadFixed plugin

Makes the body + foot of a table scrollable, while making the head "fixed"
Creates 3 levels of wrapping - from the outermost first these wrappers are assigned
the classes "thead-fixed-wrapper", "scroll-wrapper", and "scroll-box".

Measures the widths of the columns then uses table-layout:fixed to enforce those
widths after the head and body have been separated

Much of the functionality is down to the css - see theadFixed.css
*/
;(function($, undefined) {
    $.widget('qcode.theadFixed', {
	options: {
	    'height': "500px",
            'fixedWidth': false
	},
	_create: function() {
            // Some handy references
            this.table = this.element;
            this.thead = this.element.children('thead');
            this.tbody = this.element.children('tbody');
            this.headerCells = this.thead.children('tr').first().children('th');

            // css selectors for each column, applied only when not repainting
            var colSelectors = {};
            var id = this.table.getID();
            this.headerCells.each(function(i, th) {
                colSelectors[i] = '.thead-fixed-wrapper:not(.thead-fixed-repainting) #'+id+' th:nth-child('+(i+1)+'), '+
                    '.thead-fixed-wrapper:not(.thead-fixed-repainting) #'+id+' col:nth-child('+(i+1)+')';
            });
            this.colSelectors = colSelectors;


            // Create the wrappers
            // Use class "thead-fixed-repainting" until column widths have been measured
            this.table.wrap('<div class="scroll-box">');
            this.scrollBox = this.table.parent().wrap('<div class="scroll-wrapper">');
            this.scrollWrapper = this.scrollBox.parent().wrap('<div class="thead-fixed-wrapper thead-fixed-repainting">');
            this.wrapper = this.scrollWrapper.parent().css({height: this.options.height});


            // Add the resize event listeners - only repaint when the table is resized
            // or the window width changes.
            var windowWidth = $(window).width();
            var widget = this;
            // On window resize, or when a resize bubbles to the window.
            this._on($(window), {
                'resize': function(event) {
                    if ( $(event.target).closest(this.element).length > 0 ) {
                        this.repaint();

                    } else {
                        // Right now, setZeroTimeout is used as a hack to ensure that the maximizeHeight
                        // plugin has had a chance to get rid of the window's vertical scrollbar,
                        // before we test to see if the window width has changed.
                        if ( ! this.options.fixedWidth ) {
                            window.setZeroTimeout(function() {
                                if ( windowWidth != $(window).width() ) {
                                    widget.repaint();
                                    windowWidth = $(window).width();
                                }
                            });
                        }
                    }
                }
            });

            this.repaint(false);

            /* Where supported, MutationObserver allows us to listen for changes to the DOM */
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            if ( MutationObserver ) {
                this.observer = new MutationObserver(this.repaint.bind(this));
                this.observer.observe(
                    this.element[0],
                    {
                        childList: true,
                        characterData: true,
                        subtree: true
                    }
                );
            }
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

            // Apply class "thead-fixed-repainting" - this disabled most of the theadFixed css, including any widths
            // specified by a previous repaint.
            this.wrapper.addClass('thead-fixed-repainting');

            // Measure the new column widths and write this to the page css
            var colSelectors = this.colSelectors;
            this.headerCells.each(function(i, th) {
                qcode.style(colSelectors[i], 'width', $(th).outerWidth()+"px");
            });

            // Remove the repainting class, applying the new widths and re-applying the theadFixed css
            this.wrapper.removeClass('thead-fixed-repainting');

            // Get the new thead height
            var theadHeight = this.thead.outerHeight();

            // Apply the new thead height - run detached to fix google chrome bug.
            var widget = this;
            this.wrapper.runDetached(function() {
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