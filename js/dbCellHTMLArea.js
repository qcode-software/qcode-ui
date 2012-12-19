function dbCellHTMLArea(callback) {

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

 function show(oCell,value,editorHeight) {
   oHTMLArea.style.borderWidth = oCell.currentStyle.borderWidth;
   oHTMLArea.style.borderStyle = oCell.currentStyle.borderStyle;
   oHTMLArea.style.borderColor = oCell.currentStyle.borderColor;
  
   oHTMLArea.style.marginTop = oCell.currentStyle.marginTop;
   oHTMLArea.style.marginRight = oCell.currentStyle.marginRight;
   oHTMLArea.style.marginBottom = oCell.currentStyle.marginBottom;
   oHTMLArea.style.marginLeft = oCell.currentStyle.marginLeft;
  
   oHTMLArea.style.paddingTop = oCell.currentStyle.paddingTop;
   oHTMLArea.style.paddingRight = oCell.currentStyle.paddingRight;
   oHTMLArea.style.paddingBottom = oCell.currentStyle.paddingBottom;
   oHTMLArea.style.paddingLeft = oCell.currentStyle.paddingLeft;
	
   oHTMLArea.style.textAlign = oCell.currentStyle.textAlign;
   oHTMLArea.style.verticalAlign = oCell.currentStyle.verticalAlign;
   oHTMLArea.style.fontSize = oCell.currentStyle.fontSize;
   oHTMLArea.style.fontFamily = oCell.currentStyle.fontFamily;
   if ( oCell.currentStyle.backgroundColor=='transparent' )	{
     oHTMLArea.style.backgroundColor='white';
   } else {
     oHTMLArea.style.backgroundColor=oCell.currentStyle.backgroundColor;
   }
	
   if ( editorHeight == undefined ) {
     oHTMLArea.style.pixelWidth = oCell.offsetWidth;
     oHTMLArea.style.pixelHeight = oCell.offsetHeight;
   } else {
     oHTMLArea.style.pixelWidth = oCell.offsetWidth;
     oHTMLArea.style.pixelHeight = editorHeight;
   }
   oHTMLArea.style.pixelTop = getContainerPixelTop(oCell);
   oHTMLArea.style.pixelLeft = getContainerPixelLeft(oCell);
	
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
