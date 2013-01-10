function dbGridHTMLArea(callback) {

// vars
var oHTMLArea;
var callback;

// Init
oHTMLArea = document.createElement('DIV');
oHTMLArea.contentEditable = true;
oHTMLArea.style.position = 'absolute';
oHTMLArea.style.visibility = 'hidden';

oHTMLArea.attachEvent('onkeydown',inputOnKeyDown);
oHTMLArea.attachEvent('onkeyup',inputOnKeyUp);

// Set up handlers
oHTMLArea.getType = getType;
oHTMLArea.getValue = getValue;
oHTMLArea.show = show;
oHTMLArea.hide = hide;
oHTMLArea.selectText = selectText;
oHTMLArea.destroy = destroy;

return oHTMLArea;

function getType() {
	return 'htmlarea';
}

function getValue() {
	return oHTMLArea.innerHTML;
}

function selectText(option) {
	var rng = document.body.createTextRange();
	rng.moveToElementText(oHTMLArea);
	if ( option == undefined || option == 'end') {
		rng.collapse(false);
		rng.select();
	}
	if ( option == 'start' ) {
		rng.collapse(true);
		rng.select();
	}
	if ( option == 'all' ) {
		rng.select();
	}
}

function show(oTD,value,editorHeight) {
	// copy the style of oTD onto oHTMLArea
	var oTable = getContainingElmt(oTD,'TABLE');
	if ( oTable.currentStyle.borderCollapse == 'collapse' ) {
		// BORDER COLLAPSE
		var oTBody = getContainingElmt(oTD,"TBODY");
		var oRow = getContainingElmt(oTD,"TR");
		var rows = oTable.rows.length - 1;
		var cells = oRow.cells.length - 1;
		var rowIndex = oRow.rowIndex;
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
			oHTMLArea.style.borderTopWidth = '0px';
		} else {
			oHTMLArea.style.borderTopWidth = borderTopWidth;
		}
		// Right Boundary
		oHTMLArea.style.borderRightWidth = borderRightWidth;
		
		// Bottom
		oHTMLArea.style.borderBottomWidth = borderBottomWidth;
		
		// Left
		if ( cellIndex == 0 ) {
			oHTMLArea.style.borderLeftWidth = '0px';
		} else {
			oHTMLArea.style.borderLeftWidth = borderLeftWidth;
		}
	} else {
		oHTMLArea.style.borderWidth = oTD.currentStyle.borderWidth;
	}
	oHTMLArea.style.borderStyle = oTD.currentStyle.borderStyle;
	oHTMLArea.style.borderColor = oTD.currentStyle.borderColor;
	//oHTMLArea.style.borderColor = 'pink';
	
	oHTMLArea.style.marginTop = oTD.currentStyle.marginTop;
	oHTMLArea.style.marginRight = oTD.currentStyle.marginRight;
	oHTMLArea.style.marginBottom = oTD.currentStyle.marginBottom;
	oHTMLArea.style.marginLeft = oTD.currentStyle.marginLeft;
	
	oHTMLArea.style.paddingTop = oTD.currentStyle.paddingTop;
	oHTMLArea.style.paddingRight = oTD.currentStyle.paddingRight;
	oHTMLArea.style.paddingBottom = oTD.currentStyle.paddingBottom;
	oHTMLArea.style.paddingLeft = oTD.currentStyle.paddingLeft;
	
	oHTMLArea.style.textAlign = oTD.currentStyle.textAlign;
	oHTMLArea.style.verticalAlign = oTD.currentStyle.verticalAlign;
	oHTMLArea.style.fontSize = oTD.currentStyle.fontSize;
	oHTMLArea.style.fontFamily = oTD.currentStyle.fontFamily;
	if ( oTD.currentStyle.backgroundColor=='transparent' )	{
		oHTMLArea.style.backgroundColor='white';
	} else {
		oHTMLArea.style.backgroundColor=oTD.currentStyle.backgroundColor;
	}
	
	if ( editorHeight == undefined ) {
		oHTMLArea.style.pixelWidth = oTD.offsetWidth+parseInt(borderRightWidth);
		oHTMLArea.style.pixelHeight = oTD.offsetHeight+parseInt(borderBottomWidth);	
	} else {
		oHTMLArea.style.pixelWidth = oTD.offsetWidth + parseInt(borderRightWidth);
		oHTMLArea.style.pixelHeight = editorHeight;
	}
	oHTMLArea.style.pixelTop = getContainerPixelTop(oTD);
	oHTMLArea.style.pixelLeft = getContainerPixelLeft(oTD);
	
	oHTMLArea.style.visibility = 'visible';
	oHTMLArea.innerHTML = value;
}

function hide() {
	oHTMLArea.style.visibility = 'hidden';
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
		if (e.keyCode == 13 && ! e.shiftKey) {
			// Return no shift
			callback(e)
			break out;
		}
		if (e.keyCode == 37 && atEditStart(oHTMLArea)) {
			// Left Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 38 && atEditStart(oHTMLArea)) {
			// Up Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 39 && atEditEnd(oHTMLArea)) {
			// Right Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 40 && atEditEnd(oHTMLArea)) {
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
	oHTMLArea.removeNode(true);
}

//
}