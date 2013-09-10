// colInherit plugin
// Call on tables to copy classes and inline styles from column elements onto cell elements
// Does not overwrite existing cell inline styles.
// Optionally takes an array of custom attribute names to also be copied.
;(function($, undefined) {
    $.fn.colInherit = function(options) {
	var settings = jQuery.extend({
	    customAttributes: []
	}, options);

	$(this).filter('table').each(function(){
	    var table = $(this);

	    table.children('colgroup').andSelf().children('col').each(function() {
		var col = $(this);

		var colIndex = col.index();
		var tds = table.children('thead, tbody, tfoot').andSelf().children('tr').children('td, th').filter(':nth-child(' + (colIndex + 1) + ')');

		// apply col classes to td and th elements
		if (col.attr('class')) {
		    tds.addClass(col.attr('class'));
		}

		// apply col styles to td and th elements
		if (col.attr('style')) {
                    var style = col.attr('style');
                    style.split(';').forEach(function(declaration) {
                        var property = jQuery.trim(declaration.split(':')[0]);
                        var value = jQuery.trim(declaration.split(':')[1]);
                        if ( ! (property === "display" && value === "table-column") ) {
                            table.scopedCSS('> tr > *:nth-child(' + (colIndex + 1) + ')', property, value);
                            table.scopedCSS('> * > tr > *:nth-child(' + (colIndex + 1) + ')', property, value);
                        }
                    });
		}
		
                // apply custom attributes from cols to td and th elements
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