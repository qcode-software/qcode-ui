/*
  qcode theadFixed plugin
  
  Makes the body + foot of a table scrollable,
  with a "fixed" copy of the thead.
*/
;var qcode = qcode || {};
qcode.theadFixed = (function() {
    "use strict";
    const tableStylesToCopy = [
        'border-top-width', 'border-right-width', 'border-left-width',
        'border-top-style', 'border-right-style', 'border-left-style',
        'border-top-color', 'border-right-color', 'border-left-color',
        'border-collapse', 'border-spacing'
    ];
    const thStylesToCopy = [
        'display', 'position', 'color', 'background-color',
        'font-family', 'font-weight', 'font-size', 'font-style',
        'text-align', 'vertical-align', 'white-space', 'overflow-x',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'border-top-width', 'border-top-style', 'border-top-color',
        'border-right-width', 'border-right-style', 'border-right-color',
        'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
        'border-left-width', 'border-left-style', 'border-left-color'
    ];
    
    return function(target, options) {
        options = Object.assign({
            'height': "500px",
            'fixedWidth': false,
            'initialScroll': "start"
        }, options);
        return qcode.each(target, table => {
            if ( ! (table instanceof HTMLTableElement) ) {
                return
            }
            const clone = document.createElement('table');
            const colgroup = table.querySelector('colgroup');
            if ( ! (colgroup instanceof HTMLElement) ) {
                throw "Could not find colgroup element"
            }
            clone.append(colgroup.cloneNode(true));
            clone.append(table.tHead.cloneNode(true));
            clone.classList.add('thead-fixed-clone');

            const id = qcode.getID(clone);
            qcode.style(`#${id}`, 'table-layout', 'fixed');

            for (const input of Array.from(
                table.tHead.querySelectorAll('input, textarea, select, button')
            )) {
                input.removeAttribute('name');
            }

            const wrapper = document.createElement('div');
            wrapper.classList.add('thead-fixed-wrapper');
            const scrollBox = document.createElement('div');
            scrollBox.classList.add('scroll-box');
            wrapper.append(scrollBox);
            wrapper.style.setProperty('height',options.height);

            table.parentElement.insertBefore(wrapper, table);
            scrollBox.append(table);

            if ( options.initialScroll === "end" ) {
                document.body.addEventListener('pluginsReady', event => {
                    scrollBox.scrollTop = (
                        scrollBox.scrollHeight - scrollBox.clientHeight
                    );
                }, {once: true});
            }

            const widget = {
                table: table,
                colgroup: colgroup,
                clone: clone
            };

            let windowWidth = window.innerWidth;
            window.addEventListener('resize', event => {
                const isTableResize = qcode.closestInArray(
                    event.target,[table,clone]) !== null;
                
                if ( isTableResize ) {
                    repaint(widget)
                } else if ( windowWidth != window.innerWidth ) {
                    repaintStyles(widget)
                    if ( ! this.options.fixedWidth ) {
                        repaintWidths(widget)
                    }
                    windowWidth = window.innerWidth
                }
            });

            qcode.copyEvents(table, clone, [
                'click',
                'mousedown',
                'mouseup',
                'mouseover',
                'mouseout',
                'mousemove',
                'contextmenu'            
            ]);

            qcode.onClassChange(wrapper,() => repaintWidths(widget));

            qcode.mirrorAttributes(
                table.tHead,
                clone.tHead,
                ['class', 'style', 'disabled']
            );

            qcode.mirrorAttributes(
                colgroup,
                clone.querySelector('colgroup'),
                ['class', 'style']
            );
            
            table.addEventListener('attributeChange', event => {
                if ( event.detail.changes.some(
                    change => change.attribute == 'class'
                )) {
                    repaintStyles(widget);
                }
            });
            
            repaint(widget);
            
            wrapper.insertBefore(clone, scrollBox);

            zoomFix(id, table.tHead.rows[0], clone.tHead.rows[0]);
        });
    };
    function repaint(widget) {
        repaintStyles(widget);
        repaintWidths(widget);
    };
    function repaintStyles(widget) {
        const id = qcode.getID(widget.clone);
        const selector = `#${id}`;
        const styles = {};
        styles[selector] = {};
        
        for (const property of tableStylesToCopy) {
            const targetValue = qcode.getStyle(widget.table, property);
            const cloneValue = qcode.getStyle(widget.clone, property);
            if ( cloneValue !== targetValue ) {
                styles[selector][property] = targetValue;
            }
        }

        const cells = Array.from(widget.table.tHead.rows[0].cells);
        for (let i = 0; i < cells.length; i++) {
            const selector = `#${id}>thead>tr>th:nth-child(${i+1})`;
            styles[selector] = {};
            if ( qcode.getStyle(cells[i],'display') == 'table-cell' ) {
                for (const property of thStylesToCopy) {
                    styles[selector][property] = (
                        qcode.getStyle(cells[i],property)
                    );
                }
            } else {
                styles[selector]['display'] = 'none';
            }
        }

        const columns = Array.from(widget.colgroup.children);
        const cloneColumns = Array.from(
            widget.clone.querySelector('colgroup').children);
        for (let i = 0; i < columns.length; i++) {
            const selector = `#${id}>colgroup>col:nth-child(${i+1})`;
            styles[selector] = {}
            const value = qcode.getStyle(columns[i],'display');
            if ( value != qcode.getStyle(cloneColumns[i],'display') ) {
                styles[selector]['display'] = value;
            }
        }

        qcode.style(styles);
    };
    function repaintWidths(widget) {
        const id = qcode.getID(widget.clone);

        const styles = {}
        styles[`#${id}`] = {
            'display': qcode.getStyle(widget.table,'display'),
            'width': widget.table.offsetWidth
        }

        const cells = Array.from(widget.table.tHead.rows[0].cells);
        const columns = Array.from(widget.colgroup.children);
        for (let i = 0; i < cells.length; i++) {
            const selector = `#${id}>colgroup>col:nth-child(${i+1})`;
            const display = qcode.getStyle(columns[i],'display')
            styles[selector] = {
                'display': display
            };
            if ( display !== 'none' ) {
                var width = cells[i].getBoundingClientRect().width + "px";
                styles[selector]['width'] = width;
            }
            styles[`#${id}>thead>tr>th:nth-child(${i+1})`] = {
                'display': qcode.getStyle(cells[i],'display')
            };
        }
        qcode.style(styles);
    };
    function zoomFix(id, originalRow, cloneRow) {
        let styles;
        for (let multiplier = 0.99; multiplier > 0; multiplier -= 0.01) {
            if ( cloneRow.offsetHeight <= originalRow.offsetHeight ) {
                break
            }
            styles = {};
            const cells = Array.from(originalRow.cells);
            for (let i = 0; i < cells.size; i++) {
                const fontSize = parseFloat(
                    qcode.getStyle(cells[i], 'font-size'));
                styles[`#${id}>thead>tr>th:nth-child(${i+1})`] = {
                    'font-size': `${fontSize * multiplier}px`
                };
            };
        };
        qcode.style(styles);
    }
})();
