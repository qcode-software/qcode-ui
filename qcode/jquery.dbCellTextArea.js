(function($){
    function DbCellTextArea(container,cells,options) {
	cells.data('dbCellControl', this);
    }
    $.extend(DbCellTextArea.prototype, {
	pluginName: 'dbCellTextArea',
	show: function(cell,value){
	},
	selectText: function(cell,text) {
	},
	getValue: function(cell) {
	},
	hide: function(cell) {
	}
    });
    $.fn.dbCellTextArea = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('dbCellControl');
	if ( ! control ) {
	    control = target.data('dbCellTextArea');
	}
	if ( ! control ) {
	    var cells = arguments[0];
	    var options = arguments[1];
	    target.data('dbCellTextArea', new DbCellTextArea(target,cells,options));
	} else {
	    var method = arguments[0];
	    var args = [target].concat(Array.prototype.slice.call(arguments,1));
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method of dbCellTextArea');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);