;var qcode = qcode || {};

qcode.setStateClass = function(element, newClass, classList) {
    "use strict";
    if ( newClass != "" && ! classList.includes(newClass)) {
        throw `Unknown class ${newClass}`;
    }
    element.classList.remove.apply(
        element.classList,
        classList
    );
    if ( newClass != "" ) {
        element.classList.add(newClass);
    }
};
