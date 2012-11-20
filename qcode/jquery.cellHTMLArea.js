(function($){
    var eventNamespace = '.cellControl.cellHTMLArea';
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight',
			  'width']
    function CellHTMLArea(container) {
	this.editor = $('<div>')
	    .attr('contentEditable', true)
	    .addClass('cellControl cellHTMLArea')
	    .appendTo(container)
	    .css({
		'position': "absolute"
	    })
	    .hide()
	    .on('keydown' + eventNamespace, inputOnKeyDown.bind(this))
	    .on('keyup' + eventNamespace, inputOnKeyUp.bind(this))
	    .on('cut' + eventNamespace, inputOnCut.bind(this))
	    .on('paste' + eventNamespace, inputOnPaste.bind(this))
	    .on('blur' + eventNamespace, inputOnBlur.bind(this));
    }
    $.extend(CellHTMLArea.prototype, {
	getType: function() {
	    return 'htmlarea';
	},
	getValue: function() {
	    return this.editor.html();
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
		.height((typeof cell.data('editorHeight') == "undefined") ? cell.height() : cell.data('editorHeight'))
		.css({
		    'top': cell.position().top + cell.offsetParent().scrollTop(),
		    'left': cell.position().left + cell.offsetParent().scrollLeft()
		})
		.show()
		.html(value)
		.focus();
	},
	hide: function(cell) {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	selectText: function(cell,text) {
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
    $.fn.cellHTMLArea = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('cellHTMLArea');
	if ( ! control ) {
	    target.data('cellHTMLArea', new CellHTMLArea(target));
	    var control = target.data('cellHTMLArea');
	}
	if ( arguments.length > 0 ) {
	    var method = arguments[0];
	    var args = Array.prototype.slice.call(arguments,1);
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method of cellHTMLArea');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);