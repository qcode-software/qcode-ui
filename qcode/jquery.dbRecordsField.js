// dbField plugin - a field (editable or not) in a record set.
;(function($, undefined){

    // Uses the jQuery UI widget factory
    $.widget( "qcode.dbField", {
	_create: function() {
	    // Constructor function. This widget uses a locking strategy to handle focus/blur events, which means there's probably room for improvement.
	    this.lockFocusEvents = false;
	},
	getRecordSet: function() {
	    // Get the record set element that contains this field
	    return this.element.closest('.recordSet');
	},
	getRecord: function(){
	    // get the record containing this field
	    return this.element.closest('.record');
	},
	getName: function() {
	    // Get the name of this field
	    return this.element.attr('name');
	},
	getValue: function(){
	    // get the current value of this field (may be different from the value held in the editor, if this field is currently being edited)
	    if ( this.getType() == "html" ) {
		return this.element.html();
	    } else if ( this.element.is(':input') ) {
		return this.element.val();
	    } else {
		return this.element.text();
	    }
	}, 
	setValue: function(newValue){
	    // set the current value of this field
	    if ( this.getType() == "html" ) {
		this.element.html(newValue);
	    } else if ( this.element.is(':input') ) {
		this.element.val(newValue);
	    } else {
		this.element.text(newValue);
	    }
	}, 
	fieldIn: function(newField, select){
	    // Begin editing this field - display the editor, make this the recordSet's current field, trigger a fieldIn event.
	    var recordSet = this.getRecordSet();

	    // Hiding this element triggers a blur event in IE, but we don't want it to respond to that
	    this.lockFocusEvents = true;

	    recordSet.dbRecordSet('setCurrentField', this.element);
	    this.element.css('visibility', "hidden");

	    var fieldValue = this.getValue();

	    // Call the appropriate dbEditor plugin on the record set to show the editor over this field
	    var plugin = this._getEditorPluginName();
	    recordSet[plugin]('show', this.element, fieldValue);

	    // Optionally set the text selection
	    if (select) {
		recordSet[plugin]('selectText', select);
	    } else if ( this.element.attr('fieldInSelect') != null ) {
		recordSet[plugin]('selectText', this.element.attr('fieldInSelect'));
	    } else {
		recordSet[plugin]('selectText', 'all');
	    }

	    this.element.trigger('dbFieldIn');
	    this.lockFocusEvents = false;
	}, 
	fieldOut: function(){
	    // Stop editing this field
	    this.lockFocusEvents = true;
	    var recordSet = this.getRecordSet();
	    var record = this.getRecord();
	    recordSet.dbRecordSet('setCurrentField', $([]));

	    // Get the name of the appropriate dbEditor plugin, so that it can be called on the record set container.
 	    var plugin = this._getEditorPluginName();

	    var editorValue = recordSet[plugin]('getValue');

	    if ( this.getValue() !== editorValue ) {
		record.dbRecord('setState', 'dirty');
	    }
	    this.write();
	    this.element.css('visibility', "inherit");

	    recordSet[plugin]('hide');

	    this.element.trigger('dbFieldOut');
	    this.lockFocusEvents = false;
	}, 
	getType: function(){
	    // Returns the field type (input, text, or html)
	    return coalesce(this.element.attr('type'), "text");
	}, 
	isEditable: function(){
	    // Returns true if the field is currently editable (ie. normally editable, and not updating)
	    return (this.element.is('.editable') && this.getRecord().dbRecord('getState') != "updating");
	}, 
	onMouseDown: function(event){
	    // Behavior for a mouse down event on this field - switch to this field if it's editable
	    if ( this.isEditable() ) {
		this.getRecordSet().dbRecordSet('fieldChange', this.element);
		event.preventDefault();
	    }
	}, 
	onKeyDown: function(event){
	    // nb. Normally only captures key down events propagated here by the editor, so defines behavior only for those events which the editor doesn't intercept.
	    if ( event.altKey ) {
		return true;
	    }
	    var recordSet = this.getRecordSet();
	    var field = this.element;
	    switch (event.which) {
	    case 37: // left arrow key pressed - move left
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveLeft', field));
		break;
	    case 38: // up arrow key pressed - move up
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveUp', field));
		break;
	    case 39: // right arrow key pressed - move right
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveRight', field));
		break;
	    case 40: // down arrow key pressed - move down
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveDown', field));
		break;
	    case 9: // tab key pressed - move right, or left on shift+tab, save if the end of the fields in this record set has been reached
		if ( event.shiftKey ) {
		    var newField = recordSet.dbRecordSet('moveLeft', field);
		} else {
		    var newField = recordSet.dbRecordSet('moveRight', field);
		}
		if ( newField == field ) {
		    this.getRecord().dbRecord('save');
		} else {
		    recordSet.dbRecordSet('fieldChange', newField);
		}
		break;
	    case 13: // return key pressed - move right, or save if the last field in this record set has been reached
		var newField = recordSet.dbRecordSet('moveRight', field);
		if ( newField == field ) {
		    this.getRecord().dbRecord('save');
		} else {
		    recordSet.dbRecordSet('fieldChange', newField);
		}
		break;
	    case 83: // Ctrl + S - save the current record.
		if ( event.ctrlKey ) {
		    this.getRecord().dbRecord('save');
		    event.preventDefault();
		}
		break;
	    }
	}, 
	onKeyUp: function(event){
	    // On key up, if the field's value has changed, mark as dirty.
	    var recordSet = this.getRecordSet();
 	    var plugin = this._getEditorPluginName();
	    var editorValue = recordSet[plugin]('getValue');
	    
	    if ( this.getValue() !== editorValue) {
		this.getRecord().dbRecord('setState', 'dirty');
	    }
	}, 
	onCut: function(){
	    // Cut and paste events should go to the editor, but will be passed on to here. Either will mean the field value has changed, so mark as dirty.
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	onPaste: function(){
	    // Cut and paste events should go to the editor, but will be passed on to here. Either will mean the field value has changed, so mark as dirty.
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	onBlur: function(){
	    // Blur may be triggered by fieldIn, depending on the browser. Locking prevents this issue, but probably isn't the best solution.
	    if ( ! this.lockFocusEvents ) {
		this.fieldOut();
		this.getRecord().dbRecord('recordOut');
	    }
	}, 
	write: function(){
	    // Write the current editor contents to the field
	    var recordSet = this.getRecordSet();
 	    var plugin = this._getEditorPluginName();
	    var editorValue = recordSet[plugin]('getValue');
	    this.setValue(editorValue);
	},
	_getEditorPluginName: function() {
	    // Returns the name of the appropriate plugin for editing this field
	    switch(this.getType()){
	    case "text":
		return "dbEditorText";
		break;
	    case "textarea":
		return "dbEditorTextArea";
		break;
	    case "htmlarea":
		return "dbEditorHTMLArea";
		break;
	    }
	}
    });
})(jQuery);