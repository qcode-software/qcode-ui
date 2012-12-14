// dbField plugin - a field (editable or not) in a record set.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget( "qcode.dbField", {
	_getCreateOptions: function() {
	    return {
		saveType: coalesce(this.element.attr('saveType'), this.getRecord().dbRecord("option", "saveType"))
	    }
	},
	_create: function() {
	    if ( this.options.saveType === 'fieldOut' ) {
		this._on({
		    'dbFieldOut': function() {
			if ( this.getRecord().dbRecord('getState') === "dirty" ) {
			    this.getRecord().dbRecord('save');
			}
		    }
		});
	    }
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
	    if ( this.getType() == "htmlarea" ) {
		return this.element.html();
	    } else if ( this.element.is(':input') ) {
		return this.element.val();
	    } else {
		return this.element.text();
	    }
	}, 
	setValue: function(newValue){
	    // set the current value of this field
	    if ( this.getType() == "htmlarea" ) {
		this.element.html(newValue);
	    } else if ( this.element.is(':input') ) {
		this.element.val(newValue);
	    } else {
		this.element.text(newValue);
	    }
	}, 
	fieldIn: function(select){
	    // Begin editing this field 
	    // select can be one of "all", "start" or "end", and indicates the text range to select
	    var recordSet = this.getRecordSet();

	    recordSet.dbRecordSet('setCurrentField', this.element);
	    this.element.css('visibility', "hidden");

	    var fieldValue = this.getValue();

	    // Call the appropriate dbEditor plugin on the record set to show the editor over this field
	    this.editor('show', this.element, fieldValue);

	    // Optionally set the text selection
	    if (select) {
		this.editor('selectText', select);
	    } else if ( this.element.attr('fieldInSelect') != null ) {
		this.editor('selectText', this.element.attr('fieldInSelect'));
	    } else {
		this.editor('selectText', 'all');
	    }

	    this.element.trigger('dbFieldIn');
	}, 
	fieldOut: function(){
	    // Stop editing this field
	    var recordSet = this.getRecordSet();
	    var record = this.getRecord();
	    recordSet.dbRecordSet('setCurrentField', null);

	    var editorValue = this.editor('getValue');

	    if ( this.getValue() !== editorValue ) {
		record.dbRecord('setState', 'dirty');
	    }
	    this.write();
	    this.element.css('visibility', "inherit");

	    this.editor('hide');

	    this.element.trigger('dbFieldOut');
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
	editorKeyDown: function(event){
	    // Capture key down events propagated here by the editor
	    if ( event.altKey ) {
		return true;
	    }
	    var recordSet = this.getRecordSet();
	    var field = this.element;
	    var fields = recordSet.find('.editable');
	    switch (event.which) {
	    case 37: // left arrow
		recordSet.dbRecordSet('fieldChange', field.westOf(fields));
		break;
	    case 38: // up arrow
		recordSet.dbRecordSet('fieldChange', field.northOf(fields));
		break;
	    case 39: // right arrow
		recordSet.dbRecordSet('fieldChange', field.eastOf(fields));
		break;
	    case 40: // down arrow
		recordSet.dbRecordSet('fieldChange', field.southOf(fields));
		break;
	    case 9: // tab key 
		if ( event.shiftKey ) {
		    var newField = field.westOf(fields);
		} else {
		    var newField = field.eastOf(fields);
		}
		if ( newField == field ) {
		    // save if on last record 
		    this.getRecord().dbRecord('save');
		} else {
		    recordSet.dbRecordSet('fieldChange', newField);
		}
		break;
	    case 13: // return key
		var newField = field.eastOf(fields);
		if ( newField == field ) {
		    // save if on last record 
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
	editorKeyUp: function(event){
	    if ( this.getValue() !== this.editor('getValue') ) {
		// Set dirty
		this.getRecord().dbRecord('setState', 'dirty');
	    }
	}, 
	editorCut: function(){
	    // Set as dirty
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	editorPaste: function(){
	    // Set as dirty
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	editorBlur: function(){
	    // When the editor becomes blurred, move out.
	    this.fieldOut();
	}, 
	write: function(){
	    // Write the editor's contents to the field
	    this.setValue(this.editor('getValue'));
	},
	editor: function(method) {
	    var recordSet = this.getRecordSet(),
	    pluginName = this._getEditorPluginName();
	    return recordSet[pluginName].apply(recordSet, arguments);
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