// DbRecords Plugin
(function($){

    // Class RecordSet
    // A page element containing records
    var RecordSet;
    (function(){

	// Constructor function - takes a target DOM object which contains all the records, and an optional options object
	// Uses jquery selectors to distinguish between various element types on the page (records, fields, etc)
	RecordSet = function(container, options) {
	    this.container = $(container);
	    this.container.data('RecordSet', this);
	    this.settings = $.extend({
		'fieldSelector': '.field',
		'namedSelector': "[name]",
		'recordSelector': ".record",
		'updateURL': this.container.attr('updateURL'),
		'addURL': this.container.attr('addURL'),
		'deleteURL': this.container.attr('deleteURL')
	    }, options);
	    this.currentField = $([]);

	    // Event listeners - rather than apply a seperate event listener to each field (which would fail if new fields were added), a delegated event listener is added to the record set container, listening for propogated events on the fields within.
	    var fieldSelector = this.settings.fieldSelector;
	    this.container
		.on('mouseup.dbRecordSet', fieldSelector, function(event){
		    $(event.target).dbRecords('onMouseUp',event);
		})
		.on('keydown.dbRecordSet', fieldSelector, function(event){
		    $(event.target).dbRecords('onKeyDown',event);
		})
		.on('keyup.dbRecordSet', fieldSelector, function(event){
		    $(event.target).dbRecords('onKeyUp',event);
		})
		.on('cut.dbRecordSet', fieldSelector, function(event){
		    $(event.target).dbRecords('onCut',event);
		})
		.on('paste.dbRecordSet', fieldSelector, function(event){
		    $(event.target).dbRecords('onPaste',event);
		})
		.on('blur.dbRecordSet', fieldSelector, function(event){
		    $(event.target).dbRecords('onBlur',event);
		});
	    $(window)
		.on('resize.dbRecordSet', onResize.bind(this))
		.on('beforeunload.dbRecordSet', onBeforeUnload.bind(this))
		.on('beforeprint.dbRecordSet', onBeforePrint.bind(this));
	};

	// Public methods of RecordSet
	$.extend(RecordSet.prototype,{
	    getComponentFor: function(element) {
		// Returns an object (Field, Record or Named) representing the target element as a component of this record set
		// Intended for internal use by the plugin only.
		var element = $(element);
		if ( element.data('recordSetComponent') ) {
		    return element.data('recordSetComponent');
		} else if ( element.is(this.settings.recordSelector) ) {
		    return new Record(element, this);
		} else if ( element.is(this.settings.fieldSelector) ) {
		    return new Field(element, this);
		} else if ( element.is(this.settings.namedSelector) ) {
		    return new Named(element, this);
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
	    inputEditor: function() { // nb - various optional arguments
		// Call methods of the input box control plugin
		return this.container.inputEditor.apply(this.container, arguments);
	    },
	    textEditor: function() { // nb - various optional arguments
		// Call methods of the textarea control plugin
		return this.container.textEditor.apply(this.container, arguments);
	    },
	    htmlEditor: function() { // nb - various optional arguments
		// Call methods of the editable html control plugin
		return this.container.htmlEditor.apply(this.container, arguments);
	    },
	    moveLeft: function(fromField) {
		// Returns the field one step left of the target, or the target itself if none exists
		var nextField;
		var fromFieldLeft = fromField.offset().left;
		var fields = this.container.find(this.settings.fieldSelector);
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
		var fields = this.container.find(this.settings.fieldSelector);
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
		var fields = this.container.find(this.settings.fieldSelector);
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
		var fields = this.container.find(this.settings.fieldSelector);
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
	function onResize(){
	    this.getCurrentField().dbRecords('controlOnResize');
	}
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
	    // Takes two page elements and returns true if they are on the same row
	    return (a.offset().top <= (b.offset().top + b.outerHeight()))
		&& ((a.offset().top + a.outerHeight()) >= b.offset().top);
	}
	function belowRow(a,b) {
	    // Takes two page elements and returns true if "a" is on a row below "b"
	    return b.offset().top > (a.offset().top + a.outerHeight());
	}
	function aboveRow(a,b) {
	    // Takes two page elements and returns true if "a" is on a row above "b"
	    return (b.offset().top + b.outerHeight()) < a.offset().top;
	}
	function sameColumn(a,b) {
	    // Takes two page elements and returns true if they are in the same column
	    return (a.offset().left <= (b.offset().left + b.outerWidth()))
		&& ((a.offset().left + a.outerWidth()) >= b.offset().left);
	}
	function leftOfColumn(a,b) {
	    // Takes two page elements and returns true if "a" is in a column left of "b"
	    return (b.offset().left + b.outerWidth()) < a.offset().left;
	}
	function rightOfColumn(a,b) {
	    // Takes two page elements and returns true if "a" is in a column right of "b"
	    return (a.offset().left + a.outerWidth()) < b.offset().left;
	}
    })();
    // End of class RecordSet





    // Class Record
    // A page element representing a single record - containing fields
    var Record;
    (function(){

	// Constructor function
	Record = function(container) {
	    this.container = $(container);
	    this.container.data('recordSetComponent', this);
	    this.state = 'current';
	    if ( this.container.attr('saveAction') === "add" ) {
		this.saveAction = "add";
	    } else {
		this.saveAction = "update";
	    }
	}

	// Public methods of class Record
	$.extend(Record.prototype,{
	    getRecordSet: function(){
		this.container.closest(recordSetContainers).data('RecordSet');
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
		    this.container.removeClass(this.state);
		    this.container.addClass(newState);
		    this.state = newState;
		    break;
		default:
		    $.error('Invalid state');
		}
	    },
	    save: function(async){
		var url = this.getURL(this.saveAction);
		if ( ! url ) {
		    $.error('Could not '+this.saveAction+' record - no url provided');
		}
		this.action(this.saveAction,url,actionReturn.bind(this,this.saveAction),async);
	    },
	    delete: function(async){
		var url = this.getURL('delete');
		if ( ! url ) {
		    $.error('Could not delete record - no url provided');
		}
		this.action('delete',url,actionReturn.bind(this,'delete'),async);
	    },
	    getURL: function(action) {
		// Given the name of an action (add, update, delete), attempts to get the corresponding URL from the attributes of this record element, or the record set container.
		// returns undefined if no such URL exists
		var urlAttr = action + "URL";
		var url = this.container.attr(urlAttr);
		if ( ! url ) {
		    url = this.getRecordSet().settings[urlAttr];
		}
		return url;
	    },
	    action: function(action,url,handler,async){
		// Perform the given action (add, update, delete), by submitting record data to the server.
		// Triggers a recordAction event, providing a deferred object for event listeners
		if ( typeof(handler) == "undefined" ) {
		    handler = actionReturn.bind(this,action);
		}
		if (typeof(async) == "undefined") {
		    async = true;
		}
		this.setState('updating');
		this.getCurrentField().dbRecords('write');

		var data = {};
		this.getNameds().each(function(i, named) {
		    var name = $(named).dbRecords('getName');
		    var value = $(named).dbRecords('getValue');
		    data[name] = value;
		});

		var re = /([^\?]+)\??(.*)/;
		re.exec(url);
		var path = RegExp.$1;
		var queryString = RegExp.$2;
		$.each(queryString.split('&'),function(i, pair){
		    data[pair.split('=')[0]] = pair.split('=')[1];
		});

		var deferred = new jQuery.Deferred();
		deferred.done(handler);
		deferred.fail(actionReturnError.bind(this,action));
		httpPost(url,data,deferred.resolve.bind(deferred),deferred.reject.bind(deferred));
		this.container.trigger('recordAction',[action,deferred]);
	    },
	    getCurrentField: function(){
		return this.container.find(this.getRecordSet().getCurrentField());
	    },
	    getNameds: function(){
		// Returns all named elements in the record
		return this.container.find(this.getRecordSet().settings.namedSelector);
	    },
	    getFields: function(){
		// Returns all editable fields in the record
		return this.container.find(this.getRecordSet().settings.fieldSelector);
	    },
	    setValues: function(xmlDoc){
		// Takes an xml document/fragment and attempts to match the nodes to named elements in the record, setting the values of those elements.
		this.getNameds().each(function(i, named) {
		    var node = $(xmlDoc).find('records record ' + $(named).dbRecords('getName'));
		    if ( node.length > 0 ) {
			$(named).dbRecords('setValue',node.text());
		    }
		});
	    }
	});

	// Private methods of class Record
	// Called when an action succeeds or fails
	function actionReturn(action,xmlDoc){
	    this.setState('current');
	    if ( action == "update" ) {
		this.setValues(xmlDoc);
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





    // Class Named
    // A named element of a record, non-editable by default
    var Named;
    (function(){
	Named = function(element) {
	    this.element = $(element);
	    this.element.data('recordSetComponent', this);
	}
	$.extend(Named.prototype,{
	    getRecordSet: function(){
		this.container.closest(recordSetContainers).data('RecordSet');
	    },
	    getValue: function(){
		if ( this.element.is('input, select, textarea') ) {
		    return this.element.val();
		} else {
		    return this.element.text();
		}
	    },
	    setValue: function(newValue){
		if ( this.element.is('input, select, textarea') ) {
		    this.element.val(newValue);
		} else {
		    this.element.text(newValue);
		}
	    },
	    getName: function() {
		return this.element.attr('name');
	    }
	});
    })();
    // End of class Named





    // Class Field
    // An editable field
    var Field;
    (function(){

	// Constructor function
	Field = function(element) {
	    this.element = $(element);
	    this.element.data('recordSetComponent', this);
	}

	// Public methods of class Field
	$.extend(Field.prototype,{
	    getRecordSet: function(){
		this.container.closest(recordSetContainers).data('RecordSet');
	    },
	    getName: function() {
		return this.element.attr('name');
	    },
	    getRecord: function(){
		// get the record containing this field
		return this.element.closest(this.getRecordSet().settings.recordSelector);
	    },
	    getValue: function(){
		// get the current value of this field (may be different from the value held in the editor, if this field is currently being edited)
		if ( this.getType() == "html" ) {
		    return this.element.html();
		} else if ( this.element.is('input, select, textarea') ) {
		    return this.element.val();
		} else {
		    return this.element.text();
		}
	    },
	    setValue: function(newValue){
		// set the current value of this field
		if ( this.getType() == "html" ) {
		    this.element.html(newValue);
		} else if ( this.element.is('input, select, textarea') ) {
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
		return this.getRecord().dbRecords('getState') != "updating";
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
		getControlFunction.call(this)('show', this.element, value);
	    },
	    controlHide: function(){
		// Hide the editor for this field
		getControlFunction.call(this)('hide');
	    },
	    controlGetValue: function(){
		// Get the current editor value
		return getControlFunction.call(this)('getValue');
	    },
	    controlSelectText: function(option){
		// set a text selection within the editor
		getControlFunction.call(this)('selectText', this.element, option);
	    },
	    controlOnResize: function(event){
		// Update the editor's size and position.
		getControlFunction.call(this)('onResize', event);
	    }
	});

	// Private methods of class Field
	function getControlFunction() {
	    // Returns the function by which the editor control plugin for this element can be accessed.
	    switch(this.getType()){
	    case "input":
		return this.getRecordSet().inputEditor.bind(this.getRecordSet());
		break;
	    case "text":
		return this.getRecordSet().textEditor.bind(this.getRecordSet());
		break;
	    case "html":
		return this.getRecordSet().htmlEditor.bind(this.getRecordSet());
		break;
	    }
	}
    })();
    // End of class Field





    // dbRecords plugin. The first time this is called should be on an element which contains all the records in a set.
    // Afterwards being initialised, it can be called on that container or any of the record or field elements within that container.
    // The methods made available will depend on the type of element the plugin is being called on.
    var recordSetContainers = $([]);
    $.fn.dbRecords = function() {
	var target = this;
	var args = arguments;
	var returnValue;
	this.each(function(i, element) {
	    var target = $(element);
	    var RecordSetComponent = target.data('RecordSet');

	    // If target is not a record set container, check to see if it is inside one
	    if ( ! RecordSetComponent ) {
		var container = target.closest(recordSetContainers);
		if ( container.length == 1 && container.data('RecordSet') ) {
		    RecordSetComponent = container.data('RecordSet').getComponentFor(target);
		}
	    }

	    // No arguments or an object means either constructing a new record set or changing settings.
	    if ( args.length == 0 || typeof args[0] == "object" ) {
		var options = args[0];

		// Construct a new record set with target as container
		if ( ! RecordSetComponent ) {
		    new RecordSet(target, options);
		    recordSetContainers = recordSetContainers.add(target);

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