// dbEditorCombo plugin
// A hovering editor for with combo completion
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
    $.widget('qcode.dbEditorCombo', {
	_create: function() {
	    // Create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });

	    this.editor = $('<input type="text">')
		.addClass('dbEditorCombo')
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

	    this.comboOptions = $('<div>')
		.addClass('dbEditorComboOptions')
		.appendTo(this.element)
		.css({
		    'position':'absolute',
		    'overflow':'auto',
		    'z-index': 1
		})
		.hide();
	    this._on(this.comboOptions, {
		'mouseup div': this._comboOptionMouseUp,
		'mouseenter div': this._comboOptionMouseEnter
	    });

	    this.currentElement = $([]);
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.val();
	}, 
	show: function(element, value, searchURL){
	    // Show this editor positioned over the target element and set the value of the editor
	    this.currentElement = $(element);
	    this.editor.show().val(value);
	    this.lastValue = value;
	    this.searchURL = searchURL;
	    this.repaint();
	}, 
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor
		.add(this.comboOptions)
		.hide();
	},
	selectOption: function(index) {
	    // Select the option for this 0-based index
	    this.comboOptions.children('.selected').removeClass('selected');
	    this.comboOptions.children(':nth-child(' + (index + 1) + ')').addClass('selected');
	},
	repaint: function() {
	    // repaint the editor
	    if ( this.currentElement.length == 1 ) {
		var editor = this.editor;
		var comboOptions = this.comboOptions;
		var element = this.currentElement;

		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

		// Copy various style from the editor to combo options div
		var copyOptionsAttributes = ['backgroundColor', 'borderTopStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderRightStyle', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontSize', 'fontFamily', 'fontWeight', 'width'];
		$.each(copyOptionsAttributes, function(i, name){
		    comboOptions.css(name, editor.css(name));
		});
		var borderWidth = Math.max(
		    parseInt(editor.css('borderTopWidth')),
		    parseInt(editor.css('borderRightWidth')),
		    parseInt(editor.css('borderBottomWidth')),
		    parseInt(editor.css('borderLeftWidth'))
		) + 'px';
		comboOptions.css({
		    'borderTopWidth': borderWidth,
		    'borderRightWidth': borderWidth,
		    'borderBottomWidth': borderWidth,
		    'borderLeftWidth': borderWidth
		});
		    

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent'
		     || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor
			.add(comboOptions)
			.css('backgroundColor', "white");
		} else {
		    editor
			.add(comboOptions)
			.css('backgroundColor', element.css('backgroundColor'));
		}

		// position
		var position = element.positionRelativeTo(this.editor.offsetParent());
		editor.css({
			'left': position.left,
			'top': position.top
		});
		comboOptions.css({
		    'left': position.left - parseInt(comboOptions.css('border-left_width')),
		    'top': position.top + editor.outerHeight() - parseInt(comboOptions.css('border-top-width'))
		});
	    }
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
	search: function() {
	    // Server side search for available options
	    dbEditorCombo = this;
	    dbEditorCombo.comboOptions.show().text("Searching ...");
	    
	    jQuery.ajax({
		url: dbEditorCombo.searchURL,
		data: {
		    value: dbEditorCombo.getValue()
		},
		dataType: 'xml',
		async: false,
		cache: false,
		success: function(data) {
		    dbEditorCombo.searchReturn(data)
		},
		error: function(jqXHR, textStatus, errorThrown) {
		    dbEditorCombo.comboOptions.text("Software Bug ! " + textStatus + ': ' + errorThrown);
		}   
	    });
	},
	searchReturn: function(xmlDoc) {
	    // Populate comboOptions element with server response
	    var comboOptions = this.comboOptions;
	    comboOptions.empty();

	    var rec = jQuery('error:first', xmlDoc);
	    if ( rec.size() ) {
		// Error returned by Server
		comboOptions.text(rec.text());
	    } else {
		// Success
		var recs = jQuery('records > record > option', xmlDoc);
		if ( recs.size() ) {
		    // Matches Found
		    recs.each(function() {
			var comboOption = jQuery('<div>')
			    .text($(this).text())
			    .css({
				'width': '100%',
				'cursor': 'pointer'
			    })
			    .appendTo(comboOptions);
		    });
		    // selectOption first option
		    this.selectOption(0);
		} else {
		    // No Matches
		    comboOptions.text("No Matches");
		}
	    }
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = this.editor.textrange('get');

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
		if ( this.comboOptions.is(':visible') ) {
		    // navigate within comboOptions if it is visible
		    var index = this.comboOptions.children('.selected').prev().index();
		    if ( index !== -1 ) {
			this.selectOption(index);
		    }
		    return true
		}
	    case 40: // down
		if ( this.comboOptions.is(':visible') ) {
		    // navigate within comboOptions if it is visible
		    var index = this.comboOptions.children('.selected').next().index();
		    if ( index !== -1 ) {
			this.selectOption(index);
		    }
		    return true
		}
	    case 9: // tab 
	    case 13: // return
		if ( this.comboOptions.is(':visible') ) {
		    // Update editor with the selected comboOption
		    var option = this.comboOptions.children('.selected');
		    if ( option.index() !== -1 ) {
			this.editor.val(option.text());
			this.lastValue = option.text();
			// trigger keyup on editor to let it listeners know that it's value has changed
			this.editor.trigger('keyup');
			this.comboOptions.hide();
		    }
		}

	    case 46: // delete 
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
	    e.preventDefault();
	    this.currentElement.trigger(event);
	},
	_inputOnKeyUp: function(e) {
	    if ( this.getValue() !== this.lastValue ) {
		// Search for combo options		
		this.lastValue = this.getValue()
		this.search();
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
	},
	_comboOptionMouseUp: function(e) {
	    // Select the target option and update editor value
	    var option = $(e.currentTarget);
	    
	    this.selectOption(option.index());
	    this.editor.val(option.text());
	    this.lastValue = option.text();	   
	    this.selectText('end');
	    this.comboOptions.hide();
	    // trigger keyup on editor to let it listeners know that it's value has changed
	    this.editor.trigger('keyup');
	    return true
	},
	_comboOptionMouseEnter: function(e) {
	    // Select the target option
	    var option = $(e.currentTarget);
	    
	    this.selectOption(option.index());
	    return true
	},
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	    this.comboOptions.remove();
	}
    });
})(jQuery, window);