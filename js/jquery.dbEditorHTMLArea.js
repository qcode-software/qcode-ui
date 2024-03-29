// dbEditorHTMLArea plugin
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
			  'width', 'box-sizing'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorHTMLArea', {
        options: {
	    tab_on_return: false
	},
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
		.attr('contentEditable', true)
		.addClass('db-editor html-area')
		.appendTo(this.element)
		.css({
		    'overflow': "auto",
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
	    return this.editor.html();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = $(element);
            this.currentElement.css('visibility', "hidden");
	    this.editor.show();
	    this.repaint();
	    this.editor.html(value);
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
	    if ( this.currentElement.length == 1 && this.editor.css('display') !== 'none' ) {
		// Copy various style from the target element to the editor
		var editor = this.editor;
		var element = this.currentElement;
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});
		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}

		editor
		    .height((typeof element.data('editorHeight') == "undefined") ? element.height() : element.data('editorHeight'))
		    .css(element.positionRelativeTo(this.editor[0].offsetParent));

                if ( element.css('border-collapse') === "collapse" ) {
                    editor.css({
                        width: "+=" + (
                            ( parseInt(element.css('border-left-width'))
                              + parseInt(element.css('border-right-width'))
                            ) / 2
                        )
                    });
                    if ( typeof element.data('editorHeight') == "undefined" ) {
                        editor.css({
                            height: "+=" + (
                                ( parseInt(element.css('border-top-width'))
                                  + parseInt(element.css('border-bottom-width'))
                                ) / 2
                            ),
                        });
                    }
                }

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
	    case 38: // up
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}
	    case 40: // down
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

	    case 46: // delete 
		break;

	    case 13: // return
                if (e.shiftKey) {
	            return true;
                }
		if ( this.option('tab_on_return') || (selection.selectionAtStart && selection.selectionAtEnd) ) {
		    break;
		}
                // Normalize the effect of the enter key to make browsers behave consistently
	        var selection = window.getSelection();

                if ( document.queryCommandSupported('insertLineBreak') ) {
	            // Webkit
                    document.execCommand('insertLineBreak');
                    e.preventDefault();
                } else if ( document.queryCommandSupported('insertBrOnReturn') ) {
	            // Firefox only
                    document.execCommand('insertBrOnReturn');
                } else if (selection && selection.rangeCount > 0) {
	            // IE Standards
	            var range = selection.getRangeAt(0);
	            var brNode1 = jQuery('<br>').get(0);
	    	    
                    range.deleteContents();
	            range.insertNode(brNode1);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    e.preventDefault();
	        }
                return true;

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
            var selection = qcode.textRange.get(this.editor[0]);
            if ( (e.which == 13 // return key
                  && ( ! e.shiftKey)
                  && ( ! this.option('tab_on_return'))
                  && ( ! (selection.selectionAtStart && selection.selectionAtEnd) )
                 )
                 || isEditingKeyEvent(e)
               ) {
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
