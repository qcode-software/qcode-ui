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
            var originalText = $(element).data('qcode-format-original-data');
            if ( originalText === undefined ) {
                originalText = $(element).text().trim();
                $(element).data('qcode-format-original-data', originalText);
            }

            // Decide whether or not to show zeros
            if ( options.zeros === "auto" ) {
                if ( originalText === "" ) {
                    var zeros = false;
                } else {
                    var zeros = true
                }
            } else {
                zeros = options.zeros;
            }

            // Custom function
            if ( options.function !== undefined ) {
                $(element).text(options.function.call(element, originalText));

            } else {
                // Extract numeric value
                var value = originalText.replace(/[^0-9.]/g, '') * 1;

                // Leave non-numeric values alone
                if ( Number.isNaN(value) ) {
                    return;
                }

                // Hide zeros if option is selected
                if ( value === 0 && ! zeros ) {
                    $(element).text("");
                    return;
                }

                if ( options.sigfigs !== null ) {
                    var text = value.toLocaleString(lan, {
                        maximumSignificantDigits: options.sigfigs
                    });
                } else if ( options.dps !== null ) {
                    var text = value.toLocaleString(lan, {
                        minimumFractionDigits: options.dps,
                        maximumFractionDigits: options.dps
                    });
                } else {
                    var text = value.toLocaleString();
                }
                $(element).text(text);
            }
        });
        return this;
    };
})(jQuery);