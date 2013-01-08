(function($){
    // DbGridDivStatus Class Constructor - vertical resize on bottom border
    var DbGridDivStatus = function(statusDiv) {
        // Private Class Variables
        var inZone = false;
        var inResize = false;
        var savedHeight;
        var savedY;
        var minHeight = 10;
        // The div to resize
        var resizeDiv;
        
        // Events
        statusDiv.on('mousemove.dbGridDivStatus', onMouseMoveStatusDiv);
        statusDiv.on('mousedown.dbGridDivStatus', onMouseDownStatusDiv);
        jQuery(document).on('mouseup.dbGridDivStatus',onMouseUpWindow);
        jQuery(document).on('mousemove.dbGridDivStatus', onMouseMoveWindow);
        
        // Private Class Methods
        function onMouseMoveStatusDiv(e) {
            if ( e.pageY >= statusDiv.height() + statusDiv.offset().top + statusDiv.scrollTop() ) {
	        // Bottom Border
	        statusDiv.css('cursor','S-resize');
	        inZone = true;	  
            } else if ( ! inResize ) {
	        statusDiv.css('cursor','auto');
	        inZone = false;
            } 
        }  
        function onMouseDownStatusDiv(e) {
            if ( inZone && e.which == 1) {
                resizeDiv = statusDiv.prev();
	        inResize = true;
	        savedY = e.screenY;
	        savedHeight = resizeDiv.height();
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
	        resizeDiv.height(height);
	        resizeDiv.trigger('resize');
            }
        }
        function onMouseUpWindow(e) {
            if ( inResize ) {
	        inResize = false;
            }
        }
    };

    // Make DbGridDivStatus Class available as a jquery plugin
    $.fn.dbGridDivStatus = function() {
        var divs = this

        if ( divs.not('div').size() ) {
            throw new Error('jQuery.dbGridDivStatus requires that only div elements are contained in the jQuery object');
        }

        // Initialise DbGridDivStatus objects for each div unless this has already been done
        for ( var i=0; i< divs.size(); i++ ) {
            var div = divs.eq(i);
            var dbGridDivStatus = div.data('dbGridDivStatus');

            if ( ! dbGridDivStatus ) {
	        dbGridDivStatus = new DbGridDivStatus(div);
	        div.data('dbGridDivStatus',dbGridDivStatus);
            }
        }
        
        return divs;
    };

}) (jQuery);