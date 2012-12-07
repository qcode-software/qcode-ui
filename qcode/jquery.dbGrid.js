(function($){
  // DbGrid Class Constructor
  var DbGrid = function(table) {
    // Private Class Variables
    var recCount;
    var keyUpTimer;
    var tbody = jQuery([]);
    var colgroup = jQuery([]);
    var statusTable = jQuery([]);
    var currentCell = jQuery([]);
    // Input Controls
      var dbGridInput;
    var dbGridInputCtl;
    var dbGridCombo;
    var dbGridTextArea;
    var dbGridHTMLArea;
    var oFCKeditor;
    var dbGridInputBool;
   
    // Parameters
    if ( ! table.attr('initialFocus') ) { table.attr('initialFocus','true'); }
    if ( ! table.attr('enabled') ) { table.attr('enabled','true'); }
    if ( ! table.attr('updateType') ) { table.attr('updateType','rowOut'); }

    // Functions 
    function init() {
      tbody = table.children('tbody');
      colgroup = table.children('colgroup');
      if ( ! colgroup.size() ) {
        throw "This behavior requires a COLGROUP"
      }
    
      // The status table should be contained in a div element that is a sibling of the parent of this table
      if ( table.hasClass('clsDbGrid') ) {
	statusTable = table.closest('.clsDbGridDiv').next('.clsDbGridDivStatus').children('table');
      } else {
	statusTable = jQuery([]);
      }      
      recCount = tbody.children().size();
      if ( table.attr('enabled') == "true" ) {
	// Init input controls
	inputControlsInit();
	// Bind
	tbody.on('mouseup.dbGrid',cellOnMouseUp);
	jQuery(window).on('resize.dbGrid',onResize);
	window.onbeforeunload = onBeforeUnload;
	window.onbeforeprint = onBeforePrint;
     
	init2();
      }
    };
    // make init public
    this.init = init;

    function init2() {
      if ( table.attr('addURL') ) {
        createNewRow();
      }

      out: {
        if ( table.attr('initialFocus') == "end" ) {
  	  // Focus on first editable cell in last row
	  var lastRow = tbody.children('tr:last');
	  var cells = lastRow.children('td');
	  for (var i=0;i<cells.size();i++) {
 	    cell = cells.eq(i);
	   
	    if ( isCellEditable(cell) && isTabStop(cell) ) { 
	      currentCell = cell;
	      cellIn(cell);
	      rowIn(lastRow);

	      break out;
	    }
	  }
  	  // Could not find an editable cell in last row
        }

        // Focus on first editableCell
        if ( table.attr('initialFocus') == "true" ) {
  	  var rows = tbody.children('tr');
	  for (var i=0;i<rows.size();i++) {
	    var row = rows.eq(i);					   
	    var cells = row.children('td');			   
	    
	    for (var j=0;j<cells.size();j++) {
	      var cell = cells.eq(j);

	      if ( isCellEditable(cell) && isTabStop(cell) ) {
	        currentCell = cell;
		cellIn(cell);
		rowIn(row);

		break out;
	      }
	    }
	  }
        }
        // Could not find an editable cell
      } // end out
    };
    
    function focus() {
      if ( currentCell.size() ) {
        cellIn(currentCell);
      }
    };
    // make focus public
    this.focus = focus;
    
    function blur() {
      if ( currentCell.size() ) {
	cellOut(currentCell);
      }
    };
    // make blur public
    this.blur = blur;
    
    function setDirty() {
      if ( currentCell.size() ) {
        var currentRow = currentCell.closest('tr');
        setRowState(currentRow,'dirty');
      }
    };
    // make setDirty public
    this.setDirty = setDirty;

    // TODO: check this working in Chrome
    function onBeforeUnload() {
      if ( !currentCell.size() ) {	
	return;
      }
      
      var currentRow = currentCell.closest('tr');
       if (currentRow.attr('rowState') == 'dirty' || currentRow.attr('rowState') == 'error' ) {
	    return "Your changes have not been saved.\nStay on the current page to correct.";
      }      
    };

    function onBeforePrint() {
      if ( currentCell.size() ) {
	cellOut(currentCell);
      }	
    };

    function onResize() {
      if ( currentCell.size() ) {
	cellChange(currentCell);
      }
    };

    function resize(colIdx,width) {
      // 0-based colIdx
      colgroup.children('col').eq(colIdx).width(width);
      onResize();
    };
    // make resize public
    this.resize = resize;

    function find(colName,search) {
      var found = false;
      var colIdx = colgroup.children('col[name=' + colName + ']').index()      
      if ( colIdx != -1 ) {
        // found matching col element
	var colCells = tbody.children('tr').children('td:nth-child(' + (colIdx + 1) + ')');
	
        colCells.each(function() {
          cell = jQuery(this);
	  if ( cell.text() == search ) {
	    // found matching cell
	    if ( ! isCellEditable(cell) ) {
	      // move to next editable cell with the same row
	      cell = moveRight(cell, false);
	    }
	    if ( ! isCellEditable(cell) ) {
	      // move to previous editable cell with the same row
	      cell = moveLeft(cell, false);
	    }
	    if ( isCellEditable(cell) ) {
	      cellChange(cell);
	      found = true;
	    }
	    return false; // break out of jQuery.each loop
	    
	  }
	});
      }
      if ( ! found ) {
	alert("Could not find " + search + ".");
      }
    };
    // make find public
    this.find = find;

    function save(row,async) {
      if ( row == undefined || ! row.size() ) {
	var row = currentCell.closest('tr');
      }
      if ( row.attr('rowType') == 'add' && table.attr('addURL') ) {
	return rowAction(row,'add',table.attr('addURL'),rowActionReturn,async);
      }
      if ( row.attr('rowType') == 'update' && table.attr('updateURL') ) {
	return rowAction(row,'update',table.attr('updateURL'),rowActionReturn,async);
      }
    };
    // make save public
    this.save = save;

    function del(row) {
      if ( row == undefined || ! row.size() ) {
	row = currentCell.closest('tr');
      }
      if ( row.attr('rowType') == 'update' && table.attr('deleteURL') ) {
	if ( window.confirm("Delete the current record?") ) {
	  // async false
	  rowAction(row,'delete',table.attr('deleteURL'),rowActionReturn,false);
	}
      }
      if ( row.attr('rowType') == 'add' ) {
	if ( window.confirm("Delete the current row?") ) {
	  rowRemove(row);
	}
      }
    };
    // make del public
    this.del = del;

    //
    // INPUT //
    //
    function inputControlCallback(e) {
      if (e.type == 'keydown') {
	cellOnKeyDown(e);
      }
      if (e.type == 'keyup') {
	cellOnKeyUp(e);
      }
      if (e.type =='cut') {
	cellOnCut(e);
      }
      if (e.type =='paste') {
	cellOnPaste(e);
      }
      if (e.type =='blur') {
	var activeElmt = jQuery(document.activeElement);
	if (!table.is(activeElmt) && !table.find(activeElmt).size() && (dbGridInputCtl && !activeElmt.is(dbGridInputCtl.getElmt())) && currentCell.size()) {
	  var currentRow = currentCell.closest('tr');
	  if ( table.attr('updateType')=="onCellOut" && currentRow.attr('rowState') == 'dirty') {
	    save(currentRow);
	  }
	}
      }
    };
   
    function inputControlsInit() {
      var wantCombo= false;
      var wantTextArea = false;
      var wantHTMLArea = false;
      var wantFCKeditor = false;
      var wantBool = false;

      colgroup.children('col').each(function() {
	var colType = jQuery(this).attr('type');
	
	if ( colType == 'combo' ) {
	  wantCombo = true;
	}
	if ( colType == 'textarea' ) {
	  wantTextArea = true;
	}
	if ( colType == 'htmlarea' ) {
	  wantHTMLArea = true;
	}
	if ( colType == 'FCKeditor' ) {
	  wantFCKeditor = true;
	}
	if ( colType == 'bool' ) {
	  wantBool = true;
	}	
      });
	
	var divContainer = $('<div>').insertBefore(table).css('position', "relative");
	divContainer.add(table).wrapAll('<div class="wrapper">');

      dbGridInput = new DbGridInput(inputControlCallback, divContainer)
      
      if ( wantCombo ) {
	dbGridCombo = new DbGridCombo(inputControlCallback, divContainer);
      }
      if ( wantTextArea ) {
	dbGridTextArea = new DbGridTextArea(inputControlCallback, divContainer);
      }
      if ( wantHTMLArea ) {
	dbGridHTMLArea = new DbGridHTMLArea(inputControlCallback, divContainer);
      }
      if ( wantFCKeditor ) {
	// TODO: FCKEditor
	//oFCKeditor = dbGridFCKeditor(inputControlCallback,oDivContainer);
      }
      if ( wantBool ) {
	dbGridInputBool = new DbGridInputBool(inputControlCallback, divContainer);
      }
    };
    
    //
    // CELL
    //

    function cellChange(newCell) {
      var newRow = newCell.closest('tr');
      if ( ! currentCell.size() ) {
	// No cell currently selected
	rowIn(newRow);
	cellIn(newCell);
      } else {
	var oldCell = currentCell;
	var oldRow = oldCell.closest('tr');
	
	if ( newRow.index() != oldRow.index() ) {
	  // Row Change
	  cellOut(oldCell);
	  rowOut(oldRow);
	  rowIn(newRow);
	  cellIn(newCell);
	} else {
	  // Same Row 
	  cellOut(oldCell);
	  cellIn(newCell);
	}
      }
    };

      function cellIn(cell,select) {
	  currentCell = cell;
	  // Hide the cell
	  cell.css('visibility','hidden');
	  // Decide which inputControl to use
	  var col = colgroup.children('col').eq(cell.index());
	  var colType = col.attr('type');
	  var row = cell.closest('tr');
	  var cellValue = getCellValue(row, col.attr('name'));
	  if (  ! colType ) {
	      colType = 'text';
	  }
	  if ( colType == 'text' ) {
	      dbGridInputCtl = dbGridInput;
	      dbGridInputCtl.show(cell,cellValue);
	  }
	  if ( colType == 'textarea' ) {
	      if ( col.attr('editorHeight') !== undefined ) {
		  var editorHeight = parseInt(col.attr('editorHeight'));
	      }
	      dbGridInputCtl = dbGridTextArea;
	      dbGridInputCtl.show(cell,cellValue,editorHeight);
	  }
	  if ( colType == 'htmlarea') {
	      if ( col.attr('editorHeight') !== undefined ) {
		  var editorHeight = parseInt(col.attr('editorHeight'));
	      }
	      dbGridInputCtl = dbGridHTMLArea;
	      dbGridInputCtl.show(cell,cellValue,editorHeight);
	  }
	  if ( colType == 'FCKeditor' ) {
	      // TODO: Implement FCKeditor
	      //var editorHeight = parseInt(col.attr('editorHeight'));
	      //oInputCtl = oFCKeditor;
	      //oInputCtl.show(cell[0],cellValue,editorHeight);
	  }
	  if ( colType == 'combo' ) {
	      dbGridInputCtl = dbGridCombo;
	      var searchURL = col.attr('searchURL');
	      var name = col.attr('name');
	      var boundName = col.attr('boundName');
	      var boundValue = getCellValue(row,boundName);
	      dbGridInputCtl.show(cell,name,cellValue,boundName,boundValue,searchURL);
	  }
	  if ( colType == 'bool') {
	      dbGridInputCtl = dbGridInputBool;
	      dbGridInputCtl.show(cell,cellValue);
	  }

	  if (select) {
	      dbGridInputCtl.selectText(select);
	  } else {
	      if ( col.attr('cellInSelect') ) {
		  dbGridInputCtl.selectText(col.attr('cellInSelect'));
	      } else {
		  dbGridInputCtl.selectText('all');
	      }
	  }
      };
    
    function cellOut(cell) {
      // Custom Event: Trigger any cellOut events bound to this table
      cell.trigger('cellOut.dbGrid');
 
      var row = cell.closest('tr');
      colIdx = cell.index();
      var col = colgroup.children('col').eq(colIdx);
      var oldValue = getCellValue(row,col.attr('name'));
      var newValue = dbGridInputCtl.getValue();
      
      if ( oldValue != newValue ) {	
	// Work around for combo
	setRowState(row,'dirty');
      }
      cellWrite();
      // Show the cell
      cell.css('visibility','inherit');
      // Hide the input control
      dbGridInputCtl.hide();
      // Cleanup
      currentCell = jQuery([]);
      dbGridInputCtl = undefined;
      // Is there an action for this column
      if ( row.attr('rowState')=='dirty' && col.attr('action') ) {
	var actionURL = col.attr('action');
	// async false
	rowAction(row,'custom',actionURL,rowActionReturn,false);
      }
      // If updateType is onKeyUp then 
      // cancel any delayed save and save now 
      if ( table.attr('updateType')=="onKeyUp" ) {
	cancelDelayedSave();
	if (row.attr('rowState') == 'dirty') {
	  save(row);
	}
      }
      if ( table.attr('updateType')=="onCellOut" && row.attr('rowState') == 'dirty') {
	save(row);
      } 
    }

    function cellOnMouseUp(event) {
      var target = jQuery(event.target);
      if ( !target.is('td') && target.closest('td', table).size() ) {
	target = target.closest('td');
      }
      if ( target.is('td') && isCellEditable(target) ) {
	cellChange(target);
      } else {
	return false;
      }
    };

    function cellWrite() {
      // Write the contents of the input to the current cell
      var currentRow = currentCell.closest('tr');
      var colName = colgroup.children('col').eq(currentCell.index()).attr('name');
      setCellValue(currentRow,colName,dbGridInputCtl.getValue());
      if ( dbGridInputCtl.getType() == 'combo') {
	setCellValue(currentRow,dbGridInputCtl.getBoundName(),dbGridInputCtl.getBoundValue());	
      }
    };

    function cellOnKeyUp(event) {
      // Custom Event: Trigger any keyUp events bound to this table
      table.trigger('keyUp.dbGrid', [currentCell]);
      
      var currentRow = currentCell.closest('tr');
      var colName = colgroup.children('col').eq(currentCell.index()).attr('name');
      var oldValue = getCellValue(currentRow,colName);
      var newValue = dbGridInputCtl.getValue();
      if ( oldValue != newValue ) {  
	setRowState(currentRow,'dirty');
      } 
      if (table.attr('updateType')=="onKeyUp") {
	cancelDelayedSave();
	keyUpTimer = setTimeout(delayedSave,750);
      }
    };

    function delayedSave() {
      if ( currentCell.size() ) {
	var currentRow = currentCell.closest('tr');
	if ( currentRow.attr('rowState') == 'dirty' ) {
	  save(currentRow);
	}
      }
    };

    function cancelDelayedSave() {
      if ( keyUpTimer != undefined ) {
	clearTimeout(keyUpTimer);
      }
      keyUpTimer=undefined;
    };

    function cellOnCut(event) {
      var currentRow = currentCell.closest('tr');
      setRowState(currentRow,'dirty');
    };

    function cellOnPaste(event) {
      var currentRow = currentCell.closest('tr');
      setRowState(currentRow,'dirty');
    };

    function cellOnKeyDown(e) {
      if (e.altKey) {
	return true;
      }
      var cell = currentCell;
      out: {
	if (e.which == 37) {
	  // Left Arrow
	  cellChange(moveLeft(cell));
	  break out;
	}
	if (e.which == 38) {
	  // Up Arrow
	  cellChange(moveUp(cell));
	  break out;
	}
	if (e.which == 39 ) {
	  // Right Arrow
	  cellChange(moveRight(cell));
	  break out;
	}
	if (e.which == 40 ) {
	  // Down Arrow
	  cellChange(moveDown(cell));
	  break out;
	}
	if ( e.which == 9 ) {
	  // TAB
	  if ( e.shiftKey ) {
	    cellChange(moveLeft(cell));
	  } else {
	    cellChange(moveRight(cell));
	  }
	  if ( currentCell.is(cell) ) {
	    // document tabbing order
	    return true;
	  }
	}
	if (e.which == 13 ) {
	  // Return
	  cellChange(moveRight(cell));
	  if ( currentCell.is(cell) ) {
	    // Cell unchanged at bottom right boundary
	    save();
	  }	
	}
	if ( e.which == 46 ) {
	  // Delete key
	  del();
	}
	if ( e.which == 83 && e.ctrlKey ) {
	  // Ctrl+S
	  save();
	  break out;
	}
	// End out label
      }
      e.preventDefault();
      e.stopPropagation();
    };

    function moveRight(fromCell, searchNextRows) {
	searchNextRows = typeof searchNextRows == 'undefined' ? true : searchNextRows;
      
      var nextCell = fromCell.next('td');
      
      // Search for next editable cell on the same row
      while ( nextCell.size() ) {
	if (isCellEditable(nextCell) && isTabStop(nextCell)) {
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
	    if (isCellEditable(nextCell) && isTabStop(nextCell)) {
	      return nextCell;
	    }
	    nextCell = nextCell.next('td');
	  }
	  nextRow = nextRow.next('tr');
	}
      }
      // Unable to find next editable cell 
      return fromCell;
    };

    function moveLeft(fromCell, searchPreviousRows) {
      searchPreviousRows = typeof searchPreviousRows == 'undefined' ? true : searchPreviousRows

      var prevCell = fromCell.prev('td');
      
      // Search for previous editable cell on the same row
      while ( prevCell.size() ) {
	if (isCellEditable(prevCell) && isTabStop(prevCell)) {
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
	    if (isCellEditable(prevCell) && isTabStop(prevCell)) {
	      return prevCell;
	    }
	    prevCell = prevCell.prev('td');
	  }
	  prevRow = prevRow.prev('tr');
	}
      }
      // Unable to find previous editable cell 
      return fromCell;
    };

    function moveUp(fromCell) {
      var prevCell = jQuery([]);
      var prevRow = fromCell.closest('tr').prev('tr');
      var colIdx = fromCell.index();

      // Search for first editable cell in the same column of previous rows.
      while ( prevRow.size() ) {
	prevCell = prevRow.children().eq(colIdx);
	if (prevCell.size() && isCellEditable(prevCell) && isTabStop(prevCell)) {
	    return prevCell;
	}
	prevRow = prevRow.prev('tr');
      }
      // Unable to find previous editable cell 
      return fromCell;
    };

    function moveDown(fromCell) {
      var nextCell = jQuery([]);
      var nextRow = fromCell.closest('tr').next('tr');
      var colIdx = fromCell.index();

      // Search for first editable cell in the same column of subsequent rows.
      while ( nextRow.size() ) {
	nextCell = nextRow.children().eq(colIdx);
	if (nextCell.size() && isCellEditable(nextCell) && isTabStop(nextCell)) {
	    return nextCell;
	}
	nextRow = nextRow.next('tr');
      }
      // Unable to find next editable cell 
      return fromCell;
    };

    function isCellEditable(cell) {
      var row = cell.closest('tr');
      var col = colgroup.children('col').eq(cell.index());
      if ( row.attr('rowType') == undefined ) {
	row.attr('rowType','update');
      }
      if ( row.attr('rowState') == 'updating' ) {
	return false;
      } 
      // Is the column visible
      if ( col.hasClass('clsHidden') ) {
	return false;
      }
      // No name defined
      if ( col.attr('name') == undefined ) {
	return false;
      }
      if ( row.attr('rowType') == 'add' && col.attr('addDisabled') == 'true' ) {
	return false;
      }
      if ( row.attr('rowType') == 'update' && col.attr('updateDisabled') == 'true' ) {
	return false;
      } 
      if ( col.attr('type') == 'html' ) {
	return false;
      }
      return true;
    };
    // make isCellEditable public
    this.isCellEditable = isCellEditable;

    function isTabStop(cell) {
      var col = colgroup.children('col').eq(cell.index());
      if ( col.attr('tabStop') == 'no' ) {
	return false;
      } else {
	return true;
      }
    };

    function getCellValue(row,name) {
      var col = colgroup.children('col[name=' + name + ']').first();
      var colType = col.attr('type');
      var colIdx = col.index();

      if ( colIdx != -1 ) {
	// Found column with name
	var cell = row.children('td').eq(colIdx);

	if (  colType == 'html' || colType == 'htmlarea' || colType == 'FCKeditor' ) {
	  return cell.html();
	} else if ( colType=='bool' ) {
	  return parseBoolean(stripHTML(cell.html()));
	} else {
	  return unescapeHTML(cell.html());
	}
      } 
      throw new Error("No column named " + name);
    };
    // make getCellValue public
    this.getCellValue = getCellValue;
    
    function setCellValue(row,name,value) {
      var col = colgroup.children('col[name=' + name + ']').first();
      var colType = col.attr('type');
      var colIdx = col.index();

      if ( colIdx != -1 ) {
	// Found column with name
	var cell = row.children('td').eq(colIdx);

	if (  colType == 'html' || colType == 'htmlarea' || colType == 'FCKeditor' ) {
	  cell.html(value);
	} else if ( colType=='bool' ) {
	  if ( parseBoolean(value) ) {
	    cell.html("<span class='clsTrue'>Yes</span>");
	  } else {
	    cell.html("<span class='clsFalse'>No</span>");
	  }
	} else {
	  cell.html(escapeHTML(value));
	}
	return cell.html()
      }
      throw new Error("No column named " + name);
    };
    // make setCellValue public
    this.setCellValue = setCellValue;

    //
    // ROW
    //

    function requery(url,data) {
      if ( url == undefined ) {
	url = table.attr('dataURL');
      }      
      // Delete all rows
      tbody.children('tr').remove();
      
      var handler = requeryReturn;
      var errorHandler = rowActionReturnError;
      var async = false;
      var type = 'requery';
      httpPost(url,data,handler,errorHandler,async,type);
    };
    // make requery public
    this.requery = requery;

    function requeryReturn(xml) {
      var records = jQuery('records record', xml)
      for(var i=0;i<records.size();i++) {
        var row = createBlankRow();
	displayRow(row,records.eq(i));
      }
      // calculated, html
      jQuery('records calculated, records html', xml).children().each(function() {
	node = jQuery(this);
	var id = this.nodeName;
	var value = node.text();

	jQuery('#' + id, table).each(function() {
	  setObjectValue(this, value);
	});
      });
      
      if ( table.attr('enabled') == "true" ) {
	init2()
      }
    };

    // requery2 will update the data on each row from the first down
    // without deleting any rows
    function requery2(url) {
      var handler = requeryReturn2;
      var errorHandler = function(errorMessage) {
	setStatus(errorMessage);
	alert(errorMessage);
      }
      var async = false;
      var type = 'requery2';

      httpGet(url,handler,errorHandler,async,type);
    };
    // make requery2 public
    this.requery2 = requery2;

    function requeryReturn2(xml) {
      var records = jQuery('records record', xml)
      var rows = jQuery('tbody tr', table);
      for(var i=0;i<records.size();i++) {
        var row = rows.eq(i);
	displayRow(row,records.eq(i));
      }
      // calculated, html
      jQuery('records calculated, records html', xml).children().each(function() {
	node = jQuery(this);
	var id = this.nodeName;
	var value = node.text();

	jQuery('#' + id, table).each(function() {
	  setObjectValue(this, value);
	});
      });
    };

    function createBlankRow() {
      var row = jQuery('<tr>');
      var cols = colgroup.children('col');
      for(var i=0;i<colgroup.children('col').size();i++) {
        var cell = jQuery('<td>');
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
      row.attr('rowType', 'update');

      tbody.append(row);
      return row;
    };
  
    function createNewRow() {
      var row = jQuery('<tr>');
      var cols = colgroup.children('col');
      for(var i=0;i<colgroup.children('col').size();i++) {
        var cell = jQuery('<td>');
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
      row.attr('rowType', 'add');

      tbody.append(row);
      return row;
    };
 
    function rowRemove(row) {
      // Try to move away from the current row
      if ( row.find(currentCell).size() ) {
	// Move Down
	cellChange(moveDown(currentCell));
      }
      if ( row.find(currentCell).size() ) {	
	// Move Up
	cellChange(moveUp(currentCell));
      }
            
      if ( row.find(currentCell).size() ) {
	// Failed to move away
	cellOut(currentCell);
	row.remove();
      } else {
	row.remove();
	if ( currentCell.size() ) {
	  // Input will be in the wrong position
	  cellIn(currentCell);
	}
      }
    };
    // make rowRemove public
    this.rowRemove = rowRemove;
    
    function setRowState(row,newState) {
      var oldState = row.attr('rowState');
      
      switch (newState) {
	case 'dirty': {
	  if ( oldState =='current' && row.attr('rowType') == 'add' ) {
	    // Append New Row
	    createNewRow();
	  }
	  if ( oldState == 'current' || oldState == 'error' ) {
	    /*var style = "color:blue;cursor:hand;text-decoration:underline";
	    var onclick = "jQuery('#" + table.attr('id') + "').first().data('dbGrid').save()"
	    var span = "<span style=" + style + " onclick=" + onclick + ">save</span>";*/
	      setStatus('Editing ... Type Ctrl+S to ');
	      jQuery('tr:first td:first', statusTable).append(
		  jQuery("<span>save</span>")
		      .css({"color": "blue", "cursor": "hand", "text-decoration": "underline"})
		      .click(function(){table.data('dbGrid').save()})
	      );
	  }
	    break;
	}

	case 'current': {
	  setStatus("Saved.");
	  var backgroundColor = '';
	  row.css('background-color', backgroundColor);
	  if ( dbGridInputCtl != undefined ) {
	    dbGridInputCtl.getElmt().css('background-color',backgroundColor);
	  }
	  break;
	}

	case 'updating': {
	  var backgroundColor = 'yellow';
	  row.css('background-color', backgroundColor);
	  if ( dbGridInputCtl != undefined ) {
	    dbGridInputCtl.getElmt().css('background-color',backgroundColor);
	  }
	  break;
	}

	case 'error': {
	  var backgroundColor = 'tomato';
	  row.css('background-color', backgroundColor);
	  if ( dbGridInputCtl != undefined ) {
	    dbGridInputCtl.getElmt().css('background-color',backgroundColor);
	  }	  
	  break;
	}
      }

      row.attr('rowState',newState);
    };
    // make setRowState public
    this.setRowState = setRowState;

    function rowIn(row) {
      // Custom Event: Trigger any rowIn events bound to this table
      row.trigger('rowIn.dbGrid');

      if ( ! row.attr('rowType') ) {
	row.attr('rowType','update');
      }
      if ( ! row.attr('rowState') ) {
	row.attr('rowState','current');
      }
      if ( row.attr('rowError') ) {
	setStatus(row.attr('rowError'));
      }
      setNavCounter(row.index()+1);
    };

    function rowOut(row) {
      // Custom Event: Trigger any rowOut events bound to this table
      row.trigger('rowOut.dbGrid');

      if ( row.attr('rowState') == 'dirty' ) {
	save(row);
      }
    };

    function rowUrlEncode(row) {
      var list = new Array;
      var cols = colgroup.children('col');
      for(var i=0;i<cols.size();i++) {
	var col = cols.eq(i);
	if ( col.attr('name') ) {
	  var name = col.attr('name');
	  var value = getCellValue(row,name);
	  list.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
	}
      }
      return list.join("&");
    };
   
    function rowAction(row,type,url,handler,async) {
      if ( handler == undefined ) {
	handler = rowActionReturn;
      }
      
      // If async is true a page refresh may result in the db grid being populated with out of date values.
      // Default async to false if the beforeunload event has been triggered, otherwise default to true.
      if (async==false || (async == undefined && typeof event == "object" && event.type=='beforeunload') ) {
	async = false;
      } else {
	async = true;
      }
      
      if ( type=='add' || type=='update' || type=='delete' ) {
	setRowState(row,'updating');
      }
      if (currentCell.size()) {
	cellWrite();
      }
      
      // Check if there are url encoded variables in the url
      var re = /([^\?]+)\??(.*)/;
      re.exec(url);
      var path = RegExp.$1;
      var queryString = RegExp.$2;
      var data;
      if ( queryString != "" ) {
	data = queryString + '&' + rowUrlEncode(row);
      } else {
	data = rowUrlEncode(row);
      }
      
      httpPost(url,data,handler,rowActionReturnError,async,type,row);
    };
    // make rowAction public
    this.rowAction = rowAction;
    
    function rowActionReturn(xml,type,row) {
      if ( type =='update' || type =='add' ) {
	row.attr('rowType','update');
	row.attr('rowError',undefined);
	setRowState(row,'current');
      }
      if ( type =='add' ) {
	recCount ++;
	// Refresh counter
	if ( currentCell.size() ) {
	  var currentRow = currentCell.closest('tr');
	  setNavCounter(currentRow.index() + 1);
	}
      }
      if ( type == 'delete' ) {
	recCount --;
	// Focus
	rowRemove(row);
	setStatus("Deleted.");
      }
      // Row
      var rec = jQuery('records record', xml);
      if ( rec.size() ) {
	displayRow(row,rec.eq(0));
      }
      // calculated, html
      jQuery('records calculated', xml).children().each(function() {
	node = jQuery(this);
	var id = this.nodeName;
	var value = node.text();

	jQuery('#' + id, table).each(function() {
	  setObjectValue(this, value);
	});
      });

      jQuery('records html', xml).children().each(function() {
	node = jQuery(this);
	var id = this.nodeName;
	var value = node.text();

	jQuery('#' + id + ',[name="' + id + '"]').each(function() {
	  setObjectValue(this, value);
	});
      });

      // Info
      var rec = jQuery('records info', xml);
      if ( rec.size() ) {setStatus(rec.text());}
      // Alert
      var rec = jQuery('records alert', xml);
      if ( rec.size() ) {alert(rec.text());}
     
      // Custom Event: Trigger any rowActionReturn events bound to this table
      row.trigger('rowActionReturn.dbGrid', [type]);
    };

      function setObjectValue(element, value) {
	  if ( $(element).is('select, input, textarea') ) {
	      $(element).val(value);
	  } else if ( $(element).is('.clsRadioGroup') ) {
	      $(element).find('[name="'+$(element).prop('name')+'"][value="'+value+'"]').val(true);
	  } else {
	      $(element).html(value);
	  }
      }
    
    function rowActionReturnError(errorMessage,errorType,actionType,row) {
      setRowState(row,'error');
      setStatus(errorMessage);
      if ( errorType != 'USER' ) {
	alert(errorMessage);
      }
    };

    function displayRow(row,xml) {
      var cols = colgroup.children('col');
      for(var i=0;i<cols.size();i++) {
	var col = cols.eq(i);
	var colName = col.attr('name');
	var node = jQuery(colName, xml);
	
	if ( colName && node.size() ) {
	  var value = node.text();
	  setCellValue(row,colName,value);
	}
      }
     
      if ( currentCell.size() && row.find(currentCell).size() ) {
	cellIn(currentCell,'preserve');
      }
    };
    
    // Status Message
    function setStatus(msg) {
      jQuery('tr:first td:first', statusTable).html(msg);
    };
    // make setStatus public
    this.setStatus = setStatus;

    function setNavCounter(bookmark) {
      var str = 'Record ' + bookmark + ' of ' + recCount;
      jQuery('tr:first td:last', statusTable).html(str);
    };
    
    function httpPost(url,data,handler,errorHandler,async,type,elmt) {
      jQuery.ajax ({
	type: "POST",
	cache: false,
	async: async,
	dataType: 'xml',
	url: url,
	data: data,
	success: function(data, textStatus, jqXHR) {
	  // USER ERROR
	  var error = jQuery('error', data).first();
	  if ( error.size() ) {
	    var errorMessage = error.text();
	    return errorHandler(errorMessage,'USER',type,elmt);
	  }

	  // NORMAL COMPLETION
	  return handler(data,type,elmt);
	},
	error: function(jqXHR, textStatus, errorThrown) {
	  // HTTP ERROR
	  if ( jqXHR.status != 200 && jqXHR.status != 0 ) {
	    errorMessage = "Error ! Expected response 200 but got " + jqXHR.status;
	    return errorHandler(errorMessage,'HTTP',type,elmt);
	  }

	  // XML ERROR
	  if ( textStatus == 'parsererror' ) {
	    errorMessage = 'Error ! Unable to parse XML response';
	    return errorHandler(errorMessage,'XML',type,elmt);
	  }
 
	  // DEFAULT ERROR
	  errorMessage = 'Error ! '+ textStatus;
	  return errorHandler(errorMessage,'UNKNOWN',type,elmt);

	}
      });
    }

    function httpGet(url,handler,errorHandler,async,type,elmt) {
      jQuery.ajax ({
	type: "GET",
	cache: false,
	async: async,
	dataType: 'xml',
	url: url,
	success: function(data, textStatus, jqXHR) {
	  // USER ERROR
	  var error = jQuery('error', data).first();
	  if ( error.size() ) {
	    var errorMessage = error.text();
	    return errorHandler(errorMessage,'USER',type,elmt);
	  }

	  // NORMAL COMPLETION
	  return handler(data,type,elmt);
	},
	error: function(jqXHR, textStatus, errorThrown) {
	  // HTTP ERROR
	  if ( jqXHR.status != 200 && jqXHR.status != 0 ) {
	    errorMessage = "Error ! Expected response 200 but got " + jqXHR.status;
	    return errorHandler(errorMessage,'HTTP',type,elmt);
	  }

	  // XML ERROR
	  if ( textStatus == 'parsererror' ) {
	    errorMessage = 'Error ! Unable to parse XML response';
	    return errorHandler(errorMessage,'XML',type,elmt);
	  }
	  
	  // DEFAULT ERROR
	  errorMessage = 'Error ! '+ textStatus;
	  return errorHandler(errorMessage,'UNKNOWN',type,elmt);

	}
      });
    }
  };
  
  
  // Make DbGrid Class available as a jquery plugin
  $.fn.dbGrid = function(method) {
    var args = arguments
    var tables = this
    var returnVal;

    if ( this.not('table').size() ) {
      throw new Error('jQuery.dbGrid requires that only table elements are contained in the jQuery object');
    }

    // Method calling logic
    for ( var i=0; i< tables.size(); i++ ) {
      var table = tables.eq(i);
      var dbGrid = table.data('dbGrid');

      if ( ! dbGrid ) {
	dbGrid = new DbGrid(table);
	table.data('dbGrid',dbGrid);
      }

      if ( ! method ) {
	dbGrid.init.apply( dbGrid, args );
      } else {	
	returnVal = eval('dbGrid.' + method).apply( dbGrid, Array.prototype.slice.call( args, 1 ));
	if ( returnVal != undefined ) {
	  return returnVal;
	} 
      } 
    }

    return tables;
  };

})(jQuery);

