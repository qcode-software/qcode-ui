// dbField plugin - a field in a dbRecord.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget("qcode.dbField", {
	_create: function() {
	    // saveType
	    this.options.saveType = coalesce(
                this.element.attr('saveType'),
                this.options.saveType,
                this.getRecord().dbRecord("option", "saveType")
            );
	    
	    if ( this.options.saveType === 'fieldOut' ) {
		this._on({
		    'dbFieldOut': function() {
			if ( this.getRecord().dbRecord('getState') === "dirty" ) {
			    this.getRecord().dbRecord('save');
			}
		    }
		});
	    }
            this._on({
                'focus': this.fieldIn,
                'blur': this.fieldOut,
                'editorBlur': this.fieldOut,
                'valueChange': function() {
                    if ( this.element.editable('getValue') !== this.storedValue ) {
                        this.getrecord().setState('dirty');
                    }
                }
            });
            if ( this.element.editable('hasFocus') ) {
                this.fieldIn();
            }
            this.storedValue = this.element.editable('getValue');
	},
	getRecordSet: function() {
	    return this.element.closest('.record-set');
	},
	getRecord: function(){
	    return this.element.closest('.record');
	},
	getName: function() {
	    return this.element.attr('name');
	},
	getValue: function(){
            return this.element.editable('getValue');
	}, 
	setValue: function(newValue){
            this.element.editable('setValue', newValue);
	}, 
	fieldIn: function(select){
	    this.element.trigger('dbFieldIn');
	}, 
	fieldOut: function(){
	    this.element.trigger('dbFieldOut');
	}, 
	getType: function(){
	    // Returns the field type
	    return coalesce(this.element.attr('type'), "text");
	}, 
	isEditable: function(){
	    return (this.element.is('.editable') && this.getRecord().dbRecord('getState') != "updating");
	}, 
	onClick: function(event){
	    if ( this.isEditable() ) {
		this.getRecordSet().dbRecordSet('fieldChange', this.element);
		// Don't blur the editor that we just showed
		event.preventDefault();q
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
	    event.preventDefault();
	},
	editorBlur: function(event){
	    // When the editor becomes blurred, move out.
	    this.fieldOut();
	},
        editorValueChange: function(event){
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