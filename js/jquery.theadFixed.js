/*
theadFixed plugin

Makes the body + foot of a table scrollable, while making the head "fixed"
Creates 3 levels of wrapping - from the outermost first these are assigned
the classes "thead-fixed-wrapper", "scroll-wrapper", and "scroll-box".

Much of the functionality is down to the css - see theadFixed.css
*/
;(function($, undefined) {
    $.widget('qcode.theadFixed', {
	options: {
	    'height': "500px"
	},
	_create: function() {
            this.table = this.element;
            var tableLayout = this.table.css('table-layout');
            this.thead = this.element.children('thead');
            this.tbody = this.element.children('tbody');
            this.headerCells = this.thead.children('tr').first().children('th');

            // Create the wrappers
            this.table.wrap('<div>');
            this.scrollBox = this.table.parent()
                .addClass('scroll-box')
                .wrap('<div>');
            this.scrollWrapper = this.scrollBox.parent()
                .addClass('scroll-wrapper')
                .wrap('<div>');
            this.wrapper = this.scrollWrapper.parent()
                .addClass('thead-fixed-wrapper')
                .css({
                    height: this.options.height
                });

            this.scrollWrapper.css('top', this.thead.outerHeight() + "px");

            this._repaintNow();
            var windowWidth = $(window).width();
            this._on($(window), {
                'resize': function() {
                    if ( this.table.is(event.target)
                         || this.table.find(event.target)
                         || windowWidth != window.width() ) {
                        this.repaint();
                    }
                    windowWidth = $(window).width();
                }
            });
	},
	repaint: function(async) {
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
            this.wrapper.addClass('repainting');

            var table = this.table;
            this.headerCells.each(function(i, th) {
                // Using comments in the selectors keeps these rules separate from those declared by other plugins
                table.scopedCSS('/*theadFixed*/ th:nth-child('+(i+1)+')', 'width', "");
                table.scopedCSS('/*theadFixed*/ td:nth-child('+(i+1)+')', 'width', "");
                var width = $(th).outerWidth();
                table.scopedCSS('/*theadFixed*/ th:nth-child('+(i+1)+')', 'width', width + "px");
                table.scopedCSS('/*theadFixed*/ td:nth-child('+(i+1)+')', 'width', width + "px");
            });

            this.wrapper.removeClass('repainting');
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