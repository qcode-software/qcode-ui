// enable and disable plugins. Enable or disable links, buttons, etc.
(function ($) {
    $.fn.disable = function () {
	return $(this).each(function () { 
	    switch($(this)[0].nodeName.toUpperCase()) {
	    case "A":
		jQuery.data($(this)[0],"href",$(this).attr("href"));
		$(this).removeAttr('href');
	    default:
		$(this).attr('disabled', 'disabled').addClass('disabled');
	    }
	});
    };
    $.fn.enable = function () {
	return $(this).each(function () { 
	    switch($(this)[0].nodeName.toUpperCase()) {
	    case "A":
		if ( typeof jQuery.data($(this)[0],"href")!="undefined" ) {
		    $(this).attr("href",jQuery.data($(this)[0],"href"));
		}
	    default:
		$(this).removeAttr('disabled').removeClass("disabled"); 
	    }
	});
    };
})(jQuery);