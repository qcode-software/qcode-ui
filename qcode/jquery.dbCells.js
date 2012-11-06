(function($){
    var states = ['current','dirty','updating','error'];
    function DbCells(container, options) {
	this.container = container;
	this.settings = $.extend({
	    'inputCells': ".dbCell",
	    'initalFocus': true,
	    'enabled': true,
	    'updateType': "cellOut"
	}, options);
	this.inputCells = $(this.settings.inputCells, this.container);
	this.textCells = $(this.settings.textCells, this.container);
	this.htmlCells = $(this.settings.htmlCells, this.container);
	this.cells = this.inputCells
	    .add(this.textCells)
	    .add(this.htmlCells);
	this.cells.data('dbCells', this);

	var callback = inputControlCallback.bind(this);
	if ( this.inputCells.length > 0 ) {
	    this.container.dbCellInput(this.inputCells);
	}
	if ( this.textCells.length > 0 ) {
	    this.container.dbTextArea(this.textCells);
	}
	if ( this.htmlCells.length > 0 ) {
	    this.container.dbHTMLArea(this.htmlCells);
	}

	this.cells
	    .on('mouseup.dbCells', cellOnMouseUp.bind(this))
	    .on('keydown.dbCellControl', cellOnKeyDown.bind(this))
	    .on('keyup.dbCellControl', cellOnKeyUp.bind(this))
	    .on('cut.dbCellControl', cellOnCut.bind(this))
	    .on('paste.dbCellControl', cellOnPaste.bind(this))
	    .on('blur.dbCellControl', cellOnBlur.bind(this));
	$(window)
	    .on('resize.dbCells', onResize.bind(this))
	    .on('beforeunload.dbCells', onBeforeUnload.bind(this))
	    .on('beforeprint.dbCells', onBeforePrint.bind(this));
    }
    $.extend(DbCells.prototype, {
	save: function(cells,async) {
	    var dbCells = this;
	    if ( typeof cells == "undefined" ) {
		var cells = this.currentCell;
	    }
	    cells.trigger('beforeSave.dbCells');
	    cells.each(function(i, cell){
		if ( typeof cell.data('updateURL') != "undefined" ) {
		    dbCells.cellAction(cell,'update',cell.data('updateURL'),cellActionReturn.bind(dbCells),async);
		}
		if ( typeof cell.data('addURL') != "undefined" ) {
		    dbCells.cellAction(cell,'add',cell.data('addURL'),cellActionReturn.bind(dbCells),async);
		}
	    });
	    cells.trigger('save.dbCells');
	},
	cellChange: function(newCell) {
	    if ( typeof this.currentCell != "undefined" ) {
		this.cellOut();
	    }
	    this.cellIn(newCell);
	},
	focus: function() {
	    if ( typeof this.currentCell != "undefined" ) {
		this.cellIn(this.currentCell);
	    }
	},
	setDirty: function() {
	    if ( typeof this.currentCell != "undefined" ) {
		this.setCellState(currentCell,'dirty');
	    }
	},
	cellIn: function(cell, select) {
	    this.currentCell = cell;
	    this.currentCell.css('visibility', "hidden");
	    if ( typeof this.getCellState() == "undefined" ) {
		this.setCellState('current');
	    }
	    var type = this.getCellType();
	    var cellValue = this.getCellValue();
	    if ( typeof type == "undefined" ) {
		type = 'text';
	    }
	    //if ( typeof(cell.data('editorHeight')) != "undefined" ) {
		//var editorHeight = cell.data('editorHeight');
	    //}
	    cell.dbCellControl('show',cellValue);
	    //var control = cell.data('dbCellControl');
	    //control.show(cell[0],cellValue,editorHeight);

	    if (select) {
		cell.dbCellControl('selectText',text);
	    } else if ( cell.data('cellInSelect') != null ) {
		cell.dbCellControl('selectText',cell.data('cellInSelect'));
	    } else {
		cell.sbCellControl('selectText','all');
	    }
	    cell.trigger('cellin.dbCells');
	},
	cellOut: function(cell) {
	    if ( typeof cell != 'object' ) {
		var cell = this.currentCell;
	    }
	    var oldValue = this.getCellValue(cell);
	    var newValue = cell.dbCellControl('getValue');
	    if ( oldValue != newValue ) {
		this.setCellState(cell,'dirty');
	    }
	    cellWrite.call(this);
	    cell.css('visibility', "inherit");
	    cell.dbCellControl('hide');
	    this.currentCell = undefined;
	    if ( this.settings.updateType == "onKeyUp" ) {
		this.cancelDelayedSave();
	    }
	    if ( this.getCellState(cell) == "dirty" ) {
		this.save(cell);
	    }
	    cell.trigger('cellout.dbCells');
	},
	setCellState: function() {
	    if ( arguments.length == 1 ) {
		var cell = this.currentCell;
		var state = arguments[0];
	    } else if ( arguments.length == 2 ) {
		var cell = arguments[0];
		var state = arguments[1];
	    }
	    cell.removeClass(states.join(' '))
		.addClass(state);
	},
	getCellState: function(cell) {
	    if ( typeof cell == "undefined" ) {
		var cell = this.currentCell;
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
	    if ( typeof cell == "undefined" ) {
		var cell = this.currentCell;
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
	setCellValue: function() {
	    if ( arguments.length == 1 ) {
		var cell = this.currentCell;
		var value = arguments[0];
	    } else if ( arguments.length == 2 ) {
		var cell = arguments[0];
		var value = arguments[1];
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
	    if ( typeof cell == "undefined" ) {
		var cell = this.currentCell;
	    }
	    if ( this.inputCells.index(cell) > -1 ) {
		return 'text';
	    } else if ( this.comboCells.index(cell) > -1 ) {
		return 'combo';
	    } else if ( this.textCells.index(cell) > -1 ) {
		return 'textarea';
	    } else if ( this.htmlCells.index(cell) > -1 ) {
		return 'htmlarea';
	    }
	},
	delayedSave: function() {
	    if ( typeof this.currentCell != "undefined" && this.getCellState() == 'dirty' ) {
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
		handler = cellActionReturn;
	    }
	    if (typeof(async) == "undefined") {
		async = true;
	    }
	    
	    if ( type=='update' ) {
		this.setCellType(cell,'updating');
	    }
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

	    httpPost(url,data,handler,cellActionReturnError.bind(this,cell),async);
	},
	setStatus: function(msg){
	    this.trigger('statuschange',[msg])
	}
    });
    function cellActionReturnError(cell,errorMessage,errorType) {
	this.setCellState(cell,'error');
	if ( errorType != 'USER' ) {
	    alert(errorMessage);
	}
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
	var activeElmt=document.activeElement;
	if ( this.container.find(activeElmt).length == 0
	     && (oInputCtl && activeElmt!=oInputCtl)
	     && this.currentCell) {
	    if ( this.settings.updateType=="onCellOut"
		 && this.getCellState(this.currentCell) == 'dirty') {
		this.save(this.currentCell);
	    }
	}
    }
    function cellOnKeyDown(event) {
	if ( event.altKey ) {
	    return true;
	}
	switch (event.which) {
	case 37:
	    this.cellChange(moveLeft(this.curentCell));
	    break;
	case 38:
	    this.cellChange(moveUp(this.currentCell));
	    break;
	case 39:
	    this.cellChange(moveRight(this.currentCell));
	    break;
	case 40:
	    this.cellChange(moveDown(this.currentCell));
	    break;
	case 9:
	    var oldCell = this.currentCell;
	    if ( event.shiftKey ) {
		this.cellChange(moveLeft(this.currentCell));
	    } else {
		this.cellChange(moveRight(this.currentCell));
	    }
	    if ( this.currentCell == oldCell ) {
		return true;
	    }
	    break;
	case 13:
	    var oldCell = this.currentCell;	    
	    this.cellChange(moveRight(this.currenCell));
	    if ( this.currentCell == oldCell ) {
		this.save();
	    }
	    break;
	case 83:
	    if ( event.ctrlKey ) {
		this.save();
	    }
	}
	event.preventDefault();
	event.stopPropagation();
    }
    function cellOnMouseUp(event) {
	var cell = $(event.target);
	if ( this.cells.index(cell) > -1 ) {
	    if ( this.isCellEditable(cell) ) {
		this.cellChange(cell);
	    }
	}
    }
    function cellWrite(event) {
	var cell = this.currentCell;
	var name = cell.data('name');
	this.setCellValue(cell.dbCellControl('getValue'));
    }
    function cellOnKeyUp(event) {
	var cell = this.currentCell;
	var oldValue = this.getCellValue();
	var newValue = cell.dbCellControl('getValue');
	if ( oldValue != newValue ) {
	    this.setCellState('dirty');
	}
	if ( this.settings.updateType == "onKeyUp" ) {
	    this.cancelDelayedSave();
	    this.keyUpTimer = setTimeout(this.delayedSave.bind(this),750);
	}
    }
    function cellOnCut(event) {
	this.setCellState('dirty');
    }
    function cellOnPaste(event) {
	this.setCellState('dirty');
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
	    && ((a.offset().left + a.outerWidth()) >= b.offset(left));
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
		if ( rightOfColum(fromCell,cell)
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
		dbCells[method].apply(dbCells, [target].concat(Array.prototype.slice.call(arguments,0)));
	    }
	}
	return target;
    };
})(jQuery);