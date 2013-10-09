/*
theadFixed plugin

Makes the body + foot of a table scrollable, while a "fixed" copy of the thead.
*/
;(function($, undefined) {
    /* css to copy from original th elements */
    var copy_th_css = [
        'display', 'color', 'background-color',
        'font-family', 'font-weight', 'font-size', 'font-style', 'text-align', 'vertical-align',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
        'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
        'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'
    ];
    /* css to copy from the original table */
    var copy_table_css = [
        'border-spacing', 'border-collapse',
        'border-top-width', 'border-right-width', 'border-left-width',
        'border-top-style', 'border-right-style', 'border-left-style',
        'border-top-color', 'border-right-color', 'border-left-color'
    ];

    // Find the element whose DOM location relative to otherRoot is the same as element's postion relative to root.
    // eg. If element is the 3rd child of the 5th child of root, find the 3rd child of the 5th child of otherRoot
    function treeMap(element, root, otherRoot) {
        if ( element.length == 0 ) {
            return $();
        } else if ( element.is(root) ) {
            return otherRoot;
        } else {
            var mappedParent = treeMap(element.parent(), root, otherRoot);
            return mappedParent.children().eq(element.index());
        }
    }

    $.widget('qcode.theadFixed', {
	options: {
	    'height': "500px",
            'fixedWidth': false
	},
	_create: function() {
            this.table = this.element;
            this.theadCells = this.table.children('thead').children('tr').first().children('th');

            // Create the new thead as a separate table
            this.head = $('<table>')
                .append(this.table.children('colgroup').clone())
                .append(this.table.children('thead').clone())
                .addClass('thead-fixed-clone');
            this.head.children('tbody, tfoot').remove();
            var id = this.head.getID();
            qcode.style('#'+id, 'table-layout', "fixed");


            // Generate and store column selectors
            var colSelectors = {};
            this.theadCells.each(function(i, th) {
                colSelectors[i] = '#'+id+' col:nth-child('+(i+1)+')';
            });
            this.colSelectors = colSelectors;


            // Create the wrappers
            this.table.wrap('<div class="scroll-box">');
            this.scrollBox = this.table.parent().wrap('<div class="thead-fixed-wrapper">');
            this.wrapper = this.scrollBox.parent().css({height: this.options.height});
            this.wrapper.prepend(this.head);


            // Add the resize event listeners - only repaint when the table is resized
            // or the window width changes.
            var windowWidth = $(window).width();
            var widget = this;
            // On window resize, or when a resize bubbles to the window.
            this._on($(window), {
                'resize': function(event) {
                    if ( $(event.target).closest(this.element.add(this.clone)).length > 0 ) {
                        this.repaintWidths();

                    } else if (( ! this.options.fixedWidth )
                               && windowWidth != $(window).width() ) {
                        this.repaintWidths();
                        windowWidth = $(window).width();
                    }
                }
            });

            
            // Copy click events back to the matching element in the original thead
            var handlers = {};
            var copy = function(event) {
                var target = $(event.target);
                var eventCopy = jQuery.Event(event.type);
                $.each(['pageX', 'pageY', 'which', 'data', 'metaKey', 'namespace', 'timeStamp'], function(i, property) {
                    eventCopy[property] = event[property];
                });
                $.each(['target', 'relatedTarget'], function(i, property) {
                    if ( $(event[property]).closest(this.table).length > 0 ) {
                        eventCopy[property] = treeMap(event[property], this.head, this.table);
                    } else {
                        eventCopy[property] = event[property];
                    }
                });
                treeMap(target, this.head, this.table).trigger(eventCopy);
                return event.result;
            };
            jQuery.each(['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'], function(i, eventName) {
                handlers[eventName] = copy;
            });
            this._on(this.head, handlers);


            /* Where supported, MutationObserver allows us to listen for changes to the DOM */
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            if ( MutationObserver ) {
                // When the contents or structure of the table change, repaint.
                this.observer = new MutationObserver(this.repaintWidths.bind(this));
                this.observer.observe(
                    this.wrapper[0],
                    {
                        childList: true,
                        characterData: true,
                        subtree: true
                    }
                );

                // When the class or style of any element in the original thead change,
                // replicate this change to the thead copy.
                this.headObserver = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        var target = $(mutation.target);
                        var attribute = mutation.attributeName;
                        if ( target.attr(attribute) === undefined ) {
                            treeMap(target, widget.table, widget.head)
                                .removeAttr(attribute);
                        } else {
                            treeMap(target, widget.table, widget.head)
                                .attr(attribute, target.attr(attribute));
                        }
                    });
                    widget.repaintStyles();
                });
                this.headObserver.observe(
                    this.table.children('thead')[0],
                    {
                        attributes: true,
                        attributeFilter: ['class', 'style', 'disabled'],
                        subtree: true
                    }
                );
            }
            
            // Call repaint once to set the widths and styles
            this.repaint();
            // end of _create;
	},
	repaint: function() {
            this.repaintStyles();
            this.repaintWidths();
        },
        repaintWidths: function() {
            // Measure and apply table and column widths
            var id = this.head.getID();
            var colSelectors = this.colSelectors;

            var styles = {};
            styles['#' + id] = {
                'width': this.table.outerWidth() + "px"
            }
            this.theadCells.each(function(i, th) {
                styles[colSelectors[i]] = {
                    'width': $(th).outerWidth() + "px"
                };
            });
            qcode.style(styles);
        },
        repaintStyles: function() {
            // Copy styles from the original table to the copied table,
            // and from the original th elements to the copied ones.
            var id = this.head.getID();
            var widget = this;
            var styles = {};
            selector = '#' + id;
            styles[selector] = {};
            $.each(copy_table_css, function(i, name) {
                if ( widget.head.css(name) !== widget.table.css(name) ) {
                    styles[selector][name] = widget.table.css(name);
                }
            });
            this.theadCells.each(function(i, th) {
                var thSelector = '#'+id+'>thead>tr>th:nth-child('+(i+1)+')';
                styles[thSelector] = {};
                $.each(copy_th_css, function(j, name) {
                    var copy_th = widget.head.find('th:nth-child('+(i+1)+')');
                    if ( copy_th.css(name) !== $(th).css(name) ) {
                        styles[thSelector][name] = $(th).css(name);
                    }
                });
            });
            qcode.style(styles);
        },
        getWrapper: function() {
            return this.wrapper;
        }
    });
})(jQuery);