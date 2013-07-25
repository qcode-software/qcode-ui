function dbGrid(oTable) {
  // A database type grid to add update and delete rows.
  // Attach to table.
  // Normally associated with a header table which can call resize
  //
  // You can fire an event rowAction by created a property "action" 
  // associated with the column. This calls the url contained in the prop action
  
  // Events
  // onRowActionReturn passes evnt - fired after return from the server without any error
  // onRowOut passes oTR
  // onRowIn passes oTR

  // onCellOut passes OTD

  // vars
  var currentCell;
  var recCount;
  
  // Input Controls
  var oInputCtl;
  var oInput;
  var oCombo;
  var oTextArea;
  var oHTMLArea;
  var oFCKeditor;
  var oInputBool;
  //
  var oColGroup;
  var oTable;
  var oTBody;
  var oStatusTable;
  //
  var keyUpTimer;
  
  // Parameters
  if ( oTable.initialFocus == undefined ) { oTable.initialFocus = "true" }
  if ( oTable.enabled == undefined ) { oTable.enabled = "true" }
  if ( oTable.updateType == undefined ) { oTable.updateType = "rowOut" }
  //
  // Methods
  oTable.resize = resize;
  oTable.focus = focus;
  oTable.blur = blur;
  oTable.save = save;
  oTable.del = del;
  oTable.requery = requery;
  oTable.requery2 = requery2;
  oTable.rowAction = rowAction;
  oTable.rowRemove = rowRemove;
  oTable.setRowState = setRowState;
  oTable.find = find;
  oTable.getCellValue = getCellValue;
  oTable.setCellValue = setCellValue;
  oTable.isCellEditable = isCellEditable;
  oTable.setDirty = setDirty;
  oTable.setStatus = setStatus;

  // Init
  init();
  //
  // TABLE //
  //
  function init() {
    oTBody = oTable.tBodies[0];
    oColGroup =oTable.children[0];
    if ( oColGroup.tagName != 'COLGROUP') {
      throw "This behavior requires a COLGROUP"
	}
    // Parents Next Sibling should be the status Div containing a table
      if ( ! jQuery(oTable).hasClass('flex') ) {
      oStatusTable = oTable.parentElement.nextSibling.firstChild;
    } else {
      oStatusTable = undefined;
    }
    
    recCount = oTBody.rows.length;
    if ( oTable.enabled == "true" ) {
      // Init input controls
      inputControlsInit();
      // Bind
      oTBody.attachEvent('onmouseup',cellOnMouseUp);
      window.attachEvent('onresize',onResize);
      window.attachEvent('onbeforeunload',onBeforeUnload);
      window.attachEvent('onbeforeprint',onBeforePrint);
    }
    if ( oTable.enabled == "true" ) {
      init2();
    }
  }
  
  function init2() {
    if ( oTable.addURL !=null) {
      createNewRow();
    }
    
  out: {
      if ( oTable.initialFocus == "end" ) {
	// last row
	var i=oTBody.rows.length-1;
	for (var j=0;j<oTBody.rows[i].cells.length;j++) {
	  var oTD = oTBody.rows[i].cells[j];
	  if ( isCellEditable(oTD) && isTabStop(oTD) ) {
	    currentCell = oTD;
	    cellIn(oTD);
	    var oTR = getContainingElmt(oTD,'TR');
	    rowIn(oTR);
	    break out;
	  }
	}
	//Could not find an editable cell on last row
      }
      // Focus on first editableCell
      if ( oTable.initialFocus == "true" ) {
	for (var i=0;i<oTBody.rows.length;i++) {
	  for (var j=0;j<oTBody.rows[i].cells.length;j++) {
	    var oTD = oTBody.rows[i].cells[j];
	    if ( isCellEditable(oTD) && isTabStop(oTD)) {
	      currentCell = oTD;
	      cellIn(oTD);
	      var oTR = getContainingElmt(oTD,'TR');
	      rowIn(oTR);
	      break out;
	    }
	  }
	}
      }
      //Could not find an editable cell
    } // end out
  }
  
  function focus() {
    if (currentCell != undefined) {
      cellIn(currentCell);
    }
  }
   
  function blur() {
      if (currentCell != undefined) {
	  cellOut(currentCell);
      }
  }
 
  function setDirty() {
    if (currentCell != undefined) {
      var oTR = getContainingElmt(currentCell,'TR');
      setRowState(oTR,'dirty');
    }
  }

function onBeforeUnload() {
	if (currentCell == undefined) {	
		return false;
	}
	
	var oTR = getContainingElmt(currentCell,'TR');
	cellOut(currentCell);
	rowOut(oTR);
	if ( oTR.rowState == 'dirty' ) {
		if (window.confirm('Do you want to save your changes?')) {
			save(oTR,false);
			if (oTR.rowState == 'error' ) {
				event.returnValue = "Your changes could not be saved.\nStay on the current page to correct.";
			}
		}
	}
}

function onBeforePrint() {
	if (currentCell != undefined) {
		cellOut(currentCell);
	}	
}

function onResize() {
  if (currentCell) {
    cellChange(currentCell);
  }
}

function resize(colIdx,width) {
  oColGroup.children[colIdx].runtimeStyle.width = width;
  onResize();
}

function find(colName,search) {
	var found = false;
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == colName ) {
			var colIdx = i;
		}
	}
	for(var i=0;i<oTBody.rows.length;i++) {
		var oTD = oTBody.rows[i].cells[colIdx];
		if (oTD.innerText == search ) {
			while ( ! isCellEditable(oTD) ) {
				oTD = moveRight(oTD);
			}
			cellChange(oTD);
			found = true;
			break;
		}
	}
	if ( ! found ) {
		alert("Could not find " + search + ".");
	}
}

