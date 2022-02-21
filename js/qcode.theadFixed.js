/*
  qcode theadFixed plugin
  
  Makes the body + foot of a table scrollable,
  with a "fixed" copy of the thead.
*/
;var qcode = qcode || {};
qcode.theadFixed = (function() {
    "use strict";
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

            let windowWidth = window.innerWidth;
            window.addEventListener('resize', event => {
                if (
                    qcode.closestInArray(event.target,[table,clone]) !== null
                ) {
                    //repaint()
                } else if ( windowWidth != window.innerWidth ) {
                    //repaintStyles
                    if ( ! this.options.fixedWidth ) {
                        //repaintWidths
                    }
                    windowWidth = window.innerWidth
                }
            });

            event.copyEvents(table, clone, [
                'click',
                'mousedown',
                'mouseup',
                'mouseover',
                'mouseout',
                'mousemove',
                'contextmenu'            
            ]);
            
            // Where supported, use MutationObserver to listen for DOM changes
            const MutationObserver = (window.MutationObserver
                                      || window.WebKitMutationObserver
                                      || window.MozMutationObserver);
            if ( MutationObserver ) {
                const htmlObserver = new MutationObserver(() => {
                    //repaintWidths
                });
                htmlObserver.observe(
                    wrapper,
                    {
                        childList: true,
                        characterData: true,
                        subtree: true,
                        attributeFilter: ["class"]
                    }                
                );

                const styleObserver = new MutationObserver(mutations => {
                    const summary = mutationSummary(mutations);
                    let needsRepaint = false;
                    for (const change of summary) {
                        if ( change.attribute === "class" ) {
                            needsRepaint = true;
                        }
                        const targetClone = qcode.equivalentDescendant(
                            table,
                            change.element,
                            clone
                        );
                        if ( change.newValue == "" ) {
                            targetClone.removeAttribute(name);
                        } else {
                            targetClone.setAttribute(name, change.newValue);
                        }
                    }
                    if ( needsRepaint ) {
                        //repaintStyles
                    }
                });
                styleObserver.observe(
                    table.thead,
                    {
                        attributes: true,
                        attributeFilter: ['class', 'style', 'disabled'],
                        attributeOldValue: true,
                        subtree: true
                    }
                );
                this.styleObserver.observe(
                    table.querySelector('colgroup'),
                    {
                        attributes: true,
                        attributeFilter: ['class', 'style'],
                        attributeOldValue: true,
                        subtree: true
                    }
                );
            }
            //repaint
            
            wrapper.insertBefore(clone, scrollBox);

            //zoomfix
        });
    };
    function repaint(widget) {
        repaintStyles(widget);
        repaintWidths(widget);
    }
    const tableStylesToCopy = [
        'border-top-width', 'border-right-width', 'border-left-width',
        'border-top-style', 'border-right-style', 'border-left-style',
        'border-top-color', 'border-right-color', 'border-left-color',
        'border-collapse', 'border-spacing'
    ];
    function repaintStyles(widget) {
        const id = qcode.getID(widget.clone);
        const selector = `#${id}`;
        const styles = {};
        styles[selector] = {}

        const tableStyles = window.getComputedStyle(widget.table);
        const cloneTableStyles = window.getComputedStyle(widget.clone);
        for (const property of tableStylesToCopy) {
            const targetValue = tableStyles.getPropertyValue(property);
            const cloneValue = cloneTableStyles.getPropertyValue(property);
            if ( cloneValue !== targetValue ) {
                styles[selector][property] = targetValue;
            }
        }

        const cells = Array.from(widget.table.thead.rows[0].cells);
        for (const cell of cells) {
        }
    }
    function mutationSummary(mutations) {
        // Return a summary list of changes without intermediate changes.
        const summary = [];
        const done = [];
        for (const mutation of mutations) {
            const target = mutation.target;
            const name = mutation.attributeName;
            let oldValue = mutation.oldValue;
            if ( oldValue == null ) {
                oldValue = "";
            }
            let newValue = target.getAttribute(name);
            if ( newValue == null ) {
                newValue = "";
            }
            found = done.some(function(member) {
                if ( member.element == target && member.attribute == name ) {
                    return true;
                }
                return false;
            });
            if ( ! found ) {
                if ( newValue !== oldValue ) {
                    summary.push({
                        element: target,
                        attribute: name,
                        oldValue: oldValue,
                        newValue: newValue
                    });
                }
                done.push({
                    element: target,
                    attribute: name
                });
            }
        });
        return summary;
    }
})();
