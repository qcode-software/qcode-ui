// Show and/or hide selected columns of tables
// showHide is an optional string "show" or "hide", if undefined selected columns will toggle visibility
;(function($, undefined) {
    $.fn.columnsShowHide = function(column_selector, showHide) {
        $(this).each(function() {
	    var table = jQuery(this);
            var css = {}

            table.find(column_selector).each(function() {
                var column = jQuery(this);
                var index = column.index();
                var nth = ':nth-child(' + (index+1) + ')';
                if ( (showHide === "hide") || (showHide === undefined && column.css('display') === "table-column") ) {
                    css['col' + nth] = {display: "none"};
                    css['tr>*' + nth] = {display: "none"};
                } else {
                    css['col' + nth] = {display: "table-column"};
                    css['tr>*' + nth] = {display: "table-cell"};
                }
            });

            table.scopedCSS(css);
            table.trigger('resize');
        });
    };
})(jQuery);