function save(oTR,async) {
  var oTR;
  if ( oTR == undefined ) {
    oTR = getContainingElmt(currentCell,'TR');
  }
  if ( oTR.rowType =='add' && oTable.addURL != null) {
    return rowAction(oTR,'add',oTable.addURL,rowActionReturn,async);
  }
  if ( oTR.rowType =='update' && oTable.updateURL != null) {
    return rowAction(oTR,'update',oTable.updateURL,rowActionReturn,async);
  }
}

function del(oTR) {
  var oTR;
  if ( oTR == undefined ) {
    oTR = getContainingElmt(currentCell,'TR');
  }
  if ( oTR.rowType == 'update' && oTable.deleteURL != null ) {
    if ( window.confirm("Delete the current record?") ) {
      // async false
      rowAction(oTR,'delete',oTable.deleteURL,rowActionReturn,false);
    }
  }
  if ( oTR.rowType == 'add' ) {
    if ( window.confirm("Delete the current row?") ) {
      rowRemove(oTR);
    }
  }
}
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
    var activeElmt=document.activeElement;
    if (!oTable.contains(activeElmt) && (oInputCtl && activeElmt!=oInputCtl) && currentCell) {
	var currentRow = getContainingElmt(currentCell,"TR");
	if ( oTable.updateType=="onCellOut" && currentRow.rowState == 'dirty') {
	  save(currentRow);
	}
    }
  }
}

function inputControlsInit() {
  var wantCombo= false;
  var wantTextArea = false;
  var wantHTMLArea = false;
  var wantFCKeditor = false;
  var wantBool = false;

  for(var i=0;i<oColGroup.children.length;i++) {
    var oCol = oColGroup.children[i];
    if ( oCol.type == 'combo' ) {
      wantCombo = true;
    }
    if ( oCol.type == 'textarea' ) {
      wantTextArea = true;
    }
    if ( oCol.type == 'htmlarea' ) {
      wantHTMLArea = true;
    }
    if ( oCol.type == 'FCKeditor' ) {
      wantFCKeditor = true;
    }
    if ( oCol.type == 'bool' ) {
      wantBool = true;
    }
  }
  // Container 
  // parentElement should be div.dbContainer
  var oDivContainer = oTable.parentElement;
  
  oInput = dbGridInput(inputControlCallback)
    oDivContainer.appendChild(oInput);
  
  if ( wantCombo ) {
    oCombo = dbGridCombo(inputControlCallback);
    oDivContainer.appendChild(oCombo);
  }
  if ( wantTextArea ) {
    oTextArea = dbGridTextArea(inputControlCallback);
    oDivContainer.appendChild(oTextArea);
  }
  if ( wantHTMLArea ) {
    oHTMLArea = dbGridHTMLArea(inputControlCallback);
    oDivContainer.appendChild(oHTMLArea);
  }
  if ( wantFCKeditor ) {
    oFCKeditor = dbGridFCKeditor(inputControlCallback,oDivContainer);
  }
  if ( wantBool ) {
    oInputBool = dbGridInputBool(inputControlCallback);
    oDivContainer.appendChild(oInputBool);
  }
}
 
