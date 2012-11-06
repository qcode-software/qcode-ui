(function($){
    var eventNamespace = '.dbCellControl.dbCellInput';
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight']
    function DbCellInput(container,cells,options) {
	cells.data('dbCellControl', this);
	this.input = $('<input type="text">')
	    .appendTo(container)
	    .css({
		'position': "absolute",
		'visibility': "hidden",
		'background': "white",
		'overflow': "visible",
		'z-index': 1
	    })
	    .on('keydown' + eventNamespace, inputOnKeyDown.bind(this))
	    .on('keyup' + eventNamespace, inputOnKeyUp.bind(this))
	    .on('cut' + eventNamespace, inputOnCut.bind(this))
	    .on('paste' + eventNamespace, inputOnBlur.bind(this));
    }
    $.extend(DbCellInput.prototype, {
	pluginName: 'dbCellInput',
	getType: function() {
	    return 'text';
	},
	getValue: function() {
	    return this.input.val();
	},
	show: function(cell,value){
	    var input = this.input;
	    $.each(copyAttributes, function(i,name){
		input.css(name,cell.css(name));
	    });
	    if ( cell.css('backgroundColor') == 'transparent' ) {
		input.css('backgroundColor', "white");
	    } else {
		input.css('backgroundColor', cell.css('backgroundColor'));
	    }
	    input.width(cell.innerWidth());
	    input.height(cell.innerHeight());
	    input.css('top', cell.position().top + 2);
	    input.css('left', cell.position().left + 2);
	    input.css('visibility', "visible");
	    input.val(value);
	},
	hide: function(cell) {
	},
	selectText: function(cell,option) {
	},
	destroy: function() {
	}
    });
    $.fn.dbCellInput = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('dbCellControl');
	if ( ! control ) {
	    control = target.data('dbCellInput');
	}
	if ( ! control ) {
	    var cells = arguments[0];
	    var options = arguments[1];
	    target.data('dbCellInput', new DbCellInput(target,cells,options));
	} else {
	    var method = arguments[0];
	    var args = [target].concat(Array.prototype.slice.call(arguments,1));
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method of dbCellInput');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);