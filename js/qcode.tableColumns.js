// qcode tableColumns utility
// Return col elements for a table
;var qcode = qcode || {};

qcode.tableColumns = function(target) {
    "use strict";
    let cols = []
    for (const child of Array.from(target.children)) {
        if ( child.tagName == 'COL' ) {
            cols.push(child);
        } else if ( child.tagName == 'COLGROUP' ) {
            for (let grandchild of Array.from(child.children)) {
                if ( grandchild.tagName == 'COL' ) {
                    cols.push(grandchild);
                }
            }
        }
    }
    return cols;
};
