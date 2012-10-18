(function($){
    var scrollBarWidth = 18;

    // TheadFixed Class Constructor
    var TheadFixed = function(table, settings) {
	this.table = table;

	// Settings
	var defaultSettings = {
	    'height': "100%",
	    'wrapperClass': "theadFixed-wrapper",
	    'scrollWrapperClass': "theadFixed-scrollWrapper",
	    'scrollBoxClass': "theadFixed-scrollBox",
	    'tableClass': this.table.attr('class')
	};
	if ( typeof this.table.data('height') !== "undefined" ) {
	    defaultSettings.height = this.table.data('height');
	}
	this.settings = $.extend(defaultSettings, settings);

	table.attr('class', this.settings.tableClass);

	// Accounting for borders, padding, etc.
	this.thead = jQuery('thead',this.table);
	this.errorY = this.thead.offset().top - this.table.offset().top - parseInt(this.table.css('margin-top'));
	this.errorX = this.thead.offset().left - this.table.offset().left - parseInt(this.table.css('margin-left'));
	if ( this.table.css('border-collapse') == 'collapse' ) {
	    this.errorY++;
	}

	// Create wrappers and apply classes
	this.table.wrap('<div>');
	this.scrollBox = this.table.parent()
	    .addClass(this.settings.scrollBoxClass)
	    .wrap('<div>');
	this.scrollWrapper = this.scrollBox.parent()
	    .addClass(this.settings.scrollWrapperClass)
	    .wrap('<div>');
	this.wrapper = this.scrollWrapper.parent()
	    .addClass(this.settings.wrapperClass);

	// Temporarily give the table a lot of space to make sure that the column width calculations come out right
	this.scrollBox.css('min-width', 10000);

	// Calculate and apply column widths
	this.table.find('tbody tr').not(':first-child').find('td').css('width', '');
	this.table.find('tbody tr:first-child').find('th, td').each(function(index, element){
	    var width = parseInt($(element).innerWidth());
	    if ( this.table.css('border-collapse') == 'collapse' ) {
		width += parseInt($(element).css('border-left-width'));
	    }
	    var th = this.thead.find('tr:first-child').find('th, td').eq(index);
	    th.css('width', width - parseInt(th.css('padding-left')) - parseInt(th.css('padding-right')));
	    $(element).css('width', width - parseInt($(element).css('padding-left')) - parseInt($(element).css('padding-right')));
	}.bind(this));
	this.table.find('col, colgroup').css('width', '');

	// Apply css
	this.wrapper.css({
	    'position': "relative",
	    'margin-top': this.table.css('margin-top'),
	    'margin-right': this.table.css('margin-right'),
	    'margin-bottom': this.table.css('margin-bottom'),
	    'margin-left': this.table.css('margin-left'),
	    'height': this.settings.height
	});
	this.table.css('margin', 0);

	this.scrollWrapper.css({
	    'position': "absolute",
	    'top': this.thead.outerHeight() + this.errorY,
	    'bottom': 0
	});
	this.scrollBox.css({
	    'overflow-y': "auto",
	    'overflow-x': 'hidden',
	    'height': "100%",
	    'min-width': this.table.outerWidth() + scrollBarWidth
	});
	this.thead.css({
	    'position': "absolute",
	    'bottom': "100%",
	    'left': this.errorX
	});
	if ( this.table.css('border-collapse') == 'collapse' ) {
	    this.table.find('tr:first-child td').css('border-top-width', 0);
	}

    };
    $.extend(TheadFixed.prototype, {
	setHeight: function(newHeight) {
	    this.wrapper.css('height', newHeight);
	}
    });

    // Make TheadFixed Class available as a jquery plugin
    $.fn.theadFixed = function() {
	var tables = this;
	if ( typeof arguments[0] == "object" ) {
	    var settings = arguments[0];
	} else if ( typeof arguments[0] == "string" ) {
	    var method = arguments[0];
	}

	if ( tables.not('table').size() ) {
	    throw new Error('jQuery.theadFixed requires that only table elements are contained in the jQuery object');
	}

	// Initialise TheadFixed objects for each elmt unless this has already been done
	for ( var i=0; i< tables.size(); i++ ) {
	    var table = tables.eq(i);
	    var theadFixed = table.data('theadFixed');

	    if ( ! theadFixed ) {
		theadFixed = new TheadFixed(table, settings);
		table.data('theadFixed',theadFixed);
	    }

	    if ( method == 'wrapper' ) {
		return theadFixed.wrapper;
	    }
	    if ( method == 'height' && arguments.length == 2 ) {
		theadFixed.setHeight(arguments[1]);
	    }
	}
	
	return tables;
    }

}) (jQuery);

