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

/* ==== dbGridCache.js ==== */

function dbGridCache(oTable) {
// A database type grid to add update and delete rows.
// Attach to table.
// Normally associated with a header table which can call resize
//
// You can fire an event rowAction by created a property "action" 
// associated with the column. This calls the url contained in the prop action

// Events
// onRowActionReturn passes evnt - fired after return from the server without any error
// onRowOut passes oTR
// onRowIn passes oTR

// vars
var currentCell;

// Input Controls
var oInputCtl;
var oInput;
var oCombo;
var oTextArea;
//
var oColGroup;
var oTable;
var oTBody;
var oDivStatus;
//
var recOffsetTop;
var recOffsetBottom;
var pageSize=30;
var recSize = 1607;
var rowHeight = 20;
var marginTop;
var marginBottom;
var pageLock = false;
var savedScrollTop=0;
var inScroll = false;
var xmlCache;
// Parameters
if ( oTable.initialFocus == undefined ) { oTable.initialFocus = "false" };
if ( oTable.enabled == undefined ) { oTable.enabled = "true" };

//
// Methods
oTable.resize = resize;
oTable.focus = focus;
oTable.save = save;
oTable.requery = requery;
oTable.rowAction = rowAction;
oTable.rowRemove = rowRemove;
oTable.sort = sort;
oTable.find = find;
oTable.getCellValue = getCellValue;
oTable.pageUp=pageUp;
oTable.pageDown=pageDown;
oTable.page = page;
oTable.pageTo = pageTo;
// Init
init();
//
// TABLE //
//
function init() {
	oTBody = oTable.tBodies[0];
	oColGroup =oTable.children[0];
	if ( oColGroup.tagName != 'COLGROUP') {
		throw "This behavior requires a COLGROUP"
	}
	// Status Div
	var divs = getChildElementsWithClassName(document,'DIV','clsDbGridDivStatus');
	for (var i=0;i<divs.length;i++) {
		if (divs[i].forTable == oTable.id) {
			oDivStatus = divs[i];
		}
	}
	if ( oTable.enabled == "true" ) {
		// Init input controls
		inputControlsInit();
		// Bind
		oTBody.attachEvent('onmouseup',cellOnMouseUp);
		window.attachEvent('onbeforeunload',onBeforeUnload);
		//oTable.parentElement.attachEvent('onscroll',onScroll2);
		window.setInterval(onScroll,50);
	}
	// static
	if ( oTable.dataURL !=undefined ) {
		requery();
	} else {
		if ( oTable.enabled == "true" ) {
			init2()
		}
	}
}
function onScroll() {
	var oDiv = oTable.parentElement;
	if (oDiv.scrollTop != savedScrollTop) {
		savedScrollTop = oDiv.scrollTop;
		inScroll=true;	
	} else {
		if ( inScroll ) {
			// scrollEnd
			inScroll = false;
			pageTo();
		}
	}
}

function getRecsBottom() {
	var oDiv = oTable.parentElement;
	var bottom = marginTop + oTable.clientHeight - oDiv.scrollTop - oDiv.clientHeight;
	return Math.floor(bottom/rowHeight);
}
function getRecsTop() {
	var oDiv = oTable.parentElement;
	var top = oDiv.scrollTop - marginTop;
	return Math.floor(top/rowHeight);
}
function init2() {
	if ( oTable.addURL !=null ) {
		createNewRow();
	}
	
	out: {
		for (var i=0;i<oTBody.rows.length;i++) {
			for (var j=0;j<oTBody.rows[i].cells.length;j++) {
				var oTD = oTBody.rows[i].cells[j];
				if ( isCellEditable(oTD) ) {
					currentCell = oTD;
					var oTR = getContainingElmt(oTD,'TR');
					rowIn(oTR);
					if ( oTable.initialFocus == "true" ) {
						cellIn(oTD,true);
					} else {
						cellIn(oTD,false);
					}
					break out;
				}
			}
		}
		//Could not find an editable cell
	} // end out
	recOffsetTop=0;
	recOffsetBottom = oTBody.rows.length-1;
	rowHeight = currentCell.offsetHeight;
	var recs = oTBody.rows.length-1;
	marginTop =0;
	marginBottom = rowHeight*(recSize - recs)
	oTable.style.marginBottom = marginBottom;
}

function focus() {
	if (currentCell != undefined) {
		cellIn(currentCell,true);
	}
}

function onBeforeUnload() {
	if (currentCell == undefined) {	
		return false;
	}
	var oTR = getContainingElmt(currentCell,'TR');
	if ( oTR.rowState == 'dirty' ) {
		if (window.confirm('Do you want to save your changes?')) {
			save(oTR,false);
			if (oTR.rowState == 'error' ) {
				event.returnValue = "Your changes could not been saved.\nStay on the current page to correct.";
			}
		}
	}
}

function resize(colIdx,width) {
	oColGroup.children[colIdx].style.width = width;
	if ( currentCell != undefined ) {
		cellIn(currentCell);
	}
}
function sort(colIdx,cmp) {
	tableBubbleSort(oTBody,colIdx,cmp);
	cellIn(currentCell);
}
function find(colName,search) {
	var found = false;
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == colName ) {
			var colIdx = i;
		}
	}
	for(var i=0;i<oTBody.rows.length;i++) {
		var oTD = oTBody.rows[i].cells[colIdx];
		if (oTD.innerText == search ) {
			while ( ! isCellEditable(oTD) ) {
				oTD = moveRight(oTD);
			}
			cellChange(oTD);
			found = true;
			break;
		}
	}
	if ( ! found ) {
		alert("Could not find " + search + ".");
	}
}

function save(oTR,async) {
	var oTR;
	if ( oTR == undefined ) {
		oTR = getContainingElmt(currentCell,'TR');
	}
	if ( oTR.rowType =='add' && oTable.addURL != null) {
		return rowAction(oTR,'add',oTable.addURL,rowActionReturn,async);
	}
	if ( oTR.rowType =='update' && oTable.updateURL != null) {
		return rowAction(oTR,'update',oTable.updateURL,rowActionReturn,async);
	}
}
function del(oTR) {
	var oTR;
	if ( oTR == undefined ) {
		oTR = getContainingElmt(currentCell,'TR');
	}
	if ( oTR.rowType == 'update' && oTable.deleteURL != null ) {
		if ( window.confirm("Delete the current record?") ) {
			// async fasle
			rowAction(oTR,'delete',oTable.deleteURL,rowActionReturn,false);
		}
	}
}
//
// INPUT //
//
function inputControlCallback(e) {
	if (e.type == 'keydown') {
		cellOnKeyDown(e);
	}
	if (e.type == 'keyup') {
		cellOnKeyUp(e);
	}
}

function inputControlsInit() {
	// Container 
	// parentElement should be div.dbContainer
	var oDivContainer = oTable.parentElement;
	oInput = dbGridInput(inputControlCallback)
	oDivContainer.appendChild(oInput);
	
	oCombo = dbGridCombo(inputControlCallback)
	oDivContainer.appendChild(oCombo);
}

//
// CELL
//

function cellChange(newCell) {
	var newRow = getContainingElmt(newCell,'TR');
	if (currentCell == undefined) {
		rowIn(newRow);
		cellIn(newCell,true);
	} else {
		var oldCell = currentCell;
		var oldRow = getContainingElmt(oldCell,'TR');

		// Row Change
		if ( newRow.sectionRowIndex != oldRow.sectionRowIndex ) {
			cellOut(oldCell);
			rowOut(oldRow);
			rowIn(newRow);
			cellIn(newCell,true);
		} else {
			cellOut(oldCell);
			cellIn(newCell,true);
		}
	}
}

function cellIn(oTD,select) {
	currentCell = oTD;
	// Hide the cell
	oTD.style.visibility='hidden';
	// Decide which inputControl to use
	var type = oColGroup.children[oTD.cellIndex].type;
	if (  type == undefined ) {
		type = 'text';
	}
	if ( type == 'text' ) {
		oInputCtl = oInput;
		oInputCtl.show(oTD,oTD.innerText);
	}
	if ( type == 'combo' ) {
		oInputCtl = oCombo;
		var searchURL = oColGroup.children[oTD.cellIndex].searchURL;
		var name = oColGroup.children[oTD.cellIndex].name;
		var boundName = oColGroup.children[oTD.cellIndex].boundName;
		var currentRow = getContainingElmt(oTD,'TR');
		var boundValue = getCellValue(currentRow,boundName);
		oInputCtl.show(oTD,name,oTD.innerText,boundName,boundValue,searchURL);
	}
	if (select != false) {
		oInputCtl.selectText();
	}
}

function cellOut(oTD) {
	var oldValue = oTD.innerText;
	var newValue = oInputCtl.getValue();
	cellWrite();
	// Show the cell
	oTD.style.visibility='inherit';
	// Is there an action for this column
	var cellIdx = oTD.cellIndex;
	if ( newValue!=oldValue && oColGroup.children[cellIdx].action ) {
		var oTR = getContainingElmt(oTD,'TR');
		var actionURL = oColGroup.children[cellIdx].action;
		// async false
		rowAction(oTR,'custom',actionURL,rowActionReturn,false);
	}
	oInputCtl.hide();
	currentCell = undefined;
}

function cellOnMouseUp() {
	var exception;
	var elmt =window.event.srcElement;
	// IE does return a TD at the edge !
	try {
		var oTD = getContainingElmt(elmt,'TD');
	} catch(exception) {
		return false;
	}
	if ( isCellEditable(oTD)) {
		cellChange(oTD);
	}
}

function cellWrite() {
	// Write the contents of the input to the current cell
	// If the value has changed mark the row as dirty
	var oldValue = currentCell.innerText;
	var newValue = oInputCtl.getValue();
	var currentRow = getContainingElmt(currentCell,'TR');
	if ( oldValue != newValue ) {
		setRowState(currentRow,'dirty');
		currentCell.innerText = newValue;
	} 
	if ( oInputCtl.getType() == 'combo') {
		setCellValue(currentRow,oInputCtl.getBoundName(),oInputCtl.getBoundValue());	
	}
}

function cellOnKeyUp(e) {
	var oldValue = currentCell.innerText;
	var newValue = oInputCtl.getValue();
	if ( oldValue != newValue ) {
		var currentRow = getContainingElmt(currentCell,'TR');
		setRowState(currentRow,'dirty');
	} 
}

function cellOnKeyDown(e) {
	var elmt = currentCell;
	out: {
		if (e.keyCode == 37) {
			// Left Arrow
			cellChange(moveLeft(elmt));
			break out;
		}
		if (e.keyCode == 38) {
			// Up Arrow
			cellChange(moveUp(elmt));
			break out;
		}
		if (e.keyCode == 39 ) {
			// Right Arrow
			cellChange(moveRight(elmt));
			break out;
		}
		if (e.keyCode == 40 ) {
			// Down Arrow
			cellChange(moveDown(elmt));
			break out;
		}
		if ( e.keyCode == 9 ) {
			// TAB
			if ( e.shiftKey ) {
				cellChange(moveLeft(elmt));
			} else {
				cellChange(moveRight(elmt));
			}
			if ( currentCell == elmt ) {
				// document tabbing order
				return true;
			}
		}
		if (e.keyCode == 13 ) {
			// Return
			cellChange(moveRight(elmt));
			if ( currentCell == elmt ) {
				// Cell unchanged at bottom right boundery
				save();
			}	
		}
		if ( e.keyCode == 46 ) {
			// Delete key
			del();
		}
		if ( e.keyCode == 83 && e.ctrlKey ) {
			// Ctrl+S
			save();
			break out;
		}
	// End out label
	}
	e.returnValue=false;
	e.cancelBubble = true;
}


function moveRight(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var rowIdx;
	if (markerCell.cellIndex == myRow.cells.length - 1) { // End of the Row
		if (myRow.sectionRowIndex == oTBody.rows.length - 1) {
			// Bottom right
			if ( isCellEditable(markerCell)) {
				return markerCell;
			} else {
				return fromCell;
			}
		} else {
			rowIdx = myRow.sectionRowIndex +1; //Move Down
		}
	} else {
		rowIdx = myRow.sectionRowIndex; //Stay on this Row
	}
	// Use this row length to wrap 
	var cellIdx = Mod(markerCell.cellIndex + 1, myRow.cells.length);
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveRight(fromCell,nextCell);
	}
}
function moveLeft(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var rowIdx;
	if (markerCell.cellIndex == 0) { // Beg of the Row
		if (myRow.sectionRowIndex == 0) {
			// Top Left
			if ( isCellEditable(markerCell)) {
				return markerCell;
			} else {
				return fromCell;
			} 
		} else {
			myRow = oTBody.rows[myRow.sectionRowIndex-1];//Move Up
		}
	} 
	rowIdx = myRow.sectionRowIndex;
	var cellIdx = Mod(markerCell.cellIndex - 1, myRow.cells.length);
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveLeft(fromCell,nextCell);
	}
}

function moveUp(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var cellIdx = markerCell.cellIndex;
	var rowIdx;
	if (myRow.sectionRowIndex == 0) { // Top
		if ( isCellEditable(markerCell)) {
			return markerCell;
		} else {
			return fromCell;
		} 
	} else {
		rowIdx = myRow.sectionRowIndex-1; //Move Up
	}
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveUp(fromCell,nextCell);
	} 
}
function moveDown(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var cellIdx = markerCell.cellIndex;
	var rowIdx;
	if (myRow.sectionRowIndex == oTBody.rows.length-1) { // Bottom
		if ( isCellEditable(markerCell)) {
			return markerCell;
		} else {
			return fromCell;
		} 
	} else {
		rowIdx = myRow.sectionRowIndex+1; //Move Down
	}
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveDown(fromCell,nextCell);
	}
}

function isCellEditable(oTD) {
	var currentRow = getContainingElmt(oTD,"TR");
	if ( currentRow.rowState == 'updating' ) {
		return false;
	} 
	// Is the column visible
	if (oColGroup.children[oTD.cellIndex].className == 'clsHidden') {
		return false;
	}
	// Assume current
	if ( currentRow.rowType == 'add' ) {
		if ( oColGroup.children[oTD.cellIndex].addDisabled == 'true') {
			return false;
		} else {
			return true;
		}
	}
	// Assume update
	if ( oColGroup.children[oTD.cellIndex].updateDisabled == 'true') {
		return false;
	} else {
		return true;
	}
}

function getCellValue(oTR,name) {
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == name ) {
			return oTR.cells[i].innerText;
		}
	}
	throw "No column named " + name;
}
function setCellValue(oTR,name,value) {
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == name ) {
			return oTR.cells[i].innerText=value;
		}
	}
	throw "No column named " + name;
}
//
// ROW
//


function requery(url) {
	if ( url == undefined ) {
		url = oTable.dataURL;
	}
	
	// Delete all rows
	while ( oTBody.rows.length > 0 ) {
		oTBody.deleteRow(0);
	}
	xmlCache = new ActiveXObject("Msxml2.DOMDocument");
	xmlCache.async = false;
	xmlCache.onreadystatechange = function() {
		if (xmlCache.readyState == 4) requeryReturn();
    }
	xmlCache.load(url);
}	

function requeryReturn() {
	// ERROR
	var xmlError = xmlCache.parseError;
	if (xmlError.errorCode != 0) {
		setStatus("Error! " + xmlError.reason);
		return false;
	}
	var rec = xmlCache.selectSingleNode('error');
	if ( rec ) {
		setStatus(rec.text);
		return false;
	}
	var records = xmlCache.selectNodes('records/record');
	for(var i=0;i<pageSize;i++) {
		var oTR = createBlankRow(oTBody.rows.length);
		displayRow(oTR,records[i]);
	}
	
	if ( oTable.enabled == "true" ) {
		init2()
	}
}

