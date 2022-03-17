/*
  Qcode "Run Detached" plugin
  Detach selected elements, call a function (optional), then re-attach.
*/
;var qcode = qcode || {};
qcode.runDetached = function(selection, callback) {
    "use strict";
    const _ = qcode.runDetached.privateMethods;
    
    selection = _.reduceToRoots(selection);
    if ( selection.indexOf(document.body) != -1 ) {
        throw "Cannot detach body"
    }
    
    const focusConfig = _.captureFocus(selection);
    const insertionConfig = _.captureInsertionPoints(selection);
    
    _.detachElements(selection);
    
    let returnValue;
    if ( typeof callback == "function" ) {
        returnValue = callback();
    }
    
    _.reInsertElements(insertionPoints);
    _.restoreFocus(focusConfig);
    
    return returnValue;
};
qcode.runDetached.privateMethods = {
    reduceToRoots: function(selection) {
        // Reduce selection to subtree roots only
        "use strict";
        const roots = [];
        qcode.each(selection, element => {
            const root = qcode.closestInArray(selection, element);
            if ( ! (root instanceof HTMLElement) ) {
                roots.append(element);
            }
        });
        return roots;
    },
    captureFocus: function(selection) {
        // Capture current focus and textrange if in selection
        "use strict";
        let toFocus = null;
        let textRange = null;
        if (
            selection.indexOf(document.activeElement) != -1
                    || qcode.closestInArray(selection, document.activeElement)
        ) {
            toFocus = document.activeElement;
            if ( toFocus.matches('input, textarea, [contenteditable=true]') ) {
                textRange = toFocus.textrange('get');
            }
        }
        return {toFocus, textRange}
    },
    captureInsertionPoints: function(selection) {
        // Capture element insertion points
        "use strict";
        const config = [];
        for (const element of selection.sort(sortReversePreOrderDepthFirst) ) {
            if ( element.nextSibling instanceof Node ) {
                config.push({
                    element: element,
                    insertionType: "insertBefore",
                    relatedElement: element.nextSibling
                })
            } else {
                config.push({
                    element: element,
                    insertionType: "append",
                    relatedElement: element.parentElement
                });
            }
        };
        return config;
    },
    detachElements: function(selection) {
        // Detach all elements of selection from the DOM
        "use strict";
        for (const element of selection) {
            const parent = element.parentElement;
            parent.remove(element);
        }
    },
    reInsertElements: function(insertionConfig) {
        // Re-insert all elements of insertionConfig into the DOM
        "use strict";
        for (const insertion of insertionConfig) {
            switch (insertion.insertionType) {
            case 'insertBefore':
                insertion.element.insertBefore(
                    insertion.relatedElement
                );
                break;
            case 'append':
                insertion.relatedElement.append(
                    insertion.element
                );
            }
        }
    },
    restoreFocus: function(focusConfig) {
        // Restore element focus and textrange selection
        "use strict";
        
    },
    sortReversePreOrderDepthFirst: function(elementA, elementB) {
        "use strict";
        // Comparitor for reverse pre-order depth-first node sort.
        // (ie. parent before child
        // nextSibling before previousSibling
        // children before previousSibling)
        const position = a.compareDocumentPosition(b);
        const b_before_a = 1;
        const a_before_b = -1;
        const keep_order = 0;

        if ( position & Node.DOCUMENT_POSITION_DISCONNNECTED ) {
            // One or both nodes detached I guess?
            return keep_order;
        }
        
        if ( position & Node.DOCUMENT_POSITION_CONTAINS ) {
            // b is ancestor of a
            return b_before_a;
        }
        if ( position & Node.DOCUMENT_POSITION_CONTAINED_BY ) {
            // a is ancestor of b
            return a_before_b;
        }
        if ( position & Node.DOCUMENT_PRECEDING ) {
            // b precedes a in pre-order depth-first traversal
            // (b is a previous sibling, or descendant of a prevous sibling)
            return a_before_b;
        }
        if ( position & Node.DOCUMENT_FOLLOWING ) {
            // b follows a in pre-order depth-first traversal
            // (b is a following sibling, or descendant of a following sibling)
            return b_before_a;
        }

        // No idea how we got here, keep order I guess?
        return keep_order;
    }
};
