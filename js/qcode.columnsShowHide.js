/*
  Qcode Columns Show/Hide plugin
  Show and/or hide selected columns of tables
  "showHide" argument is an optional string of "show" or "hide",
  if undefined selected columns will toggle visibility
*/
;var qcode = qcode || {};
qcode.columnsShowHide = function(target, selector, showHide) {
    "use strict";
    return qcode.each(target, table => {
        const id = qcode.getID(table);

        let css = {};
        for (const column of Array.from(table.querySelectorAll(selector))) {
            const index = qcode.index(column);
            const nthChild = `:nth-child(${index+1})`;
            if ( showHide === 'hide'
                 || (showHide === undefined
                     && qcode.getStyle(column,'display') === "table-column")
               ) {
                css[`#${id} col${nthChild}`] = {display: "none"};
                css[`#${id} tr > ${nthChild}`] = {display: "none"};
            } else {
                css[`#${id} col${nthChild}`] = {display: "table-column"};
                css[`#${id} tr > ${nthChild}`] = {display: "table-cell"};
            }
        }

        qcode.style(css);
        
        table.dispatchEvent(
            new Event('resize', {
                bubbles: true,
                cancelable: true,
                composed: true
            })
        );
        
        return table;
    });
};
