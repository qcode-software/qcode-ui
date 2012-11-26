(function($){
    $.fn.borderCollapse = function(){
	var tables = $(this).filter('table').filter(function(){return $(this).css('border-collapse') == "collapse";});
	tables.each(function(i, element) {
	    var table = $(element);
	    table.css({
		'border-collapse': "separate",
		'border-spacing': 0
	    });
	    var rows = $(table).find('tr:visible');
	    if ( parseInt(table.css('border-top-width')) > 0 ) {
		rows.eq(0).find('th, td').filter(':visible').css('border-top-width', 0);
	    }
	    if ( parseInt(table.css('border-left-width')) > 0 ) {
		rows.each(function(j, element) {
		    var row = $(element);
		    row.find('th, td').filter(':visible').eq(0).css('border-left-width', 0);
		});
	    }
	    if ( parseInt(table.css('border-right-width')) > 0 ) {
		rows.each(function(j, element) {
		    var row = $(element);
		    row.find('th, td').filter(':visible').eq(-1).css('border-right-width', 0);
		});
	    }
	    if ( parseInt(table.css('border-bottom-width')) > 0 ) {
		rows.eq(-1).find('th, td').filter(':visible').css('border-bottom-width', 0);
	    }
	    rows.each(function(i, element){
		var row = $(element);
		var cells = row.find('td, th').filter(':visible');
		cells.not(cells.eq(0)).css('border-left-width', 0);
	    });
	    rows.not(rows.eq(0)).find('th, td').css('border-top-width', 0);
	});
	
    }
})(jQuery);

$(function(){
    $('table:not(:has(tfoot))').css('border-bottom-width', 0);
});