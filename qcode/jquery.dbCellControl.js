(function($){
    $.fn.dbCellControl = function() {
	var target = $(this);
	if ( ! target.data('dbCellControl')){
	    $.error('dbCellControl is abstract and must be initialized with another plugin');
	} else {
	    var control = target.data('dbCellControl');
	    target[control.pluginName].apply(target,arguments);
	}
    }
})(jQuery);