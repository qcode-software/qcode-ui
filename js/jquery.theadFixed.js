(function($, undefined) {
    var scrollBarWidth = 18;

    $.widget('qcode.theadFixed', {
	options: {
	    'wrapperClass': "theadFixed-wrapper",
	    'scrollWrapperClass': "theadFixed-scrollWrapper",
	    'scrollBoxClass': "theadFixed-scrollBox",
	    'height': "500px"
	},
	_create: function() {
	    // TheadFixed Class Constructor
	    var widget = this;

	    // Attempt to handle existing wrappers sensibly.
	    if ( ! $(this.element).is('table') ) {
		this.table = $(this.element).find('table');
		if ( this.table.length !== 1 ) {
		    $.error("Each target element must be, or contain, a single table");
		}
	    } else {
		this.table = this.element;
	    }
	    var table = this.table;
	    var thead = table.children('thead');

	    // Create wrappers and apply classes
	    this.element
		.wrap('<div>');
	    this.scrollBox = this.element.parent();
	    this.scrollBox
		.addClass(this.options.scrollBoxClass)
		.wrap('<div>');
	    this.scrollWrapper = this.scrollBox.parent();
	    this.scrollWrapper
		.addClass(this.options.scrollWrapperClass)
		.wrap('<div>');
	    this.wrapper = this.scrollWrapper.parent();
	    this.wrapper
		.addClass(this.options.wrapperClass);

	    // Store any inline widths that were present before the plugin was called
	    thead.children('tr:first-child').children('th, td').each(function(index, element) {
		var th = $(element);
		var td = table.children('tbody').children('tr:first-child').children('th, td').filter(':nth-child(' + ( index + 1 )+ ')');
		th.data('theadFixedCellWidth', widget._getCellInlineWidth(th));
		td.data('theadFixedCellWidth', widget._getCellInlineWidth(td));
	    });

	    // Calculate and apply widths so that the headers match the body
	    this._setWidths();

	    // Apply css
	    this.wrapper.css({
		'position': "relative",
		'margin-top': table.css('margin-top'),
		'margin-right': table.css('margin-right'),
		'margin-bottom': table.css('margin-bottom'),
		'margin-left': table.css('margin-left'),
		'height': this.options.height
	    });
	    table.css('margin', 0);

	    this.scrollWrapper.css({
		'position': "absolute",
		'top': thead.outerHeight(),
		'bottom': 0
	    });
	    this.scrollBox.css({
		'overflow-y': "auto",
		'overflow-x': 'hidden',
		'height': "100%"
	    });

	    thead.css({
		'position': "absolute",
		'bottom': "100%",
		'left': 0
	    });

	    if ( table.css('border-collapse') == 'collapse' ) {
		table.children('tr:first-child').children('th, td').css('border-top-width', 0);
	    }

	    thead.find('tr').filter(':first-child').find('th, td').css({
		'border-top-style': table.css('border-top-style'),
		'border-top-width': table.css('border-top-width'),
		'border-top-color': table.css('border-top-color')
	    });
	    thead.find('tr').each(function(i, row){
		var cells = $(row).find('th, td').filter(':visible');
		cells.eq(0).css({
		    'border-left-style': table.css('border-left-style'),
		    'border-left-width': table.css('border-left-width'),
		    'border-left-color': table.css('border-left-color')
		});
		cells.eq(-1).css({
		    'border-right-style': table.css('border-right-style'),
		    'border-right-width': table.css('border-right-width'),
		    'border-right-color': table.css('border-right-color')
		});
	    });
	    table.css('border-top-width', 0);
	},
	repaint: function() {
	    // Recalculate widths, heights, etc.
	    var table = this.table;
	    var thead = table.children('thead');
	    thead.css({
		'position': "static"
	    });
	    this._setWidths();
	    thead.css({
		'position': "absolute"
	    });
	    this.scrollWrapper.css('top', thead.outerHeight());
	},
	_setWidths: function() {
	    // Calculate the width of each column and apply it to first-row cells in the header and body
	    var table = this.table;
	    var thead = table.children('thead');

	    // Temporarily give the table a lot of space to make sure that the column width calculations come out right
	    this.scrollBox.css('min-width', 10000);

	    // If any cells besides header cells and first-row cells have a specified width, remove it.
	    table.children('tbody, tfoot').children('tr').not(':first-child').children('th, td').css('width', '');

	    // Calculate and apply column widths
	    thead.children('tr:first-child').children('th, td').each(function(index, element) {
		var th = $(element);
		var td = table.children('tbody').children('tr:first-child').children('th, td').filter(':nth-child(' + ( index + 1 )+ ')');

		th.css('width', coalesce(th.data('theadFixedCellWidth'), ''));
		td.css('width', coalesce(td.data('theadFixedCellWidth'), ''));

		var width = Math.max( Math.ceil(th.innerWidth()), Math.ceil(td.innerWidth() ));

		// Ensures that default padding will be preserved when the thead is removed
		th.css({
		    'padding-top': th.css('padding-top'),
		    'padding-right': th.css('padding-right'),
		    'padding-bottom': th.css('padding-bottom'),
		    'padding-left': th.css('padding-left')
		});
		th.css('width', width - parseInt(th.css('padding-left')) - parseInt(th.css('padding-right')));
		td.css('width', width - parseInt(td.css('padding-left')) - parseInt(td.css('padding-right')));
	    });

	    this.scrollBox.css('min-width', table.outerWidth() + scrollBarWidth);
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
	},
	_getCellInlineWidth: function(cell) {
	    // Gets the width from a cell's inline style attribute
	    var width,
	    style = cell.attr('style');
	    if ( style !== undefined ) {
		var pairs = style.split(';');
		$.each(pairs, function(i, pair) {
		    var bits = pair.split(':'),
		    name = $.trim(bits[0]),
		    value = $.trim(bits[1]);
		    if ( name === "width" ) {
			width = value;
			return false;
		    }
		});
		return width;
	    }
	}
    });
})(jQuery);