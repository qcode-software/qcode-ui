;(function($, undefined){
$.widget( "qcode.dbField", {
	_create: function(){
	    this.lockFocusEvents = false;
	},
	getRecordSet: function(){
	    return this.element.closest('.recordSet');
	}, 
	getName: function() {
	    return this.element.attr('name');
	}, 
	getRecord: function(){
	    // get the record containing this field
	    return this.element.closest('.record');
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
	    this.lockFocusEvents = true;
	    recordSet.dbRecordSet('setCurrentField', this.element);
	    this.element.css('visibility', "hidden");

	    var fieldValue = this.getValue();

	    var plugin = this._getEditorPluginName();
	    recordSet[plugin]('show', this.element, fieldValue);

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
	    return this.element.attr('type');
	}, 
	isEditable: function(){
	    // Returns true if the field is currently editable (ie. not updating)
	    return (this.element.is('.editable') && this.getRecord().dbRecord('getState') != "updating");
	}, 
	onMouseDown: function(event){
	    if ( this.isEditable() ) {
		this.getRecordSet().dbRecordSet('fieldChange', this.element);
		event.preventDefault();
	    }
	}, 
	onKeyDown: function(event){
	    // nb. Normally only captures key up events propagated here by the editor
	    if ( event.altKey ) {
		return true;
	    }
	    var recordSet = this.getRecordSet();
	    var field = this.element;
	    switch (event.which) {
	    case 37: //left
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveLeft', field));
		break;
	    case 38: //up
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveUp', field));
		break;
	    case 39: //right
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveRight', field));
		break;
	    case 40: //down
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveDown', field));
		break;
	    case 9: //tab
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
	    case 13: //return
		var newField = recordSet.dbRecordSet('moveRight', field);
		if ( newField == field ) {
		    this.getRecord().dbRecord('save');
		} else {
		    recordSet.dbRecordSet('fieldChange', newField);
		}
		break;
	    case 83: //ctrl + s
		if ( event.ctrlKey ) {
		    this.getRecord().dbRecord('save');
		    event.preventDefault();
		}
		break;
	    }
	}, 
	onKeyUp: function(event){
	    // Get the current editor value
	    var recordSet = this.getRecordSet();
 	    var plugin = this._getEditorPluginName();
	    var editorValue = recordSet[plugin]('getValue');
	    
	    if ( this.getValue() !== editorValue) {
		this.getRecord().dbRecord('setState', 'dirty');
	    }
	}, 
	onCut: function(){
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	onPaste: function(){
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	onBlur: function(){
	    // Blur may be triggered by fieldIn, depending on the browser. Locking prevents this issue.
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
		return "dbEditorInput";
		break;
	    case "textarea":
		return "dbEditorText";
		break;
	    case "htmlarea":
		return "dbEditorHTML";
		break;
	    }
	}
    });
})(jQuery);