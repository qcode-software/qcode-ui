;(function(undefined) {
    jQuery.fn.columns_show_hide = function(column_selector, showHide) {
        jQuery(this).each(function() {
	    var table = jQuery(this);
            var cellsToShow = $([]);
            var colsToShow = $([]);
            var toHide = $([]);

	    jQuery(column_selector, table).each(function() {
                var column = jQuery(this);
                var index = column.index();
                var firstCell = table.find('tbody>tr:first-child>td').eq(index);
                var cells = table.find('thead>tr>th:nth-child(' + (index + 1) + '), tbody>tr>td:nth-child(' + (index + 1) + '), tfoot>tr>td:nth-child(' + (index + 1) + ')');

                if ( (showHide === "hide") || (showHide === undefined && firstCell.is(':visible')) ) {
                    toHide = toHide.add(cells);
                    toHide = toHide.add(column);
                } else if (showHide === undefined || showHide === "show") {
                    cellsToShow = cellsToShow.add(cells);
                    colsToShow = colsToShow.add(column);
                }
            });


	    // Dettach table from DOM. 
	    var table_parent = table.parent();
	    var table_next_sibling = table.next();
	    table.detach();

	    toHide.css('display', "none");
            colsToShow.css('display', "table-row");
            cellsToShow.css('display', "table-cell");

	    // Reattach table to it's original position in the DOM.
	    if (table_next_sibling.length) {
	        table.insertBefore(table_next_sibling);
	    } else {		    
	        table.appendTo(table_parent);
	    }

            table.trigger('resize');
        });
    };
})();