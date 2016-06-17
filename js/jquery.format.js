/* ====================================================================
jquery.format plugin
Format the contents of the target elements, and store the original
values. Takes a single options object.
{
  sigfigs: int - significant figures. null to remove
  dps: int - decimal places. null to remove
  zeroes: true/false/"auto" - show/hide zeros/empty strings
  function: function(originalText) {return formattedText}
}
Only one of sigfigs, dps, and customFunction will be applied
==================================================================== */
;(function($, undefined) {

    // get locale language code
    var lan = navigator.language || navigator.userLanguage;

    $.fn.format = function(settings) {
        var options = $.extend({
            sigfigs: null,
            dps: null,
            zeros: "auto",
            "function": undefined
        }, settings);
        this.each(function(index, element) {
            // Get and store the original text value of the element
            var key = 'qcode-format-original-data';
            var originalText = $(element).data(key);
            if ( originalText === undefined ) {
                originalText = $(element).text().trim();
                $(element).data(key, originalText);
            }

            // Decide whether or not to show zeros. For "auto",
            // decide on a per-element basis, determined by text
            // being "" or 0
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
            if ( options["function"] !== undefined ) {
                $(element).text(
                    options["function"].call(element, originalText)
                );

            } else {
                // Extract numeric value (ignore non-numeric chars)
                var value = originalText.replace(/[^0-9.]/g, '') * 1;

                // Leave non-numeric values alone
                if ( Number.isNaN(value) ) {
                    return;
                }

                // Hide zeros
                if ( value === 0 && ! zeros ) {
                    $(element).text("");
                    return;
                }

                // Apply toLocaleString conversion
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
