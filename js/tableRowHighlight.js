function tableRowHighlight(oTable) {
    jQuery(oTable).children('tbody').on('click', 'tr', function(event) {
	var target_td = jQuery(event.target).closest("td");
	if ( jQuery(oTable).hasClass("db-grid") ) {
            if ( target_td.dbCell('isEditable') ) {
	        return;
            }
            if ( jQuery(this).dbRow('getState') === 'updating' ) {
                return;
            }
	}
	jQuery(this).toggleClass('highlight');
        $(event.target).trigger('toggleHighlight');
    }).on('dbRowStateChange', 'tr', function(event) {
        if ( jQuery(this).dbRow('getState') === 'updating' ) {
            jQuery(this).removeClass('highlight');
        }
    });
}