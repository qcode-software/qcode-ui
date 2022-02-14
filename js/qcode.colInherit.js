// qcode colInherit plugin
// Call on tables to copy classes and inline styles from column elements onto cell elements
// Does not overwrite existing cell inline styles.
// Optionally takes an array of custom attribute names to also be copied.
;var qcode = qcode || {};
qcode.colInherit = function(target, customAttributes) {
    "use strict";
    return qcode.each(target, table => {
        if ( ! table instanceof HTMLTableElement ) {
            return
        }

        const id = qcode.getID(table);
        const cols = qcode.tableColumns(table);
        let css = {};
        for (let index = 0; index < cols.length; index++) {
            let col = cols[index];

            if ( col.hasAttribute('style') ) {
                const selector = `
#${id} > tr > *:nth-child(${index+1}),
#${id} > * >tr > *:nth-child(${index+1})`;
                css[selector] = {};

                for (const property in col.style) {
                    const value = col.style[property];
                    if ( ! (property === "display"
                            && value === "table-column") ) {
                        css[selector][property] = value;
                    }
                };
            }
            
            for (const row of table.rows) {
                const cell = row.children.item(index);
                
                for (const className of col.classList.values()) {
                    cell.classList.add(className);
                }

                for (const attributeName of (customAttributes || [])){
                    if ( col.hasAttribute(attributeName) ) {
                        cell.setAttribute(
                            attributeName,
                            col.getAttribute(attributeName)
                        );
                    }
                }
            }
        }
        qcode.style(css);
        return table
    });
};
