/*
  Qcode "Run Detached" plugin
  Detach selected elements, call a function (optional), then re-attach.
*/
;var qcode = qcode || {};
qcode.runDetached = function(selection) {
    "use strict";

    let toFocus = null;
    let textRange = null;
    if ( qcode.closestInArray(
        qcode.selectionAsArray(selection),
        document.activeElement
    ) ) {
        toFocus = document.activeElement;
        if ( toFocus.matches('input, textarea, [contenteditable=true]' ) {
            textRange = toFocus.textrange('get');
        }
    }
    
    const nextSiblings = {};
    const parents = {};
    let i = 0;
    qcode.each(selection, element => {
        if ( element.nextSibling instanceof Node ) {
            nextSiblings[i] = element.nextSibling;
        } else {
            parents[i] = element.parentElement;
        }
        i++;
    });
};
