function tableRowHighlight(oTable) {
    jQuery(oTable).on('click', 'tr', function(event) {
	var target_td = jQuery(event.target).closest("td");
	if ( jQuery(oTable).hasClass("db-grid") && target_td.dbCell('isEditable') ) {
	    return; 
	}
	jQuery(this).toggleClass('highlight');
        $(event.target).trigger('toggleHighlight');
    });
}