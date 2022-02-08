;var qcode = qcode || {}

qcode.closest = function(element, selector) {
    "use strict";
    let parent = element.parentElement;
    while ( parent instanceof HTMLElement ) {
        if ( parent.matches(selector) ) {
            return parent
        }
        parent = parent.parentElement;
    }
    return null;
};
