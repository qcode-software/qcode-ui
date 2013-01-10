function dbGridDivStatus(oDivStatus) {
// This modified version of resize only allows Height Changes
var inZone = false;
var inResize = false;
var type='';
var savedWidth;
var savedHeight;
var savedX;
var savedY;
var tolerance = 10;
var minWidth;
var minHeight = 10;
// The div to resize
var oForDiv = oDivStatus.previousSibling;

// Attach
oDivStatus.attachEvent('onmousemove',onMouseMove);
oDivStatus.attachEvent('onmousedown',onMouseDown);
oDivStatus.attachEvent('onmouseup',onMouseUp);

function onMouseMove() {
	if ( inResize && event.button == 1) {
		// Drag
		var deltaY = event.screenY - savedY;
		var height = savedHeight + deltaY;
		if ( height < minHeight ) {
			height = minHeight;
		}
		// Resize
		oForDiv.runtimeStyle.height = height;
	} else {
		if ( event.offsetY >= oDivStatus.clientHeight + oDivStatus.clientTop + oDivStatus.scrollTop) {
			// Bottom Border
			oDivStatus.runtimeStyle.cursor='S-resize';
			type='S';
			inZone = true;
			
		} else {
			oDivStatus.runtimeStyle.cursor='auto';
			type = '';
			inZone = false;
		}
	}
}

function onMouseDown() {
	if ( inZone && event.button == 1) {
		oDivStatus.setCapture();
		savedX = event.screenX;
		savedY = event.screenY;
		savedHeight = oForDiv.offsetHeight;
		inResize = true;
	} 
}
function onMouseUp () {
	inResize=false;
	oDivStatus.releaseCapture();
}
//
}