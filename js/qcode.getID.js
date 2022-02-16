/* qcode getID -
Returns a unique id for the given element,
uses the existing id if it has one */
;var qcode = qcode || {};
qcode.getID = (function() {
    let nextID = 0;
    return function(target) {
        if ( ! target.hasAttribute('id') ) {
            target.setAttribute('id', `qcodeUI_id_${nextID++}`);
        }
        return target.getAttribute('id');
    }
})();
