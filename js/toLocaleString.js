;(function(undefined) {
    var supported = false;
    try {
        (0).toLocaleString("");
    } catch (e) {
        if ( e.name === "RangeError" ) {
            supported = true;
        }
    }
    if ( ! supported ) {
        function coalesce() {
            for(var i = 0; i < arguments.length; i++){
	        if ( typeof arguments[i] != "undefined" ) {
	            return arguments[i];
	        }
            }
        }
        function checkInt(value, min, max, name) {
            if ( value !== parseInt(value)
                 || value < min
                 || value > max ) {
                throw new RangeError(name + ' value is out of range');
            }
        }
        Number.prototype.toLocaleString = function(locales, options) {
            var minInteger = options.minimumIntegerDigits;
            var minFraction = options.minimumFractionDigits;
            var maxFraction = options.maximumFractionDigits;
            var minSignificant = options.minimumSignificantDigits;
            var maxSignificant = options.maximumSignificantDigits;
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
            var useGrouping = coalesce(options.useGrouping, true);              

            if ( minSignificant !== undefined || maxSignificant !== undefined ) {
                minSignificant = coalesce(minSignificant,1);
                maxSignificant = coalesce(maxSignificant,minSignificant);
                checkInt(minSignificant, 1, 21, 'minimumSignificantDigits');
                checkInt(maxSignificant, minSignificant, 21, 'maximumSignificantDigits');

                var rounded = this.toPrecision(maxSignificant) * 1;

                var string = rounded.toString();
                var parts = string.split('.');
                if ( parts[1] === undefined ) {
                    parts[1] = "";
                }

                var length = parts[0].length + parts[1].length;
                if ( length < minSignificant ) {
                    var padding = minSignificant - length;
                    var dps = padding + parts[1].length;
                    string = rounded.toFixed(dps);
                    parts = string.split('.');
                }

            } else {
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

                var rounded = this.toFixed(maxFraction) * 1;

                var string = rounded.toString();
                var parts = string.split('.');
                if ( parts[1] === undefined ) {
                    parts[1] = "";
                }

                if ( parts[0].length < minInteger ) {
                    for(var i = minInteger - parts[0].length; i--; i > 0) {
                        parts[0] = '0' + parts[0];
                    }
                }
                if ( parts[1].length < minFraction ) {
                    for(var i = minFraction - parts[1].length; i--; i > 0 ) {
                        parts[1] = parts[1] + '0';
                    }
                }
            }

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

            if ( parts[1] === "" ) {
                string = parts[0];
            } else {
                string = parts.join('.');
            }
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