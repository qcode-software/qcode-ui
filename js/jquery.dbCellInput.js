(function($){
    var eventNamespace = '.dbCellControl.dbCellInput';
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight',
			  'width','height']
    function DbCellInput(container,cells) {
	cells.data('dbCellControl', this);
	this.editor = $('<input type="text">')
	    .addClass('dbCellControl dbCellInput')
	    .appendTo(container)
	    .css({
		'position': "absolute",
		'background': "white",
		'overflow': "visible",
		'-moz-box-sizing': "content-box",
		'-ms-box-sizing': "content-box",
		'box-sizing': "content-box",
		'z-index': 1
	    })
	    .hide()
	    .on('keydown' + eventNamespace, inputOnKeyDown.bind(this))
	    .on('keyup' + eventNamespace, inputOnKeyUp.bind(this))
	    .on('cut' + eventNamespace, inputOnCut.bind(this))
	    .on('paste' + eventNamespace, inputOnPaste.bind(this))
	    .on('blur' + eventNamespace, inputOnBlur.bind(this));
    }
    $.extend(DbCellInput.prototype, {
	pluginName: 'dbCellInput',
	add: function(container,cells) {
	    cells.data('dbCellControl', this);
	},
	remove: function(cells) {
	    cells.removeData('dbCellControl');
	},
	getType: function() {
	    return 'text';
	},
	getValue: function() {
	    return this.editor.val();
	},
	show: function(cell,value){
	    this.currentCell = cell;
	    var editor = this.editor;
	    $.each(copyAttributes, function(i,name){
		editor.css(name,cell.css(name));
	    });
	    if ( cell.css('backgroundColor') == 'transparent' || cell.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', cell.css('backgroundColor'));
	    }
	    editor
		.css({
		    'top': cell.position().top + cell.offsetParent().scrollTop(),
		    'left': cell.position().left + cell.offsetParent().scrollLeft()
		})
		.show()
		.val(value)
		.focus();
	},
	hide: function(cell) {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	selectText: function(cell,option) {
	    // TO DO - figure out if there's a way to do this
	},
	destroy: function() {
	    this.editor.remove();
	}
    });
    function inputOnKeyDown(e) {
	switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	case 83: //S
	    if ( ! e.ctrlKey ) break;
	case 13: //return
	case 9: //tab
	    e.preventDefault();
	case 38: //up
	case 40: //down
            var event = jQuery.Event(e.type,{
		'data': e.data,
		'ctrlKey': e.ctrlKey,
		'altKey': e.altKey,
		'shiftKey': e.shiftKey,
		'which': e.which
            });
	    this.currentCell.trigger(event);
	    break;
	}
    }
    function inputOnKeyUp(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnCut(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnPaste(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnBlur(e, source) {
	if ( ! this.editor.is(':focus') ) {
            var event = jQuery.Event(e.type,{
		'data': e.data
            });
	    this.currentCell.trigger(event);
	}
    }
    $.fn.dbCellInput = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('dbCellControl');
	if ( ! control ) {
	    control = target.data('dbCellInput');
	}
	if ( arguments[0] === 'isInitialized' ) {
	    return Boolean(control);
	}
	if ( ! control ) {
	    var cells = arguments[0];
	    var options = arguments[1];
	    target.data('dbCellInput', new DbCellInput(target,cells,options));
	} else {
	    if ( control.pluginName !== 'dbCellInput' ) {
		$.error('Cannot apply dbCellInput - element has another control already');
	    }
	    var method = arguments[0];
	    if ( typeof control[method] == "function" ) {
		var args = [target].concat(Array.prototype.slice.call(arguments,1));
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method ' + method + ' of dbCellInput');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);