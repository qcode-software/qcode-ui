function tableRowHighlight(oTable) {
    jQuery(oTable).children('tbody').on('click', 'tr', function(event) {
	var target_td = jQuery(event.target).closest("td");
	jQuery(this).toggleClass('highlight');
        $(event.target).trigger('toggleHighlight');
    });
}

// Table row highlighter plugin
(function($) {
    $.fn.tableRowHighlight = function(options) {
	var settings = $.extend({}, {
	    "class": 'highlight'
	}, options);

	$(this).on('click', 'tbody td', function(event) {
	    $(this).closest("tr").toggleClass(settings["class"]);
	});
    };
}(jQuery));
