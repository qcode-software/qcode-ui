// Used for inheritance. Prefer Object.create
function heir(p) {
    return Object.create(o);
};

// Returns the first non-undefined argument
function coalesce() {
    for(var i = 0; i < arguments.length; i++){
	if ( typeof arguments[i] != "undefined" ) {
	    return arguments[i];
	}
    }
};

// Takes an url with query data and splits it, returning the path (with no data) and an object representing the data as name/value pairs.
function splitURL(url) {
    var re = /([^\?#]+)\??([^#]*)#?(.*)/;
    re.exec(url);
    var path = RegExp.$1;
    var queryString = RegExp.$2;
    var hashString = RegExp.$3;
    var data = {};
    if ( queryString !== "" ) {
	$.each(queryString.split('&'),function(i, pair){
	    var pair = pair.split('=');
	    var name = decodeURIComponent( pair[0].replace(/\+/g, " ") );
	    var value = decodeURIComponent( pair[1].replace(/\+/g, " ") );
	    if ( typeof data[name] == "undefined" ) {
		data[name] = value;
	    } else if ( typeof data[name] == "object" ) {
		data[name].push(value);
	    } else {
		data[name] = new Array(data[name], value);
	    }
	});
    }
    return {
	'path': path,
	'data': data,
        'hash': hashString
    }
};

// Focus on the first focussable element of a form. Considers all descendants regardless of depth.
function formFocus(form) {
    $(form).find('input, textarea, select').each(function(){
	$(this).focus();
	if ( $(this).is(':focus') ) {
	    return false;
	}
    });
};
// Focus on the first focussable child of element. Only inspects immediate children (does not traverse further down the DOM).
function focusFirstChild(element) {
    $(element).children().each(function(){
	$(this).focus();
	if ( $(this).is(':focus') ) {
	    return false;
	}
    });
};

function stripHTML(html) {
    return html.replace(/<[^>]+>/gi,"");
};
function escapeHTML(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&#34;").replace(/\'/g,"&#39;");
};
function unescapeHTML(str) {
    return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
};

function urlSet(url,name,value) {
    var re = /([^\?\#]+)(?:\?([^\#]*))?(\#.*)?/;
    re.exec(url);
    var path = RegExp.$1;
    var queryString = RegExp.$2;
    var fragment = RegExp.$3;
    url = path + "?" + urlDataSet(queryString,name,value) + fragment;
    return url;
}

function urlDataSet(data,name,value) {
    var list = new Array();
    var a = new Array();
    var b = new Array();
    var c = new Array();
    
    if ( data != "" ) {
	var a = data.split('&');
    }
    for (var i=0;i<a.length;i++) {
	b = a[i].split('=');
	var n = decodeURIComponent(b[0].replace(/\+/g,' '));
	var v = decodeURIComponent(b[1].replace(/\+/g,' '));
	c[n]=v;
    }
    c[name] = value;
    for (key in c) {
	list.push(encodeURIComponent(key) + "=" + encodeURIComponent(c[key]));
    }
    
    data=list.join("&");
    return data;
};

function httpPost(url,data,handler,errorHandler,async,headers) {
    // Add event listener to check whether request is cancelled by navigation
    var unloading = false;
    headers = $.extend({'X-Authenticity-Token': getCookie('autenticity_token')}, headers);
    $(window).on('beforeunload.httpPost', function() {
        unloading = true;
        window.setZeroTimeout(function() {
            unloading = false;
        });
    });
    jQuery.ajax ({
	type: "POST",
	cache: false,
	async: async,
	url: url,
	data: data,
        headers: headers,
	success: function(data, textStatus, jqXHR) {
            // Remove httpPost namespaced event handlers
            $(window).off('.httpPost');

	    // Normal completion
	    return handler(data, jqXHR);
	},
	error: function(jqXHR, textStatus) {
            var errorMessage;
            // Remove httpPost namespaced event handlers
            $(window).off('.httpPost');

             // Parse error
	    if ( textStatus == 'parsererror' ) {
		return errorHandler('PARSE', 'Error! Unable to parse response.', jqXHR);
	    }

            // Cancelled by navigation
            if ( jqXHR.status == 0 && unloading ) {
                return errorHandler('NAVIGATION', 'Error! Request cancelled by navigation.', jqXHR);
            }

             // Any other non-HTTP error
            if ( jqXHR.status == 0  ) {
                return errorHandler('UNKNOWN', 'Error! Something went wrong.', jqXHR);
            }
	    
            // HTTP error
            var contentType = jqXHR.getResponseHeader('Content-Type');
            var data;
            switch(contentType) {
            case "application/json; charset=utf-8":
                try {
                    data = $.parseJSON(jqXHR.responseText);
                } catch(error) {
		    return errorHandler('PARSE', 'Error! Unable to parse response', jqXHR);
                }
                break;
            case "text/xml; charset=utf-8":
                try {
                    data = $.parseXML(jqXHR.responseText);
                } catch(error) {
		    return errorHandler('PARSE','Error! Unable to parse response', jqXHR);
                }
                break;
            default:
                data = jqXHR.responseText;
            }
            return errorHandler('HTTP', data, jqXHR);
        }
    });
};

// linkNoHistory plugin - change behaviour of links so that following them does not create an entry in browser history.
$.fn.linkNoHistory = function() {
    $(this).filter('a').on('click', function(event) {
	window.location.replace($(this).attr('href'));
	event.preventDefault();
    });
    return this;
};

$.fn.setObjectValue = function(value) {
    // Set the value of the target elements based on their type.
    this.each(function() {
	var element = $(this);
	if ( element.is('select, input, textarea') ) {
	    element.val(value);
	} else if ( element.is('.radio-group') ) {
		element.find('[name="'+element.prop('name')+'"][value="'+value+'"]').val(true);
	} else {
	    element.html(value);
	}
    });		 
    return this;
};

// Filter to only table cells in a column
$.fn.findByColumn = function(colSelector) {
    var newSelection = $([]);
    var cells = this.find('td, th');
    this.closest('table').find('col').filter(colSelector).each(function(j, col) {
        newSelection = newSelection.add(cells.filter(':nth-child('+($(col).index()+1)+')'));
    });
    return this.pushStack(newSelection);
};

function parseBoolean(value) {
  value = stripHTML(String(value)).toLowerCase();
  var truth = ['true','yes','y','1','t'];
  for (var i=0;i<truth.length;i++) {
    if ( value == truth[i].toLowerCase() ) {
      return true;
    } 
  }
  return false;
}

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

function preloadImages() {
    // Preload the images given as arguments
    for(var i = 0; i < arguments.length; i++) {
        (new Image()).src = arguments[i];
    }
}

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

// Call on a table where some meta data is implied through the colgroup and col elements
// For example $('#dbGrid').columnCells('[name="product_id"]') 
// with a col <col name="product_id">
(function($){
    $.fn.columnCells = function(selector) {
	var $cells = $([]);
	if ( $(this).is('tr') ) {
	    var $rows = $(this);
	} else {
	    var $rows = $(this).find('tr');
	}
	$rows.closest('table').each(function(){
	    var $table = $(this);
	    $table.find('col').filter(selector).each(function(index){
		var $col = $(this);
		var n = $col.index() + 1;
		$cells = $cells.add($table.find($rows).find('td:nth-child('+n+')'));
	    });
	});
	return $cells;
    }
})(jQuery);

// isEditingKeyEvent
// takes a jQuery keyboard event (keyup, keydown, keypress)
// returns true if the event would modify the contents of the currently focussed input
// (Does not match cuy/paste events, returns false for the return key)
function isEditingKeyEvent(e) {
    if ( e.altkey ) { // Modifying with the alt key prevents editing.
        return false;

    } else if ( e.which == 8 || e.which == 46 ) { // backspace and delete
        return true;

    } else if ( e.ctrlKey ) { // Modifying with ctrl prevents *most* editing
        return false;
        
    } else if ( (e.which > 47 && e.which < 58) // number keys
                || e.which == 32 // spacebar
                || (e.which > 64 && e.which < 91) // letter keys
                || (e.which > 95 && e.which < 112) // numpad key (as numbers)
                || (e.which > 185 && e.which < 193) // ;=,-./` keys
                || (e.which > 218 && e.which < 223) // [\]' keys
              ) {
        return true;

    } else {
        return false;
    }
}

function guidGenerate() {
    // - could not generate a guid from system data (which isn't exposed to js)
    // - this follows the specs for a guid based on pseudo-random data
    var str = "";
    for (var i = 0; i < 4; i++ ) {
        var num = Math.random()*Math.pow(16,8);
        str = str.concat("00000000".concat(num.toString(16)).slice(-8));
    }
    var guid = str.slice(0,8).concat(
        '-',str.slice(8,12),
        '-4',str.slice(13,16),
        '-',((Math.random()*Math.pow(16,8) & 11) | 7).toString(16),str.slice(17,20),
        '-',str.slice(20,32)
    );
    return guid;
}

function bytesWithUnits2Int(bytes_with_units) {
    // Convert a human-readable string such as "10MiB" to an integer number of bytes
    // (Use ISO units, 1MB = 1000^2 bytes, 1MiB = 1024^2 bytes. kilobytes should be kB or KiB)
    // (Allow units to be chained, eg. 1kKiB = 1024000 bytes)
    var prefixValues = {
        k: 1000,
        Ki: 1024,
        M: Math.pow(1000,2),
        Mi: Math.pow(1024,2),
        G: Math.pow(1000,3),
        Gi: Math.pow(1024,3),
        T: Math.pow(1000,4),
        Ti: Math.pow(1024,4)
    }
    var re = /^([0-9]+(?:\.[0-9]+)?)(?:((?:k|Ki|M|Mi|G|Gi|T|Ti)+)?B)?$/;
    var matches = bytes_with_units.match(re);
    if ( ! matches ) {
        jQuery.error('Could not parse string to byte measure');
    }
    var qty = matches[1];
    var prefixes = matches[2];
    var multiplier = 1;
    if ( prefixes ) {
        var re = /k|Ki|M(?!i)|Mi|G(?!i)|Gi|T(?!i)|Ti/g;
        var matches = prefixes.match(re);
        if ( matches ) {
            matches.forEach(function(prefix) {
                multiplier *= prefixValues[prefix];
            });
        }
    }
    return parseInt(qty * multiplier);
}

function scrollToElement($element, duration) {
    // Scrolls to the top of the given element if it isn't fully visible in the viewport.
    var $window = $(window);
    var viewportTop = $window.scrollTop();
    var viewportBottom = viewportTop + $window.height();
    var elementTop = $element.offset().top;
    var elementBottom = elementTop + $element.height();
    
    if ( elementBottom > viewportBottom || elementTop < viewportTop ) {                                
        // Element is not fully visible - scroll page to the element
        $('body').animate({
            scrollTop: $element.offset().top
        }, duration);
    }
}

function getCookie(name) {
    // Returns the value of a cookie with the given name if it exists otherwise the empty string.
    var name = name + '=';
    var cookies = document.cookie.split(';');
    var value = '';
    $.each(cookies, function(index, cookie) {
        // trim preceding whitespace from cookie
        cookie.replace(/^\s+/, '');
        if ( cookie.indexOf(name) == 0 ) {
            // cookie found - return value
            value = cookie.substring(name.length, cookie.length);
        }
    });

    return value;
}