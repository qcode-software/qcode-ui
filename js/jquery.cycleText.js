// cycleText plugin. Takes an array of strings, expects the target to be a single element with text equal to one of those strings, and replaces the text on that element with the next string in the array, looping back to the beginning when the end is reached.
(function($){
    $.fn.cycleText = function(labels) {
	var nextLabel = labels[0];
	for(var i = labels.length - 1; i >= 0; i--) {
	    thisLabel = labels[i];
	    if ( this.text() === thisLabel ) {
		this.text(nextLabel);
		return this;
	    } else {
		nextLabel = thisLabel;
	    }
	}
	this.text(nextLabel);
	return this;
    }
})(jQuery);