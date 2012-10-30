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


/* ==== bvwLibTable1.0.js ==== */
function tableBubbleSort(oTBody,colIdx,cmp) {
	for(var i=oTBody.rows.length-1;i>0;i--) {
		for(var j=0; j < i; j++) {
			if ( cmp(oTBody.rows[j+1].cells[colIdx],oTBody.rows[j].cells[colIdx]) < 0 ) {
				oTBody.rows[j+1].swapNode(oTBody.rows[j]);
			}
		}
	}
}

function cmpString(elmt1,elmt2) {
	var str1=elmt1.innerText;
	var str2=elmt2.innerText;
	if ( str1 < str2 ) {
		return -1;
	}	
	if ( str1 > str2 ) {
		return 1;
	}
	return 0;
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


/* ==== dbCells.js ==== */
function dbCells(oDiv) {
  // A database type grid to update dbCells
  // Attaches to a DIV class dbCells
  
  // Events
  // onCellActionReturn passes evnt - fired after return from the server without any error
  // onCellOut
  // onCellIn

  // vars
  var currentCell;

  // Input Controls
  var oInputCtl;
  var oInput;
  var oCombo;
  var oTextArea;
  var oHTMLArea;
  var oFCKeditor;
  //
  var keyUpTimer;
  
  // Parameters
  if ( oDiv.initialFocus == undefined ) { oDiv.initialFocus = "true" }
  if ( oDiv.enabled == undefined ) { oDiv.enabled = "true" }
  if ( oDiv.updateType == undefined ) { oDiv.updateType = "cellOut" }
  //

 

  var cells = new Array();
  var divs = oDiv.getElementsByTagName('DIV');
  for(var i=0;i<divs.length;i++) {
    var oCell = divs[i];
    if ( oCell.className == 'clsDbCell') {
      cells.push(oCell);
      oCell.save=save;
    }
  }

  // Init input controls
  inputControlsInit();
  // Bind
  oDiv.attachEvent('onmouseup',cellOnMouseUp);
  //oDiv.attachEvent('onscroll',onScroll);
  window.attachEvent('onresize',onResize);
  window.attachEvent('onbeforeunload',onBeforeUnload);
  window.attachEvent('onbeforeprint',onBeforePrint);
  
  // End Init
function focus() {
    if (typeof(currentCell) != "undefined") {
      cellIn(currentCell);
    }
  }
  
function setDirty() {
    if (typeof(currentCell) != "undefined") {
      setCellState(currentCell,'dirty');
    }
  }

function onBeforeUnload() {
    if (typeof(currentCell) == "undefined") {	
      return false;
    }
    
    if ( currentCell.cellState == 'dirty' ) {
      if (window.confirm('Do you want to save your changes?')) {
	save(currentCell,false);
	if (currentCell.cellState == 'error' ) {
	  event.returnValue = "Your changes could not be saved.\nStay on the current page to correct.";
	}
      }
    }
  }

function onBeforePrint() {
    if (typeof(currentCell) != "undefined") {
      cellOut(currentCell);
    }	
  }

function onResize() {
    if (currentCell) {
      cellChange(currentCell);
    }
  }

function onScroll() {
   if (typeof(currentCell) != "undefined") {
     cellOut(currentCell);
   }
 }

function save(oCell,async) {
  if ( typeof(oCell)=="undefined" ) {
    oCell=currentCell;
  }
  if ( typeof(oCell.updateURL) != "undefined" ) {
    return cellAction(oCell,'update',oCell.updateURL,cellActionReturn,async);
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
    if (e.type =='cut') {
      cellOnCut(e);
    }
    if (e.type =='paste') {
      cellOnPaste(e);
    }
    if (e.type =='blur') {
      var activeElmt=document.activeElement;
      if (!oDiv.contains(activeElmt) && (oInputCtl && activeElmt!=oInputCtl) && currentCell) {
	if ( oDiv.updateType=="onCellOut" && currentCell.cellState == 'dirty') {
	  save(currentCell);
	}
      }
    }
  }

  function inputControlsInit() {
    var wantCombo= false;
    var wantTextArea = false;
    var wantHTMLArea = false;
    var wantFCKeditor = false;
  
    for(var i=0;i<cells.length;i++) {
      var oCell = cells[i];
      if ( oCell.type == 'combo' ) {
	wantCombo = true;
      }
      if ( oCell.type == 'textarea' ) {
	wantTextArea = true;
      }
      if ( oCell.type == 'htmlarea' ) {
	wantHTMLArea = true;
      }
      if ( oCell.type == 'FCKeditor' ) {
	wantFCKeditor = true;
      }
    }
  
    oInput = dbCellInput(inputControlCallback);
    oDiv.appendChild(oInput);
  
    if ( wantCombo ) {
      oCombo = dbCellCombo(inputControlCallback);
      oDiv.appendChild(oCombo);
    }
    if ( wantTextArea ) {
      oTextArea = dbCellTextArea(inputControlCallback);
      oDiv.appendChild(oTextArea);
    }
    if ( wantHTMLArea ) {
      oHTMLArea = dbCellHTMLArea(inputControlCallback);
      oDiv.appendChild(oHTMLArea);
    }
    if ( wantFCKeditor ) {
      oFCKeditor = dbCellFCKeditor(inputControlCallback,oDiv);
    }
  }
 
  //
  // CELL
  //
  
  function cellChange(newCell) {
    if (typeof(currentCell)=="undefined") {
      cellIn(newCell);
    } else {
      var oldCell = currentCell;
      cellOut(oldCell);
      cellIn(newCell);
    }
  }

  function cellIn(oCell,select) {
    currentCell = oCell;
    // Hide the cell
    oCell.style.visibility='hidden';
    // state
    if ( typeof(oCell.cellState)=="undefined" ) {
      setCellState(oCell,'current');
    }
    // Decide which inputControl to use
    var type = oCell.type;
    var cellValue = getCellValue(oCell);
    if (  typeof(type) == "undefined" ) {
      type = 'text';
    }
    if ( type == 'text' ) {
      oInputCtl = oInput;
      oInputCtl.show(oCell,cellValue);
    }
    if ( type == 'textarea' ) {
      var editorHeight;
      if ( typeof(oCell.editorHeight) != "undefined" ) {
	var editorHeight = oCell.editorHeight;
      }
      oInputCtl = oTextArea;
      oInputCtl.show(oCell,cellValue,editorHeight);
    }
    if ( type == 'htmlarea' ) {
      var editorHeight;
      if ( typeof(oCell.editorHeight) != "undefined" ) {
	var editorHeight = oCell.editorHeight;
      }
      oInputCtl = oHTMLArea;
      oInputCtl.show(oCell,cellValue,editorHeight);
    }
    if ( type == 'FCKeditor' ) {
      var editorHeight;
      if (  typeof(oCell.editorHeight) != "undefined" ) {
	var editorHeight = oCell.editorHeight;
      }
      oInputCtl = oFCKeditor;
      oInputCtl.show(oCell,cellValue,editorHeight);
    }
    if ( type == 'combo' ) {
      oInputCtl = oCombo;
      var searchURL = oCell.searchURL;
      var name = oCell.name;
      var boundName = oCell.boundName;
      var boundValue = urlGet(oCell.updateURL,boundName);
      oInputCtl.show(oCell,name,cellValue,boundName,boundValue,searchURL);
    }

    if (select) {
      oInputCtl.selectText(select);
    } else {
      if ( oCell.getAttribute('cellInSelect') !=null ) {
	oInputCtl.selectText(oCell.getAttribute('cellInSelect'));
      } else {
	oInputCtl.selectText('all');
      }
    }
  }
 
  function cellOut(oCell) {
    var oldValue = getCellValue(oCell);
    var newValue = oInputCtl.getValue();
   
    if ( oldValue != newValue ) {	
      setCellState(oCell,'dirty');
    }

    cellWrite();
    // Show the cell
    oCell.style.visibility='inherit';
    // Hide the input control
    oInputCtl.hide();
    // Cleanup
    currentCell = undefined;
    oInputCtl = undefined;

    // If updateType is onKeyUp then 
    // cancel any delayed save and save now 
    if ( oDiv.updateType=="onKeyUp" ) {
      cancelDelayedSave();
      if (oCell.cellState == 'dirty') {
	save(oCell);
      }
    } else if ( oCell.cellState == 'dirty') {
      save(oCell);
    }

    if ( oDiv.onCellOut ) {
      oDiv.onCellOut(oTD);
    }
  }

function cellOnMouseUp() {
  var oNode = window.event.srcElement;
  while (oNode.className!='clsDbCell' && oNode.parentNode) {
    oNode = oNode.parentNode;
  }
  if (oNode.className == 'clsDbCell') {
    if ( isCellEditable(oNode) ) {
      cellChange(oNode);
    }
  } else {
    return false;
  }
}

function cellWrite() {
  // Write the contents of the input to the current cell
  var name = currentCell.name;
  setCellValue(currentCell,oInputCtl.getValue());
  if ( oInputCtl.getType() == 'combo') {
    // Set the value of the bound name in the updateURL
    currentCell.updateURL = urlSet(oCell.updateURL,oInputCtl.getBoundName(),oInputCtl.getBoundValue());	
  }
}

function cellOnKeyUp(e) {
  var oldValue = getCellValue(currentCell);
  var newValue = oInputCtl.getValue();
  if ( oldValue != newValue ) {  
    setCellState(currentCell,'dirty');
  }
  if (oDiv.updateType=="onKeyUp") {
    cancelDelayedSave();
    keyUpTimer = setTimeout(delayedSave,750);
  }
  if ( oDiv.onKeyUp ) {
    oDiv.onKeyUp(currentCell);
  }
}

function delayedSave() {
  if (typeof(currentCell) != "undefined" && currentCell.cellState == 'dirty') {
    save(currentCell);
  }
}

function cancelDelayedSave() {
  if ( typeof(keyUpTimer) != "undefined" ) {
    clearTimeout(keyUpTimer);
  }
  keyUpTimer=undefined;
 }

function cellOnCut(e) {
  setCellState(currentCell,'dirty');
}

function cellOnPaste(e) {
  setCellState(currentCell,'dirty');
}

function cellOnKeyDown(e) {
  if (e.altKey) {
    return true;
  }
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

function sameRow(a,b) {
  var aTop=getPixelTop(a);
  var bTop=getPixelTop(b);
  var aHeight=a.offsetHeight;
  var bHeight=b.offsetHeight;
  if (aTop<=(bTop+bHeight) && (aTop+aHeight)>=bTop) {
    return true;
  } else {
    return false;
  }
}

function belowRow(a,b) {
  // is b below row a
  var aTop=getPixelTop(a);
  var bTop=getPixelTop(b);
  var aHeight=a.offsetHeight;
  var bHeight=b.offsetHeight;
  if (bTop>(aTop+aHeight)) {
    return true;
  } else {
    return false;
  }
}

function aboveRow(a,b) {
  // is b above row a
  var aTop=getPixelTop(a);
  var bTop=getPixelTop(b);
  var aHeight=a.offsetHeight;
  var bHeight=b.offsetHeight;
  if ((bTop+bHeight)<aTop) {
    return true;
  } else {
    return false;
  }
}

function sameColumn(a,b) {
  var aLeft=getPixelLeft(a);
  var bLeft=getPixelLeft(b);
  var aWidth=a.offsetWidth;
  var bWidth=b.offsetWidth;
  if (aLeft<=(bLeft+bWidth) && (aLeft+aWidth)>=bLeft) {
    return true;
  } else {
    return false;
  }
}

function leftOfColumn(a,b) {
  // is b left of column a
  var aLeft=getPixelLeft(a);
  var bLeft=getPixelLeft(b);
  var aWidth=a.offsetWidth;
  var bWidth=b.offsetWidth;
  if ((bLeft+bWidth)<aLeft) {
    return true;
  } else {
    return false;
  }
}

function rightOfColumn(a,b) {
  // is b right of column a
  var aLeft=getPixelLeft(a);
  var bLeft=getPixelLeft(b);
  var aWidth=a.offsetWidth;
  var bWidth=b.offsetWidth;
  if ((aLeft+aWidth)<bLeft) {
    return true;
  } else {
    return false;
  }
}

function moveRight(fromCell) {
  var nextCell=undefined;
  var currentCellLeft = getPixelLeft(currentCell);
  for(var i=0;i<cells.length;i++) {
    var oCell = cells[i];
    var cellLeft = getPixelLeft(oCell);
    if ( sameRow(oCell,currentCell) && cellLeft>currentCellLeft && (typeof(nextCell)=="undefined" || cellLeft<nextCellLeft)) {
      nextCell = oCell;
      var nextCellLeft =getPixelLeft(nextCell);
    } 
  }
  if ( typeof(nextCell)=="undefined" ) {
    for(var i=0;i<cells.length;i++) {
      var oCell = cells[i];
      var cellLeft = getPixelLeft(oCell);
      if ( belowRow(currentCell,oCell) && (typeof(nextCell)=="undefined" || aboveRow(nextCell,oCell) || (sameRow(oCell,nextCell) && cellLeft<nextCellLeft))) {
	nextCell = oCell;
	var nextCellLeft =getPixelLeft(nextCell);
      } 
    }
  }
  if ( typeof(nextCell)=="undefined" ) {
    return fromCell;
  } else {
    return nextCell;
  }
}

function moveLeft(fromCell) {
  var nextCell=undefined;
  var currentCellLeft = getPixelLeft(currentCell);
  for(var i=0;i<cells.length;i++) {
    var oCell = cells[i];
    var cellLeft = getPixelLeft(oCell);
    if ( sameRow(oCell,currentCell) && cellLeft<currentCellLeft && (typeof(nextCell)=="undefined" || cellLeft>nextCellLeft)) {
      nextCell = oCell;
      var nextCellLeft =getPixelLeft(nextCell);
    } 
  }
  if ( typeof(nextCell)=="undefined" ) {
    for(var i=0;i<cells.length;i++) {
      var oCell = cells[i];
      var cellLeft = getPixelLeft(oCell);
      if (  aboveRow(currentCell,oCell) && (typeof(nextCell)=="undefined" || belowRow(nextCell,oCell) || (sameRow(oCell,nextCell) && cellLeft>nextCellLeft))) {
	nextCell = oCell;
	var nextCellLeft =getPixelLeft(nextCell);
      } 
    }
  }
  if ( typeof(nextCell)=="undefined" ) {
    return fromCell;
  } else {
    return nextCell;
  }
}
 
function moveUp(fromCell) {
  var nextCell=undefined;
  var currentCellTop = getPixelTop(currentCell);
  for(var i=0;i<cells.length;i++) {
    var oCell = cells[i];
    var cellTop = getPixelTop(oCell);
    if ( sameColumn(currentCell,oCell) && cellTop<currentCellTop && (typeof(nextCell)=="undefined" || cellTop>nextCellTop)) {
      nextCell = oCell;
      var nextCellTop =getPixelTop(nextCell);
    } 
  }
  if ( typeof(nextCell)=="undefined" ) {
    for(var i=0;i<cells.length;i++) {
      var oCell = cells[i];
      var cellTop = getPixelTop(oCell);
      if ( leftOfColumn(currentCell,oCell) && (typeof(nextCell)=="undefined" || rightOfColumn(nextCell,oCell) || (sameColumn(oCell,nextCell) && cellTop>nextCellTop))) {
	nextCell = oCell;
	var nextCellTop =getPixelTop(nextCell);
      } 
    }
  }
  if ( typeof(nextCell)=="undefined" ) {
    return fromCell;
  } else {
    return nextCell;
  }
}

function moveDown(fromCell) {
   var nextCell=undefined;
   var currentCellTop = getPixelTop(currentCell);
   for(var i=0;i<cells.length;i++) {
     var oCell = cells[i];
     var cellTop = getPixelTop(oCell);
     if ( sameColumn(currentCell,oCell) && cellTop>currentCellTop && (typeof(nextCell)=="undefined" || cellTop<nextCellTop)) {
       nextCell = oCell;
       var nextCellTop =getPixelTop(nextCell);
     } 
   }
   if ( typeof(nextCell)=="undefined" ) {
     for(var i=0;i<cells.length;i++) {
       var oCell = cells[i];
       var cellTop = getPixelTop(oCell);
       if ( rightOfColumn(currentCell,oCell) && (typeof(nextCell)=="undefined" || leftOfColumn(nextCell,oCell) || (sameColumn(oCell,nextCell) && cellTop<nextCellTop))) {
	 nextCell = oCell;
	 var nextCellTop =getPixelTop(nextCell);
       } 
     }
   }
   if ( typeof(nextCell)=="undefined" ) {
     return fromCell;
   } else {
     return nextCell;
   }
}

function isCellEditable(oCell) {
  if ( typeof(oCell.cellState)=="undefined" ) {
    setCellState(oCell,'current');
  }
  if ( oCell.cellState == 'updating' ) {
    return false;
  } else { 
    return true;
  }
}

function isTabStop(oCell) {
  return true;
}

function getCellValue(oCell) {
  if (  oCell.type == 'html' || oCell.type == 'htmlarea' || oCell.type == 'FCKeditor' ) {
    return oCell.innerHTML;
  } else {
    return unescapeHTML(oCell.innerHTML);
  }
}
 
function setCellValue(oCell,value) {
  if (  oCell.type == 'html' || oCell.type == 'htmlarea' || oCell.type == 'FCKeditor' ) {
    return oCell.innerHTML=value;
  } else {
    return oCell.innerHTML=escapeHTML(value);
  }
}
//
// ROW
//

function setCellState(oCell,newState) {
  var oldState = oCell.cellState;
  if ( newState == 'dirty' ) {
    
  }
  if ( newState == 'updating' ) {
    oCell.style.backgroundColor = 'yellow';
  }
  if ( newState == 'current' ) {
    oCell.style.backgroundColor = '';
  }
  if ( newState == 'error' ) {
    oCell.style.backgroundColor = 'tomato';
  }
  oCell.cellState = newState;
}

function cellAction(oCell,type,url,handler,async) {
  if ( typeof(handler) == "undefined" ) {
    handler = cellActionReturn;
  }
  if (typeof(async) == "undefined") {
    async = true;
  }
  
  if ( type=='update' ) {
    setCellState(oCell,'updating');
  }
  if (typeof(currentCell) != "undefined") {
    cellWrite();
  }

  var name = oCell.name;
  var value = getCellValue(oCell);
  var data =  encodeURIComponent(name) + "=" + encodeURIComponent(value);
  // Check if there are url encoded variables in the url
  var re = /([^\?]+)\??(.*)/;
  re.exec(url);
  var path = RegExp.$1;
  var queryString = RegExp.$2;
  if ( queryString != "" ) {
    data = data + '&' + queryString;
  } 
  httpPost(url,data,handler,cellActionReturnError,async,type,oCell);
}
 
function cellActionReturn(xmlhttp,type,oCell) {
  var xmlDoc = xmlhttp.responseXML;
  
  if ( type =='update') {
    setCellState(oCell,'current');
  }

  var oNode = xmlDoc.selectSingleNode('records/record/'+ oCell.name);
  if ( oNode ) {
    setCellValue(oCell,oNode.text);
  }

  // calculated
  xmlToChildIDs(xmlDoc,'records/calculated',oDiv);
  // html
  xmlToChildIDs(xmlDoc,'records/html',oDiv.document);

  // Info
  var rec = xmlDoc.selectSingleNode('records/info');
  if ( rec ) {setStatus(rec.text);}
  // Alert
  var rec = xmlDoc.selectSingleNode('records/alert');
  if ( rec ) {alert(rec.text);}
  // Custom Event handler
  if ( typeof(oDiv.onCellActionReturn) != "undefined" ) {
    var action = new Object();
    action.type=type;
    action.elmt=oCell;
    action.xml=xmlDoc
    oDiv.onCellActionReturn(action);
  }
}
 
function cellActionReturnError(errorMessage,errorType,actionType,oCell) {
   setCellState(oCell,'error');
   setStatus(errorMessage);
   if ( errorType != 'USER' ) {
     alert(errorMessage);
   }
}
 
 // Status Message
function setStatus(msg) {
   window.status = msg;
}

// end scope

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


/* ==== dbFormCombo.js ==== */
function dbFormCombo(oInput) {

// parameters
var searchURL = oInput.searchURL;
var boundName = oInput.boundName;
var searchLimit = oInput.searchLimit;
var comboWidth = oInput.comboWidth;
var comboHeight = oInput.ComboHeight;
if (searchLimit == undefined) { searchLimit = 10};
if (comboHeight == undefined) { comboHeight = 200};

// vars
var oDiv; // The dropdown container
var xmlDoc;
var currentItem; // The highlighted row selected
var lastValue;

// Init
// Attach to text input
oDiv = document.createElement('DIV');
oDiv.style.position='absolute';
if ( comboWidth == undefined ) {
	 oDiv.style.width = oInput.offsetWidth;
} else {
	oDiv.style.width = comboWidth;
}
oDiv.style.height = comboHeight;
oDiv.style.overflow = 'auto';
oDiv.style.pixelTop = getPixelTop(oInput) + oInput.offsetHeight;
oDiv.style.pixelLeft = getPixelLeft(oInput);
oDiv.style.border="1px solid black";
oDiv.style.background = 'white';
oDiv.style.visibility='hidden';
oDiv.style.display='none';
oInput.document.body.appendChild(oDiv);
lastValue = oInput.value;

oInput.attachEvent('onkeydown',onKeyDown);
oInput.attachEvent('onkeyup',onKeyUp);
oInput.attachEvent('onblur',onBlur);

function show() {
	oDiv.style.display='block';
	oDiv.style.visibility='visible';
	hideElements('SELECT');
}
function hide() {
	oDiv.style.visibility='hidden';
	showElements('SELECT');
}

function onKeyDown() {
	var e = window.event;
	out: {
		if ( currentItem == undefined ) {
			break out;
		} 
		if (e.keyCode == 38) {
			// Up Arrow
			var idx = getNodeIndex(currentItem);
			if ( idx !=0 ) {
				highlight(idx-1);
			}
			break out;
		}
		if (e.keyCode == 40) {
			// Down Arrow
			var idx = getNodeIndex(currentItem);
			if ( idx != oDiv.children.length -1  ) {
				highlight(idx+1);
			}
			break out;
		}
		if (e.keyCode == 13 ) {
			// Return
			var idx = getNodeIndex(currentItem);
			select(idx);
			e.cancelBubble = true;
			e.returnValue = false;
			break out;
		}
		if (e.keyCode == 9 ) {
			// TAB
			var idx = getNodeIndex(currentItem);
			select(idx);
			break out;
		}
	}
}
function onKeyUp() {
	if ( oInput.value != lastValue ) {
		lastValue = oInput.value;
		search();
	}
}
function onBlur() {
	var elmt = oInput.document.activeElement;
	if ( elmt!=oDiv && ! oDiv.contains(elmt)  ) {
		hide();
		currentItem = undefined;
	}
}

function divOnClick() {
	var elmt = window.event.srcElement;
	if (elmt != oDiv ) {
		var idx = getNodeIndex(elmt);
		select(idx);
	}
}
function divOnMouseOver() {
	var elmt = window.event.srcElement;
	if (elmt != oDiv ) {
		var idx = getNodeIndex(elmt);
		highlight(idx);
	}
}

function select(idx) {
	var form = oInput.form;
	var recs = xmlDoc.selectSingleNode('records');
	var xmlSelected = recs.childNodes[idx];
	var column = xmlSelected.selectSingleNode(boundName);
	form.elements[boundName].value = xmlSelected.selectSingleNode(boundName).text;
	oInput.value = xmlSelected.selectSingleNode(oInput.name).text;
	lastValue = oInput.value;
	hide();
	currentItem = undefined;
	// Move cursor to end of Input
	var rng = oInput.createTextRange();
	rng.collapse(false);
	rng.select();
	
	// Event Handler
	if ( oInput.onSelect != undefined ) {
		oInput.onSelect();
	}
}

function highlight(idx) {
	currentItem.runtimeStyle.background = '';
	currentItem.runtimeStyle.color = '';
	currentItem = oDiv.children[idx];
	currentItem.runtimeStyle.background = 'highlight';
	currentItem.runtimeStyle.color = 'highlighttext';
}

function search() {
	currentItem = undefined;
	oDiv.innerText = "Searching ..."
	show();
	oDiv.detachEvent('onclick',divOnClick);
	oDiv.detachEvent('onmouseover',divOnMouseOver);
	url = searchURL;
	url = urlSet(url,'name',oInput.name);
	url = urlSet(url,'value',oInput.value);
	url = urlSet(url,'searchLimit',searchLimit);
	url = urlSet(url,'boundName',boundName);
	xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.onreadystatechange = searchReturn;
	xmlDoc.load(url);
}
function searchReturn() {
	if (xmlDoc.readyState == 4) {
		// ERROR
		var xmlError = xmlDoc.parseError;
		if (xmlError.errorCode != 0) {
			error = "Software Bug ! " + xmlError.reason;
			oDiv.innerText = error;
		} else {
			var rec = xmlDoc.selectSingleNode('error');
			if ( rec ) {
				error=rec.text;
				oDiv.innerText = error;
			} else {
				var recs = xmlDoc.selectNodes('records/record');
				if ( recs.length > 0 ) {
					updateList(recs);
				} else {
					// No Matches
					oDiv.innerText = "No Matches";
					oInput.form.elements[boundName].value = "";
				}
			}
		}
	}
}

function updateList(recs) {
	oDiv.innerHTML = '';
	oDiv.attachEvent('onclick',divOnClick);
	oDiv.attachEvent('onmouseover',divOnMouseOver);
	for(var i=0;i<recs.length;i++) {
		var rec = recs[i];
		for(var j=0;j<rec.childNodes.length;j++) {
			var field = rec.childNodes[j];
			var name= field.nodeName;
			var value = field.text;
			if (name == oInput.name ) {
				var oItem = oInput.document.createElement('DIV');
				oItem.style.width = "100%";
				oItem.style.cursor = 'pointer';
				oItem.innerText = value;
				oDiv.appendChild(oItem);
			}
		}
	}
	if ( oDiv.children.length >= searchLimit ) {
		oDiv.insertAdjacentText('beforeEnd','.....');
	}
	currentItem = oDiv.children[0];
	highlight(0);
}

function hideElements(tagName) {
	var elmts = document.body.getElementsByTagName(tagName);
	for(var i=0;i<elmts.length;i++) {
		elmts[i].style.visibility = "hidden";
	}
}

function showElements(tagName) {
	var elmts = document.body.getElementsByTagName(tagName);
	for(var i=0;i<elmts.length;i++) {
		elmts[i].style.visibility = "";
	}
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
  container.append(HTMLArea);

  // Properties
  dbGridHTMLArea.callback = callback;
  dbGridHTMLArea.HTMLArea = HTMLArea;

  // Events
  HTMLArea.on('keyup.dbGridHTMLArea', function(e) {
    dbGridHTMLArea.inputOnKeyUp(e)    
  });
  HTMLArea.on('keydown.dbGridHTMLArea', function(e) {
    dbGridHTMLArea.inputOnKeyDown(e)
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
    'background-color':'white'
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


/* ==== dbGridNewPaged.js ==== */

function dbGridNewPaged(oTable) {

//
var oColGroup;
var oTable;
var oDivScroll;
//
var colNames = new Array();
var pageSize=30;
var recSize = 603;
var rowHeight = 20;

var pageLock = false;
var savedScrollTop=0;
var inScroll = false;

//
// Methods
oTable.page = page;
// Init
init();
//
// TABLE //
//
function init() {
	oColGroup =oTable.children[0];
	for(var i=0;i<oColGroup.children.length;i++) {
		var oCol = oColGroup.children[i];
		colNames[i] = oCol.name;
	}
	oDivScroll = oTable.parentElement;
	oDivScroll.attachEvent('onscroll',onScroll);
	//window.setInterval(onScroll,100);
	
	page(0);
}
function onScroll() {
	if (oDivScroll.scrollTop != savedScrollTop) {
		savedScrollTop = oDivScroll.scrollTop;
		inScroll=true;	
	} else {
		if ( inScroll ) {
			// scrollEnd
			inScroll = false;
			var top = Math.floor(oDivScroll.scrollTop/rowHeight);
			page(top);
		}
	}
}

function page(offset) {
	if ( pageLock == true ) {
		return true;
	}
	var url = oTable.dataURL;
	url = urlSet(url,'offset',offset);
	url = urlSet(url,'limit',pageSize);
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = true;
	xmlDoc.onreadystatechange = function() {
		if (xmlDoc.readyState == 4) pageReturn(xmlDoc,offset);
	}
	xmlDoc.load(url);
	pageLock = true;
}

function pageReturn(xmlDoc,offset) {	
	var records = xmlDoc.selectNodes('records/record');
	var oTBody = oTable.tBodies[0];
	//var oTBody = document.createElement("tbody");
	//oTable.replaceChild(oTBody, oTable.tBodies[0]);
	//oTable.tBodies[0].replaceNode(oTBody);
	while ( oTBody.rows.length > 0 ) {
		oTBody.deleteRow(0);
	}
	
	var oNode;
	for(var i=0;i<records.length;i++) {
		var oTR = document.createElement("tr");
		oTBody.appendChild(oTR);
		for (var j=0;j<colNames.length;j++) {
			var oTD = document.createElement("td");
			oTR.appendChild(oTD);
			if ( oNode = records[i].selectSingleNode(colNames[j]) )
			var oTxtNode = document.createTextNode(oNode.text);
			oTD.appendChild(oTxtNode);
		}
	}
	
	marginTop = rowHeight*(offset);
	marginBottom = rowHeight*(recSize - offset - records.length);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
	pageLock = false;
}
// end scope
}


/* ==== dbGridPaged.js ==== */

function dbGridPaged(oTable) {
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
var pageSize=25;
var recSize = 603;
var rowHeight = 20;
var marginTop;
var marginBottom;
var pageLock = false;
var savedScrollTop=0;
var inScroll = false;
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
		window.setInterval(onScroll,200);
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
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = false;
	var action = new Object;
	action.type = 'requery';
	action.xml = xmlDoc;
	xmlDoc.onreadystatechange = function() {
		if (xmlDoc.readyState == 4) requeryReturn(action);
    }
	xmlDoc.load(url);
}	

function requeryReturn(action) {
	var xmlDoc = action.xml;
	// ERROR
	var xmlError = xmlDoc.parseError;
	if (xmlError.errorCode != 0) {
		setStatus("Error! " + xmlError.reason);
		return false;
	}
	var rec = xmlDoc.selectSingleNode('error');
	if ( rec ) {
		setStatus(rec.text);
		return false;
	}
	var records = xmlDoc.selectNodes('records/record');
	for(var i=0;i<records.length;i++) {
		var oTR = createBlankRow(oTBody.rows.length);
		displayRow(oTR,records[i]);
	}
	// calculated
	xmlToChildIDs(xmlDoc,'records/calculated',oTable);
	// html
	xmlToChildIDs(xmlDoc,'records/html',oTable.document);
	// Info
	xmlToID(xmlDoc,'records/info',oDivStatus);
	if ( oTable.enabled == "true" ) {
		init2()
	}
}
function pageUp() {
	var url = oTable.dataURL;
	url = urlSet(url,'offset',recOffsetTop-pageSize);
	url = urlSet(url,'limit',pageSize);
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = false;
	xmlDoc.onreadystatechange = function() {
		if (xmlDoc.readyState == 4) pageUpReturn(xmlDoc);
    }
	xmlDoc.load(url);
}

function pageUpReturn(xmlDoc) {
	var records = xmlDoc.selectNodes('records/record');
	for(var i=records.length-1;i>=0;i--) {
		var oTR = createBlankRow(0);
		displayRow(oTR,records[i]);
		if ( currentCell && oTBody.rows[oTBody.rows.length-1].contains(currentCell) ) {
			// Move Up
			cellChange(moveUp(currentCell));
		}
		oTBody.deleteRow(oTBody.rows.length-1);
	}
	recOffsetTop = recOffsetTop - records.length;
	recOffsetBottom = recOffsetBottom - records.length;
	marginTop -= rowHeight*(records.length);
	marginBottom += rowHeight*(records.length);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}

function pageDown() {
	if ( pageLock == true ) {
		return true;
	}
	var url = oTable.dataURL;
	url = urlSet(url,'offset',recOffsetBottom+1);
	url = urlSet(url,'limit',pageSize);
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = true;
	xmlDoc.onreadystatechange = function() {
		if (xmlDoc.readyState == 4) pageDownReturn(xmlDoc);
    }
	xmlDoc.load(url);
	pageLock = true;
}

function pageDownReturn(xmlDoc) {
	var records = xmlDoc.selectNodes('records/record');
	for(var i=0;i<records.length;i++) {
		var oTR = createBlankRow(oTBody.rows.length);
		displayRow(oTR,records[i]);
		if ( currentCell && oTBody.rows[0].contains(currentCell) ) {
			cellOut(currentCell);
		}
		oTBody.deleteRow(0);
	}
	recOffsetTop = recOffsetTop + records.length;
	recOffsetBottom = recOffsetBottom + records.length;
	marginTop += rowHeight*(records.length);
	marginBottom -= rowHeight*(records.length);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}
function pageNewReturn(xmlDoc,top,bot) {
	if (currentCell) {
		cellOut(currentCell);
	}
	// Delete all rows
		while ( oTBody.rows.length > 0 ) {
		oTBody.deleteRow(0);
	}
	var records = xmlDoc.selectNodes('records/record');
	for(var i=0;i<records.length;i++) {
		var oTR = createBlankRow(oTBody.rows.length);
		displayRow(oTR,records[i]);
	}
	recOffsetTop = top
	recOffsetBottom = top + records.length;
	marginTop = rowHeight*(recOffsetTop);
	marginBottom = rowHeight*(recSize -1 - recOffsetBottom);
	oTable.style.marginTop = marginTop;
	oTable.style.marginBottom = marginBottom;
}
function page(newTop,newBot) {
	if ( pageLock == true ) {
		return true;
	}
	var top = new Number();
	var bot = new Number();
	var oldTop = recOffsetTop;
	var oldBot = recOffsetBottom;
	if (newTop >= oldTop && newTop <= oldBot) {
		top = oldBot + 1;
	} else {	
		top = newTop;
	}
	if (newBot >= oldTop && newBot <= oldBot) {
		bot = oldTop - 1;
	} else {
		bot = newBot;
	}
	if (top <0) { top = 0; }
	if (bot > recSize-1 ) { bot = recSize-1; }
	if ( bot - top >= 0 ) {
		var url = oTable.dataURL;
		url = urlSet(url,'offset',top);
		url = urlSet(url,'limit',bot-top+1);
		var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
		xmlDoc.async = true;
		xmlDoc.onreadystatechange = function() {
			if (xmlDoc.readyState == 4) pageReturn(xmlDoc,top,bot);
		}
		xmlDoc.load(url);
		pageLock = true;
	}
}

function pageReturn(xmlDoc,top,bot) {
	out: {
		if ( bot == (recOffsetTop - 1)) {
			pageUpReturn(xmlDoc);
			break out;
		}
		if (top == (recOffsetBottom + 1)) {
			pageDownReturn(xmlDoc);
			break out;
		}
		pageNewReturn(xmlDoc,top,bot);
	}
	pageLock = false;
}
function pageTo() {
	var oDiv = oTable.parentElement;
	var recTop = Math.floor(oDiv.scrollTop/rowHeight);
	page(recTop-5,recTop-5+pageSize);
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


/* ==== jquery.colInherit.js ==== */
(function($) {
    $.fn.colInherit = function(options) {
	var settings = jQuery.extend({
	    customAttributes: []
	}, options);

	$(this).filter('table').each(function(){
	    var table = $(this);

	    table.find('col').each(function() {
		var col = $(this);

		var colIndex = col.index();
		var tds = table.find('td, th').filter(':nth-child(' + (colIndex + 1) + ')');

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
	    this.input.val( $(record).find('[name="'+this.input.attr('name')+'"]').text() );
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
	if ( event.target != this.div ) {
	    this.select($(event.target).index());
	}
    }
    function divOnMouseOver(event) {
	if ( event.target != this.div ) {
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
    var dbGridHTMLArea;
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
	  var editorHeight = parseInt(col.attr('editorHeight'));
	dbGridInputCtl = dbGridTextArea;
	dbGridInputCtl.show(cell,cellValue,editorHeight);
      }
      if ( colType == 'htmlarea') {
	  var editorHeight = parseInt(col.attr('editorHeight'));
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
		      .click(table.data('dbGrid').save)
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

/* ==== jquery.textrange.js ==== */
/**
 * jquery-textrange
 * A jQuery plugin for getting, setting and replacing the selected text in input fields and textareas.
 *
 * (c) 2012 Daniel Imhoff <dwieeb@gmail.com> - danielimhoff.com
 */
(function($) {

  var textrange = {
    get: function(property) {
      return _textrange.get.apply(this, [property]);
    },

    set: function(selectionStart, selectionEnd) {
      var text = this.val();
      if ( ! text ) {
	var text = this.text();
      }

      if(selectionStart === 'all') {
        selectionStart = 0;
        selectionEnd = text.length;
      } 
      else if(selectionStart === 'start') {
        selectionStart = 0;
  	selectionEnd = 0;
      }
      else if(selectionStart === 'end') {
        selectionStart = text.length;
  	selectionEnd = text.length;
      }

      if(typeof selectionStart === 'undefined') {
        selectionStart = 0;
      } 
      if(typeof selectionEnd === 'undefined') {
        selectionEnd = selectionStart;
      }       

      _textrange.set.apply(this, [selectionStart, selectionEnd]);

      return this;
    }
  };

  var _textrange = {
    get: function(property) {

      var text = this.val();
      if ( ! text ) {
	var text = this.text();
      }

      var textNode = jQuery([]);
      if ( window.getSelection ) {
	contents = this.closest();
	while ( contents.size() ) {
	  FirstNode = contents.get(0)
	  if ( firstNode[0].nodeType == 3 ) {
	    textNode = firstNode;
	  }
	  contents = firstNode.contents();
	}
      }

      if ( this[0].selectionStart != undefined ) { 
        var selectionStart = this[0].selectionStart;
        var selectionEnd = this[0].selectionEnd;
        var selectionLength = this[0].selectionEnd - this[0].selectionStart;
        var selectionText = text.substring(this[0].selectionStart, this[0].selectionEnd);
	if ( selectionStart == 0 ) {
	  var selectionAtStart = true
	} else {
	  var selectionAtStart = false
	}
	if ( selectionEnd == text.length ) {
	  var selectionAtEnd = true
	} else {
	  var selectionAtEnd = false
	}

      } else if ( window.getSelection && window.getSelection.rangeCount > 0 ) { 
	var selection = window.getSelection();
	var selectedRange = selection.getRangeAt(0);

	var elmtRange = document.createRange();   
        // aligns the selectedRange to selectionStart and selectionEnd points
        elmtRange.setStart(textNode[0], selectionStart);
        elmtRange.setEnd(textNode[0], selectionEnd);	   

	if ( selectedRange.compareEndPoints('StartToStart',ElmtRange) == 0 ) {
	  var selectionAtStart = true
	} else {
	  var selectionAtStart = false
	}
	if ( selectedRange.compareEndPoints('EndtoEnd',ElmtRange) == 0 ) {
	  var selectionAtEnd = true
	} else {
	  var selectionAtEnd = false
	}

	var selectionStart = selectedRange.startOffset;
	var selectionEnd = selectionStart + selectedRange.toString().length;
	var selectionLength = selectedRange.toString().length;
	var selectionText = selectedRange.toString();

      } else if ( document.selection && document.selection.createRange ) {
	var selectedRange = document.selection.createRange();
	if ( this[0].createTextRange ) {
	  var elmtRange = this[0].createTextRange(); 
	} else {
	  var elmtRange = document.body.createTextRange(); 
	  elmtRange.moveToElementText(this[0]);
	}

	if ( selectedRange.compareEndPoints('StartToStart',elmtRange) == 0 ) {
	  var selectionAtStart = true
	} else {
	  var selectionAtStart = false
	}
	if ( selectedRange.compareEndPoints('EndtoEnd',elmtRange) == 0 ) {
	  var selectionAtEnd = true
	} else {
	  var selectionAtEnd = false
	}

	elmtRangeCopy = elmtRange.duplicate();
	elmtRange.moveToBookmark(selectedRange.getBookmark());
	elmtRangeCopy.setEndPoint('EndToStart', elmtRange);

	var selectionStart = elmtRangeCopy.text.length;
	var selectionEnd = selectionStart + selectedRange.text.length;
	var selectionLength = selectedRange.text.length;
	var selectionText = selectedRange.text;
      } else {
	var selectionStart = 0;
	var selectionEnd = 0;
	var selectionLength = 0;
	var selectionText = '';
	var selectionAtStart = false
	var selectionAtEnd = false;
      }
      
      var props = {
        selectionStart: selectionStart,
        selectionEnd: selectionEnd,
        selectionLength: selectionLength,
        selectionText: selectionText,
	selectionAtStart: selectionAtStart,
	selectionAtEnd: selectionAtEnd,
	text: text
      };

      return typeof property === 'undefined' ? props : props[property];
    },

    set: function(selectionStart, selectionEnd) {
      this.focus();

      var textNode = jQuery([]);
      if ( window.getSelection ) {
	contents = this.closest();
	while ( contents.size() ) {
	  FirstNode = contents.get(0)
	  if ( firstNode[0].nodeType == 3 ) {
	    textNode = firstNode;
	  }
	  contents = firstNode.contents();
	}
      }

      if ( this[0].selectionStart ) { 
	this[0].selectionStart = selectionStart;
        this[0].selectionEnd = selectionEnd;
      } else if ( window.getSelection && textNode.size() ) { 
        var selection = window.getSelection();
        var range = document.createRange();   
        // aligns the range to selectionStart and selectionEnd points
        range.setStart(textNode[0], selectionStart);
        range.setEnd(textNode[0], selectionEnd);	    
	selection.removeAllRanges();
        selection.addRange(range);
      } else if ( this[0].createTextRange ) { 
        var elmtRange = this[0].createTextRange(); 
	elmtRange.collapse(true); 
        elmtRange.moveStart('character', selectionStart); 
        elmtRange.moveEnd('character', selectionEnd-selectionStart); 
	elmtRange.select(); 
      } else if ( document.body.createTextRange ) { 
        var elmtRange = document.body.createTextRange(); 
	elmtRange.moveToElementText(this[0]);
	elmtRange.collapse(true); 
        elmtRange.moveStart('character', selectionStart); 
        elmtRange.moveEnd('character', selectionEnd-selectionStart); 
	elmtRange.select(); 
      }
    }        
  };

  $.fn.textrange = function(method) {
    if(typeof method === 'undefined' || typeof method !== 'string') {
      return textrange.get.apply(this);
    }
    else if(typeof textrange[method] === 'function') {
      return textrange[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else {
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
	this.thead = jQuery('thead',this.table);
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
	this.table.find('tbody tr').not(':first-child').find('td').css('width', '');
	this.table.find('tbody tr:first-child').find('th, td').each(function(index, element){
	    var width = parseInt($(element).innerWidth());
	    if ( this.table.css('border-collapse') == 'collapse' ) {
		width += parseInt($(element).css('border-left-width'));
	    }
	    var th = this.thead.find('tr:first-child').find('th, td').eq(index);
	    th.css('width', width - parseInt(th.css('padding-left')) - parseInt(th.css('padding-right')));
	    $(element).css('width', width - parseInt($(element).css('padding-left')) - parseInt($(element).css('padding-right')));
	}.bind(this));
	this.table.find('col, colgroup').css('width', '');

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
	this.thead.css({
	    'position': "absolute",
	    'bottom': "100%",
	    'left': this.errorX
	});
	if ( this.table.css('border-collapse') == 'collapse' ) {
	    this.table.find('tr:first-child td').css('border-top-width', 0);
	}

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


