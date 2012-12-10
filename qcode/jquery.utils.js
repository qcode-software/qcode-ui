// Used for inheritance. Prefer Object.create
function heir(p) {
    return Object.create(o);
}

// Returns the first non-undefined argument
function coalesce() {
    for(var i = 0; i < arguments.length; i++){
	if ( typeof arguments[i] != "undefined" ) {
	    return arguments[i];
	}
    }
}

// Takes an url with query data and splits it, returning the path (with no data) and an object representing the data as name/value pairs.
function splitURL(url) {
    var re = /([^\?]+)\??(.*)/;
    re.exec(url);
    var path = RegExp.$1;
    var queryString = RegExp.$2;
    var data = {};
    if ( queryString !== "" ) {
	$.each(queryString.split('&'),function(i, pair){
	    data[pair.split('=')[0]] = pair.split('=')[1];
	});
    }
    return {
	'path': path,
	'data': data
    }
}

// Focus on the first focussable element of a form. Considers all descendants regarless of depth.
function formFocus(form) {
    $(form).find('input, textarea, select').each(function(){
	$(this).focus();
	if ( $(this).is(':focus') ) {
	    return false;
	}
    });
}
// Focus on the first focussable child of element. Only inspects immediate children (does not traverse further down the DOM).
function focusFirstChild(element) {
    $(element).children().each(function(){
	$(this).focus();
	if ( $(this).is(':focus') ) {
	    return false;
	}
    });
}

function stripHTML(html) {
  return html.replace(/<[^>]+>/gi,"");
}
function escapeHTML(str) {
	return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&#34;").replace(/\'/g,"&#39;");
}
function unescapeHTML(str) {
	return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
}

function httpPost(url,data,handler,errorHandler,async) {
    jQuery.ajax ({
	type: "POST",
	cache: false,
	async: async,
	dataType: 'xml',
	url: url,
	data: data,
	success: function(data, textStatus, jqXHR) {
	    // USER ERROR
	    var error = jQuery('error', data).first();
	    if ( error.size() ) {
		var errorMessage = error.text();
		return errorHandler(errorMessage,'USER');
	    }

	    // NORMAL COMPLETION
	    return handler(data, textStatus, jqXHR);
	},
	error: function(jqXHR, textStatus) {
	    // HTTP ERROR
	    if ( jqXHR.status != 200 && jqXHR.status != 0 ) {
		errorMessage = "Error ! Expected response 200 but got " + jqXHR.status;
		return errorHandler(errorMessage,'HTTP');
	    }

	    // XML ERROR
	    if ( textStatus == 'parsererror' ) {
		errorMessage = 'Error ! Unable to parse XML response';
		return errorHandler(errorMessage,'XML');
	    }
	    
	    // DEFAULT ERROR
	    errorMessage = 'Error ! '+ textStatus;
	    return errorHandler(errorMessage, 'UNKNOWN');
	}
    });
}