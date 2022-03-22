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

qcode.closestInArray = function(element, elementArray) {
    "use strict";
    let parent = element.parentElement;
    while ( parent instanceof HTMLElement ) {
        if ( elementArray.indexOf(parent) > -1 ) {
            return parent
        }
        parent = parent.parentElement;
    }
    return null;
};

qcode.getStyle = function(element,property) {
    "use strict";
    return window.getComputedStyle(element).getPropertyValue(property);
};

qcode.addDelegatedEventListener = function(
    element, selector, eventName, handler
) {
    "use strict";
    qcode.on(element, eventName, event => {
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
                parent = parent.parentElement;
            }
            if ( typeof delegateTarget === "undefined" ) {
                return
            }
        }
        handler(event,delegateTarget);
    });
};

qcode.index = function(element) {
    "use strict";
    return Array.from(element.parentElement.children).indexOf(element);
};

qcode.onClassChange = function(element, callback) {
    "use strict";
    const htmlObserver = new MutationObserver(callback);
    htmlObserver.observe(
        element,
        {
            childList: true,
            characterData: true,
            subtree: true,
            attributeFilter: ["class"]
        }
    );
};
