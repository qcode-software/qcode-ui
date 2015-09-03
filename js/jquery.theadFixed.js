/*
theadFixed plugin

Makes the body + foot of a table scrollable, while a "fixed" copy of the thead.
*/
;(function($, undefined) {
    /* css to copy from original col elements */
    var copy_col_css = [
        'display'
    ];
    /* css to copy from original th elements */
    var copy_th_css = [
        'display', 'position', 'color', 'background-color',
        'font-family', 'font-weight', 'font-size', 'font-style', 'text-align', 'vertical-align',
        'white-space', 'overflow-x',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
        'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
        'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'
    ];
    /* css to copy from the original table */
    var copy_table_css = [
        'border-top-width', 'border-right-width', 'border-left-width',
        'border-top-style', 'border-right-style', 'border-left-style',
        'border-top-color', 'border-right-color', 'border-left-color',
        'border-collapse', 'border-spacing'
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
            'fixedWidth': false,
            'initialScroll': "start"
	},
	_create: function() {
            this.table = this.element;
            this.theadCells = this.table.children('thead').children('tr').first().children('th');
            this.columns = this.table.children('colgroup').children('col');

            // Create the new thead as a separate table
            this.headClone = $('<table>')
                .append(this.table.children('colgroup').clone())
                .append(this.table.children('thead').clone())
                .addClass('thead-fixed-clone');
            this.headClone.children('tbody, tfoot').remove();
            var id = this.headClone.getID();
            qcode.style('#'+id, 'table-layout', "fixed");

            // Generate and store column selectors
            var colSelectors = {};
            var thSelectors = {};
            this.theadCells.each(function(i, th) {
                colSelectors[i] = '#'+id+'>colgroup>col:nth-child('+(i+1)+')';
                thSelectors[i] = '#'+id+'>thead>tr>th:nth-child('+(i+1)+')';
            });
            this.colSelectors = colSelectors;
            this.thSelectors = thSelectors;

            // Create the wrappers
            this.table.wrap('<div class="scroll-box">');
            this.scrollBox = this.table.parent().wrap('<div class="thead-fixed-wrapper">');
            this.wrapper = this.scrollBox.parent().css({height: this.options.height});

            // Set the initial scroll position (wait for all other plugins to load)
            if ( this.options.initialScroll === "end" ) {
                var scrollBox = this.scrollBox;
                $('body').one('pluginsReady', function() {
                    var scrollTop = scrollBox[0].scrollHeight - scrollBox.height();
                    scrollBox.scrollTop(scrollTop);
                });
            }

            // Add the resize event listeners - only repaint when the table is resized
            // or the window width changes.
            var windowWidth = window.innerWidth;
            var widget = this;
            // On window resize, or when a resize bubbles to the window.
            this._on($(window), {
                'resize': function(event) {
                    if ( $(event.target).closest(this.element.add(this.headClone)).length > 0 ) {
                        this.repaint();

                    } else if ( windowWidth != window.innerWidth ) {
                        this.repaintStyles();
                        if ( ! this.options.fixedWidth ) {
                            this.repaintWidths();
                            windowWidth = window.innerWidth;
                        }
                    }
                }
            });

            // Copy click events back to the matching element in the original thead
            var handlers = {};
            var copy = function copyEvent(event) {
                var target = $(event.target);
                var eventProperties = {};
                $.each(['pageX', 'pageY', 'which', 'data', 'metaKey', 'namespace', 'timeStamp'], function(i, property) {
                    eventProperties[property] = event[property];
                });
                $.each(['relatedTarget'], function(i, property) {
                    if ( $(event[property]).closest(this.table).length > 0 ) {
                        eventProperties[property] = treeMap(event[property], this.headClone, this.table);
                    } else {
                        eventProperties[property] = event[property];
                    }
                });
                var originalElement = treeMap(target, this.headClone, this.table);
                var eventCopy = jQuery.Event(event.type, eventProperties);
                originalElement.trigger(eventCopy);
            };
            jQuery.each(['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove'], function(i, eventName) {
                handlers[eventName] = copy;
            });
            this._on(this.headClone, handlers);


            // Where supported, MutationObserver allows us to listen for changes to the DOM
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            if ( MutationObserver ) {
                // When the contents or structure of the table change, repaint the widths.
                this.htmlObserver = new MutationObserver(this.repaintWidths.bind(this));
                this.htmlObserver.observe(
                    this.wrapper[0],
                    {
                        childList: true,
                        characterData: true,
                        subtree: true
                    }
                );

                // When the class or style of any element in the original thead or colgroup change,
                // or when an element in the original thead becomes disabled,
                // replicate this change to the thead copy.
                // If one or more classes changed, repaint the styles.
                this.styleObserver = new MutationObserver(function(mutations) {
                    var summary = mutationSummary(mutations);
                    var needsRepaint = false;
                    summary.forEach(function(change) {
                        var target = $(change.element);
                        var name = change.attribute;
                        if ( name === "class" ) {
                            needsRepaint = true;
                        }
                        if ( attrEqual(change.newValue, "") ) {
                            treeMap(target, widget.table, widget.headClone).removeAttr(name);
                        }  else {
                            treeMap(target, widget.table, widget.headClone).attr(name, change.newValue);
                        }
                    });
                    if ( needsRepaint ) {
                        widget.repaintStyles();
                    }
                });
                this.styleObserver.observe(
                    this.table.children('thead')[0],
                    {
                        attributes: true,
                        attributeFilter: ['class', 'style', 'disabled'],
                        attributeOldValue: true,
                        subtree: true
                    }
                );
                this.styleObserver.observe(
                    this.table.children('colgroup')[0],
                    {
                        attributes: true,
                        attributeFilter: ['class', 'style'],
                        attributeOldValue: true,
                        subtree: true
                    }
                );
            }
            
            // Call repaint once to set the widths and styles
            this.repaint();

            // Add the head to the page last, after widths and styles have been calculated
            // (this avoids a google chrome bug)
            this.wrapper.prepend(this.headClone);

            this.zoomFix();
            // end of _create;
	},
	repaint: function() {
            this.repaintStyles();
            this.repaintWidths();
        },
        zoomFix: function() {
            var cloneRow = this.headClone.children('thead').children('tr').first();
            var originalRow = this.table.children('thead').children('tr').first();
            var thSelectors = this.thSelectors;
            for ( var multiplier = 0.99 ; multiplier > 0 ; multiplier -= 0.01 ) {
                if ( cloneRow.height() <= originalRow.height() ) {
                    break
                }
                styles = {};
                this.theadCells.each(function(i, originalTH) {
                    styles[thSelectors[i]] = {
                        'font-size':
                        (
                            parseFloat( $(originalTH).css('font-size') ) * multiplier
                        ) + "px"
                    };
                });
                qcode.style(styles);
            }
        },
        repaintWidths: function() {
            // Measure and apply table and column widths
            var widget = this;
            var id = this.headClone.getID();
            var colSelectors = this.colSelectors;
            var thSelectors = this.thSelectors;

            var styles = {};
            styles['#' + id] = {
                'display': this.table.css('display'),
                'width': this.table.outerWidth() + "px"
            }

            this.theadCells.each(function(i, th) {
                var col = widget.columns.eq(i);
                var display = col.css('display');
                styles[colSelectors[i]] = {
                    'display': display
                }
                if ( display !== 'none' ) {
                    var width = $(th).outerWidth() + "px";
                    styles[colSelectors[i]]['width'] = width;
                }
                styles[thSelectors[i]] = {
                    'display': $(th).css('display')
                }
            });
            qcode.style(styles);
        },
        repaintStyles: function() {
            // Copy styles from the original table to the copied table,
            // and from the original th elements to the copied ones.
            var id = this.headClone.getID();
            var widget = this;
            var styles = {};
            selector = '#' + id;
            styles[selector] = {};

            $.each(copy_table_css, function(i, name) {
                var originalValue = widget.table.css(name);
                var cloneValue = widget.headClone.css(name);
                if ( cloneValue !== originalValue ) {
                    styles[selector][name] = originalValue;
                }
            });

            this.theadCells.each(function(i, th) {
                var thSelector = widget.thSelectors[i];
                styles[thSelector] = {};
                if ( $(th).css('display') === "table-cell" ) {
                    $.each(copy_th_css, function(j, name) {
                        var copy_th = widget.headClone.find('th:nth-child('+(i+1)+')');
                        if ( copy_th.css(name) !== $(th).css(name) ) {
                            styles[thSelector][name] = $(th).css(name);
                        }
                    });
                } else {
                    styles[thSelector].display = "none";
                }
            });

            this.columns.each(function(i, col) {
                var colSelector = widget.colSelectors[i];
                styles[colSelector] = {};
                $.each(copy_col_css, function(j, name) {
                    var copy_col = widget.headClone.find('col:nth-child('+(i+1)+')');
                    if ( ! attrEqual(copy_col.css(name), $(col).css(name)) ) {
                        styles[colSelector][name] = $(col).css(name);
                    }
                });
            });

            qcode.style(styles);
        },
        getWrapper: function() {
            return this.wrapper;
        }
    });
    function attrEqual(a, b) {
        // Compare two strings, treating null and undefined as ""
        // Returns true if the strings are equal
        if ( a === undefined || a === null ) {
            var a = "";
        }
        if ( b === undefined || b === null ) {
            var b = "";
        }
        return a === b;
    }
    function mutationSummary(mutations) {
        // Return a summary list of changes without intermediate changes.
        var summary = [];
        var done = [];
        mutations.forEach(function(mutation) {
            var target = mutation.target;
            var name = mutation.attributeName;
            var oldValue = mutation.oldValue;
            var newValue = $(target).attr(name);
            var found = done.some(function(member) {
                if ( member.element == target && member.attribute == name ) {
                    return true;
                }
                return false;
            });
            if ( !found ) {
                if ( !attrEqual(newValue, oldValue) ) {
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
})(jQuery);