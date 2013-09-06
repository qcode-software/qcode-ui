;(function($, undefined) {
    $.widget('qcode.theadFixed', {
	options: {
	    'height': "500px"
	},
	_create: function() {
            this.table = this.element;
            this.thead = this.element.children('thead');
            this.headerCells = this.thead.children('tr').first().children('th');

            this.table.wrap('<div>');

            this.scrollBox = this.table.parent()
                .addClass('scroll-box')
                .wrap('<div>');

            this.scrollWrapper = this.scrollBox.parent()
                .addClass('scroll-wrapper')
                .wrap('<div>')
                .css({
                    top: this.thead.outerHeight() + "px"
                });

            this.wrapper = this.scrollWrapper.parent()
                .addClass('thead-fixed-wrapper')
                .css({
                    height: this.options.height
                });

            this.repaint();
            this.table.find('col, th, td').css('width', '');
	},
	repaint: function() {
            this.wrapper.addClass('repainting');

            var scopedCSS = this.table.scopedCSS();
            hashValueSet(scopedCSS, 'th, td', 'box-sizing', 'border-box');

            this.headerCells.each(function(i, th) {
                var width = $(th).outerWidth();
                hashValueSet(scopedCSS, 'th:nth-child('+(i+1)+')', 'width', width + "px");
                hashValueSet(scopedCSS, 'td:nth-child('+(i+1)+')', 'width', width + "px");
            });

            this.wrapper.css('min-width', (this.thead.outerWidth() + 20) + "px");

            this.table.scopedCSS(scopedCSS);

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