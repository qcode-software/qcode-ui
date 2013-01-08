/*
 * This file contains the concatented JavaScript Libary for Qcode Software Limited.
 *
 * https://svn.qcode.co.uk/js/trunk
 * https://trac.qcode.co.uk/js
 *
 * Copyright (c) 2004-2012, Qcode Software Limited <hackers@qcode.co.uk> 
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   - Neither the name of Qcode Software Limited nor the names of its contributors may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* ==== 0.jquery-hacks.js ==== */
// Bug fix for table border width detection in ie9
(function($){
    if ( $.browser.msie && parseInt($.browser.version, 10) == "9" ) {
        var oldCssFunction = $.fn.css;
        $.fn.css = function() {
            if ( this.first().is('table') && arguments.length == 1 ) {
		var table = this.first();
                switch(arguments[0]){
                case "border-left-width":
		case "borderLeftWidth":
                    var totalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    this.css('border-left-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-left-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-right-width":
		case "borderRightWidth":
                    var totalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    this.css('border-right-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-right-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-top-width":
		case "borderTopWidth":
                    var totalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    this.css('border-top-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-top-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-bottom-width":
		case "borderBottomWidth":
                    var totalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    this.css('border-bottom-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-bottom-width', borderWidth);
                    return borderWidth + "px";
                    
                default:
                    return oldCssFunction.apply(this,arguments);
                }
            } else {
                return oldCssFunction.apply(this,arguments);
            }
        };
    }
    function getInnerWidth(table) {
        var borderSpacing = table.css('border-spacing');
        var horizontalSpacing = borderSpacing.split(' ').shift();
        return parseInt(table.find('tbody').outerWidth()) + (parseInt(horizontalSpacing) * 2);
    }
    function getInnerHeight(table) {
        var borderSpacing = table.css('border-spacing');
        var verticalSpacing = parseInt(borderSpacing.split(' ').pop());
        var totalHeight = verticalSpacing;
        table.find('thead, tbody, tfoot').each(function(){
            if ( $(this).css('position') != "absolute" ) {
                totalHeight += parseInt($(this).outerHeight()) + verticalSpacing;
            }
        });
        return totalHeight;
    }

    jQuery.expr[":"].focus = function( elem ) {
	var doc = elem.ownerDocument;
	return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex || elem.isContentEditable);
    }
})(jQuery);

/* ==== 0.jquery-ui-hacks.js ==== */
(function($) {
    if ( $.isFunction($.widget) ) {
	var slice = Array.prototype.slice

	$.widget.bridge = function( name, object ) {
	    var fullName = object.prototype.widgetFullName || name;
	    $.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
		args = slice.call( arguments, 1 ),
		returnValue = this;
		
		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
		    $.widget.extend.apply( null, [ options ].concat(args) ) :
		    options;

		if ( isMethodCall ) {
		    this.each(function() {
			var methodValue,
			instance = $.data( this, fullName );
			if ( !instance ) {
			    $.data( this, fullName, new object( undefined, this ) );
			    instance = $.data( this, fullName );
			}
			if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
			    return $.error( "no such method '" + options + "' for " + name + " widget instance" );
			}
			methodValue = instance[ options ].apply( instance, args );
			if ( methodValue !== instance && methodValue !== undefined ) {
			    returnValue = methodValue && methodValue.jquery ?
				returnValue.pushStack( methodValue.get() ) :
				methodValue;
			    return false;
			}
		    });
		} else {
		    this.each(function() {
			var instance = $.data( this, fullName );
			if ( instance ) {
			    instance.option( options || {} )._init();
			} else {
			    $.data( this, fullName, new object( options, this ) );
			}
		    });
		}

		return returnValue;
	    };
	}
    }
}) (jQuery);


/* ==== 0.js-hacks.js ==== */
// Support for Function.prototype.bound in earlier browsers - taken from developer.mozilla.org
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
	if (typeof this !== "function") {
	    // closest thing possible to the ECMAScript 5 internal IsCallable function
	    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	}
	
	var aArgs = Array.prototype.slice.call(arguments, 1), 
	fToBind = this, 
	fNOP = function () {},
	fBound = function () {
	    // If the bound function is called with the "new" keyword, the scope will be the new object instead of oThis
	    return fToBind.apply(this instanceof fNOP && oThis
				 ? this
				 : oThis,
				 aArgs.concat(Array.prototype.slice.call(arguments)));
	};
	
	// The bound function prototype inherits from the original function prototype
	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();
	
	return fBound;
    };
}

// Support for Object.create in earlier browsers
if (!Object.create) {
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() {}
        F.prototype = o;
        return new F();
    };
}

/* ==== bvwLib1.0.js ==== */
function Mod(a, b) { return a-Math.floor(a/b)*b }
function getContainingElmt(elmt,tagName) {
	while (elmt.tagName != tagName) {
		if (elmt.parentElement) {
			elmt = elmt.parentElement;
		} else {
			throw "This element does not have a parent with the tag " + tagName;
		}
	}
	return elmt;
}
function getNodeIndex(elmt) {
	var oParent = elmt.parentElement;
	for(var i=0;i<oParent.childNodes.length;i++) {
		if ( oParent.childNodes[i] == elmt ) {
			return i;
		}
	}
}
function setObjectValue(elmt,value) {
 out: {
   if ( elmt.tagName == "SELECT" ) {
     setOptionValue(elmt,value);
     break out;
   }
   if ( elmt.tagName == "INPUT") {
     if ( elmt.type == "checkbox"  ) {
       setCheckboxValue(elmt,value);
       break out;
     }
     elmt.value = value;
     break out;
   }
   if ( elmt.tagName == "TEXTAREA") {
     elmt.innerText = value;
     break out;
   }
   if ( elmt.className == 'clsRadioGroup' ) {
     setRadioGroupValue(elmt,elmt.name,value);
     break out;
   }
   // Default
   elmt.innerHTML = value;
 }
}
function getObjectValue(elmt) {
    if ( elmt.tagName == "SELECT" ) {
	return getOptionValue(elmt);
    }
    if ( elmt.tagName == "INPUT") {
	if ( elmt.type == "checkbox"  ) {
	    return getCheckboxValue(elmt);
	}
	return elmt.value;
    }
    if ( elmt.tagName == "TEXTAREA") {
	return elmt.innerText;
    }
    if ( elmt.className == 'clsRadioGroup' ) {
	return getRadioGroupValue(elmt,elmt.name);
    }
    // Default
    return elmt.innerHTML;
}

function setRadioGroupValue(form,name,value) {
	// form may be a container like div rather than form
	var elements = form.getElementsByTagName('INPUT');
	for(var i=0;i<elements.length;i++) {
		var elmt = elements[i];
		if (elmt.name == name && elmt.value == value ) {
			elmt.checked = true;
			return true;
		}
	}
}

function getRadioGroupValue(form,name) {
	// form may be a container like div rather than form
	var elements = form.getElementsByTagName('INPUT');
	for(var i=0;i<elements.length;i++) {
		var elmt = elements[i];
		if (elmt.name == name && elmt.checked) {
			return elmt.value;
		}
	}
	return undefined;
}

function setCheckboxValue(checkbox,value) {
	var truth = ['true','yes','y','1','t'];
	var checked = false;
	for (var i=0;i<truth.length;i++) {
		if ( value.toUpperCase() == truth[i].toUpperCase() ) {
			checked = true;
		} 
	}
	if ( checked == true ) {
		checkbox.checked = true;
	} else {
		checkbox.checked = false;
	}
}
function getCheckboxValue(checkbox) {
	if ( checkbox.checked == true ) {
		return checkbox.value;
	} else {
		return "";
	}
}
function getBoolboxValue(checkbox) {
	if ( checkbox.checked == true ) {
		return true;
	} else {
		return false;
	}
}

function getOptionValue(dropdown) {
   var myindex=dropdown.selectedIndex;
   return dropdown.options[myindex].value;
}
function setOptionValue(dropdown,value) {
	for(var i=0;i<dropdown.options.length;i++) {
		if ( dropdown.options[i].value == value ) {
			dropdown.selectedIndex = i;
		}
	}
}

function revealHeight(obj,stepSize,interval) {
  var savedHeight = obj.scrollHeight;
  var savedOverflowY = obj.style.overflowY;
  obj.style.height =1;
  obj.style.overflowY = 'hidden';
  
  var timerID = window.setInterval(reveal,interval);
  
  function reveal() {
    var height = obj.clientHeight;
    if ( height < savedHeight ) {
      obj.style.height = height + stepSize;
    } else {
      window.clearInterval(timerID);
      obj.style.overflowY = savedOverflowY;
    }
  }
}

function getPixelLeft(elmt) {
	var left = 0;
	while (elmt.offsetParent ) {
		left += elmt.offsetLeft - elmt.scrollLeft;
		elmt = elmt.offsetParent;
	}
	return left;
}
function getPixelTop(elmt) {
	var top = 0;
	while (elmt.offsetParent) {
		top += elmt.offsetTop - elmt.scrollTop;
		elmt = elmt.offsetParent;
	}
	return top;
}


function formFocus(form) {
	// Find the first control to focus on
	out: {
		for (var i=0;i<form.elements.length;i++) {
			var ctl = form.elements[i];
			try {
				ctl.focus();
				break out;
			} catch(e) {
				var e;
				continue;
			}
		}
	}
}

function focusFirstChild(elmt) {
	// Find the first child to focus on
	out: {
		for (var i=0;i<elmt.children.length;i++) {
			var oChild = elmt.children[i];
			try {
				oChild.focus();
				break out;
			} catch(e) {
				var e;
				continue;
			}
		}
	}
}

function urlSet(url,name,value) {
	var re = /([^\?]+)\??(.*)/;
	re.exec(url);
	var path = RegExp.$1;
	var queryString = RegExp.$2;
	url = path + "?" + urlDataSet(queryString,name,value);
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
}

function urlGet(url,name) {
  var re = /([^\?]+)\??(.*)/;
  re.exec(url);
  var path = RegExp.$1;
  var queryString = RegExp.$2;
  return urlDataGet(queryString,name);
}

function urlDataGet(data,name) {
  var list = new Array();
  var a = new Array();
  var b = new Array();
  var c = new Array();
  
  if ( data != "" ) {
    var a = data.split('&');
  }
  for (var i=0;i<a.length;i++) {
    b = a[i].split('=');
    if (name == decodeURIComponent(b[0].replace(/\+/g,' '))) {
      return decodeURIComponent(b[1].replace(/\+/g,' '));
    }
  }
  return null;
}

function atEditStart(elmt) {
	if (elmt.isContentEditable) {
		var rngSelected = elmt.document.selection.createRange();
		if ( elmt.tagName == 'INPUT' ) {
			var rngElmt = elmt.createTextRange();
		} else {
			var rngElmt = elmt.document.body.createTextRange();
			rngElmt.moveToElementText(elmt);
		}
		if (rngSelected.compareEndPoints("StartToStart",rngElmt)==0) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}
function atEditEnd(elmt) {
	if (elmt.isContentEditable) {
		var rngSelected = elmt.document.selection.createRange();
		if ( elmt.tagName == "INPUT") {
			var rngElmt = elmt.createTextRange();
		} else {
			var rngElmt = elmt.document.body.createTextRange();
			rngElmt.moveToElementText(elmt);
		}
		if (rngSelected.compareEndPoints("EndToEnd",rngElmt)==0) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}
function xmlToChildIDs(xmlDoc,qry,elmt) {
  var rec = xmlDoc.selectSingleNode(qry);
  if ( rec ) {
    for(var i=0;i<rec.childNodes.length;i++) {
      var oNode = rec.childNodes[i];
      var name=oNode.nodeName;
      var value = oNode.text;
      var oObjects = getChildElmtsById(elmt,name);
      for ( var j in oObjects ) {
	setObjectValue(oObjects[j],value);
      }
    }
  }
}

function getChildElementById(elmt,id) {
	var coll = elmt.all.item(id);
	if ( coll == null ) {
		return null;
	}
	if (coll.length != null && coll[0].id == id) {
		return coll[0];
	} else {
		return coll;
	}
}

function getChildElementByTagName(elmt,tagName) {
  var elements = elmt.getElementsByTagName(tagName);
  for(var i=0;i<elements.length;i++) {
    var elmt = elements[i];
    if (elmt.tagName == tagName) {
      return elmt;
    }
  }
}

function getChildElmtsById(elmt,id) {
  var coll = elmt.all.item(id);
  var elmts = new Array();
  if (coll == null) {
    return elmts;
  }
  if (coll.tagName == undefined ) { 
    for(var i=0;i<coll.length;i++) {
      var obj = coll[i];
      if (obj.id == id) {
	elmts.push(obj);
      }
    }
  } else {
    elmts.push(coll);
  }
  return elmts;
}

function xmlToID(xmlDoc,qry,elmt) {
	var rec = xmlDoc.selectSingleNode(qry);
	if ( rec ) {
		var value = rec.text;
		setObjectValue(elmt,value);
	}
}

function hideElementsByTagName(tagName) {
	var elmts = document.body.getElementsByTagName(tagName);
	for(var i=0;i<elmts.length;i++) {
		elmts[i].style.visibility = "hidden";
	}
}

function showElementsByTagName(tagName) {
	var elmts = document.body.getElementsByTagName(tagName);
	for(var i=0;i<elmts.length;i++) {
		elmts[i].style.visibility = "";
	}
}

function getChildElementsWithClassName(elmt,tagName,className) { 
   var nodes = elmt.getElementsByTagName(tagName); 
   var elmts = new Array(); 
   for (var i = 0; i < nodes.length; i++) { 
      if (nodes[i].className == className) { 
         elmts.push(nodes[i]); 
      }
   } 
   return elmts; 
}

function setCookie(name,value,days) {
	if (days) {
		var date=new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires="; expires="+date.toGMTString();
	} 
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
};

function getCookie(name) {
	var nameEQ = name+"=";
	var ca = document.cookie.split(';');
	for(var i=0;i<ca.length;i++) {
		var c=ca[i];
		while (c.charAt(0)==' ') c=c.substring(1,c.length);
		if (c.indexOf(nameEQ)==0) return c.substring(nameEQ.length,c.length);
	}
	return '';
};

function deleteCookie(name) {
	setCookie(name,"",-1);
};

function actionConfirm(oLink) {
	if ( window.confirm('Are you sure you want to ' + oLink.innerText) ) {
		return true;
	} else {
		return false;
	}
}

function stripHTML(html) {
  return html.replace(/<[^>]+>/gi,"");
}

function formEncode(form) {
	var list = new Array;
	for(var i=0;i<form.elements.length;i++) {
		var value = new String;
		var elmt = form.elements[i];
		var name = elmt.name;
		out: {
			 if (elmt.tagName=="INPUT") {
				if ( elmt.type == "checkbox" ) {
					value = getCheckboxValue(elmt);
					break out;
				} 	
				value = elmt.value
				break out;
			}
			if ( elmt.tagName == "TEXTAREA") {
				value = elmt.value
				break out;
			}
			if (elmt.tagName=="SELECT") {
				value = getOptionValue(elmt)
				break out;
			}
			// Default
			value = elmt.value;
		}
		if ( name != "" ) {
			list.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
		}
	}
	return list.join("&");
}

function formCall(oForm,url,handler) {
	if ( handler == undefined ) {
		handler = formCallReturn;
	}
	var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	xmlhttp.Open("POST",url,false);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) handler(oForm,xmlhttp);
    }
	xmlhttp.Send(formEncode(oForm));
}

function formCallReturn(oForm,xmlhttp) {
	var xmlDoc = xmlhttp.responseXML;
	var error;
	// HTTP ERROR
	if ( xmlhttp.status != 200 ) {
		error = "Error ! Expected response 200 but got " + xmlhttp.status;
		setState('error');
		setStatus(error);
		alert(error);
	}
	// XML ERROR
	var xmlError = xmlDoc.parseError;
	if (xmlError.errorCode != 0) {
		error = "Error ! " + xmlError.reason;
		alert("We have a problem.\n" + error);
	} else {
		// USER ERROR
		var rec = xmlDoc.selectSingleNode('error');
		if ( rec ) {
			error=rec.text;
			alert("We have a problem..\n\n" + stripHTML(error));
		} else {
			// form
			xmlToChildIDs(xmlDoc,'records/record',oForm);
			// html
			xmlToChildIDs(xmlDoc,'records/html',oForm.document);	
			if ( oForm.onFormActionReturn != undefined ) {
				oForm.onFormActionReturn(action);
			}
		}
	}
}

function httpPost(url,data,handler,errorHandler,async,type,elmt) {
  if ( window.XMLHttpRequest ) {
    var xmlhttp = new XMLHttpRequest();
  } else {
    var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  }
  xmlhttp.open("POST",url,async);
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var errorMessage;
	
			// HTTP ERROR
			if ( xmlhttp.status != 200 && xmlhttp.status != 0 ) {
				errorMessage = "Error ! Expected response 200 but got " + xmlhttp.status;
				return errorHandler(errorMessage,'HTTP',type,elmt);
			}
			// XML ERROR
			var xmlDoc = xmlhttp.responseXML;
			var xmlError = xmlDoc.parseError;
			if (xmlError.errorCode != 0) {
				errorMessage = xmlError.reason;
				return errorHandler(errorMessage,'XML',type,elmt);
			}
			// USER ERROR
			var rec = xmlDoc.selectSingleNode('error');
			if ( rec ) {
				var errorMessage = rec.text;
				return errorHandler(errorMessage,'USER',type,elmt);
			}
			// NORMAL COMPLETION
			handler(xmlhttp,type,elmt);
		}
    }
	
	xmlhttp.send(data);
}

function httpGet(url,handler,errorHandler,async,type,elmt) {
    if ( window.XMLHttpRequest ) {
	var xmlhttp = new XMLHttpRequest();
    } else {
	var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    xmlhttp.open("GET",url,async);
	
    xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4) {
	    var errorMessage;
	
	    // HTTP ERROR
	    if ( xmlhttp.status != 200 && xmlhttp.status != 0 ) {
		errorMessage = "Error ! Expected response 200 but got " + xmlhttp.status;
		return errorHandler(errorMessage,'HTTP',type,elmt);
	    }
	    // XML ERROR
	    var xmlDoc = xmlhttp.responseXML;
	    var xmlError = xmlDoc.parseError;
	    if (xmlError.errorCode != 0) {
		errorMessage = xmlError.reason;
		return errorHandler(errorMessage,'XML',type,elmt);
	    }
	    // USER ERROR
	    var rec = xmlDoc.selectSingleNode('error');
	    if ( rec ) {
		var errorMessage = rec.text;
		return errorHandler(errorMessage,'USER',type,elmt);
	    }
	    // NORMAL COMPLETION
	    handler(xmlhttp,type,elmt);
	}
    }
    xmlhttp.send();
}

function fetch(url,data,handler,errorHandler,async,oCallback) {
	//var xmlhttp = new XMLHttpRequest();
	var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	xmlhttp.open("POST",url,async);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var errorMessage;

			// HTTP ERROR
			if ( xmlhttp.status != 200 && xmlhttp.status != 0 ) {
				errorMessage = "Error ! Expected response 200 but got " + xmlhttp.status;
				return errorHandler(errorMessage,'HTTP',oCallback);
			}
			// NORMAL COMPLETION
			handler(xmlhttp.responseText,oCallback);
		}
	}
    xmlhttp.send(data);
}

function escapeHTML(str) {
	return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&#34;").replace(/\'/g,"&#39;");
}
function unescapeHTML(str) {
	return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
}

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


/* ==== dbCellHTMLArea.js ==== */
function dbCellHTMLArea(callback) {

// vars
var oHTMLArea;
var callback;

// Init
oHTMLArea = document.createElement('DIV');
oHTMLArea.contentEditable = true;
oHTMLArea.style.position = 'absolute';
oHTMLArea.style.visibility = 'hidden';

oHTMLArea.attachEvent('onkeydown',inputOnKeyDown);
oHTMLArea.attachEvent('onkeyup',inputOnKeyUp);

// Set up handlers
oHTMLArea.getType = getType;
oHTMLArea.getValue = getValue;
oHTMLArea.show = show;
oHTMLArea.hide = hide;
oHTMLArea.selectText = selectText;
oHTMLArea.destroy = destroy;

return oHTMLArea;

function getType() {
	return 'htmlarea';
}

function getValue() {
	return oHTMLArea.innerHTML;
}

function selectText(option) {
	var rng = document.body.createTextRange();
	rng.moveToElementText(oHTMLArea);
	if ( option == undefined || option == 'end') {
		rng.collapse(false);
		rng.select();
	}
	if ( option == 'start' ) {
		rng.collapse(true);
		rng.select();
	}
	if ( option == 'all' ) {
		rng.select();
	}
}

 function show(oCell,value,editorHeight) {
   oHTMLArea.style.borderWidth = oCell.currentStyle.borderWidth;
   oHTMLArea.style.borderStyle = oCell.currentStyle.borderStyle;
   oHTMLArea.style.borderColor = oCell.currentStyle.borderColor;
  
   oHTMLArea.style.marginTop = oCell.currentStyle.marginTop;
   oHTMLArea.style.marginRight = oCell.currentStyle.marginRight;
   oHTMLArea.style.marginBottom = oCell.currentStyle.marginBottom;
   oHTMLArea.style.marginLeft = oCell.currentStyle.marginLeft;
  
   oHTMLArea.style.paddingTop = oCell.currentStyle.paddingTop;
   oHTMLArea.style.paddingRight = oCell.currentStyle.paddingRight;
   oHTMLArea.style.paddingBottom = oCell.currentStyle.paddingBottom;
   oHTMLArea.style.paddingLeft = oCell.currentStyle.paddingLeft;
	
   oHTMLArea.style.textAlign = oCell.currentStyle.textAlign;
   oHTMLArea.style.verticalAlign = oCell.currentStyle.verticalAlign;
   oHTMLArea.style.fontSize = oCell.currentStyle.fontSize;
   oHTMLArea.style.fontFamily = oCell.currentStyle.fontFamily;
   if ( oCell.currentStyle.backgroundColor=='transparent' )	{
     oHTMLArea.style.backgroundColor='white';
   } else {
     oHTMLArea.style.backgroundColor=oCell.currentStyle.backgroundColor;
   }
	
   if ( editorHeight == undefined ) {
     oHTMLArea.style.pixelWidth = oCell.offsetWidth;
     oHTMLArea.style.pixelHeight = oCell.offsetHeight;
   } else {
     oHTMLArea.style.pixelWidth = oCell.offsetWidth;
     oHTMLArea.style.pixelHeight = editorHeight;
   }
   oHTMLArea.style.pixelTop = getContainerPixelTop(oCell);
   oHTMLArea.style.pixelLeft = getContainerPixelLeft(oCell);
	
   oHTMLArea.style.visibility = 'visible';
   oHTMLArea.innerHTML = value;
 }

function hide() {
	oHTMLArea.style.visibility = 'hidden';
}

function inputOnKeyDown() {
	// decide whether to propagate the event to the cell
	// using the callback function passed in
	var e = window.event;
	out: {
		if (e.keyCode == 9 || e.keyCode == 46) {
			// TAB or Delete
			callback(e)
			break out;
		}
		if (e.keyCode == 13 && ! e.shiftKey) {
			// Return no shift
			callback(e)
			break out;
		}
		if (e.keyCode == 37 && atEditStart(oHTMLArea)) {
			// Left Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 38 && atEditStart(oHTMLArea)) {
			// Up Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 39 && atEditEnd(oHTMLArea)) {
			// Right Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 40 && atEditEnd(oHTMLArea)) {
			// Down Arrow
			callback(e);
			break out;
		}
		if ( e.keyCode == 83 && e.ctrlKey ) {
			// Ctrl+S
			callback(e);
			break out;
		}
		
		// Default 
		// don't propagate
	}
}

function inputOnKeyUp() {
	// allways propagate
	var e = window.event;
	callback(e);
}

function getContainerPixelLeft(elem) {
	var left = 0;
	while (elem.tagName != 'DIV' && elem.tagName !='BODY') {
		left += elem.offsetLeft - elem.scrollLeft;
		elem = elem.offsetParent;
	}
	return left;
}
function getContainerPixelTop(elem) {
	var top = 0;
	while (elem.tagName != 'DIV' && elem.tagName !='BODY') {
		top += elem.offsetTop - elem.scrollTop;
		elem = elem.offsetParent;
	}
	return top;
}

function destroy() {
	oHTMLArea.removeNode(true);
}

//
}


/* ==== dbCellInput.js ==== */
function dbCellInput(callback) {

// vars
var oInput;
var callback;

// Init
oInput = document.createElement('INPUT');
oInput.type='text';
oInput.style.position = 'absolute';
oInput.style.visibility = 'hidden';
oInput.style.backgroundColor='white';
// this changes how the input box copes with overflow
oInput.style.overflow='visible';
oInput.style.zIndex=1;

oInput.attachEvent('onkeydown',inputOnKeyDown);
oInput.attachEvent('onkeyup',inputOnKeyUp);
oInput.attachEvent('oncut',inputOnCut);
oInput.attachEvent('onpaste',inputOnPaste);
oInput.attachEvent('onblur',inputOnBlur);

// Set up handlers
oInput.getType = getType;
oInput.getValue = getValue;
oInput.show = show;
oInput.hide = hide;
oInput.selectText = selectText;
oInput.destroy = destroy;

var bookmark;
var lastValue;
return oInput;

function getType() {
	return 'text';
}

function getValue() {
	return oInput.value;
}

function selectText(option) {
  var rng = oInput.createTextRange();
  if ( option == 'end') {
    rng.collapse(false);
    rng.select();
  }
  if ( option == 'start' ) {
    rng.collapse(true);
    rng.select();
  }
  if ( option == 'preserve' && bookmark) {
    if (lastValue==getValue()) {
      rng.moveToBookmark(bookmark);
    } else {
      // move to end
      rng.collapse(false);
    }
    rng.select();
  }
  if (option == undefined || option == 'all') {
    rng.select();
  }

  storeSelection();
}

function show(oCell,value) {
  var attributes = new Array();
  attributes.push('borderTopWidth','borderTopStyle','borderTopColor');
  attributes.push('borderBottomWidth','borderBottomStyle','borderBottomColor');
  attributes.push('borderLeftWidth','borderLeftStyle','borderLeftColor');
  attributes.push('borderRightWidth','borderRightStyle','borderRightColor');
  attributes.push('marginTop','marginRight','marginBottom','marginLeft');
  attributes.push('paddingTop','paddingRight','paddingBottom','paddingLeft');
  attributes.push('textAlign','verticalAlign','fontSize','fontFamily','fontWeight');

  for (var i=0;i<attributes.length;i++) {
    var name = attributes[i];
    oInput.style.setAttribute(name,oCell.currentStyle.getAttribute(name));
  }
  if ( oCell.currentStyle.backgroundColor=='transparent' )	{
    oInput.style.backgroundColor='white';
  } else {
    oInput.style.backgroundColor=oCell.currentStyle.backgroundColor;
  }	
  
  oInput.style.width = oCell.offsetWidth;
  oInput.style.height = oCell.offsetHeight;
  
  oInput.style.top = getPixelTop(oCell)-getPixelTop(oInput.offsetParent)+2;
  oInput.style.left = getPixelLeft(oCell)-getPixelLeft(oInput.offsetParent)+2;
  
  oInput.style.visibility = 'visible';
  oInput.value = value;
}

function hide() {
  oInput.blur();
  oInput.style.visibility = 'hidden';
}

function inputOnKeyDown() {
  // decide whether to propagate the event to the cell
  // using the callback function passed in
  var e = window.event;
 out: {
    if (e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 46) {
      // TAB or Return or Delete
      callback(e)
	break out;
    }
    if (e.keyCode == 37 && atEditStart(oInput)) {
      // Left Arrow
      callback(e);
      break out;
    }
    if (e.keyCode == 38) {
      // Up Arrow
      callback(e);
      break out;
    }
    if (e.keyCode == 39 && atEditEnd(oInput) ) {
      // Right Arrow
      callback(e);
      break out;
    }
    if (e.keyCode == 40) {
      // Down Arrow
      callback(e);
      break out;
    }
    if ( e.keyCode == 83 && e.ctrlKey ) {
      // Ctrl+S
      callback(e);
      break out;
    }
    // Default 
    // don't propagate
  }
}

function inputOnKeyUp() {
  // allways propagate
  var e = window.event;
  callback(e);
  storeSelection();
}

function inputOnCut() {
  var e = window.event;
  callback(e);
  storeSelection();
}

function inputOnPaste() {
  var e = window.event;
  callback(e);
  storeSelection();
}

function inputOnBlur() {
  var e = window.event;
  callback(e);
}

function destroy() {
  oInput.removeNode(true);
}

function storeSelection() {
  var currentRange=document.selection.createRange();
  bookmark = currentRange.getBookmark();
  lastValue=getValue();
 }

//
}


/* ==== dbForm.js ==== */
function dbForm(oForm) { 

// Methods
oForm.save=save;
oForm.formAction = formAction;
oForm.focus = focus;
oForm.nav=nav;
oForm.find=find;
oForm.del=del;

// Parameters
if (oForm.formType == undefined) { oForm.formType = 'update' } 
if (oForm.enabled == undefined) { oForm.enabled = "true" }
if (oForm.checkOnExit == undefined) { oForm.checkOnExit = "true" }
if (oForm.initialFocus == undefined) { oForm.initialFocus = "true" }
// vars
var state;
var error;
var oDivStatus;
var elmts=new Array;

// Events onFormActionReturn

// Init
init();
//

function init() {
  // defaults;
  state = 'current';
  
  // Find the form's status div
  var divs = oForm.getElementsByTagName('DIV');
  for(var i=0;i<divs.length;i++) {
    var oDiv = divs[i];
    if ( oDiv.className == 'clsDbFormDivStatus') {
      oDivStatus = oDiv;
    }
  }
  
  var e = oForm.getElementsByTagName('INPUT');
  for(var i=0;i<e.length;i++) {
    elmts.push(e[i]);
  }
  
  var e = oForm.getElementsByTagName('SELECT');
  for(var i=0;i<e.length;i++) {
    elmts.push(e[i]);
  }
  
  var e = oForm.getElementsByTagName('TEXTAREA');
  for(var i=0;i<e.length;i++) {
    elmts.push(e[i]);
  }
  
  var e = oForm.getElementsByTagName('DIV');
  for(var i=0;i<e.length;i++) {
    if ( e[i].className == 'clsDbFormHTMLArea' || e[i].className == 'clsRadioGroup' ) {
      elmts.push(e[i]);
    }
  }
  
  if ( oForm.dataURL !=undefined ) {
    formAction('requery',oForm.dataURL);
  }
  if ( oForm.qryURL !=undefined ) {
    nav('FIRST');
  }
  // Look for dropdowns and attach onchange behavior
  for(var i=0;i<elmts.length;i++) {
    var elmt = elmts[i];
    if (elmt.tagName=='SELECT') {
      elmt.attachEvent('onchange',setDirty);
    }
    if (elmt.tagName=='INPUT' && elmt.type=='checkbox') {
      elmt.attachEvent('onclick',setDirty);
    }
    if (elmt.tagName=='INPUT' && elmt.type=='radio') {
      elmt.attachEvent('onclick',setDirty);
    }
  }
  
  // document unload
  if ( oForm.checkOnExit == "true" && oForm.formType=="update") {
    window.attachEvent('onbeforeunload',onBeforeUnload);
  }
  oForm.attachEvent('onkeydown',onKeyDown);
  oForm.attachEvent('onkeypress',onKeyPress);
  oForm.attachEvent('onsubmit',onSubmit);
  if ( oForm.initialFocus == "true" ) {
    focus();
  }
  if (oForm.initialFind!=undefined) {
      var name=oForm.initialFind.split('=')[0];
      var value=oForm.initialFind.split('=')[1];
      find(name,value);
  }
}
 
function focus() {
   // Find the first control to focus on
 out: {
   for (var i=0;i<oForm.elements.length;i++) {
     var ctl = oForm.elements[i];
     try {
       ctl.focus();
       break out;
     } catch(e) {
       var e;
       continue;
     }
   }
 }
 }

function onBeforeUnload() {
   if ( state == 'dirty' ) {
     if (window.confirm('Do you want to save your changes?')) {
       save();
       if (state == 'error' ) {
	 event.returnValue = "Your changes could not been saved.\nStay on the current page to correct.";
       }
     }
   }
   oForm.save=undefined;
   oForm.formAction=undefined;
   oForm.focus=undefined;
}

function onSubmit() {
  if ( oForm.formType == 'submit' ) {
    return true;
  }
  return false;
}

function onKeyDown() {
  var e = window.event;
  if ( e.keyCode == 83 && e.ctrlKey ) {
    // Ctrl+S
    save();
    e.returnValue = false;
  }
  // Backspace
  if ( e.keyCode == 8) {
    setState('dirty');
  }
}

function onKeyPress() {
  setState('dirty');
}

function setDirty() {
  setState('dirty');
}

function setState(newState) {
 out: {
   if ( newState == 'dirty' ) {
     var span ='<span style="color:blue;cursor:hand;text-decoration:underline" onclick="' + oForm.id + '.save()">save</span>';
     setStatus('Editing ... To ' + span + ' type Ctrl+S');
     if ( oForm.nav_new) {
       if ( oForm.addURL ) {
	 oForm.nav_new.disabled=false;
       } else {
	 oForm.nav_new.disabled=true;
       }
     }
     if ( oForm.nav_prev ) {
       oForm.nav_prev.disabled=false;
       oForm.nav_next.disabled=false;
     }
     break out;
   }
   if ( newState == 'updating' ) {
     setStatus('Updating ...');
     break out;
   }
   if ( newState == 'current' ) {
     if ( state =='updating' ) {
       setStatus('Saved.');
     } else if (state=='loading') {
       setStatus('');
     } else if (state=='deleting') {
       setStatus('Deleted.');
     } else {
       setStatus('');
     }
     break out;
   }
   if ( newState == 'error' ) {
     break out;
   }
 }
 state = newState;
}

function save(async) {
  if ( oForm.formType == 'update' ) {
    setState('updating');
    formAction('update',oForm.updateURL);
  }
  if ( oForm.formType == 'add' ) {
    setState('updating');
    formAction('add',oForm.addURL);
  }
  if ( oForm.formType == 'submit' ) {
    // oForm submit
    oForm.action = oForm.submitURL;		
    for(var i=0;i<elmts.length;i++) {
      var elmt = elmts[i];
      if ( elmt.tagName=='DIV' && elmt.className == 'clsDbFormHTMLArea' ) {
	var oInput = document.createElement('INPUT');
	oInput.type='hidden';
	oInput.name = elmt.name;
	oInput.value= elmt.innerHTML;
	oForm.appendChild(oInput);
      }
      if ( elmt.tagName=='INPUT' && elmt.type == 'checkbox' && elmt.boolean && elmt.checked!=true) {
	var oInput = document.createElement('INPUT');
	oInput.type='hidden';
	oInput.name = elmt.name;
	oInput.value= "false";
	oForm.appendChild(oInput);
      }
    }
    oForm.submit();
  }
}

function del() {
  if ( window.confirm('Delete the current record?') ) {
    setState('deleting');
    formAction('delete',oForm.deleteURL);
  }
}

function nav(navTo) {
   oForm.navTo.value = navTo;
   if ( state=='dirty' ) {
     save();
   } else {
     setState('loading');
     formAction('qry',oForm.qryURL);
   }
}

function find(name,value) {
  if ( state=='dirty' ) {
    save();
  } else {
    setState('loading');
  }
  handler = formActionReturn;
  var url = oForm.searchURL;
  var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  xmlhttp.Open("POST",url,false);
  var action = new Object;
  action.type = 'search';
  action.xmlhttp = xmlhttp;
  
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) handler(action);
  }
  var data = encodeURIComponent(name) + "=" + encodeURIComponent(value)
  xmlhttp.Send(data);
}

function formAction(type,url,handler,async) {
  if ( handler == undefined ) {
    handler = formActionReturn;
  }
  if ( async == undefined ) {
    async = false;
  }
  var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  xmlhttp.Open("POST",url,async);
  var action = new Object;
  action.type = type;
  action.xmlhttp = xmlhttp;
  
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) handler(action);
  }
  xmlhttp.Send(formEncode(oForm));
}


function formActionReturn(action) {
  var xmlhttp = action.xmlhttp;	
  var type = action.type;
  var xmlDoc = xmlhttp.responseXML;
  var error;
  // HTTP ERROR
  if ( xmlhttp.status != 200 ) {
    error = "Error ! Expected response 200 but got " + xmlhttp.status;
    setState('error');
    setStatus(error);
    alert("Your changes could not be saved.\n" + error);
    return false;
  }
  // XML ERROR
  var xmlError = xmlDoc.parseError;
  if (xmlError.errorCode != 0) {
    error = "Error ! " + xmlError.reason;
    setState('error');
    setStatus(error);
    alert("Your changes could not be saved.\n" + error);
    return false;
  }
  // USER ERROR
  var rec = xmlDoc.selectSingleNode('error');
  if ( rec ) {
    error=rec.text;
    setState('error');
    setStatus(error);
    alert("Your changes could not be saved.\n\n" + stripHTML(error));
    return false;
  }
  // NORMAL COMPLETION
  // form
  xmlToChildIDs(xmlDoc,'records/record',oForm);
  // html
  xmlToChildIDs(xmlDoc,'records/html',oForm.document);
  
  if ( type == 'update' || type== 'add' ||  type== 'delete' || type=='qry') {
    setState('current');
  }
  
  // Info
  var rec = xmlDoc.selectSingleNode('records/info');
  if ( rec ) {
    setStatus(rec.text);
  }
  // Alert
  var rec = xmlDoc.selectSingleNode('records/alert');
  if ( rec ) {
    alert(rec.text);
  }
  // Nav
  if ( oForm.recordsLength && oForm.recordNumber) {
    var recordsLength =  oForm.recordsLength.value;
    var recordNumber = oForm.recordNumber.value;
    if ( recordNumber==1 ) {
      oForm.nav_first.disabled=true;
      oForm.nav_prev.disabled=true;
    } else {
      oForm.nav_first.disabled=false;
      oForm.nav_prev.disabled=false;
    }
    if ( recordNumber==recordsLength ) {
      oForm.nav_last.disabled=true;
      oForm.nav_next.disabled=true;
    } else {
      oForm.nav_last.disabled=false;
      oForm.nav_next.disabled=false;
    }
    if ( recordNumber==0 ) {
      // New Record
      oForm.formType='add';
      oForm.nav_new.disabled=true;
      oForm.nav_prev.disabled=true;
      oForm.nav_next.disabled=true;
      oForm.nav_del.disabled=true;
    } else {
       oForm.formType='update';
       if ( oForm.addURL ) {
	 oForm.nav_new.disabled=false;
       } else {
	 oForm.nav_new.disabled=true;
       }
       if ( oForm.deleteURL ) {
	 oForm.nav_del.disabled=false;
       } else {
	 oForm.nav_del.disabled=true;
       }
    }
    document.getElementById('recordIndicator').innerHTML=recordNumber + ' of ' + recordsLength;
    oForm.navTo.value='HERE';
  }
  // Event onFormActionReturn
  if ( oForm.onFormActionReturn != undefined ) {
    oForm.onFormActionReturn(action);
  }
}

