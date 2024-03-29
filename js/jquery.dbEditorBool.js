// dbEditorBool plugin
// A hovering editor for boolean input
;(function($, window, undefined) {

    // css attributes to copy from the target element to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height', 'box-sizing'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorBool', {
	_create: function() {
	    // Constructor function - create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint,
                'cosmeticChange': function(event) {
                    if ( $(event.target).is(this.currentElement)
                         || jQuery.contains(event.target,this.currentElement)
                       ) {
                        this.repaint();
                    }
                }
	    });
	    this.editor = $('<div>')
		.attr('contentEditable',true)
		.addClass('db-editor boolean')
		.appendTo(this.element)
		.css({
		    'position': "absolute"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
            this.currentElement = $([]);
	},
        getCurrentElement: function() {
            return this.currentElement;
        },
	getValue: function() {
	    // Get the current value of the editor
	    return parseBoolean(this.editor.text());
	},
        setValue: function(newValue) {
            if ( parseBoolean(newValue) ) {
		this.setTrue();
            } else {
		this.setFalse();
            }
        },
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = $(element);
            this.currentElement.css('visibility', "hidden");
	    this.editor.show();
            this.setValue(value);
	    this.repaint();
	},
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	    this.currentElement.css('visibility', "inherit");
            this.currentElement = $([]);
	}, 
	repaint: function() {
	    // repaint the editor
	    if ( this.currentElement.length == 1 && this.editor.css('display') !== 'none' ) {
		var editor = this.editor;
		var element = this.currentElement;

		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

                if ( element.css('border-collapse') === "collapse" ) {
                    editor.css({
                        width: "+=" + (
                            ( parseInt(element.css('border-left-width'))
                              + parseInt(element.css('border-right-width'))
                            ) / 2
                        ),
                        height: "+=" + (
                            ( parseInt(element.css('border-top-width'))
                              + parseInt(element.css('border-bottom-width'))
                            ) / 2
                        ),
                    });
                }

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent'
		     || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}
		// position
		editor.css(element.positionRelativeTo(this.editor[0].offsetParent));
	    }
	},
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
                qcode.textRange.set(this.editor[0], "start", "start");
		break;
	    case "end":
                qcode.textRange.set(this.editor[0], "end", "end");
		break;
	    case "all":
                qcode.textRange.set(this.editor[0], "all");
		break;
	    }
	},
        getTextrange: function() {
            return qcode.textRange.get(this.editor[0]);
        },
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	setTrue: function() {
	    this.editor.html('<span class=true>Yes</span>');
            this.currentElement.trigger('editorValueChange');
	},
	setFalse: function() {
	    this.editor.html('<span class=false>No</span>');
            this.currentElement.trigger('editorValueChange');
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
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behaviour.
            var selection = qcode.textRange.get(this.editor[0]);

	    switch(e.which) {
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}
	    case 38: // up
	    case 37: // left
	    case 40: // down
	    case 39: // right
	    case 46: // delete 
	    case 13: // return
	    case 9: // tab 
		break;
	    
	    default: return true 
	    }

	    // propagate event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    this.currentElement.trigger(event);
            if ( event.isDefaultPrevented() ) {
	        e.preventDefault();
            }
	},
	_inputOnKeyUp: function(e) {
	     switch(e.which) {
	     case 97: // 1
	     case 49: // 1
	     case 84: // t
	     case 89: // y
		 this.setTrue();
		 break;
	     case 96: // 0
	     case 48: // 0
	     case 70: // f
	     case 78: // n
		 this.setFalse();
		 break; 
	     }

	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
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
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
	    if ( this.getValue() ) {
		this.setFalse();
	    } else {
		this.setTrue();
	    }

	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
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
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);