function pageUp(top,bot) {
	var records = xmlCache.selectNodes('records/record');
	for(var i=bot;i>=top;i--) {
		var oTR = createBlankRow(0);
		displayRow(oTR,records[i]);
		if ( currentCell && oTBody.rows[oTBody.rows.length-1].contains(currentCell) ) {
			// Move Up
			cellChange(moveUp(currentCell));
		}
		oTBody.deleteRow(oTBody.rows.length-1);
	}
	recOffsetTop = recOffsetTop - (bot-top);
	recOffsetBottom = recOffsetBottom - (bot-top);
	marginTop -= rowHeight*(bot-top);
	marginBottom += rowHeight*(bot-top);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function pageDown(top,bot) {
	var records = xmlCache.selectNodes('records/record');
	for(var i=top;i<=bot;i++) {
		var oTR = createBlankRow(pageSize);
		displayRow(oTR,records[i]);
		if ( currentCell && oTBody.rows[0].contains(currentCell) ) {
			cellOut(currentCell);
		}
		oTBody.deleteRow(0);
	}
	recOffsetTop = recOffsetTop + (bot-top);
	recOffsetBottom = recOffsetBottom + (bot-top);
	marginTop += rowHeight*(bot-top);
	marginBottom -= rowHeight*(bot-top);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function pageNew(top,bot) {
	if (currentCell) {
		cellOut(currentCell);
	}
	// Delete all rows
		while ( oTBody.rows.length > 0 ) {
		oTBody.deleteRow(0);
	}
	var records = xmlCache.selectNodes('records/record');
	for(var i=top;i<=bot;i++) {
		var oTR = createBlankRow(oTBody.rows.length);
		displayRow(oTR,records[i]);
	}
	recOffsetTop = top
	recOffsetBottom = bot;
	marginTop = rowHeight*(recOffsetTop);
	marginBottom = rowHeight*(recSize -1 - recOffsetBottom);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function page(newTop,newBot) {
	var top = new Number();
	var bot = new Number();
	var oldTop = recOffsetTop;
	var oldBot = recOffsetBottom;
	
	if ( newTop < 0 ) { newTop = 0; }
	if ( newBot > recSize-1 ) { newBot = recSize-1; }
	// Page UP
	if ( newTop < oldTop && newBot < oldBot && newBot > oldTop ) {
		pageUp(newTop,oldTop-1);
	}
	// Page Down
	if ( newTop > oldTop && newBot > oldBot && newTop < oldBot ) {
		pageDown(oldBot+1,newBot);
	}
	// PageTo
	if ( newTop >= oldTop && newBot <= oldBot ) {	
		// inside, nothing to do
		return true;
	} else {
		pageNew(newTop,newBot);
	}
}

function pageTo() {
	var oDiv = oTable.parentElement;
	var recTop = Math.floor(oDiv.scrollTop/rowHeight);
	page(recTop-1,recTop-1+pageSize);
}

function createBlankRow(index) {
	var oTR = oTBody.insertRow(index);
	for(var i=0;i<oColGroup.children.length;i++) {
		var oTD = oTR.insertCell();
	}
	oTR.rowType = 'update';
	return oTR;
}

function createNewRow() {
	var oTR = oTBody.insertRow();
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var oTD = oTR.insertCell();
		if ( oCol.defaultValue != undefined ) {
			oTD.innerText = oCol.defaultValue;
		}
	}
	oTR.rowType = 'add';
	return oTR;
}

function rowRemove(oTR) {
	// You must call save before removing this row
	// if this is not a real database delete
	// rowOut may do this anyway.
	if ( oTR.contains(currentCell) ) {
		out: {
			// Try to move away from the current row
			//
			// Move Down
			cellChange(moveDown(currentCell));
			if ( ! oTR.contains(currentCell) ) {	
				break out;
			}
			// Move Up
			cellChange(moveUp(currentCell));
		}
	}
	if ( oTR.contains(currentCell) ) {
		// Failed to move away
		oInputCtl.hide();
		oTBody.deleteRow(oTR.sectionRowIndex);
	} else {
		oTBody.deleteRow(oTR.sectionRowIndex);
		// Input will be in the wrong position
		cellIn(currentCell);
	}
}

function setRowState(oTR,newState) {
	var oldState = oTR.rowState;
	if ( newState == 'dirty' ) {
		if ( oldState =='current' && oTR.rowType == 'add' ) {
			// Append New Row
			createNewRow();
		}
		if ( oldState == 'current') {
			var span ='<span style="color:blue;cursor:hand;text-decoration:underline" onclick="' + oTable.id + '.save()">save</span>';
			setStatus('Editing ... To ' + span + ' type Ctrl+S');
		}
	}
	if ( newState == 'updating' ) {
		oTR.style.backgroundColor = 'yellow';
	}
	if ( newState == 'current' ) {
		setStatus("Saved.");
		oTR.style.backgroundColor = '';
	}
	if ( newState == 'error' ) {
		oTR.style.backgroundColor = 'red';
	}
	oTR.rowState = newState;
}

function rowIn(oTR) {
	if ( oTable.onRowIn != undefined ) {
			oTable.onRowIn(oTR);
	}
	if ( oTR.rowType == undefined ) {
		oTR.rowType = 'update';
	}
	if ( oTR.rowState == undefined ) {
		oTR.rowState = 'current';
	}
	if ( oTR.rowError != undefined ) {
		setStatus(oTR.rowError);
	} 
}

function rowOut(oTR) {
	if ( oTable.onRowOut != undefined ) {
			oTable.onRowOut(oTR);
	} else {
		if ( oTR.rowState == 'dirty' ) {
			save(oTR);
		}
	}
}

function rowUrlEncode(url,oTR) {
	var list = new Array;
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var name = oCol.name;
		var value = oTR.cells[i].innerText;
		url = urlSet(url,name,value);
	}
	return url;
}



function rowAction(oTR,type,actionURL,handler,async) {
	if ( handler == undefined ) {
		handler = rowActionReturn;
	}
	if (async == undefined) {
		async = true;
	}
	
	if ( type=='add' || type=='update' || type=='delete' ) {
		setRowState(oTR,'updating');
	}
	var url = rowUrlEncode(actionURL,oTR);
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = async;
	var action = new Object;
	action.type = type;
	action.xml = xmlDoc;
	action.elmt = oTR;
	xmlDoc.onreadystatechange = function() {
		if (xmlDoc.readyState == 4) handler(action);
    }
	xmlDoc.load(url);
}

function rowActionReturn(action) {
	var type = action.type;
	var oTR = action.elmt;
	var xmlDoc = action.xml;
	
	// XML ERROR
	var xmlError = xmlDoc.parseError;
	if (xmlError.errorCode != 0) {
		var error = "Error! " + xmlError.reason;
		setRowState(oTR,'error');
		setStatus(error);
		alert(error);
		return false;
	}
	// USER ERROR
	var rec = xmlDoc.selectSingleNode('error');
	if ( rec ) {
		var error = rec.text;
		setRowState(oTR,'error');
		setStatus(error);
		return false;
	}
	out: {
		if ( type =='update' || type =='add' ) {
			updateDisplay(oTR,xmlDoc);
			oTR.rowType = 'update'
			oTR.rowError=undefined;
			setRowState(oTR,'current');
			break out;
		}
		if ( type == 'delete' ) {
			// Focus
			rowRemove(oTR);
			setStatus("Deleted.");
			updateDisplay(oTR,xmlDoc);
			break out;
		}
		// Default
		updateDisplay(oTR,xmlDoc);
	// End out
	}
	// Info
	xmlToID(xmlDoc,'records/info',oDivStatus);
	if ( oTable.onRowActionReturn != undefined ) {
		oTable.onRowActionReturn(action);
	}
}

function updateDisplay(oTR,xmlDoc) {
	var oTR;
	var xmlDoc;
	// record
	var rec = xmlDoc.selectSingleNode('records/record')
	if (rec) {
		displayRow(oTR,rec);
	}
	// calculated
	xmlToChildIDs(xmlDoc,'records/calculated',oTable);
	// html
	xmlToChildIDs(xmlDoc,'records/html',oTable.document);
}

function displayRow(oTR,xmlDoc) {
	var oTR;
	var xmlDoc;
	// record
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var name = oCol.name
		var oNode = xmlDoc.selectSingleNode(name);
		if ( oNode ) {
			var value = oNode.text;
			setObjectValue(oTR.cells[i],value);
		}
	}
	if ( currentCell != undefined && oTR.contains(currentCell) ) {
		cellIn(currentCell,true);
	}
}

// Status Message
function setStatus(msg) {
	setObjectValue(oDivStatus,msg);
}

//
// GENERAL
//



// end scope
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
  var container = table.closest('div');
  var combo = this.combo;
  var comboDiv = this.comboDiv;

  var top = cell.position().top + container.scrollTop() ;
  var left =  cell.position().left + container.scrollLeft();
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


/* ==== dbGridFixed.js ==== */

function dbGridFixed(oTable) {
// A database type grid to add update and delete rows.
// Attach to table.
// Normally associated with a header table which can call resize
//
// You can fire an event rowAction by created a property "action" 
// associated with the column. This calls the url contained in the prop action

// Events
// onRowActionReturn passes evnt - fired after return from the server without any error
// onRowOut passes oTR
// onRowIn passes oTR

// vars
var currentCell;

// Input Controls
var oInputCtl;
var oInput;
var oCombo;
var oTextArea;
//
var oColGroup;
var oTable;
var oTBody;
var oDivStatus;
//
var recOffsetTop;
var recOffsetBottom;
var pageSize=30;
var recSize = 1607;
var rowHeight = 20;
var marginTop;
var marginBottom;
var pageLock = false;
var savedScrollTop=0;
var inScroll = false;
var xmlCache;
// Parameters
if ( oTable.initialFocus == undefined ) { oTable.initialFocus = "false" };
if ( oTable.enabled == undefined ) { oTable.enabled = "true" };

//
// Methods
oTable.resize = resize;
oTable.focus = focus;
oTable.save = save;
oTable.requery = requery;
oTable.rowAction = rowAction;
oTable.rowRemove = rowRemove;
oTable.sort = sort;
oTable.find = find;
oTable.getCellValue = getCellValue;
oTable.pageUp=pageUp;
oTable.pageDown=pageDown;
oTable.page = page;
oTable.pageTo = pageTo;
// Init
init();
//
// TABLE //
//
function init() {
	oTBody = oTable.tBodies[0];
	oColGroup =oTable.children[0];
	if ( oColGroup.tagName != 'COLGROUP') {
		throw "This behavior requires a COLGROUP"
	}
	// Status Div
	var divs = getChildElementsWithClassName(document,'DIV','clsDbGridDivStatus');
	for (var i=0;i<divs.length;i++) {
		if (divs[i].forTable == oTable.id) {
			oDivStatus = divs[i];
		}
	}
	if ( oTable.enabled == "true" ) {
		// Init input controls
		inputControlsInit();
		// Bind
		oTBody.attachEvent('onmouseup',cellOnMouseUp);
		window.attachEvent('onbeforeunload',onBeforeUnload);
		//oTable.parentElement.attachEvent('onscroll',onScroll);
		window.setInterval(onScroll,50);
	}
	// static
	if ( oTable.dataURL !=undefined ) {
		requery();
	} else {
		if ( oTable.enabled == "true" ) {
			init2()
		}
	}
}
function onScroll() {
	var oDiv = oTable.parentElement;
	if (oDiv.scrollTop != savedScrollTop) {
		savedScrollTop = oDiv.scrollTop;
		inScroll=true;	
	} else {
		if ( inScroll ) {
			// scrollEnd
			inScroll = false;
			pageTo();
		}
	}
}

function getRecsBottom() {
	var oDiv = oTable.parentElement;
	var bottom = marginTop + oTable.clientHeight - oDiv.scrollTop - oDiv.clientHeight;
	return Math.floor(bottom/rowHeight);
}
function getRecsTop() {
	var oDiv = oTable.parentElement;
	var top = oDiv.scrollTop - marginTop;
	return Math.floor(top/rowHeight);
}
function init2() {
	if ( oTable.addURL !=null ) {
		createNewRow();
	}
	
	out: {
		for (var i=0;i<oTBody.rows.length;i++) {
			for (var j=0;j<oTBody.rows[i].cells.length;j++) {
				var oTD = oTBody.rows[i].cells[j];
				if ( isCellEditable(oTD) ) {
					currentCell = oTD;
					var oTR = getContainingElmt(oTD,'TR');
					rowIn(oTR);
					if ( oTable.initialFocus == "true" ) {
						cellIn(oTD,true);
					} else {
						cellIn(oTD,false);
					}
					break out;
				}
			}
		}
		//Could not find an editable cell
	} // end out
	recOffsetTop=0;
	recOffsetBottom = oTBody.rows.length-1;
	rowHeight = currentCell.offsetHeight;
	var recs = oTBody.rows.length-1;
	marginTop =0;
	marginBottom = rowHeight*(recSize - recs)
	oTable.style.marginBottom = marginBottom;
}

function focus() {
	if (currentCell != undefined) {
		cellIn(currentCell,true);
	}
}

function onBeforeUnload() {
	if (currentCell == undefined) {	
		return false;
	}
	var oTR = getContainingElmt(currentCell,'TR');
	if ( oTR.rowState == 'dirty' ) {
		if (window.confirm('Do you want to save your changes?')) {
			save(oTR,false);
			if (oTR.rowState == 'error' ) {
				event.returnValue = "Your changes could not been saved.\nStay on the current page to correct.";
			}
		}
	}
}

function resize(colIdx,width) {
	oColGroup.children[colIdx].style.width = width;
	if ( currentCell != undefined ) {
		cellIn(currentCell);
	}
}
function sort(colIdx,cmp) {
	tableBubbleSort(oTBody,colIdx,cmp);
	cellIn(currentCell);
}
function find(colName,search) {
	var found = false;
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == colName ) {
			var colIdx = i;
		}
	}
	for(var i=0;i<oTBody.rows.length;i++) {
		var oTD = oTBody.rows[i].cells[colIdx];
		if (oTD.innerText == search ) {
			while ( ! isCellEditable(oTD) ) {
				oTD = moveRight(oTD);
			}
			cellChange(oTD);
			found = true;
			break;
		}
	}
	if ( ! found ) {
		alert("Could not find " + search + ".");
	}
}

function save(oTR,async) {
	var oTR;
	if ( oTR == undefined ) {
		oTR = getContainingElmt(currentCell,'TR');
	}
	if ( oTR.rowType =='add' && oTable.addURL != null) {
		return rowAction(oTR,'add',oTable.addURL,rowActionReturn,async);
	}
	if ( oTR.rowType =='update' && oTable.updateURL != null) {
		return rowAction(oTR,'update',oTable.updateURL,rowActionReturn,async);
	}
}
function del(oTR) {
	var oTR;
	if ( oTR == undefined ) {
		oTR = getContainingElmt(currentCell,'TR');
	}
	if ( oTR.rowType == 'update' && oTable.deleteURL != null ) {
		if ( window.confirm("Delete the current record?") ) {
			// async fasle
			rowAction(oTR,'delete',oTable.deleteURL,rowActionReturn,false);
		}
	}
}
//
// INPUT //
//
function inputControlCallback(e) {
	if (e.type == 'keydown') {
		cellOnKeyDown(e);
	}
	if (e.type == 'keyup') {
		cellOnKeyUp(e);
	}
}

function inputControlsInit() {
	// Container 
	// parentElement should be div.dbContainer
	var oDivContainer = oTable.parentElement;
	oInput = dbGridInput(inputControlCallback)
	oDivContainer.appendChild(oInput);
	
	oCombo = dbGridCombo(inputControlCallback)
	oDivContainer.appendChild(oCombo);
}

//
// CELL
//

function cellChange(newCell) {
	var newRow = getContainingElmt(newCell,'TR');
	if (currentCell == undefined) {
		rowIn(newRow);
		cellIn(newCell,true);
	} else {
		var oldCell = currentCell;
		var oldRow = getContainingElmt(oldCell,'TR');

		// Row Change
		if ( newRow.sectionRowIndex != oldRow.sectionRowIndex ) {
			cellOut(oldCell);
			rowOut(oldRow);
			rowIn(newRow);
			cellIn(newCell,true);
		} else {
			cellOut(oldCell);
			cellIn(newCell,true);
		}
	}
}

function cellIn(oTD,select) {
	currentCell = oTD;
	// Hide the cell
	oTD.style.visibility='hidden';
	// Decide which inputControl to use
	var type = oColGroup.children[oTD.cellIndex].type;
	if (  type == undefined ) {
		type = 'text';
	}
	if ( type == 'text' ) {
		oInputCtl = oInput;
		oInputCtl.show(oTD,oTD.innerText);
	}
	if ( type == 'combo' ) {
		oInputCtl = oCombo;
		var searchURL = oColGroup.children[oTD.cellIndex].searchURL;
		var name = oColGroup.children[oTD.cellIndex].name;
		var boundName = oColGroup.children[oTD.cellIndex].boundName;
		var currentRow = getContainingElmt(oTD,'TR');
		var boundValue = getCellValue(currentRow,boundName);
		oInputCtl.show(oTD,name,oTD.innerText,boundName,boundValue,searchURL);
	}
	if (select != false) {
		oInputCtl.selectText();
	}
}

