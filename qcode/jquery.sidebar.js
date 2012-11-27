// Sidebar plugin - makes the target div a right sidebar, resizable (width only) and collapsible
(function($){

    // class Sidebar - an object to handle all the plugin functionality
    function Sidebar(element) {
	// Even collapsed, the sidebar will take up some space, so add a margin to the body to prevent the collapsed sidebar from obscuring any page contents
	$('body').css('margin-right', "+=35px");

	var sidebar = this.sidebar = $(element);
	var toolbar = this.toolbar = sidebar.find('.toolbar');
	var initialWidth = sidebar.width();

	// An invisible div sitting on the sidebar's edge, to capture click & drag events for resizing the sidebar.
	var handle = this.handle = $('<div>')
	    .addClass('handle')
	    .prependTo(sidebar)
	    .on('mousedown.resizer',dragStart) // The dragStart function will bind additional event listeners to trigger drag events
	    .on('dragStart', function(event, data) {
		initialWidth = sidebar.width();
		sidebar.trigger('resizeStart');
	    })
	    .on('drag', function(event, data) {
		sidebar.width(initialWidth - data.offset);
		sidebar.width(sidebar.width()); // Ensures that the css "width" property matches the actual calculated width
		sidebar.trigger('resize');
	    })
	    .on('dragEnd', function(event, data) {
		initialWidth = sidebar.width();
		sidebar.trigger('resizeEnd');
	    });

	// Button to collapse the sidebar
	var collapseButton = this.collapseButton = $('<button>')
	    .text('\u21e5')
	    .addClass('collapse')
	    .prependTo(toolbar)
	    .on('click', this.collapse.bind(this));

	// Button to restore a collapsed sidebar
	var restoreButton = this.restoreButton = $('<button>')
	    .text('\u21e4')
	    .addClass('restore')
	    .prependTo(toolbar)
	    .hide()
	    .on('click', this.restore.bind(this));
    }

    // Public methods of class Sidebar
    $.extend(Sidebar.prototype, {
	collapse: function() {
	    // "Collapse" the sidebar (actually just hides most of it beyond the edge of the window).
	    this.handle.off('.resizer').css('cursor', 'auto');
	    this.collapseButton.hide();
	    this.restoreButton.show();
	    this.sidebar.stop().animate({
		'right': 25 - this.sidebar.width()
	    });
	},
	restore: function() {
	    // Restore a collapsed sidebar
	    this.handle.on('mousedown.resizer',dragStart).css('cursor', "w-resize");
	    this.restoreButton.hide();
	    this.collapseButton.show();
	    this.sidebar.stop().animate({
		'right': 0
	    });
	}
    });
    // End of class Sidebar



    // Drag events.
    // Typical use is to call dragStart in response to a mousedown event, then listen for dragStart, drag and dragEnd events.
    // Once called, dragStart will add listeners and call the other functions appropriately.
    function dragStart(event){
	var target = $(event.target);
	event.preventDefault();
	$('body')
	    .on('mousemove.dragEvent',drag.bind(this,target))
	    .on('mouseup.dragEvent',dragEnd.bind(this,target))
	    .on('mouseleave.dragEvent',dragEnd.bind(this,target));
	target
	    .data({
		'initialX': event.pageX
	    })
	    .trigger('dragStart');
    }
    function drag(target, event){
	event.preventDefault();
	target.trigger('drag', [{
	    'offset': event.pageX - target.data('initialX')
	}]);
    }
    function dragEnd(target, event){
	$('body').off('.dragEvent');
	target.trigger('dragEnd');
    }



    // sidebar plugin function
    $.fn.sidebar = function(){
	$(this).each(function(){
	    var sidebar = $(this).data('sidebar');
	    if ( typeof sidebar != "object" ) {
		$(this).data('sidebar', new Sidebar(this));
		sidebar = $(this).data('sidebar');
	    }
	});
	return this;
    }
})(jQuery);