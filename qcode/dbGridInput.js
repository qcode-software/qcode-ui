function dbGridInput(callback) {

// vars
var oInput;
var callback;

// Init
oInput = document.createElement('INPUT');
oInput.type='text';
oInput.style.position = 'absolute';
oInput.style.visibility = 'hidden';
oInput.style.backgroundColor='white';

oInput.attachEvent('onkeydown',inputOnKeyDown);
oInput.attachEvent('onkeyup',inputOnKeyUp);
oInput.attachEvent('oncut',inputOnCut);
oInput.attachEvent('onpaste',inputOnPaste);
oInput.attachEvent('onblur',inputOnBlur);

// Set up handlers
oInput.getType = getType;
oInput.getValue = getValue;
oInput.show = show;
oInput.hide = hide;
oInput.selectText = selectText;
oInput.destroy = destroy;

var bookmark;
var lastValue;
return oInput;

function getType() {
	return 'text';
}

function getValue() {
	return oInput.value;
}

function selectText(option) {
  var rng = oInput.createTextRange();
  if ( option == 'end') {
    rng.collapse(false);
    rng.select();
  }
  if ( option == 'start' ) {
    rng.collapse(true);
    rng.select();
  }
  if ( option == 'preserve' && bookmark) {
    if (lastValue==getValue()) {
      rng.moveToBookmark(bookmark);
    } else {
      // move to end
      rng.collapse(false);
    }
    rng.select();
  }
  if (option == undefined || option == 'all') {
    rng.select();
  }

  storeSelection();
}

function show(oTD,value) {
  // copy the style of oTD onto oInput
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
  oInput.value = value;
}

function hide() {
  oInput.blur();
  oInput.style.visibility = 'hidden';
}

function inputOnKeyDown() {
  // decide whether to propagate the event to the cell
  // using the callback function passed in
  var e = window.event;
 out: {
    if (e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 46) {
      // TAB or Return or Delete
      callback(e)
	break out;
    }
    if (e.keyCode == 37 && atEditStart(oInput)) {
      // Left Arrow
      callback(e);
      break out;
    }
    if (e.keyCode == 38) {
      // Up Arrow
      callback(e);
      break out;
    }
    if (e.keyCode == 39 && atEditEnd(oInput) ) {
      // Right Arrow
      callback(e);
      break out;
    }
    if (e.keyCode == 40) {
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
  storeSelection();
}

function inputOnCut() {
  var e = window.event;
  callback(e);
  storeSelection();
}

function inputOnPaste() {
  var e = window.event;
  callback(e);
  storeSelection();
}

function inputOnBlur() {
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
  oInput.removeNode(true);
}

function storeSelection() {
  var currentRange=document.selection.createRange();
  bookmark = currentRange.getBookmark();
  lastValue=getValue();
 }

//
}
