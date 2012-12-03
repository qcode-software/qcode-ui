// dbEditorHTML plugin
// A hovering editor for multi-line input with a contentEditable div to allow html markup
;(function($, window, undefined){

    // css attributes to copy from target elements to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width'];

    $.widget('qcode.dbEditorHTML', {
	_create: function() {
	    this._on(window, {
		'resize': this._onResize.bind(this)
	    });
	    this.editor = $('<div>')
		.attr('contentEditable', true)
		.addClass('dbEditorHTML')
		.appendTo(this.element)
		.css({
		    'position': "absolute"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown.bind(this),
		'keyup': this._inputOnKeyUp.bind(this),
		'cut': this._inputOnCut.bind(this),
		'paste': this._inputOnPaste.bind(this),
		'blur': this._inputOnBlur.bind(this)
	    });
	},
	getValue: function() {
	    return this.editor.html();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = element;
	    var editor = this.editor;

	    // Copy various style from the target element to the editor
	    $.each(copyAttributes, function(i, name){
		editor.css(name, element.css(name));
	    });
	    if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', element.css('backgroundColor'));
	    }

	    // Different browsers return different css for transparent elements
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
	hide: function() {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	}, 
	selectText: function(option) {
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
	},
	_onResize: function(event) {
	    // Any event that might change the size or position of the editor's target needs to trigger this.
	    // It is bound to the window resize event, so triggering a resize event on any element should propagate up and trigger this
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
	},
	_inputOnKeyDown: function(e) {
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
		var event = jQuery.Event(e.type, {
		    'data': e.data, 
		    'ctrlKey': e.ctrlKey, 
		    'altKey': e.altKey, 
		    'shiftKey': e.shiftKey, 
		    'which': e.which
		});
		e.preventDefault();
		this.currentElement.trigger(event);
	    }
	},
	_inputOnKeyUp: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e, source) {
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event(e.type, {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);