function cellOut(oTD) {
	var oldValue = oTD.innerText;
	var newValue = oInputCtl.getValue();
	cellWrite();
	// Show the cell
	oTD.style.visibility='inherit';
	// Is there an action for this column
	var cellIdx = oTD.cellIndex;
	if ( newValue!=oldValue && oColGroup.children[cellIdx].action ) {
		var oTR = getContainingElmt(oTD,'TR');
		var actionURL = oColGroup.children[cellIdx].action;
		// async false
		rowAction(oTR,'custom',actionURL,rowActionReturn,false);
	}
	oInputCtl.hide();
	currentCell = undefined;
}

function cellOnMouseUp() {
	var exception;
	var elmt =window.event.srcElement;
	// IE does return a TD at the edge !
	try {
		var oTD = getContainingElmt(elmt,'TD');
	} catch(exception) {
		return false;
	}
	if ( isCellEditable(oTD)) {
		cellChange(oTD);
	}
}

function cellWrite() {
	// Write the contents of the input to the current cell
	// If the value has changed mark the row as dirty
	var oldValue = currentCell.innerText;
	var newValue = oInputCtl.getValue();
	var currentRow = getContainingElmt(currentCell,'TR');
	if ( oldValue != newValue ) {
		setRowState(currentRow,'dirty');
		currentCell.innerText = newValue;
	} 
	if ( oInputCtl.getType() == 'combo') {
		setCellValue(currentRow,oInputCtl.getBoundName(),oInputCtl.getBoundValue());	
	}
}

function cellOnKeyUp(e) {
	var oldValue = currentCell.innerText;
	var newValue = oInputCtl.getValue();
	if ( oldValue != newValue ) {
		var currentRow = getContainingElmt(currentCell,'TR');
		setRowState(currentRow,'dirty');
	} 
}

function cellOnKeyDown(e) {
	var elmt = currentCell;
	out: {
		if (e.keyCode == 37) {
			// Left Arrow
			cellChange(moveLeft(elmt));
			break out;
		}
		if (e.keyCode == 38) {
			// Up Arrow
			cellChange(moveUp(elmt));
			break out;
		}
		if (e.keyCode == 39 ) {
			// Right Arrow
			cellChange(moveRight(elmt));
			break out;
		}
		if (e.keyCode == 40 ) {
			// Down Arrow
			cellChange(moveDown(elmt));
			break out;
		}
		if ( e.keyCode == 9 ) {
			// TAB
			if ( e.shiftKey ) {
				cellChange(moveLeft(elmt));
			} else {
				cellChange(moveRight(elmt));
			}
			if ( currentCell == elmt ) {
				// document tabbing order
				return true;
			}
		}
		if (e.keyCode == 13 ) {
			// Return
			cellChange(moveRight(elmt));
			if ( currentCell == elmt ) {
				// Cell unchanged at bottom right boundery
				save();
			}	
		}
		if ( e.keyCode == 46 ) {
			// Delete key
			del();
		}
		if ( e.keyCode == 83 && e.ctrlKey ) {
			// Ctrl+S
			save();
			break out;
		}
	// End out label
	}
	e.returnValue=false;
	e.cancelBubble = true;
}


function moveRight(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var rowIdx;
	if (markerCell.cellIndex == myRow.cells.length - 1) { // End of the Row
		if (myRow.sectionRowIndex == oTBody.rows.length - 1) {
			// Bottom right
			if ( isCellEditable(markerCell)) {
				return markerCell;
			} else {
				return fromCell;
			}
		} else {
			rowIdx = myRow.sectionRowIndex +1; //Move Down
		}
	} else {
		rowIdx = myRow.sectionRowIndex; //Stay on this Row
	}
	// Use this row length to wrap 
	var cellIdx = Mod(markerCell.cellIndex + 1, myRow.cells.length);
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveRight(fromCell,nextCell);
	}
}
function moveLeft(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var rowIdx;
	if (markerCell.cellIndex == 0) { // Beg of the Row
		if (myRow.sectionRowIndex == 0) {
			// Top Left
			if ( isCellEditable(markerCell)) {
				return markerCell;
			} else {
				return fromCell;
			} 
		} else {
			myRow = oTBody.rows[myRow.sectionRowIndex-1];//Move Up
		}
	} 
	rowIdx = myRow.sectionRowIndex;
	var cellIdx = Mod(markerCell.cellIndex - 1, myRow.cells.length);
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveLeft(fromCell,nextCell);
	}
}

function moveUp(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var cellIdx = markerCell.cellIndex;
	var rowIdx;
	if (myRow.sectionRowIndex == 0) { // Top
		if ( isCellEditable(markerCell)) {
			return markerCell;
		} else {
			return fromCell;
		} 
	} else {
		rowIdx = myRow.sectionRowIndex-1; //Move Up
	}
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveUp(fromCell,nextCell);
	} 
}
function moveDown(fromCell,markerCell) {
	if ( markerCell == undefined ) {
		markerCell = fromCell;
	}
	var myRow = getContainingElmt(markerCell,"TR");
	var cellIdx = markerCell.cellIndex;
	var rowIdx;
	if (myRow.sectionRowIndex == oTBody.rows.length-1) { // Bottom
		if ( isCellEditable(markerCell)) {
			return markerCell;
		} else {
			return fromCell;
		} 
	} else {
		rowIdx = myRow.sectionRowIndex+1; //Move Down
	}
	var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
	if (isCellEditable(nextCell)) {
		return nextCell;
	} else {
		return moveDown(fromCell,nextCell);
	}
}

function isCellEditable(oTD) {
	var currentRow = getContainingElmt(oTD,"TR");
	if ( currentRow.rowState == 'updating' ) {
		return false;
	} 
	// Is the column visible
	if (oColGroup.children[oTD.cellIndex].className == 'clsHidden') {
		return false;
	}
	// Assume current
	if ( currentRow.rowType == 'add' ) {
		if ( oColGroup.children[oTD.cellIndex].addDisabled == 'true') {
			return false;
		} else {
			return true;
		}
	}
	// Assume update
	if ( oColGroup.children[oTD.cellIndex].updateDisabled == 'true') {
		return false;
	} else {
		return true;
	}
}

function getCellValue(oTR,name) {
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == name ) {
			return oTR.cells[i].innerText;
		}
	}
	throw "No column named " + name;
}
function setCellValue(oTR,name,value) {
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == name ) {
			return oTR.cells[i].innerText=value;
		}
	}
	throw "No column named " + name;
}
//
// ROW
//


function requery(url) {
	if ( url == undefined ) {
		url = oTable.dataURL;
	}
	
	// Delete all rows
	while ( oTBody.rows.length > 0 ) {
		oTBody.deleteRow(0);
	}
	xmlCache = new ActiveXObject("Msxml2.DOMDocument");
	xmlCache.async = false;
	xmlCache.onreadystatechange = function() {
		if (xmlCache.readyState == 4) requeryReturn();
    }
	xmlCache.load(url);
}	

function requeryReturn() {
	// ERROR
	var xmlError = xmlCache.parseError;
	if (xmlError.errorCode != 0) {
		setStatus("Error! " + xmlError.reason);
		return false;
	}
	var rec = xmlCache.selectSingleNode('error');
	if ( rec ) {
		setStatus(rec.text);
		return false;
	}
	var records = xmlCache.selectNodes('records/record');
	for(var i=0;i<pageSize;i++) {
		var oTR = createBlankRow(oTBody.rows.length);
		displayRow(oTR,records[i]);
	}
	
	if ( oTable.enabled == "true" ) {
		init2()
	}
}

function pageUp(top,bot) {
	var records = xmlCache.selectNodes('records/record');
	for(var i=bot;i>=top;i--) {
		var oTR = createBlankRow(0);
		displayRow(oTR,records[i]);
		if ( currentCell && oTBody.rows[oTBody.rows.length-1].contains(currentCell) ) {
			// Move Up
			cellChange(moveUp(currentCell));
		}
		oTBody.deleteRow(oTBody.rows.length-1);
	}
	recOffsetTop = recOffsetTop - (bot-top);
	recOffsetBottom = recOffsetBottom - (bot-top);
	marginTop -= rowHeight*(bot-top);
	marginBottom += rowHeight*(bot-top);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function pageDown(top,bot) {
	var records = xmlCache.selectNodes('records/record');
	for(var i=top;i<=bot;i++) {
		var oTR = createBlankRow(pageSize);
		displayRow(oTR,records[i]);
		if ( currentCell && oTBody.rows[0].contains(currentCell) ) {
			cellOut(currentCell);
		}
		oTBody.deleteRow(0);
	}
	recOffsetTop = recOffsetTop + (bot-top);
	recOffsetBottom = recOffsetBottom + (bot-top);
	marginTop += rowHeight*(bot-top);
	marginBottom -= rowHeight*(bot-top);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function pageNew(top,bot) {
	if (currentCell) {
		cellOut(currentCell);
	}
	var records = xmlCache.selectNodes('records/record');
	var j = 0;
	for(var i=top;i<bot;i++) {
		var oTR = oTBody.rows[j];
		displayRow(oTR,records[i]);
		j++;
	}
	recOffsetTop = top
	recOffsetBottom = bot;
	marginTop = rowHeight*(recOffsetTop);
	marginBottom = rowHeight*(recSize -1 - recOffsetBottom);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function page(newTop,newBot) {
	var top = new Number();
	var bot = new Number();
	var oldTop = recOffsetTop;
	var oldBot = recOffsetBottom;
	
	if ( newTop < 0 ) { newTop = 0; }
	if ( newBot > recSize-1 ) { newBot = recSize-1; }
	// Page UP
	if ( newTop < oldTop && newBot < oldBot && newBot > oldTop ) {
		pageUp(newTop,oldTop-1);
	}
	// Page Down
	if ( newTop > oldTop && newBot > oldBot && newTop < oldBot ) {
		pageDown(oldBot+1,newBot);
	}
	// PageTo
	if ( newTop >= oldTop && newBot <= oldBot ) {	
		// inside, nothing to do
		return true;
	} else {
		pageNew(newTop,newBot);
	}
}

function pageTo() {
	var oDiv = oTable.parentElement;
	var recTop = Math.floor(oDiv.scrollTop/rowHeight);
	//page(recTop-1,recTop-1+pageSize);
	pageNew(recTop-1,recTop-1+pageSize);
}

function createBlankRow(index) {
	var oTR = oTBody.insertRow(index);
	for(var i=0;i<oColGroup.children.length;i++) {
		var oTD = oTR.insertCell();
	}
	oTR.rowType = 'update';
	return oTR;
}

function createNewRow() {
	var oTR = oTBody.insertRow();
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var oTD = oTR.insertCell();
		if ( oCol.defaultValue != undefined ) {
			oTD.innerText = oCol.defaultValue;
		}
	}
	oTR.rowType = 'add';
	return oTR;
}

function rowRemove(oTR) {
	// You must call save before removing this row
	// if this is not a real database delete
	// rowOut may do this anyway.
	if ( oTR.contains(currentCell) ) {
		out: {
			// Try to move away from the current row
			//
			// Move Down
			cellChange(moveDown(currentCell));
			if ( ! oTR.contains(currentCell) ) {	
				break out;
			}
			// Move Up
			cellChange(moveUp(currentCell));
		}
	}
	if ( oTR.contains(currentCell) ) {
		// Failed to move away
		oInputCtl.hide();
		oTBody.deleteRow(oTR.sectionRowIndex);
	} else {
		oTBody.deleteRow(oTR.sectionRowIndex);
		// Input will be in the wrong position
		cellIn(currentCell);
	}
}

function setRowState(oTR,newState) {
	var oldState = oTR.rowState;
	if ( newState == 'dirty' ) {
		if ( oldState =='current' && oTR.rowType == 'add' ) {
			// Append New Row
			createNewRow();
		}
		if ( oldState == 'current') {
			var span ='<span style="color:blue;cursor:hand;text-decoration:underline" onclick="' + oTable.id + '.save()">save</span>';
			setStatus('Editing ... To ' + span + ' type Ctrl+S');
		}
	}
	if ( newState == 'updating' ) {
		oTR.style.backgroundColor = 'yellow';
	}
	if ( newState == 'current' ) {
		setStatus("Saved.");
		oTR.style.backgroundColor = '';
	}
	if ( newState == 'error' ) {
		oTR.style.backgroundColor = 'red';
	}
	oTR.rowState = newState;
}

function rowIn(oTR) {
	if ( oTable.onRowIn != undefined ) {
			oTable.onRowIn(oTR);
	}
	if ( oTR.rowType == undefined ) {
		oTR.rowType = 'update';
	}
	if ( oTR.rowState == undefined ) {
		oTR.rowState = 'current';
	}
	if ( oTR.rowError != undefined ) {
		setStatus(oTR.rowError);
	} 
}

function rowOut(oTR) {
	if ( oTable.onRowOut != undefined ) {
			oTable.onRowOut(oTR);
	} else {
		if ( oTR.rowState == 'dirty' ) {
			save(oTR);
		}
	}
}

function rowUrlEncode(url,oTR) {
	var list = new Array;
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var name = oCol.name;
		var value = oTR.cells[i].innerText;
		url = urlSet(url,name,value);
	}
	return url;
}



function rowAction(oTR,type,actionURL,handler,async) {
	if ( handler == undefined ) {
		handler = rowActionReturn;
	}
	if (async == undefined) {
		async = true;
	}
	
	if ( type=='add' || type=='update' || type=='delete' ) {
		setRowState(oTR,'updating');
	}
	var url = rowUrlEncode(actionURL,oTR);
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = async;
	var action = new Object;
	action.type = type;
	action.xml = xmlDoc;
	action.elmt = oTR;
	xmlDoc.onreadystatechange = function() {
		if (xmlDoc.readyState == 4) handler(action);
    }
	xmlDoc.load(url);
}

function rowActionReturn(action) {
	var type = action.type;
	var oTR = action.elmt;
	var xmlDoc = action.xml;
	
	// XML ERROR
	var xmlError = xmlDoc.parseError;
	if (xmlError.errorCode != 0) {
		var error = "Error! " + xmlError.reason;
		setRowState(oTR,'error');
		setStatus(error);
		alert(error);
		return false;
	}
	// USER ERROR
	var rec = xmlDoc.selectSingleNode('error');
	if ( rec ) {
		var error = rec.text;
		setRowState(oTR,'error');
		setStatus(error);
		return false;
	}
	out: {
		if ( type =='update' || type =='add' ) {
			updateDisplay(oTR,xmlDoc);
			oTR.rowType = 'update'
			oTR.rowError=undefined;
			setRowState(oTR,'current');
			break out;
		}
		if ( type == 'delete' ) {
			// Focus
			rowRemove(oTR);
			setStatus("Deleted.");
			updateDisplay(oTR,xmlDoc);
			break out;
		}
		// Default
		updateDisplay(oTR,xmlDoc);
	// End out
	}
	// Info
	xmlToID(xmlDoc,'records/info',oDivStatus);
	if ( oTable.onRowActionReturn != undefined ) {
		oTable.onRowActionReturn(action);
	}
}

function updateDisplay(oTR,xmlDoc) {
	var oTR;
	var xmlDoc;
	// record
	var rec = xmlDoc.selectSingleNode('records/record')
	if (rec) {
		displayRow(oTR,rec);
	}
	// calculated
	xmlToChildIDs(xmlDoc,'records/calculated',oTable);
	// html
	xmlToChildIDs(xmlDoc,'records/html',oTable.document);
}

function displayRow(oTR,xmlDoc) {
	var oTR;
	var xmlDoc;
	// record
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var name = oCol.name
		var oNode = xmlDoc.selectSingleNode(name);
		if ( oNode ) {
			var value = oNode.text;
			setObjectValue(oTR.cells[i],value);
		}
	}
	if ( currentCell != undefined && oTR.contains(currentCell) ) {
		cellIn(currentCell,true);
	}
}

// Status Message
function setStatus(msg) {
	setObjectValue(oDivStatus,msg);
}

//
// GENERAL
//



