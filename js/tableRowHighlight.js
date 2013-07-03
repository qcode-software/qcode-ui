function tableRowHighlight(oTable) {
    jQuery(oTable).find("tr").click(function(event) {
	var target_td = jQuery(event.target).closest("td")[0];
	if ( jQuery(oTable).is(".db-grid") && oTable.isCellEditable(target_td) ) {
	    return; 
	}
	jQuery(this).toggleClass('highlight');
    });
}