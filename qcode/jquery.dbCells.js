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
	this.comboCells = $(this.settings.comboCells, this.container);
	this.textCells = $(this.settings.textCells, this.container);
	this.htmlCells = $(this.settings.htmlCells, this.container);
	this.cells = this.inputCells
	    .add(this.comboCells)
	    .add(this.textCells)
	    .add(this.htmlCells);
	this.cells.data('dbCells', this);

	var callback = inputControlCallback.bind(this);
	if ( this.inputCells.length > 0 ) {
	    this.dbCellInput = dbCellInput(callback);
	    $(this.dbCellInput).appendTo(this.container);
	}
	if ( this.comboCells.length > 0 ) {
	    this.dbCellCombo = dbCellCombo(callback);
	    $(this.dbCellCombo).appendTo(this.container);
	}
	if ( this.textCells.length > 0 ) {
	    this.dbCellTextArea = dbCellTextArea(callback);
	    $(this.dbCellTextArea).appendTo(this.container);
	}
	if ( this.htmlCells.length > 0 ) {
	    this.dbCellHTMLArea = dbCellHTMLArea(callback);
	    $(this.dbCellHTMLArea).appendTo(this.container);
	}

	this.cells.on('mouseup.dbCells', cellOnMouseUp.bind(this));
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
	    cells.each(function(i, cell){
		if ( cell.data('updateURL') != "undefined" ) {
		    dbCells.cellAction(cell,'update',cell.data('updateURL'),cellActionReturn.bind(dbCells),async);
		}
		if ( cell.data('addURL') != "undefined" ) {
		    dbCells.cellAction(cell,'add',cell.data('addURL'),cellActionReturn.bind(dbCells),async);
		}
	    });
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
	    if ( this.inputCells.filter(this.currentCell).length > 0 ) {
		var control = this.dbCellInput;
		control.show(this.getCellValue());
	    }
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
	}
    });
    function onBeforeUnload(event) {
	if ( typeof this.currentCell == "undefined" ) {
	    return false;
	}
	if ( this.getCellState(this.currentCell) == 'dirty' ) ) {
	    if ( window.confirm('Do you want to save your changes?') ) {
		this.save(this.currentCell, false);
		if ( this.getCellState(this.currentCell) == 'error' ) ) {
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
    function inputControlCallback(event) {
	switch (event.type) {
	case 'keydown':
	    cellOnKeyDown.call(this,event);
	    break;
	case 'keyup':
	    cellOnKeyUp.call(this,event);
	    break;
	case 'cut':
	    cellOnCut.call(this,event);
	    break;
	case 'paste':
	    cellOnPaste.call(this,event);
	    break;
	case 'blur':
	    var activeElmt=document.activeElement;
	    if ( this.container.find(activeElmt).length == 0
		 && (oInputCtl && activeElmt!=oInputCtl)
		 && this.currentCell) {
		if ( this.settings.updateType=="onCellOut"
		     && this.getCellState(this.currentCell) == 'dirty') {
		    this.save(this.currentCell);
		}
	    }
	    break;
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