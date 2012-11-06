(function($){
    function DbCellHTMLArea(container,cells,options) {
	cells.data('dbCellControl', this);
    }
    $.extend(DbCellHTMLArea.prototype, {
	pluginName: 'dbCellHTMLArea',
	show: function(cell,value){
	},
	selectText: function(cell,text) {
	},
	getValue: function(cell) {
	},
	hide: function(cell) {
	}
    });
    $.fn.dbCellHTMLArea = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('dbCellControl');
	if ( ! control ) {
	    control = target.data('dbCellHTMLArea');
	}
	if ( ! control ) {
	    var cells = arguments[0];
	    var options = arguments[1];
	    target.data('dbCellHTMLArea', new DbCellHTMLArea(target,cells,options));
	} else {
	    var method = arguments[0];
	    var args = [target].concat(Array.prototype.slice.call(arguments,1));
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method of dbCellHTMLArea');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);