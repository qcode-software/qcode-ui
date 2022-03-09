/* qcode.textRange.get and qcode.textRange.set functions
   get/set the selection text range
*/
;var qcode = qcode || {};
qcode.textrange = (function(){
    "use strict";
    const get = function(element) {
        // input element or textarea
        if ( element.matches('input, textarea') ) {
            return {
                "selectionText": element.value.substring(
                    element.selectionStart,
                    element.selectionEnd
                ),
                "selectionAtStart": element.selectionStart == 0,
                "selectionAtEnd": element.selectionEnd == element.value.length,
                "selectionStart": element.selectionStart,
                "selectionEnd": element.selectionEnd,
                "text": element.value
            }
        }
        
        const selection = window.getSelection();

        // No selection
        if ( selection.rangeCount == 0 ) {
            return {
                "selectionText": "",
                "selectionAtStart": false,
                "selectionAtEnd": false,
                "text": element.innerText
            }
        }

        // Use ranges 
        const selectedRange = selection.getRangeAt(0);
        
        const elementRange = document.createRange();
	elementRange.selectNodeContents(element);
        
        const selectionStart = startOfRangeInRange(selectedRange, elementRange);
        const selectionEnd = endOfRangeInRange(selectedRange, elementRange);
        
	const editableRange = getEditableRange(element);
        const selectionAtStart = selectedRange.compareBoundaryPoints(
            Range.START_TO_START, editableRange
        ) <= 0;
        const selectionAtEnd = selectedRange.compareBoundaryPoints(
            Range.END_TO_END, editableRange
        ) >= 0;

        return {
            "selectionText": selectedRange.toString(),
            "selectionAtStart": selectionAtStart,
            "selectionAtEnd": selectionAtEnd,
            "selectionStart": selectionStart,
            "selectionEnd": selectionEnd,
            "text": text
        }
    };
    
    const set = function(element, start, end) {
        if ( element != document.activeElement ) {
            element.focus();
        }
        const text = ( element.matches('input, textarea') ?
                       element.value : element.innerText );

        [start, end] = parseInputs(start, end, text);
        
        if ( element.matches('input, textarea') ) {
            element.selectionStart = start;
            element.selectionEnd = end;
            return
        }
        if ( ! element.matches('[contenteditable=true]') ) {
            return
        }
        const selection = window.getSelection();
        if ( selection.rangeCount == 0 ) {
            return
        }
        const range = selection.createRange();
        const startPosition = getRangePosition(element, start);
        const endPosition = getRangePosition(element, end);

        range.setStart(startPosition.node, startPosition.offset);
        range.setEnd(endPosition.node, endPosition.offset);
        selection.removeAllRanges();
        selection.addRange(range);
    };
    
    return {
        "get": get,
        "set", set
    }

    function getRangePosition(node, index) {
        // Find the text node (possibly nested) and corresponding offset
        // on the left of character at index from start of this node
        const childNodes = node.childNodes;
	const myRange =  document.createRange();
        if ( childNodes.length ) {
            for (let i = 0; i < childNodes.length; i++) {
                const childNode = childNodes[i];
		myRange.selectNode(childNode);
                const textLength = myRange.toString().length;
                if ( (textLength > 0 && index < textLength)
                     || (i==childNodes.length-1 && index==textLength) ) {
		    // The point we are looking for is in this child
                    return getRangePosition(childNode, index);
                }
                index -= textLength;
            }
        } else {
            return {
                node: node,
                offset: index
            }
        }
    }

    function parseInputs(start, end, text) {
        if ( start === 'start' ) {
            start = 0;
        }
        if ( start === 'end' ) {
            start = text.length;
        }
        if ( end === 'start' ) {
            end = 0;
        }
        if ( end === 'end' ) {
            end = text.length;
        }
        if ( start === 'all' && end === undefined ) {
            start = 0;
            end = text.length;
        }
        return [start, end];
    }

    function getEditableRange(element) {
	const editableRange = document.createRange();
        
        const editableStartPosition = getRangePosition(
            element, Math.max(element.innerText.search(/\S/), 0)
        );
        const editableEndPosition = getRangePosition(
            element, element.innerText.search(/\s*$/)
        );
        
	editableRange.setStart(
            editableStartPosition.node,
            editableStartPosition.offset
        );
	editableRange.setEnd(
            editableEndPosition.node,
            editableEndPosition.offset
        );

        return editableRange;
    }
    function startOfRangeInRange(innerRange, outerRange) {
        const startRange = document.createRange();
        startRange.setStart(
            outerRange.startContainer,
            outerRange.startOffset
        );
        startRange.setEnd(
            innerRange.startContainer,
            innerRange.startOffset
        );
        const startRange.toString().length;
    }
    function endOfRangeInRange(innerRange, outerRange) {
        const endRange = document.createRange();
        endRange.setStart(
            innerRange.endContainer,
            innerRange.endOffset
        );
        endRange.setEnd(
            outerRange.endContainer,
            outerRange.endOffset
        );
        return outerRange.toString().length - innerRange.toString().length;
    }
})();
