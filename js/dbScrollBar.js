function dbScrollBar(oScrollBar,callback) {

var oTracker = oScrollBar.firstChild;
var inDrag = false;
var savedTop;
var savedX;
var savedY;
var max;

// Methods
oScrollBar.setTrackerHeight=setTrackerHeight;
oScrollBar.setTrackerPos = setTrackerPos;

// Attach
oTracker.attachEvent('onmousemove',onMouseMove);
oTracker.attachEvent('onmousedown',onMouseDown);
oTracker.attachEvent('onmouseup',onMouseUp);

function setTrackerHeight(perct) {
	if ( perct < 0 ) { perct = 0 }
	if ( perct > 1 ) { perct = 1 }
	var height = Math.round(perct*oScrollBar.clientHeight);
	if ( height < 5 ) { height = 5 }
	if ( height == oScrollBar.clientHeight ) { 
		oTracker.style.display = 'none';
	} else {
		oTracker.style.display = 'block';
	}
	oTracker.style.height = height;
}

function setTrackerPos(pos) {
	// pos is between 0 and 1
	if ( pos > 1 ) { pos = 1 }
	if ( pos < 0 ) { pos = 0 }
	oTracker.style.marginTop = Math.round(pos*(oScrollBar.clientHeight - oTracker.offsetHeight));
}

function onMouseMove() {
	if ( inDrag && window.event.button == 1) {
		// Drag
		var deltaY = window.event.screenY - savedY;
		var top = savedTop + deltaY;
		// Move
		if ( top < 0 ) { top = 0; }
		if ( top > max ) { top=max; }
		oTracker.style.marginTop = top;
	}
}

function onMouseDown() {
	if ( window.event.button == 1) {
		oTracker.setCapture();
		savedX = window.event.screenX;
		savedY = window.event.screenY;
		savedTop = oTracker.offsetTop;
		inDrag = true;
		max = oScrollBar.clientHeight - oTracker.offsetHeight;
	} 
}
function onMouseUp () {
	inDrag=false;
	oTracker.releaseCapture();
	callback(oTracker.offsetTop/max);
}
// end 
}  