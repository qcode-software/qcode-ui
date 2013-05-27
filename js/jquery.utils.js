// Returns the first non-undefined argument
function coalesce() {
    for(var i = 0; i < arguments.length; i++){
	if ( typeof arguments[i] != "undefined" ) {
	    return arguments[i];
	}
    }
}

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

;(function($, undefined) {
    $.fn.hrefClick = function() {
        if ( this.length == 0 || this.attr('href') === undefined ) {
            return this;
        }
        if ( this.length > 1 || ( ! this.is('a')) ) {
            $.error('Invalid usage of hrefClick');
        }
        var clickEvent = jQuery.Event('click');
        this.trigger(clickEvent);
        if ( ! clickEvent.isDefaultPrevented() ) {
            window.location = this.attr('href');
        }
    }
})(jQuery);