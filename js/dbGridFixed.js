
function dbGridFixed(oTable) {
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

// vars
var currentCell;

// Input Controls
var oInputCtl;
var oInput;
var oCombo;
var oTextArea;
//
var oColGroup;
var oTable;
var oTBody;
var oDivStatus;
//
var recOffsetTop;
var recOffsetBottom;
var pageSize=30;
var recSize = 1607;
var rowHeight = 20;
var marginTop;
var marginBottom;
var pageLock = false;
var savedScrollTop=0;
var inScroll = false;
var xmlCache;
// Parameters
if ( oTable.initialFocus == undefined ) { oTable.initialFocus = "false" };
if ( oTable.enabled == undefined ) { oTable.enabled = "true" };

//
// Methods
oTable.resize = resize;
oTable.focus = focus;
oTable.save = save;
oTable.requery = requery;
oTable.rowAction = rowAction;
oTable.rowRemove = rowRemove;
oTable.sort = sort;
oTable.find = find;
oTable.getCellValue = getCellValue;
oTable.pageUp=pageUp;
oTable.pageDown=pageDown;
oTable.page = page;
oTable.pageTo = pageTo;
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
	// Status Div
	var divs = getChildElementsWithClassName(document,'DIV','db-grid-status');
	for (var i=0;i<divs.length;i++) {
		if (divs[i].forTable == oTable.id) {
			oDivStatus = divs[i];
		}
	}
	if ( oTable.enabled == "true" ) {
		// Init input controls
		inputControlsInit();
		// Bind
		oTBody.attachEvent('onmouseup',cellOnMouseUp);
		window.attachEvent('onbeforeunload',onBeforeUnload);
		//oTable.parentElement.attachEvent('onscroll',onScroll);
		window.setInterval(onScroll,50);
	}
	// static
	if ( oTable.dataURL !=undefined ) {
		requery();
	} else {
		if ( oTable.enabled == "true" ) {
			init2()
		}
	}
}
function onScroll() {
	var oDiv = oTable.parentElement;
	if (oDiv.scrollTop != savedScrollTop) {
		savedScrollTop = oDiv.scrollTop;
		inScroll=true;	
	} else {
		if ( inScroll ) {
			// scrollEnd
			inScroll = false;
			pageTo();
		}
	}
}

function getRecsBottom() {
	var oDiv = oTable.parentElement;
	var bottom = marginTop + oTable.clientHeight - oDiv.scrollTop - oDiv.clientHeight;
	return Math.floor(bottom/rowHeight);
}
function getRecsTop() {
	var oDiv = oTable.parentElement;
	var top = oDiv.scrollTop - marginTop;
	return Math.floor(top/rowHeight);
}
function init2() {
	if ( oTable.addURL !=null ) {
		createNewRow();
	}
	
	out: {
		for (var i=0;i<oTBody.rows.length;i++) {
			for (var j=0;j<oTBody.rows[i].cells.length;j++) {
				var oTD = oTBody.rows[i].cells[j];
				if ( isCellEditable(oTD) ) {
					currentCell = oTD;
					var oTR = getContainingElmt(oTD,'TR');
					rowIn(oTR);
					if ( oTable.initialFocus == "true" ) {
						cellIn(oTD,true);
					} else {
						cellIn(oTD,false);
					}
					break out;
				}
			}
		}
		//Could not find an editable cell
	} // end out
	recOffsetTop=0;
	recOffsetBottom = oTBody.rows.length-1;
	rowHeight = currentCell.offsetHeight;
	var recs = oTBody.rows.length-1;
	marginTop =0;
	marginBottom = rowHeight*(recSize - recs)
	oTable.style.marginBottom = marginBottom;
}

function focus() {
	if (currentCell != undefined) {
		cellIn(currentCell,true);
	}
}

