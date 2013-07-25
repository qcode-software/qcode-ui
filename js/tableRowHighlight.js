function tableRowHighlight(oTable) {
    jQuery(oTable).find("tr").click(function(event) {
	var target_td = jQuery(event.target).closest("td")[0];
	if ( jQuery(oTable).hasClass("db-grid") && jQuery(target_td).dbCell('isEditable') ) {
	    return; 
	}
	jQuery(this).toggleClass('highlight');
    });
}