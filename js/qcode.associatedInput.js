// qcode associatedInput utility
// get form element associated with a label
// or array of form elements associated with array of labels
;var qcode = qcode || {};
qcode.associatedInput = function(target) {
    "use strict";
    return qcode.each(target, target => {
        if ( target.hasAttribute('for') ) {
            return document.getElementById(
                target.getAttribute('for')
            );
        } else {
            return target.querySelector('button,input');
        }
    })
};