function onBeforeUnload() {
	if (currentCell == undefined) {	
		return false;
	}
	var oTR = getContainingElmt(currentCell,'TR');
	if ( oTR.rowState == 'dirty' ) {
		if (window.confirm('Do you want to save your changes?')) {
			save(oTR,false);
			if (oTR.rowState == 'error' ) {
				event.returnValue = "Your changes could not been saved.\nStay on the current page to correct.";
			}
		}
	}
}

function resize(colIdx,width) {
	oColGroup.children[colIdx].style.width = width;
	if ( currentCell != undefined ) {
		cellIn(currentCell);
	}
}
function sort(colIdx,cmp) {
	tableBubbleSort(oTBody,colIdx,cmp);
	cellIn(currentCell);
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
			// async fasle
			rowAction(oTR,'delete',oTable.deleteURL,rowActionReturn,false);
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
}

function inputControlsInit() {
	// Container 
	// parentElement should be div.dbContainer
	var oDivContainer = oTable.parentElement;
	oInput = dbGridInput(inputControlCallback)
	oDivContainer.appendChild(oInput);
	
	oCombo = dbGridCombo(inputControlCallback)
	oDivContainer.appendChild(oCombo);
}

//
// CELL
//

function cellChange(newCell) {
	var newRow = getContainingElmt(newCell,'TR');
	if (currentCell == undefined) {
		rowIn(newRow);
		cellIn(newCell,true);
	} else {
		var oldCell = currentCell;
		var oldRow = getContainingElmt(oldCell,'TR');

		// Row Change
		if ( newRow.sectionRowIndex != oldRow.sectionRowIndex ) {
			cellOut(oldCell);
			rowOut(oldRow);
			rowIn(newRow);
			cellIn(newCell,true);
		} else {
			cellOut(oldCell);
			cellIn(newCell,true);
		}
	}
}

function cellIn(oTD,select) {
	currentCell = oTD;
	// Hide the cell
	oTD.style.visibility='hidden';
	// Decide which inputControl to use
	var type = oColGroup.children[oTD.cellIndex].type;
	if (  type == undefined ) {
		type = 'text';
	}
	if ( type == 'text' ) {
		oInputCtl = oInput;
		oInputCtl.show(oTD,oTD.innerText);
	}
	if ( type == 'combo' ) {
		oInputCtl = oCombo;
		var searchURL = oColGroup.children[oTD.cellIndex].searchURL;
		var name = oColGroup.children[oTD.cellIndex].name;
		var boundName = oColGroup.children[oTD.cellIndex].boundName;
		var currentRow = getContainingElmt(oTD,'TR');
		var boundValue = getCellValue(currentRow,boundName);
		oInputCtl.show(oTD,name,oTD.innerText,boundName,boundValue,searchURL);
	}
	if (select != false) {
		oInputCtl.selectText();
	}
}

function cellOut(oTD) {
	var oldValue = oTD.innerText;
	var newValue = oInputCtl.getValue();
	cellWrite();
	// Show the cell
	oTD.style.visibility='inherit';
	// Is there an action for this column
	var cellIdx = oTD.cellIndex;
	if ( newValue!=oldValue && oColGroup.children[cellIdx].action ) {
		var oTR = getContainingElmt(oTD,'TR');
		var actionURL = oColGroup.children[cellIdx].action;
		// async false
		rowAction(oTR,'custom',actionURL,rowActionReturn,false);
	}
	oInputCtl.hide();
	currentCell = undefined;
}

function cellOnMouseUp() {
	var exception;
	var elmt =window.event.srcElement;
	// IE does return a TD at the edge !
	try {
		var oTD = getContainingElmt(elmt,'TD');
	} catch(exception) {
		return false;
	}
	if ( isCellEditable(oTD)) {
		cellChange(oTD);
	}
}

