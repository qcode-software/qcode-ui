// Sidebar plugin - makes the target div a right sidebar, resizable (width only) and collapsible
;(function($, window, document, undefined){
    $.widget('qcode.sidebar', {
        options: {
            collapsedWidth: 25
        },
	_create: function(){
	    // Even collapsed, the sidebar will take up some space, so add a margin to the body to prevent the collapsed sidebar from obscuring any page contents
	    $('body').css('margin-right', "+="+(10+this.options.collapsedWidth)+"px");

	    var sidebar = this.element.addClass('sidebar'),
	    toolbar = this.toolbar = sidebar.find('.toolbar'),
	    initialWidth = sidebar.width();

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
		},
		'drag': function(event, data) {
		    sidebar.width(initialWidth - data.offset);
		    sidebar.trigger('resize');
		},
		'dragEnd': function(event, data) {
		    initialWidth = sidebar.width();
		}
	    });

	    // Button to collapse the sidebar
	    this.collapseButton = $('<button>')
		.text('\u00bb')
		.addClass('collapse')
		.prependTo(toolbar);

	    this._on(this.collapseButton, {
		'click': this.collapse
	    });

	    // Button to restore a collapsed sidebar
	    this.restoreButton = $('<button>')
		.text('\u00ab')
		.addClass('restore')
		.prependTo(toolbar)
		.hide();

	    this._on(this.restoreButton, {
		'click': this.restore
	    });
	},
	collapse: function() {
	    // "Collapse" the sidebar (actually just hides most of it beyond the edge of the window).
	    this.collapseButton.hide();
	    this.restoreButton.show();
	    this.element.stop().animate({
		'right': this.options.collapsedWidth - this.element.width()
	    });
	},
	restore: function() {
	    // Restore a collapsed sidebar
	    this.restoreButton.hide();
	    this.collapseButton.show();
	    this.element.stop().animate({
		'right': 0
	    });
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