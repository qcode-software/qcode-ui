/*
  qcode theadFixed plugin
  
  Makes the body + foot of a table scrollable,
  with a "fixed" copy of the thead.
*/
;var qcode = qcode || {};
qcode.theadFixed = function(target, options) {
    "use strict";
    return qcode.each(target, table => {
        if ( ! (table instanceof HTMLTableElement) ) {
            return
        }
        const clone = document.createElement('table');
        clone.append(table.querySelector('colgroup').cloneNode());
        clone.append(table.thead.cloneNode());
        clone.classList.add('thead-fixed-clone');

        const id = qcode.getID(clone);
        qcode.style(`#${id}`, 'table-layout', 'fixed');

        for (const input of Array.from(
            table.thead.querySelectorAll('input, textarea, select, button')
        )) {
            input.removeAttribute('name');
        }
    });
};
