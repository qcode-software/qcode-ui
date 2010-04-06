function dbHeader(oTable) {
  // Resize table columns

  // vars
  var inZone = false;
  var inResize = false;
  var savedWidth;
  var savedX;
  var tolerance = 10;
  var minWidth = 10;
  var oTH;
  var oTHfixed;

  oTheadFixed=oTable.theadFixed;
  oTheadFixed.attachEvent('onmousedown',OnMouseDown);
  oTheadFixed.attachEvent('onmousemove',OnMouseMove);
  oTheadFixed.attachEvent('onmouseup',OnMouseUp);
  
  
  function OnMouseDown () {
    var srcElement = event.srcElement;	
    if ( inZone && event.button == 1) {
      oTheadFixed.setCapture();
      savedX = event.screenX;
      savedWidth = oTHfixed.clientWidth;
      inResize = true;
    }
  }
  
  function OnMouseMove () {
    if ( inResize && event.button == 1  ) {	
      // Drag
      var width = savedWidth + event.screenX - savedX;
      if ( width > minWidth ) {
	//
      }
    } else {
      // Mouse over
      srcElement = event.srcElement;
      if ( srcElement.forTH && srcElement.offsetWidth - event.offsetX < tolerance) {
	// This cell left of right boundery
	inZone = true;
	oTHfixed=srcElement;
	oTH=oTHfixed.forTH;
	oTheadFixed.runtimeStyle.cursor='col-resize';
      } else if ( event.offsetX < tolerance && srcElement.forTH && srcElement.forTH.cellIndex>0 ) {
	// This cell right of left boundery
	inZone = true;
	oTHfixed=oTheadFixed.children[srcElement.forTH.cellIndex-1];
	oTH=oTHfixed.forTH;
	oTheadFixed.runtimeStyle.cursor='col-resize';
      } else {
	inZone = false;
	oTheadFixed.runtimeStyle.cursor='auto';
      }
    }
  }
  
  function OnMouseUp () {
    if ( inResize ) {
      var width = savedWidth + event.screenX - savedX;
      if ( width > minWidth ) {
	oTable.resize(oTH.cellIndex,width);
      }
      inResize=false;
      oTheadFixed.releaseCapture();
    }
  }
  //
}