//
// CELL
//

function cellChange(newCell) {
  var newRow = getContainingElmt(newCell,'TR');
  if (currentCell == undefined) {
    rowIn(newRow);
    cellIn(newCell);
  } else {
    var oldCell = currentCell;
    var oldRow = getContainingElmt(oldCell,'TR');
    
    // Row Change
    if ( newRow.sectionRowIndex != oldRow.sectionRowIndex ) {
      cellOut(oldCell);
      rowOut(oldRow);
      rowIn(newRow);
      cellIn(newCell);
    } else {
      cellOut(oldCell);
      cellIn(newCell);
    }
  }
}

function cellIn(oTD,select) {
  currentCell = oTD;
  // Hide the cell
  oTD.style.visibility='hidden';
  // Decide which inputControl to use
  var oCol = oColGroup.children[oTD.cellIndex];
  var type = oCol.type;
  var currentRow = getContainingElmt(oTD,'TR');
  var cellValue = getCellValue(currentRow,oCol.name);
  if (  type == undefined ) {
    type = 'text';
  }
  if ( type == 'text' ) {
    oInputCtl = oInput;
    oInputCtl.show(oTD,cellValue);
  }
  if ( type == 'textarea' ) {
    var editorHeight;
    if ( oCol.editorHeight != undefined ) {
      var editorHeight = oCol.editorHeight;
    }
    oInputCtl = oTextArea;
    oInputCtl.show(oTD,cellValue,editorHeight);
  }
  if ( type == 'htmlarea') {
    var editorHeight;
    if ( oCol.editorHeight != undefined ) {
      var editorHeight = oCol.editorHeight;
    }
    oInputCtl = oHTMLArea;
    oInputCtl.show(oTD,cellValue,editorHeight);
  }
  if ( type == 'FCKeditor' ) {
    var editorHeight;
    if ( oCol.editorHeight != undefined ) {
      var editorHeight = oCol.editorHeight;
    }
    oInputCtl = oFCKeditor;
    oInputCtl.show(oTD,cellValue,editorHeight);
  }
  if ( type == 'combo' ) {
    oInputCtl = oCombo;
    var searchURL = oCol.searchURL;
    oInputCtl.show(oTD,cellValue,searchURL);
  }
  if ( type == 'bool') {
    oInputCtl = oInputBool;
    oInputCtl.show(oTD,cellValue);
  }

  if (select) {
    oInputCtl.selectText(select);
  } else {
    if ( oCol.getAttribute('cellInSelect') !=null ) {
      oInputCtl.selectText(oCol.getAttribute('cellInSelect'));
    } else {
      oInputCtl.selectText('all');
    }
  }
}
 
function cellOut(oTD) {
   var oTR = getContainingElmt(oTD,'TR');
   var oldValue = getCellValue(oTR,oColGroup.children[oTD.cellIndex].getAttribute('name'));
   var newValue = oInputCtl.getValue();
   
   if ( oldValue != newValue ) {	
     // Work around for combo
     setRowState(oTR,'dirty');
   }
   cellWrite();
   // Show the cell
   oTD.style.visibility='inherit';
   // Hide the input control
   oInputCtl.hide();
   // Cleanup
   currentCell = undefined;
   oInputCtl = undefined;
   // Is there an action for this column
   var cellIdx = oTD.cellIndex;
   if ( oTR.rowState=='dirty' && oColGroup.children[cellIdx].action ) {
     var actionURL = oColGroup.children[cellIdx].action;
     // async false
     rowAction(oTR,'custom',actionURL,rowActionReturn,false);
   }
   // If updateType is onKeyUp then 
   // cancel any delayed save and save now 
   if ( oTable.updateType=="onKeyUp" ) {
     cancelDelayedSave();
     if (oTR.rowState == 'dirty') {
       save(oTR);
     }
   }
   if ( oTable.updateType=="onCellOut" && oTR.rowState == 'dirty') {
       save(oTR);
   }

   if ( oTable.onCellOut ) {
     oTable.onCellOut(oTD);
   }
}

