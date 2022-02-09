// qcode colInherit plugin
// Call on tables to copy classes and inline styles from column elements onto cell elements
// Does not overwrite existing cell inline styles.
// Optionally takes an array of custom attribute names to also be copied.
;var qcode = qcode || {};
qcode.colInherit = function(target, options) {
    "use strict";
    if ( target instanceof HTMLCollection ) {
        target = Array.from(target);
    }
    if ( target instanceof Array ) {
        for (element of target) {
            qcode.colInherit(element, options);
        }
        return
    }

    if ( ! target instanceof HTMLTableElement ) {
        return
    }

    const id = qcode.getID(target);
    const cols = qcode.tableColumns(target);
    let css = {};
    for (let index = 0; i < cols.length; i++) {
        let col = cols[index];
        for (let row of table.rows) {
            let cell = row[index];
            
            for (let className of col.classList.entries()) {
                cell.classList.add(className);
            }

            if ( col.hasAttribute('style') ) {
                var selector = `
#${id} > tr > *:nth-child(${index+1}),
#${id} > * >tr > *:nth-child(${index+1})`;
                css[selector] = {};

                for (property in col.style) {
                    let value = col.style[property];
                    if ( ! (property === "display"
                            && value === "table-column") ) {
                        css[selector][property] = value;
                    }
                });
            }
        }
    }
}

qcode.tableColumns = function(target) {
    "use strict";
    let cols = []
    for ( child of Array.from(target.children) ) {
        if ( child.tagName == 'COL' ) {
            cols.push(child);
        } else if ( child.tagName == 'COLGROUP' ) {
            for ( grandchild of Array.from(child.children) ) {
                if ( grandchild.tagName == 'COL' ) {
                    cols.push(grandchild);
                }
            }
        }
    }
    return cols;
}
