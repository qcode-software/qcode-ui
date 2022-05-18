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
			  'width', 'height', 'box-sizing'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorText', {
	_create: function() {
	    // Create the editor element, and bind event listeners.
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
	    this.editor = $('<input type="text">')
		.addClass('db-editor text')
		.appendTo(this.element)
		.css({
		    'position': "absolute", 
		    'background': "white", 
		    'overflow': "visible",
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
	    this.currentElement = $([]);
	},
        getCurrentElement: function() {
            return this.currentElement;
        },
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.val();
	},
        setValue: function(newValue) {
            this.editor.val(newValue);
        },
	show: function(element, value){
	    // Show this editor positioned over the target element and set the value of the editor
	    this.currentElement = $(element).first();
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
	    if ( this.currentElement.length == 1 ) {
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
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = qcode.textRange.get(this.editor[0]);

	    switch(e.which) {
	  
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}	   
	    case 39: // right
		if ( selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}
	    case 38: // up
	    case 40: // down
	    case 46: // delete 
	    case 13: // return
	    case 9: // tab 
		break;

	    default: return true 
	    }

	    // propagate custom event to target element
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
            if ( isEditingKeyEvent(e) ) {
                this.currentElement.trigger('editorValueChange');
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
            this.currentElement.trigger('editorValueChange');
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
            this.currentElement.trigger('editorValueChange');
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
	    if ( ! this.editor.is(':focus') ) {
		// really is blurred
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);
