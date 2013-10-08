function tableRowHighlight(oTable) {
    jQuery(oTable).children('tbody').on('click', 'tr', function(event) {
	var target_td = jQuery(event.target).closest("td");
	jQuery(this).toggleClass('highlight');
        $(event.target).trigger('toggleHighlight');
    });
}