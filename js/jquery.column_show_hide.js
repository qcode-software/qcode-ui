jQuery.fn.columns_show_hide = function(column_selector) {
    jQuery(this).each(function() {
	var table = jQuery(this);
        var toShow = $([]);
        var toHide = $([]);

	jQuery(column_selector, table).each(function() {
            var column = jQuery(this);
            var index = column.index();

            if ( table.find('tbody>tr:first-child>td').eq(index).is(':visible') ) {
                toHide = toHide.add(table.find('thead>tr>th:nth-child(' + (index + 1) + '), tbody>tr>td:nth-child(' + (index + 1) + '), tfoot>tr>td:nth-child(' + (index + 1) + ')'));

            } else {
                toShow = toShow.add(table.find('thead>tr>th:nth-child(' + (index + 1) + '), tbody>tr>td:nth-child(' + (index + 1) + '), tfoot>tr>td:nth-child(' + (index + 1) + ')'));
            }
        });


	// Dettach table from DOM. 
	var table_parent = table.parent();
	var table_next_sibling = table.next();
	table.detach();

	toHide.css('display', "none");
        toShow.css('display', "table-cell");

	// Reattach table to it's original position in the DOM.
	if (table_next_sibling.length) {
	    table.insertBefore(table_next_sibling);
	} else {		    
	    table.appendTo(table_parent);
	}

        table.trigger('resize');
    });
};
