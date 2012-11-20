(function($){
    var RecordSet;
    (function(){
	RecordSet = function(container, options) {
	    var recordSet = this;
	    this.container = $(container);
	    this.container.data('RecordSet', this);
	    this.settings = $.extend({
		'inputCellSelector': '.cell[type!="text"][type!="html"]',
		'textCellSelector': '.cell[type="text"]',
		'htmlCellSelector': '.cell[type="html"]',
		'fieldSelector': "[name]",
		'recordSelector': ".record",
		'updateURL': container.attr('updateURL'),
		'addURL': container.attr('addURL'),
		'deleteURL': container.attr('deleteURL')
	    }, options);
	    this.currentCell = $([]);

	    var selectors = [];
	    if ( this.settings.inputCellSelector ) selectors.push(this.settings.inputCellSelector);
	    if ( this.settings.textCellSelector ) selectors.push(this.settings.textCellSelector);
	    if ( this.settings.htmlCellSelector ) selectors.push(this.settings.htmlCellSelector);
	    var cellSelector = this.settings.cellSelector = selectors.join(', ');

	    this.container
		.on('mouseup.dbRecordSet', cellSelector, function(event){
		    $(event.target).dbRecords('onMouseUp',event);
		})
		.on('keydown.dbRecordSet', cellSelector, function(event){
		    $(event.target).dbRecords('onKeyDown',event);
		})
		.on('keyup.dbRecordSet', cellSelector, function(event){
		    $(event.target).dbRecords('onKeyUp',event);
		})
		.on('cut.dbRecordSet', cellSelector, function(event){
		    $(event.target).dbRecords('onCut',event);
		})
		.on('paste.dbRecordSet', cellSelector, function(event){
		    $(event.target).dbRecords('onPaste',event);
		})
		.on('blur.dbRecordSet', cellSelector, function(event){
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
		// Returns an object (Cell, Record or Field) representing the target element as a component of this record set
		var element = $(element);
		if ( element.data('recordSetComponent') ) {
		    return element.data('recordSetComponent');
		} else if ( element.is(this.settings.recordSelector) ) {
		    return new Record(element, this);
		} else if ( element.is(this.settings.cellSelector) ) {
		    return new Cell(element, this);
		} else if ( element.is(this.settings.fieldSelector) ) {
		    return new Field(element, this);
		}
	    },
	    save: function(aysnc) {
		this.getCurrentRecord.dbRecords('save',async);
	    },
	    getCurrentRecord: function() {
		return this.currentCell.dbRecords('getRecord');
	    },
	    getCurrentCell: function() {
		return this.currentCell;
	    },
	    setCurrentCell: function(newCell) {
		this.currentCell = $(newCell);
	    },
	    cellChange: function(newCell) {
		this.currentCell.dbRecords('cellOut');
		newCell.dbRecords('cellIn');
	    },
	    inputControl: function() {
		return this.container.cellInput.apply(this.container, arguments);
	    },
	    textControl: function() {
		return this.container.cellTextArea.apply(this.container, arguments);
	    },
	    htmlControl: function() {
		return this.container.cellHTMLArea.apply(this.container, arguments);
	    },
	    moveLeft: function(fromCell) {
		var nextCell;
		var fromCellLeft = fromCell.offset().left;
		var cells = this.container.find(this.settings.cellSelector);
		cells.each(function() {
		    var cell = $(this);
		    var cellLeft = cell.offset().left;
		    if ( sameRow(cell,fromCell)
			 && cellLeft < fromCellLeft
			 && ( typeof nextCell == "undefined" || cellLeft > nextCellLeft )
		       ) {
			nextCell = cell;
			nextCellLeft = cellLeft;
		    }
		});
		if ( typeof nextCell == "undefined" ) {
		    cells.each(function() {
			var cell = $(this);
			var cellLeft = $(cell).offset().left;
			if ( aboveRow(fromCell,cell)
			     && (typeof nextCell == "undefined"
				 || belowRow(nextCell,cell)
				 || (sameRow(cell,nextCell) && cellLeft > nextCellLeft )
				)
			   ) {
			    nextCell = cell;
			    nextCellLeft = cellLeft;
			}
		    });
		}
		if ( typeof nextCell == "undefined" ) {
		    return fromCell;
		} else {
		    return nextCell;
		}
	    },
	    moveRight: function(fromCell) {
		var nextCell;
		var fromCellLeft = fromCell.offset().left;
		var cells = this.container.find(this.settings.cellSelector);
		cells.each(function() {
		    var cell = $(this);
		    var cellLeft = cell.offset().left;
		    if ( sameRow(cell,fromCell)
			 && cellLeft > fromCellLeft
			 && ( typeof nextCell == "undefined" || cellLeft < nextCellLeft )
		       ) {
			nextCell = cell;
			nextCellLeft = cellLeft;
		    }
		});
		if ( typeof nextCell == "undefined" ) {
		    cells.each(function() {
			var cell = $(this);
			var cellLeft = $(cell).offset().left;
			if ( belowRow(fromCell,cell)
			     && (typeof nextCell == "undefined"
				 || aboveRow(nextCell,cell)
				 || (sameRow(cell,nextCell) && cellLeft < nextCellLeft)
				)
			   ) {
			    nextCell = cell;
			    nextCellLeft = cellLeft;
			}
		    });
		}
		if ( typeof nextCell == "undefined" ) {
		    return fromCell;
		} else {
		    return nextCell;
		}
	    },
	    moveUp: function(fromCell) {
		var nextCell;
		var fromCellTop = fromCell.offset().top;
		var cells = this.container.find(this.settings.cellSelector);
		cells.each(function() {
		    var cell = $(this);
		    var cellTop = cell.offset().top;
		    if ( sameColumn(fromCell,cell)
			 && cellTop < fromCellTop
			 && (typeof nextCell == "undefined" || cellTop > nextCellTop)
		       ) {
			nextCell = cell;
			nextCellTop = cellTop;
		    }
		});
		if ( typeof nextCell == "undefined" ) {
		    cells.each(function() {
			var cell = $(this);
			var cellTop = cell.offset().top;
			if ( leftOfColumn(fromCell,cell)
			     && (typeof nextCell == "undefined"
				 || rightOfColumn(nextCell,cell)
				 || (sameColumn(cell,nextCell) && cellTop > nextCellTop)
				)
			   ) {
			    nextCell = cell;
			    nextCellTop = cellTop;
			};
		    });
		}
		if ( typeof nextCell == "undefined" ) {
		    return fromCell;
		} else {
		    return nextCell;
		}
	    },
	    moveDown: function(fromCell) {
		var nextCell;
		var fromCellTop = fromCell.offset().top;
		var cells = this.container.find(this.settings.cellSelector);
		cells.each(function() {
		    var cell = $(this);
		    var cellTop = cell.offset().top;
		    if ( sameColumn(fromCell,cell)
			 && cellTop > fromCellTop
			 && ( typeof nextCell == "undefined" || cellTop < nextCellTop )
		       ) {
			nextCell = cell;
			nextCellTop = cellTop;
		    }
		});
		if ( typeof nextCell == "undefined" ) {
		    cells.each(function() {
			var cell = $(this);
			var cellTop = cell.offset().top;
			if ( rightOfColumn(fromCell,cell)
			     && ( typeof nextCell == "undefined"
				  || leftOfColumn(nextCell,cell)
				  || (sameColumn(cell,nextCell) && cellTop < nextCellTop)
				)
			   ) {
			    nextCell = cell;
			    nextCellTop = cellTop;
			}
		    });
		}
		if ( typeof nextCell == "undefined" ) {
		    return fromCell;
		} else {
		    return nextCell;
		}
	    }
	});
	function onResize(){
	    this.getCurrentCell().dbRecords('cellOut');
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
	    this.getCurrentCell().dbRecords('cellOut');
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
		this.getCurrentCell().dbRecords('write');

		var data = {};
		this.getFields().each(function(i, field) {
		    var name = $(field).dbRecords('getName');
		    var value = $(field).dbRecords('getValue');
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
	    getCurrentCell: function(){
		return this.container.find(this.recordSet.getCurrentCell());
	    },
	    getFields: function(){
		return this.container.find(this.recordSet.settings.fieldSelector);
	    },
	    getCells: function(){
		return this.container.find(this.recordSet.settings.cellSelector);
	    }
	});
	function actionReturn(action,xmlDoc){
	    this.setState('current');
	    if ( action == "update" ) {
		this.getFields().each(function(i, field) {
		    var node = $(xmlDoc).find('records record ' + $(field).dbRecords('getName'));
		    if ( node.length > 0 ) {
			$(field).dbRecords('setValue',node.text());
		    }
		});
	    }
	}
	function actionReturnError(action,message,type){
	    this.setState('error');
	    if ( type != 'USER' ) {
		alert(message);
	    }
	}
    })();

    var Field;
    (function(){
	Field = function(element, recordSet) {
	    this.element = $(element);
	    this.element.data('recordSetComponent', this);
	    this.recordSet = recordSet;
	}
	$.extend(Field.prototype,{
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

    var Cell;
    (function(){
	var superProto = Field.prototype;
	Cell = function(element, recordSet) {
	    superProto.constructor.call(this, element, recordSet);
	}
	Cell.prototype = $.extend(heir(superProto),{
	    constructor: Cell,
	    getRecord: function(){
		return this.element.closest(this.recordSet.settings.recordSelector);
	    },
	    getValue: function(){
		if ( this.getType() == "htmlarea" ) {
		    return this.element.html();
		} else {
		    return unescapeHTML(this.element.html());
		}
	    },
	    setValue: function(newValue){
		if ( this.getType() == "htmlarea" ) {
		    this.element.html(newValue);
		} else {
		    this.element.html(escapeHTML(newValue));
		}
	    },
	    cellIn: function(newCell, select){
		this.lockFocusEvents = true;
		this.recordSet.setCurrentCell(this.element);
		this.element.css('visibility', "hidden");

		var cellValue = this.getValue();
		this.cellControl('show',cellValue);

		if (select) {
		    this.cellControl('selectText',select);
		} else if ( this.element.attr('cellInSelect') != null ) {
		    this.cellControl('selectText',this.element.attr('cellInSelect'));
		} else {
		    this.cellControl('selectText','all');
		}
		this.element.trigger('cellin');
		this.lockFocusEvents = false;
	    },
	    cellOut: function(){
		this.lockFocusEvents = true;
		this.recordSet.setCurrentCell($([]));
		if ( this.getValue() !== this.cellControl('getValue') ) {
		    this.getRecord().dbRecords('setState','dirty');
		}
		this.write();
		this.element.css('visibility',"inherit");
		this.cellControl('hide');
		if ( this.getRecord().dbRecords('getState') == "dirty" ) {
		    this.getRecord().dbRecords('save');
		}
		this.element.trigger('cellout');
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
		    this.recordSet.cellChange(this.element);
		}
	    },
	    onKeyDown: function(event){
		if ( event.altKey ) {
		    return true;
		}
		var records = this.recordSet;
		var cell = this.element;
		switch (event.which) {
		case 37: //left
		    records.cellChange(records.moveLeft(cell));
		    break;
		case 38: //up
		    records.cellChange(records.moveUp(cell));
		    break;
		case 39: //right
		    records.cellChange(records.moveRight(cell));
		    break;
		case 40: //down
		    records.cellChange(records.moveDown(cell));
		    break;
		case 9: //tab
		    if ( event.shiftKey ) {
			var newCell = records.moveLeft(cell);
		    } else {
			var newCell = records.moveRight(cell);
		    }
		    if ( newCell == cell ) {
			this.getRecord().dbRecords('save');
		    } else {
			records.cellChange(newCell);
		    }
		    break;
		case 13: //return
		    var newCell = records.moveRight(cell);
		    if ( newCell == cell ) {
			this.getRecord().dbRecords('save');
		    } else {
			records.cellChange(newCell);
		    }
		    break;
		case 46: //delete
		    if ( this.getRecord().dbRecords('getUrl','delete') ) {
			this.cellOut();
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
		if ( this.getValue() !== this.cellControl('getValue') ) {
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
		    this.cellOut();
		}
	    },
	    write: function(){
		this.setValue(this.cellControl('getValue'));
	    },
	    cellControl: function(method){
		var args = [method, this.element].concat(Array.prototype.slice.call(arguments,1));
		switch(this.getType()){
		case "input":
		    return this.recordSet.inputControl.apply(this.recordSet,args);
		    break;
		case "textarea":
		    return this.recordSet.textControl.apply(this.recordSet,args);
		    break;
		case "htmlarea":
		    return this.recordSet.htmlControl.apply(this.recordSet,args);
		    break;
		}
	    }
	 });
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