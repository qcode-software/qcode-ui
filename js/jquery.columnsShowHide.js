// Show and/or hide selected columns of tables
// showHide is an optional string "show" or "hide", if undefined selected columns will toggle visibility
;(function($, undefined) {
    $.fn.columnsShowHide = function(column_selector, showHide) {
        $(this).each(function() {
	    var table = jQuery(this);
            var cellsToShow = $([]);
            var colsToShow = $([]);
            var toHide = $([]);

	    table.find(column_selector).each(function() {
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

	    // Detach table from DOM for performance gain.
	    table.runDetached(function() {
	        toHide.css('display', "none");
                colsToShow.css('display', "table-column");
                cellsToShow.css('display', "table-cell");
            });

            table.trigger('resize');
        });
    };
})(jQuery);