function cellOnMouseUp() {
  var oNode = window.event.srcElement;
  while (oNode.tagName!='TD' && oNode.parentNode) {
    oNode = oNode.parentNode;
  }
  if (oNode.tagName == 'TD') {
	if ( isCellEditable(oNode) ) {
	    cellChange(oNode);
	}
  } else {
    return false;
  }
}

function cellWrite() {
  // Write the contents of the input to the current cell
  var currentRow = getContainingElmt(currentCell,"TR");
  var name = oColGroup.children[currentCell.cellIndex].name;
  setCellValue(currentRow,name,oInputCtl.getValue());
}

function cellOnKeyUp(e) {
  var currentRow = getContainingElmt(currentCell,'TR');
  var name = oColGroup.children[currentCell.cellIndex].name;
  var oldValue = getCellValue(currentRow,name);
  var newValue = oInputCtl.getValue();
  if ( oldValue != newValue ) {  
    setRowState(currentRow,'dirty');
  }
  if (oTable.updateType=="onKeyUp") {
    cancelDelayedSave();
    keyUpTimer = setTimeout(delayedSave,750);
  }
  if ( oTable.onKeyUp ) {
    oTable.onKeyUp(currentCell);
  }
}

function delayedSave() {
   if (currentCell != undefined) {
     var currentRow = getContainingElmt(currentCell,'TR');
     if (currentRow.rowState == 'dirty') {
       save(currentRow);
     }
   }
 }

function cancelDelayedSave() {
  if ( keyUpTimer != undefined ) {
    clearTimeout(keyUpTimer);
  }
  keyUpTimer=undefined;
 }

function cellOnCut(e) {
  var currentRow = getContainingElmt(currentCell,'TR');
  setRowState(currentRow,'dirty');
}

function cellOnPaste(e) {
  var currentRow = getContainingElmt(currentCell,'TR');
  setRowState(currentRow,'dirty');
}

function cellOnKeyDown(e) {
  if (e.altKey) {
    return true;
  }
  var elmt = currentCell;
 out: {
    if (e.keyCode == 37) {
      // Left Arrow
      cellChange(moveLeft(elmt));
      break out;
    }
    if (e.keyCode == 38) {
      // Up Arrow
      cellChange(moveUp(elmt));
      break out;
    }
    if (e.keyCode == 39 ) {
      // Right Arrow
      cellChange(moveRight(elmt));
      break out;
    }
    if (e.keyCode == 40 ) {
      // Down Arrow
      cellChange(moveDown(elmt));
      break out;
    }
    if ( e.keyCode == 9 ) {
      // TAB
      if ( e.shiftKey ) {
	cellChange(moveLeft(elmt));
      } else {
	cellChange(moveRight(elmt));
      }
      if ( currentCell == elmt ) {
	// document tabbing order
	return true;
      }
    }
    if (e.keyCode == 13 ) {
      // Return
      cellChange(moveRight(elmt));
      if ( currentCell == elmt ) {
	// Cell unchanged at bottom right boundary
	save();
      }	
    }
    if ( e.keyCode == 46 ) {
      // Delete key
      del();
    }
    if ( e.keyCode == 83 && e.ctrlKey ) {
      // Ctrl+S
      save();
      break out;
    }
    // End out label
  }
  e.returnValue=false;
  e.cancelBubble = true;
  if ( e.preventDefault ) {
      e.preventDefault();
  }
  if ( e.stopPropagation ) {
      e.stopPropagation();
  }
}