function cellWrite() {
	// Write the contents of the input to the current cell
	// If the value has changed mark the row as dirty
	var oldValue = currentCell.innerText;
	var newValue = oInputCtl.getValue();
	var currentRow = getContainingElmt(currentCell,'TR');
	if ( oldValue != newValue ) {
		setRowState(currentRow,'dirty');
		currentCell.innerText = newValue;
	} 
	if ( oInputCtl.getType() == 'combo') {
		setCellValue(currentRow,oInputCtl.getBoundName(),oInputCtl.getBoundValue());	
	}
}

function cellOnKeyUp(e) {
	var oldValue = currentCell.innerText;
	var newValue = oInputCtl.getValue();
	if ( oldValue != newValue ) {
		var currentRow = getContainingElmt(currentCell,'TR');
		setRowState(currentRow,'dirty');
	} 
}

function cellOnKeyDown(e) {
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
				// Cell unchanged at bottom right boundery
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
}


function moveRight(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var rowIdx;
	if (markerCell.cellIndex == myRow.cells.length - 1) { // End of the Row
		if (myRow.sectionRowIndex == oTBody.rows.length - 1) {
			// Bottom right
			if ( isCellEditable(markerCell)) {
				return markerCell;
			} else {
				return fromCell;
			}
		} else {
			rowIdx = myRow.sectionRowIndex +1; //Move Down
		}
	} else {
		rowIdx = myRow.sectionRowIndex; //Stay on this Row
	}
	// Use this row length to wrap 
	var cellIdx = Mod(markerCell.cellIndex + 1, myRow.cells.length);
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveRight(fromCell,nextCell);
	}
}
function moveLeft(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var rowIdx;
	if (markerCell.cellIndex == 0) { // Beg of the Row
		if (myRow.sectionRowIndex == 0) {
			// Top Left
			if ( isCellEditable(markerCell)) {
				return markerCell;
			} else {
				return fromCell;
			} 
		} else {
			myRow = oTBody.rows[myRow.sectionRowIndex-1];//Move Up
		}
	} 
	rowIdx = myRow.sectionRowIndex;
	var cellIdx = Mod(markerCell.cellIndex - 1, myRow.cells.length);
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveLeft(fromCell,nextCell);
	}
}

function moveUp(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var cellIdx = markerCell.cellIndex;
	var rowIdx;
	if (myRow.sectionRowIndex == 0) { // Top
		if ( isCellEditable(markerCell)) {
			return markerCell;
		} else {
			return fromCell;
		} 
	} else {
		rowIdx = myRow.sectionRowIndex-1; //Move Up
	}
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveUp(fromCell,nextCell);
	} 
}
function moveDown(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var cellIdx = markerCell.cellIndex;
	var rowIdx;
	if (myRow.sectionRowIndex == oTBody.rows.length-1) { // Bottom
		if ( isCellEditable(markerCell)) {
			return markerCell;
		} else {
			return fromCell;
		} 
	} else {
		rowIdx = myRow.sectionRowIndex+1; //Move Down
	}
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveDown(fromCell,nextCell);
	}
}

function isCellEditable(oTD) {
	var currentRow = getContainingElmt(oTD,"TR");
	if ( currentRow.rowState == 'updating' ) {
		return false;
	} 
	// Is the column visible
	if (oColGroup.children[oTD.cellIndex].className == 'hidden') {
		return false;
	}
	// Assume current
	if ( currentRow.rowType == 'add' ) {
		if ( oColGroup.children[oTD.cellIndex].addDisabled == 'true') {
			return false;
		} else {
			return true;
		}
	}
	// Assume update
	if ( oColGroup.children[oTD.cellIndex].updateDisabled == 'true') {
		return false;
	} else {
		return true;
	}
}

function getCellValue(oTR,name) {
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == name ) {
			return oTR.cells[i].innerText;
		}
	}
	throw "No column named " + name;
}
function setCellValue(oTR,name,value) {
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == name ) {
			return oTR.cells[i].innerText=value;
		}
	}
	throw "No column named " + name;
}
//
// ROW
//