// Status Message
function setStatus(msg) {
  if ( oDivStatus != undefined ) {
    setObjectValue(oDivStatus,msg);
  }
}

function formEncode(form) {
  var list = new Array;
  for(var i=0;i<elmts.length;i++) {
    var value = new String;
    var elmt = elmts[i];
    var name = elmt.name;
    if (name == "") { continue }
    if (elmt.type == "checkbox" && elmt.boolean!="true" && !elmt.checked) { continue }
    if (elmt.type == "radio" && !elmt.checked) { continue }
    if (elmt.tagName=="DIV" && elmt.className=='clsRadioGroup') {
      // The value is found under INPUT's of type radio
      continue;
    }
  out: {
      if (elmt.tagName=="INPUT") {
	if ( elmt.type == "checkbox" ) {
	  if ( elmt.boolean ) {
	    value = getBoolboxValue(elmt);
	  } else {
	    value = getCheckboxValue(elmt);
	  }
	  break out;
	} 	
	value = elmt.value
	  break out;
      }
      if ( elmt.tagName == "TEXTAREA") {
	value = elmt.value
	  break out;
      }
      if (elmt.tagName=="SELECT") {
	value = getOptionValue(elmt)
	  break out;
      }
      
      // Default
      value = elmt.innerHTML;
    }
    list.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
  }
  return list.join("&");
}

//
}


/* ==== dbFormHTMLArea.js ==== */
function dbFormHTMLArea(oDiv) {

var oDiv;
var oForm = getContainingElmt(oDiv,'FORM');
oForm.attachEvent('onsubmit',onSubmit);

function onSubmit() {
	var oInput = document.createElement('INPUT');
	oInput.type='hidden';
	oInput.name = oDiv.name;
	oInput.value= oDiv.innerHTML;
	oForm.appendChild(oInput);
}

// End 
}

/* ==== dbGridCombo.js ==== */
// DbGridCombo Class Constructor 
var DbGridCombo = function(callback, container) {
  var dbGridCombo = this;
  
  var combo = jQuery('<input>');
  combo.attr('type','text');
  combo.css({
    'position':'absolute',
    'visibility':'hidden'
  });
  container.append(combo);

  var comboDiv = jQuery('<div>');
  comboDiv.css({
    'border-width':'1px',
    'border-style':'solid',
    'border-color':'black',
    'background-color':'white',
    'position':'absolute',
    'overflow':'auto',
    'visibility':'hidden'
  });
  container.append(comboDiv);


  // Public Properties
  dbGridCombo.callback = callback;
  dbGridCombo.combo = combo;
  dbGridCombo.comboDiv = comboDiv; // The dropdown container
  dbGridCombo.xmlDoc;
  dbGridCombo.currentItem = jQuery([]); // The highlighted row selected
  dbGridCombo.lastValue;
  dbGridCombo._name;
  dbGridCombo._value;
  dbGridCombo._boundValue;
  dbGridCombo._boundName;
  dbGridCombo._searchURL;

  // Events  	
  combo.on('keydown.dbGridCombo', function(e) {
    dbGridCombo.inputOnKeyDown(e);
  });
  combo.on('keyup.dbGridCombo', function(e) {
    dbGridCombo.inputOnKeyUp(e);
  });
  combo.on('blur.dbGridCombo', function(e) {
    dbGridCombo.inputOnBlur(e);
  });
};

/**********************************
 * Public DbGridCombo Methods Start
 **********************************/ 
DbGridCombo.prototype.getType = function() {
  return 'combo';
};
DbGridCombo.prototype.getValue = function() {
  return this._value;
};
DbGridCombo.prototype.getBoundName = function() {
  return this._boundName;
};
DbGridCombo.prototype.getBoundValue = function() {
  return this._boundValue;
};
DbGridCombo.prototype.getElmt = function() {
  return this.combo;
};
DbGridCombo.prototype.show = function(cell,name,value,boundName,boundValue,searchURL) {
  var row = cell.closest('tr');
  var table = row.closest('table');
  var combo = this.combo;
  var comboDiv = this.comboDiv;

  relativePosition = cell.positionRelativeTo(table);
  var top = relativePosition.top;
  var left = relativePosition.left;
  height = cell.height();
  width = cell.width();
  
  if ( cell.css('backgroundColor') != 'transparent' ) {
    backgroundColor = cell.css('background-color');
  } else if ( row.css('background-color') != 'transparent' ) {
    backgroundColor = row.css('background-color');
  } else {
    backgroundColor = 'white';
  }

  var borderTopWidth = parseInt(cell.css('border-top-width'));
  var borderRightWidth = parseInt(cell.css('border-right-width'));
  var borderBottomWidth = parseInt(cell.css('border-bottom-width'));
  var borderLeftWidth = parseInt(cell.css('border-left-width'));

  var borderTopColor = cell.css('border-top-color');
  var borderRightColor = cell.css('border-right-style');
  var borderBottomColor = cell.css('border-bottom-color');
  var borderLeftColor = cell.css('border-left-color');


  if ( table.css('border-collapse') == 'collapse' ) {
    if ( borderTopWidth%2 == 0 ) {
      var borderTopWidth = borderTopWidth/2;
    } else {
      var borderTopWidth = Math.ceil(borderTopWidth/2);
    }
    
    if ( borderRightWidth%2 == 0 ) {
      var borderRightWidth = borderRightWidth/2;
    } else {
      var borderRightWidth = Math.ceil(borderRightWidth/2);
    }

    if ( borderBottomWidth%2 == 0 ) {
      var borderBottomWidth = borderBottomWidth/2;
    } else {
      var borderBottomWidth = Math.ceil(borderBottomWidth/2);
    }

    if ( borderLeftWidth%2 == 0 ) {
      var borderLeftWidth = borderLeftWidth/2;
    } else {
      var borderLeftWidth = Math.ceil(borderLeftWidth/2);
    }

    top -=  borderTopWidth;
    left -= borderLeftWidth;
    height +=  borderTopWidth;
    width +=  borderLeftWidth;
  } 

  var paddingTop = cell.css('padding-top');
  var paddingRight = cell.css('padding-right');
  var paddingBottom = cell.css('padding-bottom');
  var paddingLeft = cell.css('padding-left');

  // get styles applied to td
  var comboStyles = {
    'border-top-width': borderTopWidth,
    'border-right-width': borderRightWidth,
    'border-bottom-width': borderBottomWidth,
    'border-left-width': borderLeftWidth,

    'border-top-style': cell.css('border-top-style'),
    'border-right-style': borderRightColor,
    'border-bottom-style': cell.css('border-bottom-style'),
    'border-left-style': cell.css('border-left-style'),

    'border-top-color': borderTopColor,
    'border-right-color': borderRightColor,
    'border-bottom-color': borderBottomColor,
    'border-left-color': borderLeftColor,

    'margin-top': cell.css('margin-top'),
    'margin-right': cell.css('margin-right'),
    'margin-bottom': cell.css('margin-bottom'),
    'margin-left': cell.css('margin-left'),
    
    'padding-top': paddingTop,
    'padding-right': paddingRight,
    'padding-bottom': paddingBottom,
    'padding-left': paddingLeft,
    
    'text-align': cell.css('text-align'),
    'vertical-align': cell.css('vertical-align'),
    'font-size': cell.css('font-size'),
    'font-family': cell.css('font-family'),

    'top': top,
    'left': left,
    'width': width,
    
    'background-color': backgroundColor,

    'visibility': 'visible'
  };
  // copy td styles onto combo
  combo.css(comboStyles);
  // adjust padding & height css properties to make combo the same height as the cell.
  // If we use only height property we can not vertical align text inside combo element
  var comboVerticalAlign = combo.css('vertical-align')
  if ( comboVerticalAlign == 'top' ) {
    combo.css('padding-bottom', parseInt(cell.css('padding-bottom')) + parseInt(cell.css('height')) - parseInt(combo.css('height')));
  } else if ( comboVerticalAlign == 'bottom' ) {
    combo.css('padding-top', parseInt(cell.css('padding-top')) + parseInt(cell.css('height')) - parseInt(combo.css('height'))) ;
  } else {
    combo.css('height', height);
  }

  var comboDivStyles = {
    'border-top-color': borderTopColor,
    'border-right-color': borderRightColor,
    'border-bottom-color': borderBottomColor,
    'border-left-color': borderLeftColor,

    'padding-right': paddingRight,
    'padding-left': paddingLeft,

    'width': width,
    'height': 150,

    'top': top + height,
    'left': left
  };
  // copy td styles onto comboDiv
  comboDiv.css(comboDivStyles);

  if ( searchURL == undefined ) { throw "searchURL must be defined" }
  if ( boundName == undefined ) { throw "boundName must be defined" }
  if ( name == undefined ) { throw "name must be defined" }
  this._name = name;
  this._value = value;
  this.lastValue = value;
  this._searchURL = searchURL;
  this._boundName = boundName;
  this._boundValue = boundValue;
  
  combo.val(value);
};
DbGridCombo.prototype.hide = function() {
  this.combo.css('visibility','hidden');
  this.comboDiv.css('visibility','hidden');
};
DbGridCombo.prototype.selectText = function(option) {
  if ( option == 'end') {
    this.combo.textrange('set', 'end');
  }
  if ( option == 'start' ) {
    this.combo.textrange('set', 'start');
  }
  if ( option == undefined || option == 'all' ) {
    this.combo.textrange('set', 'all');
  }
};
DbGridCombo.prototype.inputOnKeyDown = function(e) {
  // Decide whether to callback event.
  if ( this.currentItem.size() ) {
    active = true;
  } else {
    active = false;
  } 
  var textrangeData = this.combo.textrange('get');
  if ( e.which == 38 ) {
    // Up Arrow
    if ( active ) {
      var idx = this.currentItem.index();
      if ( idx !=0 ) {
	this.highlight(idx-1);
      }
    } else {
      this.callback(e);
    }
  }
  if ( e.which == 40 ) {
    // Down Arrow
    if ( active ) {
      var idx = this.currentItem.index();
      if ( idx != this.comboDiv.children().size() -1 ) {
	this.highlight(idx+1);
      }
    } else {
      this.callback(e);
    }
  }
  if ( e.which == 37 && textrangeData.selectionAtStart ) {
    // Left Arrow
    this.callback(e);
  }
  if ( e.which == 39 && textrangeData.selectionAtEnd ) {
    // Right Arrow
    this.callback(e);
  }
  if ( e.which == 9 || e.which == 13 ) {
    // TAB or Return
    this.callback(e);
  }
  if ( e.which == 46 ) {
    // Delete
    this.callback(e)
  }
  if ( e.which == 83 && e.ctrlKey ) {
    // Ctrl+S
    this.callback(e);
  }
};
DbGridCombo.prototype.inputOnKeyUp = function(e) {
  if ( this.combo.val() != this.lastValue ) {
    this.lastValue = this.combo.val();
    this.search();
  }
  this.callback(e)  
};
DbGridCombo.prototype.inputOnBlur = function(e) {
  var activeElmt = jQuery(document.activeElement);
  if ( !this.comboDiv.is(activeElmt) && !this.comboDiv.find(activeElmt).size()  ) {
    if ( this.currentItem.size() ) {
      var idx = this.currentItem.index();
      this.select(idx);
      // trigger key up event to set row to dirty
      this.combo.trigger('keyup.dbGridCombo');
    }
    this.comboDivHide();
    this.currentItem = jQuery([]);
  }
};
DbGridCombo.prototype.comboDivHide = function() {
  this.comboDiv.css('visibility','hidden');
  this.currentItem = jQuery([]);
};
DbGridCombo.prototype.comboDivShow = function() {
  this.comboDiv.css({
    'visibility':'visible',
    'display':'block'
  });
};
DbGridCombo.prototype.comboDivOnClick = function(e) {
  var targetElmt = jQuery(e.target);
  if ( !targetElmt.is(this.comboDiv) ) {
    var idx = targetElmt.index();
    this.select(idx);
    // trigger key up event to set row to dirty
    this.combo.trigger('keyup.dbGridCombo');
  }
};
DbGridCombo.prototype.comboDivOnMouseOver = function(e) {
  var targetElmt = jQuery(e.target);
  if ( !targetElmt.is(this.comboDiv) ) {
    var idx = targetElmt.index();
    this.highlight(idx);
  }
};
DbGridCombo.prototype.select = function(idx) {
  this.combo.val(this._value);
  this.lastValue = this._value;
  this.comboDivHide();
  // Move cursor to end of Input
  this.selectText('end');
};
DbGridCombo.prototype.highlight = function(idx) {
  var rec = jQuery('records record', this.xmlDoc).eq(idx);
  this._value = jQuery(this._name + ':first', rec).text();
  this._boundValue = jQuery(this._boundName + ':first', rec).text();

  this.currentItem.css({
    'background-color': '',
    'color':''
  });
  this.currentItem = this.comboDiv.children().eq(idx);
  this.currentItem.css({
    'background-color':'highlight',
    'color':'highlighttext'
  });
};
DbGridCombo.prototype.search = function() {
  //TODO
  dbGridCombo = this;
  comboDiv = dbGridCombo.comboDiv;

  dbGridCombo.currentItem = jQuery([]);
  comboDiv.text("Searching ...");
  dbGridCombo.comboDivShow();

  comboDiv.off('click.dbGridCombo');
  comboDiv.off('mouseover.dbGridCombo');
 
  jQuery.ajax({
    url: dbGridCombo._searchURL,
    data: {
      name: dbGridCombo._name,
      value: dbGridCombo.combo.val(),
      boundName: dbGridCombo._boundName
    },
    dataType: 'xml',
    async: false,
    cache: false,
    success: function(data) {
      dbGridCombo.searchReturn(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      comboDiv.text("Software Bug ! " + textStatus + ': ' + errorThrown);
    }   
  });
};
DbGridCombo.prototype.searchReturn = function(xmlDoc) {
  this.xmlDoc = xmlDoc;
  var rec = jQuery('error:first', xmlDoc);
  if ( rec.size() ) {
    // Error returned by Server
    var error=rec.text;
    this.comboDiv.text(rec.text());
  } else {
    // Success
    var recs = jQuery('records record', xmlDoc);
    if ( recs.size() ) {
      // Matches Found
      this.updateList(recs);
    } else {
      // No Matches
      this.comboDiv.text("No Matches");
      this._value = "";
      this._boundValue = "";
    }
  }
};
DbGridCombo.prototype.updateList = function(recs) {
  dbGridCombo = this;
  comboDiv = dbGridCombo.comboDiv;

  comboDiv.html('');

  comboDiv.on('click.dbGridCombo', function(e) {
    dbGridCombo.comboDivOnClick(e);
  });
  comboDiv.on('mouseover.dbGridCombo', function(e) {
    dbGridCombo.comboDivOnMouseOver(e);
  });
  for(var i=0;i<recs.size();i++) {
    var rec = recs.eq(i);
    for(var j=0;j<rec.children().size();j++) {
      var field = rec.children().eq(j);
      var name= field.prop("nodeName");
      var value = field.text();
      if (name == dbGridCombo._name ) {
	var item = jQuery('<div>');
	item.css({
	  'width': '100%',
	  'cursor': 'pointer'
	});
	item.text(value);
	comboDiv.append(item);
      }
    }
  }
  
  dbGridCombo.currentItem = comboDiv.children().first();
  dbGridCombo.highlight(0);
};
DbGridCombo.prototype.destroy = function() {
  this.combo.remove();
  this.comboDiv.remove();
};
/**********************************
 * Public DbGridCombo Methods End
 **********************************/


/* ==== dbGridHTMLArea.js ==== */
// DbGridHTMLArea Class Constructor
var DbGridHTMLArea = function(callback, container) {
  var dbGridHTMLArea = this;

  var HTMLArea = jQuery('<div>');
  HTMLArea.attr('contentEditable',true);
  HTMLArea.css({
    'position':'absolute',
      'visibility':'hidden'
  });
    HTMLArea.addClass('htmlArea');
  container.append(HTMLArea);

  // Properties
  dbGridHTMLArea.callback = callback;
  dbGridHTMLArea.HTMLArea = HTMLArea;

  // Events
  HTMLArea.on('keyup.dbGridHTMLArea', function(e) {
      dbGridHTMLArea.inputOnKeyUp(e);    
  });
  HTMLArea.on('keydown.dbGridHTMLArea', function(e) {
      dbGridHTMLArea.inputOnKeyDown(e);
  });   
};

/************************************
 * Public DbGridHTMLArea Methods Start
 ************************************/
DbGridHTMLArea.prototype.getType = function() {
  return 'htmlarea';
};
DbGridHTMLArea.prototype.getValue = function() {
  return this.HTMLArea.html();
};
DbGridHTMLArea.prototype.getElmt = function() {
  return this.HTMLArea;
};
DbGridHTMLArea.prototype.inputOnKeyDown = function(e) {
  // decide whether to propagate the event to the cell
  // using the callback function passed in
  var textrangeData = this.HTMLArea.textrange('get'); 
  out: {
    if ( e.which == 9 || e.which == 46 ) {
      // TAB or Delete
      this.callback(e)
      break out;
    }
    if ( e.which == 13 && ! e.shiftKey ) {
      // Return no shift
      this.callback(e)
      break out;
    }
    if ( e.which == 37 && textrangeData.selectionAtStart ) {
      // Left Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 38 && textrangeData.selectionAtStart ) {
      // Up Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 39 && textrangeData.selectionAtEnd ) {
      // Right Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 40 && textrangeData.selectionAtEnd ) {
      // Down Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 83 && e.ctrlKey ) {
      // Ctrl+S
      this.callback(e);
      break out;
    }
    
    // Default 
    // don't propagate
  }
};
DbGridHTMLArea.prototype.inputOnKeyUp = function(e) {
  // allways propagate
  this.callback(e);
};
DbGridHTMLArea.prototype.selectText = function(option) {
  if ( option == undefined || option == 'end') {
    this.HTMLArea.textrange('set', 'end');
  }
  if ( option == 'start' ) {
    this.HTMLArea.textrange('set', 'start');
  }
  if ( option == 'all' ) {
    this.HTMLArea.textrange('set', 'all');
  }
};
DbGridHTMLArea.prototype.show = function(cell,value,editorHeight) {
  var row = cell.closest('tr');
  var table = row.closest('table');
  var HTMLArea = this.HTMLArea;

  var relativePosition = cell.positionRelativeTo(table);
  var top = relativePosition.top;
  var left = relativePosition.left;
  if ( editorHeight == undefined ) {
    height = cell.height();
  } else {
    height = editorHeight;
  }
  width = cell.width();
  
  if ( cell.css('backgroundColor') != 'transparent' ) {
    backgroundColor = cell.css('background-color');
  } else if ( row.css('background-color') != 'transparent' ) {
    backgroundColor = row.css('background-color');
  } else {
    backgroundColor = 'white';
  }

  var borderTopWidth = parseInt(cell.css('border-top-width'));
  var borderRightWidth = parseInt(cell.css('border-right-width'));
  var borderBottomWidth = parseInt(cell.css('border-bottom-width'));
  var borderLeftWidth = parseInt(cell.css('border-left-width'));

  if ( table.css('border-collapse') == 'collapse' ) {
    if ( borderTopWidth%2 == 0 ) {
      var borderTopWidth = borderTopWidth/2;
    } else {
      var borderTopWidth = Math.ceil(borderTopWidth/2);
    }
    
    if ( borderRightWidth%2 == 0 ) {
      var borderRightWidth = borderRightWidth/2;
    } else {
      var borderRightWidth = Math.ceil(borderRightWidth/2);
    }

    if ( borderBottomWidth%2 == 0 ) {
      var borderBottomWidth = borderBottomWidth/2;
    } else {
      var borderBottomWidth = Math.ceil(borderBottomWidth/2);
    }

    if ( borderLeftWidth%2 == 0 ) {
      var borderLeftWidth = borderLeftWidth/2;
    } else {
      var borderLeftWidth = Math.ceil(borderLeftWidth/2);
    }

    top -=  borderTopWidth;
    left -= borderLeftWidth;
    height +=  borderTopWidth;
    width +=  borderLeftWidth;
  } 

  // get styles applied to td
  var styles = {
    'border-top-width': borderTopWidth,
    'border-right-width': borderRightWidth,
    'border-bottom-width': borderBottomWidth,
    'border-left-width': borderLeftWidth,

    'border-top-style': cell.css('border-top-style'),
    'border-right-style': cell.css('border-right-style'),
    'border-bottom-style': cell.css('border-bottom-style'),
    'border-left-style': cell.css('border-left-style'),

    'border-top-color': cell.css('border-top-color'),
    'border-right-color': cell.css('border-right-color'),
    'border-bottom-color': cell.css('border-bottom-color'),
    'border-left-color': cell.css('border-left-color'),

    'margin-top': cell.css('margin-top'),
    'margin-right': cell.css('margin-right'),
    'margin-bottom': cell.css('margin-bottom'),
    'margin-left': cell.css('margin-left'),
    
    'padding-top': cell.css('padding-top'),
    'padding-right': cell.css('padding-right'),
    'padding-bottom': cell.css('padding-bottom'),
    'padding-left': cell.css('padding-left'),
    
    'text-align': cell.css('text-align'),
    'vertical-align': cell.css('vertical-align'),
    'font-size': cell.css('font-size'),
    'font-family': cell.css('font-family'),

    'top': top,
    'left': left,
    'width': width,
    'height': height,

    'background-color': backgroundColor,

    'visibility': 'visible'
  };
  
  // copy td styles onto HTMLArea
  HTMLArea.css(styles);

  HTMLArea.html(value);
};

DbGridHTMLArea.prototype.hide = function() {
  this.HTMLArea.css('visibility','hidden');
};
DbGridHTMLArea.prototype.destroy = function() {
  this.HTMLArea.remove();
};
/**********************************
 * Public DbGridHTMLArea Methods End
 **********************************/



/* ==== dbGridInput.js ==== */
// DbGridInput Class Constructor 
var DbGridInput = function(callback, container) {
  var dbGridInput = this;

  var input = jQuery('<input>');
  input.attr('type','text');
  input.css({
    'position':'absolute',
    'visibility':'hidden',
      'background-color':'white',
      '-moz-box-sizing': "content-box", 
      '-ms-box-sizing': "content-box", 
      'box-sizing': "content-box"
  });
  container.append(input);

  // Properties
  dbGridInput.callback = callback;
  dbGridInput.input = input;
  dbGridInput.bookmark;
 
  // Events
  input.on('keyup.dbGridInput', function(e) {
    dbGridInput.inputOnKeyUp(e)    
  });
  input.on('keydown.dbGridInput', function(e) {
    dbGridInput.inputOnKeyDown(e)
  });
  input.on('cut.dbGridInput', function(e) {
    dbGridInput.inputOnCut(e)    
  });
  input.on('paste.dbGridInput', function(e) {
    dbGridInput.inputOnPaste(e)
  });
  input.on('blur.dbGridInput', function(e) {
    dbGridInput.inputOnBlur(e)
  });
};

/**********************************
 * Public DbGridInput Methods Start
 **********************************/  
DbGridInput.prototype.getType = function() {
  return 'text';
};
DbGridInput.prototype.getValue = function() {
  return this.input.val();
};
DbGridInput.prototype.getElmt = function() {
  return this.input;
};
DbGridInput.prototype.storeSelection = function() {
  this.bookmark = this.input.textrange('get');
};
DbGridInput.prototype.inputOnKeyUp = function(e) {
  // allways propagate
  this.callback(e);
  this.storeSelection();
};
DbGridInput.prototype.inputOnKeyDown = function(e) {
  // decide whether to propagate the event to the cell
  // using the callback function passed in
  var textrangeData = this.input.textrange('get'); 
  out: {
    if ( e.which == 9 || e.which == 13 || e.which == 46 ) {
      // TAB or Return or Delete
      this.callback(e)
      break out;
    }
    if ( e.which == 37 && textrangeData.selectionAtStart ) {
      // Left Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 38 ) {
      // Up Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 39 && textrangeData.selectionAtEnd ) {
      // Right Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 40 ) {
      // Down Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 83 && e.ctrlKey ) {
      // Ctrl+S
      this.callback(e);
      break out;
    }
    // Default 
    // don't propagate
  }
};
DbGridInput.prototype.inputOnCut = function(e) {
  this.callback(e);
  this.storeSelection();
};
DbGridInput.prototype.inputOnPaste = function(e) {
  this.callback(e);
  this.storeSelection();
};
DbGridInput.prototype.inputOnBlur = function(e) {
  this.callback(e);
};
DbGridInput.prototype.selectText = function(option) {
  if ( option == 'end') {
    this.input.textrange('set', 'end');
  }
  if ( option == 'start' ) {
    this.input.textrange('set', 'start');
  }
  if ( option == undefined || option == 'all' ) {
    this.input.textrange('set', 'all');
  }
  if ( option == 'preserve' ) {
    if ( this.bookmark && this.getValue() == this.bookmark.text ) {
      this.input.textrange('set', this.bookmark.selectionStart, this.bookmark.selectionEnd);
    } else {
      this.input.textrange('set','end');
    }
  }
  this.storeSelection();
};
DbGridInput.prototype.show = function(cell,value) {
  var row = cell.closest('tr');
  var table = row.closest('table');
  var input = this.input;

    var relativePosition = cell.positionRelativeTo(table);
  var top = relativePosition.top ;
  var left = relativePosition.left;
    height = cell.height();
    width = cell.width();
  
    if ( cell.css('backgroundColor') != 'transparent' && cell.css('backgroundColor') != "rgba(0, 0, 0, 0)" ) {
    backgroundColor = cell.css('background-color');
  } else if ( row.css('background-color') != 'transparent' && row.css('backgroundColor') != "rgba(0, 0, 0, 0)" ) {
    backgroundColor = row.css('background-color');
  } else {
    backgroundColor = 'white';
  }

  var borderTopWidth = parseInt(cell.css('border-top-width'));
  var borderRightWidth = parseInt(cell.css('border-right-width'));
  var borderBottomWidth = parseInt(cell.css('border-bottom-width'));
  var borderLeftWidth = parseInt(cell.css('border-left-width'));

/*  if ( table.css('border-collapse') == 'collapse' ) {
    if ( borderTopWidth%2 == 0 ) {
      var borderTopWidth = borderTopWidth/2;
    } else {
      var borderTopWidth = Math.ceil(borderTopWidth/2);
    }
    
    if ( borderRightWidth%2 == 0 ) {
      var borderRightWidth = borderRightWidth/2;
    } else {
      var borderRightWidth = Math.ceil(borderRightWidth/2);
    }

    if ( borderBottomWidth%2 == 0 ) {
      var borderBottomWidth = borderBottomWidth/2;
    } else {
      var borderBottomWidth = Math.ceil(borderBottomWidth/2);
    }

    if ( borderLeftWidth%2 == 0 ) {
      var borderLeftWidth = borderLeftWidth/2;
    } else {
      var borderLeftWidth = Math.ceil(borderLeftWidth/2);
    }

    top -=  borderTopWidth;
    left -= borderLeftWidth;
    height +=  borderTopWidth;
    width +=  borderLeftWidth;
  } */
  
  // get styles applied to td
  var styles = {
    'border-top-width': borderTopWidth,
    'border-right-width': borderRightWidth,
    'border-bottom-width': borderBottomWidth,
    'border-left-width': borderLeftWidth,

    'border-top-style': cell.css('border-top-style'),
    'border-right-style': cell.css('border-right-style'),
    'border-bottom-style': cell.css('border-bottom-style'),
    'border-left-style': cell.css('border-left-style'),

    'border-top-color': cell.css('border-top-color'),
    'border-right-color': cell.css('border-right-color'),
    'border-bottom-color': cell.css('border-bottom-color'),
    'border-left-color': cell.css('border-left-color'),

    'margin-top': cell.css('margin-top'),
    'margin-right': cell.css('margin-right'),
    'margin-bottom': cell.css('margin-bottom'),
    'margin-left': cell.css('margin-left'),
    
    'padding-top': cell.css('padding-top'),
    'padding-right': cell.css('padding-right'),
    'padding-bottom': parseInt(cell.css('padding-bottom')),
    'padding-left': cell.css('padding-left'),
    
    'text-align': cell.css('text-align'),
    'vertical-align': cell.css('vertical-align'),
    'font-size': cell.css('font-size'),
    'font-family': cell.css('font-family'),

    'top': top,
    'left': left,
    'width': width,
    
    'background-color': backgroundColor,

    'visibility': 'visible'
  };
  
  // copy td styles onto input
  input.css(styles);

  // adjust padding & height css properties to make input the same height as the cell.
  // If we use only height property we can not vertical align text inside input element
  var inputVerticalAlign = input.css('vertical-align')
  if ( inputVerticalAlign == 'top' ) {
    input.css('padding-bottom', parseInt(cell.css('padding-bottom')) + parseInt(cell.css('height')) - parseInt(input.css('height')));
  } else if ( inputVerticalAlign == 'bottom' ) {
    input.css('padding-top', parseInt(cell.css('padding-top')) + parseInt(cell.css('height')) - parseInt(input.css('height'))) ;
  } else {
    input.css('height', height);
  }

  input.val(value);
};
DbGridInput.prototype.hide = function() {
  this.input.blur();
  this.input.css('visibility','hidden');
};
DbGridInput.prototype.destroy = function() {
  this.input.remove();
};
/**********************************
 * Public DbGridInput Methods End
 **********************************/

/* ==== dbGridInputBool.js ==== */
// DbGridInputBool Class Constructor 
var DbGridInputBool = function(callback, container) {
  var dbGridInputBool = this;

  var inputBool = jQuery('<div>');
  inputBool.attr('contentEditable',true);
  inputBool.css({
    'position':'absolute',
    'visibility':'hidden'
  });
  container.append(inputBool);

  // Properties
  dbGridInputBool.callback = callback;
  dbGridInputBool.inputBool = inputBool;
  
  // Events
  inputBool.on('keyup.dbGridInputBool', function(e) {
    dbGridInputBool.inputOnKeyUp(e)    
  });
  inputBool.on('keydown.dbGridInputBool', function(e) {
    dbGridInputBool.inputOnKeyDown(e)
  }); 
};

/************************************
 * Public DbGridInputBool Methods Start
 ************************************/
DbGridInputBool.prototype.getType = function() {
  return 'bool';
};
DbGridInputBool.prototype.getValue = function() {
  return parseBoolean(stripHTML(this.inputBool.html()));
};
DbGridInputBool.prototype.getElmt = function() {
  return this.inputBool;
};
DbGridInputBool.prototype.setTrue = function() {
  this.inputBool.html('<span class=clsTrue>Yes</span>');
};
DbGridInputBool.prototype.setFalse = function() {
  this.inputBool.html('<span class=clsFalse>No</span>');
};
DbGridInputBool.prototype.inputOnKeyDown = function(e) {
  // decide whether to propagate the event to the cell
  // using the callback function passed in
  var textrangeData = this.inputBool.textrange('get'); 
  out: {
    if ( e.which == 9 || e.which == 46 ) {
      // TAB or Delete
      this.callback(e)
      break out;
    }
    if ( e.which == 13 && ! e.shiftKey ) {
      // Return no shift
      this.callback(e)
      break out;
    }
    if ( e.which == 37 && textrangeData.selectionAtStart ) {
      // Left Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 38 && textrangeData.selectionAtStart ) {
      // Up Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 39 && textrangeData.selectionAtEnd ) {
      // Right Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 40 && textrangeData.selectionAtEnd ) {
      // Down Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 83 && e.ctrlKey ) {
      // Ctrl+S
      this.callback(e);
      break out;
    }
    // Default 
    // don't propagate
  }
};
DbGridInputBool.prototype.inputOnKeyUp = function(e) {
  out: {
    if ( e.which == 32 ) {
      // Spacebar
      if ( parseBoolean(stripHTML(oHTMLArea.innerHTML))) {
	this.setFalse();
      } else {
	this.setTrue();
      }
      break out;
    }
    
    if (  e.which==97 || e.which==49 || e.which==84 || e.which==89 ) {
      // keypad 1 or 1 or t or y
      this.setTrue();
      break out;
    }
    if (  e.which==96 || e.which==48 || e.which==70 || e.which==78 ) {
      // 0 or f or n
      this.setFalse();
      break out;
    }
  }
  // allways propagate
  this.callback(e);
};
DbGridInputBool.prototype.selectText = function(option) {
  if ( option == undefined || option == 'end') {
    this.inputBool.textrange('set', 'end');
  }
  if ( option == 'start' ) {
    this.inputBool.textrange('set', 'start');
  }
  if ( option == 'all' ) {
    this.inputBool.textrange('set', 'all');
  }
};
DbGridInputBool.prototype.show = function(cell,value) {
  var row = cell.closest('tr');
  var table = row.closest('table');
  var inputBool = this.inputBool;

  var relativePosition = cell.positionRelativeTo(table);
  var top = relativePosition.top;
  var left = relativePosition.left;
  height = cell.height();
  width = cell.width();
  
  if ( cell.css('backgroundColor') != 'transparent' ) {
    backgroundColor = cell.css('background-color');
  } else if ( row.css('background-color') != 'transparent' ) {
    backgroundColor = row.css('background-color');
  } else {
    backgroundColor = 'white';
  }

  var borderTopWidth = parseInt(cell.css('border-top-width'));
  var borderRightWidth = parseInt(cell.css('border-right-width'));
  var borderBottomWidth = parseInt(cell.css('border-bottom-width'));
  var borderLeftWidth = parseInt(cell.css('border-left-width'));

  if ( table.css('border-collapse') == 'collapse' ) {
    if ( borderTopWidth%2 == 0 ) {
      var borderTopWidth = borderTopWidth/2;
    } else {
      var borderTopWidth = Math.ceil(borderTopWidth/2);
    }
    
    if ( borderRightWidth%2 == 0 ) {
      var borderRightWidth = borderRightWidth/2;
    } else {
      var borderRightWidth = Math.ceil(borderRightWidth/2);
    }

    if ( borderBottomWidth%2 == 0 ) {
      var borderBottomWidth = borderBottomWidth/2;
    } else {
      var borderBottomWidth = Math.ceil(borderBottomWidth/2);
    }

    if ( borderLeftWidth%2 == 0 ) {
      var borderLeftWidth = borderLeftWidth/2;
    } else {
      var borderLeftWidth = Math.ceil(borderLeftWidth/2);
    }

    top -=  borderTopWidth;
    left -= borderLeftWidth;
    height +=  borderTopWidth;
    width +=  borderLeftWidth;
  } 

  // get styles applied to td
  var styles = {
    'border-top-width': borderTopWidth,
    'border-right-width': borderRightWidth,
    'border-bottom-width': borderBottomWidth,
    'border-left-width': borderLeftWidth,

    'border-top-style': cell.css('border-top-style'),
    'border-right-style': cell.css('border-right-style'),
    'border-bottom-style': cell.css('border-bottom-style'),
    'border-left-style': cell.css('border-left-style'),

    'border-top-color': cell.css('border-top-color'),
    'border-right-color': cell.css('border-right-color'),
    'border-bottom-color': cell.css('border-bottom-color'),
    'border-left-color': cell.css('border-left-color'),

    'margin-top': cell.css('margin-top'),
    'margin-right': cell.css('margin-right'),
    'margin-bottom': cell.css('margin-bottom'),
    'margin-left': cell.css('margin-left'),
    
    'padding-top': cell.css('padding-top'),
    'padding-right': cell.css('padding-right'),
    'padding-bottom': cell.css('padding-bottom'),
    'padding-left': cell.css('padding-left'),
    
    'text-align': cell.css('text-align'),
    'vertical-align': cell.css('vertical-align'),
    'font-size': cell.css('font-size'),
    'font-family': cell.css('font-family'),

    'top': top,
    'left': left,
    'width': width,
    'height': height,

    'background-color': backgroundColor,

    'visibility': 'visible'
  };
  
  // copy td styles onto inputBool
  inputBool.css(styles);

  if ( parseBoolean(value) ) {
    this.setTrue();
  } else {
    this.setFalse();
  }
};

DbGridInputBool.prototype.hide = function() {
  this.inputBool.css('visibility','hidden');
};
DbGridInputBool.prototype.destroy = function() {
  this.inputBool.remove();
};
/**********************************
 * Public DbGridInputBool Methods End
 **********************************/


/* ==== dbGridTextArea.js ==== */
// DbGridTextArea Class Constructor 
var DbGridTextArea = function(callback, container) {
  var dbGridTextArea = this;

  var textArea =  jQuery('<textarea>');
  textArea.css({
    'position':'absolute',
    'visibility':'hidden',
    'background-color':'white',
    'border':'1px solid #aca899',
    'overflow':'auto'
  });
  container.append(textArea);

  // Properties
  dbGridTextArea.callback = callback;
  dbGridTextArea.textArea = textArea;

  // Events
  textArea.on('keyup.dbGridTextArea', function(e) {
    dbGridTextArea.inputOnKeyUp(e)    
  });
  textArea.on('keydown.dbGridTextArea', function(e) {
    dbGridTextArea.inputOnKeyDown(e)
  });
};

/************************************
 * Public DbGridTextArea Methods Start
 ************************************/
DbGridTextArea.prototype.getType = function() {
  return 'textarea';
};
DbGridTextArea.prototype.getValue = function() {
  var value = this.textArea.val();
  return value.replace(/\r\n|\n/g,"<br>");
};
DbGridTextArea.prototype.getElmt = function() {
  return this.textArea;
};
DbGridTextArea.prototype.inputOnKeyDown = function(e) {
  // decide whether to propagate the event to the cell
  // using the callback function passed in
  var textrangeData = this.textArea.textrange('get'); 
  out: {
    if ( e.which == 9 || e.which == 46 ) {
      // TAB or Delete
      this.callback(e)
      break out;
    }
    if ( e.which == 37 && textrangeData.selectionAtStart ) {
      // Left Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 38 && textrangeData.selectionAtStart ) {
      // Up Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 39 && textrangeData.selectionAtEnd ) {
      // Right Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 40 && textrangeData.selectionAtEnd ) {
      // Down Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 83 && e.ctrlKey ) {
      // Ctrl+S
      this.callback(e);
      break out;
    }
    
    // Default 
    // don't propagate
  }
};
DbGridTextArea.prototype.inputOnKeyUp = function(e) {
  // allways propagate
  this.callback(e);
};
DbGridTextArea.prototype.selectText = function(option) {
  if ( option == 'end') {
    this.textArea.textrange('set', 'end');
  }
  if ( option == 'start' ) {
    this.textArea.textrange('set', 'start');
  }
  if ( option == undefined || option == 'all' ) {
    this.textArea.textrange('set', 'all');
  }
};
DbGridTextArea.prototype.show = function(cell,value,editorHeight) {
  var row = cell.closest('tr');
  var table = row.closest('table');
  var textArea = this.textArea;

  var relativePosition = cell.positionRelativeTo(table);
  var top = relativePosition.top;
  var left = relativePosition.left;
  if ( editorHeight == undefined ) {
    height = cell.height();
  } else {
    height = editorHeight;
  }
  width = cell.width();
  
  if ( cell.css('backgroundColor') != 'transparent' ) {
    backgroundColor = cell.css('background-color');
  } else if ( row.css('background-color') != 'transparent' ) {
    backgroundColor = row.css('background-color');
  } else {
    backgroundColor = 'white';
  }

  var borderTopWidth = parseInt(cell.css('border-top-width'));
  var borderRightWidth = parseInt(cell.css('border-right-width'));
  var borderBottomWidth = parseInt(cell.css('border-bottom-width'));
  var borderLeftWidth = parseInt(cell.css('border-left-width'));

  if ( table.css('border-collapse') == 'collapse' ) {
    if ( borderTopWidth%2 == 0 ) {
      var borderTopWidth = borderTopWidth/2;
    } else {
      var borderTopWidth = Math.ceil(borderTopWidth/2);
    }
    
    if ( borderRightWidth%2 == 0 ) {
      var borderRightWidth = borderRightWidth/2;
    } else {
      var borderRightWidth = Math.ceil(borderRightWidth/2);
    }

    if ( borderBottomWidth%2 == 0 ) {
      var borderBottomWidth = borderBottomWidth/2;
    } else {
      var borderBottomWidth = Math.ceil(borderBottomWidth/2);
    }

    if ( borderLeftWidth%2 == 0 ) {
      var borderLeftWidth = borderLeftWidth/2;
    } else {
      var borderLeftWidth = Math.ceil(borderLeftWidth/2);
    }

    top -=  borderTopWidth;
    left -= borderLeftWidth;
    height +=  borderTopWidth;
    width +=  borderLeftWidth;
  } 
  
  // get styles applied to td
  var styles = {
    'border-top-width': borderTopWidth,
    'border-right-width': borderRightWidth,
    'border-bottom-width': borderBottomWidth,
    'border-left-width': borderLeftWidth,

    'border-top-style': cell.css('border-top-style'),
    'border-right-style': cell.css('border-right-style'),
    'border-bottom-style': cell.css('border-bottom-style'),
    'border-left-style': cell.css('border-left-style'),

    'border-top-color': cell.css('border-top-color'),
    'border-right-color': cell.css('border-right-color'),
    'border-bottom-color': cell.css('border-bottom-color'),
    'border-left-color': cell.css('border-left-color'),

    'margin-top': cell.css('margin-top'),
    'margin-right': cell.css('margin-right'),
    'margin-bottom': cell.css('margin-bottom'),
    'margin-left': cell.css('margin-left'),
    
    'padding-top': cell.css('padding-top'),
    'padding-right': cell.css('padding-right'),
    'padding-bottom': parseInt(cell.css('padding-bottom')),
    'padding-left': cell.css('padding-left'),
    
    'text-align': cell.css('text-align'),
    'vertical-align': cell.css('vertical-align'),
    'font-size': cell.css('font-size'),
    'font-family': cell.css('font-family'),

    'top': top,
    'left': left,
    'width': width,
    'height': height,

    'background-color': backgroundColor,

    'visibility': 'visible'
  };
  
  // copy td styles onto textArea
  textArea.css(styles);
  textArea.val(value.replace(/<br>/gi,"\r\n"));
};
DbGridTextArea.prototype.hide = function() {
  this.textArea.css('visibility','hidden');
};
DbGridTextArea.prototype.destroy = function() {
  this.textArea.remove();
};
/************************************
 * Public DbGridTextArea Methods End
 ************************************/

/* ==== dbHeader.js ==== */
function dbHeader(oTable) {
  // Resize table columns

  // vars
  var inZone = false;
  var inResize = false;
  var savedWidth;
  var savedX;
  var tolerance = 10;
  var minWidth = 10;
  var oTH;
  var oTHfixed;

  oTheadFixed=oTable.theadFixed;
  oTheadFixed.attachEvent('onmousedown',OnMouseDown);
  oTheadFixed.attachEvent('onmousemove',OnMouseMove);
  oTheadFixed.attachEvent('onmouseup',OnMouseUp);
  
  
  function OnMouseDown () {
    var srcElement = event.srcElement;	
    if ( inZone && event.button == 1) {
      oTheadFixed.setCapture();
      savedX = event.screenX;
      savedWidth = oTHfixed.clientWidth;
      inResize = true;
    }
  }
  
  function OnMouseMove () {
    if ( inResize && event.button == 1  ) {	
      // Drag
      var width = savedWidth + event.screenX - savedX;
      if ( width > minWidth ) {
	//
      }
    } else {
      // Mouse over
      srcElement = event.srcElement;
      if ( srcElement.forTH && srcElement.offsetWidth - event.offsetX < tolerance) {
	// This cell left of right boundery
	inZone = true;
	oTHfixed=srcElement;
	oTH=oTHfixed.forTH;
	oTheadFixed.runtimeStyle.cursor='col-resize';
      } else if ( event.offsetX < tolerance && srcElement.forTH && srcElement.forTH.cellIndex>0 ) {
	// This cell right of left boundery
	inZone = true;
	oTHfixed=oTheadFixed.children[srcElement.forTH.cellIndex-1];
	oTH=oTHfixed.forTH;
	oTheadFixed.runtimeStyle.cursor='col-resize';
      } else {
	inZone = false;
	oTheadFixed.runtimeStyle.cursor='auto';
      }
    }
  }
  
  function OnMouseUp () {
    if ( inResize ) {
      var width = savedWidth + event.screenX - savedX;
      if ( width > minWidth ) {
	oTable.resize(oTH.cellIndex,width);
      }
      inResize=false;
      oTheadFixed.releaseCapture();
    }
  }
  //
}


/* ==== dynamicResize.js ==== */
function dynamicResize(oContainer) {
    // Dynamically resize container when window is resized.
    window.attachEvent('onresize',resize);
    resize();
    function resize() {
	var window_height = jQuery(window).height();
	var container_height = jQuery(oContainer).height();
	var container_position_bottom = jQuery(oContainer).position().top +  container_height;
	var new_height;
	var position_bottom;
	var content_height = 0;

	// Determine height of all content.
	jQuery("body").children().each(function() {
	    position_bottom = jQuery(this).position().top + jQuery(this).height();
	    if (position_bottom > content_height) {
		content_height = position_bottom;
	    }	
	});

	if (content_height < window_height) {
	    // All content is visible within the window.
	    // Increase container_height so that overall content_height = window_height
	    jQuery(oContainer).height(container_height + (window_height - content_height));
	} else if (content_height > window_height) {
	    // Content is only partially visible within window.
	    // Try to decrease container_height (minimum height = 300) so that all content 
	    // is visible within the window.

	    new_height = container_height - (content_height - window_height);
	    if (new_height > 300) {
		// Decrease container height as long as it's new_height is greater than 300. 
		jQuery(oContainer).height(new_height);
	    } else {
		// It is not possible to display all content within the window, unless we reduce the 
		// container height below the minimum.
		// Instead ensure that the container is completely visible within the window.
		if (container_position_bottom > window_height) {
		    new_height = window_height - 40;
		    jQuery(oContainer).height(new_height);
		}
	    }
	}
    }
}

/* ==== jquery.colInherit.js ==== */
(function($) {
    $.fn.colInherit = function(options) {
	var settings = jQuery.extend({
	    customAttributes: []
	}, options);

	$(this).filter('table').each(function(){
	    var table = $(this);

	    table.children('colgroup').andSelf().children('col').each(function() {
		var col = $(this);

		var colIndex = col.index();
		var tds = table.children('thead, tbody, tfoot').andSelf().children('tr').children('td, th').filter(':nth-child(' + (colIndex + 1) + ')');

		// apply col classes to td and th elements
		if (col.attr('class')) {
		    tds.addClass(col.attr('class'));
		}

		// apply col styles to td elements
		if (col.attr('style')) {
		    var colStyle = col.attr('style').replace(/(^ +)|( *; *$)/, '');

		    tds.each(function() {
			var td = $(this);
			attributes = [];
			style = '';
			if (td.attr('style')) {
			    style = td.attr('style').replace(/(^ +)|( *; *$)/, '');
			    style.split(';').forEach(function(pair) {
				attributes.push(jQuery.trim(pair.split(':')[0]));
			    });
			}

			colStyle.split(';').forEach(function(pair) {
			    if (jQuery.inArray(jQuery.trim(pair.split(':')[0]), attributes) == -1) {
				if (style == '') {
				    style += pair;
				} else {
				    style += ';' + pair;
				}
			    }
			});

			style += ';';

			td.attr('style', style);
		    });
		}
		
		settings.customAttributes.forEach(function(name) {
		    if ( col.attr(name) ) {
			tds.each(function() {
			    var td = $(this);
			    if ( ! td.attr(name) ) {
				td.attr(name, col.attr(name));
			    }
			});
		    }
		});
	    });
	});
	return this;
    }
})(jQuery);

/* ==== jquery.column_show_hide.js ==== */
jQuery.fn.columns_show_hide = function(column_selector) {
    jQuery(this).each(function() {
	var table = jQuery(this);				   
	var hide_cols = jQuery(column_selector, table).filter(":visible");
	var show_cols = jQuery(column_selector, table).filter(":hidden");
	
	// Dettach table from DOM. 
	var table_parent = table.parent();
	var table_next_sibling = table.next();
	table.detach();
	
	// show/hide columns ( >10 x faster operatoing on a detached DOM elements) 
	hide_cols.hide(); 
	show_cols.show(); 
	
	
	// Reattach table to it's original position in the DOM.
	if (table_next_sibling.length) {
	    table.insertBefore(table_next_sibling);
	} else {		    
	    table.appendTo(table_parent);
	}
    });
};


/* ==== jquery.compass.js ==== */
;(function($, window, document, undefined) {
    $.fn.northOf = function(selection) {
        // Returns the element above the target, or undefined if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementTop = fromElement.offset().top;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementTop = element.offset().top;
            if (sameColumn(fromElement, element) && elementTop < fromElementTop && (nextElement === undefined || elementTop > nextElementTop)) {
                nextElement = element;
                nextElementTop = elementTop;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementTop = element.offset().top;
                if (leftOfColumn(fromElement, element) && (nextElement === undefined || rightOfColumn(nextElement, element) || (sameColumn(element, nextElement) && elementTop > nextElementTop))) {
                    nextElement = element;
                    nextElementTop = elementTop;
                };
            });
        }
        return nextElement;
    }
    $.fn.eastOf = function(selection) {
        // Returns the element right of the target, or undefined if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementLeft = fromElement.offset().left;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementLeft = element.offset().left;
            if (sameRow(element, fromElement) && elementLeft > fromElementLeft && (nextElement === undefined || elementLeft < nextElementLeft)) {
                nextElement = element;
                nextElementLeft = elementLeft;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementLeft = $(element).offset().left;
                if (belowRow(fromElement, element) && (nextElement === undefined || aboveRow(nextElement, element) || (sameRow(element, nextElement) && elementLeft < nextElementLeft))) {
                    nextElement = element;
                    nextElementLeft = elementLeft;
                }
            });
        }
        return nextElement;
    }
    $.fn.southOf = function(selection) {
        // Returns the element below the target, or undefined if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementTop = fromElement.offset().top;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementTop = element.offset().top;
            if (sameColumn(fromElement, element) && elementTop > fromElementTop && (nextElement === undefined || elementTop < nextElementTop)) {
                nextElement = element;
                nextElementTop = elementTop;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementTop = element.offset().top;
                if (rightOfColumn(fromElement, element) && (nextElement === undefined || leftOfColumn(nextElement, element) || (sameColumn(element, nextElement) && elementTop < nextElementTop))) {
                    nextElement = element;
                    nextElementTop = elementTop;
                }
            });
        }
        return nextElement;
    }
    $.fn.westOf = function(selection) {
        // Returns the element left of the target, or undefined if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementLeft = fromElement.offset().left;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementLeft = element.offset().left;
            if (sameRow(element, fromElement) && elementLeft < fromElementLeft && (nextElement === undefined || elementLeft > nextElementLeft)) {
                nextElement = element;
                nextElementLeft = elementLeft;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementLeft = $(element).offset().left;
                if (aboveRow(fromElement, element) && (nextElement === undefined || belowRow(nextElement, element) || (sameRow(element, nextElement) && elementLeft > nextElementLeft))) {
                    nextElement = element;
                    nextElementLeft = elementLeft;
                }
            });
        }
        return nextElement;
    }

    function sameRow(a, b) {
        // Takes two elements and returns true if they are on the same row
        return (a.offset().top <= (b.offset().top + b.outerHeight())) && ((a.offset().top + a.outerHeight()) >= b.offset().top);
    }

    function belowRow(a, b) {
        // Takes two elements and returns true if "b" is on a row below "a"
        return b.offset().top > (a.offset().top + a.outerHeight());
    }

    function aboveRow(a, b) {
        // Takes two elements and returns true if "b" is on a row above "a"
        return (b.offset().top + b.outerHeight()) < a.offset().top;
    }

    function sameColumn(a, b) {
        // Takes two elements and returns true if they are in the same column
        return (a.offset().left <= (b.offset().left + b.outerWidth())) && ((a.offset().left + a.outerWidth()) >= b.offset().left);
    }

    function leftOfColumn(a, b) {
        // Takes two elements and returns true if "b" is in a column left of "a"
        return (b.offset().left + b.outerWidth()) < a.offset().left;
    }

    function rightOfColumn(a, b) {
        // Takes two elements and returns true if "b" is in a column right of "a"
        return (a.offset().left + a.outerWidth()) < b.offset().left;
    }
})(jQuery, window, document);

