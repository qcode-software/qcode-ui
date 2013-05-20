;(function($, undefined) {
    $.widget('qcode.navTree', {
        _create: function() {
            this.element.find('ul').parent('li').navTreeBranch({
                root: this.element
            });
            this._on({
                'click .expand': function(event) {
                    this.setAnchor();
                    $(event.target).data('target').navTreeBranch('expand');
                },
                'click .collapse': function(event) {
                    this.setAnchor();
                    $(event.target).data('target').navTreeBranch('collapse');
                },
                'click .heading': function(event) {
                    this.setAnchor();
                    var list = $(event.target).data('target');
                    if ( list.navTreeBranch('isCollapsed') ) {
                        list.navTreeBranch('expand');
                    } else {
                        list.navTreeBranch('collapse');
                    }
                }
            });
        },
        scrollUpdater: function() {
            var navTree = this;
            return function() {
                navTree.element.scrollTop(navTree.getAnchor().positionRelativeTo(navTree.element).top - navTree.anchorOffset);
            }
        },
        setAnchor: function(anchor) {
            var navTree = this;
            if (anchor === undefined) {
                var rows = this.element.find('a, span').not('.expand, .collapse').filter(':visible');
                this.anchor = rows.last();
                rows.each(function(i, row) {
                    if ( $(row).positionRelativeTo(navTree.element).top + $(row).outerHeight() > navTree.element.scrollTop() ) {
                        this.anchor = $(row);
                        return false;
                    }
                });
            } else {
                this.anchor = $(anchor);
            }
            this.anchorOffset = this.anchor.positionRelativeTo(this.element).top - navTree.element.scrollTop();
        },
        getAnchor: function() {
            if (this.anchor === undefined) {
                this.setAnchor();
            }
            return this.anchor;
        }
    });

    $.widget('qcode.navTreeBranch', {
        _create: function() {
            this.collapsed = true;
            this.element.addClass('collapsed');
            this.expander = $('<span class="expand">')
                .text('+')
                .data('target', this.element)
                .prependTo(this.element);
            this.collapser = $('<span class="collapse">')
                .text('-')
                .data('target', this.element)
                .prependTo(this.element)
                .hide();
            if ( this.element.hasClass('current') ) {
                this.options.root.navTree('setAnchor');
                this.expand(false);
            }
        },
        expand: function(async) {
            var async = coalesce(async, true);
            if ( this.isCollapsed() ) {
                if ( ! this.element.closest('ul').is(this.options.root)) {
                    this.element.parent().closest('li').navTreeBranch('expand', async);
                }
                var animationOptions = {
                    step: this.options.root.navTree('scrollUpdater')
                };
                if ( ! async ) {
                    animationOptions.duration = 0;
                }
                this.element.children('ul').slideDown(animationOptions);
                this.expander.hide();
                this.collapser.show();
                this.collapsed = false;
                this.element.removeClass('collapsed');
                this.element.trigger('expand');
            }
        },
        collapse: function(async) {
            var async = coalesce(async, true);
            if ( ! this.isCollapsed() ) {
                this.element.children('ul').children('li').children('ul').parent('li').navTreeBranch('collapse', async);
                var anchor = this.options.root.navTree('getAnchor');
                if ( this.element.find(anchor).length != 0 ) {
                    if ( this.element.next().length != 0 ) {
                        this.options.root.navTree('setAnchor', this.element.next());
                    } else {
                        this.options.root.navTree('setAnchor', this.element);
                    }
                }
                var animationOptions = {
                    step: this.options.root.navTree('scrollUpdater')
                };
                if ( ! async ) {
                    animationOptions.duration = 0;
                }
                this.element.children('ul').slideUp(animationOptions);
                this.collapser.hide();
                this.expander.show();
                this.collapsed = true;
                this.element.addClass('collapsed');
                this.element.trigger('collapse');
            }
        },
        isCollapsed: function() {
            return this.collapsed;
        }
    });

    $.widget('qcode.navTreeSearch', {
        _create: function() {
            var matches = $([]);
            var matchHeadings = $([]);
            var searchExpanded = $([]);
            var searchCount = $('<span class="searchCount">').insertAfter(this.element);
            this._on({
                keyup: function() {
                    var value = this.element.val().toLowerCase();
                    matches.removeClass('highlight');
                    matches = $([]);
                    matchHeadings.removeClass('highlight-2');
                    matchHeadings = $([]);
                    this.element.removeClass('nomatches');
                    this.options.navTree.navTree('setAnchor');
                    if ( value != "" ) {
                        this.options.navTree.find('a, span').not('.expand, .collapse').each(function(i, link) {
                            if ( $(link).text().toLowerCase().startsWith(value) ) {
                                matches = matches.add(link);
                            }
                        });
                        if ( matches.length == 0 ) {
                            this.element.addClass('nomatches');
                            searchExpanded.navTreeBranch('collapse');
                            searchExpanded = $([]);
                            searchCount.text(0 + " Matches");

                        } else {
                            matches.addClass('highlight');

                            var top = matches.first().positionRelativeTo(this.options.navTree).top;
                            if ( top > ( this.options.navTree.scrollTop() + this.options.navTree.height() )
                                 || top < this.options.navTree.scrollTop()
                               ) {
                                this.options.navTree.scrollTop(top + (this.options.navTree.height() / 2));
                            }
                            this.options.navTree.navTree('setAnchor', matches.first());

                            var containers = matches.parentsUntil('.navtree', 'li').children('ul').parent('li');

                            searchExpanded.not(containers).navTreeBranch('collapse');
                            searchExpanded = containers.filter('.collapsed').add(searchExpanded.filter(containers));
                            searchExpanded.navTreeBranch('expand');

                            matchHeadings = containers.children('a, span').not('.expand, .collapse');
                            matchHeadings.addClass('highlight-2');

                            searchCount.text(matches.length + " Matches");
                        }

                    } else {
                        searchExpanded.navTreeBranch('collapse');
                        searchExpanded = $([]);
                        searchCount.text("");
                    }
                },
                collapse: function(event) {
                    if ( $(event.target).is(searchExpanded) ) {
                        searchExpanded = searchExpanded.not(event.target);
                    }
                }
            });
        }
    });
})(jQuery);