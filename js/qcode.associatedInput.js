// qcode associatedInput utility
// get form element associated with a label
// or array of form elements associated with array of labels
;var qcode = qcode || {};
qcode.associatedInput = function(target) {
    if ( target instanceof HTMLCollection ) {
        target = Array.from(target);
    }
    if ( target instanceof Array ) {
        let result = [];
        for (element of target) {
            result.push(
                qcode.associatedInput(element)
            );
        }
        return result;
    }
    
    if ( target.hasAttribute('for') ) {
        return document.getElementById(
            target.getAttribute('for')
        );
    } else {
        return target.querySelector('button,input');
    }
}
