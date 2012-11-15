(function($){
    var RecordSet;
    (function(){
	RecordSet = function(container, options) {
	    var recordSet = this;
	    this.container = $(container);
	    this.container.data('recordSetComponent', this);
	    this.settings = $.extend({
		'inputCellSelector': ".cell:not(.text, .html)",
		'textCellSelector': ".cell.text",
		'htmlCellSelector': ".cell.html",
		'fieldSelector': "[name]",
		'recordSelector': ".record",
		'updateUrl': container.attr('updateUrl'),
		'addUrl': container.attr('addUrl'),
		'deleteUrl': container.attr('deleteUrl')
	    }, options);

	    var selectors = [];
	    if ( this.settings.inputCellSelector ) selectors.push(this.settings.inputCellSelector);
	    if ( this.settings.textCellSelector ) selectors.push(this.settings.textCellSelector);
	    if ( this.settings.htmlCellSelector ) selectors.push(this.settings.htmlCellSelector);
	    this.cellSelector = selectors.join(', ');

	    this.container
		.on('mouseup.dbRecordSet', cellSelector, function(event){
		    $(event.target).dbRecords('onMouseUp');
		})
		.on('keydown.dbRecordSet', cellSelector, cellOnKeyDown.bind(this))
		.on('keyup.dbRecordSet', cellSelector, cellOnKeyUp.bind(this))
		.on('cut.dbRecordSet', cellSelector, cellOnCut.bind(this))
		.on('paste.dbRecordSet', cellSelector, cellOnPaste.bind(this))
		.on('blur.dbRecordSet', cellSelector, cellOnBlur.bind(this))
		.on('update.dbRecordSet', function(){
		    if ( typeof this.currentCell != "undefined" ) {
			this.currentCell.dbCellControl('show', this.currentCell.dbCellControl('getValue'));
		    };
		}.bind(this));
	    $(window)
		.on('resize.dbRecordSet', onResize.bind(this))
		.on('beforeunload.dbRecordSet', onBeforeUnload.bind(this))
		.on('beforeprint.dbRecordSet', onBeforePrint.bind(this));

	    $.extend(RecordSet.prototype,{
		init: function(options) {
		    $.extend(this.settings, options);
		},
		getComponentFor: function(element) {
		    // Returns an object (Cell, Record or Field) representing the target element as a component of this record set
		    var element = $(element);
		    if ( ! element.data('recordSetComponent') ) {
			if ( element.is(this.settings.recordSelector) ) {
			    new Record(element, this);
			} else if ( element.is(this.settings.cellSelector) ) {
			    new Cell(element, this);
			} else if ( element.is(this.settings.fieldSelector) ) {
			   new Field(element, this);
			}
		    }
		    return element.data('recordSetComponent');
		}
	    });
	})();

     var Record;
     (function(){
	 Record = function(container, recordSet) {
	     this.container = $(container);
	     this.container.data('recordSetComponent', this);
	     this.recordSet = recordSet;
	 }
	 $.extend(Record.prototype,{
	     getState: function(){
	     },
	     setState: function(){
	     },
	     save: function(){
	     },
	     delete: function(){
	     }
	 });
	 function action(){
	 }
	 function actionReturn(){
	 }
	 function actionReturnError(){
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
	     },
	     setValue: function(newValue){
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
	     cellIn: function(){
	     },
	     cellOut: function(){
	     },
	     getType: function(){
	     },
	     isEditable: function(){
	     },
	     tabStop: function(){
	     },
	     onMouseUp: function(){
	     },
	     onKeyDown: function(){
	     },
	     onKeyUp: function(){
	     },
	     onCut: function(){
	     },
	     onPaste: function(){
	     },
	     onBlur: function(){
	     }
	 });
     })();

     var states = ['current','dirty','updating','error'];
     function DbRecordSet(container, options) {
	 this.container = container;
	 this.settings = $.extend({
	     'inputCellSelector': ".cell:not(.text, .html)",
	     'textCellSelector': ".cell.text",
	     'htmlCellSelector': ".cell.html",
	     'fieldSelector': ".field, [name]",
	     'recordSelector': ".record",
	     'updateUrl': container.data('updateUrl'),
	     'addUrl': container.data('addUrl'),
	     'deleteUrl': container.data('deleteUrl')
	 }, options);
	 this.inputCells = $(this.container).find(this.settings.inputCellSelector);
	 this.textCells = $(this.container).find(this.settings.textCellSelector);
	 this.htmlCells = $(this.container).find(this.settings.htmlCellSelector);
	 this.cells = this.inputCells
	     .add(this.textCells)
	     .add(this.htmlCells);
	 this.fields = $(this.container).find(this.settings.fieldSelector).add(this.cells);
	 this.records = $(this.container).find(this.settings.recordSelector);

	 this.cells.data('dbRecordSet', this);
	 this.records.data('dbRecordSet', this);
	 
	 var cells = this.cells;
	 this.records.each(function(i,record){
	     $(record).find(cells).data('dbRecordSetRecord', record);
	 });

	 if ( this.inputCells.length > 0 ) {
	     this.container.dbCellInput(this.inputCells);
	 }
	 if ( this.textCells.length > 0 ) {
	     this.container.dbCellTextArea(this.textCells);
	 }
	 if ( this.htmlCells.length > 0 ) {
	     this.container.dbCellHTMLArea(this.htmlCells);
	 }
	 
	 var selectors = [];
	 if ( this.settings.inputCellSelector ) {
	     selectors.push(this.settings.inputCellSelector);
	 }
	 if ( this.settings.textCellSelector ) {
	     selectors.push(this.settings.textCellSelector);
	 }
	 if ( this.settings.htmlCellSelector ) {
	     selectors.push(this.settings.htmlCellSelector);
	 }
	 var cellSelector = selectors.join(', ');
	 this.container
	     .on('mouseup.dbRecordSet', cellSelector, cellOnMouseUp.bind(this))
	     .on('keydown.dbRecordSet', cellSelector, cellOnKeyDown.bind(this))
	     .on('keyup.dbRecordSet', cellSelector, cellOnKeyUp.bind(this))
	     .on('cut.dbRecordSet', cellSelector, cellOnCut.bind(this))
	     .on('paste.dbRecordSet', cellSelector, cellOnPaste.bind(this))
	     .on('blur.dbRecordSet', cellSelector, cellOnBlur.bind(this))
	     .on('update.dbRecordSet', function(){
		 if ( typeof this.currentCell != "undefined" ) {
		     this.currentCell.dbCellControl('show', this.currentCell.dbCellControl('getValue'));
		 };
	     }.bind(this));
	 $(window)
	     .on('resize.dbRecordSet', onResize.bind(this))
	     .on('beforeunload.dbRecordSet', onBeforeUnload.bind(this))
	     .on('beforeprint.dbRecordSet', onBeforePrint.bind(this));
     }
     $.extend(DbCells.prototype, {
	 add: function(record) {
	     var record = $(record);
	     this.records = this.records.add(record);
	     var newInputCells = record.find(this.settings.inputCellSelector);
	     var newTextCells = record.find(this.settings.textCellSelector);
	     var newHtmlCells = record.find(this.settings.htmlCellSelector);

	     if ( newInputCells.length > 0 ) {
		 if ( this.container.dbCellInput('isInitialized') ) {
		     this.container.dbCellInput('add',newInputCells);
		 } else {
		     this.container.dbCellInput(newInputCells);
		 }
		 this.inputCells = this.inputCells.add(newInputCells);
	     }
	     if ( newTextCells.length > 0 ) {
		 if ( this.container.dbCellTextArea('isInitialized') ) {
		     this.container.dbCellTextArea('add',newTextCells);
		 } else {
		     this.container.dbCellTextArea(newTextCells);
		 }
		 this.textCells = this.textCells.add(newTextCells);
	     }
	     if ( newHtmlCells.length > 0 ) {
		 if ( this.container.dbCellHTMLArea('isInitialized') ) {
		     this.container.dbCellHTMLArea('add',newHtmlCells);
		 } else {
		     this.container.dbCellHTMLArea(newHtmlCells);
		 }
		 this.htmlCells = this.htmlCells.add(newHtmlCells);
	     }
	     var newCells = newInputCells.add(newTextCells).add(newHtmlCells);
	     var newFields = record.find(this.settings.fieldSelector).add(newCells);

	     this.cells = this.cells.add(newCells);
	     this.fields = this.fields.add(newFields);
	     newCells.data('dbRecordSet', this);
	     newCells.data('dbRecordSetRecord', $(record)[0]);
	 },
	 remove: function(record) {
	     var record = $(record);
	     var fields = record.find(this.fields);
	     var cells = record.find(this.cells);
	     cells.each(function(i,cell){
		 $(cell).dbCellControl('remove');
	     });
	     this.inputCells = this.inputCells.not(cells);
	     this.textCells = this.textCells.not(cells);
	     this.htmlCells = this.htmlCells.not(cells);
	     this.cells = this.cells.not(cells);
	     this.fields = this.fields.not(fields);
	     cells.removeData('dbRecordSet');
	     cells.removeData('dbRecordSetRecord');
	 },
	 save: function(async) {
	     var dbRecordSet = this;
	     this.records.each(function(i,record) {
		 dbRecordSet.recordSave(record,async);
	     });
	 },
	 recordSave: function(record, async) {
	     var record = $(record);
	     var action = record.data('saveAction');
	     if ( typeof action == "undefined" ) {
		 action = this.settings.saveAction;
	     }
	     switch(action) {
	     case 'update':
		 var url = record.data('updateUrl');
		 if ( typeof url == "undefined" ) {
		     url = this.settings.updateUrl;
		 }
		 break;
	     case 'add':
		 var url = record.data('addUrl');
		 if ( typeof url == "undefined" ) {
		     url = this.settings.addUrl;
		 }
		 break;
	     default:
		 if ( record.data('updateUrl') ) {
		     action = 'update';
		     url = record.data('updateUrl');
		 } else if ( record.data('addUrl') ) {
		     action = 'add';
		     url = record.data('addUrl');
		 } else if ( this.settings.updateUrl ) {
		     action = 'update';
		     url = this.settings.updateUrl;
		 } else if ( this.settings.addUrl ) {
		     action = 'add';
		     url = this.settings.addUrl;
		 } else {
		     action = 'save';
		 }
	     }
	     if ( typeof url == "undefined" ) {
		 $.error('Could not '+action+' record - no url provided');
	     }
	     this.recordAction(record,action,url,recordActionReturn.bind(this,record,action),async);
	 },
	 recordDelete: function(record, async) {
	     var record = $(record);
	     var url = record.data('deleteUrl');
	     if ( typeof url == "undefined" ) {
		 url = this.settings.deleteUrl;
	     }
	     if ( typeof url == "undefined" ) {
		 $.error('Could not delete record - no url provided');
	     }
	     this.recordAction(record,'delete',url,recordActionReturn.bind(this,cell,'delete'),async);
	 },
	 cellChange: function(newCell) {
	     //console.log("Cell change to " + newCell.text());
	     if ( typeof this.currentCell != "undefined" ) {
		 this.cellOut(this.currentCell);
	     }
	     this.cellIn(newCell);
	     //console.log("/cellChange");
	 },
	 cellIn: function(cell, select) {
	     //console.log("dbRecordSet cellIn to " + cell.text());
	     var cell = $(cell);
	     cell.data('focussing',true);
	     this.currentCell = cell;
	     cell.css('visibility', "hidden");
	     if ( typeof getCellState(cell) == "undefined" ) {
		 this.setCellState(cell,'current');
	     }
	     var cellValue = this.getCellValue(cell);
	     cell.dbCellControl('show',cellValue);

	     if (select) {
		 cell.dbCellControl('selectText',text);
	     } else if ( cell.data('cellInSelect') != null ) {
		 cell.dbCellControl('selectText',cell.data('cellInSelect'));
	     } else {
		 cell.dbCellControl('selectText','all');
	     }
	     cell.trigger('cellin');
	     cell.removeData('focussing');
	     //console.log("/cellIn");
	 },
	 cellOut: function(cell) {
	     //console.log("dbRecordSet cellOut from " + cell.text());
	     var cell = $(cell);
	     var record = cell.data('dbRecordSetRecord');
	     this.currentCell = undefined;
	     var oldValue = this.getCellValue(cell);
	     var newValue = cell.dbCellControl('getValue');
	     if ( oldValue != newValue ) {
		 this.setCellState(cell,'dirty');
		 this.setRecordState(record,'dirty');
	     }
	     cellWrite.call(this,cell);
	     cell.css('visibility', "inherit");
	     cell.dbCellControl('hide');
	     if ( this.settings.updateType == "onKeyUp" ) {
		 this.cancelDelayedRecordSave(record);
	     }
	     if ( this.getRecordState(record) == "dirty" ) {
		 this.recordSave(record);
	     }
	     cell.trigger('cellout.dbRecordSet');
	     //console.log("/cellOut");
	 },
	 setCellState: function(cell,state) {
	     $(cell).removeClass(states.join(' ')).addClass(state);
	 },
	 getCellState: function(cell) {
	     var cell = $(cell);
	     var cellState;
	     $.each(states, function(i, state){
		 if ( cell.hasClass(state) ) {
		     cellState = state;
		     return false;
		 }
	     });
	     return cellState;
	 },
	 setRecordState: function(record,state) {
	     $(record).removeClass(states.join(' ')).addClass(state);
	 },
	 getRecordState: function(record) {
	     var record = $(record);
	     var recordState;
	     $.each(states, function(i, state){
		 if ( record.hasClass(state) ) {
		     recordState = state;
		     return false;
		 }
	     });
	     return recordState;
	 },
	 getCellValue: function(cell) {
	     var cell = $(cell);
	     switch(this.getCellType(cell)){
	     case 'html':
	     case 'htmlarea':
		 return cell.html();
		 break;
	     default:
		 return unescapeHTML(cell.html());
		 break;
	     }
	 },
	 setCellValue: function(cell, value) {
	     var cell = $(cell);
	     switch(this.getCellType(cell)){
	     case 'html':
	     case 'htmlarea':
		 cell.html(value);
		 break;
	     default:
		 cell.html(escapeHTML(value));
		 break;
	     }
	 },
	 getCellType: function(cell) {
	     return $(cell).dbCellControl('getType');
	 },
	 isCellEditable: function(cell) {
	     var cell = $(cell);
	     var state = this.getCellState(cell);
	     if ( typeof state == "undefined" ) {
		 this.setCellState(cell,'current');
	     }
	     return state != 'updating';
	 },
	 isTabStop: function(cell) {
	     return true;
	 },
	 recordAction: function(record, type, url, handler, async) {
	     var record = $(record);
	     var dbRecordSet = this;
	     if ( typeof(handler) == "undefined" ) {
		 handler = recordActionReturn.bind(this,record,type);
	     }
	     if (typeof(async) == "undefined") {
		 async = true;
	     }
	     this.setRecordState(record,'updating');
	     record.find(this.cells).each(function(i, cell) {
		 dbRecordSet.setCellState(cell,'updating');
	     });

	     if ( typeof this.currentCell != "undefined" ) {
		 cellWrite.call(this);
	     }

	     var data = {};
	     record.find(this.fields).each(function(i, field) {
		 var name = field.data('name');
		 var value = dbRecordSet.getFieldValue(field);
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
	     deferred.fail(recordActionReturnError.bind(this,record,type));
	     httpPost(url,data,deferred.resolve.bind(deferred),deferred.reject.bind(deferred));
	     record.trigger('recordAction',[type,deferred]);
	 },
	 setStatus: function(msg){
	     this.trigger('statuschange',[msg])
	 },
	 getFieldValue: function(field) {
	     var field = $(field);
	     if ( this.cells.index(field) >= 0 ) {
		 return this.getCellValue(field);
	     } else if ( field.is('input, select, textarea') ) {
		 return field.val();
	     } else {
		 return field.text();
	     }
	 },
	 setFieldValue: function(field, value) {
	     var field = $(field);
	     if ( this.cells.index(field) >- 0 ) {
		 this.setCellValue(field, value);
	     } else if ( field.is('input, select, textarea') ) {
		 field.val(value);
	     } else {
		 field.text(value);
	     }
	 }
     });
     function recordActionReturn(record,type,xmlDoc) {
	 var dbRecordSet = this;
	 var record = $(record);
	 dbRecordSet.setRecordState(record,'current');
	 record.find(dbRecordSet.cells).each(function(i, cell) {
	     dbRecordSet.setCellState(cell,'current');
	 });
	 if ( type == "update" ) {
	     record.find(dbRecordSet.fields).each(function(i, field) {
		 var node = $(xmlDoc).find('records record ' + field.data('name'));
		 if ( node.length > 0 ) {
		     dbRecordSet.setFieldValue(field,node.text());
		 }
	     });
	 }
	 $(xmlDoc).find('calculated *').each(function(i, node){
	     dbRecordSet.container.find('#'+node.nodeName).each(function(j, target){
		 if ( $(target).is('input, select, textarea') ) {
		     $(target).val($(node).text());
		 } else {
		     $(target).html($(node).text());
		 }
	     });
	 });
	 $(xmlDoc).find('html *').each(function(i, node){
	     $('#'+node.nodeName).each(function(j, target){
		 if ( $(target).is('input, select, textarea') ) {
		     $(target).val($(node).text());
		 } else {
		     $(target).html($(node).text());
		 }
	     });
	 });
	 if ( $(xmlDoc).find('info').length > 0 ) {
	     this.setStatus($(xmlDoc).find('info').text());
	 }
	 if ( $(xmlDoc).find('alert').length > 0 ) {
	     alert($(xmlDoc).find('alert').text());
	 }
	 record.trigger('recordActionReturn',[type, xmlDoc]);
     }
     function recordActionReturnError(record,type,errorMessage,errorType) {
	 var dbRecordSet = this;
	 var record = $(record);
	 this.setRecordState(record,'error');
	 record.find(this.cells).each(function(i, cell){
	     dbRecordSet.setCellState(cell,'error');
	 });
	 if ( errorType != 'USER' ) {
	     alert(errorMessage);
	 }
	 record.trigger('recordActionReturnError',[type,errorMessage,errorType]);
     }
     function onBeforeUnload(event) {
	 if ( typeof this.currentCell == "undefined" ) {
	     return false;
	 }
	 if ( this.getCellState(this.currentCell) == 'dirty' ) {
	     if ( window.confirm('Do you want to save your changes?') ) {
		 var record = cell.data('dbRecordSetRecord');
		 this.recordSave(record, false);
		 if ( this.getCellState(this.currentCell) == 'error' ) {
		     return "Your changes could not be saved.\nStay on the current page to correct.";
		 }
	     }
	 }
     }
     function onBeforePrint(event) {
	 if ( typeof this.currentCell != "undefined" ) {
	     this.cellOut(this.currentCell);
	 }
     }
     function onResize(event) {
	 if ( typeof this.currentCell != "undefined" ) {
	     this.cellOut(this.currentCell);
	 }
     }
     function cellOnBlur(event) {
	 //console.log("dbRecordSet cellOnBlur " + $(event.target).text());
	 if ( $(event.target).is(this.currentCell) && ! this.currentCell.data('focussing') ) {
	     this.cellOut(this.currentCell);
	 }
	 //console.log("/cellOnBlur");
     }
     function cellOnKeyDown(event) {
	 //console.log("dbRecordSet cellOnKeyDown " + event.which);
	 // cell controls should only propogate key events when default dbRecordSet behavior is desired.
	 if ( event.altKey ) {
	     return true;
	 }
	 switch (event.which) {
	 case 37: //left
	     this.cellChange(moveLeft.call(this,this.curentCell));
	     break;
	 case 38: //up
	     this.cellChange(moveUp.call(this,this.currentCell));
	     break;
	 case 39: //right
	     this.cellChange(moveRight.call(this,this.currentCell));
	     break;
	 case 40: //down
	     this.cellChange(moveDown.call(this,this.currentCell));
	     break;
	 case 9: //tab
	     var oldCell = this.currentCell;
	     if ( event.shiftKey ) {
		 this.cellChange(moveLeft.call(this,this.currentCell));
	     } else {
		 this.cellChange(moveRight.call(this,this.currentCell));
	     }
	     break;
	 case 13: //return
	     var oldCell = this.currentCell;	    
	     this.cellChange(moveRight.call(this,this.currenCell));
	     if ( this.currentCell == oldCell ) {
		 this.save();
	     }
	     break;
	 case 46: //delete
	     if ( typeof this.currentCell.data('deleteUrl') != "undefined" ) {
		 var cell = this.currentCell;
		 this.cellOut(cell);
		 this.cellAction(cell,'delete',cell.data('deleteUrl'));
	     }
	     break;
	 case 83: //s
	     if ( event.ctrlKey ) {
		 this.save();
		 event.preventDefault();
	     }
	     break;
	 }
	 //console.log("/cellOnKeyDown");
     }
     function cellOnMouseUp(event) {
	 var cell = $(event.target);
	 if ( this.cells.index(cell) > -1 ) {
	     if ( this.isCellEditable(cell) ) {
		 this.cellChange(cell);
	     }
	 }
     }
     function cellWrite(cell) {
	 if ( typeof cell != "object" ) {
	     $.error('cellWrite requires a cell');
	 }
	 this.setCellValue(cell,cell.dbCellControl('getValue'));
     }
     function cellOnKeyUp(event) {
	 //console.log("dbRecordSet onKeyUp " + event.which);
	 var cell = $(event.target);
	 var oldValue = this.getCellValue(cell);
	 var newValue = cell.dbCellControl('getValue');
	 if ( oldValue != newValue ) {
	     this.setCellState(cell,'dirty');
	 }
	 if ( this.settings.updateType == "onKeyUp" ) {
	     this.cancelDelayedSave();
	     this.keyUpTimer = setTimeout(this.delayedSave.bind(this),750);
	 }
	 //console.log("/onKeyUp");
     }
     function cellOnCut(event) {
	 this.setCellState(this.currentCell,'dirty');
     }
     function cellOnPaste(event) {
	 this.setCellState(this.currentCell,'dirty');
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

     function moveRight(fromCell) {
	 if ( typeof fromCell != "object" ) {
	     var fromCell = this.currentCell;
	 }
	 var nextCell;
	 var fromCellLeft = fromCell.offset().left;
	 this.cells.each(function() {
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
	     this.cells.each(function() {
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
     }
     function moveLeft(fromCell) {
	 if ( typeof fromCell != "object" ) {
	     var fromCell = this.currentCell;
	 }
	 var nextCell;
	 var fromCellLeft = fromCell.offset().left;
	 this.cells.each(function() {
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
	     this.cells.each(function() {
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
     }
     function moveUp(fromCell) {
	 if ( typeof fromCell != "object" ) {
	     var fromCell = this.currentCell;
	 }
	 var nextCell;
	 var fromCellTop = fromCell.offset().top;
	 this.cells.each(function() {
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
	     this.cells.each(function() {
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
     }
     function moveDown(fromCell) {
	 if ( typeof fromCell != "object" ) {
	     var fromCell = this.currentCell;
	 }
	 var nextCell;
	 var fromCellTop = fromCell.offset().top;
	 this.cells.each(function() {
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
	     this.cells.each(function() {
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

     var containers = $([]);
     $.fn.dbRecords = function() {
	 var target = this;
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
	     if ( arguments.length == 0 || typeof arguments[0] == "object" ) {
		 var options = arguments[0];

		 // Construct a new record set with target as container
		 if ( ! RecordSetComponent ) {
		     new RecordSet(target, options);
		     containers = containers.add(target);

		 } else if ( options ) {
		     // Initialize component data
		     RecordSetComponent.init(options);
		 }

	     } else if ( typeof arguments[0] == "string" ) {
		 // Called with a method name, attempt to call the method
		 var method = arguments[0];
		 if ( typeof RecordSetComponent[method] == "function" ) {
		     returnValue = RecordSetComponent[method].apply(RecordSetComponent, Array.prototype.slice.call(arguments,1));
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