/* ==== jquery.cycleClasses.js ==== */
// cycleClasses plugin. Takes an array of classes as an argument, expects the target to be a single element with one of those classes, and replaces class with the next one in the array, looping back to the beginning when the end is reached.
(function($){
    $.fn.cycleClasses = function(classes) {
	var nextClass = classes[0];
	for(var i = classes.length - 1; i >= 0; i--) {
	    thisClass = classes[i];
	    if ( this.hasClass(thisClass) ) {
		this.removeClass(thisClass);
		this.addClass(nextClass);
		return this;
	    } else {
		nextClass = thisClass;
	    }
	}
	this.addClass(nextClass);
	return this;
    }
})(jQuery);

/* ==== jquery.cycleText.js ==== */
// cycleText plugin. Takes an array of strings, expects the target to be a single element with text equal to one of those strings, and replaces the text on that element with the next string in the array, looping back to the beginning when the end is reached.
(function($){
    $.fn.cycleText = function(labels) {
	var nextLabel = labels[0];
	for(var i = labels.length - 1; i >= 0; i--) {
	    thisLabel = labels[i];
	    if ( this.text() === thisLabel ) {
		this.text(nextLabel);
		return this;
	    } else {
		nextLabel = thisLabel;
	    }
	}
	this.text(nextLabel);
	return this;
    }
})(jQuery);

/* ==== jquery.dbCell.js ==== */
(function($, window, document, undefined){
    $.widget("qcode.dbCell", {
	_create: function(){
	    this.keyUpTimer
	},
	getRow: function(){
	    return this.element.closest('tr');
	},
	getGrid: function(){
	    return this.element.closest('table');
	},
	getCol: function(){
	    return this.getGrid().children('colgroup').children().eq(this.element.index());
	},
	getType: function(){
	    // default type == 'text'
	    return coalesce(this.getCol().attr('type'), 'text');
	},
	getEditorPluginName: function(){
	    switch ( this.getType() ) {
	    case 'bool': return "dbEditorBool"
	    case 'combo': return "dbEditorCombo"
	    case 'htmlarea': return "dbEditorHTMLArea"
	    case 'text': return "dbEditorText"
	    case 'textarea': return "dbEditorTextArea"
	    default:
		$.error('Unknown editor for cell type : ' + this.getType());
		return;
	    }
	},
	editor: function() {
	    var grid = this.getGrid();
	    var editorDiv = grid.dbGrid('getEditorDiv');
	    var editorPluginName = this.getEditorPluginName();
	    return $.fn[editorPluginName].apply(editorDiv, arguments);
	},
	getValue: function(){
	    var cellType = this.getType();

            if ( cellType === "htmlarea" || cellType === "html" ) {
                return this.element.html();
            } else if ( cellType === "bool" ) {
		return parseBoolean(stripHTML(this.element.html()));
	    } else if ( this.element.is(':input') ) {
                return this.element.val();
            } else {
                return this.element.text();
            }
	},
	setValue: function(value){
	    var cellType = this.getType();

            if ( cellType === "htmlarea" || cellType === "html" ) {
		this.element.html(value);
            } else if ( cellType === "bool" ) {
		if ( parseBoolean(value) ) {
		    this.element.html("<span class='clsTrue'>Yes</span>");
		} else {
		    this.element.html("<span class='clsFalse'>No</span>");
		}
	    } else if ( this.element.is(':input') ) {
                this.element.val(value);
            } else {
                this.element.text(value);
            }
	},
	isEditable: function() {
	    var row = this.getRow();
	    var col = this.getCol();

	    if ( row.dbRow('getState') === 'updating' ) {
		return false;
	    } 
	    // Is the column visible
	    if ( col.hasClass('clsHidden') ) {
		return false;
	    }
	    // No name defined
	    if ( col.attr('name') === undefined ) {
		return false;
	    }
	    if ( row.dbRow('option','type') === 'add' && parseBoolean(col.attr('addDisabled')) === true ) {
		return false;
	    }
	    if ( row.dbRow('option','type') === 'update' && parseBoolean(col.attr('updateDisabled')) === true ) {
		return false;
	    } 
	    if ( col.attr('type') === 'html' ) {
		return false;
	    }
	    return true;
	},
	isTabStop: function() {
	    if ( this.getCol().attr('tabStop') === 'no' ) {
		return false;
	    } else {
		return true;
	    }
	},
	hide: function(){
	    this.element.css('visibility','hidden');
	},
	show: function(){
	    this.element.css('visibility','inherit');
	},
	cellIn: function(select) {
	    // Update currentCell dbGrid variable, hide the cell, show the editor and set editor text selection.
	    var cell = this.element;
	    var grid = this.getGrid();
	  	  
	    this.hide();
	    if ( this.getType() === 'combo' ) {
		this.editor('show', cell, this.getValue(), this.getCol().attr('searchURL'));
	    } else {
		this.editor('show', cell, this.getValue())
	    }
	    select = coalesce(select, this.getCol().attr('cellInSelect'), 'all');
	    this.editor('selectText', select); 
	    grid.dbGrid('setCurrentCell', cell);
	},
	cellOut: function(){
	    // Write editor to cell, show cell, hide editor, unset currentCell dbGrid variable
	    var cell = this.element;
	    var row = this.getRow();
	    var grid = this.getGrid();
	    
	    // Custom Event: Trigger any dbCellOut events bound to this grid
	    cell.trigger('dbCellOut');
	    
	    var oldValue = this.getValue();
	    var newValue = this.editor('getValue');
	    this.write();
	    this.show();
	    this.editor('hide');
	    grid.dbGrid('setCurrentCell', $([]));
	  
	    // Perform any custom action for this column
	    if ( row.dbRow('getState') === 'dirty' &&  this.getCol().attr('action') ) {
		var actionURL = this.getCol().attr('action');
		row.dbRow('action','custom',actionURL,false);
	    }

	    // Auto-save depending on dbGrid's updateType
	    switch ( grid.dbGrid('option', 'updateType') ) {
	    case 'onKeyUp': 
		// cancel any delayed save and save immediately
		this._cancelDelayedSave();
		if (row.dbRow('getState') === 'dirty') {
		    row.dbRow('save',false);
		}
		break;	    
	    case 'onCellOut': 
		// save immediately
		if (row.dbRow('getState') === 'dirty') {
		    row.dbRow('save',false);
		}
	    }
	},
	write: function(){
	    // Write the contents of the editor to the current cell
	    this.setValue(this.editor('getValue'));
	},
	editorBlur: function(){
	    // Perform a cellout if the editor blurs and updateType == "onCellOut"
	    var grid = this.getGrid();
	    var row = this.getRow();
	    if ( grid.dbGrid('option', 'updateType') === 'onCellOut' ) {
		this.cellOut();
	    }		   
	},
	editorCut: function(){
	    // Cut events should be triggered on the editor, but will be passed on to here. 
	    // Editor value will have changed, mark row as dirty.
	    var row = this.getRow();
	    row.dbRow('setState', 'dirty');
	},
	editorPaste: function(){
	    // Paste events should be triggered on the editor, but will be passed on to here. 
	    // Editor value will have changed, mark row as dirty.
	    var row = this.getRow();
	    row.dbRow('setState', 'dirty');
	},
	editorKeyUp: function(){
	    // If the Editor's value has changed, mark row as dirty.
	    var row = this.getRow();
	    var grid = this.getGrid();
 	    
	    if ( this.getValue() !== this.editor('getValue') ) {
		row.dbRow('setState', 'dirty');
		}
	    if ( grid.dbGrid('option','updateType') === "onKeyUp" ) {
		this._cancelDelayedSave();
		this.keyUpTimer = setTimeout(this._delayedSave.bind(this),750);
	    }
	},
	editorKeyDown: function(event){
	    var cell = this.element;
	    var grid = this.getGrid();

	    // Alt key combination
	    if ( event.altKey ) { return true; }

	    switch(event.which) {
	    case 38: // Up Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellAbove', cell));
		break;
	    case 40: // Down Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellBelow', cell));
		break;
	    case 37: // Left Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellLeftOf', cell));
		break;
	    case 39: // Right Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellRightOf', cell));
		break;		
	    case 83: // s Key
		if ( event.ctrlKey ) {
		    // Ctrl + s
		    grid.dbGrid('save');
		    break;
		}
	    case 46: // Delete Key
		grid.dbGrid('delete');
		break;
	    case 13: // Return Key
		grid.dbGrid('cellChange', grid.dbGrid('cellRightOf', cell));
		if ( grid.dbGrid('getCurrentCell').is(cell) ) {
		    // We are on the last editable cell 
		    grid.dbGrid('save');
		}
		break;
	    case 9: // Tab Key
		if ( event.shiftKey ) {
		    grid.dbGrid('cellChange', grid.dbGrid('cellLeftOf', cell));
		} else {
		    grid.dbGrid('cellChange', grid.dbGrid('cellRightOf', cell));
		}
		if ( grid.dbGrid('getCurrentCell').is(cell) ) {
		    // We are on the last editable cell 
		    grid.dbGrid('save');
		    return true;
		}
		break;

	    default: // handle event using browser defaults
		return true;
	    }
	    
	    // prevent event propagation and browser defaults 
	    event.preventDefault();
	    event.stopPropagation();
	    return false
	},
	onMouseUp: function(event){
	    // Mouse up event on an editable cell - call changeCell
	    var grid = this.getGrid();

	    // Cell is not editable
	    if ( ! this.isEditable() ) { return true; } 
	    
	    grid.dbGrid('cellChange', this.element);
	},
	_delayedSave: function(){
	    var row = this.getRow();
	    if ( row.dbRow('getState') === 'dirty' ) {
		row.dbRow('save');
	    }
	},
	_cancelDelayedSave: function(){
	    if ( this.keyUpTimer !== undefined ) {
		clearTimeout(this.keyUpTimer);
	    }
	    this.keyUpTimer=undefined;
	},
    });
})(jQuery, window, document);

