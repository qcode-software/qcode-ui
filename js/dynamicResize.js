function dynamicResize(oContainer) {
    // Dynamically resize container when window is resized.
    window.attachEvent('onresize',resize);
    resize();
    function resize() {
	var window_height = jQuery(window).height();
	var container_height = jQuery(oContainer).height();
	var container_position_bottom = jQuery(oContainer).position().top +  container_height;
	var new_height;
	var position_bottom;
	var content_height = 0;

	// Determine height of all content.
	jQuery("body").children().each(function() {
	    position_bottom = jQuery(this).position().top + jQuery(this).height();
	    if (position_bottom > content_height) {
		content_height = position_bottom;
	    }	
	});

	if (content_height < window_height) {
	    // All content is visible within the window.
	    // Increase container_height so that overall content_height = window_height
	    jQuery(oContainer).height(container_height + (window_height - content_height));
	} else if (content_height > window_height) {
	    // Content is only partially visible within window.
	    // Try to decrease container_height (minimum height = 300) so that all content 
	    // is visible within the window.

	    new_height = container_height - (content_height - window_height);
	    if (new_height > 300) {
		// Decrease container height as long as it's new_height is greater than 300. 
		jQuery(oContainer).height(new_height);
	    } else {
		// It is not possible to display all content within the window, unless we reduce the 
		// container height below the minimum.
		// Instead ensure that the container is completely visible within the window.
		if (container_position_bottom > window_height) {
		    new_height = window_height - 40;
		    jQuery(oContainer).height(new_height);
		}
	    }
	}
    }
}