function moveRight(fromCell) {
	var oTBody = getContainingElmt(fromCell,"TBODY");
	var oRow = getContainingElmt(fromCell,"TR");
	var rows = oTBody.rows.length - 1;
	var cells = oRow.cells.length - 1;
	var rowIdx = oRow.sectionRowIndex;
	var cellIdx = fromCell.cellIndex;
	while ( rowIdx<rows || cellIdx<cells ) {
		if (cellIdx == cells) { // End of the Row
			rowIdx++; //Move Down
			cellIdx=0;
		} else {
			cellIdx++;
		}
		var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
		if (isCellEditable(nextCell) && isTabStop(nextCell)) {
			return nextCell;
		}
	}
	return fromCell;
}
function moveLeft(fromCell) {
	var oTBody = getContainingElmt(fromCell,"TBODY");
	var oRow = getContainingElmt(fromCell,"TR");
	var rows = oTBody.rows.length - 1;
	var cells = oRow.cells.length - 1;
	var rowIdx = oRow.sectionRowIndex;
	var cellIdx = fromCell.cellIndex;
	while ( rowIdx>0 || cellIdx>0 ) {
		if (cellIdx == 0) { // Start of Row
			rowIdx--; //Move Up
			cellIdx=cells;
		} else {
			cellIdx--;
		}
		var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
		if (isCellEditable(nextCell) && isTabStop(nextCell)) {
			return nextCell;
		}
	}
	return fromCell;
}
function moveUp(fromCell) {
	var oTBody = getContainingElmt(fromCell,"TBODY");
	var oRow = getContainingElmt(fromCell,"TR");
	var rows = oTBody.rows.length - 1;
	var cells = oRow.cells.length - 1;
	var rowIdx = oRow.sectionRowIndex;
	var cellIdx = fromCell.cellIndex;
	while ( rowIdx>0 ) {
		rowIdx--; //Move Up
		var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
		if (isCellEditable(nextCell) && isTabStop(nextCell)) {
			return nextCell;
		}
	}
	return fromCell;
}
function moveDown(fromCell) {
	var oTBody = getContainingElmt(fromCell,"TBODY");
	var oRow = getContainingElmt(fromCell,"TR");
	var rows = oTBody.rows.length - 1;
	var cells = oRow.cells.length - 1;
	var rowIdx = oRow.sectionRowIndex;
	var cellIdx = fromCell.cellIndex;
	while ( rowIdx<rows ) {
		rowIdx++; //Move Down
		var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
		if (isCellEditable(nextCell) && isTabStop(nextCell)) {
			return nextCell;
		}
	}
	return fromCell;
}

function isCellEditable(oTD) {
  var currentRow = getContainingElmt(oTD,"TR");
  var oCol = oColGroup.children[oTD.cellIndex];
  if (currentRow.rowType == undefined) {
    currentRow.rowType='update';
  }
  if ( currentRow.rowState == 'updating' ) {
    return false;
  } 
  // Is the column visible
  if (oCol.className == 'hidden') {
    return false;
  }
  // No name defined
  if (oCol.name==undefined) {
    return false;
  }
  if (currentRow.rowType == 'add' && oCol.addDisabled == 'true') {
    return false;
  }
  if (currentRow.rowType == 'update' && oCol.updateDisabled == 'true') {
    return false;
  } 
  if ( oCol.type=='html' ) {
    return false;
  }
  return true;
}

function isTabStop(oTD) {
	if (oColGroup.children[oTD.cellIndex].tabStop && oColGroup.children[oTD.cellIndex].tabStop == 'no') {
		return false;
	} else {
		return true;
	}
}

 function getCellValue(oTR,name) {
   for(var i=0;i<oColGroup.children.length;i++) {
     var oCol = oColGroup.children[i];
     if ( oCol.name == name ) {
       if (  oCol.type == 'html' || oCol.type == 'htmlarea' || oCol.type == 'FCKeditor' ) {
	 return oTR.cells[i].innerHTML;
       } else if ( oCol.type=='bool' ) {
	 return parseBoolean(stripHTML(oTR.cells[i].innerHTML));
       } else {
	 return unescapeHTML(oTR.cells[i].innerHTML);
       }
     }
   }
   throw "No column named " + name;
 }
 
 function setCellValue(oTR,name,value) {
   for(var i=0;i<oColGroup.children.length;i++) {
     var oCol = oColGroup.children[i];
     if ( oCol.name == name ) {
       if (  oCol.type == 'html' || oCol.type == 'htmlarea' || oCol.type == 'FCKeditor' ) {
	 return oTR.cells[i].innerHTML=value;
       } else if ( oCol.type=='bool' ) {
	 if ( parseBoolean(value) ) {
	   return oTR.cells[i].innerHTML="<span class='true'>Yes</span>";
	 } else {
	   return oTR.cells[i].innerHTML="<span class='false'>No</span>";
	 }
       } else {
	 return oTR.cells[i].innerHTML=escapeHTML(value);
       }
     }
   }
   throw "No column named " + name;
 }
//
// ROW
//

