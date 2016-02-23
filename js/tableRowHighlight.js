function tableRowHighlight(oTable) {
    jQuery(oTable).children('tbody').on('click', 'tr', function(event) {
	var target_td = jQuery(event.target).closest("td");
	jQuery(this).toggleClass('highlight');
        $(event.target).trigger('toggleHighlight');
    });
}

// Table row highlighter plugin
$.widget("qcode.tableRowHighlight", {
    options: {
	class: "highlight"
    },
    _create: function() {
	this._on(this.element, {
	    "click tbody td": function(event) {
		jQuery(event.target).closest("tr").toggleClass(this.options.class);
	    }
	});
    }
});