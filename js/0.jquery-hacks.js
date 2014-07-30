(function($){
    jQuery.expr[":"].focus = function( elem ) {
	var doc = elem.ownerDocument;
	return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex || elem.isContentEditable);
    }
})(jQuery);