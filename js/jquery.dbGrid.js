/* dbGrid plugin
   Turns a table into an editable database grid
*/
;(function($, window, document, undefined){
    $.widget('qcode.dbGrid', {
	options: {
	    initialFocus: true,
	    enabled: true,
	    updateType: 'rowOut',
            addURL: undefined,
            updateURL: undefined,
            deleteURL: undefined,
            dataURL: undefined
	},
	_create: function(){
	    var dbGrid = this;
	    
	    // Plugin Variables
	    dbGrid.colgroup = this.element.children('colgroup');
	    dbGrid.tbody = dbGrid.element.children('tbody');
	    dbGrid.currentCell = $([]);
	    dbGrid.editorDiv = $([]);
	    dbGrid.recCount = dbGrid.tbody.children('tr').size();
	  	    
	    // Update options with those set via table attributes
	    var attributes = ['initialFocus', 'enabled', 'updateType', 'addURL', 'updateURL', 'deleteURL','dataURL'];
	    $.each(attributes, function(i, name) {
		var value = dbGrid.element.attr(name);
		if ( value !== undefined ) {
		    dbGrid.option(name,value);
		}
	    });

	    // Create a container to attach editors 
	    dbGrid.editorDiv = $('<div>');
	    dbGrid.editorDiv.addClass('db-grid-editor-container');
	    dbGrid.editorDiv.css('position','relative');
	    dbGrid.editorDiv.attr('forTable', dbGrid.element.attr('id'));
	    dbGrid.element.before(dbGrid.editorDiv);
	    dbGrid.element.add(dbGrid.editorDiv).wrapAll('<div class="db-grid-wrapper">');
	    
	    // Enable the grid for editing
	    if ( dbGrid.option('enabled') ) {
		// Event listeners - instead of separate event listeners for each cell, delegated event listeners are added to the dbGrid.
		dbGrid._on(dbGrid.tbody, {
		    'mouseup td': function(event){
			$(event.currentTarget).dbCell('onMouseUp');
		    },
		    'editorKeyDown td': function(event){
			$(event.currentTarget).dbCell('editorKeyDown', event);
		    },
                    'editorValueChange td': function(event){
                        $(event.currentTarget).dbCell('editorValueChange', event);
                    },
		    'editorBlur td': function(event){
			$(event.currentTarget).dbCell('editorBlur', event);
		    }
		});
		dbGrid._on(window, {
		    'beforeunload': dbGrid._onBeforeUnload,
		    'beforeprint': dbGrid._onBeforePrint
		});
		
		// Create New Row
		if ( dbGrid.option('addURL') ) {
		    dbGrid.createNewRow();
		}

		// initialFocus
		$('body').one('pluginsReady', function() {
		    var initialFocusCell = dbGrid.getInitialFocusCell();
		    if ( initialFocusCell.size() ) {
			dbGrid.cellChange(initialFocusCell);
		    }
		});

		// preformatted columns
		var rows = dbGrid.tbody.children('tr');
		dbGrid.colgroup.children('[type=text],[type=textarea]').each(function() {
		    var col = $(this);
		    var colIndex = col.index();
		    
		    // apply class to existing td elements in tbody
		    rows.children('td:nth-child(' + (colIndex + 1)  + ')').addClass('preformatted')

		    // apply class to this column that can later be inherited by new rows
		    col.addClass('preformatted')
		});
	    }
	},
	getInitialFocusCell: function(){
	    var dbGrid = this;
	  
	    if ( dbGrid.option('initialFocus') === 'end' ) {
		// Return the first editable cell in the last row
		initialFocusCell = $('tr:last > td:first', dbGrid.tbody);
		if ( ! initialFocusCell.dbCell('isEditable') ) {
		    initialFocusCell = dbGrid.cellRightOf(initialFocusCell);
		}
		if ( initialFocusCell.dbCell('isEditable') ) {
		    return initialFocusCell
		}
	    } else if ( dbGrid.option('initialFocus') === "start" || parseBoolean(dbGrid.option('initialFocus')) === true ) {
		// Focus on first editableCell
		var initialFocusCell = $('tr:first > td:first', dbGrid.tbody);
		if ( ! initialFocusCell.dbCell('isEditable') ) {
		    initialFocusCell = dbGrid.cellRightOf(initialFocusCell);
		}
		if ( initialFocusCell.dbCell('isEditable') ) {
		    return initialFocusCell
		}
	    }

	    return $([]);
	},
	getEditorDiv: function(){
	    return this.editorDiv;
	},
	incrRecCount: function(i){
	    this.recCount += i;
	},
	setNavCounter: function(rowIndex){
	    // Update the NavCounter in the status bar using 0-based rowIndex (if a status bar or equivalent exists)
	    var str = 'Record ' + (rowIndex + 1) + ' of ' + this.recCount;
            this.element.trigger('message', [{
                type: 'navCount',
                html: str
            }]);
	},
	getCurrentCell: function(){
	    return this.currentCell;
	},
	setCurrentCell: function(cell){
	    this.currentCell = cell;
	},
	cellChange: function(newCell){
	    // Perform any necessary cellOut/rowOut & cellIn/rowIn to begin editing newCell
	    var newRow = newCell.dbCell('getRow');
	    if ( ! this.currentCell.size() ) {
		// No cell is currently being edited
		newRow.dbRow('rowIn');
		newCell.dbCell('cellIn');
	    } else {
		var oldCell = this.currentCell;
		var oldRow = oldCell.dbCell('getRow');		
		if ( newRow.index() == oldRow.index() ) {
		    // Same Row 
		    oldCell.dbCell('cellOut');
		    newCell.dbCell('cellIn');
		} else {
		    // Row Change
		    oldCell.dbCell('cellOut');
		    oldRow.dbRow('rowOut');
		    newRow.dbRow('rowIn');
		    newCell.dbCell('cellIn');		    
		}
	    }
	},
	find: function(colName, search){
	    // Search within ColName.
	    // If search string is found begin editing corresponding record.
	    // Otherwise raise an alert.
	    var dbGrid = this;
	    var found = false;
	    var colIndex = this.colgroup.children('col[name=' + colName + ']').index();
	    if ( colIndex !== -1 ) {
		// found matching col element
		var colCells = this.tbody.children('tr').children('td:nth-child(' + (colIndex + 1) + ')');
		
		colCells.each(function() {
		    cell = $(this);
		    if ( cell.text() == search ) {
			// found matching cell
			if ( ! cell.dbCell('isEditable') ) {
			    // move to next editable cell within the same row
			    cell = dbGrid.cellRightOf(cell, false);
			}
			if ( ! cell.dbCell('isEditable') ) {
			    // move to previous editable cell with the same row
			    cell = dbGrid.cellLeftOf(cell, false);
			}
			if ( cell.dbCell('isEditable') ) {
			    dbGrid.cellChange(cell);
			    found = true;
			}
			return false; // break out of $.each loop			
		    }
		});
	    }
	    if ( ! found ) {
		alert("Could not find " + search + ".");
	    }
	},
	save: function(row,async) {
	    if ( row === undefined || ! row.size() ) {
		var row = this.currentCell.closest('tr');
	    }
	    row.dbRow('save',async);
	},
	delete: function(row) {
	    if ( row === undefined || ! row.size() ) {
		var row = this.currentCell.closest('tr');
	    }
	    if ( row.dbRow('option', 'type') === 'update' && this.options.deleteURL !== undefined ) {
		if ( window.confirm("Delete the current record?") ) {
		    row.dbRow('delete', false);
		}
	    }
	    if ( row.dbRow('option', 'type') == 'add' ) {
		if ( window.confirm("Delete the current row?") ) {
		    this.removeRow(row);
                    // Notify plugins such as statusFrame
                    this.element.trigger('message', [{
                        type: 'notice',
                        html: "Deleted."
                    }]);
		}
	    }
	},
	removeRow: function(row) {
	    // Try to move away from the current row
	    if ( row.find(this.currentCell).size() ) {
		// Move Down
		this.cellChange(this.cellBelow(this.currentCell));
	    }
	    if ( row.find(this.currentCell).size() ) {	
		// Still on same cell try to Move Up instead
		this.cellChange(this.cellAbove(this.currentCell));
	    }
            if ( row.find(this.currentCell).size() ) {
		// Failed to move away
		this.currentCell.dbCell('cellOut');
	    } 
	    row.remove();
	    this.element.trigger('resize');
	},
	createBlankRow: function(){
	    // Append a blank row to the dbGrid with type='update'
	    var row = $('<tr>');
	    var cols = this.colgroup.children('col');
	    for(var i=0;i<this.colgroup.children('col').size();i++) {
		var cell = $('<td>');
		var colClass = cols.eq(i).attr('class');
		if ( colClass ) {
		    cell.attr('class', colClass);
		}
		var colStyle = cols.eq(i).attr('style');
		if ( colStyle ) {
		    cell.attr('style', colStyle);
		}
		row.append(cell);
	    }
	    row.dbRow({'type': 'update'});

	    this.tbody.append(row);
	    return row;
	},
	createNewRow: function(){
	    // Append a new row to the dbGrid with type='add' and with any defaultValues defined on the colgroup
	    var row = $('<tr>');
	    var cols = this.colgroup.children('col');
	    for(var i=0;i<this.colgroup.children('col').size();i++) {
		var cell = $('<td>');
		var defaultValue = cols.eq(i).attr('defaultValue');
		if ( defaultValue ) {
		    cell.text(defaultValue);
		}
		var colClass = cols.eq(i).attr('class');
		if ( colClass ) {
		    cell.attr('class', colClass);
		}
		var colStyle = cols.eq(i).attr('style');
		if ( colStyle ) {
		    cell.attr('style', colStyle);
		}
		row.append(cell);
	    }
	    row.dbRow({'type': 'add'});

	    this.tbody.append(row);
	    return row;
	},
	requery: function(data, url){
	    // Remove all rows from the dbGrid and requery the dataURL to re-populate the grid
	    if ( url === undefined ) {
		url = this.option('dataURL');
	    }
            // Clear the message on plugins such as statusFrame
            this.element.trigger('message', [{
                type: 'notice',
                html: ''
            }]);
	    if ( this.currentCell.size() ) {
		this.currentCell.dbCell('cellOut');
	    }
	    // Remove all rows
	    this.tbody.children('tr').remove();
	    
	    httpPost(url,data,this._requeryReturn.bind(this),this._requeryReturnError.bind(this),false);
	},
	_requeryReturn: function(xmlDoc){
	    // Rebuild dbGrid from requeryReturn response
	    var dbGrid = this;

	    // Create rows for each record in xmlDoc
	    var records = $('records record', xmlDoc).each(function(){
		var rec = $(this);
		var row = dbGrid.createBlankRow();
		rec.children().each(function() {
		    var xmlNode = $(this);
		    var colName = xmlNode.prop('nodeName');
		    var value = xmlNode.text()
		    row.dbRow('setCellValue', colName, value);		    
		});	
	    });

	    // Update 'Calculated' elements within grid
	    $('records > calculated', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id, dbGrid.table).setObjectValue(value);
	    });

	    // Update html elements external to the grid
	    $('records > html', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id + ',[name="' + id + '"]').setObjectValue(value);
	    });
	    
	    if ( parseBoolean(dbGrid.option('enabled')) === true ) {
		// Create New Row
		if ( dbGrid.option('addURL') ) {
		    dbGrid.createNewRow();
		}

		// initialFocus
		var initialFocusCell = dbGrid.getInitialFocusCell();
		if ( initialFocusCell.size() ) {
		    dbGrid.cellChange(initialFocusCell);
		}
	    }
	},
	_requeryReturnError: function(errorMessage) {
            // Notify plugins such as statusFrame of the error
            this.element.trigger('message', [{
                type: 'error',
                html: errorMessage
            }]);
	    alert(errorMessage);
	},
	cellAbove: function(fromCell) {
	    // Return the first editable cell of the same column on previous rows. 
	    // Return fromCell if unable to find previous cell
	    var prevCell = $([]);
	    var prevRow = fromCell.closest('tr').prev('tr');
	    var colIndex = fromCell.index();

	    while ( prevRow.size() ) {
		prevCell = prevRow.children().eq(colIndex);
		if ( prevCell.size() && prevCell.dbCell('isEditable') && prevCell.dbCell('isTabStop') ) {
		    return prevCell;
		}
		prevRow = prevRow.prev('tr');
	    }
	    // Unable to find previous editable cell 
	    return fromCell;
	},
	cellRightOf: function(fromCell, searchNextRows) {
	    // Return the next editable cell (optionally search subsequent rows). 
	    // Return fromCell if unable to next editable cell
	    searchNextRows = searchNextRows === undefined ? true : searchNextRows;
	    var nextCell = fromCell.next('td');
	    
	    // Search for next editable cell on the same row
	    while ( nextCell.size() ) {
		if ( nextCell.dbCell('isEditable') && nextCell.dbCell('isTabStop') ) {
		    return nextCell;
		} 
		nextCell = nextCell.next('td');
	    }
	    if ( searchNextRows == true ) {
		// Search for next editable cell on any subsequent row.
		var nextRow = fromCell.closest('tr').next('tr');
		while ( nextRow.size() ) {
		    nextCell = nextRow.children('td').first();
		    while ( nextCell.size() ) {
			if ( nextCell.dbCell('isEditable') && nextCell.dbCell('isTabStop') ) {
			    return nextCell;
			}
			nextCell = nextCell.next('td');
		    }
		    nextRow = nextRow.next('tr');
		}
	    }
	    // Unable to find next editable cell 
	    return fromCell;
	},
	cellBelow: function(fromCell) {
	    // Return the first editable cell of the same column on subsequent rows.
	    var nextCell = $([]);
	    var nextRow = fromCell.closest('tr').next('tr');
	    var colIndex = fromCell.index();
	    
	    while ( nextRow.size() ) {
		nextCell = nextRow.children().eq(colIndex);
		if  (nextCell.size() && nextCell.dbCell('isEditable') && nextCell.dbCell('isTabStop') ) {
		    return nextCell;
		}
		nextRow = nextRow.next('tr');
	    }
	    // Unable to find next editable cell 
	    return fromCell;
	},
	cellLeftOf: function(fromCell, searchPreviousRows) {
	    // Return the previous editable cell (optionally search previous rows). 
	    // Return fromCell if unable to previous editable cell
	    searchPreviousRows = searchPreviousRows === undefined ? true : searchPreviousRows

	    var prevCell = fromCell.prev('td');
	    
	    // Search for previous editable cell on the same row
	    while ( prevCell.size() ) {
		if ( prevCell.dbCell('isEditable') && prevCell.dbCell('isTabStop') ) {
		    return prevCell;
		} 
		prevCell = prevCell.prev('td');
	    }
	    if ( searchPreviousRows == true ) {
		// Search for previous editable cell on any subsequent row.
		var prevRow = fromCell.closest('tr').prev('tr');
		while ( prevRow.size() ) {
		    prevCell = prevRow.children('td').last();
		    while ( prevCell.size() ) {
			if ( prevCell.dbCell('isEditable') && prevCell.dbCell('isTabStop') ) {
			    return prevCell;
			}
			prevCell = prevCell.prev('td');
		    }
		    prevRow = prevRow.prev('tr');
		}
	    }
	    // Unable to find previous editable cell 
	    return fromCell;
	},
	resize: function(colIndex, width){
	    // Resize the width of a column. Trigger resize event on window to resize any editors.
	    // 0-based colIndex
	    this.colgroup.children('col').eq(colIndex).width(width);
	    $(window).trigger('resize');
	},
	_onBeforeUnload: function(){
	    if ( ! this.currentCell.size() ) {	
		// No cells are begin edited
		return;
	    }
	    
	    var currentRow = this.currentCell.closest('tr');
	    if ( currentRow.dbRow('getState') !== 'current' ) {
		return "Your changes have not been saved.\nStay on the current page to correct.";
	    }    
	},
	_onBeforePrint: function(){
	    if ( this.currentCell.size() ) {
		this.currentCell.dbCell('cellOut');
	    }	
	}
    });
})(jQuery, window, document);