/* ==== jquery.dbCellControl.js ==== */
(function($){
    $.fn.dbCellControl = function() {
	var returnValue;
	var target = $(this);
	if ( ! target.data('dbCellControl')){
	    $.error('dbCellControl is abstract and must be initialized with another plugin');
	} else {
	    var control = target.data('dbCellControl');
	    returnValue = target[control.pluginName].apply(target,arguments);
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);

/* ==== jquery.dbCellHTMLArea.js ==== */
(function($){
    var eventNamespace = '.dbCellControl.dbCellHTMLArea';
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight',
			  'width']
    function DbCellHTMLArea(container,cells,options) {
	cells.data('dbCellControl', this);
	this.editor = $('<div>')
	    .attr('contentEditable', true)
	    .addClass('dbCellControl dbCellHTMLArea')
	    .appendTo(container)
	    .css({
		'position': "absolute"
	    })
	    .hide()
	    .on('keydown' + eventNamespace, inputOnKeyDown.bind(this))
	    .on('keyup' + eventNamespace, inputOnKeyUp.bind(this))
	    .on('cut' + eventNamespace, inputOnCut.bind(this))
	    .on('paste' + eventNamespace, inputOnPaste.bind(this))
	    .on('blur' + eventNamespace, inputOnBlur.bind(this));
    }
    $.extend(DbCellHTMLArea.prototype, {
	pluginName: 'dbCellHTMLArea',
	add: function(container,cells){
	    cells.data('dbCellControl', this);
	},
	remove: function(cells) {
	    cells.removeData('dbCellControl');
	},
	getType: function() {
	    return 'htmlarea';
	},
	getValue: function() {
	    return this.editor.html();
	},
	show: function(cell,value){
	    this.currentCell = cell;
	    var editor = this.editor;
	    $.each(copyAttributes, function(i,name){
		editor.css(name,cell.css(name));
	    });
	    if ( cell.css('backgroundColor') == 'transparent' || cell.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', cell.css('backgroundColor'));
	    }
	    editor
		.height((typeof cell.data('editorHeight') == "undefined") ? cell.height() : cell.data('editorHeight'))
		.css({
		    'top': cell.position().top + cell.offsetParent().scrollTop(),
		    'left': cell.position().left + cell.offsetParent().scrollLeft()
		})
		.show()
		.html(value)
		.focus();
	},
	hide: function(cell) {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	selectText: function(cell,text) {
	    // TO DO - figure out if there's a way to do this
	},
	destroy: function() {
	    this.editor.remove();
	}
    });
    function inputOnKeyDown(e) {
	switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	case 83: //S
	    if ( ! e.ctrlKey ) break;
	case 9: //tab
	    e.preventDefault();
	case 38: //up
	case 40: //down
            var event = jQuery.Event(e.type,{
		'data': e.data,
		'ctrlKey': e.ctrlKey,
		'altKey': e.altKey,
		'shiftKey': e.shiftKey,
		'which': e.which
            });
	    this.currentCell.trigger(event);
	}
    }
    function inputOnKeyUp(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
		'ctrlKey': e.ctrlKey,
		'altKey': e.altKey,
		'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnCut(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnPaste(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnBlur(e, source) {
	if ( ! this.editor.is(':focus') ) {
            var event = jQuery.Event(e.type,{
		'data': e.data
            });
	    this.currentCell.trigger(event);
	}
    }
    $.fn.dbCellHTMLArea = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('dbCellControl');
	if ( ! control ) {
	    control = target.data('dbCellHTMLArea');
	}
	if ( arguments[0] === 'isInitialized' ) {
	    return Boolean(control);
	}
	if ( ! control ) {
	    var cells = arguments[0];
	    var options = arguments[1];
	    target.data('dbCellHTMLArea', new DbCellHTMLArea(target,cells,options));
	} else {
	    if ( control.pluginName !== 'dbCellHTMLArea' ) {
		$.error('Cannot apply dbCellHTMLArea - element has another control already');
	    }
	    var method = arguments[0];
	    var args = [target].concat(Array.prototype.slice.call(arguments,1));
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method of dbCellHTMLArea');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);

/* ==== jquery.dbCellInput.js ==== */
(function($){
    var eventNamespace = '.dbCellControl.dbCellInput';
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight',
			  'width','height']
    function DbCellInput(container,cells) {
	cells.data('dbCellControl', this);
	this.editor = $('<input type="text">')
	    .addClass('dbCellControl dbCellInput')
	    .appendTo(container)
	    .css({
		'position': "absolute",
		'background': "white",
		'overflow': "visible",
		'-moz-box-sizing': "content-box",
		'-ms-box-sizing': "content-box",
		'box-sizing': "content-box",
		'z-index': 1
	    })
	    .hide()
	    .on('keydown' + eventNamespace, inputOnKeyDown.bind(this))
	    .on('keyup' + eventNamespace, inputOnKeyUp.bind(this))
	    .on('cut' + eventNamespace, inputOnCut.bind(this))
	    .on('paste' + eventNamespace, inputOnPaste.bind(this))
	    .on('blur' + eventNamespace, inputOnBlur.bind(this));
    }
    $.extend(DbCellInput.prototype, {
	pluginName: 'dbCellInput',
	add: function(container,cells) {
	    cells.data('dbCellControl', this);
	},
	remove: function(cells) {
	    cells.removeData('dbCellControl');
	},
	getType: function() {
	    return 'text';
	},
	getValue: function() {
	    return this.editor.val();
	},
	show: function(cell,value){
	    this.currentCell = cell;
	    var editor = this.editor;
	    $.each(copyAttributes, function(i,name){
		editor.css(name,cell.css(name));
	    });
	    if ( cell.css('backgroundColor') == 'transparent' || cell.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', cell.css('backgroundColor'));
	    }
	    editor
		.css({
		    'top': cell.position().top + cell.offsetParent().scrollTop(),
		    'left': cell.position().left + cell.offsetParent().scrollLeft()
		})
		.show()
		.val(value)
		.focus();
	},
	hide: function(cell) {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	selectText: function(cell,option) {
	    // TO DO - figure out if there's a way to do this
	},
	destroy: function() {
	    this.editor.remove();
	}
    });
    function inputOnKeyDown(e) {
	switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	case 83: //S
	    if ( ! e.ctrlKey ) break;
	case 13: //return
	case 9: //tab
	    e.preventDefault();
	case 38: //up
	case 40: //down
            var event = jQuery.Event(e.type,{
		'data': e.data,
		'ctrlKey': e.ctrlKey,
		'altKey': e.altKey,
		'shiftKey': e.shiftKey,
		'which': e.which
            });
	    this.currentCell.trigger(event);
	    break;
	}
    }
    function inputOnKeyUp(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnCut(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnPaste(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnBlur(e, source) {
	if ( ! this.editor.is(':focus') ) {
            var event = jQuery.Event(e.type,{
		'data': e.data
            });
	    this.currentCell.trigger(event);
	}
    }
    $.fn.dbCellInput = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('dbCellControl');
	if ( ! control ) {
	    control = target.data('dbCellInput');
	}
	if ( arguments[0] === 'isInitialized' ) {
	    return Boolean(control);
	}
	if ( ! control ) {
	    var cells = arguments[0];
	    var options = arguments[1];
	    target.data('dbCellInput', new DbCellInput(target,cells,options));
	} else {
	    if ( control.pluginName !== 'dbCellInput' ) {
		$.error('Cannot apply dbCellInput - element has another control already');
	    }
	    var method = arguments[0];
	    if ( typeof control[method] == "function" ) {
		var args = [target].concat(Array.prototype.slice.call(arguments,1));
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method ' + method + ' of dbCellInput');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);

/* ==== jquery.dbCellTextArea.js ==== */
(function($){
    var eventNamespace = '.dbCellControl.dbCellHTMLArea';
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight',
			  'width','height']
    function DbCellTextArea(container,cells,options) {
	cells.data('dbCellControl', this);
	this.editor = $('<textarea>')
	    .appendTo(container)
	    .addClass('dbCellControl dbCellTextArea')
	    .css({
		'position': "absolute",
		'resize': "none",
		'-moz-box-sizing': "content-box",
		'-ms-box-sizing': "content-box",
		'box-sizing': "content-box",
		'overflow': "auto"
	    })
	    .hide()
	    .on('keydown' + eventNamespace, inputOnKeyDown.bind(this))
	    .on('keyup' + eventNamespace, inputOnKeyUp.bind(this))
	    .on('cut' + eventNamespace, inputOnCut.bind(this))
	    .on('paste' + eventNamespace, inputOnPaste.bind(this))
	    .on('blur' + eventNamespace, inputOnBlur.bind(this));
    }
    $.extend(DbCellTextArea.prototype, {
	pluginName: 'dbCellTextArea',
	add: function(container,cells){
	    cells.data('dbCellControl', this);
	},
	remove: function(cells) {
	    cells.removeData('dbCellControl');
	},
	getType: function() {
	    return 'textarea';
	},
	getValue: function() {
	    return this.editor.val();
	},
	show: function(cell,value){
	    //console.log("dbCellTextArea show " + cell.text());
	    this.currentCell = cell;
	    var editor = this.editor;
	    $.each(copyAttributes, function(i,name){
		editor.css(name,cell.css(name));
	    });
	    if ( cell.css('backgroundColor') == 'transparent' || cell.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', cell.css('backgroundColor'));
	    }
	    editor
		.css({
		    'top': cell.position().top + cell.offsetParent().scrollTop(),
		    'left': cell.position().left + cell.offsetParent().scrollLeft(),
		    'height': "+=1",
		    'padding-bottom': "-=1"
		})
		.show()
		.val(value)
		.focus();
	    //console.log("editor focus : " + editor.is(':focus'));
	    //console.log("/show");
	},
	hide: function(cell) {
	    //console.log("dbCellTextArea hide " + cell.text());
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	    //console.log("/hide");
	},
	selectText: function(cell,option) {
	    // TO DO - figure out if there's a way to do this
	},
	destroy: function() {
	    this.editor.remove();
	}
    });
    function inputOnKeyDown(e) {
	//console.log("dbCellTextArea onKeyDown " + e.which + " " + e.timeStamp + " " + e.target.nodeName);
	switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	case 83: //S
	    if ( ! e.ctrlKey ) break;
	case 9: //tab
	    e.preventDefault();
	case 38: //up
	case 40: //down
            var event = jQuery.Event(e.type,{
		'data': e.data,
		'ctrlKey': e.ctrlKey,
		'altKey': e.altKey,
		'shiftKey': e.shiftKey,
		'which': e.which
            });
	    this.currentCell.trigger(event);
	}
	//console.log("/onKeyDown");
    }
    function inputOnKeyUp(e) {
	//console.log("dbCellTextArea keyUp " + e.which);
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
	//console.log("/keyUp");
    }
    function inputOnCut(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnPaste(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnBlur(e) {
	//console.log("dbCellTextArea onBlur " + e.timeStamp + " " + e.target.nodeName);
	if ( ! this.editor.is(':focus') ) {
            var event = jQuery.Event(e.type,{
		'data': e.data
            });
	    this.currentCell.trigger(event);
	}
	//console.log("/onBlur");
    }
    $.fn.dbCellTextArea = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('dbCellControl');
	if ( ! control ) {
	    control = target.data('dbCellTextArea');
	}
	if ( arguments[0] === 'isInitialized' ) {
	    return Boolean(control);
	}
	if ( ! control ) {
	    var cells = arguments[0];
	    var options = arguments[1];
	    target.data('dbCellTextArea', new DbCellTextArea(target,cells,options));
	} else {
	    if ( control.pluginName !== 'dbCellTextArea' ) {
		$.error('Cannot apply dbCellTextArea - element has another control already');
	    }
	    var method = arguments[0];
	    var args = [target].concat(Array.prototype.slice.call(arguments,1));
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method of dbCellTextArea');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);

/* ==== jquery.dbCells.js ==== */
(function($){
    var states = ['current','dirty','updating','error'];
    function DbCells(container, options) {
	this.container = container;
	this.settings = $.extend({
	    'inputCellSelector': ".cell:not(.text, .html)",
	    'textCellSelector': ".cell.text",
	    'htmlCellSelector': ".cell.html",
	    'initalFocus': true,
	    'enabled': true,
	    'updateType': "cellOut"
	}, options);
	this.inputCells = $(this.settings.inputCellSelector, this.container);
	this.textCells = $(this.settings.textCellSelector, this.container);
	this.htmlCells = $(this.settings.htmlCellSelector, this.container);
	this.cells = this.inputCells
	    .add(this.textCells)
	    .add(this.htmlCells);
	this.cells.data('dbCells', this);

	if ( this.inputCells.length > 0 ) {
	    this.container.dbCellInput(this.inputCells);
	}
	if ( this.textCells.length > 0 ) {
	    this.container.dbCellTextArea(this.textCells);
	}
	if ( this.htmlCells.length > 0 ) {
	    this.container.dbCellHTMLArea(this.htmlCells);
	}
	
	var selectors = [];
	if ( this.settings.inputCellSelector ) {
	    selectors.push(this.settings.inputCellSelector);
	}
	if ( this.settings.textCellSelector ) {
	    selectors.push(this.settings.textCellSelector);
	}
	if ( this.settings.htmlCellSelector ) {
	    selectors.push(this.settings.htmlCellSelector);
	}
	var cellSelector = selectors.join(', ');
	this.container
	    .on('mouseup.dbCells', cellSelector, cellOnMouseUp.bind(this))
	    .on('keydown.dbCells', cellSelector, cellOnKeyDown.bind(this))
	    .on('keyup.dbCells', cellSelector, cellOnKeyUp.bind(this))
	    .on('cut.dbCells', cellSelector, cellOnCut.bind(this))
	    .on('paste.dbCells', cellSelector, cellOnPaste.bind(this))
	    .on('blur.dbCells', cellSelector, cellOnBlur.bind(this))
	    .on('update.dbCells', function(){
		if ( typeof this.currentCell != "undefined" ) {
		    this.currentCell.dbCellControl('show', this.currentCell.dbCellControl('getValue'));
		};
	    }.bind(this));
	$(window)
	    .on('resize.dbCells', onResize.bind(this))
	    .on('beforeunload.dbCells', onBeforeUnload.bind(this))
	    .on('beforeprint.dbCells', onBeforePrint.bind(this));
    }
    $.extend(DbCells.prototype, {
	add: function(cell, type) {
	    if ( typeof type == "undefined" ) {
		if ( cell.is(this.settings.textCellSelector) ) {
		    var type = "textarea";
		} else if ( cell.is(this.settings.htmlCellSelector) ) {
		    var type = "htmlarea";
		} else {
		    var type = "text";
		}
	    }
	    switch (type) {
	    case "text":
		if ( this.container.dbCellInput('isInitialized') ) {
		    this.container.dbCellInput('add',cell);
		} else {
		    this.container.dbCellInput(cell);
		}
		this.inputCells = this.inputCells.add(cell);
		break;
	    case "textarea":
		if ( this.container.dbCellTextArea('isInitialized') ) {
		    this.container.dbCellTextArea('add',cell);
		} else {
		    this.container.dbCellTextArea(cell);
		}
		this.textCells = this.textCells.add(cell);
		break;
	    case "htmlarea":
		if ( this.container.dbCellHTMLArea('isInitialized') ) {
		    this.container.dbCellHTMLArea('add',cell);
		} else {
		    this.container.dbCellHTMLArea(cell);
		}
		this.htmlCells = this.htmlCells.add(cell);
		break;
	    }
	    this.cells = this.cells.add(cell);
	    cell.data('dbCells', this);
	},
	remove: function(cell) {
	    var type = this.getCellType(cell);
	    cell.dbCellControl('remove');
	    switch(type) {
	    case "text":
		this.inputCells = this.inputCells.not(cell);
		break;
	    case "textarea":
		this.textCells = this.textCells.not(cell);
		break;
	    case "htmlarea":
		this.htmlCells = this.htmlCells.not(cell);
		break;
	    }
	    this.cells = this.cells.not(cell);
	    cell.removeData('dbCells');
	},
	save: function(cell,async) {
	    var dbCells = this;
	    if ( typeof cell == "undefined" ) {
		var cell = this.currentCell;
	    }
	    if ( cell.data('deleteWhenEmpty') && this.getCellValue(cell) === "" ) {
		this.delete(cell,async);
		cell.trigger('save');
	    } else if ( typeof cell.data('updateUrl') != "undefined" ) {
		dbCells.cellAction(cell,'update',cell.data('updateUrl'),cellActionReturn.bind(dbCells,cell,'update'),async);
		cell.trigger('save');
	    } else if ( typeof cell.data('addUrl') != "undefined" ) {
		dbCells.cellAction(cell,'add',cell.data('addUrl'),cellActionReturn.bind(dbCells,cell,'add'),async);
		cell.trigger('save');
	    }
	},
	delete: function(cell,async) {
	    if ( typeof cell == "undefined" ) {
		var cell = this.currentCell;
	    }
	    if ( typeof cell.data('deleteUrl') != "undefined" ) {
		this.cellAction(cell,'delete',cell.data('deleteUrl'),cellActionReturn.bind(this,cell,'delete'),async);
		cell.trigger('delete');
	    }
	},
	cellChange: function(newCell) {
	    if ( typeof this.currentCell != "undefined" ) {
		//console.log("Cell change from " + this.currentCell.text() + " to " + newCell.text());
		this.cellOut(this.currentCell);
	    } else {
		//console.log("Cell change to " + newCell.text());
	    }
	    this.cellIn(newCell);
	    //console.log("/cellChange");
	},
	focus: function() {
	    //console.log("dbCells focus");
	    if ( typeof this.currentCell != "undefined" ) {
		this.cellIn(this.currentCell);
	    }
	    //console.log("/focus");
	},
	setDirty: function() {
	    if ( typeof this.currentCell != "undefined" ) {
		this.setCellState(currentCell,'dirty');
	    }
	},
	cellIn: function(cell, select) {
	    //console.log("dbCells cellIn to " + cell.text());
	    if ( typeof cell != "object" ) {
		$.error('cellIn requires a cell');
	    }
	    cell.data('focussing',true);
	    this.currentCell = cell;
	    this.currentCell.css('visibility', "hidden");
	    if ( typeof this.getCellState(cell) == "undefined" ) {
		this.setCellState(cell,'current');
	    }
	    var cellValue = this.getCellValue(cell);
	    cell.dbCellControl('show',cellValue);

	    if (select) {
		cell.dbCellControl('selectText',text);
	    } else if ( cell.data('cellInSelect') != null ) {
		cell.dbCellControl('selectText',cell.data('cellInSelect'));
	    } else {
		cell.dbCellControl('selectText','all');
	    }
	    cell.trigger('cellin.dbCells');
	    cell.removeData('focussing');
	    //console.log("/cellIn");
	},
	cellOut: function(cell) {
	    if ( typeof cell != 'object' ) {
		$.error('cellOut requires a cell');
	    }
	    this.currentCell = undefined;
	    //console.log("dbCells cellOut from " + cell.text());
	    var oldValue = this.getCellValue(cell);
	    var newValue = cell.dbCellControl('getValue');
	    if ( oldValue != newValue ) {
		this.setCellState(cell,'dirty');
	    }
	    cellWrite.call(this,cell);
	    cell.css('visibility', "inherit");
	    cell.dbCellControl('hide');
	    if ( this.settings.updateType == "onKeyUp" ) {
		this.cancelDelayedSave();
	    }
	    if ( this.getCellState(cell) == "dirty" ) {
		this.save(cell);
	    }
	    cell.trigger('cellout.dbCells');
	    //console.log("/cellOut");
	},
	setCellState: function(cell,state) {
	    if ( typeof cell != "object" || typeof state != "string" || states.indexOf(state) < 0 ) {
		$.error('Invalid arguments for setCellState');
	    }
	    cell.removeClass(states.join(' ')).addClass(state);
	},
	getCellState: function(cell) {
	    if ( typeof cell != "object" ) {
		$.error('getCellState requires a cell');
	    }
	    var cellState;
	    $.each(states, function(i, state){
		if ( cell.hasClass(state) ) {
		    cellState = state;
		}
	    });
	    return cellState;
	},
	getCellValue: function(cell) {
	    if ( typeof cell != "object" ) {
		$.error('getCellValue requires a cell');
	    }
	    switch(this.getCellType(cell)){
	    case 'html':
	    case 'htmlarea':
		return cell.html();
		break;
	    default:
		return unescapeHTML(cell.html());
		break;
	    }
	},
	setCellValue: function(cell, value) {
	    if ( typeof cell != "object" || typeof value != "string" ) {
		$.error('Invalid arguments for setCellValue');
	    }
	    switch(this.getCellType(cell)){
	    case 'html':
	    case 'htmlarea':
		cell.html(value);
		break;
	    default:
		cell.html(escapeHTML(value));
		break;
	    }
	},
	getCellType: function(cell) {
	    if ( typeof cell != "object" ) {
		$.error('getCellType requires a cell');
	    }
	    return cell.dbCellControl('getType');
	},
	delayedSave: function() {
	    if ( typeof this.currentCell == "object"
		 && this.getCellState(this.currentCell) == 'dirty' ) {
		this.save();
	    }
	},
	cancelDelayedSave: function() {
	    if ( typeof this.keyUpTimer != "undefined" ) {
		clearTimeout(this.keyUpTimer);
		this.keyUpTimer = undefined;
	    }
	},
	isCellEditable: function(cell) {
	    if ( typeof cell != "object" ) {
		$.error('isCellEditable requires a cell');
	    }	    
	    var state = this.getCellState(cell);
	    if ( typeof state == "undefined" ) {
		this.setCellState(cell,'current');
	    }
	    return state != 'updating';
	},
	isTabStop: function() {
	    return true;
	},
	cellAction: function(cell,type,url,handler,async) {
	    if ( typeof(handler) == "undefined" ) {
		handler = cellActionReturn.bind(this,cell,type);
	    }
	    if (typeof(async) == "undefined") {
		async = true;
	    }
	    
	    this.setCellState(cell,'updating');

	    if ( typeof this.currentCell != "undefined" ) {
		cellWrite.call(this);
	    }

	    var name = cell.data('name');
	    var value = this.getCellValue(cell);
	    var data = {};
	    data[name] = value;
	    
	    var re = /([^\?]+)\??(.*)/;
	    re.exec(url);
	    var path = RegExp.$1;
	    var queryString = RegExp.$2;
	    $.each(queryString.split('&'),function(i, pair){
		data[pair.split('=')[0]] = pair.split('=')[1];
	    });

	    var deferred = new jQuery.Deferred();
	    deferred.done(handler);
	    deferred.fail(cellActionReturnError.bind(this,cell,type));
	    httpPost(url,data,deferred.resolve.bind(deferred),deferred.reject.bind(deferred));
	    cell.trigger('cellAction',[type,deferred]);
	},
	setStatus: function(msg){
	    this.trigger('statuschange',[msg])
	}
    });
    function cellActionReturn(cell,type,xmlDoc) {
	var dbCells = this;
	dbCells.setCellState(cell,'current');
	if ( type == "update" ) {
	    var node = $(xmlDoc).find('records record ' + cell.data('name'));
	    if ( node.length > 0 ) {
		dbCells.setCellValue(cell,node.text());
	    }
	}
	$(xmlDoc).find('calculated *').each(function(){
	    var node = $(this);
	    dbCells.container.find('#'+node[0].nodeName).each(function(){
		if ( $(this).is('input, select, textarea') ) {
		    $(this).val(node.text());
		} else {
		    $(this).html(node.text());
		}
	    });
	});
	$(xmlDoc).find('html *').each(function(){
	    var node = $(this);
	    $('#'+node[0].nodeName).each(function(){
		if ( $(this).is('input, select, textarea') ) {
		    $(this).val(node.text());
		} else {
		    $(this).html(node.text());
		}
	    });
	});
	if ( $(xmlDoc).find('info').length > 0 ) {
	    this.setStatus($(xmlDoc).find('info').text());
	}
	if ( $(xmlDoc).find('alert').length > 0 ) {
	    alert($(xmlDoc).find('alert').text());
	}
	cell.trigger('cellActionReturn',[type, xmlDoc]);
    }
    function cellActionReturnError(cell,type,errorMessage,errorType) {
	this.setCellState(cell,'error');
	if ( errorType != 'USER' ) {
	    alert(errorMessage);
	}
	cell.trigger('cellActionReturnError',[type,errorMessage,errorType]);
    }
    function onBeforeUnload(event) {
	if ( typeof this.currentCell == "undefined" ) {
	    return false;
	}
	if ( this.getCellState(this.currentCell) == 'dirty' ) {
	    if ( window.confirm('Do you want to save your changes?') ) {
		this.save(this.currentCell, false);
		if ( this.getCellState(this.currentCell) == 'error' ) {
		    return "Your changes could not be saved.\nStay on the current page to correct.";
		}
	    }
	}
    }
    function onBeforePrint(event) {
	if ( typeof this.currentCell != "undefined" ) {
	    this.cellOut(this.currentCell);
	}
    }
    function onResize(event) {
	if ( typeof this.currentCell != "undefined" ) {
	    this.cellOut(this.currentCell);
	}
    }
    function cellOnBlur(event) {
	/*var activeElmt=document.activeElement;
	if ( this.container.find(activeElmt).length == 0
	     && (oInputCtl && activeElmt!=oInputCtl)
	     && this.currentCell) {
	    if ( this.settings.updateType=="onCellOut"
		 && this.getCellState(this.currentCell) == 'dirty') {
		this.save(this.currentCell);
	    }
	    }*/
	//console.log("dbCells cellOnBlur " + $(event.target).text());
	if ( $(event.target).is(this.currentCell) && ! this.currentCell.data('focussing') ) {
	    this.cellOut(this.currentCell);
	}
	//console.log("/cellOnBlur");
    }
    function cellOnKeyDown(event) {
	//console.log("dbCells cellOnKeyDown " + event.which);
	// cell controls should only propogate key events when default dbCells behavior is desired.
	if ( event.altKey ) {
	    return true;
	}
	switch (event.which) {
	case 37: //left
	    this.cellChange(moveLeft.call(this,this.curentCell));
	    break;
	case 38: //up
	    this.cellChange(moveUp.call(this,this.currentCell));
	    break;
	case 39: //right
	    this.cellChange(moveRight.call(this,this.currentCell));
	    break;
	case 40: //down
	    this.cellChange(moveDown.call(this,this.currentCell));
	    break;
	case 9: //tab
	    var oldCell = this.currentCell;
	    if ( event.shiftKey ) {
		this.cellChange(moveLeft.call(this,this.currentCell));
	    } else {
		this.cellChange(moveRight.call(this,this.currentCell));
	    }
	    break;
	case 13: //return
	    var oldCell = this.currentCell;	    
	    this.cellChange(moveRight.call(this,this.currenCell));
	    if ( this.currentCell == oldCell ) {
		this.save();
	    }
	    break;
	case 46: //delete
	    if ( typeof this.currentCell.data('deleteUrl') != "undefined" ) {
		var cell = this.currentCell;
		this.cellOut(cell);
		this.cellAction(cell,'delete',cell.data('deleteUrl'));
	    }
	    break;
	case 83: //s
	    if ( event.ctrlKey ) {
		this.save();
		event.preventDefault();
	    }
	    break;
	}
	//console.log("/cellOnKeyDown");
    }
    function cellOnMouseUp(event) {
	var cell = $(event.target);
	if ( this.cells.index(cell) > -1 ) {
	    if ( this.isCellEditable(cell) ) {
		this.cellChange(cell);
	    }
	}
    }
    function cellWrite(cell) {
	if ( typeof cell != "object" ) {
	    $.error('cellWrite requires a cell');
	}
	this.setCellValue(cell,cell.dbCellControl('getValue'));
    }
    function cellOnKeyUp(event) {
	//console.log("dbCells onKeyUp " + event.which);
	var cell = $(event.target);
	var oldValue = this.getCellValue(cell);
	var newValue = cell.dbCellControl('getValue');
	if ( oldValue != newValue ) {
	    this.setCellState(cell,'dirty');
	}
	if ( this.settings.updateType == "onKeyUp" ) {
	    this.cancelDelayedSave();
	    this.keyUpTimer = setTimeout(this.delayedSave.bind(this),750);
	}
	//console.log("/onKeyUp");
    }
    function cellOnCut(event) {
	this.setCellState(this.currentCell,'dirty');
    }
    function cellOnPaste(event) {
	this.setCellState(this.currentCell,'dirty');
    }

    function sameRow(a,b) {
	return (a.offset().top <= (b.offset().top + b.outerHeight()))
	    && ((a.offset().top + a.outerHeight()) >= b.offset().top);
    }
    function belowRow(a,b) {
	return b.offset().top > (a.offset().top + a.outerHeight());
    }
    function aboveRow(a,b) {
	return (b.offset().top + b.outerHeight()) < a.offset().top;
    }
    function sameColumn(a,b) {
	return (a.offset().left <= (b.offset().left + b.outerWidth()))
	    && ((a.offset().left + a.outerWidth()) >= b.offset().left);
    }
    function leftOfColumn(a,b) {
	return (b.offset().left + b.outerWidth()) < a.offset().left;
    }
    function rightOfColumn(a,b) {
	return (a.offset().left + a.outerWidth()) < b.offset().left;
    }

    function moveRight(fromCell) {
	if ( typeof fromCell != "object" ) {
	    var fromCell = this.currentCell;
	}
	var nextCell;
	var fromCellLeft = fromCell.offset().left;
	this.cells.each(function() {
	    var cell = $(this);
	    var cellLeft = cell.offset().left;
	    if ( sameRow(cell,fromCell)
		 && cellLeft > fromCellLeft
		 && ( typeof nextCell == "undefined" || cellLeft < nextCellLeft )
	       ) {
		nextCell = cell;
		nextCellLeft = cellLeft;
	    }
	});
	if ( typeof nextCell == "undefined" ) {
	    this.cells.each(function() {
		var cell = $(this);
		var cellLeft = $(cell).offset().left;
		if ( belowRow(fromCell,cell)
		     && (typeof nextCell == "undefined"
			 || aboveRow(nextCell,cell)
			 || (sameRow(cell,nextCell) && cellLeft < nextCellLeft)
			)
		   ) {
		    nextCell = cell;
		    nextCellLeft = cellLeft;
		}
	    });
	}
	if ( typeof nextCell == "undefined" ) {
	    return fromCell;
	} else {
	    return nextCell;
	}
    }
    function moveLeft(fromCell) {
	if ( typeof fromCell != "object" ) {
	    var fromCell = this.currentCell;
	}
	var nextCell;
	var fromCellLeft = fromCell.offset().left;
	this.cells.each(function() {
	    var cell = $(this);
	    var cellLeft = cell.offset().left;
	    if ( sameRow(cell,fromCell)
		 && cellLeft < fromCellLeft
		 && ( typeof nextCell == "undefined" || cellLeft > nextCellLeft )
	       ) {
		nextCell = cell;
		nextCellLeft = cellLeft;
	    }
	});
	if ( typeof nextCell == "undefined" ) {
	    this.cells.each(function() {
		var cell = $(this);
		var cellLeft = $(cell).offset().left;
		if ( aboveRow(fromCell,cell)
		     && (typeof nextCell == "undefined"
			 || belowRow(nextCell,cell)
			 || (sameRow(cell,nextCell) && cellLeft > nextCellLeft )
			)
		   ) {
		    nextCell = cell;
		    nextCellLeft = cellLeft;
		}
	    });
	}
	if ( typeof nextCell == "undefined" ) {
	    return fromCell;
	} else {
	    return nextCell;
	}
    }
    function moveUp(fromCell) {
	if ( typeof fromCell != "object" ) {
	    var fromCell = this.currentCell;
	}
	var nextCell;
	var fromCellTop = fromCell.offset().top;
	this.cells.each(function() {
	    var cell = $(this);
	    var cellTop = cell.offset().top;
	    if ( sameColumn(fromCell,cell)
		 && cellTop < fromCellTop
		 && (typeof nextCell == "undefined" || cellTop > nextCellTop)
	       ) {
		nextCell = cell;
		nextCellTop = cellTop;
	    }
	});
	if ( typeof nextCell == "undefined" ) {
	    this.cells.each(function() {
		var cell = $(this);
		var cellTop = cell.offset().top;
		if ( leftOfColumn(fromCell,cell)
		     && (typeof nextCell == "undefined"
			 || rightOfColumn(nextCell,cell)
			 || (sameColumn(cell,nextCell) && cellTop > nextCellTop)
			)
		   ) {
		    nextCell = cell;
		    nextCellTop = cellTop;
		};
	    });
	}
	if ( typeof nextCell == "undefined" ) {
	    return fromCell;
	} else {
	    return nextCell;
	}
    }
    function moveDown(fromCell) {
	if ( typeof fromCell != "object" ) {
	    var fromCell = this.currentCell;
	}
	var nextCell;
	var fromCellTop = fromCell.offset().top;
	this.cells.each(function() {
	    var cell = $(this);
	    var cellTop = cell.offset().top;
	    if ( sameColumn(fromCell,cell)
		 && cellTop > fromCellTop
		 && ( typeof nextCell == "undefined" || cellTop < nextCellTop )
	       ) {
		nextCell = cell;
		nextCellTop = cellTop;
	    }
	});
	if ( typeof nextCell == "undefined" ) {
	    this.cells.each(function() {
		var cell = $(this);
		var cellTop = cell.offset().top;
		if ( rightOfColumn(fromCell,cell)
		     && ( typeof nextCell == "undefined"
			  || leftOfColumn(nextCell,cell)
			  || (sameColumn(cell,nextCell) && cellTop < nextCellTop)
			)
		   ) {
		    nextCell = cell;
		    nextCellTop = cellTop;
		}
	    });
	}
	if ( typeof nextCell == "undefined" ) {
	    return fromCell;
	} else {
	    return nextCell;
	}
    }
    
    $.fn.dbCells = function() {
	var target = this;
	var returnValue;
	if ( typeof arguments[0] == "object" ) {
	    var options = arguments[0];
	}
	if ( ! target.data('dbCells') ) {
	    target.each(function(){
		$(this).data('dbCells', new DbCells($(this), options));
	    });
	}
	var dbCells = target.data('dbCells');
	if ( typeof arguments[0] == "string" ) {
	    var method = arguments[0];
	    if ( typeof dbCells[method] == "function" ) {
		if ( target.is(dbCells.container) ) {
		    returnValue = dbCells[method].apply(dbCells, Array.prototype.slice.call(arguments,1));
		} else {
		    returnValue = dbCells[method].apply(dbCells, [target].concat(Array.prototype.slice.call(arguments,1)));
		}
	    }
	}
	if ( typeof returnValue == "undefined" ) {
	    return target;
	} else {
	    return returnValue;
	}
    };
})(jQuery);

/* ==== jquery.dbEditorBool.js ==== */
// dbEditorBool plugin
// A hovering editor for boolean input
;(function($, window, undefined) {

    // css attributes to copy from the target element to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorBool', {
	_create: function() {
	    // Constructor function - create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });
	    this.editor = $('<div>')
		.attr('contentEditable',true)
		.addClass('dbEditorBool')
		.appendTo(this.element)
		.css({
		    'position': "absolute"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
	},
	getValue: function() {
	    // Get the current value of the editor
	    return parseBoolean(this.editor.text());
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = $(element);
	    this.editor.show();
	    this.repaint()
	    if ( parseBoolean(value) ) {
		this._setTrue();
	    } else {
		this._setFalse();
	    }	   
	},
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	}, 
	repaint: function() {
	    // repaint the editor
	    if ( this.currentElement.length == 1 ) {
		var editor = this.editor;
		var element = this.currentElement;

		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent'
		     || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}
		// position
		editor.css(element.positionRelativeTo(this.editor.offsetParent()));
	    }
	},
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	_setTrue: function() {
	    this.editor.html('<span class=clsTrue>Yes</span>');
	},
	_setFalse: function() {
	    this.editor.html('<span class=clsFalse>No</span>');
	},
	_onResize: function(event) {
	    // Any event that might change the size or position of the editor's target needs to trigger this.
	    // It is bound to the window resize event, so triggering a resize event on any element should propagate up and trigger this.
	    // Ensures that the editor is still positioned correctly over the target element.
	    if ( this.currentElement ) {
		var element = this.currentElement;
		var editor = this.editor;
		$.each(['width', 'height'], function(i, name){
		    editor.css(name, element.css(name));
		});
		editor.css(element.positionRelativeTo(this.element));
	    }
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behaviour.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}
	    case 38: // up
	    case 37: // left
	    case 40: // down
	    case 39: // right
	    case 46: // delete 
	    case 13: // return
	    case 9: // tab 
		break;
	    
	    default: return true 
	    }

	    // propagate event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    e.preventDefault();
	    this.currentElement.trigger(event);
	},
	_inputOnKeyUp: function(e) {
	     switch(e.which) {
	     case 97: // 1
	     case 49: // 1
	     case 84: // t
	     case 89: // y
		 this._setTrue();
		 break;
	     case 96: // 0
	     case 48: // 0
	     case 70: // f
	     case 78: // n
		 this._setFalse();
		 break; 
	     }

	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
	    if ( this.getValue() ) {
		this._setFalse();
	    } else {
		this._setTrue();
	    }

	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e, source) {
	    // If handlers responding to an event that caused the editor to lose focus cause it to regain focus, don't pass the blur event on to the target element (especially since the current target has probably changed since then).
	    // Otherwise, pass blur events on to the target element.
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorCombo.js ==== */
// dbEditorCombo plugin
// A hovering editor for with combo completion
;(function($, window, undefined) {

    // css attributes to copy from the target element to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height'];
        
    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorCombo', {
	_create: function() {
	    // Create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });

	    this.editor = $('<input type="text">')
		.addClass('dbEditorCombo')
		.appendTo(this.element)
		.css({
		    'position': "absolute", 
		    'background': "white", 
		    'overflow': "visible", 
		    '-moz-box-sizing': "content-box", 
		    '-ms-box-sizing': "content-box", 
		    'box-sizing': "content-box", 
		    'z-index': 1
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });

	    this.comboOptions = $('<div>')
		.addClass('dbEditorComboOptions')
		.appendTo(this.element)
		.css({
		    'position':'absolute',
		    'overflow':'auto',
		    'z-index': 1
		})
		.hide();
	    this._on(this.comboOptions, {
		'mouseup div': this._comboOptionMouseUp,
		'mouseenter div': this._comboOptionMouseEnter
	    });

	    this.currentElement = $([]);
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.val();
	}, 
	show: function(element, value, searchURL){
	    // Show this editor positioned over the target element and set the value of the editor
	    this.currentElement = $(element);
	    this.editor.show();
	    this.lastValue = value;
	    this.searchURL = searchURL;
	    this.repaint();
	    this.editor.val(value);
	}, 
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor
		.add(this.comboOptions)
		.hide();
	},
	selectOption: function(index) {
	    // Select the option for this 0-based index
	    this.comboOptions.children('.selected').removeClass('selected');
	    this.comboOptions.children(':nth-child(' + (index + 1) + ')').addClass('selected');
	},
	repaint: function() {
	    // repaint the editor
	    if ( this.currentElement.length == 1 ) {
		var editor = this.editor;
		var comboOptions = this.comboOptions;
		var element = this.currentElement;

		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

		// Copy various style from the editor to combo options div
		var copyOptionsAttributes = ['backgroundColor', 'borderTopStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderRightStyle', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontSize', 'fontFamily', 'fontWeight', 'width'];
		$.each(copyOptionsAttributes, function(i, name){
		    comboOptions.css(name, editor.css(name));
		});
		var borderWidth = Math.max(
		    parseInt(editor.css('borderTopWidth')),
		    parseInt(editor.css('borderRightWidth')),
		    parseInt(editor.css('borderBottomWidth')),
		    parseInt(editor.css('borderLeftWidth'))
		) + 'px';
		comboOptions.css({
		    'borderTopWidth': borderWidth,
		    'borderRightWidth': borderWidth,
		    'borderBottomWidth': borderWidth,
		    'borderLeftWidth': borderWidth
		});
		    

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent'
		     || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor
			.add(comboOptions)
			.css('backgroundColor', "white");
		} else {
		    editor
			.add(comboOptions)
			.css('backgroundColor', element.css('backgroundColor'));
		}

		// position
		var position = element.positionRelativeTo(this.editor.offsetParent());
		editor.css({
			'left': position.left,
			'top': position.top
		});
		comboOptions.css({
		    'left': position.left - parseInt(comboOptions.css('border-left_width')),
		    'top': position.top + editor.outerHeight() - parseInt(comboOptions.css('border-top-width'))
		});
	    }
	}, 
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	search: function() {
	    // Server side search for available options
	    dbEditorCombo = this;
	    dbEditorCombo.comboOptions.show().text("Searching ...");
	    
	    jQuery.ajax({
		url: dbEditorCombo.searchURL,
		data: {
		    value: dbEditorCombo.getValue()
		},
		dataType: 'xml',
		async: false,
		cache: false,
		success: function(data) {
		    dbEditorCombo.searchReturn(data)
		},
		error: function(jqXHR, textStatus, errorThrown) {
		    dbEditorCombo.comboOptions.text("Software Bug ! " + textStatus + ': ' + errorThrown);
		}   
	    });
	},
	searchReturn: function(xmlDoc) {
	    // Populate comboOptions element with server response
	    var comboOptions = this.comboOptions;
	    comboOptions.empty();

	    var rec = jQuery('error:first', xmlDoc);
	    if ( rec.size() ) {
		// Error returned by Server
		comboOptions.text(rec.text());
	    } else {
		// Success
		var recs = jQuery('records > record > option', xmlDoc);
		if ( recs.size() ) {
		    // Matches Found
		    recs.each(function() {
			var comboOption = jQuery('<div>')
			    .text($(this).text())
			    .css({
				'width': '100%',
				'cursor': 'pointer'
			    })
			    .appendTo(comboOptions);
		    });
		    // selectOption first option
		    this.selectOption(0);
		} else {
		    // No Matches
		    comboOptions.text("No Matches");
		}
	    }
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	  
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}	   
	    case 39: // right
		if ( selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}
	    case 38: // up
		if ( this.comboOptions.is(':visible') ) {
		    // navigate within comboOptions if it is visible
		    var index = this.comboOptions.children('.selected').prev().index();
		    if ( index !== -1 ) {
			this.selectOption(index);
		    }
		    return true
		}
	    case 40: // down
		if ( this.comboOptions.is(':visible') ) {
		    // navigate within comboOptions if it is visible
		    var index = this.comboOptions.children('.selected').next().index();
		    if ( index !== -1 ) {
			this.selectOption(index);
		    }
		    return true
		}
	    case 9: // tab 
	    case 13: // return
		if ( this.comboOptions.is(':visible') ) {
		    // Update editor with the selected comboOption
		    var option = this.comboOptions.children('.selected');
		    if ( option.index() !== -1 ) {
			this.editor.val(option.text());
			this.lastValue = option.text();
			// trigger keyup on editor to let it listeners know that it's value has changed
			this.editor.trigger('keyup');
			this.comboOptions.hide();
		    }
		}

	    case 46: // delete 
		break;

	    default: return true 
	    }

	    // propagate custom event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    e.preventDefault();
	    this.currentElement.trigger(event);
	},
	_inputOnKeyUp: function(e) {
	    if ( this.getValue() !== this.lastValue ) {
		// Search for combo options		
		this.lastValue = this.getValue()
		this.search();
	    }	    

	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e, source) {
	    if ( ! this.editor.is(':focus') ) {
		// really is blurred
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	},
	_comboOptionMouseUp: function(e) {
	    // Select the target option and update editor value
	    var option = $(e.currentTarget);
	    
	    this.selectOption(option.index());
	    this.editor.val(option.text());
	    this.lastValue = option.text();	   
	    this.selectText('end');
	    this.comboOptions.hide();
	    // trigger keyup on editor to let it listeners know that it's value has changed
	    this.editor.trigger('keyup');
	    return true
	},
	_comboOptionMouseEnter: function(e) {
	    // Select the target option
	    var option = $(e.currentTarget);
	    
	    this.selectOption(option.index());
	    return true
	},
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	    this.comboOptions.remove();
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorHTMLArea.js ==== */
// dbEditorHTMLArea plugin
// A hovering editor for multi-line input with a contentEditable div to allow html markup
;(function($, window, undefined){

    // css attributes to copy from target elements to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorHTMLArea', {
	_create: function() {
	    // Constructor function - create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });
	    this.editor = $('<div>')
		.attr('contentEditable', true)
		.addClass('dbEditorHTMLArea')
		.appendTo(this.element)
		.css({
		    'overflow': "auto",
		    'position': "absolute"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
	    this.currentElement = $([]);
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.html();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = $(element);
	    this.editor.show();
	    this.repaint();
	    this.editor.html(value);
	},
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	repaint: function() {
	    if ( this.currentElement.length == 1 ) {
		// Copy various style from the target element to the editor
		var editor = this.editor;
		var element = this.currentElement;
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}

		// (Note: I haven't yet figured out why the +1 height is needed to stop scrollbars from appearing)
		editor
		    .height((typeof element.data('editorHeight') == "undefined") ? element.height() : element.data('editorHeight'))
		    .css(element.positionRelativeTo(this.editor.offsetParent()));
	    }
	},
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	    case 38: // up
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}
	    case 40: // down
	    case 39: // right
		if ( selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}

	    case 46: // delete 
		break;
	    case 13: // return
		if ( selection.selectionAtStart && selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 9: // tab 
		break;

	    default: return true 
	    }

	    // propagate custom event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    e.preventDefault();
	    this.currentElement.trigger(event);
	},
	_inputOnKeyUp: function(e) {
	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e, source) {
	    // If handlers responding to an event that caused the editor to lose focus cause it to regain focus, don't pass the blur event on to the target element (especially since the current target has probably changed since then).
	    // Otherwise, pass blur events on to the target element.
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorText.js ==== */
// dbEditorText plugin
// A hovering editor for single-line input
;(function($, window, undefined) {

    // css attributes to copy from the target element to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorText', {
	_create: function() {
	    // Create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });
	    this.editor = $('<input type="text">')
		.addClass('dbEditorText')
		.appendTo(this.element)
		.css({
		    'position': "absolute", 
		    'background': "white", 
		    'overflow': "visible", 
		    '-moz-box-sizing': "content-box", 
		    '-ms-box-sizing': "content-box", 
		    'box-sizing': "content-box", 
		    'z-index': 1
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
	    this.currentElement = $([]);
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.val();
	}, 
	show: function(element, value){
	    // Show this editor positioned over the target element and set the value of the editor
	    this.currentElement = $(element);
	    this.editor.show();
	    this.repaint();
	    this.editor.val(value);
	}, 
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	repaint: function() {
	    // repaint the editor
	    if ( this.currentElement.length == 1 ) {
		var editor = this.editor;
		var element = this.currentElement;

		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent'
		     || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}
		// position
		editor.css(element.positionRelativeTo(this.editor.offsetParent()));
	    }
	}, 
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	  
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}	   
	    case 39: // right
		if ( selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}
	    case 38: // up
	    case 40: // down
	    case 46: // delete 
	    case 13: // return
	    case 9: // tab 
		break;

	    default: return true 
	    }

	    // propagate custom event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    e.preventDefault();
	    this.currentElement.trigger(event);
	},
	_inputOnKeyUp: function(e) {
	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e, source) {
	    if ( ! this.editor.is(':focus') ) {
		// really is blurred
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorTextArea.js ==== */
// dbEditorTextArea plugin
// A hovering editor for multi-line text input
;(function($, window, undefined){

    // css attributes to copy from target elements to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height'];

    // Uses the jQuery UI widget factory
    $.widget( 'qcode.dbEditorTextArea', {
	_create: function() {
	    // Constructor function - create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });
	    this.editor = $('<textarea>')
		.appendTo(this.element)
		.addClass('dbEditorTextArea')
		.css({
		    'position': "absolute", 
		    'resize': "none", 
		    '-moz-box-sizing': "content-box", 
		    '-ms-box-sizing': "content-box", 
		    'box-sizing': "content-box", 
		    'overflow': "auto"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
	    this.currentElement = $([]);
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.val();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = $(element);
	    this.editor.show();
	    this.repaint();
	    this.editor.val(value);
	}, 
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.currentElement = $([]);
	    this.editor.hide();
	},
	repaint: function() {
	    if ( this.currentElement.length == 1 ) {
		var editor = this.editor;
		var element = this.currentElement;
		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}

		// (Note: I haven't yet figured out why the +1 height is needed to stop scrollbars from appearing)
		editor
		    .css({
			'height': "+=1", 
			'padding-bottom': "-=1"
		    })
		    .css(element.positionRelativeTo(this.editor.offsetParent()));
	    }
	},
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	    case 38: // up
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}
	    case 40: // down
	    case 39: // right
		if ( selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}

	    case 46: // delete 
		break;
	    case 13: // return
		if ( selection.selectionAtStart && selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 9: // tab 
		break;

	    default: return true 
	    }

	    // propagate event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    e.preventDefault();
	    this.currentElement.trigger(event);
	},
	_inputOnKeyUp: function(e) {
	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e) {
	    // If handlers responding to an event that caused the editor to lose focus cause it to regain focus, don't pass the blur event on to the target element (especially since the current target has probably changed since then).
	    // Otherwise, pass blur events on to the target element.
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbField.js ==== */
// dbField plugin - a field in a dbRecord.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget( "qcode.dbField", {
	_create: function() {
	    // saveType
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType, this.getRecord().dbRecord("option", "saveType"))
	    
	    if ( this.options.saveType === 'fieldOut' ) {
		this._on({
		    'dbFieldOut': function() {
			if ( this.getRecord().dbRecord('getState') === "dirty" ) {
			    this.getRecord().dbRecord('save');
			}
		    }
		});
	    }
	},
	getRecordSet: function() {
	    return this.element.closest('.recordSet');
	},
	getRecord: function(){
	    return this.element.closest('.record');
	},
	getName: function() {
	    return this.element.attr('name');
	},
	getValue: function(){
	    if ( this.getType() == "htmlarea" ) {
		return this.element.html();
	    } else if ( this.element.is(':input') ) {
		return this.element.val();
	    } else {
		return this.element.text();
	    }
	}, 
	setValue: function(newValue){
	    if ( this.getType() == "htmlarea" ) {
		this.element.html(newValue);
	    } else if ( this.element.is(':input') ) {
		this.element.val(newValue);
	    } else {
		this.element.text(newValue);
	    }
	}, 
	fieldIn: function(select){
	    // Show the editor on this field
	    // select can be one of "all", "start" or "end", and indicates the text range to select
	    var recordSet = this.getRecordSet();
	    
	    recordSet.dbRecordSet('setCurrentField', this.element);
	    this.element.css('visibility', "hidden");
	    
	    // Call the appropriate dbEditor plugin on the record set to show the editor over this field
	    this.editor('show', this.element, this.getValue());

	    // Optionally set the text selection
	    if (select) {
		this.editor('selectText', select);
	    } else if ( this.element.attr('fieldInSelect') != null ) {
		this.editor('selectText', this.element.attr('fieldInSelect'));
	    } else {
		this.editor('selectText', 'all');
	    }
	    // custom event
	    this.element.trigger('dbFieldIn');
	}, 
	fieldOut: function(){
	    var recordSet = this.getRecordSet();
	    recordSet.dbRecordSet('setCurrentField', null);

	    // Check if dirty
	    if ( this.getValue() !== this.editor('getValue') ) {
		this.write();
		var record = this.getRecord();
		record.dbRecord('setState', 'dirty');
	    }

	    this.element.css('visibility', "inherit");
	    this.editor('hide');
	    // custom event
	    this.element.trigger('dbFieldOut');
	}, 
	getType: function(){
	    // Returns the field type (text, textarea, or htmlarea)
	    return coalesce(this.element.attr('type'), "text");
	}, 
	isEditable: function(){
	    return (this.element.is('.editable') && this.getRecord().dbRecord('getState') != "updating");
	}, 
	onMouseDown: function(event){
	    if ( this.isEditable() ) {
		this.getRecordSet().dbRecordSet('fieldChange', this.element);
		// Don't blur the editor that we just showed
		event.preventDefault();
	    }
	}, 
	editorKeyDown: function(event){
	    // Capture key down events propagated here by the editor
	    if ( event.altKey ) {
		return true;
	    }
	    var recordSet = this.getRecordSet();
	    var field = this.element;
	    var fields = recordSet.find('.editable');
	    switch (event.which) {
	    case 37: // left arrow
		recordSet.dbRecordSet('fieldChange', field.westOf(fields));
		break;
	    case 38: // up arrow
		recordSet.dbRecordSet('fieldChange', field.northOf(fields));
		break;
	    case 39: // right arrow
		recordSet.dbRecordSet('fieldChange', field.eastOf(fields));
		break;
	    case 40: // down arrow
		recordSet.dbRecordSet('fieldChange', field.southOf(fields));
		break;
	    case 9: // tab key 
		if ( event.shiftKey ) {
		    var newField = field.westOf(fields);
		} else {
		    var newField = field.eastOf(fields);
		}
		if ( newField == field ) {
		    // save if on last record 
		    this.getRecord().dbRecord('save');
		} else {
		    recordSet.dbRecordSet('fieldChange', newField);
		}
		break;
	    case 13: // return key
		var newField = field.eastOf(fields);
		if ( newField == field ) {
		    // save if on last record 
		    this.getRecord().dbRecord('save');
		} else {
		    recordSet.dbRecordSet('fieldChange', newField);
		}
		break;
	    case 83: // Ctrl + S - save the current record.
		if ( event.ctrlKey ) {
		    this.getRecord().dbRecord('save');
		    event.preventDefault();
		}
		break;
	    }
	}, 
	editorKeyUp: function(event){
	    if ( this.getValue() !== this.editor('getValue') ) {
		// Set dirty
		this.getRecord().dbRecord('setState', 'dirty');
	    }
	}, 
	editorCut: function(){
	    // Set as dirty
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	editorPaste: function(){
	    // Set as dirty
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	editorBlur: function(){
	    // When the editor becomes blurred, move out.
	    this.fieldOut();
	}, 
	write: function(){
	    // Write the editor's contents to the field
	    this.setValue(this.editor('getValue'));
	},
	editor: function(method) {
	    var recordSet = this.getRecordSet();
	    var pluginName;
	    switch(this.getType()){
	    case "text":
		pluginName="dbEditorText";
		break;
	    case "textarea":
		pluginName="dbEditorTextArea";
		break;
	    case "htmlarea":
		pluginName="dbEditorHTMLArea";
		break;
	    }
	    return recordSet[pluginName].apply(recordSet, arguments);
	}
    });
})(jQuery);

/* ==== jquery.dbForm.js ==== */
(function($, undefined){
    function DbForm(form) {
	this.form = $(form);
	this.elements = $([]);
    }
    $.extend(DbForm.prototype, {
	init: function(options) {
	    this.settings = $.extend({
		formType: "update",
		enabled: true,
		checkOnExit: true,
		initialFocus: true
	    }, options);
	    if ( typeof this.settings.formActionReturn == "function" ) {
		this.form.on('formActionReturn.DbForm', this.settings.formActionReturn);
	    }

	    this.state = 'current';
	    this.divStatus = this.form.find('div.clsDbFormDivStatus').last();
	    this.elements = this.elements.add('input', this.form).add('select', this.form).add('textarea', this.form).add('div.clsDbFormHTMLArea, div.clsRadioGroup', this.form);
	    this.error = undefined;
	    if ( typeof this.settings.dataURL != "undefined" ) {
		this.formAction('requery', this.settings.dataURL);
	    }
	    if ( typeof this.settings.qryURL != "undefined" ) {
		this.nav('FIRST');
	    }
	    this.form.on('change.DbForm', 'select', this.setDirty.bind(this));
	    this.form.on('click.DbForm', 'input[type="checkbox"], input[type="radio"]', this.setDirty.bind(this));
	    if ( this.settings.checkOnExit && this.settings.formType === "update" ) {
		$(window).on('beforeunload.DbForm', onBeforeUnload.bind(this));
	    }
	    this.form.on('keydown.DbForm', onKeyDown.bind(this));
	    this.form.on('keypress.DbForm', onKeyPress.bind(this));
	    this.form.on('submit.DbForm', onSubmit.bind(this));
	    if ( this.settings.initialFocus ) {
		this.focus();
	    }
	    if ( typeof this.settings.initialFind == "string" ) {
		var name = this.settings.initialFind.split('=')[0];
		var value = this.settings.initialFind.split('=')[1];
		this.find(name, value);
	    }
	},
	save: function() {
	    switch( this.settings.formType ) {
	    case "update":
		this.setState('updating');
		this.formAction('update', this.settings.updateURL);
		break;
	    case "add":
		this.setState('updating');
		this.formAction('add', this.settings.addURL);
		break;
	    case "submit":
		this.form.attr('action', this.settings.submitURL);
		this.elements.filter('div.clsDbFormHTMLArea').each(function(i, div){
		    this.form.append(
			$('<input type="hidden">')
			    .attr('name', $(div).attr('name'))
			    .val($(div).html())
		    );
		}.bind(this));
		this.elements.filter('input[type="checkbox"]:not(:checked)').each(function(i, input) {
		    if ( $(input).attr('boolean') ) {
			this.form.append(
			    $('<input type="hidden">')
				.attr('name', $(input).attr('name'))
				.val("false")
			);
		    }
		}.bind(this));
		this.form.submit();
		break;
	    }
	},
	formAction: function(type,url,handler,errorHandler,async) {
	    var dbForm = this;
	    if ( typeof handler == "undefined" ) {
		handler = function(data, textStatus, jqXHR){
		    formActionSuccess.call(dbForm, data, type);
		}
	    }
	    if ( typeof errorHandler == "undefined" ) {
		errorHandler = function(errorMessage, errorType){
		    formActionError.call(dbForm, errorMessage);
		}
	    }
	    if ( typeof async == "undefined" ) {
		async = false;
	    }
	    httpPost(url, formData.call(this, this.form), handler, errorHandler, async);
	},
	focus: function() {
	    this.elements.each(function(){
		$(this).focus();
		return ! $(this).is(':focus');
	    });
	},
	nav: function(navTo) {
	    this.form.find('[name="navTo"]').val(navTo);
	    if ( this.state === "dirty" ) {
		this.save();
	    } else {
		this.setState('loading');
		this.formAction('qry', this.settings.qryURL);
	    }
	},
	find: function() {
	    if ( this.state === "dirty" ) {
		this.save();
	    } else {
		this.setState('loading');
	    }
	    var data = {};
	    for(var i = 0; i < arguments.length; i+=2){
		data[arguments[i]] = arguments[i+1];
	    }
	    var dbForm = this;
	    httpPost(this.settings.searchURL, data, function(data, textStatus, jqXHR) {
		formActionSuccess.call(dbForm, data, "search");
	    }, formActionError.bind(this), true);
	},
	del: function() {
	    if ( window.confirm('Delete the current record?') ) {
		this.setState('deleting');
		this.formAction('delete',this.settings.deleteURL);
	    }
	},
	setState: function(newState) {
	    switch(newState) {
	    case "dirty":
		var span = $('<span>').text('save').click(this.save.bind(this)).addClass('clickToSave');
		var message = $('<span>').text('Editing ... To ').append(span).append(', type Ctrl+S');
		this.setStatus(message);
		this.form.find('[name="nav_new"]').prop('disabled', ( ! this.settings.addURL) );
		this.form.find('[name="nav_prev"], [name="nav_next"]').prop('disabled', false);
		break;
	    case "updating":
		this.setStatus('Updating ...');
		break;
	    case "current":
		switch(this.state) {
		case "updating":
		    this.setStatus('Saved.');
		    break;
		case "loading":
		    this.setStatus('');
		    break;
		case "deleting":
		    this.setStatus('Deleted.');
		    break;
		default:
		    this.setStatus('');
		    break;
		}
		break;
	    };
	    this.state = newState;
	},
	setDirty: function() {
	    this.setState('dirty');
	},
	setStatus: function(message) {
	    if ( typeof this.divStatus != "undefined" ) {
		$(this.divStatus).empty().append(message);
	    }
	}
    });
    function onBeforeUnload() {
	if ( this.state == 'dirty' ) {
	    if (window.confirm('Do you want to save your changes?')) {
		this.save();
		if (this.state == 'error' ) {
		    event.returnValue = "Your changes could not been saved.\nStay on the current page to correct.";
		}
	    }
	}
    }
    function onSubmit() {
	if ( this.settings.formType == 'submit' ) {
	    return true;
	}
	return false;
    }
    function onKeyDown(e) {
	if ( e.which == 83 && e.ctrlKey ) {
	    // Ctrl+S
	    this.save();
	    e.returnValue = false;
	    e.preventDefault();
	}
	// Backspace
	if ( e.which == 8) {
	    this.setState('dirty');
	}
    }
    function onKeyPress() {
	this.setState('dirty');
    }

    function formActionSuccess(xmlDoc, type) {
	var dbForm = this;
	$('records > record *', xmlDoc).each(function(i, xmlNode){
	    dbForm.form.find('#' + $(xmlNode).prop('nodeName') + ', [name="' + $(xmlNode).prop('nodeName') + '"]').each(function(j, target){
		if ( $(target).is('input, textarea, select') ) {
		    $(target).val($(xmlNode).text());
		} else {
		    $(target).html($(xmlNode).text());
		}
	    });
	});
	$('records > html *', xmlDoc).each(function(i, xmlNode){
	    $('#'+$(xmlNode).prop('nodeName')).each(function(j, target) {
		if ( $(target).is('input, textarea, select') ) {
		    $(target).val($(xmlNode).text());
		} else {
		    $(target).html($(xmlNode).text());
		}
	    });
	});
	
	if ( type == 'update' || type== 'add' ||  type== 'delete' || type=='qry') {
	    this.setState('current');
	}
	
	// Info
	var rec = $(xmlDoc).find('records > info').first();
	if ( rec.length == 1 ) {
	    this.setStatus(rec.text());
	}
	// Alert
	var rec = $(xmlDoc).find('records > alert').first();
	if ( rec.length == 1 ) {
	    alert(rec.text());
	}
	// Nav
	if ( this.form.find('[name="recordsLength"]').length > 0 && this.form.find('[name="recordNumber"]').length > 0 ) {
	    var recordsLength =  this.form.find('[name="recordsLength"]').val();
	    var recordNumber = this.form.find('[name="recordNumber"]').val();
	    if ( recordNumber==1 ) {
		this.form.find('[name="nav_first"]').prop('disabled', true);
		this.form.find('[name="nav_prev"]').prop('disabled', true);
	    } else {
		this.form.find('[name="nav_first"]').prop('disabled', false);
		this.form.find('[name="nav_prev"]').prop('disabled', false);
	    }
	    if ( recordNumber==recordsLength ) {
		this.form.find('[name="nav_last"]').prop('disabled', true);
		this.form.find('[name="nav_next"]').prop('disabled', true);
	    } else {
		this.form.find('[name="nav_last"]').prop('disabled', false);
		this.form.find('[name="nav_next"]').prop('disabled', false);
	    }
	    if ( recordNumber==0 ) {
		// New Record
		this.settings.formType = 'add';
		this.form.find('[name="nav_new"]').prop('disabled', true);
		this.form.find('[name="nav_prev"]').prop('disabled', true);
		this.form.find('[name="nav_next"]').prop('disabled', true);
		this.form.find('[name="nav_del"]').prop('disabled', true);
	    } else {
		this.settings.formType = 'update';
		if ( this.settings.addURL ) {
		    this.form.find('[name="nav_new"]').prop('disabled', false);
		} else {
		    this.form.find('[name="nav_new"]').prop('disabled', true);
		}
		if ( this.settings.deleteURL ) {
		    this.form.find('[name="nav_del"]').prop('disabled', false);
		} else {
		    this.form.find('[name="nav_del"]').prop('disabled', true);
		}
	    }
	    this.form.find('#recordIndicator').html(recordNumber + ' of ' + recordsLength);
	    this.form.find('[name="navTo"]').val('HERE');
	}
	// Event onFormActionReturn
	this.form.trigger('formActionReturn.dbForm', [type])
    }
    function formActionError(errorMessage) {
	this.setState('error');
	this.setStatus(errorMessage);
	alert("Your changes could not be saved.\n" + stripHTML(errorMessage));
	this.form.trigger('formActionError.dbForm', [errorMessage]);
    }

    function formData(form) {
	var data = {};
	this.elements
	    .filter(function(){ return $(this).prop('name') != ""; })
	    .filter(function(){ return $(this).prop('type') != "checkbox" || $(this).attr('boolean') == "true" || $(this).is(':checked'); })
	    .filter(function(){ return $(this).prop('type') != "radio" || $(this).is(':checked'); })
	    .filter(function(){ return ! $(this).is('div.clsRadioGroup'); })
	    .each(function(){
		var name = $(this).attr('name');
		var value = "";
		if ( $(this).is('input') ) {
		    if ( $(this).prop('type') == "checkbox" ) {
			if ( $(this).attr('boolean') == "true" ) {
			    value = $(this).is(':checked');
			} else {
			    value = $(this).is(':checked') ? $(this).val() : '';
			}
		    } else {
			value = $(this).val();
		    }
		} else if ( $(this).is('textarea') ) {
		    value = $(this).val();
		} else if ( $(this).is('select') ) {
		    value = $(this).val();
		} else {
		    value = $(this).html();
		}
		if ( data[name] === undefined ) {
		    data[name] = value;
		} else if ( typeof data[name] !== 'object' ) {
		    data[name] = new Array(data[name], value);
		} else {
		    data[name].push(value);
		}

	    });
	return data;
    }

    $.fn.dbForm = function(method) {
	var args = arguments;
	var forms = this;
	var returnVal;

	forms.each(function(){
	    var dbForm = $(this).data('dbForm');
	    if ( ! dbForm ) {
		dbForm = new DbForm($(this));
		$(this).data('dbForm', dbForm);
	    }
	    if ( typeof method == "object" || typeof method == "undefined" ) {
		dbForm.init.apply( dbForm, args );
	    } else if ( typeof dbForm[method] == "function" ) {
		returnVal = dbForm[method].apply( dbForm, Array.prototype.slice.call( args, 1 ) );
		if ( typeof returnVal != "undefined" ) {
		    return returnVal;
		}
	    } else if ( typeof dbForm.settings[method] != "undefined" && args.length == 1 ) {
		return dbForm.settings[method];
	    } else if ( typeof dbForm.settings[method] != "undefined" && args.length == 2 ) {
		dbForm.settings[method] = args[1];
	    } else if ( typeof dbForm[method] != "undefined" && args.length == 1 ) {
		return dbForm[method];
	    } else if ( typeof dbForm[method] != "undefined" && args.length == 2 ) {
		dbForm[method] = args[1];
	    } else {
		$.error( 'Method or property ' + method + ' does not exist on jQuery.dbForm' );
	    }
	});
	return forms;
    };
})(jQuery);

/* ==== jquery.dbFormCombo.js ==== */
;(function($, undefined) {
    function DbFormCombo(input, settings) {
	this.input = input;
	this.settings = $.extend({
	    searchUrl: "",
	    boundName: "",
	    searchLimit: 10,
	    comboWidth: input.outerWidth(),
	    comboHeight: 200,
	}, settings);
	this.div = $('<div>')
	    .css({
		'position': 'absolute',
		'width': this.settings.comboWidth,
		'height': this.settings.comboHeight,
		'overflow': 'auto',
		'top': input.position().top + input.outerHeight(),
		'left': input.position().left,
		'border': "1px solid black",
		'background': "white",
	    })
	    .appendTo('body')
	    .hide()
	    .hover(
		function(){$(this).addClass('hover');},
		function(){$(this).removeClass('hover');}
	    );
	this.lastValue = input.val();
	input
	    .on('keydown', onKeyDown.bind(this))
	    .on('keyup', onKeyUp.bind(this))
	    .on('blur', onBlur.bind(this));
    }
    $.extend(DbFormCombo.prototype, {
	show: function(){
	    this.div.show();
	    $('select').css('visibilty', 'hidden');
	},
	hide: function() {
	    this.div.removeClass('hover').hide();
	    $('select').css('visibility', 'visible');
	},
	highlight: function(index) {
	    this.currentItem.css({
		'background': "",
		'color': ""
	    });
	    this.currentItem = this.div.children().eq(index);
	    this.currentItem.css({
		'background': "highlight",
		'color': "highlighttext"
	    });
	},
	select: function(index) {
	    var form = this.input.closest('form');
	    var record = $(this.xmlDoc).find('record').eq(index);
	    form.find('[name="' + this.settings.boundName + '"]').val( $(record).find(this.settings.boundName).text() );
	    this.input.val( $(record).find(this.input.attr('name')).text() );
	    this.lastValue = this.input.val();
	    this.hide();
	    this.currentItem = undefined;
	    this.input.focus();
	    this.input.trigger('comboSelect');
	},
	updateList: function() {
	    this.div.empty();
	    this.div.on('click.dbFormCombo',divOnClick.bind(this));
	    this.div.on('mouseover.dbFormCombo',divOnMouseOver.bind(this));
	    var dbForm = this;
	    this.xmlDoc.find('record').each(function(i,record){
		var field = $(record).find(dbForm.input.attr('name'));
		$('<div>')
		    .css({
			'width': "100%",
			'cursor': "pointer"
		    })
		    .text( $(field).text() )
		    .appendTo( dbForm.div );
	    });
	    if ( this.div.children().length >= this.settings.searchLimit ) {
		this.div.append('.....');
	    }
	    this.currentItem = this.div.children().first();
	    this.highlight(0);
	}
    });
    function onKeyDown(event) {
	if ( typeof this.currentItem == "undefined" ) {
	    return;
	}
	var index = this.currentItem.index();
	switch (event.which) {
	case 38:
	    if ( index != 0 ) {
		this.highlight(index - 1);
	    }
	    break;
	case 40:
	    if ( index != (this.div.children().length - 1) ){
		this.highlight(index + 1);
	    }
	    break;
	case 13:
	    this.select(index);
	    event.preventDefault();
	    event.stopPropagation();
	    break;
	case 9:
	    this.select(index);
	    break;
	}
    }
    function onKeyUp(event) {
	if ( this.input.val() != this.lastValue ) {
	    this.lastValue = this.input.val();
	    search.call(this);
	}
    }
    function onBlur(event) {
	if ( ! this.div.is('.hover') ) {
	    this.hide();
	    this.currentItem = undefined;
	}
    }
    function divOnClick(event) {
	if ( ! this.div.is(event.target) ) {
	    this.select($(event.target).index());
	}
    }
    function divOnMouseOver(event) {
	if ( ! this.div.is(event.target) ) {
	    this.highlight($(event.target).index());
	}
    }
    function search(){
	this.currentItem = undefined;
	this.div.text('Searching ...');
	this.show();
	this.div.off('click.dbFormCombo');
	this.div.off('mouseover.dbFormCombo');
	this.xmlDoc = undefined;
	var dbForm = this;
	$.get(this.settings.searchURL, {
	    'name': this.input.attr('name'),
	    'value': this.input.val(),
	    'searchLimit': this.settings.searchLimit,
	    'boundName': this.settings.boundName
	}, "xml").success(function(data, textStatus, jqXHR){
	    dbForm.xmlDoc = $(data);
	    if ( dbForm.xmlDoc.find('error').length > 0 ) {
		dbForm.div.text( dbForm.xmlDoc.find('error').text() );
	    } else {
		if ( dbForm.xmlDoc.find('record').length > 0 ) {
		    dbForm.updateList();
		} else {
		    dbForm.div.text("No Matches");
		    dbForm.input.closest('form').find('[name="]'+dbForm.settings.boundName+'"]').val("");
		}
	    }
	}).error(function(jqXHR, textStatus, errorThrown){
	    dbForm.div.text("Software Bug ! " + errorThrown);
	});
    }

    $.fn.dbFormCombo = function() {
	var settings = {};
	if ( typeof arguments[0] == "object" ) {
	    var settings = arguments[0];
	} else if ( typeof arguments[0] == "string" ) {
	    var method = arguments[0];
	}
	var inputs = $(this);
	if ( inputs.not('input').length > 0 ) {
	    $.error('dbFrmCombo requires input elements');
	}
	var returnValue;
	inputs.each(function(i,element){
	    var input = $(element);
	    var dbFormCombo = input.data('dbFormCombo');
	    if ( ! dbFormCombo ) {
		dbFormCombo = new DbFormCombo(input, settings);
		input.data('dbFormCombo', dbFormCombo);
	    }
	    if ( method ) {
		if ( typeof dbForm[method] == "function" ) {
		    returnVal = dbForm[method].apply( dbForm, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof dbForm.settings[method] != "undefined" ) {
		    if ( arguments.length == 1 ) {
			returnValue = dbForm.settings[method];
		    } else if ( arguments.length == 2 ) {
			dbForm.settings[method] = arguments[1];
		    } else {
			$.error( 'Invalid argument count for jQuery.dbFormCombo' );
		    }
		} else if ( typeof dbForm[method] != "undefined" || method == "currentItem" ) {
		    if ( arguments.length == 1 ) {
			returnValue = dbForm[method];
		    } else if ( arguments.length == 2 ) {
			dbForm[method] = arguments[1];
		    } else {
			$.error( 'Invalid argument count for jQuery.dbFormCombo' );
		    }
		} else {
		    $.error( 'Method or property ' + method + ' does not exist on jQuery.dbFormCombo' );
		}
	    }
	    if ( typeof returnValue != "undefined" ) {
		return false; //Break out of each-loop
	    }
	});
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return inputs;
	}
    };
})(jQuery);

/* ==== jquery.dbFormHTMLArea.js ==== */
function dbFormHTMLArea(oDiv) {
    var oDiv = $(oDiv);
    var oForm = oDiv.closest('form');
    $(oForm).on('submit',function () {
	var oInput = $('<input type="hidden">')
	    .attr('name', oDiv.attr('name'))
	    .val(oDiv.html());
	oForm.append(oInput);
    });

// End 
}

/* ==== jquery.dbGrid.js ==== */
(function($, window, document, undefined){
    $.widget('qcode.dbGrid', {
	options: {
	    initialFocus: true,
	    enabled: true,
	    updateType: 'rowOut',
	    statusBar: true	    
	},
	_create: function(){
	    var dbGrid = this;
	    
	    // Plugin Variables
	    dbGrid.colgroup = this.element.children('colgroup');
	    dbGrid.tbody = dbGrid.element.children('tbody');
	    dbGrid.currentCell = $([]);
	    dbGrid.statusBar = $([]);
	    dbGrid.editorDiv = $([]);
	    dbGrid.recCount = dbGrid.tbody.children('tr').size();
	  	    
	    // Update options with those set via table attributes
	    var attributes = ['initialFocus', 'enabled', 'updateType', 'addURL', 'updateURL', 'deleteURL','dataURL','statusBar'];
	    $.each(attributes, function(i, name) {
		var value = dbGrid.element.attr(name);
		if ( value !== undefined ) {
		    dbGrid.option(name,value);
		}
	    });

	    // Create Optional Status Bar
	    if ( parseBoolean(dbGrid.option('statusBar')) === true ) {
		dbGrid.statusBar = $('<div class="clsDbGridDivStatus">');
		dbGrid.statusBar.attr('forTable', dbGrid.element.attr('id'));
		dbGrid.statusBar.append('<table width="100%"><tr><td></td><td align="right"></td></tr></table>');
		dbGrid.element.after(dbGrid.statusBar);
		dbGrid.statusBar.dbGridDivStatus();
	    } else {
		dbGrid.statusBar = $([]);
	    }

	    // Create a container to attach editors 
	    dbGrid.editorDiv = $('<div>');
	    dbGrid.editorDiv.addClass('clsDbGridDivEditor');
	    dbGrid.editorDiv.css('position','relative');
	    dbGrid.editorDiv.attr('forTable', dbGrid.element.attr('id'));
	    dbGrid.element.before(dbGrid.editorDiv);
	    dbGrid.element.add(dbGrid.editorDiv).wrapAll('<div class="wrapper">');
	    
	    // Enable the grid for editing
	    if ( dbGrid.option('enabled') ) {
		// Event listeners - instead of separate event listeners for each cell, delegated event listeners are added to the dbGrid.
		dbGrid._on(dbGrid.tbody, {
		    'mouseup td': function(event) {
			$(event.currentTarget).dbCell('onMouseUp');
		    },
		    'editorKeyDown td': function(event){
			$(event.currentTarget).dbCell('editorKeyDown', event);
		    },
		    'editorKeyUp td': function(event){
			$(event.currentTarget).dbCell('editorKeyUp', event);
		    },
		    'editorCut td': function(event){
			$(event.currentTarget).dbCell('editorCut', event);
		    },
		    'editorPaste td': function(event){
			$(event.currentTarget).dbCell('editorPaste', event);
		    },
		    'editorBlur td': function(event){
			$(event.currentTarget).dbCell('editorBlur', event);
		    }
		});
		dbGrid._on(window, {
		    'beforeunload': dbGrid._onBeforeUnload,
		    'beforeprint': dbGrid._onBeforePrint
		});
		
		// Create New Row
		if ( dbGrid.option('addURL') ) {
		    dbGrid.createNewRow();
		}

		// initialFocus
		$('body').one('pluginsReady', function() {
		    var initialFocusCell = dbGrid.getInitialFocusCell();
		    if ( initialFocusCell.size() ) {
			dbGrid.cellChange(initialFocusCell);
		    }
		});

		// preformatted columns
		var rows = dbGrid.tbody.children('tr');
		dbGrid.colgroup.children('[type=text],[type=textarea]').each(function() {
		    var col = $(this);
		    var colIndex = col.index();
		    
		    // apply class to existing td elements in tbody
		    rows.children('td:nth-child(' + (colIndex + 1)  + ')').addClass('preformatted')

		    // apply class to this column that can later be inherited by new rows
		    col.addClass('preformatted')
		});
	    }
	},
	getInitialFocusCell: function(){
	    var dbGrid = this;
	  
	    if ( dbGrid.option('initialFocus') === 'end' ) {
		// Return the first editable cell in the last row
		initialFocusCell = $('tr:last > td:first', dbGrid.tbody);
		if ( ! initialFocusCell.dbCell('isEditable') ) {
		    initialFocusCell = dbGrid.cellRightOf(initialFocusCell);
		}
		if ( initialFocusCell.dbCell('isEditable') ) {
		    return initialFocusCell
		}
	    } else if ( dbGrid.option('initialFocus') === "start" || parseBoolean(dbGrid.option('initialFocus')) === true ) {
		// Focus on first editableCell
		var initialFocusCell = $('tr:first > td:first', dbGrid.tbody);
		if ( ! initialFocusCell.dbCell('isEditable') ) {
		    initialFocusCell = dbGrid.cellRightOf(initialFocusCell);
		}
		if ( initialFocusCell.dbCell('isEditable') ) {
		    return initialFocusCell
		}
	    }

	    return $([]);
	},
	getEditorDiv: function(){
	    return this.editorDiv;
	},
	incrRecCount: function(i){
	    this.recCount += i;
	},
	setStatusBarMsg: function(message){
	    // Update the message displayed in the StatusBar.
	    $('tr:first td:first', this.statusBar).html(message);
	},
	setNavCounter: function(rowIndex){
	    // Update the NavCounter in the StatusBar using 0-based rowIndex.
	    var str = 'Record ' + (rowIndex + 1) + ' of ' + this.recCount;
	    $('tr:first td:last', this.statusBar).html(str);
	},
	getCurrentCell: function(){
	    return this.currentCell;
	},
	setCurrentCell: function(cell){
	    this.currentCell = cell;
	},
	cellChange: function(newCell){
	    // Perform any necessary cellOut/rowOut & cellIn/rowIn to begin editing newCell
	    var newRow = newCell.dbCell('getRow');
	    if ( ! this.currentCell.size() ) {
		// No cell is currently being edited
		newRow.dbRow('rowIn');
		newCell.dbCell('cellIn');
	    } else {
		var oldCell = this.currentCell;
		var oldRow = oldCell.dbCell('getRow');		
		if ( newRow.index() == oldRow.index() ) {
		    // Same Row 
		    oldCell.dbCell('cellOut');
		    newCell.dbCell('cellIn');
		} else {
		    // Row Change
		    oldCell.dbCell('cellOut');
		    oldRow.dbRow('rowOut');
		    newRow.dbRow('rowIn');
		    newCell.dbCell('cellIn');		    
		}
	    }
	},
	find: function(colName, search){
	    // Search within ColName.
	    // If search string is found begin editing corresponding record.
	    // Otherwise raise an alert.
	    var dbGrid = this;
	    var found = false;
	    var colIndex = this.colgroup.children('col[name=' + colName + ']').index();
	    if ( colIndex !== -1 ) {
		// found matching col element
		var colCells = this.tbody.children('tr').children('td:nth-child(' + (colIndex + 1) + ')');
		
		colCells.each(function() {
		    cell = $(this);
		    if ( cell.text() == search ) {
			// found matching cell
			if ( ! cell.dbCell('isEditable') ) {
			    // move to next editable cell within the same row
			    cell = dbGrid.cellRightOf(cell, false);
			}
			if ( ! cell.dbCell('isEditable') ) {
			    // move to previous editable cell with the same row
			    cell = dbGrid.cellLeftOf(cell, false);
			}
			if ( cell.dbCell('isEditable') ) {
			    dbGrid.cellChange(cell);
			    found = true;
			}
			return false; // break out of $.each loop			
		    }
		});
	    }
	    if ( ! found ) {
		alert("Could not find " + search + ".");
	    }
	},
	save: function(row,async) {
	    if ( row === undefined || ! row.size() ) {
		var row = this.currentCell.closest('tr');
	    }
	    row.dbRow('save',async);
	},
	delete: function(row){
	    if ( row === undefined || ! row.size() ) {
		var row = this.currentCell.closest('tr');
	    }
	    if ( row.dbRow('option', 'type') === 'update' ) {
		if ( window.confirm("Delete the current record?") ) {
		    row.dbRow('delete', false)
		}
	    }
	    if ( row.dbRow('option', 'type') == 'add' ) {
		if ( window.confirm("Delete the current row?") ) {
		    this.removeRow(row);
		    this.setStatusBarMsg('Deleted.');
		}
	    }
	},
	removeRow: function(row) {
	    // Try to move away from the current row
	    if ( row.find(this.currentCell).size() ) {
		// Move Down
		this.cellChange(this.cellBelow(this.currentCell));
	    }
	    if ( row.find(this.currentCell).size() ) {	
		// Still on same cell try to Move Up instead
		this.cellChange(this.cellAbove(this.currentCell));
	    }
            if ( row.find(this.currentCell).size() ) {
		// Failed to move away
		this.currentCell.dbCell('cellOut');
	    } 
	    row.remove();
	    this.element.trigger('resize');
	},
	createBlankRow: function(){
	    // Append a blank row to the dbGrid with type='update'
	    var row = $('<tr>');
	    var cols = this.colgroup.children('col');
	    for(var i=0;i<this.colgroup.children('col').size();i++) {
		var cell = $('<td>');
		var colClass = cols.eq(i).attr('class');
		if ( colClass ) {
		    cell.attr('class', colClass);
		}
		var colStyle = cols.eq(i).attr('style');
		if ( colStyle ) {
		    cell.attr('style', colStyle);
		}
		row.append(cell);
	    }
	    row.dbRow({'type': 'update'});

	    this.tbody.append(row);
	    return row;
	},
	createNewRow: function(){
	    // Append a new row to the dbGrid with type='add' and with any defaultValues defined on the colgroup
	    var row = $('<tr>');
	    var cols = this.colgroup.children('col');
	    for(var i=0;i<this.colgroup.children('col').size();i++) {
		var cell = $('<td>');
		var defaultValue = cols.eq(i).attr('defaultValue');
		if ( defaultValue ) {
		    cell.text(defaultValue);
		}
		var colClass = cols.eq(i).attr('class');
		if ( colClass ) {
		    cell.attr('class', colClass);
		}
		var colStyle = cols.eq(i).attr('style');
		if ( colStyle ) {
		    cell.attr('style', colStyle);
		}
		row.append(cell);
	    }
	    row.dbRow({'type': 'add'});

	    this.tbody.append(row);
	    return row;
	},
	requery: function(data, url){
	    // Remove all rows from the dbGrid and requery the dataURL to re-populate the grid
	    if ( url === undefined ) {
		url = this.option('dataURL');
	    }      
	    this.setStatusBarMsg('');
	    if ( this.currentCell.size() ) {
		this.currentCell.dbCell('cellOut');
	    }
	    // Remove all rows
	    this.tbody.children('tr').remove();
	    
	    httpPost(url,data,this._requeryReturn.bind(this),this._requeryReturnError.bind(this),false);
	},
	_requeryReturn: function(xmlDoc){
	    // Rebuild dbGrid from requeryReturn response
	    var dbGrid = this;

	    // Create rows for each record in xmlDoc
	    var records = $('records record', xmlDoc).each(function(){
		var rec = $(this);
		var row = dbGrid.createBlankRow();
		rec.children().each(function() {
		    var xmlNode = $(this);
		    var colName = xmlNode.prop('nodeName');
		    var value = xmlNode.text()
		    row.dbRow('setCellValue', colName, value);		    
		});	
	    });

	    // Update 'Calculated' elements within grid
	    $('records > calculated', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id, dbGrid.table).setObjectValue(value);
	    });

	    // Update html elements external to the grid
	    $('records > html', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id + ',[name="' + id + '"]').setObjectValue(value);
	    });
	    
	    if ( parseBoolean(dbGrid.option('enabled')) === true ) {
		// Create New Row
		if ( dbGrid.option('addURL') ) {
		    dbGrid.createNewRow();
		}

		// initialFocus
		var initialFocusCell = dbGrid.getInitialFocusCell();
		if ( initialFocusCell.size() ) {
		    dbGrid.cellChange(initialFocusCell);
		}
	    }
	},
	_requeryReturnError: function(errorMessage) {
	    this.setStatusBarMsg(errorMessage);
	    alert(errorMessage);
	},
	cellAbove: function(fromCell) {
	    // Return the first editable cell of the same column on previous rows. 
	    // Return fromCell if unable to find previous cell
	    var prevCell = $([]);
	    var prevRow = fromCell.closest('tr').prev('tr');
	    var colIndex = fromCell.index();

	    while ( prevRow.size() ) {
		prevCell = prevRow.children().eq(colIndex);
		if ( prevCell.size() && prevCell.dbCell('isEditable') && prevCell.dbCell('isTabStop') ) {
		    return prevCell;
		}
		prevRow = prevRow.prev('tr');
	    }
	    // Unable to find previous editable cell 
	    return fromCell;
	},
	cellRightOf: function(fromCell, searchNextRows) {
	    // Return the next editable cell (optionally search subsequent rows). 
	    // Return fromCell if unable to next editable cell
	    searchNextRows = searchNextRows === undefined ? true : searchNextRows;
	    var nextCell = fromCell.next('td');
	    
	    // Search for next editable cell on the same row
	    while ( nextCell.size() ) {
		if ( nextCell.dbCell('isEditable') && nextCell.dbCell('isTabStop') ) {
		    return nextCell;
		} 
		nextCell = nextCell.next('td');
	    }
	    if ( searchNextRows == true ) {
		// Search for next editable cell on any subsequent row.
		var nextRow = fromCell.closest('tr').next('tr');
		while ( nextRow.size() ) {
		    nextCell = nextRow.children('td').first();
		    while ( nextCell.size() ) {
			if ( nextCell.dbCell('isEditable') && nextCell.dbCell('isTabStop') ) {
			    return nextCell;
			}
			nextCell = nextCell.next('td');
		    }
		    nextRow = nextRow.next('tr');
		}
	    }
	    // Unable to find next editable cell 
	    return fromCell;
	},
	cellBelow: function(fromCell) {
	    // Return the first editable cell of the same column on subsequent rows.
	    var nextCell = $([]);
	    var nextRow = fromCell.closest('tr').next('tr');
	    var colIndex = fromCell.index();
	    
	    while ( nextRow.size() ) {
		nextCell = nextRow.children().eq(colIndex);
		if  (nextCell.size() && nextCell.dbCell('isEditable') && nextCell.dbCell('isTabStop') ) {
		    return nextCell;
		}
		nextRow = nextRow.next('tr');
	    }
	    // Unable to find next editable cell 
	    return fromCell;
	},
	cellLeftOf: function(fromCell, searchPreviousRows) {
	    // Return the previous editable cell (optionally search previous rows). 
	    // Return fromCell if unable to previous editable cell
	    searchPreviousRows = searchPreviousRows === undefined ? true : searchPreviousRows

	    var prevCell = fromCell.prev('td');
	    
	    // Search for previous editable cell on the same row
	    while ( prevCell.size() ) {
		if ( prevCell.dbCell('isEditable') && prevCell.dbCell('isTabStop') ) {
		    return prevCell;
		} 
		prevCell = prevCell.prev('td');
	    }
	    if ( searchPreviousRows == true ) {
		// Search for previous editable cell on any subsequent row.
		var prevRow = fromCell.closest('tr').prev('tr');
		while ( prevRow.size() ) {
		    prevCell = prevRow.children('td').last();
		    while ( prevCell.size() ) {
			if ( prevCell.dbCell('isEditable') && prevCell.dbCell('isTabStop') ) {
			    return prevCell;
			}
			prevCell = prevCell.prev('td');
		    }
		    prevRow = prevRow.prev('tr');
		}
	    }
	    // Unable to find previous editable cell 
	    return fromCell;
	},
	resize: function(colIndex, width){
	    // Resize the width of a column. Trigger resize event on window to resize any editors.
	    // 0-based colIndex
	    this.colgroup.children('col').eq(colIndex).width(width);
	    $(window).trigger('resize');
	},
	_onBeforeUnload: function(){
	    if ( ! this.currentCell.size() ) {	
		// No cells are begin edited
		return;
	    }
	    
	    var currentRow = this.currentCell.closest('tr');
	    if ( currentRow.dbRow('getState') !== 'current' ) {
		return "Your changes have not been saved.\nStay on the current page to correct.";
	    }    
	},
	_onBeforePrint: function(){
	    if ( this.currentCell.size() ) {
		this.currentCell.dbCell('cellOut');
	    }	
	}
    });
})(jQuery, window, document);

/* ==== jquery.dbGridDivStatus.js ==== */
(function($){
  // DbGridDivStatus Class Constructor - vertical resize on bottom border
  var DbGridDivStatus = function(statusDiv) {
    // Private Class Variables
    var inZone = false;
    var inResize = false;
    var savedHeight;
    var savedY;
    var minHeight = 10;
    // The div to resize
    var resizeDiv = statusDiv.prev();
    
    // Events
    statusDiv.on('mousemove.dbGridDivStatus', onMouseMoveStatusDiv);
    statusDiv.on('mousedown.dbGridDivStatus', onMouseDownStatusDiv);
    jQuery(document).on('mouseup.dbGridDivStatus',onMouseUpWindow);
    jQuery(document).on('mousemove.dbGridDivStatus', onMouseMoveWindow);
    
    // Private Class Methods
    function onMouseMoveStatusDiv(e) {
      if ( e.pageY >= statusDiv.height() + statusDiv.offset().top + statusDiv.scrollTop() ) {
	// Bottom Border
	statusDiv.css('cursor','S-resize');
	inZone = true;	  
      } else if ( ! inResize ) {
	statusDiv.css('cursor','auto');
	inZone = false;
      } 
    }  
    function onMouseDownStatusDiv(e) {
      if ( inZone && e.which == 1) {
	inResize = true;
	savedY = e.screenY;
	savedHeight = resizeDiv.height();
	return false;
      } 
    }
    function onMouseMoveWindow(e) {
      if ( inResize ) {
	// Drag
	var deltaY = e.screenY - savedY;
	var height = savedHeight + deltaY;
	if ( height < minHeight ) {
	  height = minHeight;
	}
	// Resize
	resizeDiv.height(height);
	  resizeDiv.trigger('resize');
      }
    }
    function onMouseUpWindow(e) {
      if ( inResize ) {
	inResize = false;
      }
    }
  };

  // Make DbGridDivStatus Class available as a jquery plugin
  $.fn.dbGridDivStatus = function() {
    var divs = this

    if ( divs.not('div').size() ) {
      throw new Error('jQuery.dbGridDivStatus requires that only div elements are contained in the jQuery object');
    }

    // Initialise DbGridDivStatus objects for each div unless this has already been done
    for ( var i=0; i< divs.size(); i++ ) {
      var div = divs.eq(i);
      var dbGridDivStatus = div.data('dbGridDivStatus');

      if ( ! dbGridDivStatus ) {
	dbGridDivStatus = new DbGridDivStatus(div);
	div.data('dbGridDivStatus',dbGridDivStatus);
      }
    }
    
    return divs;
  };

}) (jQuery);

/* ==== jquery.dbRecord.js ==== */
// dbRecord plugin
// Part of a dbRecordSet. 
// A dbRecord represents a collection of dbFields.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget('qcode.dbRecord', {
	_create: function() {
	    // saveType option
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType, this.getRecordSet().dbRecordSet("option", "saveType"));
	    this.state = 'current';
	    if ( this.element.attr('recordType') === "add" ) {
		this.type = "add";
	    } else {
		this.type = "update";
	    }
	    if ( this.options.saveType === 'recordOut' ) {
		this._on({
		    'dbRecordOut': function() {
			if ( this.getState() === "dirty" ) {
			    this.save();
			}
		    }
		});
	    }
	},
	getRecordSet: function() {
	    return this.element.closest('.recordSet');
	}, 
	getState: function() {
	    return this.state;
	}, 
	setState: function(newState) {
	    // Set the state of this record
	    switch(newState) {
	    case "updating":
	    case "error":
	    case "current":
	    case "dirty":
		this.element.removeClass("current dirty updating error");
		this.element.addClass(newState);
		this.state = newState;
		this.getCurrentField().dbField('editor', 'repaint');
		this.element.trigger('dbRecordStateChange');
		break;
	    default:
		$.error('Invalid state');
	    }
	},
	getErrorMessage: function() {
	    return this.error;
	},
	save: function(async) {
	    // Save this record
	    if ( this.getState() === "updating" ) {
		return false;
	    }
	    var url = this.getRecordSet().attr(this.type + "URL");
	    if ( ! url ) {
		$.error('Could not '+this.type+' record - no url provided');
	    }
	    this.action(this.type, url, async);
	}, 
	delete: function(async) {
	    // Delete this record
	    if ( this.getState() === "updating" ) {
		return false;
	    }
	    var url = this.getRecordSet().attr('deleteURL');
	    if ( ! url ) {
		$.error('Could not delete record - no url provided');
	    }
	    this.action('delete', url, async);
	}, 
	action: function(action, url, async) {
	    // Perform the given action (add, update, delete), by submitting record data to the server.
	    var async = coalesce(async, true);

	    this.setState('updating');
	    this.getCurrentField().dbField('write');

	    var urlPieces = splitURL(url);
	    var path = urlPieces.path;
	    var data = urlPieces.data;
	    // Look for any fields (elements with attr name) and store name/value in data
	    this.element.find('[name]').each(function(i, field) {
		var name = $(field).dbField('getName');
		if ( $(field).dbField('getType') == 'htmlarea' ) {
		    // xml cannot contain raw html, so escape/unescape field value.
		    var value = escapeHTML($(field).dbField('getValue'));
		} else {
		    var value = $(field).dbField('getValue');
		}
		// If name is used more than once store values in array
		if ( typeof data[name] == "undefined" ) {
		    data[name] = value;
		} else if ( Array.isArray(data[name]) ) {
		    data[name].push(value);
		} else {
		    data[name] = new Array(data[name], value);
		}
	    });
	    // Post
	    httpPost(path, data, this._actionReturn.bind(this, action), this._actionReturnError.bind(this, action), async);
	    // custom event 
	    this.element.trigger('dbRecordAction', [action]);
	}, 
	getCurrentField: function() {
	    // Return the field currently being edited (or an empty jQuery object)
	    return this.element.find(this.getRecordSet().dbRecordSet('getCurrentField'));
	},
	setValues: function(xmlDoc) {
	    // Takes an xml document/fragment and attempts to match the nodes to fields in the record, setting the values of those elements.
	    this.element.find('[name]').each(function(i, field) {
		var node = $(xmlDoc).find('records > record > ' + $(field).dbField('getName'));
		if ( node.length > 0 ) {
		    if ( $(field).dbField('getType') == 'htmlarea') {
			// xml cannot contain raw html, so escape/unescape it.
			$(field).dbField('setValue', unescapeHTML(node.text()));
		    } else {
			$(field).dbField('setValue', node.text());
		    }
		}
	    });
	    this.element.trigger('resize');
	}, 
	recordIn: function(event) {
	    this.getRecordSet().dbRecordSet('setCurrentRecord', this.element);
	    this.element.trigger('dbRecordIn', event);
	}, 
	recordOut: function(event){
	    this.getRecordSet().dbRecordSet('setCurrentRecord', null);
	    this.element.trigger('dbRecordOut', event);
	},
	_actionReturn: function(action, xmlDoc, status, jqXHR) {
	    // Called on successfull return from a server action (add, update or delete)
	    this.setState('current');
	    this.error = undefined;
	    switch(action){
	    case "update":
		this.setValues(xmlDoc);
		break;
	    case "add":
		// Once added, a record becomes an updatable record
		this.type = "update";
		this.setValues(xmlDoc);
		break;
	    }

	    // For add and update, we want to handle incoming data before triggering event handlers. For delete, we want event handlers to trigger first.
	    this.element.trigger('dbRecordActionReturn', [action, xmlDoc, status, jqXHR]);

	    if ( action == "delete" ) {
		// When a record is deleted, remove it from the DOM.
		var recordSet = this.getRecordSet();
		this.destroy();
		this.element.remove();
		recordSet.trigger('resize');
	    }
	},
	_actionReturnError: function(action, message, type) {
	    // Called when a server action returns an error
	    this.setState('error');
	    if ( type != 'USER' ) {
		alert(message);
	    }
	    this.error = message;
	    this.element.trigger('dbRecordActionReturnError', [action, message, type]);
	}
    });
})(jQuery);

/* ==== jquery.dbRecordSet.js ==== */
// dbRecordSet plugin
// Provides an ui for editable database records.
;(function($, window, undefined){

    // Use the jQuery UI widget factory.
    $.widget('qcode.dbRecordSet', {
	options: {
	    saveType: "recordOut"
	},
	_create: function(){
	    // check saveType attr
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType);
	    // Ensure recordSet class is set
	    this.element.addClass('recordSet');

	    // Elements with class "editable" are editable fields.
	    this._on({
		'mousedown .editable': function(event) {
		    $(event.currentTarget).dbField('onMouseDown', event);
		},
		'editorKeyDown .editable': function(event) {
		    $(event.currentTarget).dbField('editorKeyDown', event);
		},
		'editorKeyUp .editable': function(event) {
		    $(event.currentTarget).dbField('editorKeyUp', event);
		},
		'editorCut .editable': function(event) {
		    $(event.currentTarget).dbField('editorCut', event);
		},
		'editorPaste .editable': function(event) {
		    $(event.currentTarget).dbField('editorPaste', event);
		},
		'editorBlur .editable': function(event) {
		    $(event.currentTarget).dbField('editorBlur', event);
		}
	    });
	    this._on(window, {
		'beforeunload': this._onBeforeUnload,
		'beforeprint': this._onBeforePrint,
	    });

	    // Initialize as empty jQuery object.
	    this.currentField = $([]);
	    this.currentRecord = $([]);
	},
	save: function(aysnc) {
	    // Save the current record
	    this.getCurrentRecord().dbRecord('save', async);
	}, 
	getCurrentRecord: function() {
	    return this.currentRecord;
	},
	setCurrentRecord: function(newRecord) {
	    this.currentRecord = $(newRecord);
	},
	getCurrentField: function() {
	    return this.currentField;
	}, 
	setCurrentField: function(newField) {
	    this.currentField = $(newField);
	}, 
	fieldChange: function(toField) {
	    //
	    var currentRecord = this.getCurrentRecord();
	    var newRecord = toField.dbField('getRecord');

	    this.getCurrentField().dbField('fieldOut');
	    if ( ! currentRecord.is(newRecord) ) {
		currentRecord.dbRecord('recordOut');
	    }

	    toField.dbField('fieldIn');
	    if ( ! currentRecord.is(newRecord) ) {
		newRecord.dbRecord('recordIn');
	    }
	},
	_onBeforeUnload: function(event){
	    // Before leaving the page, offer the user a chance to save changes.
	    var records = this.element.find('.record');
	    for (var i = 0; i < records.length; i++) {
		var record = records.eq(i);
		if ( record.dbRecord('getState') === 'dirty' || record.dbRecord('getState') === 'error' ) {
		    return "Your changes have not been saved.\nStay on the current page to correct.";
		}
	    }
	},
	_onBeforePrint: function(event){
	    // Before printing, stop editing
	    this.getCurrentField().dbField('fieldOut');
	    this.getCurrentRecord().dbRecord('recordOut');
	}
    });
})(jQuery, window);


/* ==== jquery.dbRow.js ==== */
(function($, window, document, undefined){
    $.widget("qcode.dbRow", {
	options: {
	    'type': 'update'
	},
	_create: function(){
	    this.state = 'current';
	    this.error = undefined;
	},
	getGrid: function(){
	    return this.element.closest('table');
	},
	getColgroup: function(){
	    return this.getGrid().children('colgroup');
	},
	getCurrentCell: function() {
	    return this.getGrid().dbGrid('getCurrentCell');
	},
	setStatusBarMsg: function(message) {
	    this.getGrid().dbGrid('setStatusBarMsg',message);
	},
	getState: function(){
	    return this.state;
	},
	getRowData: function(){
	    // Return object with name/value pairs of row data
	    var data = {};
	    this.element.children('td').each(function() {
		var cell = $(this);
		var colName = cell.dbCell('getCol').attr('name');
		var cellValue = cell.dbCell('getValue');
		data[colName] = cellValue;
	    });
	    return data;
	},
	setState: function(newState){
	    // Set the state of this row
	    var grid = this.getGrid();
	    var oldState = this.state;
	    var message;
	    
	    switch (newState) {
	    case 'dirty':
		if ( oldState === 'current' && this.option('type') === 'add' ) {
		    // Append New Row
		    grid.dbGrid('createNewRow');
		}
		if ( oldState === 'current' || oldState === 'error' ) {
		    var span = $('<span>').text('save').click(this.save.bind(this)).addClass('clickToSave');
		    var message = $('<span>').text('Editing ... to ').append(span).append(', type Ctrl+S');
		}
		break;
	    case 'current': 
		message = "Saved.";
		break;
	    case 'updating': 
		message = "Updating ...";
		break;
	    case 'error': 
		message = this.error;
		break;
	    default:
		$.error('Invalid state');
		return;
	    }

	    this.element.removeClass("current dirty updating error");
	    this.element.addClass(newState);
	    this.setStatusBarMsg(message);
	    this.state = newState;
	    this.getCurrentCell().dbCell('editor', 'repaint');
	    this.element.trigger('dbRowStateChange');
	},
	rowIn: function(){  
	    // Update NavCounter and statusBarMsg
	    var row = this.element;
	    var grid = this.getGrid();

	    // Custom Event: Trigger any dbRowIn events bound to this table
	    row.trigger('dbRowIn');

	    if ( this.error ) {
		grid.dbGrid('setStatusBarMsg', this.error);
	    }
	    grid.dbGrid('setNavCounter', row.index());
	},
	rowOut: function(){
	    // Save row if dirty
	    // Custom Event: Trigger any dbRowOut events bound to this table
	    this.element.trigger('dbRowOut');
	    
	    if ( this.state === 'dirty' ) {
		this.save();
	    }
	},
	save: function(async){
	    // Save this row, using an add or update url as appropriate
	    var grid = this.getGrid();

	    if ( this.state === "updating" ) {
		return false;
	    }
	    switch(this.option('type')){
	    case "update":
		var url = grid.dbGrid('option', "updateURL");
		break;
	    case "add":
		var url = grid.dbGrid('option', "addURL");
		break;
	    }
	    if ( ! url ) {
		$.error('Could not ' + this.option('type') + ' record - no url provided');
	    }
	    this.action(this.option('type'), url, async);
	},
	action: function(action, url, async){
	    // Perform the given action (add, update, delete), by submitting row data to the server.
	    var grid = this.getGrid();

	    async = coalesce(async, true);
	    if ( action === 'add' || action === 'update' || action === 'delete' ) {
		this.setState('updating');
	    }
	    grid.dbGrid('getCurrentCell').dbCell('write');

	    var urlPieces = splitURL(url);
	    var path = urlPieces.path;
	    var data = $.extend(urlPieces.data, this.getRowData());
	    httpPost(path, data, this.actionReturn.bind(this, action), this.actionReturnError.bind(this, action), async);
	    this.element.trigger('dbRowAction', [action]);
	},
	actionReturn: function(action, xmlDoc, status, jqXHR){
	    // Called on successful return from a server action (add, update or delete)
	    var grid = this.getGrid();

	    this.xmlSetValues(xmlDoc);
	    this.error = undefined;

	    switch(action){
	    case "update":
		this.setState('current');
		break;
	    case "add":
		// Once added, a record becomes an updatable record
		this.option('type', "update");
		this.setState('current');
		grid.dbGrid('incrRecCount', 1);
		break;
	    }

	    // For add and update, we want to handle incoming data before triggering event handlers. For delete, we want event handlers to trigger first.
	    this.element.trigger('dbRowActionReturn', [action, xmlDoc, status, jqXHR]);

	    if ( action == "delete" ) {
		// When a record is deleted, remove it from the DOM.	
		grid.dbGrid('removeRow',this.element)
		grid.dbGrid('incrRecCount', -1);
		grid.dbGrid('setStatusBarMsg','Deleted.');
		this.destroy();
	    }
	},
	actionReturnError: function(action,errorMessage, errorType){
	    this.error = errorMessage;
	    this.setState('error');
	    if ( errorType != 'USER' ) {
		alert(errorMessage);
	    }
	},
	xmlSetValues: function(xmlDoc) {
	    // Update row, calculated & external html values,
	    // Display info and alert messages
	    var grid = this.getGrid();
	    var currentCell = grid.dbGrid('getCurrentCell')
	    var dbRow = this;

	    // Update row with record values in xmlDoc response
	    var rec = $('records record', xmlDoc).first();
	    if ( rec.size() ) {
		rec.children().each(function() {
		    var xmlNode = $(this);
		    var colName = xmlNode.prop('nodeName');
		    var value = xmlNode.text()
		    dbRow.setCellValue(colName, value);		    
		});		
		if ( currentCell.size() && this.element.find(currentCell).size() ) {
		    currentCell.dbCell('cellIn', 'end');
		}
	    }

	    // Update 'Calculated' elements within grid
	    $('records > calculated', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id, grid).setObjectValue(value);
	    });

	    // Update html elements external to the grid
	    $('records > html', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id + ',[name="' + id + '"]').setObjectValue(value);
	    });

	    // Display info message in statusBar
	    var xmlNode = $('records > info', xmlDoc);
	    if ( xmlNode.size() ) {
		this.setStatusBarMsg(xmlNode.text());
	    }

	    // Alert
	    var xmlNode = $('records > alert', xmlDoc);
	    if ( xmlNode.size() ) {
		alert(xmlNode.text());
	    }
	},
	setCellValue: function(colName, value){
	    // Set the value of the cell corresponding to colName.
	    var colIndex = $('col[name='+colName+']', this.colgroup).index();
	    if ( colIndex !== -1 ) {
		var cell = this.element.children('td').eq(colIndex);
		cell.dbCell('setValue',value);	    
	    }
	},
	delete: function(async){
	    var grid = this.getGrid();
	    var url = grid.dbGrid('option', 'deleteURL');
	    if ( ! url ) {
		$.error('Could not delete record - no url provided');
	    }
	    this.action('delete', url, async); 
	}
    });
})(jQuery, window, document);

/* ==== jquery.delayedGroupHover.js ==== */
;(function($, window, undefined) {
    // Delayed Group Hover plugin.
    // Treats all the elements in the current jQuery object as a single "group";
    // Invokes a user-defined callback when the user hovers over elements of the current jQuery object for more than a given time,
    // or when they hover out of all the elements of the current jQuery object for more than a given time.
    $.fn.delayedGroupHover = function(options) {
	// hoverIn and hoverOut are optional callback functions.
	var options = $.extend({
	    inTime: 200,
	    outTime: 200,
	    hoverIn: undefined,
	    hoverOut: undefined
	}, options);

	var timer;
	var group = this;
	function mouseEnter(event) {
	    if ( $(event.relatedTarget).is(group) ) {
		// mouse was already in the group
		return;
	    }
	    if ( timer !== undefined ) {
		// reset the timer
		window.clearTimeout(timer);
	    }
	    if ( typeof options.hoverIn === "function" ) {
		// schedule the hoverIn function to be called
		timer = window.setTimeout(options.hoverIn.bind(group), options.inTime);
	    }
	}
	function mouseLeave(event) {
	    if ( $(event.relatedTarget).is(group) ) {
		// mouse isn't leaving the group
		return;
	    }
	    if ( timer !== undefined ) {
		// reset the timer
		window.clearTimeout(timer);
	    }
	    if ( typeof options.hoverOut === "function" ) {
		// schedule the hoverOut function to be called
		timer = window.setTimeout(options.hoverOut.bind(group), options.outTime);
	    }
	}
	// bind events
	group
	    .on('mouseenter', mouseEnter)
	    .on('mouseleave', mouseLeave);
    }
})(jQuery, window);

/* ==== jquery.delayedHover.js ==== */
;(function($, window, undefined) {
    // Delayed hover plugin.
    // Triggers custom events "delayedHoverIn" and "delayedHoverOut".
    // Optionally takes a selector which tracks delayed mouse events on each element.
    $.fn.delayedHover = function(options){
	var options = $.extend({
	    inTime: 200,
	    outTime: 200,
	    selector: undefined
	}, options);

	function mouseEnter(event) {
	    var target = $(this);
	    var timer = target.data('delayedHoverTimer');
	    if ( timer !== undefined ) {
		// reset the timer
		window.clearTimeout(timer);
	    }
	    // schedule event to be triggered
	    timer = window.setTimeout(function() {
		target.trigger('delayedHoverIn');
	    }, options.inTime)
	    target.data('delayedHoverTimer', timer);
	}
	function mouseLeave(event) {
	    var target = $(this);
	    var timer = target.data('delayedHoverTimer');
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    timer = window.setTimeout(function() {
		target.trigger('delayedHoverOut');
	    }, options.outTime)
	    target.data('delayedHoverTimer', timer);
	}

	if ( options.selector === undefined ) {
	    $(this)
		.on('mouseenter', mouseEnter)
		.on('mouseleave', mouseLeave);
	} else {
	    // Apply to each element matching the selector
	    $(this)
		.on('mouseenter', options.selector, mouseEnter)
		.on('mouseleave', options.selector, mouseLeave);
	}
    }
})(jQuery, window);

/* ==== jquery.enableDisable.js ==== */
// enable and disable plugins. Enable or disable links, buttons, etc.
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

/* ==== jquery.hoverScroller.js ==== */
// Hover Scroller plugin - Create controls at the top and bottom of a scrollable box that scroll the box on mouse hover. Clicking the controls will quickly scroll to the end.
;(function($, undefined){
    $.fn.hoverScroller = function(options){
	// scrollbox is the box to scroll,
	// container is the element to add the controls to (normally the scrollbox's parent)
	// scrollSpeed is measured in pixels/millisecond and determines how fast the box scrolls (only a single fixed speed is currently supported)
	// snapTime how fast (in milliseconds) the scrollbox will scroll to the end if one of the controls is clicked.
	var settings = $.extend({
	    scrollBox: $(this),
	    container: $(this).parent(),
	    scrollSpeed: 0.3,
	    snapTime: 100
	}, options);
	var scrollBox = settings.scrollBox.addClass('hoverScroller');
	var container = settings.container.addClass('hoverScrollerContainer');
	var scrollSpeed = settings.scrollSpeed;
	var snapTime = settings.snapTime;

	// A div which appears at the bottom of the container, which scrolls the scrollBox down when you hover the mouse over it
	var downScroller = $('<div>')
	    .appendTo(container)
	    .addClass('down scroller')
	    .on('mouseenter', function() {
		// When the mouse enter the scroller, make the scroller more opaque then start scrolling
		downScroller.stop().fadeTo(0, 0.5);
		upScroller.stop().fadeTo(0, 0.1);
		var scrollTo = scrollBox.prop('scrollHeight') - scrollBox.height();
		var duration = (scrollTo - scrollBox.scrollTop()) / scrollSpeed;
		scrollBox.addClass('scrolling')
		    .animate(
			{ 'scrollTop': scrollTo },
			duration,
			function() {
			    // When scrolling is finished (reaches the bottom), hide the downwards scroller
			    downScroller.stop().fadeOut();
			    scrollBox.removeClass('scrolling');
			}
		    );
	    })
	    .on('mouseleave', function() {
		if ( scrollBox.is('.scrolling') ) {
		    // If the mouse leaves the downwards scroller before scrolling is finished, stop scrolling and return the scroller to its base opacity
		    downScroller.stop().fadeTo(0, 0.1);
		    scrollBox.stop();
		}
	    })
	    .on('click', function() {
		if ( scrollBox.is('.scrolling') ) {
		    var scrollTo = scrollBox.prop('scrollHeight') - scrollBox.height();
		    scrollBox.
			stop()
			.animate(
			    { 'scrollTop': scrollTo },
			    snapTime,
			    function() {
				// When scrolling is finished (reaches the bottom), hide the downwards scroller
				downScroller.stop().fadeOut();
				scrollBox.removeClass('scrolling');
			    }
			);
		}
	    });

	// A div which appears at the top of the container, which scrolls the scrollBox up when you hover the mouse over it
	var upScroller = $('<div>')
	    .prependTo(container)
	    .addClass('up scroller')
	    .on('mouseenter', function(){
		// When the mouse enter the scroller, make the scroller more opaque then start scrolling
		upScroller.stop().fadeTo(0, 0.5);
		downScroller.stop().fadeTo(0, 0.1);
		var duration = scrollBox.scrollTop() / scrollSpeed;
		scrollBox.addClass('scrolling')
		    .animate(
			{ 'scrollTop': 0 },
			duration,
			function(){
			    // When scrolling is finished (reaches the top), hide the upwards scroller
			    upScroller.stop().fadeOut();
			    scrollBox.removeClass('scrolling');
			}
		    );
	    })
	    .on('mouseleave', function(){
		if ( scrollBox.is('.scrolling') ) {
		    // If the mouse leaves the upwards scroller before scrolling is finished, stop scrolling and return the scroller to its base opacity
		    upScroller.stop().fadeTo(0, 0.1);
		    scrollBox.stop();
		}
	    })
	    .on('click', function() {
		if ( scrollBox.is('.scrolling') ) {
		    scrollBox.
			stop()
			.animate(
			    { 'scrollTop': 0 },
			    snapTime,
			    function() {
				// When scrolling is finished (reaches the bottom), hide the downwards scroller
				upScroller.stop().fadeOut();
				scrollBox.removeClass('scrolling');
			    }
			);
		}
	    });


	// Only display the scroller controls when the content is overflowing - listen for resize events to indicate that this may have changed.
	function updateControls() {
	    if ( ! scrollBox.is('.scrolling') ) {
		if ( parseInt(scrollBox.prop('scrollHeight')) == parseInt(scrollBox.height()) ) {
		    upScroller.add(downScroller).stop().fadeOut(0);
		} else {
		    if ( scrollBox.scrollTop() > 0 ) {
			upScroller.fadeTo(0, 0.1);
		    } else {
			upScroller.fadeOut();
		    }
		    if ( scrollBox.scrollTop() + scrollBox.height() < scrollBox.prop('scrollHeight') ) {
			downScroller.fadeTo(0, 0.1);
		    } else {
			downScroller.fadeOut();
		    }
		}
	    }
	}
	scrollBox.on('scroll', function() {
	    updateControls();
	});
	$(window).on('resize.hoverScroller', updateControls);
	updateControls();

	// Hide scrollbars.
	// TO DO: extend this to work for other layouts, use a wrapper if needed
	if ( scrollBox.css('left') !== "auto"
	     && scrollBox.css('right') === "0px"
	     && settings.container.css('overflow-x') === "hidden" ) {
	    var scrollBarWidth = scrollBox.width() - scrollBox[0].scrollWidth;
	    scrollBox.css('right', 0 - scrollBarWidth);
	}

	// End of hover scroller plugin; return original target for jQuery chainability
	return this;
    }
})(jQuery);

/* ==== jquery.maximiseHeight.js ==== */
// Maximise the height of an element so that the content of a page spans the entire height of the window.  
;(function($, window,undefined){
    // Uses the jQuery UI widget factory.
    $.widget('qcode.maximizeHeight', {
	options: {
	    minimumHeight: 300
	},
	_create: function(){
	    // Constructor function
	    this._resize();

	    // Event listeners 
	    this._on(window, {
		'resize': this._resize
	    });
	},
	_resize: function() {
	    var windowHeight = jQuery(window).height();
	    var bodyHeight = jQuery('body').outerHeight(true);
	    var elementHeight = this.element.height();
	   
	    if (bodyHeight < windowHeight) {
		// Entire body is visible within the window.
		// Increase element's height so that bodyHeight = windowHeight
		this.element.height(elementHeight + (windowHeight - bodyHeight));
	    } else if (bodyHeight > windowHeight) {
		// Body is only partially visible within window.
		// Try to decrease element's height so that entire page contents is visible within the window.
		// Do not decrease below minimumHeight.
		var newHeight = elementHeight - (bodyHeight - windowHeight);
		if (newHeight < this.option('minimumHeight')) {
		    newHeight = this.option('minimumHeight');
		}
		this.element.height(newHeight);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.navigate.js ==== */
;(function($, window, document, undefined) {
    // Navigate Class constructor
    var Navigate = function(container, selector) {
        var navigate = this;
        this.container = container;
        this.selector = selector;

        // Default selector
        if (selector === undefined) {
            this.selector = ':input:not(:button,:submit)';
        }

        // Events     
        container.on('keydown', function(event) {
            var currentElement = jQuery(event.target)
            var nextElement;
            var fields = jQuery(this.selector, this.container);
            switch (event.which) {
            case 37:
                // left arrow key pressed - move left (if at selectionStart)
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtStart) {
                    nextElement = currentElement.westOf(fields);
                }
                break;
            case 39:
                // right arrow key pressed - move right (if at SelectionEnd) 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtEnd) {
                    nextElement = currentElement.eastOf(fields);
                }
                break;
            case 38:
                // up arrow key pressed - move up 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtStart) {
                    nextElement = currentElement.northOf(fields);
                }
                break;
            case 40:
                // down arrow key pressed - move down
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtEnd) {
                    nextElement = currentElement.southOf(fields);
                }
                break;
            case 13:
                // return key pressed - move down 
                nextElement = currentElement.southOf(fields);
                break;
            case 9:
                // tab key pressed - default tab action
                return true;
                break;
            default:
                return true;
            }

            // if nextElement exists change focus and prevent event defaults
            if (nextElement !== undefined) {
                navigate.changeFocus(currentElement, nextElement);
                event.preventDefault();
                return false;
            }
        });
    };
    Navigate.prototype.changeFocus = function(fromField, nextField) {
        // Collapse current textrange selection
        if (fromField.is('input[type=text],textarea,[contenteditable=true]')) {
            fromField.textrange('set','start','start');
        }

        // Move focus to nextField and select text contents
        nextField.focus();
        if (nextField.is('input[type=text],textarea,[contenteditable=true]')) {
            nextField.textrange('set','all');
        }
    };

    // Make Navigate Class available as a jQuery plugin   
    $.fn.navigate = function(selector) {
        var containers = this;
        for (var i = 0; i < containers.size(); i++) {
            var container = containers.eq(i);
            if (!container.data('navigate')) {
                container.data('navigate', new Navigate(container, selector));
            }
        }
        return containers;
    };
}(jQuery, window, document));

/* ==== jquery.positionRelativeTo.js ==== */
// positionRelative to plugin - returns the position of the first element in the selection relative to the target.
// nb. if either element is in the offset parent chain of the other, position will account for scrolling of that element.
(function ($, undefined) {
    $.fn.positionRelativeTo = function(target) {
	var target = $(target);
	var $body = $('body');

	// Find chain of offset parents from this element to body
	var myOffsetParents = this;
	var current = this;
	while ( ! current.is($body) ) {
	    current = current.offsetParent();
	    myOffsetParents = myOffsetParents.add(current);
	}

	// Search offset parents from target element up until a common offset parent is found
	current = target;
	while ( ! current.is(myOffsetParents) ) {
	    current = current.offsetParent();
	}
	var commonOffsetParent = current;

	// Find position of this element relative to the common offset parent
	var myPosition = {
	    left: 0,
	    top: 0
	}
	current = this;
	while ( ! current.is(commonOffsetParent) ) {
	    var positionOfCurrent = current.position();
	    myPosition.left += positionOfCurrent.left;
	    myPosition.top += positionOfCurrent.top;
	    current = current.offsetParent();   
	}
	if ( ! (this.is(commonOffsetParent) || commonOffsetParent.is('body')) ) {
	    myPosition.left += commonOffsetParent.scrollLeft();
	    myPosition.top += commonOffsetParent.scrollTop();
	}

	// Find position of target element relative to the common offset parent
	var targetPosition = {
	    left: 0,
	    top: 0
	}
	current = target;
	while ( ! current.is(commonOffsetParent) ) {
	    var positionOfCurrent = current.position();
	    targetPosition.left += positionOfCurrent.left;
	    targetPosition.top += positionOfCurrent.top;
	    current = current.offsetParent();   
	}
	if ( ! (target.is(commonOffsetParent) || commonOffsetParent.is('body')) ) {
	    targetPosition.left += commonOffsetParent.scrollLeft();
	    targetPosition.top += commonOffsetParent.scrollTop();
	}

	// Return the difference of the two calculated positions
	return {
	    left: myPosition.left - targetPosition.left,
	    top: myPosition.top - targetPosition.top
	}
    };
})(jQuery);

/* ==== jquery.resizeableHeight.js ==== */
(function($){
  // ResizeableHeight Class Constructor - vertical resize on bottom border
  var ResizeableHeight = function(resizeElmt) {
    // Private Class Variables
    var inZone = false;
    var inResize = false;
    var savedHeight;
    var savedY;
    var minHeight = 10;
    // The element to resize
    var resizeElmnt = resizeElmt;
    
    // Events
    resizeElmnt.on('mousemove.resizeableHeight', onMouseMoveResizeElmt);
    resizeElmnt.on('mousedown.resizeableHeight', onMouseDownResizeElmt);
    jQuery(document).on('mouseup.resizeableHeight',onMouseUpWindow);
    jQuery(document).on('mousemove.resizeableHeight', onMouseMoveWindow);
    
    // Private Class Methods
    function onMouseMoveResizeElmt(e) {
      if ( e.pageY >= resizeElmnt.height() + resizeElmnt.offset().top + resizeElmnt.scrollTop()) {
	// Bottom Border
	resizeElmnt.css('cursor','S-resize');
	inZone = true;	  
      } else if ( ! inResize ) {
	resizeElmnt.css('cursor','auto');
	inZone = false;
      } 
    }  
    function onMouseDownResizeElmt(e) {
      if ( inZone && e.which == 1) {
	inResize = true;
	savedY = e.screenY;
	savedHeight = resizeElmt.height();
	return false;
      } 
    }
    function onMouseMoveWindow(e) {
      if ( inResize ) {
	// Drag
	var deltaY = e.screenY - savedY;
	var height = savedHeight + deltaY;
	if ( height < minHeight ) {
	  height = minHeight;
	}
	// Resize
	resizeElmt.height(height);
      }
    }
    function onMouseUpWindow(e) {
      if ( inResize ) {
	inResize = false;
      }
    }
  };

  // Make ResizeableHeight Class available as a jquery plugin
  $.fn.resizeableHeight = function() {
    var elmts = this

    // Initialise ResizeableHeight objects for each elmt unless this has already been done
    for ( var i=0; i< elmts.size(); i++ ) {
      var elmt = elmts.eq(i);
      var resizeableHeight = elmt.data('resizeableHeight');

      if ( ! resizeableHeight ) {
	resizeableHeight = new ResizeableHeight(elmt);
	elmt.data('resizeableHeight',resizeableHeight);
      }
    }
    
    return elmts;
  };

}) (jQuery);

/* ==== jquery.sidebar.js ==== */
// Sidebar plugin - makes the target div a right sidebar, resizable (width only) and collapsible
;(function($, window, document, undefined){
    $.widget('qcode.sidebar', {
	_create: function(){
	    // Even collapsed, the sidebar will take up some space, so add a margin to the body to prevent the collapsed sidebar from obscuring any page contents
	    $('body').css('margin-right', "+=35px");

	    var sidebar = this.element.addClass('sidebar'),
	    toolbar = this.toolbar = sidebar.find('.toolbar'),
	    initialWidth = sidebar.width();

	    // An invisible div sitting on the sidebar's edge, to capture click & drag events for resizing the sidebar.
	    var handle = this.handle = $('<div>')
		.addClass('handle')
		.prependTo(sidebar);

	    this._on(handle, {
		'mousedown': this._dragStart,
		'dragStart': function(event, data) {
		    initialWidth = sidebar.width();
		},
		'drag': function(event, data) {
		    sidebar.width(initialWidth - data.offset);
		    sidebar.trigger('resize');
		},
		'dragEnd': function(event, data) {
		    initialWidth = sidebar.width();
		}
	    });

	    // Button to collapse the sidebar
	    this.collapseButton = $('<button>')
		.text('\u21e5')
		.addClass('collapse')
		.prependTo(toolbar);

	    this._on(this.collapseButton, {
		'click': this.collapse
	    });

	    // Button to restore a collapsed sidebar
	    this.restoreButton = $('<button>')
		.text('\u21e4')
		.addClass('restore')
		.prependTo(toolbar)
		.hide();

	    this._on(this.restoreButton, {
		'click': this.restore
	    });
	},
	collapse: function() {
	    // "Collapse" the sidebar (actually just hides most of it beyond the edge of the window).
	    this._off(this.handle, '.resizer');
	    this.handle.css('cursor', 'auto');
	    this.collapseButton.hide();
	    this.restoreButton.show();
	    this.element.stop().animate({
		'right': 25 - this.element.width()
	    });
	},
	restore: function() {
	    // Restore a collapsed sidebar
	    this._on(this.handle, {
		'mousedown': this._dragStart
	    });
	    this.handle.css('cursor', "w-resize");
	    this.restoreButton.hide();
	    this.collapseButton.show();
	    this.element.stop().animate({
		'right': 0
	    });
	},
	_dragStart: function(event){
	    var target = $(event.target);
	    event.preventDefault();
	    this._on($(window), {
		'mousemove': this._drag.bind(this, target, event.pageX),
		'mouseup': this._dragEnd.bind(this, target, event.pageX)
	    });
	    target.trigger('dragStart');
	},
	_drag: function(target, initialX, event){
	    event.preventDefault();
	    target.trigger('drag', [{
		'offset': event.pageX - initialX
	    }]);
	},
	_dragEnd: function(target, initialX, event){
	    this._off($(window), 'mousemove mouseup');
	    target.trigger('dragEnd');
	}
    });
})(jQuery, window, document);

/* ==== jquery.tablesorter.js ==== */
/*
 * 
 * TableSorter 2.0 - Client-side table sorting with ease!
 * Version 2.0.5b
 * @requires jQuery v1.2.3
 * 
 * Copyright (c) 2007 Christian Bach
 * Examples and docs at: http://tablesorter.com
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */
/**
 * 
 * @description Create a sortable table with multi-column sorting capabilitys
 * 
 * @example $('table').tablesorter();
 * @desc Create a simple tablesorter interface.
 * 
 * @example $('table').tablesorter({ sortList:[[0,0],[1,0]] });
 * @desc Create a tablesorter interface and sort on the first and secound column column headers.
 * 
 * @example $('table').tablesorter({ headers: { 0: { sorter: false}, 1: {sorter: false} } });
 *          
 * @desc Create a tablesorter interface and disableing the first and second  column headers.
 *      
 * 
 * @example $('table').tablesorter({ headers: { 0: {sorter:"integer"}, 1: {sorter:"currency"} } });
 * 
 * @desc Create a tablesorter interface and set a column parser for the first
 *       and second column.
 * 
 * 
 * @param Object
 *            settings An object literal containing key/value pairs to provide
 *            optional settings.
 * 
 * 
 * @option String cssHeader (optional) A string of the class name to be appended
 *         to sortable tr elements in the thead of the table. Default value:
 *         "header"
 * 
 * @option String cssAsc (optional) A string of the class name to be appended to
 *         sortable tr elements in the thead on a ascending sort. Default value:
 *         "headerSortUp"
 * 
 * @option String cssDesc (optional) A string of the class name to be appended
 *         to sortable tr elements in the thead on a descending sort. Default
 *         value: "headerSortDown"
 * 
 * @option String sortInitialOrder (optional) A string of the inital sorting
 *         order can be asc or desc. Default value: "asc"
 * 
 * @option String sortMultisortKey (optional) A string of the multi-column sort
 *         key. Default value: "shiftKey"
 * 
 * @option String textExtraction (optional) A string of the text-extraction
 *         method to use. For complex html structures inside td cell set this
 *         option to "complex", on large tables the complex option can be slow.
 *         Default value: "simple"
 * 
 * @option Object headers (optional) An array containing the forces sorting
 *         rules. This option let's you specify a default sorting rule. Default
 *         value: null
 * 
 * @option Array sortList (optional) An array containing the forces sorting
 *         rules. This option let's you specify a default sorting rule. Default
 *         value: null
 * 
 * @option Array sortForce (optional) An array containing forced sorting rules.
 *         This option let's you specify a default sorting rule, which is
 *         prepended to user-selected rules. Default value: null
 * 
 * @option Boolean sortLocaleCompare (optional) Boolean flag indicating whatever
 *         to use String.localeCampare method or not. Default set to true.
 * 
 * 
 * @option Array sortAppend (optional) An array containing forced sorting rules.
 *         This option let's you specify a default sorting rule, which is
 *         appended to user-selected rules. Default value: null
 * 
 * @option Boolean widthFixed (optional) Boolean flag indicating if tablesorter
 *         should apply fixed widths to the table columns. This is usefull when
 *         using the pager companion plugin. This options requires the dimension
 *         jquery plugin. Default value: false
 * 
 * @option Boolean cancelSelection (optional) Boolean flag indicating if
 *         tablesorter should cancel selection of the table headers text.
 *         Default value: true
 * 
 * @option Boolean debug (optional) Boolean flag indicating if tablesorter
 *         should display debuging information usefull for development.
 * 
 * @type jQuery
 * 
 * @name tablesorter
 * 
 * @cat Plugins/Tablesorter
 * 
 * @author Christian Bach/christian.bach@polyester.se
 */

(function ($) {
    $.extend({
        tablesorter: new
        function () {

            var parsers = [],
                widgets = [];

            this.defaults = {
                cssHeader: "header",
                cssAsc: "headerSortUp",
                cssDesc: "headerSortDown",
                cssChildRow: "expand-child",
                sortInitialOrder: "asc",
                sortMultiSortKey: "shiftKey",
                sortForce: null,
                sortAppend: null,
                sortLocaleCompare: true,
                textExtraction: "simple",
                parsers: {}, widgets: [],
                widgetZebra: {
                    css: ["even", "odd"]
                }, headers: {}, widthFixed: false,
                cancelSelection: true,
                sortList: [],
                headerList: [],
                dateFormat: "us",
                decimal: '/\.|\,/g',
                onRenderHeader: null,
                selectorHeaders: 'thead th',
                debug: false
            };

            /* debuging utils */

            function benchmark(s, d) {
                log(s + "," + (new Date().getTime() - d.getTime()) + "ms");
            }

            this.benchmark = benchmark;

            function log(s) {
                if (typeof console != "undefined" && typeof console.debug != "undefined") {
                    console.log(s);
                } else {
                    alert(s);
                }
            }

            /* parsers utils */

            function buildParserCache(table, $headers) {

                if (table.config.debug) {
                    var parsersDebug = "";
                }

                if (table.tBodies.length == 0) return; // In the case of empty tables
                var rows = table.tBodies[0].rows;

                if (rows[0]) {

                    var list = [],
                        cells = rows[0].cells,
                        l = cells.length;

                    for (var i = 0; i < l; i++) {

                        var p = false;

                        if ($.metadata && ($($headers[i]).metadata() && $($headers[i]).metadata().sorter)) {

                            p = getParserById($($headers[i]).metadata().sorter);

                        } else if ((table.config.headers[i] && table.config.headers[i].sorter)) {

                            p = getParserById(table.config.headers[i].sorter);
                        }
                        if (!p) {

                            p = detectParserForColumn(table, rows, -1, i);
                        }

                        if (table.config.debug) {
                            parsersDebug += "column:" + i + " parser:" + p.id + "\n";
                        }

                        list.push(p);
                    }
                }

                if (table.config.debug) {
                    log(parsersDebug);
                }

                return list;
            };

            function detectParserForColumn(table, rows, rowIndex, cellIndex) {
                var l = parsers.length,
                    node = false,
                    nodeValue = false,
                    keepLooking = true;
                while (nodeValue == '' && keepLooking) {
                    rowIndex++;
                    if (rows[rowIndex]) {
                        node = getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex);
                        nodeValue = trimAndGetNodeText(table.config, node);
                        if (table.config.debug) {
                            log('Checking if value was empty on row:' + rowIndex);
                        }
                    } else {
                        keepLooking = false;
                    }
                }
                for (var i = 1; i < l; i++) {
                    if (parsers[i].is(nodeValue, table, node)) {
                        return parsers[i];
                    }
                }
                // 0 is always the generic parser (text)
                return parsers[0];
            }

            function getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex) {
                return rows[rowIndex].cells[cellIndex];
            }

            function trimAndGetNodeText(config, node) {
                return $.trim(getElementText(config, node));
            }

            function getParserById(name) {
                var l = parsers.length;
                for (var i = 0; i < l; i++) {
                    if (parsers[i].id.toLowerCase() == name.toLowerCase()) {
                        return parsers[i];
                    }
                }
                return false;
            }

            /* utils */

            function buildCache(table) {

                if (table.config.debug) {
                    var cacheTime = new Date();
                }

                var totalRows = (table.tBodies[0] && table.tBodies[0].rows.length) || 0,
                    totalCells = (table.tBodies[0].rows[0] && table.tBodies[0].rows[0].cells.length) || 0,
                    parsers = table.config.parsers,
                    cache = {
                        row: [],
                        normalized: []
                    };

                for (var i = 0; i < totalRows; ++i) {

                    /** Add the table data to main data array */
                    var c = $(table.tBodies[0].rows[i]),
                        cols = [];

                    // if this is a child row, add it to the last row's children and
                    // continue to the next row
                    if (c.hasClass(table.config.cssChildRow)) {
                        cache.row[cache.row.length - 1] = cache.row[cache.row.length - 1].add(c);
                        // go to the next for loop
                        continue;
                    }

                    cache.row.push(c);

                    for (var j = 0; j < totalCells; ++j) {
                        cols.push(parsers[j].format(getElementText(table.config, c[0].cells[j]), table, c[0].cells[j]));
                    }

                    cols.push(cache.normalized.length); // add position for rowCache
                    cache.normalized.push(cols);
                    cols = null;
                };

                if (table.config.debug) {
                    benchmark("Building cache for " + totalRows + " rows:", cacheTime);
                }

                return cache;
            };

            function getElementText(config, node) {

                var text = "";

                if (!node) return "";

                if (!config.supportsTextContent) config.supportsTextContent = node.textContent || false;

                if (config.textExtraction == "simple") {
                    if (config.supportsTextContent) {
                        text = node.textContent;
                    } else {
                        if (node.childNodes[0] && node.childNodes[0].hasChildNodes()) {
                            text = node.childNodes[0].innerHTML;
                        } else {
                            text = node.innerHTML;
                        }
                    }
                } else {
                    if (typeof(config.textExtraction) == "function") {
                        text = config.textExtraction(node);
                    } else {
                        text = $(node).text();
                    }
                }
                return text;
            }

            function appendToTable(table, cache) {

                if (table.config.debug) {
                    var appendTime = new Date()
                }

                var c = cache,
                    r = c.row,
                    n = c.normalized,
                    totalRows = n.length,
                    checkCell = (n[0].length - 1),
                    tableBody = $(table.tBodies[0]),
                    rows = [];


                for (var i = 0; i < totalRows; i++) {
                    var pos = n[i][checkCell];

                    rows.push(r[pos]);

                    if (!table.config.appender) {

                        //var o = ;
                        var l = r[pos].length;
                        for (var j = 0; j < l; j++) {
                            tableBody[0].appendChild(r[pos][j]);
                        }

                        // 
                    }
                }



                if (table.config.appender) {

                    table.config.appender(table, rows);
                }

                rows = null;

                if (table.config.debug) {
                    benchmark("Rebuilt table:", appendTime);
                }

                // apply table widgets
                applyWidget(table);

                // trigger sortend
                setTimeout(function () {
                    $(table).trigger("sortEnd");
                }, 0);

            };

            function buildHeaders(table) {

                if (table.config.debug) {
                    var time = new Date();
                }

                var meta = ($.metadata) ? true : false;
                
                var header_index = computeTableHeaderCellIndexes(table);

                $tableHeaders = $(table.config.selectorHeaders, table).each(function (index) {

                    this.column = header_index[this.parentNode.rowIndex + "-" + this.cellIndex];
                    // this.column = index;
                    this.order = formatSortingOrder(table.config.sortInitialOrder);
                    
					
					this.count = this.order;

                    if (checkHeaderMetadata(this) || checkHeaderOptions(table, index)) this.sortDisabled = true;
					if (checkHeaderOptionsSortingLocked(table, index)) this.order = this.lockedOrder = checkHeaderOptionsSortingLocked(table, index);

                    if (!this.sortDisabled) {
                        var $th = $(this).addClass(table.config.cssHeader);
                        if (table.config.onRenderHeader) table.config.onRenderHeader.apply($th);
                    }

                    // add cell to headerList
                    table.config.headerList[index] = this;
                });

                if (table.config.debug) {
                    benchmark("Built headers:", time);
                    log($tableHeaders);
                }

                return $tableHeaders;

            };

            // from:
            // http://www.javascripttoolbox.com/lib/table/examples.php
            // http://www.javascripttoolbox.com/temp/table_cellindex.html


            function computeTableHeaderCellIndexes(t) {
                var matrix = [];
                var lookup = {};
                var thead = t.getElementsByTagName('THEAD')[0];
                var trs = thead.getElementsByTagName('TR');

                for (var i = 0; i < trs.length; i++) {
                    var cells = trs[i].cells;
                    for (var j = 0; j < cells.length; j++) {
                        var c = cells[j];

                        var rowIndex = c.parentNode.rowIndex;
                        var cellId = rowIndex + "-" + c.cellIndex;
                        var rowSpan = c.rowSpan || 1;
                        var colSpan = c.colSpan || 1
                        var firstAvailCol;
                        if (typeof(matrix[rowIndex]) == "undefined") {
                            matrix[rowIndex] = [];
                        }
                        // Find first available column in the first row
                        for (var k = 0; k < matrix[rowIndex].length + 1; k++) {
                            if (typeof(matrix[rowIndex][k]) == "undefined") {
                                firstAvailCol = k;
                                break;
                            }
                        }
                        lookup[cellId] = firstAvailCol;
                        for (var k = rowIndex; k < rowIndex + rowSpan; k++) {
                            if (typeof(matrix[k]) == "undefined") {
                                matrix[k] = [];
                            }
                            var matrixrow = matrix[k];
                            for (var l = firstAvailCol; l < firstAvailCol + colSpan; l++) {
                                matrixrow[l] = "x";
                            }
                        }
                    }
                }
                return lookup;
            }

            function checkCellColSpan(table, rows, row) {
                var arr = [],
                    r = table.tHead.rows,
                    c = r[row].cells;

                for (var i = 0; i < c.length; i++) {
                    var cell = c[i];

                    if (cell.colSpan > 1) {
                        arr = arr.concat(checkCellColSpan(table, headerArr, row++));
                    } else {
                        if (table.tHead.length == 1 || (cell.rowSpan > 1 || !r[row + 1])) {
                            arr.push(cell);
                        }
                        // headerArr[row] = (i+row);
                    }
                }
                return arr;
            };

            function checkHeaderMetadata(cell) {
                if (($.metadata) && ($(cell).metadata().sorter === false)) {
                    return true;
                };
                return false;
            }

            function checkHeaderOptions(table, i) {
                if ((table.config.headers[i]) && (table.config.headers[i].sorter === false)) {
                    return true;
                };
                return false;
            }
			
			 function checkHeaderOptionsSortingLocked(table, i) {
                if ((table.config.headers[i]) && (table.config.headers[i].lockedOrder)) return table.config.headers[i].lockedOrder;
                return false;
            }
			
            function applyWidget(table) {
                var c = table.config.widgets;
                var l = c.length;
                for (var i = 0; i < l; i++) {

                    getWidgetById(c[i]).format(table);
                }

            }

            function getWidgetById(name) {
                var l = widgets.length;
                for (var i = 0; i < l; i++) {
                    if (widgets[i].id.toLowerCase() == name.toLowerCase()) {
                        return widgets[i];
                    }
                }
            };

            function formatSortingOrder(v) {
                if (typeof(v) != "Number") {
                    return (v.toLowerCase() == "desc") ? 1 : 0;
                } else {
                    return (v == 1) ? 1 : 0;
                }
            }

            function isValueInArray(v, a) {
                var l = a.length;
                for (var i = 0; i < l; i++) {
                    if (a[i][0] == v) {
                        return true;
                    }
                }
                return false;
            }

            function setHeadersCss(table, $headers, list, css) {
                // remove all header information
                $headers.removeClass(css[0]).removeClass(css[1]);

                var h = [];
                $headers.each(function (offset) {
                    if (!this.sortDisabled) {
                        h[this.column] = $(this);
                    }
                });

                var l = list.length;
                for (var i = 0; i < l; i++) {
                    h[list[i][0]].addClass(css[list[i][1]]);
                }
            }

            function fixColumnWidth(table, $headers) {
                var c = table.config;
                if (c.widthFixed) {
                    var colgroup = $('<colgroup>');
                    $("tr:first td", table.tBodies[0]).each(function () {
                        colgroup.append($('<col>').css('width', $(this).width()));
                    });
                    $(table).prepend(colgroup);
                };
            }

            function updateHeaderSortCount(table, sortList) {
                var c = table.config,
                    l = sortList.length;
                for (var i = 0; i < l; i++) {
                    var s = sortList[i],
                        o = c.headerList[s[0]];
                    o.count = s[1];
                    o.count++;
                }
            }

            /* sorting methods */

            function multisort(table, sortList, cache) {

                if (table.config.debug) {
                    var sortTime = new Date();
                }

                var dynamicExp = "var sortWrapper = function(a,b) {",
                    l = sortList.length;

                // TODO: inline functions.
                for (var i = 0; i < l; i++) {

                    var c = sortList[i][0];
                    var order = sortList[i][1];
                    // var s = (getCachedSortType(table.config.parsers,c) == "text") ?
                    // ((order == 0) ? "sortText" : "sortTextDesc") : ((order == 0) ?
                    // "sortNumeric" : "sortNumericDesc");
                    // var s = (table.config.parsers[c].type == "text") ? ((order == 0)
                    // ? makeSortText(c) : makeSortTextDesc(c)) : ((order == 0) ?
                    // makeSortNumeric(c) : makeSortNumericDesc(c));
                    var s = (table.config.parsers[c].type == "text") ? ((order == 0) ? makeSortFunction("text", "asc", c) : makeSortFunction("text", "desc", c)) : ((order == 0) ? makeSortFunction("numeric", "asc", c) : makeSortFunction("numeric", "desc", c));
                    var e = "e" + i;

                    dynamicExp += "var " + e + " = " + s; // + "(a[" + c + "],b[" + c
                    // + "]); ";
                    dynamicExp += "if(" + e + ") { return " + e + "; } ";
                    dynamicExp += "else { ";

                }

                // if value is the same keep orignal order
                var orgOrderCol = cache.normalized[0].length - 1;
                dynamicExp += "return a[" + orgOrderCol + "]-b[" + orgOrderCol + "];";

                for (var i = 0; i < l; i++) {
                    dynamicExp += "}; ";
                }

                dynamicExp += "return 0; ";
                dynamicExp += "}; ";

                if (table.config.debug) {
                    benchmark("Evaling expression:" + dynamicExp, new Date());
                }

                eval(dynamicExp);

                cache.normalized.sort(sortWrapper);

                if (table.config.debug) {
                    benchmark("Sorting on " + sortList.toString() + " and dir " + order + " time:", sortTime);
                }

                return cache;
            };

            function makeSortFunction(type, direction, index) {
                var a = "a[" + index + "]",
                    b = "b[" + index + "]";
                if (type == 'text' && direction == 'asc') {
                    return "(" + a + " == " + b + " ? 0 : (" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : (" + a + " < " + b + ") ? -1 : 1 )));";
                } else if (type == 'text' && direction == 'desc') {
                    return "(" + a + " == " + b + " ? 0 : (" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : (" + b + " < " + a + ") ? -1 : 1 )));";
                } else if (type == 'numeric' && direction == 'asc') {
                    return "(" + a + " === null && " + b + " === null) ? 0 :(" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : " + a + " - " + b + "));";
                } else if (type == 'numeric' && direction == 'desc') {
                    return "(" + a + " === null && " + b + " === null) ? 0 :(" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : " + b + " - " + a + "));";
                }
            };

            function makeSortText(i) {
                return "((a[" + i + "] < b[" + i + "]) ? -1 : ((a[" + i + "] > b[" + i + "]) ? 1 : 0));";
            };

            function makeSortTextDesc(i) {
                return "((b[" + i + "] < a[" + i + "]) ? -1 : ((b[" + i + "] > a[" + i + "]) ? 1 : 0));";
            };

            function makeSortNumeric(i) {
                return "a[" + i + "]-b[" + i + "];";
            };

            function makeSortNumericDesc(i) {
                return "b[" + i + "]-a[" + i + "];";
            };

            function sortText(a, b) {
                if (table.config.sortLocaleCompare) return a.localeCompare(b);
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            };

            function sortTextDesc(a, b) {
                if (table.config.sortLocaleCompare) return b.localeCompare(a);
                return ((b < a) ? -1 : ((b > a) ? 1 : 0));
            };

            function sortNumeric(a, b) {
                return a - b;
            };

            function sortNumericDesc(a, b) {
                return b - a;
            };

            function getCachedSortType(parsers, i) {
                return parsers[i].type;
            }; /* public methods */
            this.construct = function (settings) {
                return this.each(function () {
                    // if no thead or tbody quit.
                    if (!this.tHead || !this.tBodies) return;
                    // declare
                    var $this, $document, $headers, cache, config, shiftDown = 0,
                        sortOrder;
                    // new blank config object
                    this.config = {};
                    // merge and extend.
                    config = $.extend(this.config, $.tablesorter.defaults, settings);
                    // store common expression for speed
                    $this = $(this);
                    // save the settings where they read
                    $.data(this, "tablesorter", config);
                    // build headers
                    $headers = buildHeaders(this);
                    // try to auto detect column type, and store in tables config
                    this.config.parsers = buildParserCache(this, $headers);
                    // build the cache for the tbody cells
                    cache = buildCache(this);
                    // get the css class names, could be done else where.
                    var sortCSS = [config.cssDesc, config.cssAsc];
                    // fixate columns if the users supplies the fixedWidth option
                    fixColumnWidth(this);
                    // apply event handling to headers
                    // this is to big, perhaps break it out?
                    $headers.click(

                    function (e) {
                        var totalRows = ($this[0].tBodies[0] && $this[0].tBodies[0].rows.length) || 0;
                        if (!this.sortDisabled && totalRows > 0) {
                            // Only call sortStart if sorting is
                            // enabled.
                            $this.trigger("sortStart");
                            // store exp, for speed
                            var $cell = $(this);
                            // get current column index
                            var i = this.column;
                            // get current column sort order
                            this.order = this.count++ % 2;
							// always sort on the locked order.
							if(this.lockedOrder) this.order = this.lockedOrder;
							
							// user only whants to sort on one
                            // column
                            if (!e[config.sortMultiSortKey]) {
                                // flush the sort list
                                config.sortList = [];
                                if (config.sortForce != null) {
                                    var a = config.sortForce;
                                    for (var j = 0; j < a.length; j++) {
                                        if (a[j][0] != i) {
                                            config.sortList.push(a[j]);
                                        }
                                    }
                                }
                                // add column to sort list
                                config.sortList.push([i, this.order]);
                                // multi column sorting
                            } else {
                                // the user has clicked on an all
                                // ready sortet column.
                                if (isValueInArray(i, config.sortList)) {
                                    // revers the sorting direction
                                    // for all tables.
                                    for (var j = 0; j < config.sortList.length; j++) {
                                        var s = config.sortList[j],
                                            o = config.headerList[s[0]];
                                        if (s[0] == i) {
                                            o.count = s[1];
                                            o.count++;
                                            s[1] = o.count % 2;
                                        }
                                    }
                                } else {
                                    // add column to sort list array
                                    config.sortList.push([i, this.order]);
                                }
                            };
                            setTimeout(function () {
                                // set css for headers
                                setHeadersCss($this[0], $headers, config.sortList, sortCSS);
                                appendToTable(
	                                $this[0], multisort(
	                                $this[0], config.sortList, cache)
								);
                            }, 1);
                            // stop normal event by returning false
                            return false;
                        }
                        // cancel selection
                    }).mousedown(function () {
                        if (config.cancelSelection) {
                            this.onselectstart = function () {
                                return false
                            };
                            return false;
                        }
                    });
                    // apply easy methods that trigger binded events
                    $this.bind("update", function () {
                        var me = this;
                        setTimeout(function () {
                            // rebuild parsers.
                            me.config.parsers = buildParserCache(
                            me, $headers);
                            // rebuild the cache map
                            cache = buildCache(me);
                        }, 1);
                    }).bind("updateCell", function (e, cell) {
                        var config = this.config;
                        // get position from the dom.
                        var pos = [(cell.parentNode.rowIndex - 1), cell.cellIndex];
                        // update cache
                        cache.normalized[pos[0]][pos[1]] = config.parsers[pos[1]].format(
                        getElementText(config, cell), cell);
                    }).bind("sorton", function (e, list) {
                        $(this).trigger("sortStart");
                        config.sortList = list;
                        // update and store the sortlist
                        var sortList = config.sortList;
                        // update header count index
                        updateHeaderSortCount(this, sortList);
                        // set css for headers
                        setHeadersCss(this, $headers, sortList, sortCSS);
                        // sort the table and append it to the dom
                        appendToTable(this, multisort(this, sortList, cache));
                    }).bind("appendCache", function () {
                        appendToTable(this, cache);
                    }).bind("applyWidgetId", function (e, id) {
                        getWidgetById(id).format(this);
                    }).bind("applyWidgets", function () {
                        // apply widgets
                        applyWidget(this);
                    });
                    if ($.metadata && ($(this).metadata() && $(this).metadata().sortlist)) {
                        config.sortList = $(this).metadata().sortlist;
                    }
                    // if user has supplied a sort list to constructor.
                    if (config.sortList.length > 0) {
                        $this.trigger("sorton", [config.sortList]);
                    }
                    // apply widgets
                    applyWidget(this);
                });
            };
            this.addParser = function (parser) {
                var l = parsers.length,
                    a = true;
                for (var i = 0; i < l; i++) {
                    if (parsers[i].id.toLowerCase() == parser.id.toLowerCase()) {
                        a = false;
                    }
                }
                if (a) {
                    parsers.push(parser);
                };
            };
            this.addWidget = function (widget) {
                widgets.push(widget);
            };
            this.formatFloat = function (s) {
                // commified numbers
                if (/^[-+]?[0-9]{1,3}(,[0-9]{1,3})+(\.[0-9]+)?$/.test(s)) {
                    i=s.replace(/,/g,'');
                } else {
                    var i = parseFloat(s);
                }
                return (isNaN(i)) ? 0 : i;
            };
            this.formatInt = function (s) {
                var i = parseInt(s);
                return (isNaN(i)) ? 0 : i;
            };
            this.isDigit = function (s, config) {
                // replace all an wanted chars and match.
                return /^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g, '')));
            };
            this.clearTableBody = function (table) {
                if ($.browser.msie) {
                    function empty() {
                        while (this.firstChild)
                        this.removeChild(this.firstChild);
                    }
                    empty.apply(table.tBodies[0]);
                } else {
                    table.tBodies[0].innerHTML = "";
                }
            };
        }
    });

    // extend plugin scope
    $.fn.extend({
        tablesorter: $.tablesorter.construct
    });

    // make shortcut
    var ts = $.tablesorter;

    // add default parsers
    ts.addParser({
        id: "text",
        is: function (s) {
            return true;
        }, format: function (s) {
            return $.trim(s.toLocaleLowerCase());
        }, type: "text"
    });

    ts.addParser({
        id: "digit",
        is: function (s, table) {
            var c = table.config;
            return $.tablesorter.isDigit(s, c);
        }, format: function (s) {
            return $.tablesorter.formatFloat(s);
        }, type: "numeric"
    });

    ts.addParser({
        id: "currency",
        is: function (s) {
            return /^[£$€?.]/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g), ""));
        }, type: "numeric"
    });

    ts.addParser({
        id: "ipAddress",
        is: function (s) {
            return /^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);
        }, format: function (s) {
            var a = s.split("."),
                r = "",
                l = a.length;
            for (var i = 0; i < l; i++) {
                var item = a[i];
                if (item.length == 2) {
                    r += "0" + item;
                } else {
                    r += item;
                }
            }
            return $.tablesorter.formatFloat(r);
        }, type: "numeric"
    });

    ts.addParser({
        id: "url",
        is: function (s) {
            return /^(https?|ftp|file):\/\/$/.test(s);
        }, format: function (s) {
            return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//), ''));
        }, type: "text"
    });

    ts.addParser({
        id: "isoDate",
        is: function (s) {
            return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat((s != "") ? new Date(s.replace(
            new RegExp(/-/g), "/")).getTime() : "0");
        }, type: "numeric"
    });

    ts.addParser({
        id: "percent",
        is: function (s) {
            return /\%$/.test($.trim(s));
        }, format: function (s) {
            return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g), ""));
        }, type: "numeric"
    });

    ts.addParser({
        id: "usLongDate",
        is: function (s) {
            return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));
        }, format: function (s) {
            return $.tablesorter.formatFloat(new Date(s).getTime());
        }, type: "numeric"
    });

    ts.addParser({
        id: "shortDate",
        is: function (s) {
            return /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);
        }, format: function (s, table) {
            var c = table.config;
            s = s.replace(/\-/g, "/");
            if (c.dateFormat == "us") {
                // reformat the string in ISO format
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$1/$2");
            } else if (c.dateFormat == "uk") {
                // reformat the string in ISO format
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1");
            } else if (c.dateFormat == "dd/mm/yy" || c.dateFormat == "dd-mm-yy") {
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, "$1/$2/$3");
            }
            return $.tablesorter.formatFloat(new Date(s).getTime());
        }, type: "numeric"
    });
    ts.addParser({
        id: "time",
        is: function (s) {
            return /^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat(new Date("2000/01/01 " + s).getTime());
        }, type: "numeric"
    });
    ts.addParser({
        id: "metadata",
        is: function (s) {
            return false;
        }, format: function (s, table, cell) {
            var c = table.config,
                p = (!c.parserMetadataName) ? 'sortValue' : c.parserMetadataName;
            return $(cell).metadata()[p];
        }, type: "numeric"
    });
    // add default widgets
    ts.addWidget({
        id: "zebra",
        format: function (table) {
            if (table.config.debug) {
                var time = new Date();
            }
            var $tr, row = -1,
                odd;
            // loop through the visible rows
            $("tr:visible", table.tBodies[0]).each(function (i) {
                $tr = $(this);
                // style children rows the same way the parent
                // row was styled
                if (!$tr.hasClass(table.config.cssChildRow)) row++;
                odd = (row % 2 == 0);
                $tr.removeClass(
                table.config.widgetZebra.css[odd ? 0 : 1]).addClass(
                table.config.widgetZebra.css[odd ? 1 : 0])
            });
            if (table.config.debug) {
                $.tablesorter.benchmark("Applying Zebra widget", time);
            }
        }
    });
})(jQuery);

