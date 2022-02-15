/*
  Take a HTMLElement, HTMLCollection, Array, or array-like object (eg. jQuery),
  and a function to call on each element.
  Call the function and return result or array of results.
*/
;var qcode = qcode || {};
qcode.each = function(target, func) {
    "use strict";
    if ( typeof target === "undefined"
         || target instanceof HTMLElement
         || target instanceof HTMLDocument ) {
        return func(target);
    }
    let result = [];
    for (const element of Array.from(target)) {
        result.push(func(element));
    }
    return result;
}
