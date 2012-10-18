(function($) {
    $.fn.colInherit = function(options) {
	var settings = jQuery.extend({
	    customAttributes: []
	}, options);

	$(this).filter('table').each(function(){
	    var table = $(this);

	    table.find('col').each(function() {
		var col = $(this);

		var colIndex = col.index();
		var tds = table.find('td, th').filter(':nth-child(' + (colIndex + 1) + ')');

		// apply col classes to td and th elements
		if (col.attr('class')) {
		    tds.addClass(col.attr('class'));
		}

		// apply col styles to td elements
		if (col.attr('style')) {
		    var colStyle = col.attr('style').replace(/(^ +)|( *; *$)/, '');

		    tds.each(function() {
			var td = $(this);
			attributes = [];
			style = '';
			if (td.attr('style')) {
			    style = td.attr('style').replace(/(^ +)|( *; *$)/, '');
			    style.split(';').forEach(function(pair) {
				attributes.push(jQuery.trim(pair.split(':')[0]));
			    });
			}

			colStyle.split(';').forEach(function(pair) {
			    if (jQuery.inArray(jQuery.trim(pair.split(':')[0]), attributes) == -1) {
				if (style == '') {
				    style += pair;
				} else {
				    style += ';' + pair;
				}
			    }
			});

			style += ';';

			td.attr('style', style);
		    });
		}
		
		settings.customAttributes.forEach(function(name) {
		    if ( col.attr(name) ) {
			tds.each(function() {
			    var td = $(this);
			    if ( ! td.attr(name) ) {
				td.attr(name, col.attr(name));
			    }
			});
		    }
		});
	    });
	});
	return this;
    }
})(jQuery);