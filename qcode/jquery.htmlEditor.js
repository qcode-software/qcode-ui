(function($){
    var eventNamespace = 'htmlEditor';
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight',
			  'width'];
    function HTMLEditor(container) {
	$(window).on('resize' + eventNamespace, onResize.bind(this));
	this.editor = $('<div>')
	    .attr('contentEditable', true)
	    .addClass('htmlEditor')
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
    $.extend(HTMLEditor.prototype, {
	getType: function() {
	    return 'html';
	},
	getValue: function() {
	    return this.editor.html();
	},
	show: function(element,value){
	    this.currentElement = element;
	    var editor = this.editor;
	    $.each(copyAttributes, function(i,name){
		editor.css(name,element.css(name));
	    });
	    if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', element.css('backgroundColor'));
	    }
	    editor
		.height((typeof element.data('editorHeight') == "undefined") ? element.height() : element.data('editorHeight'))
		.css({
		    'top': element.position().top + element.offsetParent().scrollTop(),
		    'left': element.position().left + element.offsetParent().scrollLeft()
		})
		.show()
		.html(value)
		.focus();
	},
	hide: function(element) {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	selectText: function(element,option) {
	    switch(option) {
	    case "start":
		this.editor.textrange('set',"start","start");
		break;
	    case "end":
		this.editor.textrange('set',"end","end");
		break;
	    case "all":
		this.editor.textrange('set',"all");
		break;
	    }
	},
	destroy: function() {
	    this.editor.remove();
	}
    });
    function onResize(event) {
	if ( this.currentElement ) {
	    var element = this.currentElement;
	    var editor = this.editor;
	    editor
		.height((typeof element.data('editorHeight') == "undefined") ? element.height() : element.data('editorHeight'))
		.css({
		    'width': element.css('width'),
		    'top': element.position().top + element.offsetParent().scrollTop(),
		    'left': element.position().left + element.offsetParent().scrollLeft()
		});
	}
    }
    function inputOnKeyDown(e) {
	switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	case 37: // left
	case 39: //right
	    var selection = this.editor.textrange('get');
	    if ( e.which == 37 && ! ( selection.selectionText === "" && selection.selectionAtStart ) ) break;
	    if ( e.which == 39 && ! ( selection.selectionText === "" && selection.selectionAtEnd ) ) break;
	case 83: //S
	    if ( e.which == 83 && ! e.ctrlKey ) break;
	case 9: //tab
	case 38: //up
	case 40: //down
            var event = jQuery.Event(e.type,{
		'data': e.data,
		'ctrlKey': e.ctrlKey,
		'altKey': e.altKey,
		'shiftKey': e.shiftKey,
		'which': e.which
            });
	    e.preventDefault();
	    this.currentElement.trigger(event);
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
	this.currentElement.trigger(event);
    }
    function inputOnCut(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentElement.trigger(event);
    }
    function inputOnPaste(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentElement.trigger(event);
    }
    function inputOnBlur(e, source) {
	if ( ! this.editor.is(':focus') ) {
            var event = jQuery.Event(e.type,{
		'data': e.data
            });
	    this.currentElement.trigger(event);
	}
    }
    $.fn.htmlEditor = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('htmlEditor');
	if ( ! control ) {
	    target.data('htmlEditor', new HTMLEditor(target));
	    var control = target.data('htmlEditor');
	}
	if ( arguments.length > 0 ) {
	    var method = arguments[0];
	    var args = Array.prototype.slice.call(arguments,1);
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method of htmlEditor');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);