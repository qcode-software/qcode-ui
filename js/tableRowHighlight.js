function tableRowHighlight(oTable) {
    jQuery(oTable).on('click', 'tr', function(event) {
	var target_td = jQuery(event.target).closest("td");
	if ( jQuery(oTable).is(".clsDbGrid, .clsDbFlexGrid") && target_td.dbCell('isEditable') ) {
	    return; 
	}
	jQuery(this).toggleClass('clsHighlight');
        $(event.target).trigger('toggleHighlight');
    });
}