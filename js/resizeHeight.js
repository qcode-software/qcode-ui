function resizeHeight(oObject) {

oObject.attachEvent('onmousemove',onMouseMove);
oObject.attachEvent('onmousedown',onMouseDown);
oObject.attachEvent('onmouseup',onMouseUp);

// You must specify an initial height for this object
// else event.offsetY will not fire against the oObject.

var inZone = false;
var inResize = false;
var type='';
var savedHeight;
var savedX;
var savedY;
var tolerance = 10;
var minHeight;

function onMouseMove() {
	if ( inResize && event.button == 1) {
		// Drag
		var deltaY = event.screenY - savedY;
		var height = savedHeight + deltaY;
		if ( height < minHeight ) {
			height = minHeight;
		}
		// Resize
		oObject.runtimeStyle.height = height;
	} else {
		var pixelTop = getPixelTop(oObject);
		if (  event.offsetY >= oObject.clientHeight + oObject.clientTop + oObject.scrollTop ) {
			// Bottom Border
			oObject.runtimeStyle.cursor='S-resize';
			type='S';
			inZone = true;
			
		} else {
			oObject.runtimeStyle.cursor='auto';
			type = '';
			inZone = false;
		}
	}
}

function onMouseDown() {
	if ( inZone && event.button == 1) {
		oObject.setCapture();
		savedX = event.screenX;
		savedY = event.screenY;
		savedWidth = oObject.offsetWidth;
		savedHeight = oObject.offsetHeight;
		inResize = true;
	} 
}
function onMouseUp () {
	inResize=false;
	oObject.releaseCapture();
}
}
