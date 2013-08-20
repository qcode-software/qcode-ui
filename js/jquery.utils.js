// Returns the first non-undefined argument
function coalesce() {
    for(var i = 0; i < arguments.length; i++){
	if ( typeof arguments[i] != "undefined" ) {
	    return arguments[i];
	}
    }
}

(function ($) {
    $.fn.disable = function () {
	return $(this).each(function () { 
	    switch($(this)[0].nodeName.toUpperCase()) {
	    case "A":
		jQuery.data($(this)[0],"href",$(this).attr("href"));
		$(this).removeAttr('href');
	    default:
		$(this).attr('disabled', 'disabled').addClass('disabled');
	    }
	});
    };
    $.fn.enable = function () {
	return $(this).each(function () { 
	    switch($(this)[0].nodeName.toUpperCase()) {
	    case "A":
		if ( typeof jQuery.data($(this)[0],"href")!="undefined" ) {
		    $(this).attr("href",jQuery.data($(this)[0],"href"));
		}
	    default:
		$(this).removeAttr('disabled').removeClass("disabled"); 
	    }
	});
    };
})(jQuery);

;(function($, undefined) {
    $.fn.hrefClick = function() {
        if ( this.length == 0 || this.attr('href') === undefined ) {
            return this;
        }
        if ( this.length > 1 || ( ! this.is('a')) ) {
            $.error('Invalid usage of hrefClick');
        }
        var clickEvent = jQuery.Event('click');
        this.trigger(clickEvent);
        if ( ! clickEvent.isDefaultPrevented() ) {
            window.location = this.attr('href');
        }
    }
})(jQuery);

// setZeroTimeout / clearZeroTimeout
// equivalent to setTimeout(function, 0) but uses window.postMessage to bypass browser minimum timeouts
// In other words, schedule a function to be executed after all the other event handlers are finished
// Does not take additional arguments (to pass additional arguments to the callback, use closures instead)
(function(window, undefined) {
    if ( window.postMessage ) {
        var timeouts = []; // Array of functions
        var ids = {}; // Hash of keys, used by clearZeroTimeout, referencing indices of timeouts
        var messageName = "zero-timeout-message";
        var nextID = 0;

        function setZeroTimeout(fn) {
            nextID++;
            timeouts.push(fn);
            ids[nextID] = timeouts.length - 1;
            window.postMessage(messageName, "*");
            return nextID;
        }

        function clearZeroTimeout(index) {
            if ( ids[index] !== undefined ) {
                timeouts.splice(ids[index], 1);
                delete ids[nextID];
            }
        }

        function handleMessage(event) {
            if (event.source == window && event.data == messageName) {
                if ( event.stopPropagation ) {
                    event.stopPropagation();
                }
                if (timeouts.length > 0) {
                    var fn = timeouts.shift();
                    for (index in ids) {
                        if ( ids[index] === timeouts.length ) {
                            delete ids[index];
                            break;
                        }
                    }
                    fn();
                }
                return false;
            }
        }

        if ( window.addEventListener ) {
            window.addEventListener("message", handleMessage, true);
        } else if ( window.attachEvent ) {
            window.attachEvent("onmessage", handleMessage);
        } else {
            window.onmessage = handleMessage;
        }

        window.setZeroTimeout = setZeroTimeout;
        window.clearZeroTimeout = clearZeroTimeout;
    } else {
        window.setZeroTimeout = function(fn) {
            return window.setTimeout(fn, 0);
        }
        window.clearZeroTimeout = function(timeout) {
            window.clearTimeout(timeout);
        }
    }
})(window);