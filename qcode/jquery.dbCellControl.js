(function($){
    $.fn.dbCellControl = function() {
	var returnValue;
	var target = $(this);
	if ( ! target.data('dbCellControl')){
	    $.error('dbCellControl is abstract and must be initialized with another plugin');
	} else {
	    var control = target.data('dbCellControl');
	    returnValue = target[control.pluginName].apply(target,arguments);
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);