function requery(url,data) {
  if ( url == undefined ) {
    url = oTable.dataURL;
  }
  
  // Delete all rows
  while ( oTBody.rows.length > 0 ) {
    oTBody.deleteRow(0);
  }

  var handler = requeryReturn;
  var errorHandler = rowActionReturnError;
  var async = false;
  var type = 'requery';

  httpPost(url,data,handler,errorHandler,async);
}

function requeryReturn(xmlhttp) {
  var xmlDoc = xmlhttp.responseXML;
  var records = xmlDoc.selectNodes('records/record');
  for(var i=0;i<records.length;i++) {
    var oTR = createBlankRow();
    displayRow(oTR,records[i]);
  }
  // calculated
  xmlToChildIDs(xmlDoc,'records/calculated',oTable);
  // html
  xmlToChildIDs(xmlDoc,'records/html',oTable.document);
 
  if ( oTable.enabled == "true" ) {
    init2()
      }
}

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

  httpGet(url,handler,errorHandler,async);
}

function requeryReturn2(xmlhttp) {
  var xmlDoc = xmlhttp.responseXML;
  var records = xmlDoc.selectNodes('records/record');
  for(var i=0;i<records.length;i++) {
       displayRow(oTBody.rows[i],records[i]);
  }
  // calculated
  xmlToChildIDs(xmlDoc,'records/calculated',oTable);
  // html
  xmlToChildIDs(xmlDoc,'records/html',oTable.document);
}

function createBlankRow() {
  var oTR = oTBody.insertRow();
  for(var i=0;i<oColGroup.children.length;i++) {
    var oTD = oTR.insertCell();
  }
  oTR.rowType = 'update';
  return oTR;
}

function createNewRow() {
  var oTR = oTBody.insertRow();
  for(var i=0;i<oColGroup.children.length;i++) {
    var oCol = oColGroup.children[i];
    var oTD = oTR.insertCell();
    if ( oCol.defaultValue != undefined ) {
      oTD.innerText = oCol.defaultValue;
    }
  }
  oTR.rowType = 'add';
  return oTR;
}

function rowRemove(oTR) {
  if ( currentCell && oTR.contains(currentCell) ) {
  out: {
    // Try to move away from the current row
    //
    // Move Down
    cellChange(moveDown(currentCell));
    if ( ! oTR.contains(currentCell) ) {	
      break out;
    }
    // Move Up
    cellChange(moveUp(currentCell));
  }
  }
  
  if ( currentCell ) {
    if ( oTR.contains(currentCell) ) {
      // Failed to move away
      cellOut(currentCell);
      oTBody.deleteRow(oTR.sectionRowIndex);
    } else {
      oTBody.deleteRow(oTR.sectionRowIndex);
      // Input will be in the wrong position
      cellIn(currentCell);
    }
  } else {
    // Just delete the row
    oTBody.deleteRow(oTR.sectionRowIndex);
  }
}

function setRowState(oTR,newState) {
  var oldState = oTR.rowState;
  if ( newState == 'dirty' ) {
    if ( oldState =='current' && oTR.rowType == 'add' ) {
      // Append New Row
      createNewRow();
    }
    if ( oldState == 'current' || oldState == 'error' ) {
      var span ='<span style="color:blue;cursor:hand;text-decoration:underline" onclick="' + oTable.id + '.save()">save</span>';
      setStatus('Editing ... To ' + span + ' type Ctrl+S');
    }
  }
  if ( newState == 'updating' ) {
    oTR.style.backgroundColor = 'yellow';
  }
  if ( newState == 'current' ) {
    setStatus("Saved.");
    oTR.style.backgroundColor = '';
  }
  if ( newState == 'error' ) {
    oTR.style.backgroundColor = 'tomato';
  }
  oTR.rowState = newState;
}

function rowIn(oTR) {
  if ( oTable.onRowIn != undefined ) {
    oTable.onRowIn(oTR);
  }
  if ( oTR.rowType == undefined ) {
    oTR.rowType = 'update';
  }
  if ( oTR.rowState == undefined ) {
    oTR.rowState = 'current';
  }
  if ( oTR.rowError != undefined ) {
    setStatus(oTR.rowError);
  }
  setNavCounter(oTR.sectionRowIndex+1);
}

