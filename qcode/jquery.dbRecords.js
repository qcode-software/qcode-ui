// DbRecords Plugin
(function($){

    // Class RecordSet
    // A page element containing records
    var RecordSet;
    (function(){

	// Constructor function - takes a target DOM object which contains all the records
	RecordSet = function(element) {
	    this.element = $(element);
	    this.currentField = $([]);

	    // Event listeners - rather than apply a seperate event listener to each field (which would fail if new fields were added), a delegated event listener is added to the record set container, listening for propogated events on the fields within.
	    this.element
		.on('mouseup.dbRecordSet', '.editable', function(event){
		    $(event.target).dbRecords('onMouseUp',event);
		})
		.on('keydown.dbRecordSet', '.editable', function(event){
		    $(event.target).dbRecords('onKeyDown',event);
		})
		.on('keyup.dbRecordSet', '.editable', function(event){
		    $(event.target).dbRecords('onKeyUp',event);
		})
		.on('cut.dbRecordSet', '.editable', function(event){
		    $(event.target).dbRecords('onCut',event);
		})
		.on('paste.dbRecordSet', '.editable', function(event){
		    $(event.target).dbRecords('onPaste',event);
		})
		.on('blur.dbRecordSet', '.editable', function(event){
		    $(event.target).dbRecords('onBlur',event);
		});
	    $(window)
		.on('beforeunload.dbRecordSet', onBeforeUnload.bind(this))
		.on('beforeprint.dbRecordSet', onBeforePrint.bind(this));
	};

	// Public methods of RecordSet
	$.extend(RecordSet.prototype,{
	    getComponentFor: function(element) {
		// Returns an object (Field or Record) representing the target element as a component of this record set
		// Intended for internal use by the plugin only.
		var element = $(element);
		if ( element.data('record') ) {
		    return element.data('record');
		} else if ( element.data('field') ) {
		    return element.data('field');
		} else if ( element.is('.record') ) {
		    element.data('record', new Record(element, this));
		    return element.data('record');
		} else if ( element.is('[name]') ) {
		    element.data('field', new Field(element, this));
		    return element.data('field');
		}
	    },
	    save: function(aysnc) {
		// Save the current record
		this.getCurrentRecord.dbRecords('save',async);
	    },
	    getCurrentRecord: function() {
		// Returns the current record (the record containing the current field), or an empty jQuery object if none exists.
		return this.currentField.dbRecords('getRecord');
	    },
	    getCurrentField: function() {
		// Returns the current field, or an empty jQuery object if none exists.
		return this.currentField;
	    },
	    setCurrentField: function(newField) {
		// Sets the "currentField" property - intended for internal use, use fieldChange to select a field.
		this.currentField = $(newField);
	    },
	    fieldChange: function(newField) {
		// Switch to the target field
		this.currentField.dbRecords('fieldOut');
		newField.dbRecords('fieldIn');
	    },
	    moveLeft: function(fromField) {
		// Returns the field one step left of the target, or the target itself if none exists
		var nextField;
		var fromFieldLeft = fromField.offset().left;
		var fields = this.element.find('.editable');
		fields.each(function() {
		    var field = $(this);
		    var fieldLeft = field.offset().left;
		    if ( sameRow(field,fromField)
			 && fieldLeft < fromFieldLeft
			 && ( typeof nextField == "undefined" || fieldLeft > nextFieldLeft )
		       ) {
			nextField = field;
			nextFieldLeft = fieldLeft;
		    }
		});
		if ( typeof nextField == "undefined" ) {
		    fields.each(function() {
			var field = $(this);
			var fieldLeft = $(field).offset().left;
			if ( aboveRow(fromField,field)
			     && (typeof nextField == "undefined"
				 || belowRow(nextField,field)
				 || (sameRow(field,nextField) && fieldLeft > nextFieldLeft )
				)
			   ) {
			    nextField = field;
			    nextFieldLeft = fieldLeft;
			}
		    });
		}
		if ( typeof nextField == "undefined" ) {
		    return fromField;
		} else {
		    return nextField;
		}
	    },
	    moveRight: function(fromField) {
		// Returns the field one step right of the target, or the target itself if none exists
		var nextField;
		var fromFieldLeft = fromField.offset().left;
		var fields = this.element.find('.editable');
		fields.each(function() {
		    var field = $(this);
		    var fieldLeft = field.offset().left;
		    if ( sameRow(field,fromField)
			 && fieldLeft > fromFieldLeft
			 && ( typeof nextField == "undefined" || fieldLeft < nextFieldLeft )
		       ) {
			nextField = field;
			nextFieldLeft = fieldLeft;
		    }
		});
		if ( typeof nextField == "undefined" ) {
		    fields.each(function() {
			var field = $(this);
			var fieldLeft = $(field).offset().left;
			if ( belowRow(fromField,field)
			     && (typeof nextField == "undefined"
				 || aboveRow(nextField,field)
				 || (sameRow(field,nextField) && fieldLeft < nextFieldLeft)
				)
			   ) {
			    nextField = field;
			    nextFieldLeft = fieldLeft;
			}
		    });
		}
		if ( typeof nextField == "undefined" ) {
		    return fromField;
		} else {
		    return nextField;
		}
	    },
	    moveUp: function(fromField) {
		// Returns the field one step above the target, or the target itself if none exists
		var nextField;
		var fromFieldTop = fromField.offset().top;
		var fields = this.element.find('.editable');
		fields.each(function() {
		    var field = $(this);
		    var fieldTop = field.offset().top;
		    if ( sameColumn(fromField,field)
			 && fieldTop < fromFieldTop
			 && (typeof nextField == "undefined" || fieldTop > nextFieldTop)
		       ) {
			nextField = field;
			nextFieldTop = fieldTop;
		    }
		});
		if ( typeof nextField == "undefined" ) {
		    fields.each(function() {
			var field = $(this);
			var fieldTop = field.offset().top;
			if ( leftOfColumn(fromField,field)
			     && (typeof nextField == "undefined"
				 || rightOfColumn(nextField,field)
				 || (sameColumn(field,nextField) && fieldTop > nextFieldTop)
				)
			   ) {
			    nextField = field;
			    nextFieldTop = fieldTop;
			};
		    });
		}
		if ( typeof nextField == "undefined" ) {
		    return fromField;
		} else {
		    return nextField;
		}
	    },
	    moveDown: function(fromField) {
		// Returns the field one step below the target, or the target itself if none exists
		var nextField;
		var fromFieldTop = fromField.offset().top;
		var fields = this.element.find('.editable');
		fields.each(function() {
		    var field = $(this);
		    var fieldTop = field.offset().top;
		    if ( sameColumn(fromField,field)
			 && fieldTop > fromFieldTop
			 && ( typeof nextField == "undefined" || fieldTop < nextFieldTop )
		       ) {
			nextField = field;
			nextFieldTop = fieldTop;
		    }
		});
		if ( typeof nextField == "undefined" ) {
		    fields.each(function() {
			var field = $(this);
			var fieldTop = field.offset().top;
			if ( rightOfColumn(fromField,field)
			     && ( typeof nextField == "undefined"
				  || leftOfColumn(nextField,field)
				  || (sameColumn(field,nextField) && fieldTop < nextFieldTop)
				)
			   ) {
			    nextField = field;
			    nextFieldTop = fieldTop;
			}
		    });
		}
		if ( typeof nextField == "undefined" ) {
		    return fromField;
		} else {
		    return nextField;
		}
	    }
	});

	// Private methods of RecordSet
	function onBeforeUnload(){
	    var record = this.getCurrentRecord();
	    if ( record.dbRecords('getState') == 'dirty' ) {
		if ( window.confirm('Do you want to save your changes?') ) {
		    record.dbRecords('save',false);
		    if ( record.dbRecords('getState') == 'error' ) {
			return "Your changes could not be saved.\nStay on the current page to correct.";
		    }
		}
	    }
	}
	function onBeforePrint(){
	    this.getCurrentField().dbRecords('fieldOut');
	}
	function sameRow(a,b) {
	    // Takes two elements and returns true if they are on the same row
	    return (a.offset().top <= (b.offset().top + b.outerHeight()))
		&& ((a.offset().top + a.outerHeight()) >= b.offset().top);
	}
	function belowRow(a,b) {
	    // Takes two elements and returns true if "a" is on a row below "b"
	    return b.offset().top > (a.offset().top + a.outerHeight());
	}
	function aboveRow(a,b) {
	    // Takes two elements and returns true if "a" is on a row above "b"
	    return (b.offset().top + b.outerHeight()) < a.offset().top;
	}
	function sameColumn(a,b) {
	    // Takes two elements and returns true if they are in the same column
	    return (a.offset().left <= (b.offset().left + b.outerWidth()))
		&& ((a.offset().left + a.outerWidth()) >= b.offset().left);
	}
	function leftOfColumn(a,b) {
	    // Takes two elements and returns true if "a" is in a column left of "b"
	    return (b.offset().left + b.outerWidth()) < a.offset().left;
	}
	function rightOfColumn(a,b) {
	    // Takes two elements and returns true if "a" is in a column right of "b"
	    return (a.offset().left + a.outerWidth()) < b.offset().left;
	}
    })();
    // End of class RecordSet





    // Class Record
    // A page element representing a single record - containing fields
    var Record;
    (function(){

	// Constructor function
	Record = function(element) {
	    this.element = $(element);
	    this.state = 'current';
	    if ( this.element.attr('saveAction') === "add" ) {
		this.saveAction = "add";
	    } else {
		this.saveAction = "update";
	    }
	}

	// Public methods of class Record
	$.extend(Record.prototype,{
	    getRecordSet: function(){
		return this.element.closest('.recordSet').data('RecordSet');
	    },
	    getState: function(){
		return this.state;
	    },
	    setState: function(newState){
		switch(newState) {
		case "updating":
		case "error":
		case "current":
		case "dirty":
		    this.element.removeClass("current dirty updating error");
		    this.element.addClass(newState);
		    this.state = newState;
		    break;
		default:
		    $.error('Invalid state');
		}
	    },
	    save: function(async){
		if ( this.getState() === "updating" ) return false;
		var url = this.getRecordSet().element.attr(this.saveAction + "URL");
		if ( ! url ) {
		    $.error('Could not '+this.saveAction+' record - no url provided');
		}
		this.action(this.saveAction,url,actionReturn.bind(this,this.saveAction),async);
	    },
	    delete: function(async){
		if ( this.getState() === "updating" ) return false;
		var url = this.getRecordSet().element.attr('deleteURL');
		if ( ! url ) {
		    $.error('Could not delete record - no url provided');
		}
		this.action('delete',url,actionReturn.bind(this,'delete'),async);
	    },
	    action: function(action,url,handler,async){
		// Perform the given action (add, update, delete), by submitting record data to the server.
		// Triggers a recordAction event, providing a deferred object for event listeners
		var handler = coalesce(handler, actionReturn.bind(this, action));
		var async = coalesce(async, true);

		this.setState('updating');
		this.getCurrentField().dbRecords('write');

		var urlPieces = splitURL(url);
		var path = urlPieces.path;
		var data = urlPieces.data;
		this.element.find('[name]').each(function(i, field) {
		    var name = $(field).dbRecords('getName');
		    var value = $(field).dbRecords('getValue');
		    data[name] = value;
		});

		var deferred = new jQuery.Deferred();
		deferred.done(handler);
		deferred.fail(actionReturnError.bind(this,action));

		httpPost(path, data, function(data, textStatus, jqXHR) {
		    deferred.resolve(data, textStatus, jqXHR);
		}, function(jqXHR, textStatus, errorThrown) {
		    deferred.reject(jqXHR, textStatus, errorThrown);
		});
		this.element.trigger('recordAction', [action, deferred]);
	    },
	    getCurrentField: function(){
		return this.element.find(this.getRecordSet().getCurrentField());
	    },
	    getFields: function(){
		// Returns all editable fields in the record
		return this.element.find('.editable');
	    },
	    setValues: function(xmlDoc){
		// Takes an xml document/fragment and attempts to match the nodes to fields in the record, setting the values of those elements.
		this.element.find('[name]').each(function(i, field) {
		    var node = $(xmlDoc).find('records record ' + $(field).dbRecords('getName'));
		    if ( node.length > 0 ) {
			$(field).dbRecords('setValue',node.text());
		    }
		});
		this.element.trigger('resize');
	    }
	});

	// Private methods of class Record
	// Called when an action succeeds or fails
	function actionReturn(action,xmlDoc){
	    this.setState('current');
	    switch(action){
	    case "update":
		this.setValues(xmlDoc);
		break;
	    case "add":
		this.saveAction = "update";
		this.setValues(xmlDoc);
		break;
	    case "delete":
		this.element.remove();
		this.getRecordSet().element.trigger('resize');
		break;
	    }
	}
	function actionReturnError(action,message,type){
	    this.setState('error');
	    if ( type != 'USER' ) {
		alert(message);
	    }
	}
    })();
    // End of class Record





    // Class Field
    var Field;
    (function(){

	// Constructor function
	Field = function(element) {
	    this.element = $(element);
	    this.lockFocusEvents = false;
	}

	// Public methods of class Field
	$.extend(Field.prototype,{
	    getRecordSet: function(){
		return this.element.closest('.recordSet').data('RecordSet');
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
		this.lockFocusEvents = true;
		this.getRecordSet().setCurrentField(this.element);
		this.element.css('visibility', "hidden");

		var fieldValue = this.getValue();
		this.controlShow(fieldValue);

		if (select) {
		    this.controlSelectText(select);
		} else if ( this.element.attr('fieldInSelect') != null ) {
		    this.controlSelectText(this.element.attr('fieldInSelect'));
		} else {
		    this.controlSelectText('all');
		}
		this.element.trigger('fieldIn');
		this.lockFocusEvents = false;
	    },
	    fieldOut: function(){
		// Stop editing this field
		this.lockFocusEvents = true;
		var record = this.getRecord();
		this.getRecordSet().setCurrentField($([]));
		if ( this.getValue() !== this.controlGetValue() ) {
		    record.dbRecords('setState','dirty');
		}
		this.write();
		this.element.css('visibility',"inherit");
		this.controlHide();
		if ( record.dbRecords('getState') == "dirty" ) {
		    record.dbRecords('save');
		}
		this.element.trigger('fieldOut');
		this.lockFocusEvents = false;
	    },
	    getType: function(){
		// Returns the field type (input, text, or html)
		return this.element.attr('type');
	    },
	    isEditable: function(){
		// Returns true if the field is currently editable (ie. not updating)
		return (this.element.is('.editable') && this.getRecord().dbRecords('getState') != "updating");
	    },
	    onMouseUp: function(){
		if ( this.isEditable() ) {
		    this.getRecordSet().fieldChange(this.element);
		}
	    },
	    onKeyDown: function(event){
		// nb. Normally only captures key up events propagated here by the editor
		if ( event.altKey ) {
		    return true;
		}
		var records = this.getRecordSet();
		var field = this.element;
		switch (event.which) {
		case 37: //left
		    records.fieldChange(records.moveLeft(field));
		    break;
		case 38: //up
		    records.fieldChange(records.moveUp(field));
		    break;
		case 39: //right
		    records.fieldChange(records.moveRight(field));
		    break;
		case 40: //down
		    records.fieldChange(records.moveDown(field));
		    break;
		case 9: //tab
		    if ( event.shiftKey ) {
			var newField = records.moveLeft(field);
		    } else {
			var newField = records.moveRight(field);
		    }
		    if ( newField == field ) {
			this.getRecord().dbRecords('save');
		    } else {
			records.fieldChange(newField);
		    }
		    break;
		case 13: //return
		    var newField = records.moveRight(field);
		    if ( newField == field ) {
			this.getRecord().dbRecords('save');
		    } else {
			records.fieldChange(newField);
		    }
		    break;
		case 46: //delete
		    if ( this.getRecord().dbRecords('getUrl','delete') ) {
			this.fieldOut();
			this.getRecord().dbRecords('delete');
		    }
		    break;
		case 83: //ctrl + s
		    if ( event.ctrlKey ) {
			this.save();
			event.preventDefault();
		    }
		    break;
		}
	    },
	    onKeyUp: function(event){
		if ( this.getValue() !== this.controlGetValue() ) {
		    this.getRecord().dbRecords('setState','dirty');
		}
	    },
	    onCut: function(){
		this.getRecord().dbRecords('setState','dirty');
	    },
	    onPaste: function(){
		this.getRecord().dbRecords('setState','dirty');
	    },
	    onBlur: function(){
		// Blur may be triggered by fieldIn, depending on the browser. Locking prevents this issue.
		if ( ! this.lockFocusEvents ) {
		    this.fieldOut();
		}
	    },
	    write: function(){
		// Write the current editor contents to the field
		this.setValue(this.controlGetValue());
	    },
	    controlShow: function(value){
		// Show the appropriate editor for this field
		getEditorPlugin.call(this)('show', this.element, value);
	    },
	    controlHide: function(){
		// Hide the editor for this field
		getEditorPlugin.call(this)('hide');
	    },
	    controlGetValue: function(){
		// Get the current editor value
		return getEditorPlugin.call(this)('getValue');
	    },
	    controlSelectText: function(option){
		// set a text selection within the editor
		getEditorPlugin.call(this)('selectText', this.element, option);
	    }
	});

	// Private methods of class Field
	function getEditorPlugin() {
	    // Returns a function which calls the appropriate editor plugin for this field on the record set container.
	    var container = this.getRecordSet().element;
	    switch(this.getType()){
	    case "input":
		return container.inputEditor.bind(container);
		break;
	    case "text":
		return container.textEditor.bind(container);
		break;
	    case "html":
		return container.htmlEditor.bind(container);
		break;
	    }
	}
    })();
    // End of class Field





    // dbRecords plugin. The first time this is called should be on an element which contains all the records in a set.
    // Afterwards being initialised, it can be called on that element or any of the record or field elements within that element.
    // The methods made available will depend on the type of element the plugin is being called on.
    $.fn.dbRecords = function() {
	var target = this;
	var args = arguments;
	var returnValue;
	this.each(function(i, element) {
	    var target = $(element);
	    var RecordSetComponent = target.data('RecordSet');

	    // If target is not a record set container, check to see if it is inside one
	    if ( ! RecordSetComponent ) {
		var container = target.closest('.recordSet');
		if ( container.length == 1 && container.data('RecordSet') ) {
		    RecordSetComponent = container.data('RecordSet').getComponentFor(target);
		}
	    }

	    // No arguments means constructing a new record set.
	    if ( args.length == 0 ) {

		// Construct a new record set with target as container
		if ( ! RecordSetComponent ) {
		    target.data('RecordSet', new RecordSet(target));
		}

	    } else if ( typeof args[0] == "string" ) {
		// Called with a method name, attempt to call the method
		var method = args[0];
		if ( typeof RecordSetComponent[method] == "function" ) {
		    returnValue = RecordSetComponent[method].apply(RecordSetComponent, Array.prototype.slice.call(args,1));
		} else {
		    $.error('Invalid method for dbRecords');
		}
	    }
	});

	if ( typeof returnValue == "undefined" ) {
	    return this;
	} else {
	    return returnValue;
	}
    };
})(jQuery);

jQuery(function(){
    jQuery('.recordSet').dbRecords();
});