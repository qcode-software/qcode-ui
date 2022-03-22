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
        options = Object.assign({
            overflow: "shrink-one-line",
            'min-font-size': 1
        }, options);
        
        return qcode.each(target, table => {
            if ( ! (table instanceof HTMLTableElement) ) {
                return
            }
            table.classList.add('qc-column-resize');
            
            const id = qcode.getID(table);
            const cells = Array.from(table.rows[0].children);

            if ( options.overflow === 'hidden'
                 && qcode.getStyle(table, 'table-layout') === 'auto'
               ) {
                tableAuto2Fixed(table);
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
            qcode.addDelegatedEventListener(
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
            qcode.addDelegatedEventListener(
                table, 'th', 'mouseout', (event, th) => {
                    thead.style.setProperty('cursor', 'auto');
                }
            );
            const tableLeft = table.getBoundingClientRect().left;
            qcode.addDelegatedEventListener(
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

                    let width = toResize.getBoundingClientRect().width;
                    const initialWidth = width;

                    const dragListener = function(event) {
                        event.preventDefault();
                        const left = (
                            event.pageX - tableLeft
                        );
                        width = initialWidth + left - initialLeft;
                        if ( width < minWidth ) {
                            width = minWidth;
                        }
                        handle.style.setProperty('left',`${left}px`);
                    }

                    qcode.on(window,'mousemove',dragListener);
                    qcode.on(window,'mouseup',event => {
                        qcode.off(window, 'mousemove');
                        dragging = false;
                        handle.remove();
                        resize(toResize,width,options);
                    }, {once: true});
                }
            );
        });
    }

    function resize(th,width,options) {
        const index = qcode.index(th)
        const nth = index + 1;
        const table = qcode.closest(th,'table');
        const id = qcode.getID(table);
        const colSelector = `#${id} > colgroup > col:nth-child(${nth})`;
        const cellSelector = `#${id} > * > tr > :nth-child(${nth})`;
        qcode.style(colSelector, 'width', `${width}px`);

        switch ( options.overflow ) {
        case 'break-word':
            if ( th.getBoundingClientRect().width > width ) {
                qcode.style(cellSelector, 'word-break', "break-all");
            } else {
                qcode.style(cellSelector, 'word-break', "normal");
            }
            break;
        case 'shrink-one-line':
        case 'shrink':
            let fontSize = th.dataset.originalFontSize;
            qcode.style(cellSelector, 'font-size', `${fontSize}px`);
            let measuredWidth = th.getBoundingClientRect().width;
            let lastChangeFontSize = fontSize;
            while ( measuredWidth > width ) {
                fontSize--;
                if ( fontSize < options['min-font-size'] ) {
                    break;
                }
                qcode.style(cellSelector, 'font-size', `${fontSize}px`);
                if ( th.getBoundingClientRect().width < measuredWidth ) {
                    lastChangeFontSize = fontSize;
                }
                measuredWidth = th.getBoundingClientRect().width;
            }
            qcode.style(cellSelector, 'font-size', `${lastChangeFontSize}px`);
        }
        
        table.dispatchEvent(
            new Event('resize', {
                bubbles: true,
                cancelable: true,
                composed: true
            })
        );
    }

    function tableAuto2Fixed(table){
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
        qcode.style(css);
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
