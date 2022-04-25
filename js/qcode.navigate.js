/*
  Qcode navigate plugin
  Navigate between page elements with arrow key
*/
;var qcode = qcode || {};
qcode.navigate = function(container, selector) {
    "use strict";
    
    if (selector === undefined) {
        selector = ':input:not(:button,:submit)';
    }

    container.addEventListener('keydown', event => {
        const fields = container.querySelectorAll(selector);

        const is_text_input =
              (event.target.matches('input:not([type=hidden])')
               || event.target.matches('textarea')
               || event.target.matches('[contenteditable=true]'));
        
        let nextElement;
        
        switch (event.key) {
        case "ArrowLeft":
            if ( is_text_input
                 && qcode.textRange.get(event.target).selectionAtStart
               ) {
                nextElement = qcode.westOf(event.target, fields);
            } else {
                return true
            }
            break;
        case "ArrowRight":
            if ( is_text_input
                 && qcode.textRange.get(event.target).selectionAtEnd
               ) {
                nextElement = qcode.eastOf(event.target, fields);
            } else {
                return true;
            }
            break;
        case "ArrowUp":
            if ( is_text_input
                 && qcode.textRange.get(event.target).selectionAtStart
               ) {
                nextElement = qcode.northOf(event.target, fields);
            } else {
                return true;
            }
            break;
        case "ArrowDown":
            if ( is_text_input
                 && qcode.textRange.get(event.target).selectionAtEnd
               ) {
                nextElement = qcode.southOf(event.target, fields);
            } else {
                return true;
            }
            break;
        case "Enter":
            if ( event.target.matches('textarea') ) {
                const selection = qcode.textRange.get(event.target);
                if ( ! (selection.selectionAtStart
                        && selection.selectionAtEnd)
                   ) {
                    return true;
                }
            }
            nextElement = qcode.southOf(event.target, fields);
            break
        default:
            return true;
        }

        // if nextElement exists change focus and prevent event defaults
        if ( nextElement instanceof HTMLElement ) {
            nextElement.focus()
        }
        event.preventDefault();
        return false;
    });
};
