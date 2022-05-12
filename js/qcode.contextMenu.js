/* ======================================================================
   qcode.contextMenu plugin:
   Create and open a custom context menu
   Only one context menu can be open at a time

   Usages:
   qcode.contextMenu(options) // same as "create"
   qcode.contextMenu('create', options) // menu opens automatically
   qcode.contextMenu('open' or 'close' or 'destroy')

   Arguments:
   options: {
       position: [x,y],
       menuItems: [
           {
               label: htmlString,
               action: function
           }
           ...
       ],
       classes: { // optional class overrides
           div: 'context-menu',
           open: 'context-menu--open',
           ul: 'context-menu__list',
           li: 'context-menu__item'
       }
   }
*/

var qcode = qcode || {};

(function() {
    "use strict";

    /* ------------------------------------------------------------
       Closure vars to track DOM elements and config
    */
    var menuDiv, menuUL;
    var menuLIs = [];
    var config = {
        classes: {
            div: 'context-menu',
            open: 'context-menu--open',
            ul: 'context-menu__list',
            li: 'context-menu__item'
        }
    };

    /* ------------------------------------------------------------
       Public methods to expose through interface function
    */
    var methods = {

        create: function(options) {
            /* Create the context menu, set up event listeners, then open. */

            // Extend config object with user-defined options
            $.extend(config, options);

            // Opening a new menu destroys any existing menu
            if ( typeof menuDiv !== "undefined" ) {
                methods.destroy();
            }

            // Create menu div
            menuDiv = $('<div>')
                    .addClass(config.classes.div);

            // Create menu ul and append to menu div
            menuUL = $('<ul>')
                    .addClass(config.classes.ul)
                    .appendTo(menuDiv);

            // Add menu items to menu ul
            config.menuItems.forEach(itemAdd);

            // Update the menu position
            positionSet();

            // Set up arrow-key navigation
            qcode.navigate(menuDiv[0],'li');

            // Append the menu div to the page body
            $('body').append(menuDiv);


            // Event listeners to close the menu on blur
            menuDiv.on('focusout.context-menu', function() {
                window.setZeroTimeout(function() {
                    if ( menuDiv.find(document.activeElement).length === 0 ) {
                        methods.close();
                        methods.destroy();
                    }
                });
            });
            $(window).on('blur.context-menu', function() {
                methods.close();
                methods.destroy();
            });

            // Event listener to close the menu on page scroll
            $(document).on('scroll.context-menu', function() {
                methods.close();
                methods.destroy();
            });

            // Open the menu
            methods.open();

            // Give the first menu item focus by default
            menuLIs[0].focus();
        },

        destroy: function() {
            /* Destroy the context menu div and remove all event listeners */
            // (Do nothing if no context menu exists)
            if ( typeof menuDiv !== "undefined" ) {
                menuDiv.remove();
                menuDiv = undefined;
                menuUL = undefined;
                menuLIs = [];
                $(window).off('.context-menu');
                $('body').off('.context-menu');
                $(document).off('.context-menu');
            }
        },

        open: function() {
            /* Open the context menu */
            menuDiv.addClass(config.classes.open);
        },

        close: function() {
            /* Close the context menu */
            // (Do nothing if no context menu exists)
            if ( typeof menuDiv !== "undefined" ) {
                menuDiv.removeClass(config.classes.open);
            }
        }
    }

    /* ------------------------------------------------------------
       Internal functions
    */
    function itemAdd(itemConfig) {
        /* Add a menu item using itemConfig object */
        menuLIs.push(
            $('<li>')
                    .attr('tabIndex', 0)
                    .addClass(config.classes.li)
                    .html(itemConfig.label)
                    .on('click.context-menu', itemConfig.action)
                    .on('click.context-menu', methods.close)
                    .on('mouseenter.context-menu', function() {
                        $(this).focus();
                    })
                    .appendTo(menuUL)
        );
    }
    function positionSet() {
        /* Update the menu position from the config object */
        menuDiv.css({
            top: config.position[1],
            left: config.position[0]
        });
    }

    /* ------------------------------------------------------------
       Interface function
    */
    qcode.contextMenu = function() {
        if ( typeof arguments[0] === "string" ) {
            var method = arguments[0];
            var remainingArgs = Array.prototype.slice.call(arguments,1);
            return methods[method].apply(this, remainingArgs);
        } else {
            return methods.create.apply(this, arguments);
        }
    }
})();