function rowOut(oTR) {
  if ( oTable.onRowOut != undefined ) {
    oTable.onRowOut(oTR);
  } else {
    if ( oTR.rowState == 'dirty' ) {
      save(oTR);
    }
  }
}

function rowUrlEncode(oTR) {
  var list = new Array;
  for(var i=0;i<oColGroup.children.length;i++) {
    var oCol = oColGroup.children[i];
    if ( oCol.name!=undefined) {
      var name = oCol.name;
      var value = getCellValue(oTR,name);
      list.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    }
  }
  return list.join("&");
}

function rowAction(oTR,type,url,handler,async) {
  if ( handler == undefined ) {
    handler = rowActionReturn;
  }
  
  // If async is true a page refresh may result in the db grid being populated with out of date values.
  // Default async to false if the beforeunload event has been triggered, otherwise default to true.
  if (async==false || (async == undefined && event.type=='beforeunload') ) {
      async = false;
  } else {
      async = true;
  }
  
  if ( type=='add' || type=='update' || type=='delete' ) {
    setRowState(oTR,'updating');
  }
  if (currentCell != undefined) {
    cellWrite();
  }
  
  // Check if there are url encoded variables in the url
  var re = /([^\?]+)\??(.*)/;
  re.exec(url);
  var path = RegExp.$1;
  var queryString = RegExp.$2;
  var data;
  if ( queryString != "" ) {
    data = queryString + '&' + rowUrlEncode(oTR);
  } else {
    data = rowUrlEncode(oTR);
  }
  
  httpPost(url,data,handler,rowActionReturnError,async,type,oTR);
}
 
function rowActionReturn(xmlhttp,type,oTR) {
  var xmlDoc = xmlhttp.responseXML;
  
  if ( type =='update' || type =='add' ) {
    oTR.rowType = 'update';
    oTR.rowError=undefined;
    setRowState(oTR,'current');
  }
  if ( type =='add' ) {
    recCount ++;
    // Refresh counter
    if ( currentCell != undefined ) {
      var currentRow = getContainingElmt(currentCell,'TR');
      setNavCounter(currentRow.sectionRowIndex + 1);
    }
  }
  if ( type == 'delete' ) {
    recCount --;
    // Focus
    rowRemove(oTR);
    setStatus("Deleted.");
  }
  // Row
  var rec = xmlDoc.selectSingleNode('records/record');
  if ( rec ) {displayRow(oTR,rec);}
  // calculated
  xmlToChildIDs(xmlDoc,'records/calculated',oTable);
  // html
  xmlToChildIDs(xmlDoc,'records/html',oTable.document);

  // Info
  var rec = xmlDoc.selectSingleNode('records/info');
  if ( rec ) {setStatus(rec.text);}
  // Alert
  var rec = xmlDoc.selectSingleNode('records/alert');
  if ( rec ) {alert(rec.text);}
  // Custom Event handler
  if ( oTable.onRowActionReturn != undefined ) {
    var action = new Object();
    action.type=type;
    action.elmt=oTR;
    oTable.onRowActionReturn(action);
  }
}
 
 function rowActionReturnError(errorMessage,errorType,actionType,oTR) {
   setRowState(oTR,'error');
   setStatus(errorMessage);
   if ( errorType != 'USER' ) {
     alert(errorMessage);
   }
 }

 function displayRow(oTR,xmlDoc) {
   var oTR;
   var xmlDoc;
   // record
   for(var i=0;i<oColGroup.children.length;i++) {
     var oCol = oColGroup.children[i];
     if (oCol.name) {
       var name = oCol.name;
       var oNode = xmlDoc.selectSingleNode(name);
       if ( oNode ) {
	 var value = oNode.text;
	 setCellValue(oTR,name,value);
       }
     }
   }
   if ( currentCell != undefined && oTR.contains(currentCell) ) {
     cellIn(currentCell,'preserve');
   }
 }
 
 // Status Message
 function setStatus(msg) {
   if (oStatusTable) {
     setObjectValue(oStatusTable.rows[0].cells[0],msg);
   } else {
       window.status=msg;
   }
 }
 function setNavCounter(bookmark) {
   if ( oStatusTable ) {
     var str = 'Record ' + bookmark + ' of ' + recCount;
     setObjectValue(oStatusTable.rows[0].cells[1],str);	
   }
 }
 
//
// GENERAL
//



// end scope
}
