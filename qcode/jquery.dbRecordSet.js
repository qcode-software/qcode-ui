// DbRecords Plugin
(function($){

    // Class RecordSet
    var RecordSet;
    (function(){
	// Constructor function - takes a target DOM object which contains all the records, and an optional options object
	// Uses jquery selectors to distinguish between various element types on the page (records, fields, etc)
	RecordSet = function(container, options) {
	    var recordSet = this;
	    this.container = $(container);
	    this.container.data('RecordSet', this);
	    this.settings = $.extend({
		'inputFieldSelector': '.field[type!="text"][type!="html"]',
		'textFieldSelector': '.field[type="text"]',
		'htmlFieldSelector': '.field[type="html"]',
		'namedSelector': "[name]",
		'recordSelector': ".record",
		'updateURL': container.attr('updateURL'),
		'addURL': container.attr('addURL'),
		'deleteURL': container.attr('deleteURL')
	    }, options);
	    this.currentField = $([]);

	    //
	    var selectors = [];
	    if ( this.settings.inputFieldSelector ) selectors.push(this.settings.inputFieldSelector);
	    if ( this.settings.textFieldSelector ) selectors.push(this.settings.textFieldSelector);
	    if ( this.settings.htmlFieldSelector ) selectors.push(this.settings.htmlFieldSelector);
	    var fieldSelector = this.settings.fieldSelector = selectors.join(', ');

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

	$.extend(RecordSet.prototype,{
	    init: function(options) {
		$.extend(this.settings, options);
	    },
	    getComponentFor: function(element) {
		// Returns an object (Field, Record or Named) representing the target element as a component of this record set
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
		this.getCurrentRecord.dbRecords('save',async);
	    },
	    getCurrentRecord: function() {
		return this.currentField.dbRecords('getRecord');
	    },
	    getCurrentField: function() {
		return this.currentField;
	    },
	    setCurrentField: function(newField) {
		this.currentField = $(newField);
	    },
	    fieldChange: function(newField) {
		this.currentField.dbRecords('fieldOut');
		newField.dbRecords('fieldIn');
	    },
	    fieldInput: function() {
		return this.container.cellInput.apply(this.container, arguments);
	    },
	    fieldText: function() {
		return this.container.cellText.apply(this.container, arguments);
	    },
	    fieldHTML: function() {
		return this.container.cellHTML.apply(this.container, arguments);
	    },
	    moveLeft: function(fromField) {
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
	    return (a.offset().top <= (b.offset().top + b.outerHeight()))
		&& ((a.offset().top + a.outerHeight()) >= b.offset().top);
	}
	function belowRow(a,b) {
	    return b.offset().top > (a.offset().top + a.outerHeight());
	}
	function aboveRow(a,b) {
	    return (b.offset().top + b.outerHeight()) < a.offset().top;
	}
	function sameColumn(a,b) {
	    return (a.offset().left <= (b.offset().left + b.outerWidth()))
		&& ((a.offset().left + a.outerWidth()) >= b.offset().left);
	}
	function leftOfColumn(a,b) {
	    return (b.offset().left + b.outerWidth()) < a.offset().left;
	}
	function rightOfColumn(a,b) {
	    return (a.offset().left + a.outerWidth()) < b.offset().left;
	}
    })();

    var Record;
    (function(){
	Record = function(container, recordSet) {
	    this.container = $(container);
	    this.container.data('recordSetComponent', this);
	    this.recordSet = recordSet;
	    this.state = 'current';
	    if ( this.container.attr('saveAction') === "add" ) {
		this.saveAction = "add";
	    } else {
		this.saveAction = "update";
	    }
	}
	$.extend(Record.prototype,{
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
		var urlAttr = action + "URL";
		var url = this.container.attr(urlAttr);
		if ( ! url ) {
		    url = this.recordSet.settings[urlAttr];
		}
		return url;
	    },
	    action: function(action,url,handler,async){
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
		return this.container.find(this.recordSet.getCurrentField());
	    },
	    getNameds: function(){
		return this.container.find(this.recordSet.settings.namedSelector);
	    },
	    getFields: function(){
		return this.container.find(this.recordSet.settings.fieldSelector);
	    },
	    setValues: function(xmlDoc){
		this.getNameds().each(function(i, named) {
		    var node = $(xmlDoc).find('records record ' + $(named).dbRecords('getName'));
		    if ( node.length > 0 ) {
			$(named).dbRecords('setValue',node.text());
		    }
		});
	    }
	});
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

    var Named;
    (function(){
	Named = function(element, recordSet) {
	    this.element = $(element);
	    this.element.data('recordSetComponent', this);
	    this.recordSet = recordSet;
	}
	$.extend(Named.prototype,{
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

    var Field;
    (function(){
	var superProto = Named.prototype;
	Field = function(element, recordSet) {
	    superProto.constructor.call(this, element, recordSet);
	}
	Field.prototype = $.extend(heir(superProto),{
	    constructor: Field,
	    getRecord: function(){
		return this.element.closest(this.recordSet.settings.recordSelector);
	    },
	    getValue: function(){
		if ( this.getType() == "html" ) {
		    return this.element.html();
		} else {
		    return superProto.getValue.call(this);
		}
	    },
	    setValue: function(newValue){
		if ( this.getType() == "html" ) {
		    this.element.html(newValue);
		} else {
		    superProto.setValue.call(this,newValue);
		}
	    },
	    fieldIn: function(newField, select){
		this.lockFocusEvents = true;
		this.recordSet.setCurrentField(this.element);
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
		this.element.trigger('fieldin');
		this.lockFocusEvents = false;
	    },
	    fieldOut: function(){
		this.lockFocusEvents = true;
		this.recordSet.setCurrentField($([]));
		if ( this.getValue() !== this.controlGetValue() ) {
		    this.getRecord().dbRecords('setState','dirty');
		}
		this.write();
		this.element.css('visibility',"inherit");
		this.controlHide();
		if ( this.getRecord().dbRecords('getState') == "dirty" ) {
		    this.getRecord().dbRecords('save');
		}
		this.element.trigger('fieldout');
		this.lockFocusEvents = false;
	    },
	    getType: function(){
		return this.element.attr('type');
	    },
	    isEditable: function(){
		return this.getRecord().dbRecords('getState') != "updating";
	    },
	    isTabStop: function(){
		return true;
	    },
	    onMouseUp: function(){
		if ( this.isEditable() ) {
		    this.recordSet.fieldChange(this.element);
		}
	    },
	    onKeyDown: function(event){
		if ( event.altKey ) {
		    return true;
		}
		var records = this.recordSet;
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
		case 83: //s
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
		if ( ! this.lockFocusEvents ) {
		    this.fieldOut();
		}
	    },
	    write: function(){
		this.setValue(this.controlGetValue());
	    },
	    controlShow: function(value){
		getControlFunction.call(this)('show', this.element, value);
	    },
	    controlHide: function(){
		getControlFunction.call(this)('hide');
	    },
	    controlGetValue: function(){
		return getControlFunction.call(this)('getValue');
	    },
	    controlSelectText: function(option){
		getControlFunction.call(this)('selectText', this.element, option);
	    },
	    controlOnResize: function(event){
		getControlFunction.call(this)('onResize', event);
	    }
	 });
	function getControlFunction() {
	    switch(this.getType()){
	    case "input":
		return this.recordSet.fieldInput.bind(this.recordSet);
		break;
	    case "text":
		return this.recordSet.fieldText.bind(this.recordSet);
		break;
	    case "html":
		return this.recordSet.fieldHTML.bind(this.recordSet);
		break;
	    }
	}
     })();

     var containers = $([]);
     $.fn.dbRecords = function() {
	 var target = this;
	 var args = arguments;
	 var returnValue;
	 this.each(function(i, element) {
	     var target = $(element);
	     var RecordSetComponent = target.data('RecordSet');

	     // If target is not a record set container, check to see if it is inside one
	     if ( ! RecordSetComponent ) {
		 var container = target.closest(containers);
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
		     containers = containers.add(target);

		 } else if ( options ) {
		     // Initialize component data
		     RecordSetComponent.init(options);
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