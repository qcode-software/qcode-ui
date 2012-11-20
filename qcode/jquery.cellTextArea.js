(function($){
    var eventNamespace = '.cellControl.cellHTMLArea';
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight',
			  'width','height']
    function CellTextArea(container) {
	this.editor = $('<textarea>')
	    .appendTo(container)
	    .addClass('cellControl cellTextArea')
	    .css({
		'position': "absolute",
		'resize': "none",
		'-moz-box-sizing': "content-box",
		'-ms-box-sizing': "content-box",
		'box-sizing': "content-box",
		'overflow': "auto"
	    })
	    .hide()
	    .on('keydown' + eventNamespace, inputOnKeyDown.bind(this))
	    .on('keyup' + eventNamespace, inputOnKeyUp.bind(this))
	    .on('cut' + eventNamespace, inputOnCut.bind(this))
	    .on('paste' + eventNamespace, inputOnPaste.bind(this))
	    .on('blur' + eventNamespace, inputOnBlur.bind(this));
    }
    $.extend(CellTextArea.prototype, {
	getType: function() {
	    return 'textarea';
	},
	getValue: function() {
	    return this.editor.val();
	},
	show: function(cell,value){
	    //console.log("dbCellTextArea show " + cell.text());
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
		    'left': cell.position().left + cell.offsetParent().scrollLeft(),
		    'height': "+=1",
		    'padding-bottom': "-=1"
		})
		.show()
		.val(value)
		.focus();
	    //console.log("editor focus : " + editor.is(':focus'));
	    //console.log("/show");
	},
	hide: function(cell) {
	    //console.log("dbCellTextArea hide " + cell.text());
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	    //console.log("/hide");
	},
	selectText: function(cell,option) {
	    // TO DO - figure out if there's a way to do this
	},
	destroy: function() {
	    this.editor.remove();
	}
    });
    function inputOnKeyDown(e) {
	//console.log("dbCellTextArea onKeyDown " + e.which + " " + e.timeStamp + " " + e.target.nodeName);
	switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	case 83: //S
	    if ( ! e.ctrlKey ) break;
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
	}
	//console.log("/onKeyDown");
    }
    function inputOnKeyUp(e) {
	//console.log("dbCellTextArea keyUp " + e.which);
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
	//console.log("/keyUp");
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
    function inputOnBlur(e) {
	//console.log("dbCellTextArea onBlur " + e.timeStamp + " " + e.target.nodeName);
	if ( ! this.editor.is(':focus') ) {
            var event = jQuery.Event(e.type,{
		'data': e.data
            });
	    this.currentCell.trigger(event);
	}
	//console.log("/onBlur");
    }
    $.fn.cellTextArea = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('cellTextArea');
	if ( ! control ) {
	    target.data('cellTextArea', new CellTextArea(target));
	    var control = target.data('cellTextArea');
	}
	if ( arguments.length > 0 ) {
	    var method = arguments[0];
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,Array.prototype.slice.call(arguments,1));
	    } else {
		$.error('Invalid method of cellTextArea');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);