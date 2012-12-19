// Bug fix for table border width detection in ie9
(function($){
    if ( $.browser.msie && parseInt($.browser.version, 10) == "9" ) {
        var oldCssFunction = $.fn.css;
        $.fn.css = function() {
            if ( this.first().is('table') && arguments.length == 1 ) {
		var table = this.first();
                switch(arguments[0]){
                case "border-left-width":
		case "borderLeftWidth":
                    var totalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    this.css('border-left-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-left-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-right-width":
		case "borderRightWidth":
                    var totalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    this.css('border-right-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-right-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-top-width":
		case "borderTopWidth":
                    var totalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    this.css('border-top-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-top-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-bottom-width":
		case "borderBottomWidth":
                    var totalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    this.css('border-bottom-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-bottom-width', borderWidth);
                    return borderWidth + "px";
                    
                default:
                    return oldCssFunction.apply(this,arguments);
                }
            } else {
                return oldCssFunction.apply(this,arguments);
            }
        };
    }
    function getInnerWidth(table) {
        var borderSpacing = table.css('border-spacing');
        var horizontalSpacing = borderSpacing.split(' ').shift();
        return parseInt(table.find('tbody').outerWidth()) + (parseInt(horizontalSpacing) * 2);
    }
    function getInnerHeight(table) {
        var borderSpacing = table.css('border-spacing');
        var verticalSpacing = parseInt(borderSpacing.split(' ').pop());
        var totalHeight = verticalSpacing;
        table.find('thead, tbody, tfoot').each(function(){
            if ( $(this).css('position') != "absolute" ) {
                totalHeight += parseInt($(this).outerHeight()) + verticalSpacing;
            }
        });
        return totalHeight;
    }

    jQuery.expr[":"].focus = function( elem ) {
	var doc = elem.ownerDocument;
	return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex || elem.isContentEditable);
    }
})(jQuery);