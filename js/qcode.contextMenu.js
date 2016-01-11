var qcode = qcode || {};

(function() {
    "use strict";
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
    var methods = {
        create: function(options) {
            if ( typeof menuDiv !== "undefined" ) {
                methods.destroy();
            }
            $.extend(config, options);
            menuDiv = $('<div>')
                    .addClass(config.classes.div);
            menuUL = $('<ul>')
                    .addClass(config.classes.ul)
                    .appendTo(menuDiv);
            config.menuItems.forEach(methods.itemAdd);
            methods.positionSet();
            methods.open();
            menuDiv.navigate('li');
            $('body')
                    .on('click.context-menu focusin.context-menu',
                        function(event) {
                            if ( ! menuDiv.is(event.target)
                                 && menuDiv.find(event.target).length == 0
                               ) {
                                methods.close();
                                methods.destroy();
                            }
                        })
                    .append(menuDiv);
            $(document).on('scroll.context-menu', function() {
                methods.close();
                methods.destroy();
            });
            menuLIs[0].focus();
        },
        itemAdd: function(itemConfig) {
            menuLIs.push(
                $('<li>')
                        .attr('tabIndex', 0)
                        .addClass(config.classes.li)
                        .html(itemConfig.label)
                        .on('click.context-menu', itemConfig.action)
                        .on('click.context-menu', methods.close)
                        .on('mouseenter', function() {
                            $(this).focus();
                        })
                        .appendTo(menuUL)
            );
        },
        positionSet: function() {
            menuDiv.css({
                top: config.position[1],
                left: config.position[0]
            });
        },
        destroy: function() {
            if ( typeof menuDiv !== "undefined" ) {
                menuDiv.remove();
                menuDiv = undefined;
                menuUL = undefined;
                menuLIs = [];
                $('body').off('.context-menu');
                $(document).off('.context-menu');
            }
        },
        open: function() {
            menuDiv.addClass(config.classes.open);
        },
        close: function() {
            if ( typeof menuDiv !== "undefined" ) {
                menuDiv.removeClass(config.classes.open);
            }
        }
    }
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