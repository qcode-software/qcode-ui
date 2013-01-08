// dbField plugin - a field in a dbRecord.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget( "qcode.dbField", {
	_create: function() {
	    // saveType
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType, this.getRecord().dbRecord("option", "saveType"))
	    
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
	    return this.element.closest('.recordSet');
	},
	getRecord: function(){
	    return this.element.closest('.record');
	},
	getName: function() {
	    return this.element.attr('name');
	},
	getValue: function(){
	    if ( this.getType() == "htmlarea" ) {
		return this.element.html();
	    } else if ( this.element.is(':input') ) {
		return this.element.val();
	    } else {
		return this.element.text();
	    }
	}, 
	setValue: function(newValue){
	    if ( this.getType() == "htmlarea" ) {
		this.element.html(newValue);
	    } else if ( this.element.is(':input') ) {
		this.element.val(newValue);
	    } else {
		this.element.text(newValue);
	    }
	}, 
	fieldIn: function(select){
	    // Show the editor on this field
	    // select can be one of "all", "start" or "end", and indicates the text range to select
	    var recordSet = this.getRecordSet();
	    
	    recordSet.dbRecordSet('setCurrentField', this.element);
	    this.element.css('visibility', "hidden");
	    
	    // Call the appropriate dbEditor plugin on the record set to show the editor over this field
	    this.editor('show', this.element, this.getValue());

	    // Optionally set the text selection
	    if (select) {
		this.editor('selectText', select);
	    } else if ( this.element.attr('fieldInSelect') != null ) {
		this.editor('selectText', this.element.attr('fieldInSelect'));
	    } else {
		this.editor('selectText', 'all');
	    }
	    // custom event
	    this.element.trigger('dbFieldIn');
	}, 
	fieldOut: function(){
	    var recordSet = this.getRecordSet();
	    recordSet.dbRecordSet('setCurrentField', null);

	    // Check if dirty
	    if ( this.getValue() !== this.editor('getValue') ) {
		this.write();
		var record = this.getRecord();
		record.dbRecord('setState', 'dirty');
	    }

	    this.element.css('visibility', "inherit");
	    this.editor('hide');
	    // custom event
	    this.element.trigger('dbFieldOut');
	}, 
	getType: function(){
	    // Returns the field type
	    return coalesce(this.element.attr('type'), "text");
	}, 
	isEditable: function(){
	    return (this.element.is('.editable') && this.getRecord().dbRecord('getState') != "updating");
	}, 
	onMouseDown: function(){
	    if ( this.isEditable() ) {
		this.getRecordSet().dbRecordSet('fieldChange', this.element);
		// Don't blur the editor that we just showed
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
	    var newField = $([]);
	    switch (event.which) {
	    case 37: // left arrow
		newField = field.westOf(fields);
		break;
	    case 38: // up arrow
		newField = field.northOf(fields);
		break;
	    case 39: // right arrow
		newField = field.eastOf(fields);
		break;
	    case 40: // down arrow
		newField = field.southOf(fields);
		break;
	    case 9: // tab key 
		if ( event.shiftKey ) {
		    newField = field.westOf(fields);
		} else {
		    newField = field.eastOf(fields);
		}
		if ( newField.length === 0 && this.getRecord().dbRecord('getState') === 'dirty' ) {
		    // save if on last record 
		    this.getRecord().dbRecord('save');
		}
		break;
	    case 13: // return key
		newField = field.eastOf(fields);
		if ( newField.length === 0 && this.getRecord().dbRecord('getState') === 'dirty' ) {
		    // save if on last record 
		    this.getRecord().dbRecord('save');
		}
		break;
	    case 83: // Ctrl + S - save the current record.
		if ( event.ctrlKey ) {
		    this.getRecord().dbRecord('save');
		    event.preventDefault();
		}
		break;
	    }
	    if ( newField.length === 1 ) {
		recordSet.dbRecordSet('fieldChange', newField);
	    }
	},
	editorBlur: function(){
	    // When the editor becomes blurred, move out.
	    this.fieldOut();
	},
        editorValueChange: function(){
	    if ( this.getValue() !== this.editor('getValue') ) {
	        this.getRecord().dbRecord('setState', 'dirty');
            }
        },
	write: function(){
	    // Write the editor's contents to the field
	    this.setValue(this.editor('getValue'));
	},
	editor: function(method) {
	    var recordSet = this.getRecordSet();
	    var pluginName;
	    switch(this.getType()){
            case "combo":
                pluginName="dbEditorCombo";
                break;
            case "bool":
                pluginName="dbEditorBool";
                break;
	    case "text":
		pluginName="dbEditorText";
		break;
	    case "textarea":
		pluginName="dbEditorTextArea";
		break;
	    case "htmlarea":
		pluginName="dbEditorHTMLArea";
		break;
	    }
	    return recordSet[pluginName].apply(recordSet, arguments);
	}
    });
})(jQuery);