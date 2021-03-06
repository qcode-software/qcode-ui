// Maximise the height of an element so that the content of a page spans the entire height of the window.  
;(function($, window, undefined){
    // Uses the jQuery UI widget factory.
    $.widget('qcode.maximizeHeight', {
	options: {
	    minimumHeight: 300
	},
	_create: function(){
	    // Constructor function
	    this._resize();

	    // Event listeners 
	    this._on(window, {
		'resize': this._resize
	    });
	},
	_resize: function() {
	    var windowHeight = jQuery(window).height();
	    var bodyHeight = jQuery('body').outerHeight(true);
	    var elementHeight = this.element.height();
	   
	    if (bodyHeight < windowHeight) {
		// Entire body is visible within the window.
		// Increase element's height so that bodyHeight = windowHeight
		this.element.height(elementHeight + (windowHeight - bodyHeight));
	    } else if (bodyHeight > windowHeight) {
		// Body is only partially visible within window.
		// Try to decrease element's height so that entire page contents is visible within the window.
		// Do not decrease below minimumHeight.
		var newHeight = elementHeight - (bodyHeight - windowHeight);
		if (newHeight < this.option('minimumHeight')) {
		    newHeight = this.option('minimumHeight');
		}
		this.element.height(newHeight);
	    }
	}
    });
})(jQuery, window);