function dbCellInput(callback) {

// vars
var oInput;
var callback;

// Init
oInput = document.createElement('INPUT');
oInput.type='text';
oInput.style.position = 'absolute';
oInput.style.visibility = 'hidden';
oInput.style.backgroundColor='white';
// this changes how the input box copes with overflow
oInput.style.overflow='visible';

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

function show(oCell,value) {
  oInput.style.borderWidth = oCell.currentStyle.borderWidth;
  oInput.style.borderStyle = oCell.currentStyle.borderStyle;
  oInput.style.borderColor = oCell.currentStyle.borderColor;
  
  oInput.style.marginTop = oCell.currentStyle.marginTop;
  oInput.style.marginRight = oCell.currentStyle.marginRight;
  oInput.style.marginBottom = oCell.currentStyle.marginBottom;
  oInput.style.marginLeft = oCell.currentStyle.marginLeft;
  
  oInput.style.paddingTop = oCell.currentStyle.paddingTop;
  oInput.style.paddingRight = oCell.currentStyle.paddingRight;
  oInput.style.paddingBottom = oCell.currentStyle.paddingBottom;
  oInput.style.paddingLeft = oCell.currentStyle.paddingLeft;
  
  oInput.style.textAlign = oCell.currentStyle.textAlign;
  oInput.style.verticalAlign = oCell.currentStyle.verticalAlign;
  oInput.style.fontSize = oCell.currentStyle.fontSize;
  oInput.style.fontFamily = oCell.currentStyle.fontFamily;
  if ( oCell.currentStyle.backgroundColor=='transparent' )	{
    oInput.style.backgroundColor='white';
  } else {
    oInput.style.backgroundColor=oCell.currentStyle.backgroundColor;
  }	
  
  oInput.style.pixelWidth = oCell.offsetWidth;
  oInput.style.pixelHeight = oCell.offsetHeight;
  
  oInput.style.pixelTop = getPixelTop(oCell)-getPixelTop(oInput.offsetParent);
  oInput.style.pixelLeft = getPixelLeft(oCell)-getPixelLeft(oInput.offsetParent);
  
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
  while (elem != oInput.offsetparent && elem.tagName !='BODY') {
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
