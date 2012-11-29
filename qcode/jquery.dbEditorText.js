// dbEditorText plugin
// A hovering editor for multi-line input (text)
;(function($, window, undefined){

    // css attributes to copy from target elements to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height'];

    $.widget( 'qcode.dbEditorText', {
	_create: function() {
	    this._on(window, {
		'resize': this._onResize.bind(this)
	    });
	    this.editor = $('<textarea>')
		.appendTo(this.element)
		.addClass('dbEditorText')
		.css({
		    'position': "absolute", 
		    'resize': "none", 
		    '-moz-box-sizing': "content-box", 
		    '-ms-box-sizing': "content-box", 
		    'box-sizing': "content-box", 
		    'overflow': "auto"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': inputOnKeyDown.bind(this),
		'keyup': inputOnKeyUp.bind(this),
		'cut': inputOnCut.bind(this),
		'paste': inputOnPaste.bind(this),
		'blur': inputOnBlur.bind(this)
	    });
	},
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
	    if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', element.css('backgroundColor'));
	    }

	    // Assumes that the editor's container is the target element's offset parent.
	    // (Note: I haven't yet figured out why the +1 height is needed to stop scrollbars from appearing)
	    editor
		.css({
		    'top': element.position().top + element.offsetParent().scrollTop(), 
		    'left': element.position().left + element.offsetParent().scrollLeft(), 
		    'height': "+=1", 
		    'padding-bottom': "-=1"
		})
		.show()
		.val(value)
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
		$.each(['width', 'height'], function(i, name){
		    editor.css(name, element.css(name));
		});

		// (Note: I haven't yet figured out why the +1 height is needed to stop scrollbars from appearing)
		editor.css({
		    'top': element.position().top + element.offsetParent().scrollTop(), 
		    'left': element.position().left + element.offsetParent().scrollLeft(), 
		    'height': "+=1"
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
	_inputOnBlur: function(e) {
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event(e.type, {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);