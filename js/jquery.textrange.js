/* ==== jquery.textrange.js ==== */
(function($, undefined) {
    var textrange = {
        get: function(property) {
            var selectionText="";
            var selectionAtStart=false;
            var selectionAtEnd=false;
            var selectionStart;
            var selectionEnd
            var text = this.is(':input') ?  this.val() :  this.text();

            if (this.is(':input') && this[0].selectionStart !== undefined) {
                // Standards compliant input elements
                selectionStart = this[0].selectionStart;
                selectionEnd = this[0].selectionEnd;
                selectionText = text.substring(this[0].selectionStart, this[0].selectionEnd);
                if (selectionStart == 0) {
                    selectionAtStart = true
                } else {
                    selectionAtStart = false
                }
                if (selectionEnd == text.length) {
                    selectionAtEnd = true
                } else {
                    selectionAtEnd = false
                }
            } else {
                // Content editable HTML areas
                var selection =  window.getSelection();
                if (selection.rangeCount>0) {
                    var selectedRange = selection.getRangeAt(0);
                    var elmtRange = document.createRange();
		    elmtRange.selectNodeContents(this[0]);

		    if (elmtRange.toString().search(/\S/)!=-1) {
			// Find the index of the first text not markup or whitespace.
			var editStartPosition = getRangePosition(this,elmtRange.toString().search(/\S/));
		    } else {
			var editStartPosition = getRangePosition(this,0);
		    }
		    if (elmtRange.toString().search(/\s+$/)!=-1) {
			// index of whitespace at the end of the string
			editEndPosition = getRangePosition(this,elmtRange.toString().search(/\s+$/));
		    } else {
			editEndPosition = getRangePosition(this,elmtRange.toString().length);
		    }

		    // editRange spans the editable text
		    editRange  = document.createRange();
		    editRange.setStart(editStartPosition.node,editStartPosition.offset);
		    editRange.setEnd(editEndPosition.node,editEndPosition.offset);

		    // At edit start or edit end
		    selectionAtStart = Boolean(selectedRange.compareBoundaryPoints(Range.START_TO_START,editRange)<=0);
		    selectionAtEnd = Boolean(selectedRange.compareBoundaryPoints(Range.END_TO_END,editRange)>=0);

                    // selectionStart
                    var myRange = document.createRange();
                    myRange.setStart(elmtRange.startContainer,elmtRange.startOffset);
                    myRange.setEnd(selectedRange.startContainer,selectedRange.startOffset);
                    selectionStart = myRange.toString().length;
                    // selectionEnd
                    myRange.setStart(selectedRange.endContainer,selectedRange.endOffset);
                    myRange.setEnd(elmtRange.endContainer,elmtRange.endOffset);
                    selectionEnd = elmtRange.toString().length - myRange.toString().length;
                    // selectedText
                    selectionText = selectedRange.toString();
                }
            }
            
            var props = {
                selectionText: selectionText,
                selectionAtStart: selectionAtStart,
                selectionAtEnd: selectionAtEnd,
                selectionStart: selectionStart,
                selectionEnd: selectionEnd,
                text: text

            };

            return typeof property === 'undefined' ? props : props[property];
        },

        set: function(selectionStart, selectionEnd) {
            if ( !this.is(':input')
                 && !this.is('[contenteditable=true]')
               ) {
                $.error('jQuery.textrange("set") requires that only input or' +
                        'contenteditable elements are contained in the' +
                        'jQuery object');
            }
            if ( ! this.is(':focus') ) {
                this.focus();
            }
            var text = this.is(':input') ?  this.val() :  this.text();
            if (selectionStart === 'start') {
                selectionStart = 0;
            } 
            if (selectionStart === 'end') {
                selectionStart = text.length;
            }
            if (selectionEnd === 'start') {
                selectionEnd = 0;
            }
            if (selectionEnd === 'end') {
                selectionEnd = text.length;
            }
            if (selectionStart === 'all' && selectionEnd===undefined ) {
                selectionStart=0
                selectionEnd = text.length;
            }
            if (this.is(':input') && this[0].selectionStart != undefined) {
                // Standards compliant input elements
                this[0].selectionStart = selectionStart;
                this[0].selectionEnd = selectionEnd;
            } else if (this.is('[contenteditable=true]') && window.getSelection && window.getSelection().rangeCount > 0) {
                // Content editable
                var selection = window.getSelection();
                var range = document.createRange();

                var startPosition = getRangePosition(this, selectionStart);
                var endPosition = getRangePosition(this, selectionEnd);

                range.setStart(startPosition.node, startPosition.offset);
                range.setEnd(endPosition.node, endPosition.offset);
                selection.removeAllRanges();
                selection.addRange(range);
            } 
            return this;
        }
    };
    function getRangePosition(node, index) {
        // Find the text node (possibly nested) and corresponding offset on the left of 
	// character at index from start of this node
        var childNodes = node.contents();
	var myRange =  document.createRange();
        if (childNodes.size()) {
            for (var i = 0; i < childNodes.size(); i++) {
                var childNode = childNodes.eq(i);
		myRange.selectNode(childNode[0]);
                textLength = myRange.toString().length;
                if ((textLength > 0 && index < textLength) || (i==childNodes.size()-1 && index==textLength)) {
		    // The point we are looking for is in this child
                    return getRangePosition(childNode, index);
                }
                index -= textLength;
            }
        } else {
            return {
                node: node[0],
                offset: index
            }
        }
    }

    $.fn.textrange = function(method) {
	if (typeof textrange[method] === 'function') {
            return textrange[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error("Method " + method + " does not exist in jQuery.textrange");
        }
    };
})(jQuery);