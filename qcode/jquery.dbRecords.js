// DbRecords Plugins
(function($){

    // Navigation functions
    function sameRow(a, b) {
	// Takes two elements and returns true if they are on the same row
	return (a.offset().top <= (b.offset().top + b.outerHeight()))
	    && ((a.offset().top + a.outerHeight()) >= b.offset().top);
    }
    function belowRow(a, b) {
	// Takes two elements and returns true if "a" is on a row below "b"
	return b.offset().top > (a.offset().top + a.outerHeight());
    }
    function aboveRow(a, b) {
	// Takes two elements and returns true if "a" is on a row above "b"
	return (b.offset().top + b.outerHeight()) < a.offset().top;
    }
    function sameColumn(a, b) {
	// Takes two elements and returns true if they are in the same column
	return (a.offset().left <= (b.offset().left + b.outerWidth()))
	    && ((a.offset().left + a.outerWidth()) >= b.offset().left);
    }
    function leftOfColumn(a, b) {
	// Takes two elements and returns true if "a" is in a column left of "b"
	return (b.offset().left + b.outerWidth()) < a.offset().left;
    }
    function rightOfColumn(a, b) {
	// Takes two elements and returns true if "a" is in a column right of "b"
	return (a.offset().left + a.outerWidth()) < b.offset().left;
    }





    // Class RecordSet
    var RecordSet;
    (function(){

	// Constructor function
	RecordSet = function(element) {
	    this.element = $(element);
	    this.currentField = $([]);

	    // Event listeners - instead of seperate event listeners for each field, delegated event listeners are added to the container.
	    this.element
		.on('mousedown.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onMouseDown', event);
		})
		.on('keydown.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onKeyDown', event);
		})
		.on('keyup.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onKeyUp', event);
		})
		.on('cut.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onCut', event);
		})
		.on('paste.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onPaste', event);
		})
		.on('blur.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onBlur', event);
		});
	    $(window)
		.on('beforeunload.dbRecordSet', onBeforeUnload.bind(this))
		.on('beforeprint.dbRecordSet', onBeforePrint.bind(this));
	};

	// Public methods of RecordSet
	$.extend(RecordSet.prototype, {
	    save: function(aysnc) {
		// Save the current record
		this.getCurrentRecord.dbRecord('save', async);
	    }, 
	    getCurrentRecord: function() {
		// Returns the current record (the record containing the current field), or an empty jQuery object if none exists.
		return this.currentField.dbField('getRecord');
	    }, 
	    getCurrentField: function() {
		// Returns the current field, or an empty jQuery object if none exists.
		return this.currentField;
	    }, 
	    setCurrentField: function(newField) {
		// Sets the "currentField" property - this is intended for internal use, please use fieldChange to change the current field.
		this.currentField = $(newField);
	    }, 
	    fieldChange: function(newField) {
		// Switch to the target field
		var currentRecord = this.currentField.dbField('getRecord');
		var newRecord = newField.dbField('getRecord');
		this.currentField.dbField('fieldOut');
		if ( ! currentRecord.is(newRecord) ) {
		    currentRecord.dbRecord('recordOut');
		}
		newField.dbField('fieldIn');
		if ( ! currentRecord.is(newRecord) ) {
		    newRecord.dbRecord('recordIn');
		}
	    }, 
	    moveLeft: function(fromField) {
		// Returns the field one step left of the target, or the target itself if none exists
		var nextField;
		var fromFieldLeft = fromField.offset().left;
		var fields = this.element.find('.editable');
		fields.each(function() {
		    var field = $(this);
		    var fieldLeft = field.offset().left;
		    if ( sameRow(field, fromField)
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
			if ( aboveRow(fromField, field)
			     && (typeof nextField == "undefined"
				 || belowRow(nextField, field)
				 || (sameRow(field, nextField) && fieldLeft > nextFieldLeft )
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
		    if ( sameRow(field, fromField)
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
			if ( belowRow(fromField, field)
			     && (typeof nextField == "undefined"
				 || aboveRow(nextField, field)
				 || (sameRow(field, nextField) && fieldLeft < nextFieldLeft)
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
		    if ( sameColumn(fromField, field)
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
			if ( leftOfColumn(fromField, field)
			     && (typeof nextField == "undefined"
				 || rightOfColumn(nextField, field)
				 || (sameColumn(field, nextField) && fieldTop > nextFieldTop)
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
		    if ( sameColumn(fromField, field)
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
			if ( rightOfColumn(fromField, field)
			     && ( typeof nextField == "undefined"
				  || leftOfColumn(nextField, field)
				  || (sameColumn(field, nextField) && fieldTop < nextFieldTop)
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
	function onBeforeUnload(event){
	    var record = this.getCurrentRecord();
	    if ( record.dbRecord('getState') == 'dirty' ) {
		if ( window.confirm('Do you want to save your changes?') ) {
		    record.dbRecord('save', false);
		    if ( record.dbRecord('getState') == 'error' ) {
			return "Your changes could not be saved.\nStay on the current page to correct.";
		    }
		}
	    }
	}
	function onBeforePrint(event){
	    this.getCurrentField().dbField('fieldOut');
	    this.getCurrentRecord().dbRecord('recordOut');
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
	$.extend(Record.prototype, {
	    getRecordSet: function(){
		// Get the record-set element for this record
		return this.element.closest('.recordSet');
	    }, 
	    getState: function(){
		// Get the state of this record
		return this.state;
	    }, 
	    setState: function(newState){
		// Set the state of this record
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
		// Save this record, using an add or update url as appropriate
		if ( this.getState() === "updating" ) return false;
		var url = this.getRecordSet().attr(this.saveAction + "URL");
		if ( ! url ) {
		    $.error('Could not '+this.saveAction+' record - no url provided');
		}
		this.action(this.saveAction, url, async);
	    }, 
	    delete: function(async){
		// Delete this record, by sending a delete request to the server
		if ( this.getState() === "updating" ) return false;
		var url = this.getRecordSet().attr('deleteURL');
		if ( ! url ) {
		    $.error('Could not delete record - no url provided');
		}
		this.action('delete', url, async);
	    }, 
	    action: function(action, url, async){
		// Perform the given action (add, update, delete), by submitting record data to the server.
		var async = coalesce(async, true);

		this.setState('updating');
		this.getCurrentField().dbField('write');

		var urlPieces = splitURL(url);
		var path = urlPieces.path;
		var data = urlPieces.data;
		this.element.find('[name]').each(function(i, field) {
		    var name = $(field).dbField('getName');
		    var value = $(field).dbField('getValue');
		    data[name] = value;
		});

		httpPost(path, data, actionReturn.bind(this, action), actionReturnError.bind(this, action), async);
		this.element.trigger('recordAction', [action]);
	    }, 
	    getCurrentField: function(){
		return this.element.find(this.getRecordSet().dbRecordSet('getCurrentField'));
	    }, 
	    getFields: function(){
		// Returns all editable fields in the record
		return this.element.find('.editable');
	    }, 
	    setValues: function(xmlDoc){
		// Takes an xml document/fragment and attempts to match the nodes to fields in the record, setting the values of those elements.
		this.element.find('[name]').each(function(i, field) {
		    var node = $(xmlDoc).find('records record ' + $(field).dbField('getName'));
		    if ( node.length > 0 ) {
			$(field).dbField('setValue', node.text());
		    }
		});
		this.element.trigger('resize');
	    }, 
	    recordIn: function(){
		this.element.trigger('recordIn');
	    }, 
	    recordOut: function(){
		if ( this.getState() === "dirty" ) {
		    this.save();
		}
		this.element.trigger('recordOut');
	    }
	});

	// Private methods of class Record
	// Called when an action succeeds or fails
	function actionReturn(action, xmlDoc, status, jqXHR){
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
		this.getRecordSet().trigger('resize');
		break;
	    }
	    this.element.trigger('recordActionReturn', [action, xmlDoc, status, jqXHR]);
	}
	function actionReturnError(action, message, type, error){
	    this.setState('error');
	    if ( type != 'USER' ) {
		alert(message);
	    }
	    this.element.trigger('recordActionReturnError', [action, message, type, error]);
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
	$.extend(Field.prototype, {
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
		this.lockFocusEvents = true;
		this.getRecordSet().dbRecordSet('setCurrentField', this.element);
		this.element.css('visibility', "hidden");

		var fieldValue = this.getValue();
		this.editorShow(fieldValue);

		if (select) {
		    this.editorSelectText(select);
		} else if ( this.element.attr('fieldInSelect') != null ) {
		    this.editorSelectText(this.element.attr('fieldInSelect'));
		} else {
		    this.editorSelectText('all');
		}
		this.element.trigger('fieldIn');
		this.lockFocusEvents = false;
	    }, 
	    fieldOut: function(){
		// Stop editing this field
		this.lockFocusEvents = true;
		var record = this.getRecord();
		this.getRecordSet().dbRecordSet('setCurrentField', $([]));
		if ( this.getValue() !== this.editorGetValue() ) {
		    record.dbRecord('setState', 'dirty');
		}
		this.write();
		this.element.css('visibility', "inherit");
		this.editorHide();
		this.element.trigger('fieldOut');
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
		if ( this.getValue() !== this.editorGetValue() ) {
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
		this.setValue(this.editorGetValue());
	    }, 
	    editorShow: function(value){
		// Show the appropriate editor for this field
		var editorPlugin = getEditorPlugin.call(this);
		editorPlugin('show', this.element, value);
	    }, 
	    editorHide: function(){
		// Hide the editor for this field
		var editorPlugin = getEditorPlugin.call(this)
		editorPlugin('hide');
	    }, 
	    editorGetValue: function(){
		// Get the current editor value
 		var editorPlugin = getEditorPlugin.call(this);
		return editorPlugin('getValue');
	    }, 
	    editorSelectText: function(option){
		// set a text selection within the editor
		var editorPlugin = getEditorPlugin.call(this);
		editorPlugin('selectText', this.element, option);
	    }
	});

	// Private methods of class Field
	function getEditorPlugin() {
	    // Determines the appropriate editor plugin for this field, 
	    // then returns a function which calls that plugin on the record set element.
	    var container = this.getRecordSet();
	    switch(this.getType()){
	    case "text":
		return container.dbEditorinput.bind(container);
		break;
	    case "textarea":
		return container.dbEditorText.bind(container);
		break;
	    case "htmlarea":
		return container.dbEditorHTML.bind(container);
		break;
	    }
	}
    })();
    // End of class Field





    // dbRecordSet plugin
    $.fn.dbRecordSet = function() {
	var target = this;
	var args = arguments;
	var returnValue;

	if ( target.length > 1 ) $.error('dbRecordSet does not support multiple elements');
	if ( target.length == 0 ) return target;

	if ( ! target.data('recordSet') ) {
	    target.data('recordSet', new RecordSet(target));
	    target.addClass('recordSet');
	}
	var recordSet = target.data('recordSet');

	if ( typeof args[0] == "string" ) {
	    // Called with a method name, attempt to call the method
	    var method = args[0];
	    if ( typeof recordSet[method] == "function" ) {
		returnValue = recordSet[method].apply(recordSet, Array.prototype.slice.call(args, 1));
	    } else {
		$.error('Invalid method for dbRecordSet');
	    }
	}

	return coalesce(returnValue, target);
    };

    // dbRecord plugin
    $.fn.dbRecord = function() {
	var target = this;
	var args = arguments;
	var returnValue;

	if ( target.length > 1 ) $.error('dbRecord does not support multiple elements');
	if ( target.length == 0 ) {
	    if ( args[0] === 'getState' ) {
		return undefined;
	    } else {
		return target;
	    }
	}

	if ( ! target.data('record') ) {
	    target.data('record', new Record(target));
	    target.addClass('record');
	}
	var record = target.data('record');

	if ( typeof args[0] == "string" ) {
	    // Called with a method name, attempt to call the method
	    var method = args[0];
	    if ( typeof record[method] == "function" ) {
		returnValue = record[method].apply(record, Array.prototype.slice.call(args, 1));
	    } else {
		$.error('Invalid method for dbRecord');
	    }
	}

	return coalesce(returnValue, target);
    };

    // dbField plugin
    $.fn.dbField = function() {
	var target = this;
	var args = arguments;
	var returnValue;

	if ( target.length > 1 ) $.error('dbField does not support multiple elements');
	if ( target.length == 0 ) {
	    if ( ['getName', 'getValue', 'getType', 'editorGetValue'].indexOf(args[0]) > -1 ) {
		return undefined;
	    } else {
		return target;
	    }
	}

	if ( ! target.data('field') ) {
	    target.data('field', new Field(target));
	}
	var field = target.data('field');

	if ( typeof args[0] == "string" ) {
	    // Called with a method name, attempt to call the method
	    var method = args[0];
	    if ( typeof field[method] == "function" ) {
		returnValue = field[method].apply(field, Array.prototype.slice.call(args, 1));
	    } else {
		$.error('Invalid method for dbField');
	    }
	}

	return coalesce(returnValue, target);
    }
})(jQuery);

// dbRecordSet is hard-coded to work with the "recordSet" class, so we may as well call it here rather than in behaviour files.
jQuery(function(){
    jQuery('.recordSet').dbRecordSet();
});