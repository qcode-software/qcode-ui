// colInherit plugin
// Call on tables to copy classes and inline styles from column elements onto cell elements
// Does not overwrite existing cell inline styles.
// Optionally takes an array of custom attribute names to also be copied.
;(function($, undefined) {
    $.fn.colInherit = function(options) {
	var settings = jQuery.extend({
	    customAttributes: []
	}, options);

        var css = {};
	$(this).filter('table').each(function(){
	    var table = $(this);
            var id = table.getID();

	    table.children('colgroup').addBack().children('col').each(function() {
		var col = $(this);

		var colIndex = col.index();
		var tds = table.children('thead, tbody, tfoot').addBack().children('tr').children('td, th').filter(':nth-child(' + (colIndex + 1) + ')');

		// apply col classes to td and th elements
		if (col.attr('class')) {
		    tds.addClass(col.attr('class'));
		}

		// apply col styles to td and th elements
		if (col.attr('style')) {
                    var style = col.attr('style');
                    var selector = '#'+id+'>tr>*:nth-child('+(colIndex+1)+'),' +
                        '#'+id+'>*>tr>*:nth-child('+(colIndex+1)+')';
                    css[selector] = {};

                    style.split(';').forEach(function(declaration) {
                        var property = declaration.split(':')[0].trim();
                        var value = declaration.split(':')[1].trim();
                        if ( ! (property === "display" && value === "table-column") ) {
                            css[selector][property] = value;
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
        qcode.style(css);
	return this;
    }
})(jQuery);
