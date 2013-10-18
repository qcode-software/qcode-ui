// Sidebar plugin - makes the target div a right sidebar, resizable (width only) and collapsible
;(function($, window, document, undefined){
    $.widget('qcode.sidebar', {
        options: {
            collapsedWidth: 25
        },
	_create: function(){
            this.storageKey = "qcode.sidebar.url(" + window.location.origin + window.location.pathname + ")";
	    // Even collapsed, the sidebar will take up some space, so add a margin to the body to prevent the collapsed sidebar from obscuring any page contents
	    $('body').css('margin-right', "+="+(10+this.options.collapsedWidth)+"px");

	    var sidebar = this.element.addClass('sidebar');
	    var toolbar = this.toolbar = sidebar.find('.toolbar');
            if ( localStorage[this.storageKey + '.width'] ) {
                sidebar.width(localStorage[this.storageKey + '.width']);
            }
	    var initialWidth = sidebar.width();

	    // An invisible div sitting on the sidebar's edge, to capture click & drag events for resizing the sidebar.
	    var handle = this.handle = $('<div>')
		.addClass('handle')
		.prependTo(sidebar);

	    this._on(handle, {
		'mousedown': this._dragStart,
		'dragStart': function(event, data) {
		    initialWidth = sidebar.width() + parseInt(sidebar.css('right'));
                    sidebar.animate({
                        'right': 0,
                        'width': initialWidth
                    }, 100);
	            this.restoreButton.hide();
	            this.collapseButton.show();
                    localStorage[this.storageKey + '.collapsed'] = "false";
                    localStorage[this.storageKey + '.width'] = initialWidth;
		},
		'drag': function(event, data) {
                    var newWidth = initialWidth - data.offset;
		    sidebar.width(newWidth);
                    localStorage[this.storageKey + '.width'] = newWidth;
		    sidebar.trigger('resize');
		},
		'dragEnd': function(event, data) {
		    initialWidth = sidebar.width();
		}
	    });

	    // Button to collapse the sidebar
	    this.collapseButton = $('<button>')
		.text('\u00bb')
                .attr('title', 'Collapse')
		.addClass('collapse')
		.prependTo(toolbar);

	    this._on(this.collapseButton, {
		'click': this.collapse
	    });

	    // Button to restore a collapsed sidebar
	    this.restoreButton = $('<button>')
		.text('\u00ab')
                .attr('title', 'Restore')
		.addClass('restore')
		.prependTo(toolbar)
		.hide();

	    this._on(this.restoreButton, {
		'click': this.restore
	    });

            if ( localStorage[this.storageKey + '.collapsed'] == "true" ) {
                this.collapse(false);
            }
	},
	collapse: function(animated) {
	    // "Collapse" the sidebar (actually just hides most of it beyond the edge of the window).
            var animated = coalesce(animated, true);
	    this.collapseButton.hide();
	    this.restoreButton.show();
            if ( animated ) {
	        this.element.stop().animate({
		    'right': this.options.collapsedWidth - this.element.width()
	        });
            } else {
                this.element.stop().css('right', this.options.collapsedWidth - this.element.width());
            }
            localStorage[this.storageKey + '.collapsed'] = "true";
	},
	restore: function(animated) {
	    // Restore a collapsed sidebar
            var animated = coalesce(animated, true);
	    this.restoreButton.hide();
	    this.collapseButton.show();
            if ( animated ) {
	        this.element.stop().animate({
		    'right': 0
	        });
            } else {
	        this.element.stop().css('right', 0);
            }
            localStorage[this.storageKey + '.collapsed'] = "false";
	},
	_dragStart: function(event){
	    var target = $(event.target);
	    event.preventDefault();
	    this._on($(window), {
		'mousemove': this._drag.bind(this, target, event.pageX),
		'mouseup': this._dragEnd.bind(this, target, event.pageX)
	    });
	    target.trigger('dragStart');
	},
	_drag: function(target, initialX, event){
	    event.preventDefault();
	    target.trigger('drag', [{
		'offset': event.pageX - initialX
	    }]);
	},
	_dragEnd: function(target, initialX, event){
	    this._off($(window), 'mousemove mouseup');
	    target.trigger('dragEnd');
	}
    });
})(jQuery, window, document);