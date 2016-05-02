;(function($, undefined) {
    // ======================================================================
    // Transition jQuery function to animate Height/Width changes
    // ======================================================================
    $.fn.transition = function(options) {
        // options.property (required) eg. 'height' or 'width'
        // options.endValue (required) eg. 'auto', '' (initial value) or '100px' (absolute value)
        // options.duration (optional) eg. '0.3s', '300ms' etc.
        // options.timingFunction (optional) eg 'linear', 'ease' etc.

        // Default option values
        options.duration = options.duration || '0.3s';
        options.timingFunction = options.timingFunction || 'ease';

        $(this).each(function() {
            var autoValue;
            var $element = $(this);

            // remove any esiting transitionend.transition events bound to this element.
            $element.off('transitionend.transition');
            
            if ( ! $element.data('transition-in-progress') ) {
                // If not currently transitioning...
                $element.data('transition-in-progress', true);

                // Turn off transitions so javascript width/height changes are not animated
                $element.css('transition', 'none'); 

                var initialValue = $element[options.property]();

                // calculate auto width/height value and store in data-attribute
                $element.css(options.property, 'auto');
                autoValue = $element[options.property]();
                $element.data('transition-auto-value', autoValue);
                
                if (initialValue === options.endValue || options.endValue === 'auto' && initialValue === autoValue) {
                    // Element width/height already equals endValue, nothing to do
                    $element.data('transition-in-progress', false);
                    return;
                }

                // Reset element width/height to initialValue and force browser repaint by querying offsetWidth
                $element.css(options.property, initialValue);
                $element.get(0).offsetWidth;

                // Add inline css transition property to element
                $element.css('transition', options.property + ' ' + options.duration + ' ' + options.timingFunction);
            } else {
                // If currently transitioning...
                autoValue = $element.data('transition-auto-value');
            }

            // Set element width/height with inline css, specifying absolute pixel value
            if (options.endValue === 'auto') {
                $element.css(options.property, autoValue);
            } else {
                $element.css(options.property, options.endValue);
            }
            
            $element.one('transitionend.transition', function(event) {
                // when transition completes, clean up data attributes and inline CSS
                $element.removeData('transition-in-progress');
                $element.removeData('transition-auto-value');
                $element.css('transition', '');
                if (options.endValue === 'auto') {
                    // Set height to 'auto' to instead of autoHeight to accomodate responsive layouts
                    $element.css(options.property, 'auto');
                }
            });
        });

        return this;
    }
})(jQuery);