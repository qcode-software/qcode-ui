/*
  Qcode Column Resize plugin
  Allows a table column to be resized
  If the content does not fit the column,
  use behaviour defined by overflow options:
  - normal: do nothing, let the underlying css/UA handle it.
    Usually means the column just won't shrink any further.
  - hidden: clip the overflow.
  - shrink: reduce the font size (down to min-font-size)
    until the content fits. Supports only a single font size for the column.
  - shrink-one-line (default): as shrink,
    but force no wrapping to keep on one-line
  - break-word: force word break to try and make the content fit.
*/
;var qcode = qcode || {};
qcode.columnResize = (function() {
    "use strict";

    const handleWidth = 10;
    const minWidth = 10;
    let dragging = false;
    
    return function(target, options) {
        Object.assign(options,{
            overflow: "shrink-one-line",
            'min-font-size': 1
        });
        
        return qcode.each(target, table => {
            if ( ! (table instanceof HTMLTableElement) ) {
                return
            }
            target.classList.add('qc-column-resize');
            const id = qcode.getID(table);
            const cells = Array.from(table.rows[0].children);

            if ( options.overflow === 'hidden'
                 && qcode.getStyle(table, 'table-layout') === 'auto'
               ) {
                qcode.tableAuto2Fixed(table);
            }

            switch (options.overflow) {
            case 'shrink-one-line':
                qcode.style(`#${id} > * > tr > *`, 'white-space', 'nowrap');
            case 'shrink':
                for (const cell of cells) {
                    cell.dataset.originalFontSize = parseInt(
                        qcode.getStyle(cell,'font-size')
                    );
                }
                break;
            case 'hidden':
                qcode.style(`#${id} > * > tr > *`, 'overflow-x', 'hidden');
            }

            const thead = table.tHead;
            qcode.addDelegateEventListener(
                table, 'th', 'mousemove', (event, th) => {
                    if ( dragging ) {
                        return;
                    }
                    const rect = th.getBoundingClientRect();
                    if ( onLeftHandle(event, rect)
                         || onRightHandle(event, rect)
                       ) {
                        thead.style.setProperty('cursor', 'e-resize');
                    } else {
                        thead.style.setProperty('cursor', 'auto');
                    }
                }
            );
            qcode.addDelegateEventListener(
                table, 'th', 'mouseout', (event, th) => {
                    thead.style.setProperty('cursor', 'auto');
                }
            );
            const tableLeft = table.getBoundingClientRect().left;
            qcode.addDelegateEventListener(
                table, 'th', 'mousedown', (event, th) => {
                    event.preventDefault();
                    const rect = th.getBoundingClientRect();
                    let toResize;
                    if ( onLeftHandle(event, rect)
                         && closestHandle(event, rect) === 'left'
                       ) {
                        toResize = previousVisibleSibling(th);
                        if ( toResize === null ) {
                            return;
                        }
                    } else if ( onRightHandle(event, rect) ) {
                        toResize = th;
                    } else {
                        return;
                    }
                    dragging = true;

                    const handle = document.createElement('div');
                    handle.classList.add('column-resize-handle');
                    const initialLeft = event.pageX - tableLeft;
                    th.append(handle);
                    handle.style.setProperty('left', `${initialLeft}px`);
                }
            );
        });
    }

    function tableAuto2Fixed(table){
        "use strict";
        const id = qcode.getID(table);
        let css = {};
        css[`#${id}`] = {
            "table-layout": "fixed",
            "width": "0"
        };
        const cells = Array.from(table.rows[0].children);
        for (let index = 0; index < cells.length; index++) {
            css[`#${id} > colgroup > col:nth-child(${index+1})`] = {
                "width": qcode.getStyle(cells[index],'width')
            };
        }
        qcode.style(styles);
    }

    function onLeftHandle(event, rect) {
        return event.pageX < rect.left + handleWidth;
    }

    function onRightHandle(event, rect) {
        return event.pageX > rect.right - handleWidth;
    }

    function closestHandle(event, rect) {
        if ( event.pageX - rect.left < rect.right - event.pageX ) {
            return "left";
        } else {
            return "right";
        }
    }

    function previousVisibleSibling(element) {
        let sibling = element.previousElementSibling;
        while ( sibling !== null && sibling.offsetParent === null ) {
            sibling = sibling.previousElementSibling;
        }
        return sibling;
    }
})();
