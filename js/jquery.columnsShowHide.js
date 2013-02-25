jQuery.fn.columnsShowHide = function(column_selector, showOrHide) {
    // Show or hide table columns. Call on the table, with a selector for the columns.
    // showOrHide is optional and takes either "show" or "hide", by default each column will toggle visibility
    jQuery(this).each(function() {
	var table = jQuery(this);
        var show_cols = $([]);
        var hide_cols = $([]);

        if (showOrHide === "show") {
	    show_cols = table.find(column_selector);            
        } else if (showOrHide === "hide") {
	    hide_cols = table.find(column_selector);
        } else {
	    hide_cols = table.find(column_selector).filter(":visible");
	    show_cols = table.find(column_selector).filter(":hidden");
        }
	
	// Dettach table from DOM. 
	var table_parent = table.parent();
	var table_next_sibling = table.next();
	table.detach();
	
	// show/hide columns ( >10 x faster operatoing on a detached DOM elements) 
	hide_cols.hide(); 
	show_cols.show(); 
	
	
	// Reattach table to it's original position in the DOM.
	if (table_next_sibling.length) {
	    table.insertBefore(table_next_sibling);
	} else {		    
	    table.appendTo(table_parent);
	}
    });
};
