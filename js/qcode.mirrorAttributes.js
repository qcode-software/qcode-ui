/*
  qcode mirrorAttributes plugin
  
  monitor sourceElement for changes to specified attributes
  when changes occur, copy them to targetElement
  and dispatch an "attributeChange" event
*/
;var qcode = qcode || {};
qcode.mirrorAttributes = (function() {
    return function(sourceElement, targetElement, attributeFilter) {
        const observer = new MutationObserver(mutations => {
            const summary = mutationSummary(mutations);
            for (const change of summary) {
                const targetDescendant = qcode.equivalentDescendant(
                    sourceElement,
                    change.element,
                    targetElement
                );
                if ( change.newValue == "" ) {
                    targetDescendant.removeAttribute(name);
                } else {
                    targetDescendant.setAttribute(name, change.newValue);
                }
            }
            sourceElement.dispatchEvent(
                new CustomEvent('attributeChange', {
                    detail: {
                        changes: summary
                    },
                    bubbles: true
                });
            );
        });
        observer.observe(
            targetElement,
            {
                attributes: true,
                attributeFilter: attributeFilter,
                attributeOldValue: true,
                subtree: true
            }
        )
    }
    function mutationSummary(mutations) {
        // Return a summary list of changes without intermediate changes.
        const summary = [];
        const done = [];
        for (const mutation of mutations) {
            const target = mutation.target;
            const name = mutation.attributeName;
            let oldValue = mutation.oldValue;
            if ( oldValue == null ) {
                oldValue = "";
            }
            let newValue = target.getAttribute(name);
            if ( newValue == null ) {
                newValue = "";
            }
            found = done.some(function(member) {
                if ( member.element == target && member.attribute == name ) {
                    return true;
                }
                return false;
            });
            if ( ! found ) {
                if ( newValue !== oldValue ) {
                    summary.push({
                        element: target,
                        attribute: name,
                        oldValue: oldValue,
                        newValue: newValue
                    });
                }
                done.push({
                    element: target,
                    attribute: name
                });
            }
        });
        return summary;
    }
})();
