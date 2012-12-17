// thSortMenu plugin - support for server-side table sorting
;(function($, window, undefined) {
    // Static variables, shared by all instances of this plugin on the page
    var urlData = splitURL(window.location.href);
    var path = urlData.path;
    var qryData = urlData.data;
    if ( qryData.sortCols !== undefined ) {
	var sortColsArray = qryData.sortCols.split(" ");
	var firstSortColName = sortColsArray[0];
	var firstSortColType = coalesce(sortColsArray[1], 'ASC');
    }

    // The actual widget prototype
    $.widget('qcode.thSortMenu', {
	_create: function() {
	    // Constructor function
	    // Apply default column and sort type
	    if ( this.options.column === undefined ) {
		this.options.column = this.element.parent('th').closest('table').find('col').eq( this.element.parent('th').index() );
	    }
	    if ( ! this.options.column.is('col') || this.options.column.length != 1 ) {
		$.error('Invalid column for thSortMenu');
	    }
	    if ( this.options.type === undefined ) {
		this.options.type = this.getColType(this.options.column);
	    }

	    // Bind events
	    this._on({
		'click': this.menuShow
	    });

	    // Remember parent's background color
	    this.savedBackground = this.element.parent().css('background-color');
	},
	menuShow: function(target) {
	    // Show the menu. Target is the event or element to position against.
	    if ( this.menu === undefined ) {
		this._menuCreate();
	    }
	    this.element.parent().css({
		'background-color': "#ffffe9"
	    });
	    // Use jQuery UI position method
	    this.menu
		.show()
		.position({
		    'my': "left top",
		    'of': target,
		    'collision': "fit"
		});
	},
	menuHide: function() {
	    // Hide the menu
	    this.menu.hide();
	    this.element.parent().css({
		'background-color': this.savedBackground
	    });
	},
	getColType: function(col) {
	    // Get the sort type of the given column
	    if ( col.hasClass('clsNumber') || col.hasClass('clsMoney') ) {
		return 'numeric';
	    } else if ( col.hasClass('clsDate') ) {
		return 'date';
	    } else {
		return 'alpha';
	    }
	},
	_menuCreate: function() {
	    // Create the menu
	    var colName = this.options.column.attr('name');

	    var tmpSortCols = {};
	    tmpSortCols[ colName ] = "ASC";
	    var ascURL = path + "?" + $.param( this._sortColsIntoQryData(tmpSortCols, qryData) );
	    tmpSortCols[ colName ] = "DESC";
	    var descURL = path + "?" + $.param( this._sortColsIntoQryData(tmpSortCols, qryData) );

	    // Generate link text from sort type
	    var ascText;
	    var descText;
	    switch(this.options.type) {
	    case 'numeric':
		ascText = "Sort Low to High";
		descText = "Sort High to Low";
		break;
	    case 'date':
		ascText = "Sort Old to New";
		descText = "Sort New to Old";
		break;
	    default:
		ascText = "Sort A-Z";
		descText = "Sort Z-A";
	    }

	    // Create the links
	    var ascLink = $('<a>')
			    .attr( 'href',  ascURL )
			    .html( nonBreakingString( ascText ) )
			    .linkNoHistory();
	    var descLink = $('<a>')
			    .attr( 'href',  descURL )
			    .html( nonBreakingString( descText ) )
			    .linkNoHistory();

	    // Create the menu element
	    this.menu = $('<div>')
		.addClass('clsSortMenu')
		.appendTo($('body'))
		.css({
		    'position': "absolute",
		    'display': "none",
		    'z-index': 3
		});

	    // Add the required links to the menu
	    if ( colName === firstSortColName ) {
		if ( firstSortColType == "ASC" ) {
		    this.menu.append(descLink);
		} else {
		    this.menu.append(ascLink);
		}
	    } else {
		this.menu.append(ascLink).append(descLink);
	    }

	    // Add the menu to the widget and bind hover events
	    this.element.add(this.menu)
		.delayedGroupHover({
		    inTime: 400,
		    outTime: 400,
		    hoverOut: this.menuHide.bind(this)
		});
	},
	_sortColsIntoQryData: function(sortCols, qryData) {
	    // Generate a new query data object from a sort columnss object and a query data object
	    var tmpQryData = $.extend({}, qryData);
	    var pairs = [];
	    $.each(sortCols, function(name, value) {
		pairs.push(name + " " + value);
	    });
	    tmpQryData.sortCols = pairs.join(" ");
	    return tmpQryData;
	}
    });
})(jQuery, window);