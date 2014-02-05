;(function($, undefined) {
    var lan = navigator.language || navigator.userLanguage;
    $.fn.format = function(settings) {
        var options = $.extend({
            sigfigs: null,
            dps: null,
            zeros: "auto",
            function: undefined
        }, settings);
        this.each(function(index, element) {
            // Get the original text value of the element (and store in $.data)
            var originalData = $(element).data('qcode-format-original-data');
            if ( originalData === undefined ) {
                originalData = $(element).text().trim();
                $(element).data('qcode-format-original-data', originalData);
            }

            // Decide whether or not to show zeros
            if ( options.zeros === "auto" ) {
                if ( originalData === "" ) {
                    var zeros = false;
                } else {
                    var zeros = true
                }
            } else {
                zeros = options.zeros;
            }

            // Custom function
            if ( options.function !== undefined ) {
                $(element).text(options.function.call(element, originalData));

            } else {
                // Extract numeric value
                var value = originalData.replace(/[^0-9.]/g, '') * 1;

                // Leave non-numeric values alone
                if ( Number.isNaN(value) ) {
                    return;
                }

                // Hide zeros if option is selected
                if ( value * 1 === 0 && ! zeros ) {
                    $(element).text("");
                    return;
                }

                // Round to significant figures (but display as number, not using scientific notation)
                if ( options.sigfigs !== null ) {
                    value = value.toPrecision(options.sigfigs) * 1;
                }

                // Round to decimal places, and pad with trailing 0s
                if ( options.dps !== null ) {
                    value = value.toFixed(options.dps);
                }

                $(element).text(value);
            }
        });
        return this;
    };
})(jQuery);