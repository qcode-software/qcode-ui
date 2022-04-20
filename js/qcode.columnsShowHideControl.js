// Initialise column show/hide control
;var qcode = qcode || {};
qcode.columnsShowHideControl = function(targets) {
    "use strict";
    return qcode.each(targets, target => {
        const checkbox = target.querySelector('[type=checkbox]');
        const tableSelector = getData(checkbox, 'table_selector');
        const colSelector = getData(checkbox, 'col_selector');
        const tables = document.querySelectorAll(tableSelector);
        const sticky = parseBoolean(getData(checkbox,'sticky'));
        const stickyUrl = getData(checkbox,'sticky_url');
        
        
        target.addEventListener('click', onClick);
        checkbox.addEventListener('change', onCheckBoxChange);
        target.addEventListener('mouseenter', onMouseEnter);
        target.addEventListener('mouseleave', onMouseLeave);
        update();


        function update() {
            if ( checkbox.checked ) {
                target.classList.add('checked');
                qcode.columnsShowHide(tables, colSelector, 'show');
            } else {
                target.classList.remove('checked');
                qcode.columnsShowHide(tables, colSelector, 'hide');
            }
        }

        function onClick(event) {
            if ( event.target == checkbox || event.target.matches('label') ) {
                return
            }
            event.preventDefault();
            checkbox.checked = ! checkbox.checked;
            checkbox.dispatchEvent(
                new Event('change', {
                    "bubbles": true,
                    "composed": true
                })
            );
        }

        function onCheckBoxChange(event) {
            update()
            if ( ! sticky ) {
                return
            }
            const data = {}
            data[checkbox.getAttribute('name')] = checkbox.checked;
            if ( stickyUrl ) {
                data['sticky_url'] = stickyUrl;
            }
            httpPost('/sticky_save.html',
                     data,
                     function(){},
                     function(){});
        }

        function onMouseEnter(event) {
            target.classList.add('hover');
            for ( const table of tables ) {
                const cols = Array.from(table.querySelectorAll(colSelector));
                for ( const col of cols ) {
                    col.classList.add('highlight');
                }
            }
        }

        function onMouseLeave(event) {
            target.classList.remove('hover');
            for ( const table of tables ) {
                const cols = Array.from(table.querySelectorAll(colSelector));
                for ( const col of cols ) {
                    col.classList.remove('highlight');
                }
            }
        }
    });

    function getData(element, key) {
        if ( element.hasAttribute(key) ) {
            return element.getAttribute(key);
        }
        key = qcode.underscore2camelCase(key);
        if ( element.dataset[key] !== undefined ) {
            return element.dataset[key];
        }
        return ""
    }
};
