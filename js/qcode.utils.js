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

qcode.getStyle = function(element,property) {
    return window.getComputedStyle(element).getPropertyValue(property);
};

qcode.addDelegatedEventListener = function(
    element, selector, eventName, handler
) {
    element.addEventListener(eventName, event => {
        let delegateTarget;
        if ( event.target.matches(selector) ) {
            delegateTarget = event.target;
        } else {
            let parent = event.target.parentElement;
            while ( parent instanceof HTMLElement ) {
                if ( parent == element ) {
                    return
                } else if ( parent.matches(selector) ) {
                    delegateTarget = event.target;
                    break
                }
            }
            if ( typeof delegateTarget === "undefined" ) {
                return
            }
        }
        handler(event,delegateTarget);
    });
};
