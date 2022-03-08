/* qcode.textRange.get and qcode.textRange.set functions
   get/set the selection text range
*/
;var qcode = qcode || {};
qcode.textrange = (function(){
    "use strict";
    const get = function(element) {
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
        
        const selectedRange = selection.getRangeAt(0);
        
        const elementRange = document.createRange();
	elementRange.selectNodeContents(element);
        
        const selectionStart = rangeStartInRange(selectedRange, elementRange);
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
    };
    
    return {
        "get": get,
        "set", set
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
