// dbEditorText plugin
// A hovering editor for single-line input
;(function($, window, undefined) {

    // css attributes to copy from the target element to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorText', {
	_create: function() {
	    // Constructor function - create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this._onResize
	    });
	    this.editor = $('<input type="text">')
		.addClass('dbEditorText')
		.appendTo(this.element)
		.css({
		    'position': "absolute", 
		    'background': "white", 
		    'overflow': "visible", 
		    '-moz-box-sizing': "content-box", 
		    '-ms-box-sizing': "content-box", 
		    'box-sizing': "content-box", 
		    'z-index': 1
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.val();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value of the editor
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

	    editor
		.css(element.positionRelativeTo(this.element))
		.show()
		.val(value)
		.focus();
	}, 
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	}, 
	selectText: function(option) {
	    // Set the text selection / cursor position
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
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	_onResize: function(event) {
	    // Any event that might change the size or position of the editor's target needs to trigger this.
	    // It is bound to the window resize event, so triggering a resize event on any element should propagate up and trigger this.
	    // Ensures that the editor is still positioned correctly over the target element.
	    if ( this.currentElement ) {
		var element = this.currentElement;
		var editor = this.editor;
		$.each(['width', 'height'], function(i, name){
		    editor.css(name, element.css(name));
		});
		editor.css(element.positionRelativeTo(this.element));
	    }
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    //nb. This switch cascades; the lack of breaks is intentional
	    switch(e.which) {

	    case 37: // left
	    case 39: // right
		// On left or right key down, if you are at the end of the available text and there is no selection to collapse, pass the event to the target.
		// Otherwise, allow the cursor to move within the editor, or allow the current selection to collapse down to a cursor, as appropriate.
		var selection = this.editor.textrange('get');
		if ( e.which == 37 && ! ( selection.selectionText === "" && selection.selectionAtStart ) ) break;
		if ( e.which == 39 && ! ( selection.selectionText === "" && selection.selectionAtEnd ) ) break;

	    case 83: // S
		// Only Ctrl+S needs to be passed on; a regular "s" just uses browser defaults
		if ( e.which == 83 && ! e.ctrlKey ) break;

	    case 13: // return
	    case 9: // tab
	    case 38: // up
	    case 40: // down
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
	},
	_inputOnKeyUp: function(e) {
	    // Pass all key up events on to the target element.
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
	    // Pass all cut events on to the target element.
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
	    // Pass all paste events on to the target element.
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
	    // If handlers responding to an event that caused the editor to lose focus cause it to regain focus, don't pass the blur event on to the target element (especially since the current target has probably changed since then).
	    // Otherwise, pass blur events on to the target element.
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event(e.type, {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);