/* ==== jquery.textrange.js ==== */
/* ==== jquery.textrange.js ==== */
(function($) {
    var textrange = {
        get: function(property) {
            var selectionText="";
            var selectionAtStart=false;
            var selectionAtEnd=false;
            var selectionStart;
            var selectionEnd
            var text = this.is(':input') ?  this.val() :  this.text();

            if (this.is(':input') && this[0].selectionStart != undefined) {
                // Standards compliant input elements
                selectionStart = this[0].selectionStart;
                selectionEnd = this[0].selectionEnd;
                selectionText = text.substring(this[0].selectionStart, this[0].selectionEnd);
                if (selectionStart == 0) {
                    selectionAtStart = true
                } else {
                    selectionAtStart = false
                }
                if (selectionEnd == text.length) {
                    selectionAtEnd = true
                } else {
                    selectionAtEnd = false
                }
            } else {
                // Content editable HTML areas
                var selection =  window.getSelection();
                if (selection.rangeCount>0) {
                    var selectedRange = selection.getRangeAt(0);
                    var elmtRange = document.createRange();
		    elmtRange.selectNodeContents(this[0]);

		    if (elmtRange.toString().search(/\S/)!=-1) {
			// Find the index of the first text not markup or whitespace.
			var editStartPosition = getRangePosition(this,elmtRange.toString().search(/\S/));
		    } else {
			var editStartPosition = getRangePosition(this,0);
		    }
		    if (elmtRange.toString().search(/\s+$/)!=-1) {
			// index of whitespace at the end of the string
			editEndPosition = getRangePosition(this,elmtRange.toString().search(/\s+$/));
		    } else {
			editEndPosition = getRangePosition(this,elmtRange.toString().length);
		    }

		    // editRange spans the editable text
		    editRange  = document.createRange();
		    editRange.setStart(editStartPosition.node,editStartPosition.offset);
		    editRange.setEnd(editEndPosition.node,editEndPosition.offset);

		    // At edit start or edit end
		    selectionAtStart = Boolean(selectedRange.compareBoundaryPoints(Range.START_TO_START,editRange)<=0);
		    selectionAtEnd = Boolean(selectedRange.compareBoundaryPoints(Range.END_TO_END,editRange)>=0);

                    // selectionStart
                    var myRange = document.createRange();
                    myRange.setStart(elmtRange.startContainer,elmtRange.startOffset);
                    myRange.setEnd(selectedRange.startContainer,selectedRange.startOffset);
                    selectionStart = myRange.toString().length;
                    // selectionEnd
                    myRange.setStart(selectedRange.endContainer,selectedRange.endOffset);
                    myRange.setEnd(elmtRange.endContainer,elmtRange.endOffset);
                    selectionEnd = elmtRange.toString().length - myRange.toString().length;
                    // selectedText
                    selectionText = selectedRange.toString();
                }
            }
            
            var props = {
                selectionText: selectionText,
                selectionAtStart: selectionAtStart,
                selectionAtEnd: selectionAtEnd,
                selectionStart: selectionStart,
                selectionEnd: selectionEnd,
                text: text

            };

            return typeof property === 'undefined' ? props : props[property];
        },

        set: function(selectionStart, selectionEnd) {
            this.focus();
            var text = this.is(':input') ?  this.val() :  this.text();
            if (selectionStart === 'start') {
                selectionStart = 0;
            } 
            if (selectionStart === 'end') {
                selectionStart = text.length;
            }
            if (selectionEnd === 'start') {
                selectionEnd = 0;
            }
            if (selectionEnd === 'end') {
                selectionEnd = text.length;
            }
            if (selectionStart === 'all' && selectionEnd===undefined ) {
                selectionStart=0
                selectionEnd = text.length;
            }
            if (this.is(':input') && this[0].selectionStart != undefined) {
                // Standards compliant input elements
                this[0].selectionStart = selectionStart;
                this[0].selectionEnd = selectionEnd;
            } else if (this.is('[contenteditable=true]') && window.getSelection && window.getSelection().rangeCount > 0) {
                // Content editable
                var selection = window.getSelection();
                var range = document.createRange();

                var startPosition = getRangePosition(this, selectionStart);
                var endPosition = getRangePosition(this, selectionEnd);

                range.setStart(startPosition.node, startPosition.offset);
                range.setEnd(endPosition.node, endPosition.offset);
                selection.removeAllRanges();
                selection.addRange(range);
            } 
            return this;
        }
    };
    function getRangePosition(node, index) {
        // Find the text node (possibly nested) and corresponding offset on the left of 
	// character at index from start of this node
        var childNodes = node.contents();
	var myRange =  document.createRange();
        if (childNodes.size()) {
            for (var i = 0; i < childNodes.size(); i++) {
                var childNode = childNodes.eq(i);
		myRange.selectNode(childNode[0]);
                textLength = myRange.toString().length;
                if ((textLength > 0 && index < textLength) || (i==childNodes.size()-1 && index==textLength)) {
		    // The point we are looking for is in this child
                    return getRangePosition(childNode, index);
                }
                index -= textLength;
            }
        } else {
            return {
                node: node[0],
                offset: index
            }
        }
    }

    $.fn.textrange = function(method) {
        if (!this.is(':input') && !this.is('[contenteditable=true]')) {
            $.error('jQuery.textrange requires that only input or contenteditable elements are contained in the jQuery object');
        }

	if (typeof textrange[method] === 'function') {
            return textrange[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error("Method " + method + " does not exist in jQuery.textrange");
        }
    };
})(jQuery);

/* ==== jquery.thSortMenu.js ==== */
// thSortMenu plugin - support for server-side table sorting
;(function($, window, undefined) {
    // Static variables, shared by all instances of this plugin on the page
    var urlData = splitURL(window.location.href);
    var path = urlData.path;
    var qryData = urlData.data;
    if ( qryData.sortCols !== undefined ) {
	var sortColsArray = qryData.sortCols.split(" ");
	var currentSortColName = sortColsArray[0];
	var currentSortColType = coalesce(sortColsArray[1], 'ASC');
    }

    // The actual widget prototype
    $.widget('qcode.thSortMenu', {
	_create: function() {
	    // Constructor function
	    // Apply default column and sort type
	    if ( this.options.column === undefined ) {
		this.options.column = this.element.parent('th').closest('table').find('col').eq( this.element.parent('th').index() );
	    }
	    if ( ! this.options.column.is('col') || this.options.column.length != 1 ) {
		$.error('Invalid column for thSortMenu');
	    }
	    if ( this.options.type === undefined ) {
		this.options.type = this.getColType(this.options.column);
	    }

	    // Bind events
	    this._on({
		'click': this.menuShow
	    });

	    // Remember parent's background color
	    this.savedBackground = this.element.parent().css('background-color');
	},
	menuShow: function(target) {
	    // Show the menu. Target is the event or element to position against.
	    if ( this.menu === undefined ) {
		this._menuCreate();
	    }
	    this.element.parent().css({
		'background-color': "#ffffe9"
	    });
	    // Use jQuery UI position method
	    this.menu
		.show()
		.position({
		    'my': "left top",
		    'of': target,
		    'collision': "fit"
		});
	},
	menuHide: function() {
	    // Hide the menu
	    this.menu.hide();
	    this.element.parent().css({
		'background-color': this.savedBackground
	    });
	},
	getColType: function(col) {
	    // Get the sort type of the given column
	    if ( col.hasClass('clsNumber') || col.hasClass('clsMoney') ) {
		return 'numeric';
	    } else if ( col.hasClass('clsDate') ) {
		return 'date';
	    } else {
		return 'alpha';
	    }
	},
	_menuCreate: function() {
	    // Create the menu
	    var colName = this.options.column.attr('name');

	    var ascURL = urlSet(window.location.href, 'sortCols', colName + " " + "ASC");
	    var descURL = urlSet(window.location.href, 'sortCols', colName + " " + "DESC");

	    // Generate link text from sort type
	    var ascText;
	    var descText;
	    switch(this.options.type) {
	    case 'numeric':
		ascText = "Sort Low to High";
		descText = "Sort High to Low";
		break;
	    case 'date':
		ascText = "Sort Old to New";
		descText = "Sort New to Old";
		break;
	    default:
		ascText = "Sort A-Z";
		descText = "Sort Z-A";
	    }

	    // Create the links
	    var ascLink = $('<a>')
		.attr( 'href',  ascURL )
		.html( ascText.replace(/\s/g, "&nbsp;") )
		.linkNoHistory();
	    var descLink = $('<a>')
		.attr( 'href',  descURL )
		.html( descText.replace(/\s/g, "&nbsp;") )
		.linkNoHistory();

	    // Create the menu element
	    this.menu = $('<div>')
		.addClass('thSortMenu')
		.appendTo($('body'))
		.css({
		    'position': "absolute",
		    'display': "none",
		    'z-index': 3
		});

	    // Add the required links to the menu
	    if ( colName === currentSortColName ) {
		if ( currentSortColType == "ASC" ) {
		    this.menu.append(descLink);
		} else {
		    this.menu.append(ascLink);
		}
	    } else {
		this.menu.append(ascLink).append(descLink);
	    }

	    // Add the menu to the widget and bind hover events
	    this.element.add(this.menu)
		.delayedGroupHover({
		    inTime: 400,
		    outTime: 400,
		    hoverOut: this.menuHide.bind(this)
		});
	}
    });
})(jQuery, window);

/* ==== jquery.theadFixed.js ==== */
(function($, undefined) {
    var scrollBarWidth = 18;

    $.widget('qcode.theadFixed', {
	options: {
	    'wrapperClass': "theadFixed-wrapper",
	    'scrollWrapperClass': "theadFixed-scrollWrapper",
	    'scrollBoxClass': "theadFixed-scrollBox",
	    'height': "500px"
	},
	_create: function() {
	    // TheadFixed Class Constructor
	    var widget = this;

	    // Attempt to handle existing wrappers sensibly.
	    if ( ! $(this.element).is('table') ) {
		this.table = $(this.element).find('table');
		if ( this.table.length !== 1 ) {
		    $.error("Each target element must be, or contain, a single table");
		}
	    } else {
		this.table = this.element;
	    }
	    var table = this.table;
	    var thead = table.children('thead');

	    // Create wrappers and apply classes
	    this.element
		.wrap('<div>');
	    this.scrollBox = this.element.parent();
	    this.scrollBox
		.addClass(this.options.scrollBoxClass)
		.wrap('<div>');
	    this.scrollWrapper = this.scrollBox.parent();
	    this.scrollWrapper
		.addClass(this.options.scrollWrapperClass)
		.wrap('<div>');
	    this.wrapper = this.scrollWrapper.parent();
	    this.wrapper
		.addClass(this.options.wrapperClass);

	    // Store any inline widths that were present before the plugin was called
	    thead.children('tr:first-child').children('th, td').each(function(index, element) {
		var th = $(element);
		var td = table.children('tbody').children('tr:first-child').children('th, td').filter(':nth-child(' + ( index + 1 )+ ')');
		th.data('theadFixedCellWidth', widget._getCellInlineWidth(th));
		td.data('theadFixedCellWidth', widget._getCellInlineWidth(td));
	    });

	    // Calculate and apply widths so that the headers match the body
	    this._setWidths();

	    // Apply css
	    this.wrapper.css({
		'position': "relative",
		'margin-top': table.css('margin-top'),
		'margin-right': table.css('margin-right'),
		'margin-bottom': table.css('margin-bottom'),
		'margin-left': table.css('margin-left'),
		'height': this.options.height
	    });
	    table.css('margin', 0);

	    this.scrollWrapper.css({
		'position': "absolute",
		'top': thead.outerHeight(),
		'bottom': 0
	    });
	    this.scrollBox.css({
		'overflow-y': "auto",
		'overflow-x': 'hidden',
		'height': "100%"
	    });

	    thead.css({
		'position': "absolute",
		'bottom': "100%",
		'left': 0
	    });

	    if ( table.css('border-collapse') == 'collapse' ) {
		table.children('tr:first-child').children('th, td').css('border-top-width', 0);
	    }

	    thead.find('tr').filter(':first-child').find('th, td').css({
		'border-top-style': table.css('border-top-style'),
		'border-top-width': table.css('border-top-width'),
		'border-top-color': table.css('border-top-color')
	    });
	    thead.find('tr').each(function(i, row){
		var cells = $(row).find('th, td').filter(':visible');
		cells.eq(0).css({
		    'border-left-style': table.css('border-left-style'),
		    'border-left-width': table.css('border-left-width'),
		    'border-left-color': table.css('border-left-color')
		});
		cells.eq(-1).css({
		    'border-right-style': table.css('border-right-style'),
		    'border-right-width': table.css('border-right-width'),
		    'border-right-color': table.css('border-right-color')
		});
	    });
	    table.css('border-top-width', 0);
	},
	repaint: function() {
	    // Recalculate widths, heights, etc.
	    var table = this.table;
	    var thead = table.children('thead');
	    thead.css({
		'position': "static"
	    });
	    this._setWidths();
	    thead.css({
		'position': "absolute"
	    });
	    this.scrollWrapper.css('top', thead.outerHeight());
	},
	_setWidths: function() {
	    // Calculate the width of each column and apply it to first-row cells in the header and body
	    var table = this.table;
	    var thead = table.children('thead');

	    // Temporarily give the table a lot of space to make sure that the column width calculations come out right
	    this.scrollBox.css('min-width', 10000);

	    // If any cells besides header cells and first-row cells have a specified width, remove it.
	    table.children('tbody, tfoot').children('tr').not(':first-child').children('th, td').css('width', '');

	    // Calculate and apply column widths
	    thead.children('tr:first-child').children('th, td').each(function(index, element) {
		var th = $(element);
		var td = table.children('tbody').children('tr:first-child').children('th, td').filter(':nth-child(' + ( index + 1 )+ ')');

		th.css('width', coalesce(th.data('theadFixedCellWidth'), ''));
		td.css('width', coalesce(td.data('theadFixedCellWidth'), ''));

		var width = Math.max( Math.ceil(th.innerWidth()), Math.ceil(td.innerWidth() ));

		// Ensures that default padding will be preserved when the thead is removed
		th.css({
		    'padding-top': th.css('padding-top'),
		    'padding-right': th.css('padding-right'),
		    'padding-bottom': th.css('padding-bottom'),
		    'padding-left': th.css('padding-left')
		});
		th.css('width', width - parseInt(th.css('padding-left')) - parseInt(th.css('padding-right')));
		td.css('width', width - parseInt(td.css('padding-left')) - parseInt(td.css('padding-right')));
	    });

	    this.scrollBox.css('min-width', table.outerWidth() + scrollBarWidth);
	},
	getWrapper: function() {
	    return this.wrapper;
	},
	getScrollWrapper: function() {
	    return this.scrollWrapper;
	},
	getScrollBox: function() {
	    return this.scrollBox;
	},
	getTable: function() {
	    return this.table;
	},
	_getCellInlineWidth: function(cell) {
	    // Gets the width from a cell's inline style attribute
	    var width,
	    style = cell.attr('style');
	    if ( style !== undefined ) {
		var pairs = style.split(';');
		$.each(pairs, function(i, pair) {
		    var bits = pair.split(':'),
		    name = $.trim(bits[0]),
		    value = $.trim(bits[1]);
		    if ( name === "width" ) {
			width = value;
			return false;
		    }
		});
		return width;
	    }
	}
    });
})(jQuery);

/* ==== jquery.utils.js ==== */
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

function urlSet(url,name,value) {
    var re = /([^\?]+)\??(.*)/;
    re.exec(url);
    var path = RegExp.$1;
    var queryString = RegExp.$2;
    url = path + "?" + urlDataSet(queryString,name,value);
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

// linkNoHistory plugin - change behaviour of links so that following them does not create an entry in browser history.
$.fn.linkNoHistory = function() {
    $(this).filter('a').on('click', function(event) {
	window.location.replace($(this).attr('href'));
	event.preventDefault();
    });
    return this;
}

$.fn.setObjectValue = function(value) {
    // Set the value of the target elements based on their type.
    this.each(function() {
	var element = $(this);
	if ( element.is('select, input, textarea') ) {
	    element.val(value);
	} else if ( element.is('.clsRadioGroup') ) {
		element.find('[name="'+element.prop('name')+'"][value="'+value+'"]').val(true);
	} else {
	    element.html(value);
	}
    });		 
    return this;
}

/* ==== tabCtl.js ==== */
function tabCtl(oCtl) {

var currentTab;

// Init
initTab: {
	for (var i=0;i<oCtl.children.length;i++) {
		var oSpan = oCtl.children[i];
		if (oSpan.selected == "true") {
			tabIn(oSpan);
			break initTab;
		}
	}
	// not found so use first
	var oSpan = oCtl.firstChild;
	tabIn(oSpan);
}

oCtl.attachEvent('onmouseup',onMouseUp);
document.attachEvent('onkeyup',onKeyUp);

// Tab strip control

function onMouseUp() {
	if ( window.event.srcElement.tagName == 'SPAN' ) {
		var oSpan = window.event.srcElement;
		tabChange(oSpan);
	}
}

function tabChange(oSpan) {
	tabOut(currentTab);
	tabIn(oSpan);
}
	
function tabIn(oSpan) {
	var id = oSpan.forPage;
	var oDiv = document.getElementById(id);
	oDiv.style.display='block';
	oSpan.runtimeStyle.cursor='auto';
	oSpan.runtimeStyle.backgroundColor='#ece9d8';
	currentTab = oSpan;
	if (currentTab.onTabIn != undefined) {
		if (typeof(currentTab.onTabIn == "string")) {
			eval(currentTab.onTabIn.toString());
		}
		if (typeof(currentTab.onTabIn == "function")) {
			currentTab.onTabIn();
		}
	}
	
	var elmts = getChildElementsWithClassName(oDiv,'TABLE','clsDbGrid')
	if (elmts.length > 0) {
		elmts[0].focus();
	}
	var elmts = getChildElementsWithClassName(oDiv,'FORM','clsDbForm')
	if (elmts.length > 0) {
		elmts[0].focus();
	}
	
}

function tabOut(oSpan) {
	var id = oSpan.forPage;
	var oDiv = document.getElementById(id);
	oDiv.style.display='none';
	oSpan.runtimeStyle.cursor='hand';
	oSpan.runtimeStyle.backgroundColor='Ivory';
}

function onKeyUp() {
	var e = window.event;
	if ( e.altKey ) {
		var accessKey = String.fromCharCode(e.keyCode).toLowerCase();
		for (var i=0;i<oCtl.children.length;i++) {
			var oSpan = oCtl.children[i];
			if (oSpan.accessKey == accessKey) {
				tabChange(oSpan);
			}
		}
	}
	e.returnValue=false;
	e.cancelBubble = true;
}

// end tabCtl
}  

/* ==== tableRowHighlight.js ==== */
function tableRowHighlight(oTable) {
	jQuery(oTable).find("tr").click(function(event) {
	    var target_td = jQuery(event.target).closest("td")[0];
	    if ( jQuery(oTable).is(".clsDbGrid, .clsDbFlexGrid") && oTable.isCellEditable(target_td) ) {
		return; 
	    }
	    jQuery(this).toggleClass('clsHighlight');
	});
}

/* ==== thSortMenu.js ==== */
function thSortMenu(oSpan) {
  var oTH;
  var oTable;
  var oTBody;
  var oColGroup;
  var oMenu;
  var oBody = document.body;
  var timerID;
  var interval = 400;
  var indicator;
  var colName;
  var colType;
  var sortCols;
  var sortType;
  var primarySortCol;
  var savedBackgroundColor;

  oSpan.attachEvent('onmouseup',onMouseUp);

  if (oSpan.parentElement.tagName=='TH') {
    oTH=oSpan.parentElement;
  } else {	
    oTH=oSpan.parentElement.forTH;
  }

  function onMouseUp() { 
    if (!oMenu) {
      oTable=getContainingElmt(oTH,'TABLE');
      oTBody=oTable.tBodies[0];
      oColGroup=getChildElementByTagName(oTable,'COLGROUP');
      colName = oColGroup.childNodes[oTH.cellIndex].name;
      colType = getColType(oColGroup,oTH.cellIndex);
      
      if (urlGet(document.location.href,'sortCols')) {
	sortCols = urlGet(document.location.href,'sortCols');
      } else {
	  //sortCols =  sortColsDefault(oColGroup);
	  sortCols = "";
      }
      sortType = getSortType(sortCols,colName);
      primarySortCol = (firstSortCol(sortCols) == colName);
      
      savedBackgroundColor = oSpan.parentElement.style.backgroundColor;

      oMenu=document.createElement('DIV');
      oMenu.className='clsSortMenu';
      oBody.appendChild(oMenu);

      oMenu.style.zIndex=3;
    

      oMenu.style.position='absolute';
      oMenu.style.visibility='hidden';
      oMenu.attachEvent('onmouseout',menuMouseOut);
      oMenu.attachEvent('onmouseover',menuMouseOver);
      oSpan.attachEvent('onmouseout',onMouseOut);
      oSpan.attachEvent('onmouseover',onMouseOver);
  
      var ascURL = urlSet(document.location.href,'sortCols',sortColsPush(sortCols,colName,'ASC'));
      var descURL = urlSet(document.location.href,'sortCols',sortColsPush(sortCols,colName,'DESC'));
 
      var ascLink;
      var descLink;
      if (colType=='NUMERIC') {
	ascLink = 'Sort&nbsp;Low&nbsp;to&nbsp;High';
	descLink = 'Sort&nbsp;High&nbsp;to&nbsp;Low';
      } else if (colType=='DATE') {
	ascLink = 'Sort&nbsp;Old&nbsp;to&nbsp;New';
	descLink = 'Sort&nbsp;New&nbsp;to&nbsp;Old';
      } else {
	ascLink = 'Sort&nbsp;A-Z';
	descLink = 'Sort&nbsp;Z-A';
      }
      if ( primarySortCol ) {
	if ( sortType == 'ASC' ) {
	  oMenu.innerHTML = '<a href="' + descURL + '" onclick="location.replace(this.href);return false;">' + descLink + '</a>';
	} else {
	  oMenu.innerHTML = '<a href="' + ascURL + '" onclick="location.replace(this.href);return false;">' + ascLink + '</a>';
	}
      } else {
	oMenu.innerHTML = '<div style="margin-bottom:4px;"><a href="' + ascURL + '" onclick="location.replace(this.href);return false;">' + ascLink + '</a>' + '</div><div>' +  '<a href="' + descURL + '" onclick="location.replace(this.href);return false;">' + descLink + '</a></div>';
      }
    }
    oSpan.parentElement.style.backgroundColor='#FFFFE9';
    oMenu.style.top=event.clientY;
    if ( event.clientX + oMenu.offsetWidth > oBody.clientWidth ) {
      oMenu.style.left= oBody.clientWidth - oMenu.offsetWidth;
    } else {
      oMenu.style.left=event.clientX;
    }
    oMenu.style.visibility='visible';
  }

 function onMouseOut() {
   if ( !timerID ) {
     timerID=window.setInterval(menuHide,interval);
   }
 }
 function onMouseOver() {
   if ( timerID ) {
     window.clearInterval(timerID);
     timerID=undefined;
   }
 }
 
 function menuMouseOut() {
   if ( !timerID ) {
     timerID=window.setInterval(menuHide,interval);
   }
 }
 function menuMouseOver() {
   if ( timerID ) {
     window.clearInterval(timerID);
     timerID=undefined;
   }
 }
 
 function menuHide() {
     oMenu.style.visibility='hidden';
     oSpan.parentElement.style.backgroundColor=savedBackgroundColor;
 }
 
 function getColType(oColGroup,index) {
   if ( oColGroup && oColGroup.childNodes[index].className) {
     var className=oColGroup.childNodes[index].className;
     if ( className == 'clsNumber' ||  className == 'clsMoney') {
       return 'NUMERIC';
     } else if ( className=='clsDate' ) {
       return 'DATE';
     } else {
       return 'ALPHA';
     }
   } else {
     return 'ALPHA';
   }
 }

 function getColTypeByInspection(oTBody,index) {
   var numerics = 0;
   var dates=0;
   var alphas=0;
   var reNumeric=/^(\+|-)?[0-9,]*(\.[0-9]*)?$/;
   var reDate=/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/;
   for(var i=0;i<oTBody.rows.length;i++) {
     var str=oTBody.rows[i].cells[index].innerText;
     if ( str == '' ) {
       continue;
     }
     if ( reNumeric.test(str) ) {
       numerics++;
     } else if ( reDate.test(str) ) {
       dates++;
     } else {
       alphas++;
       return 'ALPHA';
     }
   }
   if ( alphas==0 && dates==0 && numerics>0 ) {
     return 'NUMERIC';
   } else if (  alphas==0 && numerics==0 && dates>0 ) {
     return 'DATE';
   } else {
     return 'ALPHA';
   }
 }

 function getSortType(sortCols,colName) {
   var temp = new Array();
   temp = sortCols.split(" ");
   for (var i=0;i<temp.length;i++) {
     if ( temp[i]==colName ) {
       if (i<temp.length && temp[i+1]=='DESC') {
	 return 'DESC';
       } else {
	 return 'ASC';
       }
     }
   }
   return null;
 }

 function firstSortCol(sortCols) {
   var temp = new Array();
   temp = sortCols.split(" ");
   return temp[0];
 }

 function sortColsPush(sortCols,colName,direction) {
   var temp = new Array();
   var newlist = new Array();
   temp = sortCols.split(" ");
   newlist.push(colName);
   if ( direction == 'DESC' ) {
     newlist.push('DESC');
   }
   for (var i=0;i<temp.length;i++) {
     if ( temp[i]==colName ) {
       if (i<temp.length && (temp[i+1]=='ASC' || temp[i+1]=='DESC' )) {
	 i++;
       }
       continue;
     } else {
       newlist.push(temp[i]);
     }
   }
   return newlist.join(' ');
 }

 function sortColsDefault(oColGroup) {
   var list = new Array();
   for (var i=0;i<oColGroup.childNodes.length && i<=1;i++) {
     if ( oColGroup.childNodes[i].name ) {
       list.push(oColGroup.childNodes[i].name) ;
     }
   }
   return list.join(" ");
 }

 // END
}


/* ==== wiky.js ==== */
/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/

	Author:  Stefan Goessner/2005-06
	Web:     http://goessner.net/ 
*/
var Wiky = {
  version: 0.95,
  blocks: null,
  rules: {
     all: [
       "Wiky.rules.pre",
       "Wiky.rules.nonwikiblocks",
       "Wiky.rules.wikiblocks",
       "Wiky.rules.post",
     ],
     pre: [
       { rex:/(\r?\n)/g, tmplt:"\xB6" },  // replace line breaks with '¶' ..
     ],
     post: [
       { rex:/(^\xB6)|(\xB6$)/g, tmplt:"" },  // .. remove linebreaks at BOS and EOS ..
       { rex:/@([0-9]+)@/g, tmplt:function($0,$1){return Wiky.restore($1);} }, // resolve blocks ..
       { rex:/\xB6/g, tmplt:"\n" } // replace '¶' with line breaks ..
     ],
     nonwikiblocks: [
       { rex:/\\([%])/g, tmplt:function($0,$1){return Wiky.store($1);} },
       { rex:/\[(?:\{([^}]*)\})?(?:\(([^)]*)\))?%(.*?)%\]/g, tmplt:function($0,$1,$2,$3){return ":p]"+Wiky.store("<pre"+($2?(" lang=\"x-"+Wiky.attr($2)+"\""):"")+Wiky.style($1)+">" + Wiky.apply($3, $2?Wiky.rules.lang[Wiky.attr($2)]:Wiky.rules.code) + "</pre>")+"[p:";} } //programm code block
     ],
     wikiblocks: [
       "Wiky.rules.nonwikiinlines",
       "Wiky.rules.escapes",
       { rex:/(?:^|\xB6)(={1,6})(.*?)[=]*(?=\xB6|$)/g, tmplt:function($0,$1,$2){ var h=$1.length; return ":p]\xB6<h"+h+">"+$2+"</h"+h+">\xB6[p:";} }, // <h1> .. <h6>
       { rex:/(?:^|\xB6)[-]{4}(?:\xB6|$)/g, tmplt:"\xB6<hr/>\xB6" },  // horizontal ruler ..
       { rex:/\\\\([ \xB6])/g, tmplt:"<br/>$1" },  // forced line break ..
       { rex:/(^|\xB6)([*01aAiIg]*[\.*])[ ]/g, tmplt:function($0,$1,$2){var state=$2.replace(/([*])/g,"u").replace(/([\.])/,"");return ":"+state+"]"+$1+"["+state+":";}},
       { rex:/(?:^|\xB6);[ ](.*?):[ ]/g, tmplt:"\xB6:l][l:$1:d][d:"},  // ; term : definition
       { rex:/\[(?:\{([^}]*)\})?(?:\(([^)]*)\))?\"/g, tmplt:function($0,$1,$2){return ":p]<blockquote"+Wiky.attr($2,"cite",0)+Wiky.attr($2,"title",1)+Wiky.style($1)+">[p:"; } }, // block quotation start
       { rex:/\"\]/g, tmplt:":p]</blockquote>[p:" }, // block quotation end
       { rex:/\[(\{[^}]*\})?\|/g, tmplt:":t]$1[r:" },  // .. start table ..
       { rex:/\|\]/g, tmplt:":r][t:" },  // .. end table ..
       { rex:/\|\xB6[ ]?\|/g, tmplt:":r]\xB6[r:" },  // .. end/start table row ..
       { rex:/\|/g, tmplt:":c][c:" },  // .. end/start table cell ..
       { rex:/^(.*)$/g, tmplt:"[p:$1:p]" },  // start paragraph '[p:' at BOS .. end paragraph ':p]' at EOS ..
       { rex:/(([\xB6])([ \t\f\v\xB6]*?)){2,}/g, tmplt:":p]$1[p:" },  // .. separate paragraphs at blank lines ..
       { rex:/\[([01AIacdgilprtu]+)[:](.*?)[:]([01AIacdgilprtu]+)\]/g, tmplt:function($0,$1,$2,$3){return Wiky.sectionRule($1==undefined?"":$1,"",Wiky.apply($2,Wiky.rules.wikiinlines),!$3?"":$3);} },
       { rex:/\[[01AIacdgilprtu]+[:]|[:][01AIacdgilprtu]+\]/g, tmplt:"" },  // .. remove singular section delimiters (they frequently exist with incomplete documents while typing) ..
       { rex:/<td>(?:([0-9]*)[>])?([ ]?)(.*?)([ ]?)<\/td>/g, tmplt:function($0,$1,$2,$3,$4){return "<td"+($1?" colspan=\""+$1+"\"":"")+($2==" "?(" style=\"text-align:"+($2==$4?"center":"right")+";\""):($4==" "?" style=\"text-align:left;\"":""))+">"+$2+$3+$4+"</td>";} },
       { rex:/<(p|table)>(?:\xB6)?(?:\{(.*?)\})/g, tmplt:function($0,$1,$2){return "<"+$1+Wiky.style($2)+">";} },
       { rex:/<p>([ \t\f\v\xB6]*?)<\/p>/g, tmplt:"$1" },  // .. remove empty paragraphs ..
       "Wiky.rules.shortcuts"
     ],
     nonwikiinlines: [
       { rex:/%(?:\{([^}]*)\})?(?:\(([^)]*)\))?(.*?)%/g, tmplt:function($0,$1,$2,$3){return Wiky.store("<code"+($2?(" lang=\"x-"+Wiky.attr($2)+"\""):"")+Wiky.style($1)+">" + Wiky.apply($3, $2?Wiky.rules.lang[Wiky.attr($2)]:Wiky.rules.code) + "</code>");} }, // inline code
       { rex:/%(.*?)%/g, tmplt:function($0,$1){return Wiky.store("<code>" + Wiky.apply($2, Wiky.rules.code) + "</code>");} }
     ],
     wikiinlines: [
       { rex:/\*\*((\*?[^\*])+)\*\*/g, tmplt:"<strong>$1</strong>" },  // .. bold ..
       { rex:/__((_?[^_])+)__/g, tmplt:"<u>$1</u>" },
       { rex:/(^|[^a-z0-9:])\/\/((\/?[^\/])+)\/\/([^a-z0-9]|$)/gi, tmplt:"$1<em>$2</em>$4" },
       { rex:/\^([^^]+)\^/g, tmplt:"<sup>$1</sup>" },
       { rex:/~([^~]+)~/g, tmplt:"<sub>$1</sub>" },
       { rex:/\(-(.+?)-\)/g, tmplt:"<del>$1</del>" },
       { rex:/\?([^ \t\f\v\xB6]+)\((.+)\)\?/g, tmplt:"<abbr title=\"$2\">$1</abbr>" },  // .. abbreviation ..
       { rex:/\[(?:\{([^}]*)\})?[Ii]ma?ge?\:([^ ,\]]*)(?:[, ]([^\]]*))?\]/g, tmplt:function($0,$1,$2,$3){return Wiky.store("<img"+Wiky.style($1)+" src=\""+$2+"\" alt=\""+($3?$3:$2)+"\" title=\""+($3?$3:$2)+"\"/>");} },  // wikimedia image style ..
       { rex:/\[([^ ,]+)[, ]([^\]]*)\]/g, tmplt:function($0,$1,$2){return Wiky.store("<a href=\""+$1+"\">"+$2+"</a>");}},  // wiki block style uri's ..
       { rex:/(((http(s?))\:\/\/)?[A-Za-z0-9\._\/~\-:]+\.(?:png|jpg|jpeg|gif|bmp))/g, tmplt:function($0,$1,$2){return Wiky.store("<img src=\""+$1+"\" alt=\""+$1+"\"/>");} },  // simple images .. 
       { rex:/((mailto\:|javascript\:|(news|file|(ht|f)tp(s?))\:\/\/)[A-Za-z0-9\.:_\/~%\-+&$#?!=()@\x80-\xB5\xB7\xFF]+)/g, tmplt:"<a href=\"$1\">$1</a>" }  // simple uri's .. 
     ],
     escapes: [
       { rex:/\\([|*~\^])/g, tmplt:function($0,$1){return Wiky.store($1);} },
       { rex:/\\&/g, tmplt:"&amp;" },
       { rex:/\\>/g, tmplt:"&gt;" },
       { rex:/\\</g, tmplt:"&lt;" }
     ],
     shortcuts: [
       { rex:/---/g, tmplt:"&#8212;" },  // &mdash;
       { rex:/--/g, tmplt:"&#8211;" },  // &ndash;
       { rex:/[\.]{3}/g, tmplt:"&#8230;"}, // &hellip;
       { rex:/<->/g, tmplt:"&#8596;"}, // $harr;
       { rex:/<-/g, tmplt:"&#8592;"}, // &larr;
       { rex:/->/g, tmplt:"&#8594;"}, //&rarr;
     ],
     code: [
       { rex:/&/g, tmplt:"&amp;"},
       { rex:/</g, tmplt:"&lt;"},
       { rex:/>/g, tmplt:"&gt;"}
     ],
     lang: {}
   },

   inverse: {
     all: [
       "Wiky.inverse.pre",
       "Wiky.inverse.nonwikiblocks",
       "Wiky.inverse.wikiblocks",
       "Wiky.inverse.post"
     ],
     pre: [
       { rex:/(\r?\n)/g, tmplt:"\xB6" }  // replace line breaks with '¶' ..
     ],
     post: [
       { rex:/@([0-9]+)@/g, tmplt:function($0,$1){return Wiky.restore($1);} },  // resolve blocks ..
       { rex:/\xB6/g, tmplt:"\n" }  // replace '¶' with line breaks ..
     ],
     nonwikiblocks: [
       { rex:/<pre([^>]*)>(.*?)<\/pre>/mgi, tmplt:function($0,$1,$2){return Wiky.store("["+Wiky.invStyle($1)+Wiky.invAttr($1,["lang"]).replace(/x\-/,"")+"%"+Wiky.apply($2, Wiky.hasAttr($1,"lang")?Wiky.inverse.lang[Wiky.attrVal($1,"lang").substr(2)]:Wiky.inverse.code)+"%]");} } //code block
     ],
     wikiblocks: [
       "Wiky.inverse.nonwikiinlines",
       "Wiky.inverse.escapes",
       "Wiky.inverse.wikiinlines",
       { rex:/<h1>(.*?)<\/h1>/mgi, tmplt:"\xB6=$1=\xB6" },
       { rex:/<h2>(.*?)<\/h2>/mgi, tmplt:"\xB6==$1==\xB6" },
       { rex:/<h3>(.*?)<\/h3>/mgi, tmplt:"\xB6===$1===\xB6" },
       { rex:/<h4>(.*?)<\/h4>/mgi, tmplt:"\xB6====$1====\xB6" },
       { rex:/<h5>(.*?)<\/h5>/mgi, tmplt:"\xB6=====$1=====\xB6" },
       { rex:/<h6>(.*?)<\/h6>/mgi, tmplt:"\xB6======$1======\xB6" },
       { rex:/<(p|table)[^>]+(style=\"[^\"]*\")[^>]*>/mgi, tmplt:function($0,$1,$2){return "<"+$1+">"+Wiky.invStyle($2);} },
       { rex:/ *\xB6{2} *<li/mgi, tmplt:"\xB6<li" },  // ie6 only ..
       { rex:/ *<li class=\"?([^ >\"]*)\"?[^>]*?>([^<]*)/mgi, tmplt:function($0,$1,$2){return $1.replace(/u/g,"\xB6*").replace(/([01aAiIg])$/,"$1.")+" "+$2;}},  // list items ..
       { rex:/(^| *\xB6) *<(u|o)l[^>]*?>\xB6/mgi, tmplt:"$1" },  // only outer level list start at BOL ...
       { rex:/(<\/(?:dl|ol|ul|p)> *[ \xB6]* *<(?:p)>)/gi, tmplt:"\xB6\xB6" },
       { rex:/ *<dt>(.*?)<\/dt> *[ \f\n\r\t\v]* *<dd>/mgi, tmplt:"; $1: " },
       { rex:/<blockquote([^>]*)>/mgi, tmplt:function($0,$1){return Wiky.store("["+Wiky.invStyle($1)+Wiky.invAttr($1,["cite","title"])+"\"");} },
       { rex:/<\/blockquote>/mgi, tmplt:"\"]" },
       { rex:/<td class=\"?lft\"?>\xB6*[ ]?|<\/tr>/mgi, tmplt:"|" },  // ie6 only ..
       { rex:/\xB6<tr(?:[^>]*?)>/mgi, tmplt:"\xB6" },
       { rex:/<td colspan=\"([0-9]+)\"(?:[^>]*?)>/mgi, tmplt:"|$1>" },
       { rex:/<td(?:[^>]*?)>/mgi, tmplt:"|" },
       { rex:/<table>/mgi, tmplt:"[" },
       { rex:/<\/table>/mgi, tmplt:"]" },
       { rex:/<tr(?:[^>]*?)>\xB6*|<\/td>\xB6*|<tbody>\xB6*|<\/tbody>/mgi, tmplt:"" },
       { rex:/<hr\/?>/mgi, tmplt:"\xB6----\xB6" },
       { rex:/<br\/?> */mgi, tmplt:"\\\\\xB6" },
       { rex:/( *<p>| *<(d|o|u)l[^>]*>|<\/(dl|ol|ul)> *|<\/(li|dd)> *)/mgi, tmplt:"" },
       { rex:/(<\/p> *)/mgi, tmplt:"\xB6" },
       "Wiky.inverse.shortcuts"
     ],
     nonwikiinlines: [
       { rex:/<code>(.*?)<\/code>/g, tmplt:function($0,$1){return Wiky.store("%"+Wiky.apply($1, Wiky.inverse["code"])+"%");} }
     ],
     wikiinlines: [
       { rex:/<strong[^a-z>]*?>(.*?)<\/strong>/mgi, tmplt:"**$1**" },
       { rex:/<b[^a-z>]*?>(.*?)<\/b>/mgi, tmplt:"**$1**" },
       { rex:/<em[^a-z>]*?>(.*?)<\/em>/mgi, tmplt:"//$1//" },
       { rex:/<i[^a-z>]*?>(.*?)<\/i>/mgi, tmplt:"//$1//" },
       { rex:/<u[^a-z>]*?>(.*?)<\/u>/mgi, tmplt:"__$1__" },
       { rex:/<sup[^>]*?>(.*?)<\/sup>/mgi, tmplt:"^$1^" },
       { rex:/<sub[^>]*?>(.*?)<\/sub>/mgi, tmplt:"~$1~" },
       { rex:/<del[^>]*?>(.*?)<\/del>/mgi, tmplt:"(-$1-)" },
       { rex:/<abbr title=\"([^\"]*)\">(.*?)<\/abbr>/mgi, tmplt:"?$2($1)?" },
       { rex:/<a href=\"([^\"]*)\"[^>]*?>(.*?)<\/a>/mgi, tmplt:function($0,$1,$2){return $1==$2?$1:"["+$1+","+$2+"]";}},
       { rex:/<img([^>]*)\/>/mgi, tmplt:function($0,$1){var a=Wiky.attrVal($1,"alt"),h=Wiky.attrVal($1,"src"),t=Wiky.attrVal($1,"title"),s=Wiky.attrVal($1,"style");return s||(t&&h!=t)?("["+Wiky.invStyle($1)+"img:"+h+(t&&(","+t))+"]"):h;}},
     ],
     escapes: [
       { rex:/([|*~%\^])/g, tmplt:"\\$1" },
       { rex:/&amp;/g, tmplt:"\\&" },
       { rex:/&gt;/g, tmplt:"\\>" },
       { rex:/&lt;/g, tmplt:"\\<" }
     ],
     shortcuts: [
       { rex:/&#8211;|\u2013/g, tmplt:"--"},
       { rex:/&#8212;|\u2014/g, tmplt:"---"},
       { rex:/&#8230;|\u2026/g, tmplt:"..."},
       { rex:/&#8596;|\u2194/g, tmplt:"<->"},
       { rex:/&#8592;|\u2190/g, tmplt:"<-"},
       { rex:/&#8594;|\u2192/g, tmplt:"->"}
     ],
     code: [
       { rex:/&amp;/g, tmplt:"&"},
       { rex:/&lt;/g, tmplt:"<"},
       { rex:/&gt;/g, tmplt:">"}
     ],
     lang: {}
   },

   toHtml: function(str) {
      Wiky.blocks = [];
      return Wiky.apply(str, Wiky.rules.all);
   },

   toWiki: function(str) {
      Wiky.blocks = [];
      return Wiky.apply(str, Wiky.inverse.all);
   },

   apply: function(str, rules) {
      if (str && rules)
         for (var i in rules) {
            if (typeof(rules[i]) == "string")
               str = Wiky.apply(str, eval(rules[i]));
            else
               str = str.replace(rules[i].rex, rules[i].tmplt);
         }
      return str;
   },
   store: function(str, unresolved) {
      return unresolved ? "@" + (Wiky.blocks.push(str)-1) + "@"
                        : "@" + (Wiky.blocks.push(str.replace(/@([0-9]+)@/g, function($0,$1){return Wiky.restore($1);}))-1) + "@";
   },
   restore: function(idx) {
      return Wiky.blocks[idx];
   },
   attr: function(str, name, idx) {
      var a = str && str.split(",")[idx||0];
      return a ? (name ? (" "+name+"=\""+a+"\"") : a) : "";
   },
   hasAttr: function(str, name) {
      return new RegExp(name+"=").test(str);
   },
   attrVal: function(str, name) {
      return str.replace(new RegExp("^.*?"+name+"=\"(.*?)\".*?$"), "$1");
   },
   invAttr: function(str, names) {
      var a=[], x;
      for (var i in names)
         if (str.indexOf(names[i]+"=")>=0) 
            a.push(str.replace(new RegExp("^.*?"+names[i]+"=\"(.*?)\".*?$"), "$1"));
      return a.length ? ("("+a.join(",")+")") : "";
   },
   style: function(str) {
      var s = str && str.split(/,|;/), p, style = "";
      for (var i in s) {
         p = s[i].split(":");
         if (p[0] == ">")       style += "margin-left:4em;";
         else if (p[0] == "<")  style += "margin-right:4em;";
         else if (p[0] == ">>") style += "float:right;";
         else if (p[0] == "<<") style += "float:left;";
         else if (p[0] == "=") style += "display:block;margin:0 auto;";
         else if (p[0] == "_")  style += "text-decoration:underline;";
         else if (p[0] == "b")  style += "border:solid 1px;";
         else if (p[0] == "c")  style += "color:"+p[1]+";";
         else if (p[0] == "C")  style += "background:"+p[1]+";";
         else if (p[0] == "w")  style += "width:"+p[1]+";";
         else                   style += p[0]+":"+p[1]+";";
      }
      return style ? " style=\""+style+"\"" : "";
   },
   invStyle: function(str) {
      var s = /style=/.test(str) ? str.replace(/^.*?style=\"(.*?)\".*?$/, "$1") : "",
          p = s && s.split(";"), pi, prop = [];
      for (var i in p) {
         pi = p[i].split(":");
         if (pi[0] == "margin-left" && pi[1]=="4em") prop.push(">");
         else if (pi[0] == "margin-right" && pi[1]=="4em") prop.push("<");
         else if (pi[0] == "float" && pi[1]=="right") prop.push(">>");
         else if (pi[0] == "float" && pi[1]=="left") prop.push("<<");
         else if (pi[0] == "margin" && pi[1]=="0 auto") prop.push("=");
         else if (pi[0] == "display" && pi[1]=="block") ;
         else if (pi[0] == "text-decoration" && pi[1]=="underline") prop.push("_");
         else if (pi[0] == "border" && pi[1]=="solid 1px") prop.push("b");
         else if (pi[0] == "color") prop.push("c:"+pi[1]);
         else if (pi[0] == "background") prop.push("C:"+pi[1]);
         else if (pi[0] == "width") prop.push("w:"+pi[1]);
         else if (pi[0]) prop.push(pi[0]+":"+pi[1]);
      }
      return prop.length ? ("{" + prop.join(",") + "}") : "";
   },
   sectionRule: function(fromLevel, style, content, toLevel) {
      var trf = { p_p: "<p>$1</p>",
                  p_u: "<p>$1</p><ul$3>",
                  p_o: "<p>$1</p><ol$3>",
                  // p - ul
                  // ul - p
                  u_p: "<li$2>$1</li></ul>",
                  u_c: "<li$2>$1</li></ul></td>",
                  u_r: "<li$2>$1</li></ul></td></tr>",
                  uu_p: "<li$2>$1</li></ul></li></ul>",
                  uo_p: "<li$2>$1</li></ol></li></ul>",
                  uuu_p: "<li$2>$1</li></ul></li></ul></li></ul>",
                  uou_p: "<li$2>$1</li></ul></li></ol></li></ul>",
                  uuo_p: "<li$2>$1</li></ol></li></ul></li></ul>",
                  uoo_p: "<li$2>$1</li></ol></li></ol></li></ul>",
                  // ul - ul
                  u_u: "<li$2>$1</li>",
                  uu_u: "<li$2>$1</li></ul></li>",
                  uo_u: "<li$2>$1</li></ol></li>",
                  uuu_u: "<li$2>$1</li></ul></li></ul></li>",
                  uou_u: "<li$2>$1</li></ul></li></ol></li>",
                  uuo_u: "<li$2>$1</li></ol></li></ul></li>",
                  uoo_u: "<li$2>$1</li></ol></li></ol></li>",
                  u_uu: "<li$2>$1<ul$3>",
                  // ul - ol
                  u_o: "<li$2>$1</li></ul><ol$3>",
                  uu_o: "<li$2>$1</li></ul></li></ul><ol$3>",
                  uo_o: "<li$2>$1</li></ol></li></ul><ol$3>",
                  uuu_o: "<li$2>$1</li></ul></li></ul></li></ul><ol$3>",
                  uou_o: "<li$2>$1</li></ul></li></ol></li></ul><ol$3>",
                  uuo_o: "<li$2>$1</li></ol></li></ul></li></ul><ol$3>",
                  uoo_o: "<li$2>$1</li></ol></li></ol></li></ul><ol$3>",
                  u_uo: "<li$2>$1<ol$3>",
                  // ol - p
                  o_p: "<li$2>$1</li></ol>",
                  oo_p: "<li$2>$1</li></ol></li></ol>",
                  ou_p: "<li$2>$1</li></ul></li></ol>",
                  ooo_p: "<li$2>$1</li></ol></li></ol>",
                  ouo_p: "<li$2>$1</li></ol></li></ul></li></ol>",
                  oou_p: "<li$2>$1</li></ul></li></ol></li></ol>",
                  ouu_p: "<li$2>$1</li></ul></li></ul></li></ol>",
                  // ol - ul
                  o_u: "<li$2>$1</li></ol><ul$3>",
                  oo_u: "<li$2>$1</li></ol></li></ol><ul$3>",
                  ou_u: "<li$2>$1</li></ul></li></ol><ul$3>",
                  ooo_u: "<li$2>$1</li></ol></li></ol></li></ol><ul$3>",
                  ouo_u: "<li$2>$1</li></ol></li></ul></li></ol><ul$3>",
                  oou_u: "<li$2>$1</li></ul></li></ol></li></ol><ul$3>",
                  ouu_u: "<li$2>$1</li></ul></li></ul></li></ol><ul$3>",
                  o_ou: "<li$2>$1<ul$3>",
                  // -- ol - ol --
                  o_o: "<li$2>$1</li>",
                  oo_o: "<li$2>$1</li></ol></li>",
                  ou_o: "<li$2>$1</li></ul></li>",
                  ooo_o: "<li$2>$1</li></ol></li></ol></li>",
                  ouo_o: "<li$2>$1</li></ol></li></ul></li>",
                  oou_o: "<li$2>$1</li></ul></li></ol></li>",
                  ouu_o: "<li$2>$1</li></ul></li></ul></li>",
                  o_oo: "<li$2>$1<ol$3>",
                  // -- dl --
                  l_d: "<dt>$1</dt>",
                  d_l: "<dd>$1</dd>",
                  d_u: "<dd>$1</dd></dl><ul>",
                  d_o: "<dd>$1</dd></dl><ol>",
                  p_l: "<p>$1</p><dl>",
                  u_l: "<li$2>$1</li></ul><dl>",
                  o_l: "<li$2>$1</li></ol><dl>",
                  uu_l: "<li$2>$1</li></ul></li></ul><dl>",
                  uo_l: "<li$2>$1</li></ol></li></ul><dl>",
                  ou_l: "<li$2>$1</li></ul></li></ol><dl>",
                  oo_l: "<li$2>$1</li></ol></li></ol><dl>",
                  d_p: "<dd>$1</dd></dl>",
                  // -- table --
                  p_t: "<p>$1</p><table>",
                  p_r: "<p>$1</p></td></tr>",
                  p_c: "<p>$1</p></td>",
                  t_p: "</table><p>$1</p>",
                  r_r: "<tr><td>$1</td></tr>",
                  r_p: "<tr><td><p>$1</p>",
                  r_c: "<tr><td>$1</td>",
                  r_u: "<tr><td>$1<ul>",
                  c_p: "<td><p>$1</p>",
                  c_r: "<td>$1</td></tr>",
                  c_c: "<td>$1</td>",
//                  c_u: "<td>$1<ul>",
                  u_t: "<li$2>$1</li></ul><table>",
                  o_t: "<li$2>$1</li></ol><table>",
                  d_t: "<dd>$1</dd></dl><table>",
                  t_u: "</table><p>$1</p><ul>",
                  t_o: "</table><p>$1</p><ol>",
                  t_l: "</table><p>$1</p><dl>"
      };
      var type = { "0": "decimal-leading-zero",
                   "1": "decimal",
                   "a": "lower-alpha",
                   "A": "upper-alpha",
                   "i": "lower-roman",
                   "I": "upper-roman",
                   "g": "lower-greek" };

      var from = "", to = "", maxlen = Math.max(fromLevel.length, toLevel.length), sync = true, sectiontype = type[toLevel.charAt(toLevel.length-1)], transition;

      for (var i=0; i<maxlen; i++)
         if (fromLevel.charAt(i+1) != toLevel.charAt(i+1) || !sync || i == maxlen-1)
         {
            from += fromLevel.charAt(i) == undefined ? " " : fromLevel.charAt(i);
            to += toLevel.charAt(i) == undefined ? " " : toLevel.charAt(i);
            sync = false;
         }
      transition = (from + "_" + to).replace(/([01AIagi])/g, "o");
      return !trf[transition] ? ("?(" +  transition + ")")  // error string !
                              : trf[transition].replace(/\$2/, " class=\"" + fromLevel + "\"")
                                               .replace(/\$3/, !sectiontype ? "" : (" style=\"list-style-type:" + sectiontype + ";\""))
                                               .replace(/\$1/, content)
                                               .replace(/<p><\/p>/, "");
   }
}


