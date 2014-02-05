/* ===================================================================
Backwards-compatible support for toLocaleString.
Currently only GB is supported
=================================================================== */
;(function(undefined) {

    // Test for support. Modern browsers should throw a RangeError
    // When toLocaleString is called with an invalid locale code
    var supported = false;
    try {
        (0).toLocaleString("");
    } catch (e) {
        if ( e.name === "RangeError" ) {
            supported = true;
        }
    }

    if ( ! supported ) {
        // Util function - return first defined argument
        function coalesce() {
            for(var i = 0; i < arguments.length; i++){
	        if ( typeof arguments[i] != "undefined" ) {
	            return arguments[i];
	        }
            }
        }
        // Throw a RangeError if value is not an int,
        // or is outside min-max range.
        // Use name for RangeError message.
        function checkInt(value, min, max, name) {
            if ( value !== parseInt(value)
                 || value < min
                 || value > max ) {
                throw new RangeError(name + ' value is out of range');
            }
        }

        Number.prototype.toLocaleString = function(locales, options) {
            // "locales" option is currently non-functional
            options = coalesce(options, {});
            var minInteger = options.minimumIntegerDigits;
            var minFraction = options.minimumFractionDigits;
            var maxFraction = options.maximumFractionDigits;
            var minSignificant = options.minimumSignificantDigits;
            var maxSignificant = options.maximumSignificantDigits;
            var useGrouping = coalesce(options.useGrouping, true); 

            // Support for styles and currency
            var style = coalesce(options.style, 'decimal');
            switch (style) {
            case 'currency':
                if ( options.currency === undefined ) {
                    throw new TypeError('Currency code is required with currency style');
                } else if ( options.currency === 'GBP' ) {
                    var currencyDisplay = coalesce(options.currencyDisplay, 'symbol');
                    switch (currencyDisplay) {
                    case 'symbol':
                        var currencySymbol = "£";
                        break;
                    case 'code':
                        var currencyCode = 'GBP';
                        break;
                    case 'name':
                        var currencyName = 'British pounds sterling';
                        break;
                    default:
                        throw new RangeError('Value '+currencyDisplay+' out of range for numberformat options property currencyDisplay');
                        break;
                    }
                } else {
                    throw new Error('That currency code isn\'t supported by this implementation');
                }
                break;
            case 'percent':
            case 'decimal':
                break;
            default:
                throw new RangeError('Value '+style+' out of range for numberformat options property style');
            }
             
            // If significant digit arguments are provided,
            // integer/fraction arguments are ignored
            if ( minSignificant !== undefined || maxSignificant !== undefined ) {

                // defaults and checks
                minSignificant = coalesce(minSignificant,1);
                maxSignificant = coalesce(maxSignificant,minSignificant);
                checkInt(minSignificant, 1, 21, 'minimumSignificantDigits');
                checkInt(maxSignificant, minSignificant, 21, 'maximumSignificantDigits');

                // Round value based on maximum significant digits
                var rounded = this.toPrecision(maxSignificant) * 1;

                // Split string into integer part and fraction part
                var string = rounded.toString();
                var parts = string.split('.');
                if ( parts[1] === undefined ) {
                    parts[1] = "";
                }

                // pad to minimum significant digits with trailing 0s
                var length = parts[0].length + parts[1].length;
                if ( length < minSignificant ) {
                    var padding = minSignificant - length;
                    var dps = padding + parts[1].length;
                    string = rounded.toFixed(dps);
                    parts = string.split('.');
                }

            } else {
                // If significant digit arguments are not provided,
                // fall back to integer/fraction arguments

                // defaults and checks
                minInteger = coalesce(minInteger, 1);
                switch (style) {
                case 'decimal':
                    minFraction = coalesce(minFraction, 0);
                    maxFraction = coalesce(maxFraction, Math.max(minFraction,3));
                    break;
                    
                case 'currency':
                    minFraction = coalesce(minFraction, 2);
                    maxFraction = coalesce(maxFraction, Math.max(minFraction,2));
                    break;

                case 'percent':
                    minFraction = coalesce(minFraction, 0);
                    maxFraction = coalesce(maxFraction, minFraction);
                    break;
                }
                checkInt(minInteger, 1, 21, 'minimumIntegerDigits');
                checkInt(minFraction, 0, 20, 'minimumFractionDigits');
                checkInt(maxFraction, 0, 20, 'maximumFractionDigits');

                // Round value based on maximum decimal places
                var rounded = this.toFixed(maxFraction) * 1;

                // Split string into integer and fraction components
                var string = rounded.toString();
                var parts = string.split('.');
                if ( parts[1] === undefined ) {
                    parts[1] = "";
                }

                // Pad integer component with leading 0s, based on
                // minimum integer digits argument
                for(var i = minInteger - parts[0].length; i > 0; i--) {
                    parts[0] = '0' + parts[0];
                }

                // Pad fraction component with trailing 0s, based on
                // minimum fraction digits argument
                for(var i = minFraction - parts[1].length; i > 0; i-- ) {
                    parts[1] = parts[1] + '0';
                }
            }

            // At this point parts[] should contain 2 values -
            // the intger component and the fractional component.
            // Both should be rounded/padded as appropriate

            // Group the digits in the integer component into groups
            // of 3, separated by commas.
            if ( coalesce(options.useGrouping, true) ) {
                var remainder = parts[0];
                var groups = [];
                while ( remainder.length > 3 ) {
                    groups.unshift(remainder.slice(-3));
                    remainder = remainder.slice(0, -3);
                }
                if ( remainder.length > 0 ) {
                    groups.unshift(remainder);
                }

                parts[0] = groups.join(',');
            }

            // Join the integer and fraction parts back together
            if ( parts[1] === "" ) {
                string = parts[0];
            } else {
                string = parts.join('.');
            }

            // Output the resulting string in the desired style.
            switch (style) {
            case 'decimal':
                return string;
                break;
            case 'percent':
                return string + '%';
                break;
            case 'currency':
                switch (currencyDisplay) {
                case 'symbol':
                    return currencySymbol + string;
                case 'code':
                    return currencyCode + string;
                case 'name':
                    return string + ' ' + currencyName;
                }
                break;
            }
        }
    }
})();