// end scope
}


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
  var container = table.closest('div');
  var HTMLArea = this.HTMLArea;

  var top = cell.position().top + container.scrollTop() ;
  var left =  cell.position().left + container.scrollLeft();
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
  var container = table.closest('div');
  var input = this.input;

  var top = cell.position().top + container.scrollTop() ;
  var left =  cell.position().left + container.scrollLeft();
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
  var container = table.closest('div');
  var inputBool = this.inputBool;

  var top = cell.position().top + container.scrollTop() ;
  var left =  cell.position().left + container.scrollLeft();
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
  var container = table.closest('div');
  var textArea = this.textArea;

  var top = cell.position().top + container.scrollTop() ;
  var left =  cell.position().left + container.scrollLeft();
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


/* ==== dbList.js ==== */
function dbList(oTable) {

oTable.resize = resize;
oTable.getCellValue = getCellValue;
oTable.update = update;

// To use events create a function and attach it as a property of this table.
// Events onRowIn

// vars
var currentRow;
var oTBody;
var oColGroup;

// init
oTBody = oTable.tBodies[0];
oColGroup = oTable.children[0];
if ( oTable.selectedRowIdx && oTable.selectedRowIdx >= 0 ) {
	rowIn(oTBody.rows[oTable.selectedRowIdx])
}

function resize(colIdx,width) {
	var oCol = oColGroup.children[colIdx];
	oCol.runtimeStyle.width = width;
}

function rowIn(oTR) {
	if ( oTR.rowState == undefined ) {
		oTR.rowState = 'unselected';
	}
	currentRow = oTR;
	if ( oTable.onRowIn != undefined ) {	
			oTable.onRowIn(oTR);
	}
	setRowState(oTR,'selected');
}

function setRowState(oTR,newState) {
	var oldState = oTR.rowState;
	out: {
		if ( newState == 'updating' ) {
			break out;
		}
		if ( newState == 'selected' ) {
			oTR.runtimeStyle.background = 'highlight';
			oTR.runtimeStyle.color = 'highlighttext';
			break out;
		}
		if ( newState == 'unselected' ) {
			oTR.runtimeStyle.background = '';
			oTR.runtimeStyle.color = '';
			break out;
		}
		if ( newState == 'error' ) {
			oTR.runtimeStyle.background = 'red';
			break out;
		}
	}
	oTR.rowState = newState;
}

function update(actionURL) {
	setRowState(currentRow,'updating');
	var url = rowUrlEncode(actionURL,currentRow);
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = false;
	var action = new Object;
	xmlDoc.onreadystatechange = function() {
		if (xmlDoc.readyState == 4) updateReturn(xmlDoc);
    }
	xmlDoc.load(url);
}

function updateReturn(xmlDoc) {
	// ERROR
	var xmlError = xmlDoc.parseError;
	if (xmlError.errorCode != 0) {
		var error = "Error! " + xmlError.reason;
		setRowState(currentRow,'error');
		alert(error);
		return false;
	}
	var rec = xmlDoc.selectSingleNode('error');
	if ( rec ) {
		var error = rec.text;
		setRowState(currentRow,'error');
		alert(error);
		return false;
	}
	updateDisplay(currentRow,xmlDoc);
	setRowState(currentRow,'selected');
}
function updateDisplay(oTR,xmlDoc) {
	var oTR;
	var xmlDoc;
	// record
	var rec = xmlDoc.selectSingleNode('records/record')
	if (rec) {
		displayRow(oTR,rec);
	}
	// calculated
	xmlToChildIDs(xmlDoc,'records/calculated',oTable);
	// html
	xmlToChildIDs(xmlDoc,'records/html',oTable.document);
}

function displayRow(oTR,xmlDoc) {
	var oTR;
	var xmlDoc;
	// record
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var name = oCol.name
		var oNode = xmlDoc.selectSingleNode(name);
		if ( oNode ) {
			var value = oNode.text;
			setObjectValue(oTR.cells[i],value);
		}
	}
}
function rowUrlEncode(url,oTR) {
	var list = new Array;
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		var name = oCol.name;
		var value = oTR.cells[i].innerText;
		url = urlSet(url,name,value);
	}
	return url;
}

function getCellValue(oTR,name) {
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		if ( oCol.name == name ) {
			return oTR.cells[i].innerText;
		}
	}
	throw "No column named " + name;
}

//
}

