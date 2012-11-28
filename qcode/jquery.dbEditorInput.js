// dbEditorInput plugin
// A hovering editor for single-line input
(function($){

    // Namespace for event handlers
    var eventNamespace = '.dbEditorInput';

    // css attributes to copy from target elements to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height'];

    // class InputEditor
    // constructor function - takes container which the editor is to be appended to as an argument.
    function InputEditor(container) {
	$(window).on('resize' + eventNamespace, onResize.bind(this));
	this.editor = $('<input type="text">')
	    .addClass('dbEditorInput')
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

    // Public methods for class dbEditorInput
    $.extend(InputEditor.prototype, {
	getValue: function() {
	    return this.editor.val();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = element;
	    var editor = this.editor;

	    // Copy various style from the target element to the editor
	    $.each(copyAttributes, function(i, name){
		editor.css(name, element.css(name));
	    });

	    // Different browsers return different css for transparent elements
	    if ( element.css('backgroundColor') == 'transparent'
		 || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', element.css('backgroundColor'));
	    }

	    // Assumes that the editor's container is the target element's offset parent.
	    editor
		.css({
		    'top': element.position().top + element.offsetParent().scrollTop(), 
		    'left': element.position().left + element.offsetParent().scrollLeft()
		})
		.show()
		.val(value)
		.focus();
	}, 
	hide: function(element) {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	}, 
	selectText: function(element, option) {
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	destroy: function() {
	    this.editor.remove();
	}
    });

    // Private methods for class dbEditorInput
    function onResize(event) {
	// Any event that might change the size or position of the editor's target needs to trigger this.
	// It is bound to the window resize event, so triggering a resize event on any element should propagate up and trigger this
	if ( this.currentElement ) {
	    var element = this.currentElement;
	    var editor = this.editor;
	    $.each(['width', 'height'], function(i, name){
		editor.css(name, element.css(name));
	    });
	    editor.css({
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
	case 13: //return
	case 9: //tab
	case 38: //up
	case 40: //down
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    e.preventDefault();
	    this.currentElement.trigger(event);
	    break;
	}
    }
    function inputOnKeyUp(e) {
        var event = jQuery.Event(e.type, {
            'data': e.data, 
	    'ctrlKey': e.ctrlKey, 
	    'altKey': e.altKey, 
	    'shiftKey': e.shiftKey, 
            'which': e.which
        });
	this.currentElement.trigger(event);
    }
    function inputOnCut(e) {
        var event = jQuery.Event(e.type, {
            'data': e.data, 
	    'ctrlKey': e.ctrlKey, 
	    'altKey': e.altKey, 
	    'shiftKey': e.shiftKey, 
            'which': e.which
        });
	this.currentElement.trigger(event);
    }
    function inputOnPaste(e) {
        var event = jQuery.Event(e.type, {
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
            var event = jQuery.Event(e.type, {
		'data': e.data
            });
	    this.currentElement.trigger(event);
	}
    }

    // dbEditorInput plugin function
    $.fn.dbEditorInput = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('dbEditorInput');
	if ( ! control ) {
	    target.data('dbEditorInput', new InputEditor(target));
	    var control = target.data('dbEditorInput');
	}
	if ( arguments.length > 0 ) {
	    var method = arguments[0];
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control, Array.prototype.slice.call(arguments, 1));
	    } else {
		$.error('Invalid method ' + method + ' of dbEditorInput');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);