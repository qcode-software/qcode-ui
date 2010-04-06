function dbGridFCKeditor(callback,oContainer) {

// vars
var oFCKeditor;
var oEditor;
var oTextArea;


// Init
oEditor = document.createElement('DIV');
oTextArea = document.createElement('TEXTAREA');
oTextArea.id='myFCKeditor';
oTextArea.name=oTextArea.id;
oEditor.appendChild(oTextArea);
oContainer.appendChild(oEditor);

// Set up handlers
oEditor.getType = getType;
oEditor.getValue = getValue;
oEditor.show = show;
oEditor.hide = hide;
oEditor.selectText = selectText;
oEditor.destroy = destroy;

oEditor.style.position = 'absolute';
oEditor.style.top = 0;
oEditor.style.left = 0;
oEditor.style.display = 'none';
oEditor.style.visibility = 'hidden';
	
oFCKeditor = new FCKeditor( oTextArea.id ) ;
oFCKeditor.BasePath = "/C:\\cygwin\\home\\nsadmin\\exf\\www\\JavaScript\\FCKeditor\\" ;
//oFCKeditor.BasePath = "/JavaScript/FCKeditor/" ;
oFCKeditor.ToolbarSet = 'TLC' ;
oFCKeditor.ReplaceTextarea() ;
	
oEditor.FCKeditor = oFCKeditor;

return oEditor;

function getType() {
	return 'FCKeditor';
}

function getValue() {
	var oFCKeditor = FCKeditorAPI.GetInstance(oEditor.FCKeditor.InstanceName)
	return oFCKeditor.GetHTML();
}

function selectText() {
	var oFCKeditor = FCKeditorAPI.GetInstance(oEditor.FCKeditor.InstanceName);
	oFCKeditor.Selection.Collapse('toStart');
	oFCKeditor.Focus();
}

function show(oTD,value,editorHeight) {
	// copy the style of oTD onto oEditor
	var oTable = getContainingElmt(oTD,'TABLE');
	
	oEditor.style.textAlign = oTD.currentStyle.textAlign;
	oEditor.style.verticalAlign = oTD.currentStyle.verticalAlign;
	oEditor.style.fontSize = oTD.currentStyle.fontSize;
	oEditor.style.fontFamily = oTD.currentStyle.fontFamily;
	if ( oTD.currentStyle.backgroundColor=='transparent' )	{
		oEditor.style.backgroundColor='white';
	} else {
		oEditor.style.backgroundColor=oTD.currentStyle.backgroundColor;
	}
	
	oEditor.style.pixelWidth = oTD.offsetWidth;
	if ( editorHeight == undefined ) {
		oEditor.style.pixelHeight = oTD.offsetHeight;	
	} else {
		oEditor.style.pixelHeight = editorHeight;
	}
	oEditor.style.pixelTop = getContainerPixelTop(oTD);
	oEditor.style.pixelLeft = getContainerPixelLeft(oTD);
	
	var oFCKeditor = FCKeditorAPI.GetInstance(oEditor.FCKeditor.InstanceName);
	oFCKeditor.SetHTML(value);
	oEditor.style.display = 'block';
	oEditor.style.visibility = 'visible';
}

function hide() {
	oEditor.style.display = 'none';
	oEditor.style.visibility = 'hidden';
}

function inputOnSelectionChange(oFCKeditor) {
	var e = new Object();
	e.type='keyup';
	callback(e);
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
		if (e.keyCode == 37 && atEditStart(oEditor)) {
			// Left Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 38 && atEditStart(oEditor)) {
			// Up Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 39 && atEditEnd(oEditor)) {
			// Right Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 40 && atEditEnd(oEditor)) {
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
	oEditor.FCKeditor.removeNode(true);
}

//
}
