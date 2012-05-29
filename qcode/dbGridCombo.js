function dbGridCombo(callback) {

// vars
var callback;
var oInput;
var oComboDiv; // The dropdown container
var xmlDoc;
var currentItem; // The highlighted row selected
var lastValue;
var _name;
var _value;
var _boundValue;
var _boundName;
var _searchURL;

// Init
// Attach to text input
oComboDiv = document.createElement('DIV');
oComboDiv.style.borderWidth='1px';
oComboDiv.style.borderStyle='solid';
oComboDiv.style.borderColor='black';
oComboDiv.style.background = 'white';
oComboDiv.style.position='absolute';
oComboDiv.style.overflow = 'auto';
oComboDiv.style.visibility='hidden';
oComboDiv.style.display='none';
document.body.appendChild(oComboDiv);

oInput = document.createElement('INPUT');
oInput.type='text';
oInput.style.position = 'absolute';
oInput.style.visibility = 'hidden';
	
oInput.attachEvent('onkeydown',inputOnKeyDown);
oInput.attachEvent('onkeyup',inputOnKeyUp);
oInput.attachEvent('onblur',inputOnBlur);

// Set up dbGrid handlers
oInput.getType = getType;
oInput.getValue = getValue;
oInput.getBoundName=getBoundName;
oInput.getBoundValue=getBoundValue;
oInput.show = show;
oInput.hide = hide;
oInput.selectText = selectText;
oInput.destroy = destroy;

return oInput;

function getType() {
	return 'combo';
}

function show(oTD,name,value,boundName,boundValue,searchURL) {
	// copy the style of oTD onto oInput
	var oTable = getContainingElmt(oTD,'TABLE');
	if ( oTable.currentStyle.borderCollapse == 'collapse' ) {
		// BORDER COLLAPSE
		var oTBody = getContainingElmt(oTD,"TBODY");
		var oRow = getContainingElmt(oTD,"TR");
		var rows = oTBody.rows.length - 1;
		var cells = oRow.cells.length - 1;
		var rowIndex = oRow.sectionRowIndex;
		var cellIndex = oTD.cellIndex;
		var borderWidth = parseInt(oTD.currentStyle.borderWidth);
		if ( borderWidth%2 == 0 ) {
			// Even
			var borderTopWidth = borderWidth/2;
			var borderRightWidth = borderWidth/2;
			var borderBottomWidth = borderWidth/2;
			var borderLeftWidth = borderWidth/2;
		} else {
			// Odd
			var borderTopWidth = Math.ceil(borderWidth/2);
			var borderLeftWidth = Math.ceil(borderWidth/2);
			var borderBottomWidth = Math.floor(borderWidth/2);
			var borderRightWidth = Math.floor(borderWidth/2);
		}
		// Top Row
		if ( rowIndex == 0 ) {
			oInput.style.borderTopWidth = '0px';
		} else {
			oInput.style.borderTopWidth = borderTopWidth;
		}
		// Right Boundary
		if ( cellIndex == cells ) {
			oInput.style.borderRightWidth = '0px';
		} else {
			oInput.style.borderRightWidth = borderRightWidth;
		}
		// Bottom
		if ( rowIndex == rows ) {
			oInput.style.borderBottomWidth = '0px';
		} else {
			oInput.style.borderBottomWidth = borderBottomWidth;
		}
		// Left
		if ( cellIndex == 0 ) {
			oInput.style.borderLeftWidth = '0px';
		} else {
			oInput.style.borderLeftWidth = borderLeftWidth;
		}
	} else {
		oInput.style.borderWidth = oTD.currentStyle.borderWidth;
	}
	oInput.style.borderStyle = oTD.currentStyle.borderStyle;
	oInput.style.borderColor = oTD.currentStyle.borderColor;
	
	oInput.style.marginTop = oTD.currentStyle.marginTop;
	oInput.style.marginRight = oTD.currentStyle.marginRight;
	oInput.style.marginBottom = oTD.currentStyle.marginBottom;
	oInput.style.marginLeft = oTD.currentStyle.marginLeft;
	
	oInput.style.paddingTop = oTD.currentStyle.paddingTop;
	oInput.style.paddingRight = oTD.currentStyle.paddingRight;
	oInput.style.paddingBottom = oTD.currentStyle.paddingBottom;
	oInput.style.paddingLeft = oTD.currentStyle.paddingLeft;
	
	oInput.style.textAlign = oTD.currentStyle.textAlign;
	oInput.style.verticalAlign = oTD.currentStyle.verticalAlign;
	oInput.style.fontSize = oTD.currentStyle.fontSize;
	oInput.style.fontFamily = oTD.currentStyle.fontFamily;
	if ( oTD.currentStyle.backgroundColor=='transparent' )	{
		oInput.style.backgroundColor='white';
	} else {
		oInput.style.backgroundColor=oTD.currentStyle.backgroundColor;
	}	
	
	oInput.style.pixelWidth = oTD.offsetWidth;
	oInput.style.pixelHeight = oTD.offsetHeight;
	oInput.style.pixelTop = getContainerPixelTop(oTD);
	oInput.style.pixelLeft = getContainerPixelLeft(oTD);
	oInput.style.visibility = 'visible';

	oComboDiv.style.borderColor=oTD.currentStyle.borderColor;
	oComboDiv.style.paddingLeft = oTD.currentStyle.paddingLeft;
	oComboDiv.style.paddingRight = oTD.currentStyle.paddingRight;
	oComboDiv.style.width = oInput.offsetWidth;
	oComboDiv.style.height = 150;
	oComboDiv.style.pixelTop = getPixelTop(oInput) + oInput.offsetHeight;
	// I think IE has a bug that prevents offsetLeft/offsetParent from
	// correctly calculating position. The width of the container div border
	// is 3 pixels hence the hack.
	oComboDiv.style.pixelLeft = getPixelLeft(oInput)+3;
	
	if ( searchURL == undefined ) { throw "searchURL must be defined" }
	if ( boundName == undefined ) { throw "boundName must be defined" }
	if ( name == undefined ) { throw "name must be defined" }
	_name = name;
	_value = value;
	lastValue = value;
	_searchURL = searchURL;
	_boundName = boundName;
	_boundValue = boundValue;
	oInput.value = value;
}

function hide() {
	oComboDiv.style.visibility='hidden';
	oInput.style.visibility = 'hidden';
}

function getValue() {
	return _value;
}

function getBoundName() {
	return _boundName;
}

function getBoundValue() {
	return _boundValue;
}

function selectText() {
	var rng = oInput.createTextRange();
	rng.select();
}

function inputOnKeyDown(e) {
	// Decide whether to callback event.
	if (currentItem != undefined ) {
		active = true;
	} else {
		active = false;
	} 
	if (e.keyCode == 38) {
		// Up Arrow
		if (active) {
			var idx = getNodeIndex(currentItem);
			if ( idx !=0 ) {
				highlight(idx-1);
			}
		} else {
			callback(e);
		}
	}
	if (e.keyCode == 40) {
		// Down Arrow
		if (active) {
			var idx = getNodeIndex(currentItem);
			if ( idx != oComboDiv.children.length -1  ) {
				highlight(idx+1);
			}
		} else {
			callback(e);
		}
	}
	if (e.keyCode == 37 && atEditStart(oInput)) {
		// Left Arrow
		callback(e);
	}
	if (e.keyCode == 39 && atEditEnd(oInput) ) {
		// Right Arrow
		callback(e);
	}
	if (e.keyCode == 9 || e.keyCode == 13) {
		// TAB or Return
		callback(e);
	}
	if (e.keyCode == 46) {
		// Delete
		callback(e)
	}
	if ( e.keyCode == 83 && e.ctrlKey ) {
		// Ctrl+S
		callback(e);
	}
}

function inputOnKeyUp() {
	if ( oInput.value != lastValue ) {
		lastValue = oInput.value;
		search();
		callback(window.event)
	}
}

function inputOnBlur() {
	var elmt = document.activeElement;
	if ( elmt!=oComboDiv && ! oComboDiv.contains(elmt)  ) {
		comboDivHide();
		currentItem = undefined;
	}
}

function comboDivHide() {
	oComboDiv.style.visibility='hidden';
	currentItem = undefined;
}

function comboDivShow() {
	oComboDiv.style.display='block';
	oComboDiv.style.visibility='visible';
}

function comboDivOnClick() {
	var elmt = window.event.srcElement;
	if (elmt != oComboDiv ) {
		var idx = getNodeIndex(elmt);
		select(idx);
	}
}
function comboDivOnMouseOver() {
	var elmt = window.event.srcElement;
	if (elmt != oComboDiv ) {
		var idx = getNodeIndex(elmt);
		highlight(idx);
	}
}

function select(idx) {
	oInput.value = _value;
	lastValue = oInput.value;
	comboDivHide();
	// Move cursor to end of Input
	var rng = oInput.createTextRange();
	rng.collapse(false);
	rng.select();
}

function highlight(idx) {
	var recs = xmlDoc.selectSingleNode('records');
	var rec = recs.childNodes[idx];
	_value = rec.selectSingleNode(_name).text;
	_boundValue = rec.selectSingleNode(_boundName).text;
	currentItem.runtimeStyle.background = '';
	currentItem.runtimeStyle.color = '';
	currentItem = oComboDiv.children[idx];
	currentItem.runtimeStyle.background = 'highlight';
	currentItem.runtimeStyle.color = 'highlighttext';
}

function search() {
	currentItem = undefined;
	oComboDiv.innerText = "Searching ..."
	comboDivShow();
	oComboDiv.detachEvent('onclick',comboDivOnClick);
	oComboDiv.detachEvent('onmouseover',comboDivOnMouseOver);
	var url = _searchURL;
	url = urlSet(url,'name',_name);
	url = urlSet(url,'value',oInput.value);
	url = urlSet(url,'boundName',_boundName);
	xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.onreadystatechange = searchReturn;
	xmlDoc.load(url);
}
function searchReturn() {
	if (xmlDoc.readyState == 4) {
		// ERROR
		var xmlError = xmlDoc.parseError;
		if (xmlError.errorCode != 0) {
			var error = "Software Bug ! " + xmlError.reason;
			oComboDiv.innerText = error;
		} else {
			var rec = xmlDoc.selectSingleNode('error');
			if ( rec ) {
				var error=rec.text;
				oComboDiv.innerText = error;
			} else {
				var recs = xmlDoc.selectNodes('records/record');
				if ( recs.length > 0 ) {
					updateList(recs);
				} else {
					// No Matches
					oComboDiv.innerText = "No Matches";
					_value = "";
					_boundValue = "";
				}
			}
		}
	}
}

function updateList(recs) {
	oComboDiv.innerHTML = '';
	oComboDiv.attachEvent('onclick',comboDivOnClick);
	oComboDiv.attachEvent('onmouseover',comboDivOnMouseOver);
	for(var i=0;i<recs.length;i++) {
		var rec = recs[i];
		for(var j=0;j<rec.childNodes.length;j++) {
			var field = rec.childNodes[j];
			var name= field.nodeName;
			var value = field.text;
			if (name == _name ) {
				var oItem = oInput.document.createElement('DIV');
				oItem.style.width = "100%";
				oItem.style.cursor = 'pointer';
				oItem.innerText = value;
				oComboDiv.appendChild(oItem);
			}
		}
	}
	
	currentItem = oComboDiv.children[0];
	highlight(0);
}

function getContainerPixelLeft(elem) {
	var left = 0;
	while (elem.tagName != 'DIV' && elem.tagName !='BODY') {
		left += elem.offsetLeft - elem.scrollLeft;
		elem = elem.offsetParent;
	}
	return left;
}
function getContainerPixelTop(elem) {
	var top = 0;
	while (elem.tagName != 'DIV' && elem.tagName !='BODY') {
		top += elem.offsetTop - elem.scrollTop;
		elem = elem.offsetParent;
	}
	return top;
}

function destroy() {
	oInput.removeNode(true);
	oComboDiv.removeNode(true);
}

//
}