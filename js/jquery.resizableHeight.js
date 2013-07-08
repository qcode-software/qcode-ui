(function($){
  // ResizableHeight Class Constructor - vertical resize on bottom border
  var ResizableHeight = function(resizeElmt) {
    // Private Class Variables
    var inZone = false;
    var inResize = false;
    var savedHeight;
    var savedY;
    var minHeight = 10;
    // The element to resize
    var resizeElmnt = resizeElmt;
    
    // Events
    resizeElmnt.on('mousemove.resizableHeight', onMouseMoveResizeElmt);
    resizeElmnt.on('mousedown.resizableHeight', onMouseDownResizeElmt);
    jQuery(document).on('mouseup.resizableHeight',onMouseUpWindow);
    jQuery(document).on('mousemove.resizableHeight', onMouseMoveWindow);
    
    // Private Class Methods
    function onMouseMoveResizeElmt(e) {
      if ( e.pageY >= resizeElmnt.height() + resizeElmnt.offset().top + resizeElmnt.scrollTop()) {
	// Bottom Border
	resizeElmnt.css('cursor','S-resize');
	inZone = true;	  
      } else if ( ! inResize ) {
	resizeElmnt.css('cursor','auto');
	inZone = false;
      } 
    }  
    function onMouseDownResizeElmt(e) {
      if ( inZone && e.which == 1) {
	inResize = true;
	savedY = e.screenY;
	savedHeight = resizeElmt.height();
	return false;
      } 
    }
    function onMouseMoveWindow(e) {
      if ( inResize ) {
	// Drag
	var deltaY = e.screenY - savedY;
	var height = savedHeight + deltaY;
	if ( height < minHeight ) {
	  height = minHeight;
	}
	// Resize
	resizeElmt.height(height);
      }
    }
    function onMouseUpWindow(e) {
      if ( inResize ) {
	inResize = false;
      }
    }
  };

  // Make ResizableHeight Class available as a jquery plugin
  $.fn.resizableHeight = function() {
    var elmts = this

    // Initialise ResizableHeight objects for each elmt unless this has already been done
    for ( var i=0; i< elmts.size(); i++ ) {
      var elmt = elmts.eq(i);
      var resizableHeight = elmt.data('resizableHeight');

      if ( ! resizableHeight ) {
	resizableHeight = new ResizableHeight(elmt);
	elmt.data('resizableHeight',resizableHeight);
      }
    }
    
    return elmts;
  };

}) (jQuery);