/* ==== dbScrollBar.js ==== */
function dbScrollBar(oScrollBar,callback) {

var oTracker = oScrollBar.firstChild;
var inDrag = false;
var savedTop;
var savedX;
var savedY;
var max;

// Methods
oScrollBar.setTrackerHeight=setTrackerHeight;
oScrollBar.setTrackerPos = setTrackerPos;

// Attach
oTracker.attachEvent('onmousemove',onMouseMove);
oTracker.attachEvent('onmousedown',onMouseDown);
oTracker.attachEvent('onmouseup',onMouseUp);

function setTrackerHeight(perct) {
	if ( perct < 0 ) { perct = 0 }
	if ( perct > 1 ) { perct = 1 }
	var height = Math.round(perct*oScrollBar.clientHeight);
	if ( height < 5 ) { height = 5 }
	if ( height == oScrollBar.clientHeight ) { 
		oTracker.style.display = 'none';
	} else {
		oTracker.style.display = 'block';
	}
	oTracker.style.height = height;
}

function setTrackerPos(pos) {
	// pos is between 0 and 1
	if ( pos > 1 ) { pos = 1 }
	if ( pos < 0 ) { pos = 0 }
	oTracker.style.marginTop = Math.round(pos*(oScrollBar.clientHeight - oTracker.offsetHeight));
}

function onMouseMove() {
	if ( inDrag && window.event.button == 1) {
		// Drag
		var deltaY = window.event.screenY - savedY;
		var top = savedTop + deltaY;
		// Move
		if ( top < 0 ) { top = 0; }
		if ( top > max ) { top=max; }
		oTracker.style.marginTop = top;
	}
}

function onMouseDown() {
	if ( window.event.button == 1) {
		oTracker.setCapture();
		savedX = window.event.screenX;
		savedY = window.event.screenY;
		savedTop = oTracker.offsetTop;
		inDrag = true;
		max = oScrollBar.clientHeight - oTracker.offsetHeight;
	} 
}
function onMouseUp () {
	inDrag=false;
	oTracker.releaseCapture();
	callback(oTracker.offsetTop/max);
}
// end 
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


/* ==== jquery.borderCollapse.js ==== */
(function($){
    $.fn.borderCollapse = function(){
	var tables = $(this).filter('table').filter(function(){return $(this).css('border-collapse') == "collapse";});
	tables.each(function(i, element) {
	    var table = $(element);
	    table.css({
		'border-collapse': "separate",
		'border-spacing': 0
	    });
	    var rows = $(table).find('tr:visible');
	    if ( parseInt(table.css('border-top-width')) > 0 ) {
		rows.eq(0).find('th, td').filter(':visible').css('border-top-width', 0);
	    }
	    if ( parseInt(table.css('border-left-width')) > 0 ) {
		rows.each(function(j, element) {
		    var row = $(element);
		    row.find('th, td').filter(':visible').eq(0).css('border-left-width', 0);
		});
	    }
	    if ( parseInt(table.css('border-right-width')) > 0 ) {
		rows.each(function(j, element) {
		    var row = $(element);
		    row.find('th, td').filter(':visible').eq(-1).css('border-right-width', 0);
		});
	    }
	    if ( parseInt(table.css('border-bottom-width')) > 0 ) {
		rows.eq(-1).find('th, td').filter(':visible').css('border-bottom-width', 0);
	    }
	    rows.each(function(i, element){
		var row = $(element);
		var cells = row.find('td, th').filter(':visible');
		cells.not(cells.eq(0)).css('border-left-width', 0);
	    });
	    rows.not(rows.eq(0)).find('th, td').css('border-top-width', 0);
	});
	
    }
})(jQuery);

$(function(){
    $('table:not(:has(tfoot))').css('border-bottom-width', 0);
});

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

/* ==== jquery.dbEditorHTML.js ==== */
// dbEditorHTML plugin
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

    $.widget('qcode.dbEditorHTML', {
	_create: function() {
	    this._on(window, {
		'resize': this._onResize.bind(this)
	    });
	    this.editor = $('<div>')
		.attr('contentEditable', true)
		.addClass('dbEditorHTML')
		.appendTo(this.element)
		.css({
		    'position': "absolute"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown.bind(this),
		'keyup': this._inputOnKeyUp.bind(this),
		'cut': this._inputOnCut.bind(this),
		'paste': this._inputOnPaste.bind(this),
		'blur': this._inputOnBlur.bind(this)
	    });
	},
	getValue: function() {
	    return this.editor.html();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = element;
	    var editor = this.editor;

	    // Copy various style from the target element to the editor
	    $.each(copyAttributes, function(i, name){
		editor.css(name, element.css(name));
	    });
	    if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', element.css('backgroundColor'));
	    }

	    // Different browsers return different css for transparent elements
	    editor
		.height((typeof element.data('editorHeight') == "undefined") ? element.height() : element.data('editorHeight'))
		.css({
		    'top': element.position().top + element.offsetParent().scrollTop(), 
		    'left': element.position().left + element.offsetParent().scrollLeft()
		})
		.show()
		.html(value)
		.focus();
	}, 
	hide: function() {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	}, 
	selectText: function(option) {
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
	    this.editor.remove();
	},
	_onResize: function(event) {
	    // Any event that might change the size or position of the editor's target needs to trigger this.
	    // It is bound to the window resize event, so triggering a resize event on any element should propagate up and trigger this
	    if ( this.currentElement ) {
		var element = this.currentElement;
		var editor = this.editor;
		editor
		    .height((typeof element.data('editorHeight') == "undefined") ? element.height() : element.data('editorHeight'))
		    .css({
			'width': element.css('width'), 
			'top': element.position().top + element.offsetParent().scrollTop(), 
			'left': element.position().left + element.offsetParent().scrollLeft()
		    });
	    }
	},
	_inputOnKeyDown: function(e) {
	    switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	    case 37: // left
	    case 39: //right
		var selection = this.editor.textrange('get');
		if ( e.which == 37 && ! ( selection.selectionText === "" && selection.selectionAtStart ) ) break;
		if ( e.which == 39 && ! ( selection.selectionText === "" && selection.selectionAtEnd ) ) break;
	    case 83: //S
		if ( e.which == 83 && ! e.ctrlKey ) break;
	    case 9: //tab
	    case 38: //up
	    case 40: //down
		var event = jQuery.Event(e.type, {
		    'data': e.data, 
		    'ctrlKey': e.ctrlKey, 
		    'altKey': e.altKey, 
		    'shiftKey': e.shiftKey, 
		    'which': e.which
		});
		e.preventDefault();
		this.currentElement.trigger(event);
	    }
	},
	_inputOnKeyUp: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
            var event = jQuery.Event(e.type, {
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
		var event = jQuery.Event(e.type, {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorInput.js ==== */
// dbEditorInput plugin
// A hovering editor for single-line input
;(function($, window, undefined) {

    // css attributes to copy from target elements to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height'];

    $.widget('qcode.dbEditorInput', {
	_create: function() {
	    this._on(window, {
		'resize': this._onResize.bind(this)
	    });
	    this.editor = $('<input type="text">')
		.addClass('dbEditorInput')
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
		'keydown': this._inputOnKeyDown.bind(this),
		'keyup': this._inputOnKeyUp.bind(this),
		'cut': this._inputOnCut.bind(this),
		'paste': this._inputOnPaste.bind(this),
		'blur': this._inputOnBlur.bind(this)
	    });
	},
	getValue: function() {
	    return this.editor.val();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = element;
	    var editor = this.editor;

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

	    // Assumes that the editor's container is the target element's offset parent.
	    editor
		.css({
		    'top': element.position().top + element.offsetParent().scrollTop(), 
		    'left': element.position().left + element.offsetParent().scrollLeft()
		})
		.show()
		.val(value)
		.focus();
	}, 
	hide: function() {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	}, 
	selectText: function(option) {
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
	    this.editor.remove();
	},
	_onResize: function(event) {
	    // Any event that might change the size or position of the editor's target needs to trigger this.
	    // It is bound to the window resize event, so triggering a resize event on any element should propagate up and trigger this
	    if ( this.currentElement ) {
		var element = this.currentElement;
		var editor = this.editor;
		$.each(['width', 'height'], function(i, name){
		    editor.css(name, element.css(name));
		});
		editor.css({
		    'top': element.position().top + element.offsetParent().scrollTop(), 
		    'left': element.position().left + element.offsetParent().scrollLeft()
		});
	    }
	},
	_inputOnKeyDown: function(e) {
	    switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	    case 37: // left
	    case 39: //right
		var selection = this.editor.textrange('get');
		if ( e.which == 37 && ! ( selection.selectionText === "" && selection.selectionAtStart ) ) break;
		if ( e.which == 39 && ! ( selection.selectionText === "" && selection.selectionAtEnd ) ) break;
	    case 83: //S
		if ( e.which == 83 && ! e.ctrlKey ) break;
	    case 13: //return
	    case 9: //tab
	    case 38: //up
	    case 40: //down
		var event = jQuery.Event(e.type, {
		    'data': e.data, 
		    'ctrlKey': e.ctrlKey, 
		    'altKey': e.altKey, 
		    'shiftKey': e.shiftKey, 
		    'which': e.which
		});
		e.preventDefault();
		this.currentElement.trigger(event);
		break;
	    }
	},
	_inputOnKeyUp: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
            var event = jQuery.Event(e.type, {
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
		var event = jQuery.Event(e.type, {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorText.js ==== */
// dbEditorText plugin
// A hovering editor for multi-line input (text)
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

    $.widget( 'qcode.dbEditorText', {
	_create: function() {
	    this._on(window, {
		'resize': this._onResize.bind(this)
	    });
	    this.editor = $('<textarea>')
		.appendTo(this.element)
		.addClass('dbEditorText')
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
		'keydown': inputOnKeyDown.bind(this),
		'keyup': inputOnKeyUp.bind(this),
		'cut': inputOnCut.bind(this),
		'paste': inputOnPaste.bind(this),
		'blur': inputOnBlur.bind(this)
	    });
	},
	getValue: function() {
	    return this.editor.val();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = element;
	    var editor = this.editor;

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

	    // Assumes that the editor's container is the target element's offset parent.
	    // (Note: I haven't yet figured out why the +1 height is needed to stop scrollbars from appearing)
	    editor
		.css({
		    'top': element.position().top + element.offsetParent().scrollTop(), 
		    'left': element.position().left + element.offsetParent().scrollLeft(), 
		    'height': "+=1", 
		    'padding-bottom': "-=1"
		})
		.show()
		.val(value)
		.focus();
	}, 
	hide: function() {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	}, 
	selectText: function(option) {
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
	    this.editor.remove();
	},
	_onResize: function(event) {
	    // Any event that might change the size or position of the editor's target needs to trigger this.
	    // It is bound to the window resize event, so triggering a resize event on any element should propagate up and trigger this
	    if ( this.currentElement ) {
		var element = this.currentElement;
		var editor = this.editor;
		$.each(['width', 'height'], function(i, name){
		    editor.css(name, element.css(name));
		});

		// (Note: I haven't yet figured out why the +1 height is needed to stop scrollbars from appearing)
		editor.css({
		    'top': element.position().top + element.offsetParent().scrollTop(), 
		    'left': element.position().left + element.offsetParent().scrollLeft(), 
		    'height': "+=1"
		});
	    }
	},
	_inputOnKeyDown: function(e) {
	    switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	    case 37: // left
	    case 39: //right
		var selection = this.editor.textrange('get');
		if ( e.which == 37 && ! ( selection.selectionText === "" && selection.selectionAtStart ) ) break;
		if ( e.which == 39 && ! ( selection.selectionText === "" && selection.selectionAtEnd ) ) break;
	    case 83: //S
		if ( e.which == 83 && ! e.ctrlKey ) break;
	    case 9: //tab
	    case 38: //up
	    case 40: //down
		var event = jQuery.Event(e.type, {
		    'data': e.data, 
		    'ctrlKey': e.ctrlKey, 
		    'altKey': e.altKey, 
		    'shiftKey': e.shiftKey, 
		    'which': e.which
		});
		e.preventDefault();
		this.currentElement.trigger(event);
	    }
	},
	_inputOnKeyUp: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
            var event = jQuery.Event(e.type, {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e) {
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event(e.type, {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbForm.js ==== */
(function($){
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
	    httpPost(url, formEncode.call(this, this.form), handler, errorHandler, async);
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
	$('records record *', xmlDoc).each(function(i, xmlNode){
	    dbForm.form.find('#' + $(xmlNode).prop('nodeName') + ', [name="' + $(xmlNode).prop('nodeName') + '"]').each(function(j, target){
		if ( $(target).is('input, textarea, select') ) {
		    $(target).val($(xmlNode).text());
		} else {
		    $(target).html($(xmlNode).text());
		}
	    });
	});
	$('records html *', xmlDoc).each(function(i, xmlNode){
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
	var rec = $(xmlDoc).find('records info').first();
	if ( rec.length == 1 ) {
	    this.setStatus(rec.text());
	}
	// Alert
	var rec = $(xmlDoc).find('records alert').first();
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

    function formEncode(form) {
	var list = new Array;
	this.elements
	    .filter(function(){ return $(this).prop('name') != ""; })
	    .filter(function(){ return $(this).prop('type') != "checkbox" || $(this).attr('boolean') == "true" || $(this).is(':checked'); })
	    .filter(function(){ return $(this).prop('type') != "radio" || $(this).is(':checked'); })
	    .filter(function(){ return ! $(this).is('div.clsRadioGroup'); })
	    .each(function(){
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
		list.push(encodeURIComponent($(this).attr('name')) + "=" + encodeURIComponent(value));
	    });
	return list.join("&");
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
(function($){
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
	    this.currentItem = "undefined";
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
(function($){
  // DbGrid Class Constructor
  var DbGrid = function(table) {
    // Private Class Variables
    var recCount;
    var keyUpTimer;
    var tbody = jQuery([]);
    var colgroup = jQuery([]);
    var statusTable = jQuery([]);
    var currentCell = jQuery([]);
    // Input Controls
      var dbGridInput;
    var dbGridInputCtl;
    var dbGridCombo;
    var dbGridTextArea;
    var dbGridHTMLArea;
    var oFCKeditor;
    var dbGridInputBool;
   
    // Parameters
    if ( ! table.attr('initialFocus') ) { table.attr('initialFocus','true'); }
    if ( ! table.attr('enabled') ) { table.attr('enabled','true'); }
    if ( ! table.attr('updateType') ) { table.attr('updateType','rowOut'); }

    // Functions 
    function init() {
      tbody = table.children('tbody');
      colgroup = table.children('colgroup');
      if ( ! colgroup.size() ) {
        throw "This behavior requires a COLGROUP"
      }
    
      // The status table should be contained in a div element that is a sibling of the parent of this table
      if ( table.hasClass('clsDbGrid') ) {
	statusTable = table.closest('.clsDbGridDiv').next('.clsDbGridDivStatus').children('table');
      } else {
	statusTable = jQuery([]);
      }      
      recCount = tbody.children().size();
      if ( table.attr('enabled') == "true" ) {
	// Init input controls
	inputControlsInit();
	// Bind
	tbody.on('mouseup.dbGrid',cellOnMouseUp);
	jQuery(window).on('resize.dbGrid',onResize);
	window.onbeforeunload = onBeforeUnload;
	window.onbeforeprint = onBeforePrint;
     
	init2();
      }
    };
    // make init public
    this.init = init;

    function init2() {
      if ( table.attr('addURL') ) {
        createNewRow();
      }

      out: {
        if ( table.attr('initialFocus') == "end" ) {
  	  // Focus on first editable cell in last row
	  var lastRow = tbody.children('tr:last');
	  var cells = lastRow.children('td');
	  for (var i=0;i<cells.size();i++) {
 	    cell = cells.eq(i);
	   
	    if ( isCellEditable(cell) && isTabStop(cell) ) { 
	      currentCell = cell;
	      cellIn(cell);
	      rowIn(lastRow);

	      break out;
	    }
	  }
  	  // Could not find an editable cell in last row
        }

        // Focus on first editableCell
        if ( table.attr('initialFocus') == "true" ) {
  	  var rows = tbody.children('tr');
	  for (var i=0;i<rows.size();i++) {
	    var row = rows.eq(i);					   
	    var cells = row.children('td');			   
	    
	    for (var j=0;j<cells.size();j++) {
	      var cell = cells.eq(j);

	      if ( isCellEditable(cell) && isTabStop(cell) ) {
	        currentCell = cell;
		cellIn(cell);
		rowIn(row);

		break out;
	      }
	    }
	  }
        }
        // Could not find an editable cell
      } // end out
    };
    
    function focus() {
      if ( currentCell.size() ) {
        cellIn(currentCell);
      }
    };
    // make focus public
    this.focus = focus;
    
    function blur() {
      if ( currentCell.size() ) {
	cellOut(currentCell);
      }
    };
    // make blur public
    this.blur = blur;
    
    function setDirty() {
      if ( currentCell.size() ) {
        var currentRow = currentCell.closest('tr');
        setRowState(currentRow,'dirty');
      }
    };
    // make setDirty public
    this.setDirty = setDirty;

    // TODO: check this working in Chrome
    function onBeforeUnload() {
      if ( !currentCell.size() ) {	
	return;
      }
      
      var currentRow = currentCell.closest('tr');
       if (currentRow.attr('rowState') == 'dirty' || currentRow.attr('rowState') == 'error' ) {
	    return "Your changes have not been saved.\nStay on the current page to correct.";
      }      
    };

    function onBeforePrint() {
      if ( currentCell.size() ) {
	cellOut(currentCell);
      }	
    };

    function onResize() {
      if ( currentCell.size() ) {
	cellChange(currentCell);
      }
    };

    function resize(colIdx,width) {
      // 0-based colIdx
      colgroup.children('col').eq(colIdx).width(width);
      onResize();
    };
    // make resize public
    this.resize = resize;

    function find(colName,search) {
      var found = false;
      var colIdx = colgroup.children('col[name=' + colName + ']').index()      
      if ( colIdx != -1 ) {
        // found matching col element
	var colCells = tbody.children('tr').children('td:nth-child(' + (colIdx + 1) + ')');
	
        colCells.each(function() {
          cell = jQuery(this);
	  if ( cell.text() == search ) {
	    // found matching cell
	    if ( ! isCellEditable(cell) ) {
	      // move to next editable cell with the same row
	      cell = moveRight(cell, false);
	    }
	    if ( ! isCellEditable(cell) ) {
	      // move to previous editable cell with the same row
	      cell = moveLeft(cell, false);
	    }
	    if ( isCellEditable(cell) ) {
	      cellChange(cell);
	      found = true;
	    }
	    return false; // break out of jQuery.each loop
	    
	  }
	});
      }
      if ( ! found ) {
	alert("Could not find " + search + ".");
      }
    };
    // make find public
    this.find = find;

    function save(row,async) {
      if ( row == undefined || ! row.size() ) {
	var row = currentCell.closest('tr');
      }
      if ( row.attr('rowType') == 'add' && table.attr('addURL') ) {
	return rowAction(row,'add',table.attr('addURL'),rowActionReturn,async);
      }
      if ( row.attr('rowType') == 'update' && table.attr('updateURL') ) {
	return rowAction(row,'update',table.attr('updateURL'),rowActionReturn,async);
      }
    };
    // make save public
    this.save = save;

    function del(row) {
      if ( row == undefined || ! row.size() ) {
	row = currentCell.closest('tr');
      }
      if ( row.attr('rowType') == 'update' && table.attr('deleteURL') ) {
	if ( window.confirm("Delete the current record?") ) {
	  // async false
	  rowAction(row,'delete',table.attr('deleteURL'),rowActionReturn,false);
	}
      }
      if ( row.attr('rowType') == 'add' ) {
	if ( window.confirm("Delete the current row?") ) {
	  rowRemove(row);
	}
      }
    };
    // make del public
    this.del = del;

    //
    // INPUT //
    //
    function inputControlCallback(e) {
      if (e.type == 'keydown') {
	cellOnKeyDown(e);
      }
      if (e.type == 'keyup') {
	cellOnKeyUp(e);
      }
      if (e.type =='cut') {
	cellOnCut(e);
      }
      if (e.type =='paste') {
	cellOnPaste(e);
      }
      if (e.type =='blur') {
	var activeElmt = jQuery(document.activeElement);
	if (!table.is(activeElmt) && !table.find(activeElmt).size() && (dbGridInputCtl && !activeElmt.is(dbGridInputCtl.getElmt())) && currentCell.size()) {
	  var currentRow = currentCell.closest('tr');
	  if ( table.attr('updateType')=="onCellOut" && currentRow.attr('rowState') == 'dirty') {
	    save(currentRow);
	  }
	}
      }
    };
   
    function inputControlsInit() {
      var wantCombo= false;
      var wantTextArea = false;
      var wantHTMLArea = false;
      var wantFCKeditor = false;
      var wantBool = false;

      colgroup.children('col').each(function() {
	var colType = jQuery(this).attr('type');
	
	if ( colType == 'combo' ) {
	  wantCombo = true;
	}
	if ( colType == 'textarea' ) {
	  wantTextArea = true;
	}
	if ( colType == 'htmlarea' ) {
	  wantHTMLArea = true;
	}
	if ( colType == 'FCKeditor' ) {
	  wantFCKeditor = true;
	}
	if ( colType == 'bool' ) {
	  wantBool = true;
	}	
      });

	var divContainer = $('<div>').insertBefore(table).css('position', "relative");

      dbGridInput = new DbGridInput(inputControlCallback, divContainer)
      
      if ( wantCombo ) {
	dbGridCombo = new DbGridCombo(inputControlCallback, divContainer);
      }
      if ( wantTextArea ) {
	dbGridTextArea = new DbGridTextArea(inputControlCallback, divContainer);
      }
      if ( wantHTMLArea ) {
	dbGridHTMLArea = new DbGridHTMLArea(inputControlCallback, divContainer);
      }
      if ( wantFCKeditor ) {
	// TODO: FCKEditor
	//oFCKeditor = dbGridFCKeditor(inputControlCallback,oDivContainer);
      }
      if ( wantBool ) {
	dbGridInputBool = new DbGridInputBool(inputControlCallback, divContainer);
      }
    };
    
    //
    // CELL
    //

    function cellChange(newCell) {
      var newRow = newCell.closest('tr');
      if ( ! currentCell.size() ) {
	// No cell currently selected
	rowIn(newRow);
	cellIn(newCell);
      } else {
	var oldCell = currentCell;
	var oldRow = oldCell.closest('tr');
	
	if ( newRow.index() != oldRow.index() ) {
	  // Row Change
	  cellOut(oldCell);
	  rowOut(oldRow);
	  rowIn(newRow);
	  cellIn(newCell);
	} else {
	  // Same Row 
	  cellOut(oldCell);
	  cellIn(newCell);
	}
      }
    };

      function cellIn(cell,select) {
	  currentCell = cell;
	  // Hide the cell
	  cell.css('visibility','hidden');
	  // Decide which inputControl to use
	  var col = colgroup.children('col').eq(cell.index());
	  var colType = col.attr('type');
	  var row = cell.closest('tr');
	  var cellValue = getCellValue(row, col.attr('name'));
	  if (  ! colType ) {
	      colType = 'text';
	  }
	  if ( colType == 'text' ) {
	      dbGridInputCtl = dbGridInput;
	      dbGridInputCtl.show(cell,cellValue);
	  }
	  if ( colType == 'textarea' ) {
	      if ( col.attr('editorHeight') !== undefined ) {
		  var editorHeight = parseInt(col.attr('editorHeight'));
	      }
	      dbGridInputCtl = dbGridTextArea;
	      dbGridInputCtl.show(cell,cellValue,editorHeight);
	  }
	  if ( colType == 'htmlarea') {
	      if ( col.attr('editorHeight') !== undefined ) {
		  var editorHeight = parseInt(col.attr('editorHeight'));
	      }
	      dbGridInputCtl = dbGridHTMLArea;
	      dbGridInputCtl.show(cell,cellValue,editorHeight);
	  }
	  if ( colType == 'FCKeditor' ) {
	      // TODO: Implement FCKeditor
	      //var editorHeight = parseInt(col.attr('editorHeight'));
	      //oInputCtl = oFCKeditor;
	      //oInputCtl.show(cell[0],cellValue,editorHeight);
	  }
	  if ( colType == 'combo' ) {
	      dbGridInputCtl = dbGridCombo;
	      var searchURL = col.attr('searchURL');
	      var name = col.attr('name');
	      var boundName = col.attr('boundName');
	      var boundValue = getCellValue(row,boundName);
	      dbGridInputCtl.show(cell,name,cellValue,boundName,boundValue,searchURL);
	  }
	  if ( colType == 'bool') {
	      dbGridInputCtl = dbGridInputBool;
	      dbGridInputCtl.show(cell,cellValue);
	  }

	  if (select) {
	      dbGridInputCtl.selectText(select);
	  } else {
	      if ( col.attr('cellInSelect') ) {
		  dbGridInputCtl.selectText(col.attr('cellInSelect'));
	      } else {
		  dbGridInputCtl.selectText('all');
	      }
	  }
      };
    
    function cellOut(cell) {
      // Custom Event: Trigger any cellOut events bound to this table
      cell.trigger('cellOut.dbGrid');
 
      var row = cell.closest('tr');
      colIdx = cell.index();
      var col = colgroup.children('col').eq(colIdx);
      var oldValue = getCellValue(row,col.attr('name'));
      var newValue = dbGridInputCtl.getValue();
      
      if ( oldValue != newValue ) {	
	// Work around for combo
	setRowState(row,'dirty');
      }
      cellWrite();
      // Show the cell
      cell.css('visibility','inherit');
      // Hide the input control
      dbGridInputCtl.hide();
      // Cleanup
      currentCell = jQuery([]);
      dbGridInputCtl = undefined;
      // Is there an action for this column
      if ( row.attr('rowState')=='dirty' && col.attr('action') ) {
	var actionURL = col.attr('action');
	// async false
	rowAction(row,'custom',actionURL,rowActionReturn,false);
      }
      // If updateType is onKeyUp then 
      // cancel any delayed save and save now 
      if ( table.attr('updateType')=="onKeyUp" ) {
	cancelDelayedSave();
	if (row.attr('rowState') == 'dirty') {
	  save(row);
	}
      }
      if ( table.attr('updateType')=="onCellOut" && row.attr('rowState') == 'dirty') {
	save(row);
      } 
    }

    function cellOnMouseUp(event) {
      var target = jQuery(event.target);
      if ( !target.is('td') && target.closest('td', table).size() ) {
	target = target.closest('td');
      }
      if ( target.is('td') && isCellEditable(target) ) {
	cellChange(target);
      } else {
	return false;
      }
    };

    function cellWrite() {
      // Write the contents of the input to the current cell
      var currentRow = currentCell.closest('tr');
      var colName = colgroup.children('col').eq(currentCell.index()).attr('name');
      setCellValue(currentRow,colName,dbGridInputCtl.getValue());
      if ( dbGridInputCtl.getType() == 'combo') {
	setCellValue(currentRow,dbGridInputCtl.getBoundName(),dbGridInputCtl.getBoundValue());	
      }
    };

    function cellOnKeyUp(event) {
      // Custom Event: Trigger any keyUp events bound to this table
      table.trigger('keyUp.dbGrid', [currentCell]);
      
      var currentRow = currentCell.closest('tr');
      var colName = colgroup.children('col').eq(currentCell.index()).attr('name');
      var oldValue = getCellValue(currentRow,colName);
      var newValue = dbGridInputCtl.getValue();
      if ( oldValue != newValue ) {  
	setRowState(currentRow,'dirty');
      } 
      if (table.attr('updateType')=="onKeyUp") {
	cancelDelayedSave();
	keyUpTimer = setTimeout(delayedSave,750);
      }
    };

    function delayedSave() {
      if ( currentCell.size() ) {
	var currentRow = currentCell.closest('tr');
	if ( currentRow.attr('rowState') == 'dirty' ) {
	  save(currentRow);
	}
      }
    };

    function cancelDelayedSave() {
      if ( keyUpTimer != undefined ) {
	clearTimeout(keyUpTimer);
      }
      keyUpTimer=undefined;
    };

    function cellOnCut(event) {
      var currentRow = currentCell.closest('tr');
      setRowState(currentRow,'dirty');
    };

    function cellOnPaste(event) {
      var currentRow = currentCell.closest('tr');
      setRowState(currentRow,'dirty');
    };

    function cellOnKeyDown(e) {
      if (e.altKey) {
	return true;
      }
      var cell = currentCell;
      out: {
	if (e.which == 37) {
	  // Left Arrow
	  cellChange(moveLeft(cell));
	  break out;
	}
	if (e.which == 38) {
	  // Up Arrow
	  cellChange(moveUp(cell));
	  break out;
	}
	if (e.which == 39 ) {
	  // Right Arrow
	  cellChange(moveRight(cell));
	  break out;
	}
	if (e.which == 40 ) {
	  // Down Arrow
	  cellChange(moveDown(cell));
	  break out;
	}
	if ( e.which == 9 ) {
	  // TAB
	  if ( e.shiftKey ) {
	    cellChange(moveLeft(cell));
	  } else {
	    cellChange(moveRight(cell));
	  }
	  if ( currentCell.is(cell) ) {
	    // document tabbing order
	    return true;
	  }
	}
	if (e.which == 13 ) {
	  // Return
	  cellChange(moveRight(cell));
	  if ( currentCell.is(cell) ) {
	    // Cell unchanged at bottom right boundary
	    save();
	  }	
	}
	if ( e.which == 46 ) {
	  // Delete key
	  del();
	}
	if ( e.which == 83 && e.ctrlKey ) {
	  // Ctrl+S
	  save();
	  break out;
	}
	// End out label
      }
      e.preventDefault();
      e.stopPropagation();
    };

    function moveRight(fromCell, searchNextRows) {
	searchNextRows = typeof searchNextRows == 'undefined' ? true : searchNextRows;
      
      var nextCell = fromCell.next('td');
      
      // Search for next editable cell on the same row
      while ( nextCell.size() ) {
	if (isCellEditable(nextCell) && isTabStop(nextCell)) {
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
	    if (isCellEditable(nextCell) && isTabStop(nextCell)) {
	      return nextCell;
	    }
	    nextCell = nextCell.next('td');
	  }
	  nextRow = nextRow.next('tr');
	}
      }
      // Unable to find next editable cell 
      return fromCell;
    };

    function moveLeft(fromCell, searchPreviousRows) {
      searchPreviousRows = typeof searchPreviousRows == 'undefined' ? true : searchPreviousRows

      var prevCell = fromCell.prev('td');
      
      // Search for previous editable cell on the same row
      while ( prevCell.size() ) {
	if (isCellEditable(prevCell) && isTabStop(prevCell)) {
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
	    if (isCellEditable(prevCell) && isTabStop(prevCell)) {
	      return prevCell;
	    }
	    prevCell = prevCell.prev('td');
	  }
	  prevRow = prevRow.prev('tr');
	}
      }
      // Unable to find previous editable cell 
      return fromCell;
    };

    function moveUp(fromCell) {
      var prevCell = jQuery([]);
      var prevRow = fromCell.closest('tr').prev('tr');
      var colIdx = fromCell.index();

      // Search for first editable cell in the same column of previous rows.
      while ( prevRow.size() ) {
	prevCell = prevRow.children().eq(colIdx);
	if (prevCell.size() && isCellEditable(prevCell) && isTabStop(prevCell)) {
	    return prevCell;
	}
	prevRow = prevRow.prev('tr');
      }
      // Unable to find previous editable cell 
      return fromCell;
    };

    function moveDown(fromCell) {
      var nextCell = jQuery([]);
      var nextRow = fromCell.closest('tr').next('tr');
      var colIdx = fromCell.index();

      // Search for first editable cell in the same column of subsequent rows.
      while ( nextRow.size() ) {
	nextCell = nextRow.children().eq(colIdx);
	if (nextCell.size() && isCellEditable(nextCell) && isTabStop(nextCell)) {
	    return nextCell;
	}
	nextRow = nextRow.next('tr');
      }
      // Unable to find next editable cell 
      return fromCell;
    };

    function isCellEditable(cell) {
      var row = cell.closest('tr');
      var col = colgroup.children('col').eq(cell.index());
      if ( row.attr('rowType') == undefined ) {
	row.attr('rowType','update');
      }
      if ( row.attr('rowState') == 'updating' ) {
	return false;
      } 
      // Is the column visible
      if ( col.hasClass('clsHidden') ) {
	return false;
      }
      // No name defined
      if ( col.attr('name') == undefined ) {
	return false;
      }
      if ( row.attr('rowType') == 'add' && col.attr('addDisabled') == 'true' ) {
	return false;
      }
      if ( row.attr('rowType') == 'update' && col.attr('updateDisabled') == 'true' ) {
	return false;
      } 
      if ( col.attr('type') == 'html' ) {
	return false;
      }
      return true;
    };
    // make isCellEditable public
    this.isCellEditable = isCellEditable;

    function isTabStop(cell) {
      var col = colgroup.children('col').eq(cell.index());
      if ( col.attr('tabStop') == 'no' ) {
	return false;
      } else {
	return true;
      }
    };

    function getCellValue(row,name) {
      var col = colgroup.children('col[name=' + name + ']').first();
      var colType = col.attr('type');
      var colIdx = col.index();

      if ( colIdx != -1 ) {
	// Found column with name
	var cell = row.children('td').eq(colIdx);

	if (  colType == 'html' || colType == 'htmlarea' || colType == 'FCKeditor' ) {
	  return cell.html();
	} else if ( colType=='bool' ) {
	  return parseBoolean(stripHTML(cell.html()));
	} else {
	  return unescapeHTML(cell.html());
	}
      } 
      throw new Error("No column named " + name);
    };
    // make getCellValue public
    this.getCellValue = getCellValue;
    
    function setCellValue(row,name,value) {
      var col = colgroup.children('col[name=' + name + ']').first();
      var colType = col.attr('type');
      var colIdx = col.index();

      if ( colIdx != -1 ) {
	// Found column with name
	var cell = row.children('td').eq(colIdx);

	if (  colType == 'html' || colType == 'htmlarea' || colType == 'FCKeditor' ) {
	  cell.html(value);
	} else if ( colType=='bool' ) {
	  if ( parseBoolean(value) ) {
	    cell.html("<span class='clsTrue'>Yes</span>");
	  } else {
	    cell.html("<span class='clsFalse'>No</span>");
	  }
	} else {
	  cell.html(escapeHTML(value));
	}
	return cell.html()
      }
      throw new Error("No column named " + name);
    };
    // make setCellValue public
    this.setCellValue = setCellValue;

    //
    // ROW
    //

    function requery(url,data) {
      if ( url == undefined ) {
	url = table.attr('dataURL');
      }      
      // Delete all rows
      tbody.children('tr').remove();
      
      var handler = requeryReturn;
      var errorHandler = rowActionReturnError;
      var async = false;
      var type = 'requery';
      httpPost(url,data,handler,errorHandler,async,type);
    };
    // make requery public
    this.requery = requery;

    function requeryReturn(xml) {
      var records = jQuery('records record', xml)
      for(var i=0;i<records.size();i++) {
        var row = createBlankRow();
	displayRow(row,records.eq(i));
      }
      // calculated, html
      jQuery('records calculated, records html', xml).children().each(function() {
	node = jQuery(this);
	var id = this.nodeName;
	var value = node.text();

	jQuery('#' + id, table).each(function() {
	  setObjectValue(this, value);
	});
      });
      
      if ( table.attr('enabled') == "true" ) {
	init2()
      }
    };

    // requery2 will update the data on each row from the first down
    // without deleting any rows
    function requery2(url) {
      var handler = requeryReturn2;
      var errorHandler = function(errorMessage) {
	setStatus(errorMessage);
	alert(errorMessage);
      }
      var async = false;
      var type = 'requery2';

      httpGet(url,handler,errorHandler,async,type);
    };
    // make requery2 public
    this.requery2 = requery2;

    function requeryReturn2(xml) {
      var records = jQuery('records record', xml)
      var rows = jQuery('tbody tr', table);
      for(var i=0;i<records.size();i++) {
        var row = rows.eq(i);
	displayRow(row,records.eq(i));
      }
      // calculated, html
      jQuery('records calculated, records html', xml).children().each(function() {
	node = jQuery(this);
	var id = this.nodeName;
	var value = node.text();

	jQuery('#' + id, table).each(function() {
	  setObjectValue(this, value);
	});
      });
    };

    function createBlankRow() {
      var row = jQuery('<tr>');
      var cols = colgroup.children('col');
      for(var i=0;i<colgroup.children('col').size();i++) {
        var cell = jQuery('<td>');
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
      row.attr('rowType', 'update');

      tbody.append(row);
      return row;
    };
  
    function createNewRow() {
      var row = jQuery('<tr>');
      var cols = colgroup.children('col');
      for(var i=0;i<colgroup.children('col').size();i++) {
        var cell = jQuery('<td>');
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
      row.attr('rowType', 'add');

      tbody.append(row);
      return row;
    };
 
    function rowRemove(row) {
      // Try to move away from the current row
      if ( row.find(currentCell).size() ) {
	// Move Down
	cellChange(moveDown(currentCell));
      }
      if ( row.find(currentCell).size() ) {	
	// Move Up
	cellChange(moveUp(currentCell));
      }
            
      if ( row.find(currentCell).size() ) {
	// Failed to move away
	cellOut(currentCell);
	row.remove();
      } else {
	row.remove();
	if ( currentCell.size() ) {
	  // Input will be in the wrong position
	  cellIn(currentCell);
	}
      }
    };
    // make rowRemove public
    this.rowRemove = rowRemove;
    
    function setRowState(row,newState) {
      var oldState = row.attr('rowState');
      
      switch (newState) {
	case 'dirty': {
	  if ( oldState =='current' && row.attr('rowType') == 'add' ) {
	    // Append New Row
	    createNewRow();
	  }
	  if ( oldState == 'current' || oldState == 'error' ) {
	    /*var style = "color:blue;cursor:hand;text-decoration:underline";
	    var onclick = "jQuery('#" + table.attr('id') + "').first().data('dbGrid').save()"
	    var span = "<span style=" + style + " onclick=" + onclick + ">save</span>";*/
	      setStatus('Editing ... Type Ctrl+S to ');
	      jQuery('tr:first td:first', statusTable).append(
		  jQuery("<span>save</span>")
		      .css({"color": "blue", "cursor": "hand", "text-decoration": "underline"})
		      .click(function(){table.data('dbGrid').save()})
	      );
	  }
	    break;
	}

	case 'current': {
	  setStatus("Saved.");
	  var backgroundColor = '';
	  row.css('background-color', backgroundColor);
	  if ( dbGridInputCtl != undefined ) {
	    dbGridInputCtl.getElmt().css('background-color',backgroundColor);
	  }
	  break;
	}

	case 'updating': {
	  var backgroundColor = 'yellow';
	  row.css('background-color', backgroundColor);
	  if ( dbGridInputCtl != undefined ) {
	    dbGridInputCtl.getElmt().css('background-color',backgroundColor);
	  }
	  break;
	}

	case 'error': {
	  var backgroundColor = 'tomato';
	  row.css('background-color', backgroundColor);
	  if ( dbGridInputCtl != undefined ) {
	    dbGridInputCtl.getElmt().css('background-color',backgroundColor);
	  }	  
	  break;
	}
      }

      row.attr('rowState',newState);
    };
    // make setRowState public
    this.setRowState = setRowState;

    function rowIn(row) {
      // Custom Event: Trigger any rowIn events bound to this table
      row.trigger('rowIn.dbGrid');

      if ( ! row.attr('rowType') ) {
	row.attr('rowType','update');
      }
      if ( ! row.attr('rowState') ) {
	row.attr('rowState','current');
      }
      if ( row.attr('rowError') ) {
	setStatus(row.attr('rowError'));
      }
      setNavCounter(row.index()+1);
    };

    function rowOut(row) {
      // Custom Event: Trigger any rowOut events bound to this table
      row.trigger('rowOut.dbGrid');

      if ( row.attr('rowState') == 'dirty' ) {
	save(row);
      }
    };

    function rowUrlEncode(row) {
      var list = new Array;
      var cols = colgroup.children('col');
      for(var i=0;i<cols.size();i++) {
	var col = cols.eq(i);
	if ( col.attr('name') ) {
	  var name = col.attr('name');
	  var value = getCellValue(row,name);
	  list.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
	}
      }
      return list.join("&");
    };
   
    function rowAction(row,type,url,handler,async) {
      if ( handler == undefined ) {
	handler = rowActionReturn;
      }
      
      // If async is true a page refresh may result in the db grid being populated with out of date values.
      // Default async to false if the beforeunload event has been triggered, otherwise default to true.
      if (async==false || (async == undefined && typeof event == "object" && event.type=='beforeunload') ) {
	async = false;
      } else {
	async = true;
      }
      
      if ( type=='add' || type=='update' || type=='delete' ) {
	setRowState(row,'updating');
      }
      if (currentCell.size()) {
	cellWrite();
      }
      
      // Check if there are url encoded variables in the url
      var re = /([^\?]+)\??(.*)/;
      re.exec(url);
      var path = RegExp.$1;
      var queryString = RegExp.$2;
      var data;
      if ( queryString != "" ) {
	data = queryString + '&' + rowUrlEncode(row);
      } else {
	data = rowUrlEncode(row);
      }
      
      httpPost(url,data,handler,rowActionReturnError,async,type,row);
    };
    // make rowAction public
    this.rowAction = rowAction;
    
    function rowActionReturn(xml,type,row) {
      if ( type =='update' || type =='add' ) {
	row.attr('rowType','update');
	row.attr('rowError',undefined);
	setRowState(row,'current');
      }
      if ( type =='add' ) {
	recCount ++;
	// Refresh counter
	if ( currentCell.size() ) {
	  var currentRow = currentCell.closest('tr');
	  setNavCounter(currentRow.index() + 1);
	}
      }
      if ( type == 'delete' ) {
	recCount --;
	// Focus
	rowRemove(row);
	setStatus("Deleted.");
      }
      // Row
      var rec = jQuery('records record', xml);
      if ( rec.size() ) {
	displayRow(row,rec.eq(0));
      }
      // calculated, html
      jQuery('records calculated', xml).children().each(function() {
	node = jQuery(this);
	var id = this.nodeName;
	var value = node.text();

	jQuery('#' + id, table).each(function() {
	  setObjectValue(this, value);
	});
      });

      jQuery('records html', xml).children().each(function() {
	node = jQuery(this);
	var id = this.nodeName;
	var value = node.text();

	jQuery('#' + id + ',[name="' + id + '"]').each(function() {
	  setObjectValue(this, value);
	});
      });

      // Info
      var rec = jQuery('records info', xml);
      if ( rec.size() ) {setStatus(rec.text());}
      // Alert
      var rec = jQuery('records alert', xml);
      if ( rec.size() ) {alert(rec.text());}
     
      // Custom Event: Trigger any rowActionReturn events bound to this table
      row.trigger('rowActionReturn.dbGrid', [type]);
    };

      function setObjectValue(element, value) {
	  if ( $(element).is('select, input, textarea') ) {
	      $(element).val(value);
	  } else if ( $(element).is('.clsRadioGroup') ) {
	      $(element).find('[name="'+$(element).prop('name')+'"][value="'+value+'"]').val(true);
	  } else {
	      $(element).html(value);
	  }
      }
    
    function rowActionReturnError(errorMessage,errorType,actionType,row) {
      setRowState(row,'error');
      setStatus(errorMessage);
      if ( errorType != 'USER' ) {
	alert(errorMessage);
      }
    };

    function displayRow(row,xml) {
      var cols = colgroup.children('col');
      for(var i=0;i<cols.size();i++) {
	var col = cols.eq(i);
	var colName = col.attr('name');
	var node = jQuery(colName, xml);
	
	if ( colName && node.size() ) {
	  var value = node.text();
	  setCellValue(row,colName,value);
	}
      }
     
      if ( currentCell.size() && row.find(currentCell).size() ) {
	cellIn(currentCell,'preserve');
      }
    };
    
    // Status Message
    function setStatus(msg) {
      jQuery('tr:first td:first', statusTable).html(msg);
    };
    // make setStatus public
    this.setStatus = setStatus;

    function setNavCounter(bookmark) {
      var str = 'Record ' + bookmark + ' of ' + recCount;
      jQuery('tr:first td:last', statusTable).html(str);
    };
    
    function httpPost(url,data,handler,errorHandler,async,type,elmt) {
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
	    return errorHandler(errorMessage,'USER',type,elmt);
	  }

	  // NORMAL COMPLETION
	  return handler(data,type,elmt);
	},
	error: function(jqXHR, textStatus, errorThrown) {
	  // HTTP ERROR
	  if ( jqXHR.status != 200 && jqXHR.status != 0 ) {
	    errorMessage = "Error ! Expected response 200 but got " + jqXHR.status;
	    return errorHandler(errorMessage,'HTTP',type,elmt);
	  }

	  // XML ERROR
	  if ( textStatus == 'parsererror' ) {
	    errorMessage = 'Error ! Unable to parse XML response';
	    return errorHandler(errorMessage,'XML',type,elmt);
	  }
 
	  // DEFAULT ERROR
	  errorMessage = 'Error ! '+ textStatus;
	  return errorHandler(errorMessage,'UNKNOWN',type,elmt);

	}
      });
    }

    function httpGet(url,handler,errorHandler,async,type,elmt) {
      jQuery.ajax ({
	type: "GET",
	cache: false,
	async: async,
	dataType: 'xml',
	url: url,
	success: function(data, textStatus, jqXHR) {
	  // USER ERROR
	  var error = jQuery('error', data).first();
	  if ( error.size() ) {
	    var errorMessage = error.text();
	    return errorHandler(errorMessage,'USER',type,elmt);
	  }

	  // NORMAL COMPLETION
	  return handler(data,type,elmt);
	},
	error: function(jqXHR, textStatus, errorThrown) {
	  // HTTP ERROR
	  if ( jqXHR.status != 200 && jqXHR.status != 0 ) {
	    errorMessage = "Error ! Expected response 200 but got " + jqXHR.status;
	    return errorHandler(errorMessage,'HTTP',type,elmt);
	  }

	  // XML ERROR
	  if ( textStatus == 'parsererror' ) {
	    errorMessage = 'Error ! Unable to parse XML response';
	    return errorHandler(errorMessage,'XML',type,elmt);
	  }
	  
	  // DEFAULT ERROR
	  errorMessage = 'Error ! '+ textStatus;
	  return errorHandler(errorMessage,'UNKNOWN',type,elmt);

	}
      });
    }
  };
  
  
  // Make DbGrid Class available as a jquery plugin
  $.fn.dbGrid = function(method) {
    var args = arguments
    var tables = this
    var returnVal;

    if ( this.not('table').size() ) {
      throw new Error('jQuery.dbGrid requires that only table elements are contained in the jQuery object');
    }

    // Method calling logic
    for ( var i=0; i< tables.size(); i++ ) {
      var table = tables.eq(i);
      var dbGrid = table.data('dbGrid');

      if ( ! dbGrid ) {
	dbGrid = new DbGrid(table);
	table.data('dbGrid',dbGrid);
      }

      if ( ! method ) {
	dbGrid.init.apply( dbGrid, args );
      } else {	
	returnVal = eval('dbGrid.' + method).apply( dbGrid, Array.prototype.slice.call( args, 1 ));
	if ( returnVal != undefined ) {
	  return returnVal;
	} 
      } 
    }

    return tables;
  };

})(jQuery);



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
      var dbGridDivStatus = div.data('dbGrid');

      if ( ! dbGridDivStatus ) {
	dbGridDivStatus = new DbGridDivStatus(div);
	div.data('dbGridDivStatus',dbGridDivStatus);
      }
    }
    
    return divs;
  };

}) (jQuery);

/* ==== jquery.dbRecords.js ==== */
// DbRecords Plugins
;(function($, window, undefined){

    // Navigation functions
    function sameRow(a, b) {
	// Takes two elements and returns true if they are on the same row
	return (a.offset().top <= (b.offset().top + b.outerHeight()))
	    && ((a.offset().top + a.outerHeight()) >= b.offset().top);
    }
    function belowRow(a, b) {
	// Takes two elements and returns true if "a" is on a row below "b"
	return b.offset().top > (a.offset().top + a.outerHeight());
    }
    function aboveRow(a, b) {
	// Takes two elements and returns true if "a" is on a row above "b"
	return (b.offset().top + b.outerHeight()) < a.offset().top;
    }
    function sameColumn(a, b) {
	// Takes two elements and returns true if they are in the same column
	return (a.offset().left <= (b.offset().left + b.outerWidth()))
	    && ((a.offset().left + a.outerWidth()) >= b.offset().left);
    }
    function leftOfColumn(a, b) {
	// Takes two elements and returns true if "a" is in a column left of "b"
	return (b.offset().left + b.outerWidth()) < a.offset().left;
    }
    function rightOfColumn(a, b) {
	// Takes two elements and returns true if "a" is in a column right of "b"
	return (a.offset().left + a.outerWidth()) < b.offset().left;
    }


    $.widget('qcode.dbRecordSet', {
	_create: function(){
	    this.currentField = $([]);

	    // Event listeners - instead of seperate event listeners for each field, delegated event listeners are added to the container.
	    this.element
		.on('mousedown.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onMouseDown', event);
		})
		.on('keydown.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onKeyDown', event);
		})
		.on('keyup.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onKeyUp', event);
		})
		.on('cut.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onCut', event);
		})
		.on('paste.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onPaste', event);
		})
		.on('blur.dbRecordSet', '.editable', function(event){
		    $(event.target).dbField('onBlur', event);
		});
	    $(window)
		.on('beforeunload.dbRecordSet', this._onBeforeUnload.bind(this))
		.on('beforeprint.dbRecordSet', this._onBeforePrint.bind(this));
	},
	save: function(aysnc) {
	    // Save the current record
	    this.getCurrentRecord.dbRecord('save', async);
	}, 
	getCurrentRecord: function() {
	    // Returns the current record (the record containing the current field), or an empty jQuery object if none exists.
	    return this.currentField.dbField('getRecord');
	}, 
	getCurrentField: function() {
	    // Returns the current field, or an empty jQuery object if none exists.
	    return this.currentField;
	}, 
	setCurrentField: function(newField) {
	    // Sets the "currentField" property - this is intended for internal use, please use fieldChange to change the current field.
	    this.currentField = $(newField);
	}, 
	fieldChange: function(newField) {
	    // Switch to the target field
	    var currentRecord = this.currentField.dbField('getRecord');
	    var newRecord = newField.dbField('getRecord');
	    this.currentField.dbField('fieldOut');
	    if ( ! currentRecord.is(newRecord) ) {
		currentRecord.dbRecord('recordOut');
	    }
	    newField.dbField('fieldIn');
	    if ( ! currentRecord.is(newRecord) ) {
		newRecord.dbRecord('recordIn');
	    }
	}, 
	moveLeft: function(fromField) {
	    // Returns the field one step left of the target, or the target itself if none exists
	    var nextField;
	    var fromFieldLeft = fromField.offset().left;
	    var fields = this.element.find('.editable');
	    fields.each(function() {
		var field = $(this);
		var fieldLeft = field.offset().left;
		if ( sameRow(field, fromField)
		     && fieldLeft < fromFieldLeft
		     && ( nextField === undefined || fieldLeft > nextFieldLeft )
		   ) {
		    nextField = field;
		    nextFieldLeft = fieldLeft;
		}
	    });
	    if ( nextField === undefined ) {
		fields.each(function() {
		    var field = $(this);
		    var fieldLeft = $(field).offset().left;
		    if ( aboveRow(fromField, field)
			 && (nextField === undefined
			     || belowRow(nextField, field)
			     || (sameRow(field, nextField) && fieldLeft > nextFieldLeft )
			    )
		       ) {
			nextField = field;
			nextFieldLeft = fieldLeft;
		    }
		});
	    }
	    if ( nextField === undefined ) {
		return fromField;
	    } else {
		return nextField;
	    }
	}, 
	moveRight: function(fromField) {
	    // Returns the field one step right of the target, or the target itself if none exists
	    var nextField;
	    var fromFieldLeft = fromField.offset().left;
	    var fields = this.element.find('.editable');
	    fields.each(function() {
		var field = $(this);
		var fieldLeft = field.offset().left;
		if ( sameRow(field, fromField)
		     && fieldLeft > fromFieldLeft
		     && ( nextField === undefined || fieldLeft < nextFieldLeft )
		   ) {
		    nextField = field;
		    nextFieldLeft = fieldLeft;
		}
	    });
	    if ( nextField === undefined ) {
		fields.each(function() {
		    var field = $(this);
		    var fieldLeft = $(field).offset().left;
		    if ( belowRow(fromField, field)
			 && (nextField === undefined
			     || aboveRow(nextField, field)
			     || (sameRow(field, nextField) && fieldLeft < nextFieldLeft)
			    )
		       ) {
			nextField = field;
			nextFieldLeft = fieldLeft;
		    }
		});
	    }
	    if ( nextField === undefined ) {
		return fromField;
	    } else {
		return nextField;
	    }
	}, 
	moveUp: function(fromField) {
	    // Returns the field one step above the target, or the target itself if none exists
	    var nextField;
	    var fromFieldTop = fromField.offset().top;
	    var fields = this.element.find('.editable');
	    fields.each(function() {
		var field = $(this);
		var fieldTop = field.offset().top;
		if ( sameColumn(fromField, field)
		     && fieldTop < fromFieldTop
		     && (nextField === undefined || fieldTop > nextFieldTop)
		   ) {
		    nextField = field;
		    nextFieldTop = fieldTop;
		}
	    });
	    if ( nextField === undefined ) {
		fields.each(function() {
		    var field = $(this);
		    var fieldTop = field.offset().top;
		    if ( leftOfColumn(fromField, field)
			 && (nextField === undefined
			     || rightOfColumn(nextField, field)
			     || (sameColumn(field, nextField) && fieldTop > nextFieldTop)
			    )
		       ) {
			nextField = field;
			nextFieldTop = fieldTop;
		    };
		});
	    }
	    if ( nextField === undefined ) {
		return fromField;
	    } else {
		return nextField;
	    }
	}, 
	moveDown: function(fromField) {
	    // Returns the field one step below the target, or the target itself if none exists
	    var nextField;
	    var fromFieldTop = fromField.offset().top;
	    var fields = this.element.find('.editable');
	    fields.each(function() {
		var field = $(this);
		var fieldTop = field.offset().top;
		if ( sameColumn(fromField, field)
		     && fieldTop > fromFieldTop
		     && ( nextField === undefined || fieldTop < nextFieldTop )
		   ) {
		    nextField = field;
		    nextFieldTop = fieldTop;
		}
	    });
	    if ( nextField === undefined ) {
		fields.each(function() {
		    var field = $(this);
		    var fieldTop = field.offset().top;
		    if ( rightOfColumn(fromField, field)
			 && ( nextField === undefined
			      || leftOfColumn(nextField, field)
			      || (sameColumn(field, nextField) && fieldTop < nextFieldTop)
			    )
		       ) {
			nextField = field;
			nextFieldTop = fieldTop;
		    }
		});
	    }
	    if ( nextField === undefined ) {
		return fromField;
	    } else {
		return nextField;
	    }
	},
	_onBeforeUnload: function(event){
	    var record = this.getCurrentRecord();
	    if ( record.dbRecord('getState') == 'dirty' ) {
		if ( window.confirm('Do you want to save your changes?') ) {
		    record.dbRecord('save', false);
		    if ( record.dbRecord('getState') == 'error' ) {
			return "Your changes could not be saved.\nStay on the current page to correct.";
		    }
		}
	    }
	},
	_onBeforePrint: function(event){
	    this.getCurrentField().dbField('fieldOut');
	    this.getCurrentRecord().dbRecord('recordOut');
	}
    });


    $.widget('qcode.dbRecord', {
	_create: function(){
	    this.state = 'current';
	    if ( this.element.attr('saveAction') === "add" ) {
		this.saveAction = "add";
	    } else {
		this.saveAction = "update";
	    }
	},
	getRecordSet: function(){
	    // Get the record-set element for this record
	    return this.element.closest('.recordSet');
	}, 
	getState: function(){
	    // Get the state of this record
	    return this.state;
	}, 
	setState: function(newState){
	    // Set the state of this record
	    switch(newState) {
	    case "updating":
	    case "error":
	    case "current":
	    case "dirty":
		this.element.removeClass("current dirty updating error");
		this.element.addClass(newState);
		this.state = newState;
		break;
	    default:
		$.error('Invalid state');
	    }
	}, 
	save: function(async){
	    // Save this record, using an add or update url as appropriate
	    if ( this.getState() === "updating" ) return false;
	    var url = this.getRecordSet().attr(this.saveAction + "URL");
	    if ( ! url ) {
		$.error('Could not '+this.saveAction+' record - no url provided');
	    }
	    this.action(this.saveAction, url, async);
	}, 
	delete: function(async){
	    // Delete this record, by sending a delete request to the server
	    if ( this.getState() === "updating" ) return false;
	    var url = this.getRecordSet().attr('deleteURL');
	    if ( ! url ) {
		$.error('Could not delete record - no url provided');
	    }
	    this.action('delete', url, async);
	}, 
	action: function(action, url, async){
	    // Perform the given action (add, update, delete), by submitting record data to the server.
	    var async = coalesce(async, true);

	    this.setState('updating');
	    this.getCurrentField().dbField('write');

	    var urlPieces = splitURL(url);
	    var path = urlPieces.path;
	    var data = urlPieces.data;
	    this.element.find('[name]').each(function(i, field) {
		var name = $(field).dbField('getName');
		var value = $(field).dbField('getValue');
		data[name] = value;
	    });

	    httpPost(path, data, this._actionReturn.bind(this, action), this._actionReturnError.bind(this, action), async);
	    this.element.trigger('recordAction', [action]);
	}, 
	getCurrentField: function(){
	    return this.element.find(this.getRecordSet().dbRecordSet('getCurrentField'));
	}, 
	getFields: function(){
	    // Returns all editable fields in the record
	    return this.element.find('.editable');
	}, 
	setValues: function(xmlDoc){
	    // Takes an xml document/fragment and attempts to match the nodes to fields in the record, setting the values of those elements.
	    this.element.find('[name]').each(function(i, field) {
		var node = $(xmlDoc).find('records record ' + $(field).dbField('getName'));
		if ( node.length > 0 ) {
		    $(field).dbField('setValue', node.text());
		}
	    });
	    this.element.trigger('resize');
	}, 
	recordIn: function(){
	    this.element.trigger('recordIn');
	}, 
	recordOut: function(){
	    if ( this.getState() === "dirty" ) {
		this.save();
	    }
	    this.element.trigger('recordOut');
	},
	_actionReturn: function(action, xmlDoc, status, jqXHR){
	    this.setState('current');
	    switch(action){
	    case "update":
		this.setValues(xmlDoc);
		break;
	    case "add":
		this.saveAction = "update";
		this.setValues(xmlDoc);
		break;
	    case "delete":
		this.element.remove();
		this.getRecordSet().trigger('resize');
		break;
	    }
	    this.element.trigger('recordActionReturn', [action, xmlDoc, status, jqXHR]);
	},
	_actionReturnError: function(action, message, type, error){
	    this.setState('error');
	    if ( type != 'USER' ) {
		alert(message);
	    }
	    this.element.trigger('recordActionReturnError', [action, message, type, error]);
	}
    });


    $.widget( "qcode.dbField", {
	_create: function(){
	    this.lockFocusEvents = false;
	},
	getRecordSet: function(){
	    return this.element.closest('.recordSet');
	}, 
	getName: function() {
	    return this.element.attr('name');
	}, 
	getRecord: function(){
	    // get the record containing this field
	    return this.element.closest('.record');
	}, 
	getValue: function(){
	    // get the current value of this field (may be different from the value held in the editor, if this field is currently being edited)
	    if ( this.getType() == "html" ) {
		return this.element.html();
	    } else if ( this.element.is(':input') ) {
		return this.element.val();
	    } else {
		return this.element.text();
	    }
	}, 
	setValue: function(newValue){
	    // set the current value of this field
	    if ( this.getType() == "html" ) {
		this.element.html(newValue);
	    } else if ( this.element.is(':input') ) {
		this.element.val(newValue);
	    } else {
		this.element.text(newValue);
	    }
	}, 
	fieldIn: function(newField, select){
	    // Begin editing this field - display the editor, make this the recordSet's current field, trigger a fieldIn event.
	    var recordSet = this.getRecordSet();
	    this.lockFocusEvents = true;
	    recordSet.dbRecordSet('setCurrentField', this.element);
	    this.element.css('visibility', "hidden");

	    var fieldValue = this.getValue();

	    var plugin = this._getEditorPluginName();
	    recordSet[plugin]('show', this.element, fieldValue);

	    if (select) {
		recordSet[plugin]('selectText', select);
	    } else if ( this.element.attr('fieldInSelect') != null ) {
		recordSet[plugin]('selectText', this.element.attr('fieldInSelect'));
	    } else {
		recordSet[plugin]('selectText', 'all');
	    }
	    this.element.trigger('fieldIn');
	    this.lockFocusEvents = false;
	}, 
	fieldOut: function(){
	    // Stop editing this field
	    this.lockFocusEvents = true;
	    var recordSet = this.getRecordSet();
	    var record = this.getRecord();
	    recordSet.dbRecordSet('setCurrentField', $([]));

 	    var plugin = this._getEditorPluginName();
	    var editorValue = recordSet[plugin]('getValue');

	    if ( this.getValue() !== editorValue ) {
		record.dbRecord('setState', 'dirty');
	    }
	    this.write();
	    this.element.css('visibility', "inherit");

	    recordSet[plugin]('hide');

	    this.element.trigger('fieldOut');
	    this.lockFocusEvents = false;
	}, 
	getType: function(){
	    // Returns the field type (input, text, or html)
	    return this.element.attr('type');
	}, 
	isEditable: function(){
	    // Returns true if the field is currently editable (ie. not updating)
	    return (this.element.is('.editable') && this.getRecord().dbRecord('getState') != "updating");
	}, 
	onMouseDown: function(event){
	    if ( this.isEditable() ) {
		this.getRecordSet().dbRecordSet('fieldChange', this.element);
		event.preventDefault();
	    }
	}, 
	onKeyDown: function(event){
	    // nb. Normally only captures key up events propagated here by the editor
	    if ( event.altKey ) {
		return true;
	    }
	    var recordSet = this.getRecordSet();
	    var field = this.element;
	    switch (event.which) {
	    case 37: //left
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveLeft', field));
		break;
	    case 38: //up
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveUp', field));
		break;
	    case 39: //right
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveRight', field));
		break;
	    case 40: //down
		recordSet.dbRecordSet('fieldChange', recordSet.dbRecordSet('moveDown', field));
		break;
	    case 9: //tab
		if ( event.shiftKey ) {
		    var newField = recordSet.dbRecordSet('moveLeft', field);
		} else {
		    var newField = recordSet.dbRecordSet('moveRight', field);
		}
		if ( newField == field ) {
		    this.getRecord().dbRecord('save');
		} else {
		    recordSet.dbRecordSet('fieldChange', newField);
		}
		break;
	    case 13: //return
		var newField = recordSet.dbRecordSet('moveRight', field);
		if ( newField == field ) {
		    this.getRecord().dbRecord('save');
		} else {
		    recordSet.dbRecordSet('fieldChange', newField);
		}
		break;
	    case 83: //ctrl + s
		if ( event.ctrlKey ) {
		    this.getRecord().dbRecord('save');
		    event.preventDefault();
		}
		break;
	    }
	}, 
	onKeyUp: function(event){
	    // Get the current editor value
	    var recordSet = this.getRecordSet();
 	    var plugin = this._getEditorPluginName();
	    var editorValue = recordSet[plugin]('getValue');
	    
	    if ( this.getValue() !== editorValue) {
		this.getRecord().dbRecord('setState', 'dirty');
	    }
	}, 
	onCut: function(){
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	onPaste: function(){
	    this.getRecord().dbRecord('setState', 'dirty');
	}, 
	onBlur: function(){
	    // Blur may be triggered by fieldIn, depending on the browser. Locking prevents this issue.
	    if ( ! this.lockFocusEvents ) {
		this.fieldOut();
		this.getRecord().dbRecord('recordOut');
	    }
	}, 
	write: function(){
	    // Write the current editor contents to the field
	    var recordSet = this.getRecordSet();
 	    var plugin = this._getEditorPluginName();
	    var editorValue = recordSet[plugin]('getValue');
	    this.setValue(editorValue);
	},
	_getEditorPluginName: function() {
	    // Determines the appropriate editor plugin for this field, 
	    // then returns a function which calls that plugin on the record set element.
	    switch(this.getType()){
	    case "text":
		return "dbEditorInput";
		break;
	    case "textarea":
		return "dbEditorText";
		break;
	    case "htmlarea":
		return "dbEditorHTML";
		break;
	    }
	}
    });
})(jQuery, window);

// dbRecordSet is hard-coded to work with the "recordSet" class, so we may as well call it here rather than in behaviour files.
jQuery(function(){
    jQuery('.recordSet').dbRecordSet();
});

/* ==== jquery.hoverScroller.js ==== */
// Hover Scroller plugin - Create controls at the top and bottom of a scrollable box that scroll the box on mouse hover.
(function($){
    $.fn.hoverScroller = function(options){
	// scrollbox is the box to scroll,
	// container is the element to add the controls to (normally the scrollbox's parent)
	// scrollSpeed is measured in pixels/millisecond and determines how fast the box scrolls (only a single fixed speed is currently supported)
	var settings = $.extend({
	    scrollBox: $(this),
	    container: $(this).parent(),
	    scrollSpeed: 0.3
	}, options);
	var scrollBox = settings.scrollBox;
	var container = settings.container;
	var scrollSpeed = settings.scrollSpeed;

	// A div which appears at the bottom of the container, which scrolls the scrollBox down when you hover the mouse over it
	var downScroller = $('<div>')
	    .appendTo(container)
	    .addClass('down scroller')
	    .on('mouseenter', function(){
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
	    .on('mouseleave', function(){
		if ( scrollBox.is('.scrolling') ) {
		    // If the mouse leaves the downwards scroller before scrolling is finished, stop scrolling and return the scroller to its base opacity
		    downScroller.stop().fadeTo(0, 0.1);
		    scrollBox.stop();
		}
	    });

	// A div which appears at the top of the container, which scrolls the scrollBox up when you hover the mouse over it
	var upScroller = $('<div>')
	    .appendTo(container)
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
	    });


	// Only display the scroller controls when the content is overflowing - listen for resize events to indicate that this may have changed.
	$(window).on('resize.hoverScroller', function(){
	    if ( parseInt(scrollBox.prop('scrollHeight')) == parseInt(scrollBox.height()) ) {
		upScroller.add(downScroller).stop().fadeOut(0);
	    } else {
		if ( scrollBox.scrollTop() > 0 ) {
		    upScroller.fadeTo(0, 0.1);
		}
		if ( scrollBox.scrollTop() + scrollBox.height() < scrollBox.prop('scrollHeight') ) {
		    downScroller.fadeTo(0, 0.1);
		}
	    }
	});
	$(window).triggerHandler('resize.hoverScroller');

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
(function($){

    // class Sidebar - an object to handle all the plugin functionality
    function Sidebar(element) {
	// Even collapsed, the sidebar will take up some space, so add a margin to the body to prevent the collapsed sidebar from obscuring any page contents
	$('body').css('margin-right', "+=35px");

	var sidebar = this.sidebar = $(element);
	var toolbar = this.toolbar = sidebar.find('.toolbar');
	var initialWidth = sidebar.width();

	// An invisible div sitting on the sidebar's edge, to capture click & drag events for resizing the sidebar.
	var handle = this.handle = $('<div>')
	    .addClass('handle')
	    .prependTo(sidebar)
	    .on('mousedown.resizer',dragStart) // The dragStart function will bind additional event listeners to trigger drag events
	    .on('dragStart', function(event, data) {
		initialWidth = sidebar.width();
		sidebar.trigger('resizeStart');
	    })
	    .on('drag', function(event, data) {
		sidebar.width(initialWidth - data.offset);
		sidebar.width(sidebar.width()); // Ensures that the css "width" property matches the actual calculated width
		sidebar.trigger('resize');
	    })
	    .on('dragEnd', function(event, data) {
		initialWidth = sidebar.width();
		sidebar.trigger('resizeEnd');
	    });

	// Button to collapse the sidebar
	var collapseButton = this.collapseButton = $('<button>')
	    .text('\u21e5')
	    .addClass('collapse')
	    .prependTo(toolbar)
	    .on('click', this.collapse.bind(this));

	// Button to restore a collapsed sidebar
	var restoreButton = this.restoreButton = $('<button>')
	    .text('\u21e4')
	    .addClass('restore')
	    .prependTo(toolbar)
	    .hide()
	    .on('click', this.restore.bind(this));
    }

    // Public methods of class Sidebar
    $.extend(Sidebar.prototype, {
	collapse: function() {
	    // "Collapse" the sidebar (actually just hides most of it beyond the edge of the window).
	    this.handle.off('.resizer').css('cursor', 'auto');
	    this.collapseButton.hide();
	    this.restoreButton.show();
	    this.sidebar.stop().animate({
		'right': 25 - this.sidebar.width()
	    });
	},
	restore: function() {
	    // Restore a collapsed sidebar
	    this.handle.on('mousedown.resizer',dragStart).css('cursor', "w-resize");
	    this.restoreButton.hide();
	    this.collapseButton.show();
	    this.sidebar.stop().animate({
		'right': 0
	    });
	}
    });
    // End of class Sidebar



    // Drag events.
    // Typical use is to call dragStart in response to a mousedown event, then listen for dragStart, drag and dragEnd events.
    // Once called, dragStart will add listeners and call the other functions appropriately.
    function dragStart(event){
	var target = $(event.target);
	event.preventDefault();
	$('body')
	    .on('mousemove.dragEvent',drag.bind(this,target))
	    .on('mouseup.dragEvent',dragEnd.bind(this,target))
	    .on('mouseleave.dragEvent',dragEnd.bind(this,target));
	target
	    .data({
		'initialX': event.pageX
	    })
	    .trigger('dragStart');
    }
    function drag(target, event){
	event.preventDefault();
	target.trigger('drag', [{
	    'offset': event.pageX - target.data('initialX')
	}]);
    }
    function dragEnd(target, event){
	$('body').off('.dragEvent');
	target.trigger('dragEnd');
    }



    // sidebar plugin function
    $.fn.sidebar = function(){
	$(this).each(function(){
	    var sidebar = $(this).data('sidebar');
	    if ( typeof sidebar != "object" ) {
		$(this).data('sidebar', new Sidebar(this));
		sidebar = $(this).data('sidebar');
	    }
	});
	return this;
    }
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

/* ==== jquery.theadFixed.js ==== */
(function($){
    var scrollBarWidth = 18;

    // TheadFixed Class Constructor
    var TheadFixed = function(table, settings) {
	this.table = table;

	// Settings
	var defaultSettings = {
	    'height': "100%",
	    'wrapperClass': "theadFixed-wrapper",
	    'scrollWrapperClass': "theadFixed-scrollWrapper",
	    'scrollBoxClass': "theadFixed-scrollBox",
	    'tableClass': this.table.attr('class')
	};
	if ( typeof this.table.data('height') !== "undefined" ) {
	    defaultSettings.height = this.table.data('height');
	}
	this.settings = $.extend(defaultSettings, settings);

	table.attr('class', this.settings.tableClass);

	// Accounting for borders, padding, etc.
	this.thead = this.table.children('thead');
	this.errorY = this.thead.offset().top - this.table.offset().top - parseInt(this.table.css('margin-top'));
	this.errorX = this.thead.offset().left - this.table.offset().left - parseInt(this.table.css('margin-left'));
	if ( this.table.css('border-collapse') == 'collapse' ) {
	    this.errorY++;
	}

	// Create wrappers and apply classes
	this.table.wrap('<div>');
	this.scrollBox = this.table.parent()
	    .addClass(this.settings.scrollBoxClass)
	    .wrap('<div>');
	this.scrollWrapper = this.scrollBox.parent()
	    .addClass(this.settings.scrollWrapperClass)
	    .wrap('<div>');
	this.wrapper = this.scrollWrapper.parent()
	    .addClass(this.settings.wrapperClass);

	// Temporarily give the table a lot of space to make sure that the column width calculations come out right
	this.scrollBox.css('min-width', 10000);

	// Calculate and apply column widths
	this.table.children('tbody').children('tr').not(':first-child').children('th, td').css('width', '');
	this.table.children('tbody').children('tr:first-child').children('th, td').each(function(index, element){
	    var td = $(element);
	    var th = this.thead.children('tr:first-child').children('th, td').eq(index);
	    var width = Math.ceil(td.innerWidth());

	    // Ensures that default padding will be preserved when the thead is removed
	    th.css({
		'padding-top': th.css('padding-top'),
		'padding-right': th.css('padding-right'),
		'padding-bottom': th.css('padding-bottom'),
		'padding-left': th.css('padding-left')
	    });
	    th.css('width', width - parseInt(th.css('padding-left')) - parseInt(th.css('padding-right')));
	    td.css('width', width - parseInt(td.css('padding-left')) - parseInt(td.css('padding-right')));
	}.bind(this));

	// Apply css
	this.wrapper.css({
	    'position': "relative",
	    'margin-top': this.table.css('margin-top'),
	    'margin-right': this.table.css('margin-right'),
	    'margin-bottom': this.table.css('margin-bottom'),
	    'margin-left': this.table.css('margin-left'),
	    'height': this.settings.height
	});
	this.table.css('margin', 0);

	this.scrollWrapper.css({
	    'position': "absolute",
	    'top': this.thead.outerHeight() + this.errorY,
	    'bottom': 0
	});
	this.scrollBox.css({
	    'overflow-y': "auto",
	    'overflow-x': 'hidden',
	    'height': "100%",
	    'min-width': this.table.outerWidth() + scrollBarWidth
	});

	this.errorX -= parseInt(this.table.css('border-left-width'));

	this.thead.css({
	    'position': "absolute",
	    'bottom': "100%",
	    'left': this.errorX
	});
	if ( this.table.css('border-collapse') == 'collapse' ) {
	    this.table.children('tr:first-child').children('th, td').css('border-top-width', 0);
	}

	this.thead.find('tr').eq(0).find('th, td').css({
	    'border-top-style': this.table.css('border-top-style'),
	    'border-top-width': this.table.css('border-top-width'),
	    'border-top-color': this.table.css('border-top-color')
	});
	this.thead.find('tr').each(function(i, row){
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

	this.table.css('border-top-width', 0);
    };
    $.extend(TheadFixed.prototype, {
	setHeight: function(newHeight) {
	    this.wrapper.css('height', newHeight);
	}
    });

    // Make TheadFixed Class available as a jquery plugin
    $.fn.theadFixed = function() {
	var tables = this;
	if ( typeof arguments[0] == "object" ) {
	    var settings = arguments[0];
	} else if ( typeof arguments[0] == "string" ) {
	    var method = arguments[0];
	}

	if ( tables.not('table').size() ) {
	    throw new Error('jQuery.theadFixed requires that only table elements are contained in the jQuery object');
	}

	// Initialise TheadFixed objects for each elmt unless this has already been done
	for ( var i=0; i< tables.size(); i++ ) {
	    var table = tables.eq(i);
	    var theadFixed = table.data('theadFixed');

	    if ( ! theadFixed ) {
		theadFixed = new TheadFixed(table, settings);
		table.data('theadFixed',theadFixed);
	    }

	    if ( method == 'wrapper' ) {
		return theadFixed.wrapper;
	    }
	    if ( method == 'height' && arguments.length == 2 ) {
		theadFixed.setHeight(arguments[1]);
	    }
	}
	
	return tables;
    }

}) (jQuery);



/* ==== jquery.utils.js ==== */
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
function heir(p) {
    var f = function(){};
    f.prototype = p;
    return new f();
}
function coalesce() {
    for(var i = 0; i < arguments.length; i++){
	if ( typeof arguments[i] != "undefined" ) {
	    return arguments[i];
	}
    }
}
function splitURL(url) {
    var re = /([^\?]+)\??(.*)/;
    re.exec(url);
    var path = RegExp.$1;
    var queryString = RegExp.$2;
    var data = {};
    $.each(queryString.split('&'),function(i, pair){
	data[pair.split('=')[0]] = pair.split('=')[1];
    });
    return {
	'path': path,
	'data': data
    }
}
function formFocus(form) {
    $(form).find('input, textarea, select').each(function(){
	$(this).focus();
	if ( $(this).is(':focus') ) {
	    return false;
	}
    });
}
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
	error: function(jqXHR, textStatus, errorThrown) {
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

// Bug fix for table border width detection in ie9
(function($){
    //if ( $.browser.msie && parseInt($.browser.version, 10) == "9" ) {
        var oldCssFunction = $.fn.css;
        $.fn.css = function() {
            if ( this.first().is('table') && arguments.length == 1 ) {
		var table = this.first();
                switch(arguments[0]){
                case "border-left-width":
                    var totalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    this.css('border-left-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-left-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-right-width":
                    var totalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    this.css('border-right-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-right-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-top-width":
                    var totalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    this.css('border-top-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-top-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-bottom-width":
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
    //}
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
})(jQuery);

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


