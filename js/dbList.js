function dbList(oTable) {

oTable.resize = resize;
oTable.getCellValue = getCellValue;
oTable.update = update;

// To use events create a function and attach it as a property of this table.
// Events onRowIn

// vars
var currentRow;
var oTBody;
var oColGroup;

// init
oTBody = oTable.tBodies[0];
oColGroup = oTable.children[0];
if ( oTable.selectedRowIdx && oTable.selectedRowIdx >= 0 ) {
	rowIn(oTBody.rows[oTable.selectedRowIdx])
}

function resize(colIdx,width) {
	var oCol = oColGroup.children[colIdx];
	oCol.runtimeStyle.width = width;
}

function rowIn(oTR) {
	if ( oTR.rowState == undefined ) {
		oTR.rowState = 'unselected';
	}
	currentRow = oTR;
	if ( oTable.onRowIn != undefined ) {	
			oTable.onRowIn(oTR);
	}
	setRowState(oTR,'selected');
}

function setRowState(oTR,newState) {
	var oldState = oTR.rowState;
	out: {
		if ( newState == 'updating' ) {
			break out;
		}
		if ( newState == 'selected' ) {
			oTR.runtimeStyle.background = 'highlight';
			oTR.runtimeStyle.color = 'highlighttext';
			break out;
		}
		if ( newState == 'unselected' ) {
			oTR.runtimeStyle.background = '';
			oTR.runtimeStyle.color = '';
			break out;
		}
		if ( newState == 'error' ) {
			oTR.runtimeStyle.background = 'red';
			break out;
		}
	}
	oTR.rowState = newState;
}

function update(actionURL) {
	setRowState(currentRow,'updating');
	var url = rowUrlEncode(actionURL,currentRow);
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = false;
	var action = new Object;
	xmlDoc.onreadystatechange = function() {
		if (xmlDoc.readyState == 4) updateReturn(xmlDoc);
    }
	xmlDoc.load(url);
}

function updateReturn(xmlDoc) {
	// ERROR
	var xmlError = xmlDoc.parseError;
	if (xmlError.errorCode != 0) {
		var error = "Error! " + xmlError.reason;
		setRowState(currentRow,'error');
		alert(error);
		return false;
	}
	var rec = xmlDoc.selectSingleNode('error');
	if ( rec ) {
		var error = rec.text;
		setRowState(currentRow,'error');
		alert(error);
		return false;
	}
	updateDisplay(currentRow,xmlDoc);
	setRowState(currentRow,'selected');
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

function getCellValue(oTR,name) {
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == name ) {
			return oTR.cells[i].innerText;
		}
	}
	throw "No column named " + name;
}

//
}