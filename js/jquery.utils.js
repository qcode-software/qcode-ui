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

function httpPost(url,data,handler,errorHandler,async,headers) {
    // Add event listener to check whether request is cancelled by navigation
    var unloading = false;
    headers = $.extend({'X-Authenticity-Token': Cookies.get('authenticity_token')}, headers);
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
                    data = JSON.parse(jqXHR.responseText);
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

function scrollToElement($element, duration) {
    // Scrolls to the top of the given element if it isn't fully visible in the viewport.
    var $window = $(window);
    var viewportTop = $window.scrollTop();
    var viewportBottom = viewportTop + $window.height();
    var elementTop = $element.offset().top;
    var elementBottom = elementTop + $element.height();
    
    if ( elementBottom > viewportBottom || elementTop < viewportTop ) {                                
        // Element is not fully visible - scroll page to the element
        if ( $('html').scrollTop()) {            
            $('html').animate({
                scrollTop: $element.offset().top
            }, duration);
            return;
        }
        if ( $('body').scrollTop()) {            
            $('body').animate({
                scrollTop: $element.offset().top
            }, duration);
            return;
        }
    }
}

window.heir = heir;
window.coalesce = coalesce;
window.splitURL = splitURL;
window.formFocus = formFocus;
window.focusFirstChild = focusFirstChild;
window.stripHTML = stripHTML;
window.escapeHTML = escapeHTML;
window.unescapeHTML = unescapeHTML;
window.urlSet = urlSet;
window.urlDataSet = urlDataSet;
window.httpPost = httpPost;
window.parseBoolean = parseBoolean;
window.isEditingKeyEvent = isEditingKeyEvent;
window.guidGenerate = guidGenerate;
window.bytesWithUnits2Int = bytesWithUnits2Int;
window.scrollToElement = scrollToElement;