function requery(url) {
	if ( url == undefined ) {
		url = oTable.dataURL;
	}
	
	// Delete all rows
	while ( oTBody.rows.length > 0 ) {
		oTBody.deleteRow(0);
	}
	xmlCache = new ActiveXObject("Msxml2.DOMDocument");
	xmlCache.async = false;
	xmlCache.onreadystatechange = function() {
		if (xmlCache.readyState == 4) requeryReturn();
    }
	xmlCache.load(url);
}	

function requeryReturn() {
	// ERROR
	var xmlError = xmlCache.parseError;
	if (xmlError.errorCode != 0) {
		setStatus("Error! " + xmlError.reason);
		return false;
	}
	var rec = xmlCache.selectSingleNode('error');
	if ( rec ) {
		setStatus(rec.text);
		return false;
	}
	var records = xmlCache.selectNodes('records/record');
	for(var i=0;i<pageSize;i++) {
		var oTR = createBlankRow(oTBody.rows.length);
		displayRow(oTR,records[i]);
	}
	
	if ( oTable.enabled == "true" ) {
		init2()
	}
}

function pageUp(top,bot) {
	var records = xmlCache.selectNodes('records/record');
	for(var i=bot;i>=top;i--) {
		var oTR = createBlankRow(0);
		displayRow(oTR,records[i]);
		if ( currentCell && oTBody.rows[oTBody.rows.length-1].contains(currentCell) ) {
			// Move Up
			cellChange(moveUp(currentCell));
		}
		oTBody.deleteRow(oTBody.rows.length-1);
	}
	recOffsetTop = recOffsetTop - (bot-top);
	recOffsetBottom = recOffsetBottom - (bot-top);
	marginTop -= rowHeight*(bot-top);
	marginBottom += rowHeight*(bot-top);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function pageDown(top,bot) {
	var records = xmlCache.selectNodes('records/record');
	for(var i=top;i<=bot;i++) {
		var oTR = createBlankRow(pageSize);
		displayRow(oTR,records[i]);
		if ( currentCell && oTBody.rows[0].contains(currentCell) ) {
			cellOut(currentCell);
		}
		oTBody.deleteRow(0);
	}
	recOffsetTop = recOffsetTop + (bot-top);
	recOffsetBottom = recOffsetBottom + (bot-top);
	marginTop += rowHeight*(bot-top);
	marginBottom -= rowHeight*(bot-top);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function pageNew(top,bot) {
	if (currentCell) {
		cellOut(currentCell);
	}
	var records = xmlCache.selectNodes('records/record');
	var j = 0;
	for(var i=top;i<bot;i++) {
		var oTR = oTBody.rows[j];
		displayRow(oTR,records[i]);
		j++;
	}
	recOffsetTop = top
	recOffsetBottom = bot;
	marginTop = rowHeight*(recOffsetTop);
	marginBottom = rowHeight*(recSize -1 - recOffsetBottom);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function page(newTop,newBot) {
	var top = new Number();
	var bot = new Number();
	var oldTop = recOffsetTop;
	var oldBot = recOffsetBottom;
	
	if ( newTop < 0 ) { newTop = 0; }
	if ( newBot > recSize-1 ) { newBot = recSize-1; }
	// Page UP
	if ( newTop < oldTop && newBot < oldBot && newBot > oldTop ) {
		pageUp(newTop,oldTop-1);
	}
	// Page Down
	if ( newTop > oldTop && newBot > oldBot && newTop < oldBot ) {
		pageDown(oldBot+1,newBot);
	}
	// PageTo
	if ( newTop >= oldTop && newBot <= oldBot ) {	
		// inside, nothing to do
		return true;
	} else {
		pageNew(newTop,newBot);
	}
}

function pageTo() {
	var oDiv = oTable.parentElement;
	var recTop = Math.floor(oDiv.scrollTop/rowHeight);
	//page(recTop-1,recTop-1+pageSize);
	pageNew(recTop-1,recTop-1+pageSize);
}

function createBlankRow(index) {
	var oTR = oTBody.insertRow(index);
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
	// You must call save before removing this row
	// if this is not a real database delete
	// rowOut may do this anyway.
	if ( oTR.contains(currentCell) ) {
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
	if ( oTR.contains(currentCell) ) {
		// Failed to move away
		oInputCtl.hide();
		oTBody.deleteRow(oTR.sectionRowIndex);
	} else {
		oTBody.deleteRow(oTR.sectionRowIndex);
		// Input will be in the wrong position
		cellIn(currentCell);
	}
}

function setRowState(oTR,newState) {
	var oldState = oTR.rowState;
	if ( newState == 'dirty' ) {
		if ( oldState =='current' && oTR.rowType == 'add' ) {
			// Append New Row
			createNewRow();
		}
		if ( oldState == 'current') {
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
		oTR.style.backgroundColor = 'red';
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

function rowUrlEncode(url,oTR) {
	var list = new Array;
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var name = oCol.name;
		var value = oTR.cells[i].innerText;
		url = urlSet(url,name,value);
	}
	return url;
}



function rowAction(oTR,type,actionURL,handler,async) {
	if ( handler == undefined ) {
		handler = rowActionReturn;
	}
	if (async == undefined) {
		async = true;
	}
	
	if ( type=='add' || type=='update' || type=='delete' ) {
		setRowState(oTR,'updating');
	}
	var url = rowUrlEncode(actionURL,oTR);
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = async;
	var action = new Object;
	action.type = type;
	action.xml = xmlDoc;
	action.elmt = oTR;
	xmlDoc.onreadystatechange = function() {
		if (xmlDoc.readyState == 4) handler(action);
    }
	xmlDoc.load(url);
}

function rowActionReturn(action) {
	var type = action.type;
	var oTR = action.elmt;
	var xmlDoc = action.xml;
	
	// XML ERROR
	var xmlError = xmlDoc.parseError;
	if (xmlError.errorCode != 0) {
		var error = "Error! " + xmlError.reason;
		setRowState(oTR,'error');
		setStatus(error);
		alert(error);
		return false;
	}
	// USER ERROR
	var rec = xmlDoc.selectSingleNode('error');
	if ( rec ) {
		var error = rec.text;
		setRowState(oTR,'error');
		setStatus(error);
		return false;
	}
	out: {
		if ( type =='update' || type =='add' ) {
			updateDisplay(oTR,xmlDoc);
			oTR.rowType = 'update'
			oTR.rowError=undefined;
			setRowState(oTR,'current');
			break out;
		}
		if ( type == 'delete' ) {
			// Focus
			rowRemove(oTR);
			setStatus("Deleted.");
			updateDisplay(oTR,xmlDoc);
			break out;
		}
		// Default
		updateDisplay(oTR,xmlDoc);
	// End out
	}
	// Info
	xmlToID(xmlDoc,'records/info',oDivStatus);
	if ( oTable.onRowActionReturn != undefined ) {
		oTable.onRowActionReturn(action);
	}
}

function updateDisplay(oTR,xmlDoc) {
	var oTR;
	var xmlDoc;
	// record
	var rec = xmlDoc.selectSingleNode('records/record')
	if (rec) {
		displayRow(oTR,rec);
	}
	// calculated
	xmlToChildIDs(xmlDoc,'records/calculated',oTable);
	// html
	xmlToChildIDs(xmlDoc,'records/html',oTable.document);
}

function displayRow(oTR,xmlDoc) {
	var oTR;
	var xmlDoc;
	// record
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var name = oCol.name
		var oNode = xmlDoc.selectSingleNode(name);
		if ( oNode ) {
			var value = oNode.text;
			setObjectValue(oTR.cells[i],value);
		}
	}
	if ( currentCell != undefined && oTR.contains(currentCell) ) {
		cellIn(currentCell,true);
	}
}

// Status Message
function setStatus(msg) {
	setObjectValue(oDivStatus,msg);
}

//
// GENERAL
//



// end scope
}
