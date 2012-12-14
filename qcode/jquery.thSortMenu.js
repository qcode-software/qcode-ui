;(function($, window, undefined) {
    var path;
    var sortCols = {};
    var initialized = false;

    function initialize() {
	var urlData = splitURL(window.location.href);
	path = urlData.path;
	var sortColsString = coalesce(urlData.data.sortCols, "");
	var sortColsArray = sortColsString.split(" ");
	for ( var i = 0; i < sortColsArray.length; i += 2 ) {
	    var colName = sortColsArray[i];
	    var direction = sortColsArray[i + 1];
	    sortCols[colName] = direction;
	}
	initialized = true;
    };

    $.widget('qcode.thSortMenu', {
	_create: function() {
	    if ( ! this.options.column.is('col') || this.options.column.length != 1 ) {
		this.options.column = this.element.parent('th').closest('table').find('col').eq(this.element.parent('th').index());
		if ( this.options.column.length != 1 ) {
		    $.error('Unable to find a valid column for thSortMenu');
		}
	    }
	    if ( this.options.type === undefined ) {
		this.options.type = this.getColType(this.options.column);
	    }
	    this._on({
		'click': this.menuShow
	    });
	    this.savedBackground = this.element.parent().css('background-color');
	},
	menuShow: function(event) {
	    if ( this.menu === undefined ) {
		this._menuCreate();
	    }
	    this.element.parent().css({
		'background-color': "#ffffe9"
	    });
	    this.menu
		.position({
		    'my': "top left",
		    'of': event,
		    'collision': "fit"
		})
		.show();
	},
	menuHide: function() {
	    this.menu.hide();
	    this.element.parent().css({
		'background-color': this.savedBackground
	    });
	},
	_menuCreate: function() {
	    if ( ! initialized ) {
		initialize();
	    }

	    this.col = this.options.th.closest('table').find('col').eq(this.options.th.index());
	    if ( col.attr("name") === undefined ) {
		$.error('thSortMenu error - column needs a name to be sorted');
	    }

	    var tmp = $.extend({}, sortCols);
	    tmp[col.attr('name')] = "ASC";
	    var ascURL = path + $.param(tmp);
	    tmp[col.attr('name')] = "DESC";
	    var descURL = path + $.param(tmp);

	    switch(this.options.type) {
	    case 'numeric':
		break;
	    case 'date':
		break;
	    default:
	    }

	    this.menu = $('<div>')
		.addClass('clsSortMenu')
		.appendTo($('body'))
		.css({
		    'position': "absolute",
		    'display': "none",
		    'z-index': 3
		});
	    this.element.add(this.menu)
		.delayedGroupHover({
		    hoverOut: this.menuHide
		});
	},
	getColType: function(col) {
	    if ( col.hasClass('clsNumber') || col.hasClass('clsMoney') ) {
		return 'numeric';
	    } else if ( col.hasClass('clsDate') ) {
		return 'date';
	    } else {
		return 'alpha';
	    }
	}
    });

    function nonBreakingString(text) {
	return text.replace(" ", "&nbsp");
    }

    $.fn.linkNoHistory = function() {
	$(this).filter('a').on('click', function() {
	    window.location.replace($(this).attr('href'));
	    return false;
	});
    }

    $.fn.delayedGroupHover = function(options) {
	var settings = $.extend({
	    inTime: 200,
	    outTime: 200
	}, options);

	var hoverTimer;
	function mouseEnter(event) {
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    if ( typeof settings.hoverIn === "function" ) {
		timer = window.setTimeout(settings.hoverIn, settings.InTime);
	    }
	}
	function mouseLeave(event) {
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    if ( typeof settings.hoverOut === "function" ) {
		timer = window.setTimeout(settings.hoverOut, settings.InTime);
	    }
	}

	$(this)
	    .on('mouseenter', mouseEnter)
	    .on('mouseleave', mouseLeave);
    }
})(jQuery, window);