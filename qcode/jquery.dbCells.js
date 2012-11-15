(function($){
    var states = ['current','dirty','updating','error'];
    function DbCells(container, options) {
	this.container = container;
	this.settings = $.extend({
	    'inputCellSelector': ".cell:not(.text, .html)",
	    'textCellSelector': ".cell.text",
	    'htmlCellSelector': ".cell.html",
	    'initalFocus': true,
	    'enabled': true,
	    'updateType': "cellOut"
	}, options);
	this.inputCells = $(this.settings.inputCellSelector, this.container);
	this.textCells = $(this.settings.textCellSelector, this.container);
	this.htmlCells = $(this.settings.htmlCellSelector, this.container);
	this.cells = this.inputCells
	    .add(this.textCells)
	    .add(this.htmlCells);
	this.cells.data('dbCells', this);

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
	    .on('mouseup.dbCells', cellSelector, cellOnMouseUp.bind(this))
	    .on('keydown.dbCells', cellSelector, cellOnKeyDown.bind(this))
	    .on('keyup.dbCells', cellSelector, cellOnKeyUp.bind(this))
	    .on('cut.dbCells', cellSelector, cellOnCut.bind(this))
	    .on('paste.dbCells', cellSelector, cellOnPaste.bind(this))
	    .on('blur.dbCells', cellSelector, cellOnBlur.bind(this))
	    .on('update.dbCells', function(){
		if ( typeof this.currentCell != "undefined" ) {
		    this.currentCell.dbCellControl('show', this.currentCell.dbCellControl('getValue'));
		};
	    }.bind(this));
	$(window)
	    .on('resize.dbCells', onResize.bind(this))
	    .on('beforeunload.dbCells', onBeforeUnload.bind(this))
	    .on('beforeprint.dbCells', onBeforePrint.bind(this));
    }
    $.extend(DbCells.prototype, {
	add: function(cell, type) {
	    if ( typeof type == "undefined" ) {
		if ( cell.is(this.settings.textCellSelector) ) {
		    var type = "textarea";
		} else if ( cell.is(this.settings.htmlCellSelector) ) {
		    var type = "htmlarea";
		} else {
		    var type = "text";
		}
	    }
	    switch (type) {
	    case "text":
		if ( this.container.dbCellInput('isInitialized') ) {
		    this.container.dbCellInput('add',cell);
		} else {
		    this.container.dbCellInput(cell);
		}
		this.inputCells = this.inputCells.add(cell);
		break;
	    case "textarea":
		if ( this.container.dbCellTextArea('isInitialized') ) {
		    this.container.dbCellTextArea('add',cell);
		} else {
		    this.container.dbCellTextArea(cell);
		}
		this.textCells = this.textCells.add(cell);
		break;
	    case "htmlarea":
		if ( this.container.dbCellHTMLArea('isInitialized') ) {
		    this.container.dbCellHTMLArea('add',cell);
		} else {
		    this.container.dbCellHTMLArea(cell);
		}
		this.htmlCells = this.htmlCells.add(cell);
		break;
	    }
	    this.cells = this.cells.add(cell);
	    cell.data('dbCells', this);
	},
	remove: function(cell) {
	    var type = this.getCellType(cell);
	    cell.dbCellControl('remove');
	    switch(type) {
	    case "text":
		this.inputCells = this.inputCells.not(cell);
		break;
	    case "textarea":
		this.textCells = this.textCells.not(cell);
		break;
	    case "htmlarea":
		this.htmlCells = this.htmlCells.not(cell);
		break;
	    }
	    this.cells = this.cells.not(cell);
	    cell.removeData('dbCells');
	},
	save: function(cell,async) {
	    var dbCells = this;
	    if ( typeof cell == "undefined" ) {
		var cell = this.currentCell;
	    }
	    if ( cell.data('deleteWhenEmpty') && this.getCellValue(cell) === "" ) {
		this.delete(cell,async);
		cell.trigger('save');
	    } else if ( typeof cell.data('updateUrl') != "undefined" ) {
		dbCells.cellAction(cell,'update',cell.data('updateUrl'),cellActionReturn.bind(dbCells,cell,'update'),async);
		cell.trigger('save');
	    } else if ( typeof cell.data('addUrl') != "undefined" ) {
		dbCells.cellAction(cell,'add',cell.data('addUrl'),cellActionReturn.bind(dbCells,cell,'add'),async);
		cell.trigger('save');
	    }
	},
	delete: function(cell,async) {
	    if ( typeof cell == "undefined" ) {
		var cell = this.currentCell;
	    }
	    if ( typeof cell.data('deleteUrl') != "undefined" ) {
		this.cellAction(cell,'delete',cell.data('deleteUrl'),cellActionReturn.bind(this,cell,'delete'),async);
		cell.trigger('delete');
	    }
	},
	cellChange: function(newCell) {
	    if ( typeof this.currentCell != "undefined" ) {
		//console.log("Cell change from " + this.currentCell.text() + " to " + newCell.text());
		this.cellOut(this.currentCell);
	    } else {
		//console.log("Cell change to " + newCell.text());
	    }
	    this.cellIn(newCell);
	    //console.log("/cellChange");
	},
	focus: function() {
	    //console.log("dbCells focus");
	    if ( typeof this.currentCell != "undefined" ) {
		this.cellIn(this.currentCell);
	    }
	    //console.log("/focus");
	},
	setDirty: function() {
	    if ( typeof this.currentCell != "undefined" ) {
		this.setCellState(currentCell,'dirty');
	    }
	},
	cellIn: function(cell, select) {
	    //console.log("dbCells cellIn to " + cell.text());
	    if ( typeof cell != "object" ) {
		$.error('cellIn requires a cell');
	    }
	    cell.data('focussing',true);
	    this.currentCell = cell;
	    this.currentCell.css('visibility', "hidden");
	    if ( typeof this.getCellState(cell) == "undefined" ) {
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
	    cell.trigger('cellin.dbCells');
	    cell.removeData('focussing');
	    //console.log("/cellIn");
	},
	cellOut: function(cell) {
	    if ( typeof cell != 'object' ) {
		$.error('cellOut requires a cell');
	    }
	    this.currentCell = undefined;
	    //console.log("dbCells cellOut from " + cell.text());
	    var oldValue = this.getCellValue(cell);
	    var newValue = cell.dbCellControl('getValue');
	    if ( oldValue != newValue ) {
		this.setCellState(cell,'dirty');
	    }
	    cellWrite.call(this,cell);
	    cell.css('visibility', "inherit");
	    cell.dbCellControl('hide');
	    if ( this.settings.updateType == "onKeyUp" ) {
		this.cancelDelayedSave();
	    }
	    if ( this.getCellState(cell) == "dirty" ) {
		this.save(cell);
	    }
	    cell.trigger('cellout.dbCells');
	    //console.log("/cellOut");
	},
	setCellState: function(cell,state) {
	    if ( typeof cell != "object" || typeof state != "string" || states.indexOf(state) < 0 ) {
		$.error('Invalid arguments for setCellState');
	    }
	    cell.removeClass(states.join(' ')).addClass(state);
	},
	getCellState: function(cell) {
	    if ( typeof cell != "object" ) {
		$.error('getCellState requires a cell');
	    }
	    var cellState;
	    $.each(states, function(i, state){
		if ( cell.hasClass(state) ) {
		    cellState = state;
		}
	    });
	    return cellState;
	},
	getCellValue: function(cell) {
	    if ( typeof cell != "object" ) {
		$.error('getCellValue requires a cell');
	    }
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
	    if ( typeof cell != "object" || typeof value != "string" ) {
		$.error('Invalid arguments for setCellValue');
	    }
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
	    if ( typeof cell != "object" ) {
		$.error('getCellType requires a cell');
	    }
	    return cell.dbCellControl('getType');
	},
	delayedSave: function() {
	    if ( typeof this.currentCell == "object"
		 && this.getCellState(this.currentCell) == 'dirty' ) {
		this.save();
	    }
	},
	cancelDelayedSave: function() {
	    if ( typeof this.keyUpTimer != "undefined" ) {
		clearTimeout(this.keyUpTimer);
		this.keyUpTimer = undefined;
	    }
	},
	isCellEditable: function(cell) {
	    if ( typeof cell != "object" ) {
		$.error('isCellEditable requires a cell');
	    }	    
	    var state = this.getCellState(cell);
	    if ( typeof state == "undefined" ) {
		this.setCellState(cell,'current');
	    }
	    return state != 'updating';
	},
	isTabStop: function() {
	    return true;
	},
	cellAction: function(cell,type,url,handler,async) {
	    if ( typeof(handler) == "undefined" ) {
		handler = cellActionReturn.bind(this,cell,type);
	    }
	    if (typeof(async) == "undefined") {
		async = true;
	    }
	    
	    this.setCellState(cell,'updating');

	    if ( typeof this.currentCell != "undefined" ) {
		cellWrite.call(this);
	    }

	    var name = cell.data('name');
	    var value = this.getCellValue(cell);
	    var data = {};
	    data[name] = value;
	    
	    var re = /([^\?]+)\??(.*)/;
	    re.exec(url);
	    var path = RegExp.$1;
	    var queryString = RegExp.$2;
	    $.each(queryString.split('&'),function(i, pair){
		data[pair.split('=')[0]] = pair.split('=')[1];
	    });

	    var deferred = new jQuery.Deferred();
	    deferred.done(handler);
	    deferred.fail(cellActionReturnError.bind(this,cell,type));
	    httpPost(url,data,deferred.resolve.bind(deferred),deferred.reject.bind(deferred));
	    cell.trigger('cellAction',[type,deferred]);
	},
	setStatus: function(msg){
	    this.trigger('statuschange',[msg])
	}
    });
    function cellActionReturn(cell,type,xmlDoc) {
	var dbCells = this;
	dbCells.setCellState(cell,'current');
	if ( type == "update" ) {
	    var node = $(xmlDoc).find('records record ' + cell.data('name'));
	    if ( node.length > 0 ) {
		dbCells.setCellValue(cell,node.text());
	    }
	}
	$(xmlDoc).find('calculated *').each(function(){
	    var node = $(this);
	    dbCells.container.find('#'+node[0].nodeName).each(function(){
		if ( $(this).is('input, select, textarea') ) {
		    $(this).val(node.text());
		} else {
		    $(this).html(node.text());
		}
	    });
	});
	$(xmlDoc).find('html *').each(function(){
	    var node = $(this);
	    $('#'+node[0].nodeName).each(function(){
		if ( $(this).is('input, select, textarea') ) {
		    $(this).val(node.text());
		} else {
		    $(this).html(node.text());
		}
	    });
	});
	if ( $(xmlDoc).find('info').length > 0 ) {
	    this.setStatus($(xmlDoc).find('info').text());
	}
	if ( $(xmlDoc).find('alert').length > 0 ) {
	    alert($(xmlDoc).find('alert').text());
	}
	cell.trigger('cellActionReturn',[type, xmlDoc]);
    }
    function cellActionReturnError(cell,type,errorMessage,errorType) {
	this.setCellState(cell,'error');
	if ( errorType != 'USER' ) {
	    alert(errorMessage);
	}
	cell.trigger('cellActionReturnError',[type,errorMessage,errorType]);
    }
    function onBeforeUnload(event) {
	if ( typeof this.currentCell == "undefined" ) {
	    return false;
	}
	if ( this.getCellState(this.currentCell) == 'dirty' ) {
	    if ( window.confirm('Do you want to save your changes?') ) {
		this.save(this.currentCell, false);
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
	/*var activeElmt=document.activeElement;
	if ( this.container.find(activeElmt).length == 0
	     && (oInputCtl && activeElmt!=oInputCtl)
	     && this.currentCell) {
	    if ( this.settings.updateType=="onCellOut"
		 && this.getCellState(this.currentCell) == 'dirty') {
		this.save(this.currentCell);
	    }
	    }*/
	//console.log("dbCells cellOnBlur " + $(event.target).text());
	if ( $(event.target).is(this.currentCell) && ! this.currentCell.data('focussing') ) {
	    this.cellOut(this.currentCell);
	}
	//console.log("/cellOnBlur");
    }
    function cellOnKeyDown(event) {
	//console.log("dbCells cellOnKeyDown " + event.which);
	// cell controls should only propogate key events when default dbCells behavior is desired.
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
	//console.log("dbCells onKeyUp " + event.which);
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
    
    $.fn.dbCells = function() {
	var target = this;
	var returnValue;
	if ( typeof arguments[0] == "object" ) {
	    var options = arguments[0];
	}
	if ( ! target.data('dbCells') ) {
	    target.each(function(){
		$(this).data('dbCells', new DbCells($(this), options));
	    });
	}
	var dbCells = target.data('dbCells');
	if ( typeof arguments[0] == "string" ) {
	    var method = arguments[0];
	    if ( typeof dbCells[method] == "function" ) {
		if ( target.is(dbCells.container) ) {
		    returnValue = dbCells[method].apply(dbCells, Array.prototype.slice.call(arguments,1));
		} else {
		    returnValue = dbCells[method].apply(dbCells, [target].concat(Array.prototype.slice.call(arguments,1)));
		}
	    }
	}
	if ( typeof returnValue == "undefined" ) {
	    return target;
	} else {
	    return returnValue;
	}
    };
})(jQuery);