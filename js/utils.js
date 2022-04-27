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
        throw 'Could not parse string to byte measure';
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
