/**
 * jquery-textrange
 * A jQuery plugin for getting, setting and replacing the selected text in input fields and textareas.
 *
 * (c) 2012 Daniel Imhoff <dwieeb@gmail.com> - danielimhoff.com
 */
(function($) {

  var textrange = {
    get: function(property) {
      return _textrange.get.apply(this, [property]);
    },

    set: function(selectionStart, selectionEnd) {
      var text = this.val();
      if ( ! text ) {
	var text = this.text();
      }

      if(selectionStart === 'all') {
        selectionStart = 0;
        selectionEnd = text.length;
      } 
      else if(selectionStart === 'start') {
        selectionStart = 0;
  	selectionEnd = 0;
      }
      else if(selectionStart === 'end') {
        selectionStart = text.length;
  	selectionEnd = text.length;
      }

      if(typeof selectionStart === 'undefined') {
        selectionStart = 0;
      } 
      if(typeof selectionEnd === 'undefined') {
        selectionEnd = selectionStart;
      }       

      _textrange.set.apply(this, [selectionStart, selectionEnd]);

      return this;
    }
  };

  var _textrange = {
    get: function(property) {

      var text = this.val();
      if ( ! text ) {
	var text = this.text();
      }

      var textNode = jQuery(this);
      if ( window.getSelection ) {
	contents = this.contents();
	while ( contents.size() ) {
	    firstNode = contents.get(0);
	  if ( firstNode.nodeType == 3 ) {
	      textNode = $(firstNode);
	      break;
	  } else {
	      contents = $(firstNode).contents();
	  }
	}
	contents = this.contents();
	while ( contents.size() ) {
	    lastNode = contents.get(contents.size() - 1);
	  if ( lastNode.nodeType == 3 ) {
	      endNode = $(lastNode);
	      break;
	  } else {
	      contents = $(lastNode).contents();
	  }
	}
      }

      if ( this[0].selectionStart != undefined ) { 
        var selectionStart = this[0].selectionStart;
        var selectionEnd = this[0].selectionEnd;
        var selectionLength = this[0].selectionEnd - this[0].selectionStart;
        var selectionText = text.substring(this[0].selectionStart, this[0].selectionEnd);
	if ( selectionStart == 0 ) {
	  var selectionAtStart = true
	} else {
	  var selectionAtStart = false
	}
	if ( selectionEnd == text.length ) {
	  var selectionAtEnd = true
	} else {
	  var selectionAtEnd = false
	}

      } else if ( window.getSelection && window.getSelection().rangeCount > 0 ) { 
	var selection = window.getSelection();
	var selectedRange = selection.getRangeAt(0);
	var selectionStart = selectedRange.startOffset;
	var selectionEnd = selectionStart + selectedRange.toString().length;

	var elmtRange = document.createRange();   
        // aligns the selectedRange to selectionStart and selectionEnd points
        elmtRange.setStart(textNode[0], selectionStart);
        elmtRange.setEnd(endNode[0], selectionEnd);	   

	if ( selectedRange.compareBoundaryPoints(Range.START_TO_START,elmtRange) == 0 ) {
	  var selectionAtStart = true
	} else {
	  var selectionAtStart = false
	}
	if ( selectedRange.compareBoundaryPoints(Range.END_TO_END,elmtRange) == 0 ) {
	  var selectionAtEnd = true
	} else {
	  var selectionAtEnd = false
	}

	var selectionLength = selectedRange.toString().length;
	var selectionText = selectedRange.toString();

      } else if ( document.selection && document.selection.createRange ) {
	var selectedRange = document.selection.createRange();
	if ( this[0].createTextRange ) {
	  var elmtRange = this[0].createTextRange(); 
	} else {
	  var elmtRange = document.body.createTextRange(); 
	  elmtRange.moveToElementText(this[0]);
	}

	if ( selectedRange.compareEndPoints('StartToStart',elmtRange) == 0 ) {
	  var selectionAtStart = true
	} else {
	  var selectionAtStart = false
	}
	if ( selectedRange.compareEndPoints('EndtoEnd',elmtRange) == 0 ) {
	  var selectionAtEnd = true
	} else {
	  var selectionAtEnd = false
	}

	elmtRangeCopy = elmtRange.duplicate();
	elmtRange.moveToBookmark(selectedRange.getBookmark());
	elmtRangeCopy.setEndPoint('EndToStart', elmtRange);

	var selectionStart = elmtRangeCopy.text.length;
	var selectionEnd = selectionStart + selectedRange.text.length;
	var selectionLength = selectedRange.text.length;
	var selectionText = selectedRange.text;
      } else {
	var selectionStart = 0;
	var selectionEnd = 0;
	var selectionLength = 0;
	var selectionText = '';
	var selectionAtStart = false
	var selectionAtEnd = false;
      }
      
      var props = {
        selectionStart: selectionStart,
        selectionEnd: selectionEnd,
        selectionLength: selectionLength,
        selectionText: selectionText,
	selectionAtStart: selectionAtStart,
	selectionAtEnd: selectionAtEnd,
	text: text
      };

      return typeof property === 'undefined' ? props : props[property];
    },

    set: function(selectionStart, selectionEnd) {
      this.focus();

      var textNode = jQuery(this);
      if ( window.getSelection ) {
	contents = this.contents();
	while ( contents.size() ) {
	  firstNode = contents.get(0)
	  if ( firstNode.nodeType == 3 ) {
	      textNode = $(firstNode);
	      break;
	  } else {
	      contents = $(firstNode).contents();
	  }
	}
      }

      if ( this[0].selectionStart ) { 
	this[0].selectionStart = selectionStart;
        this[0].selectionEnd = selectionEnd;
      } else if ( window.getSelection && textNode.size() ) { 
        var selection = window.getSelection();
        var range = document.createRange();   
        // aligns the range to selectionStart and selectionEnd points
        range.setStart(textNode[0], selectionStart);
        range.setEnd(textNode[0], selectionEnd);	    
	selection.removeAllRanges();
        selection.addRange(range);
      } else if ( this[0].createTextRange ) { 
        var elmtRange = this[0].createTextRange(); 
	elmtRange.collapse(true); 
        elmtRange.moveStart('character', selectionStart); 
        elmtRange.moveEnd('character', selectionEnd-selectionStart); 
	elmtRange.select(); 
      } else if ( document.body.createTextRange ) { 
        var elmtRange = document.body.createTextRange(); 
	elmtRange.moveToElementText(this[0]);
	elmtRange.collapse(true); 
        elmtRange.moveStart('character', selectionStart); 
        elmtRange.moveEnd('character', selectionEnd-selectionStart); 
	elmtRange.select(); 
      }
    }        
  };

  $.fn.textrange = function(method) {
    if(typeof method === 'undefined' || typeof method !== 'string') {
      return textrange.get.apply(this);
    }
    else if(typeof textrange[method] === 'function') {
      return textrange[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else {
      $.error("Method " + method + " does not exist in jQuery.textrange");
    }
  };
})(jQuery);
