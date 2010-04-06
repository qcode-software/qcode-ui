function dbGridTextArea(callback) {

// vars
var oTextArea;
var callback;

// Init
oTextArea = document.createElement('TEXTAREA');
oTextArea.style.position = 'absolute';
oTextArea.style.visibility = 'hidden';
oTextArea.style.backgroundColor='white';
oTextArea.style.border='1px solid #aca899';
oTextArea.style.overflow = 'auto';

oTextArea.attachEvent('onkeydown',inputOnKeyDown);
oTextArea.attachEvent('onkeyup',inputOnKeyUp);

// Set up handlers
oTextArea.getType = getType;
oTextArea.getValue = getValue;
oTextArea.show = show;
oTextArea.hide = hide;
oTextArea.selectText = selectText;
oTextArea.destroy = destroy;

return oTextArea;

function getType() {
	return 'textarea';
}

function getValue() {
	var value = oTextArea.value;
	return value.replace(/\r\n/g,"<BR>");
}

function selectText() {
	var rng = oTextArea.createTextRange();
	rng.collapse(true);
	rng.select();
}

function show(oTD,value,editorHeight) {
	// copy the style of oTD onto oTextArea
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
			var borderBottomWidth = Math.ceil(borderWidth/2);
			var borderRightWidth = Math.ceil(borderWidth/2);
		}
		// Top Row
		if ( rowIndex == 0 ) {
			oTextArea.style.borderTopWidth = '0px';
		} else {
			oTextArea.style.borderTopWidth = borderTopWidth;
		}
		// Right Boundary
		oTextArea.style.borderRightWidth = borderRightWidth;
		// Bottom
		oTextArea.style.borderBottomWidth = borderBottomWidth;
		// Left
		if ( cellIndex == 0 ) {
			oTextArea.style.borderLeftWidth = '0px';
		} else {
			oTextArea.style.borderLeftWidth = borderLeftWidth;
		}
	} else {
		oTextArea.style.borderWidth = oTD.currentStyle.borderWidth;
	}
	oTextArea.style.borderStyle = oTD.currentStyle.borderStyle;
	oTextArea.style.borderColor = oTD.currentStyle.borderColor;
	
	oTextArea.style.marginTop = oTD.currentStyle.marginTop;
	oTextArea.style.marginRight = oTD.currentStyle.marginRight;
	oTextArea.style.marginBottom = oTD.currentStyle.marginBottom;
	oTextArea.style.marginLeft = oTD.currentStyle.marginLeft;
	
	oTextArea.style.paddingTop = oTD.currentStyle.paddingTop;
	oTextArea.style.paddingRight = oTD.currentStyle.paddingRight;
	oTextArea.style.paddingBottom = oTD.currentStyle.paddingBottom;
	oTextArea.style.paddingLeft = oTD.currentStyle.paddingLeft;
	
	oTextArea.style.textAlign = oTD.currentStyle.textAlign;
	oTextArea.style.verticalAlign = oTD.currentStyle.verticalAlign;
	oTextArea.style.fontSize = oTD.currentStyle.fontSize;
	oTextArea.style.fontFamily = oTD.currentStyle.fontFamily;
	if ( oTD.currentStyle.backgroundColor=='transparent' )	{
		oTextArea.style.backgroundColor='white';
	} else {
		oTextArea.style.backgroundColor=oTD.currentStyle.backgroundColor;
	}
	
	oTextArea.style.pixelWidth = oTD.offsetWidth + parseInt(borderRightWidth);
	if ( editorHeight == undefined ) {
		oTextArea.style.pixelHeight = oTD.offsetHeight;	
	} else {
		oTextArea.style.pixelHeight = editorHeight;
	}
	oTextArea.style.pixelTop = getContainerPixelTop(oTD);
	oTextArea.style.pixelLeft = getContainerPixelLeft(oTD);
	
	oTextArea.style.visibility = 'visible';
	oTextArea.value = value.replace(/<BR>/gi,"\r\n")
}

function hide() {
	oTextArea.style.visibility = 'hidden';
}

function inputOnKeyDown() {
	// decide whether to propagate the event to the cell
	// using the callback function passed in
	var e = window.event;
	out: {
		if (e.keyCode == 9 || e.keyCode == 46) {
			// TAB or Delete
			callback(e)
			break out;
		}
		if (e.keyCode == 37 && atEditStart(oTextArea)) {
			// Left Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 38 && atEditStart(oTextArea)) {
			// Up Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 39 && atEditEnd(oTextArea)) {
			// Right Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 40 && atEditEnd(oTextArea)) {
			// Down Arrow
			callback(e);
			break out;
		}
		if ( e.keyCode == 83 && e.ctrlKey ) {
			// Ctrl+S
			callback(e);
			break out;
		}
		
		// Default 
		// don't propagate
	}
}

function inputOnKeyUp() {
	// allways propagate
	var e = window.event;
	callback(e);
}

function getContainerPixelLeft(elem) {
	var left = 0;
	while (elem.tagName != 'DIV' ) {
		left += elem.offsetLeft - elem.scrollLeft;
		elem = elem.offsetParent;
	}
	return left;
}
function getContainerPixelTop(elem) {
	var top = 0;
	while (elem.tagName != 'DIV') {
		top += elem.offsetTop - elem.scrollTop;
		elem = elem.offsetParent;
	}
	return top;
}

function destroy() {
	oTextArea.removeNode(true);
}

//
}