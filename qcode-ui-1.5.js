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
      if ( jQuery(oDiv).hasClass('clsDbFormDivStatus') ) {
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

/* ==== dbGrid.js ==== */
function dbGrid(oTable) {
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

  // onCellOut passes OTD

  // vars
  var currentCell;
  var recCount;
  
  // Input Controls
  var oInputCtl;
  var oInput;
  var oCombo;
  var oTextArea;
  var oHTMLArea;
  var oFCKeditor;
  var oInputBool;
  //
  var oColGroup;
  var oTable;
  var oTBody;
  var oStatusTable;
  //
  var keyUpTimer;
  
  // Parameters
  if ( oTable.initialFocus == undefined ) { oTable.initialFocus = "true" }
  if ( oTable.enabled == undefined ) { oTable.enabled = "true" }
  if ( oTable.updateType == undefined ) { oTable.updateType = "rowOut" }
  //
  // Methods
  oTable.resize = resize;
  oTable.focus = focus;
  oTable.blur = blur;
  oTable.save = save;
  oTable.del = del;
  oTable.requery = requery;
  oTable.requery2 = requery2;
  oTable.rowAction = rowAction;
  oTable.rowRemove = rowRemove;
  oTable.setRowState = setRowState;
  oTable.find = find;
  oTable.getCellValue = getCellValue;
  oTable.setCellValue = setCellValue;
  oTable.isCellEditable = isCellEditable;
  oTable.setDirty = setDirty;
  oTable.setStatus = setStatus;

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
    // Parents Next Sibling should be the status Div containing a table
      if ( jQuery(oTable).hasClass('clsDbGrid') ) {
      oStatusTable = oTable.parentElement.nextSibling.firstChild;
    } else {
      oStatusTable = undefined;
    }
    
    recCount = oTBody.rows.length;
    if ( oTable.enabled == "true" ) {
      // Init input controls
      inputControlsInit();
      // Bind
      oTBody.attachEvent('onmouseup',cellOnMouseUp);
      window.attachEvent('onresize',onResize);
      window.attachEvent('onbeforeunload',onBeforeUnload);
      window.attachEvent('onbeforeprint',onBeforePrint);
    }
    if ( oTable.enabled == "true" ) {
      init2();
    }
  }
  
  function init2() {
    if ( oTable.addURL !=null) {
      createNewRow();
    }
    
  out: {
      if ( oTable.initialFocus == "end" ) {
	// last row
	var i=oTBody.rows.length-1;
	for (var j=0;j<oTBody.rows[i].cells.length;j++) {
	  var oTD = oTBody.rows[i].cells[j];
	  if ( isCellEditable(oTD) && isTabStop(oTD) ) {
	    currentCell = oTD;
	    cellIn(oTD);
	    var oTR = getContainingElmt(oTD,'TR');
	    rowIn(oTR);
	    break out;
	  }
	}
	//Could not find an editable cell on last row
      }
      // Focus on first editableCell
      if ( oTable.initialFocus == "true" ) {
	for (var i=0;i<oTBody.rows.length;i++) {
	  for (var j=0;j<oTBody.rows[i].cells.length;j++) {
	    var oTD = oTBody.rows[i].cells[j];
	    if ( isCellEditable(oTD) && isTabStop(oTD)) {
	      currentCell = oTD;
	      cellIn(oTD);
	      var oTR = getContainingElmt(oTD,'TR');
	      rowIn(oTR);
	      break out;
	    }
	  }
	}
      }
      //Could not find an editable cell
    } // end out
  }
  
  function focus() {
    if (currentCell != undefined) {
      cellIn(currentCell);
    }
  }
   
  function blur() {
      if (currentCell != undefined) {
	  cellOut(currentCell);
      }
  }
 
  function setDirty() {
    if (currentCell != undefined) {
      var oTR = getContainingElmt(currentCell,'TR');
      setRowState(oTR,'dirty');
    }
  }

function onBeforeUnload() {
	if (currentCell == undefined) {	
		return false;
	}
	
	var oTR = getContainingElmt(currentCell,'TR');
	cellOut(currentCell);
	rowOut(oTR);
	if ( oTR.rowState == 'dirty' ) {
		if (window.confirm('Do you want to save your changes?')) {
			save(oTR,false);
			if (oTR.rowState == 'error' ) {
				event.returnValue = "Your changes could not be saved.\nStay on the current page to correct.";
			}
		}
	}
}

function onBeforePrint() {
	if (currentCell != undefined) {
		cellOut(currentCell);
	}	
}

function onResize() {
  if (currentCell) {
    cellChange(currentCell);
  }
}

function resize(colIdx,width) {
  oColGroup.children[colIdx].runtimeStyle.width = width;
  onResize();
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
      // async false
      rowAction(oTR,'delete',oTable.deleteURL,rowActionReturn,false);
    }
  }
  if ( oTR.rowType == 'add' ) {
    if ( window.confirm("Delete the current row?") ) {
      rowRemove(oTR);
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
  if (e.type =='cut') {
    cellOnCut(e);
  }
  if (e.type =='paste') {
    cellOnPaste(e);
  }
  if (e.type =='blur') {
    var activeElmt=document.activeElement;
    if (!oTable.contains(activeElmt) && (oInputCtl && activeElmt!=oInputCtl) && currentCell) {
	var currentRow = getContainingElmt(currentCell,"TR");
	if ( oTable.updateType=="onCellOut" && currentRow.rowState == 'dirty') {
	  save(currentRow);
	}
    }
  }
}

function inputControlsInit() {
  var wantCombo= false;
  var wantTextArea = false;
  var wantHTMLArea = false;
  var wantFCKeditor = false;
  var wantBool = false;

  for(var i=0;i<oColGroup.children.length;i++) {
    var oCol = oColGroup.children[i];
    if ( oCol.type == 'combo' ) {
      wantCombo = true;
    }
    if ( oCol.type == 'textarea' ) {
      wantTextArea = true;
    }
    if ( oCol.type == 'htmlarea' ) {
      wantHTMLArea = true;
    }
    if ( oCol.type == 'FCKeditor' ) {
      wantFCKeditor = true;
    }
    if ( oCol.type == 'bool' ) {
      wantBool = true;
    }
  }
  // Container 
  // parentElement should be div.dbContainer
  var oDivContainer = oTable.parentElement;
  
  oInput = dbGridInput(inputControlCallback)
    oDivContainer.appendChild(oInput);
  
  if ( wantCombo ) {
    oCombo = dbGridCombo(inputControlCallback);
    oDivContainer.appendChild(oCombo);
  }
  if ( wantTextArea ) {
    oTextArea = dbGridTextArea(inputControlCallback);
    oDivContainer.appendChild(oTextArea);
  }
  if ( wantHTMLArea ) {
    oHTMLArea = dbGridHTMLArea(inputControlCallback);
    oDivContainer.appendChild(oHTMLArea);
  }
  if ( wantFCKeditor ) {
    oFCKeditor = dbGridFCKeditor(inputControlCallback,oDivContainer);
  }
  if ( wantBool ) {
    oInputBool = dbGridInputBool(inputControlCallback);
    oDivContainer.appendChild(oInputBool);
  }
}
 
//
// CELL
//

function cellChange(newCell) {
  var newRow = getContainingElmt(newCell,'TR');
  if (currentCell == undefined) {
    rowIn(newRow);
    cellIn(newCell);
  } else {
    var oldCell = currentCell;
    var oldRow = getContainingElmt(oldCell,'TR');
    
    // Row Change
    if ( newRow.sectionRowIndex != oldRow.sectionRowIndex ) {
      cellOut(oldCell);
      rowOut(oldRow);
      rowIn(newRow);
      cellIn(newCell);
    } else {
      cellOut(oldCell);
      cellIn(newCell);
    }
  }
}

function cellIn(oTD,select) {
  currentCell = oTD;
  // Hide the cell
  oTD.style.visibility='hidden';
  // Decide which inputControl to use
  var oCol = oColGroup.children[oTD.cellIndex];
  var type = oCol.type;
  var currentRow = getContainingElmt(oTD,'TR');
  var cellValue = getCellValue(currentRow,oCol.name);
  if (  type == undefined ) {
    type = 'text';
  }
  if ( type == 'text' ) {
    oInputCtl = oInput;
    oInputCtl.show(oTD,cellValue);
  }
  if ( type == 'textarea' ) {
    var editorHeight;
    if ( oCol.editorHeight != undefined ) {
      var editorHeight = oCol.editorHeight;
    }
    oInputCtl = oTextArea;
    oInputCtl.show(oTD,cellValue,editorHeight);
  }
  if ( type == 'htmlarea') {
    var editorHeight;
    if ( oCol.editorHeight != undefined ) {
      var editorHeight = oCol.editorHeight;
    }
    oInputCtl = oHTMLArea;
    oInputCtl.show(oTD,cellValue,editorHeight);
  }
  if ( type == 'FCKeditor' ) {
    var editorHeight;
    if ( oCol.editorHeight != undefined ) {
      var editorHeight = oCol.editorHeight;
    }
    oInputCtl = oFCKeditor;
    oInputCtl.show(oTD,cellValue,editorHeight);
  }
  if ( type == 'combo' ) {
    oInputCtl = oCombo;
    var searchURL = oCol.searchURL;
    oInputCtl.show(oTD,cellValue,searchURL);
  }
  if ( type == 'bool') {
    oInputCtl = oInputBool;
    oInputCtl.show(oTD,cellValue);
  }

  if (select) {
    oInputCtl.selectText(select);
  } else {
    if ( oCol.getAttribute('cellInSelect') !=null ) {
      oInputCtl.selectText(oCol.getAttribute('cellInSelect'));
    } else {
      oInputCtl.selectText('all');
    }
  }
}
 
function cellOut(oTD) {
   var oTR = getContainingElmt(oTD,'TR');
   var oldValue = getCellValue(oTR,oColGroup.children[oTD.cellIndex].getAttribute('name'));
   var newValue = oInputCtl.getValue();
   
   if ( oldValue != newValue ) {	
     // Work around for combo
     setRowState(oTR,'dirty');
   }
   cellWrite();
   // Show the cell
   oTD.style.visibility='inherit';
   // Hide the input control
   oInputCtl.hide();
   // Cleanup
   currentCell = undefined;
   oInputCtl = undefined;
   // Is there an action for this column
   var cellIdx = oTD.cellIndex;
   if ( oTR.rowState=='dirty' && oColGroup.children[cellIdx].action ) {
     var actionURL = oColGroup.children[cellIdx].action;
     // async false
     rowAction(oTR,'custom',actionURL,rowActionReturn,false);
   }
   // If updateType is onKeyUp then 
   // cancel any delayed save and save now 
   if ( oTable.updateType=="onKeyUp" ) {
     cancelDelayedSave();
     if (oTR.rowState == 'dirty') {
       save(oTR);
     }
   }
   if ( oTable.updateType=="onCellOut" && oTR.rowState == 'dirty') {
       save(oTR);
   }

   if ( oTable.onCellOut ) {
     oTable.onCellOut(oTD);
   }
}

function cellOnMouseUp() {
  var oNode = window.event.srcElement;
  while (oNode.tagName!='TD' && oNode.parentNode) {
    oNode = oNode.parentNode;
  }
  if (oNode.tagName == 'TD') {
	if ( isCellEditable(oNode) ) {
	    cellChange(oNode);
	}
  } else {
    return false;
  }
}

function cellWrite() {
  // Write the contents of the input to the current cell
  var currentRow = getContainingElmt(currentCell,"TR");
  var name = oColGroup.children[currentCell.cellIndex].name;
  setCellValue(currentRow,name,oInputCtl.getValue());
}

function cellOnKeyUp(e) {
  var currentRow = getContainingElmt(currentCell,'TR');
  var name = oColGroup.children[currentCell.cellIndex].name;
  var oldValue = getCellValue(currentRow,name);
  var newValue = oInputCtl.getValue();
  if ( oldValue != newValue ) {  
    setRowState(currentRow,'dirty');
  }
  if (oTable.updateType=="onKeyUp") {
    cancelDelayedSave();
    keyUpTimer = setTimeout(delayedSave,750);
  }
  if ( oTable.onKeyUp ) {
    oTable.onKeyUp(currentCell);
  }
}

function delayedSave() {
   if (currentCell != undefined) {
     var currentRow = getContainingElmt(currentCell,'TR');
     if (currentRow.rowState == 'dirty') {
       save(currentRow);
     }
   }
 }

function cancelDelayedSave() {
  if ( keyUpTimer != undefined ) {
    clearTimeout(keyUpTimer);
  }
  keyUpTimer=undefined;
 }

function cellOnCut(e) {
  var currentRow = getContainingElmt(currentCell,'TR');
  setRowState(currentRow,'dirty');
}

function cellOnPaste(e) {
  var currentRow = getContainingElmt(currentCell,'TR');
  setRowState(currentRow,'dirty');
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
  if ( e.preventDefault ) {
      e.preventDefault();
  }
  if ( e.stopPropagation ) {
      e.stopPropagation();
  }
}

function moveRight(fromCell) {
	var oTBody = getContainingElmt(fromCell,"TBODY");
	var oRow = getContainingElmt(fromCell,"TR");
	var rows = oTBody.rows.length - 1;
	var cells = oRow.cells.length - 1;
	var rowIdx = oRow.sectionRowIndex;
	var cellIdx = fromCell.cellIndex;
	while ( rowIdx<rows || cellIdx<cells ) {
		if (cellIdx == cells) { // End of the Row
			rowIdx++; //Move Down
			cellIdx=0;
		} else {
			cellIdx++;
		}
		var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
		if (isCellEditable(nextCell) && isTabStop(nextCell)) {
			return nextCell;
		}
	}
	return fromCell;
}
function moveLeft(fromCell) {
	var oTBody = getContainingElmt(fromCell,"TBODY");
	var oRow = getContainingElmt(fromCell,"TR");
	var rows = oTBody.rows.length - 1;
	var cells = oRow.cells.length - 1;
	var rowIdx = oRow.sectionRowIndex;
	var cellIdx = fromCell.cellIndex;
	while ( rowIdx>0 || cellIdx>0 ) {
		if (cellIdx == 0) { // Start of Row
			rowIdx--; //Move Up
			cellIdx=cells;
		} else {
			cellIdx--;
		}
		var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
		if (isCellEditable(nextCell) && isTabStop(nextCell)) {
			return nextCell;
		}
	}
	return fromCell;
}
function moveUp(fromCell) {
	var oTBody = getContainingElmt(fromCell,"TBODY");
	var oRow = getContainingElmt(fromCell,"TR");
	var rows = oTBody.rows.length - 1;
	var cells = oRow.cells.length - 1;
	var rowIdx = oRow.sectionRowIndex;
	var cellIdx = fromCell.cellIndex;
	while ( rowIdx>0 ) {
		rowIdx--; //Move Up
		var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
		if (isCellEditable(nextCell) && isTabStop(nextCell)) {
			return nextCell;
		}
	}
	return fromCell;
}
function moveDown(fromCell) {
	var oTBody = getContainingElmt(fromCell,"TBODY");
	var oRow = getContainingElmt(fromCell,"TR");
	var rows = oTBody.rows.length - 1;
	var cells = oRow.cells.length - 1;
	var rowIdx = oRow.sectionRowIndex;
	var cellIdx = fromCell.cellIndex;
	while ( rowIdx<rows ) {
		rowIdx++; //Move Down
		var nextCell = oTBody.rows[rowIdx].cells[cellIdx];
		if (isCellEditable(nextCell) && isTabStop(nextCell)) {
			return nextCell;
		}
	}
	return fromCell;
}

function isCellEditable(oTD) {
  var currentRow = getContainingElmt(oTD,"TR");
  var oCol = oColGroup.children[oTD.cellIndex];
  if (currentRow.rowType == undefined) {
    currentRow.rowType='update';
  }
  if ( currentRow.rowState == 'updating' ) {
    return false;
  } 
  // Is the column visible
  if (oCol.className == 'clsHidden') {
    return false;
  }
  // No name defined
  if (oCol.name==undefined) {
    return false;
  }
  if (currentRow.rowType == 'add' && oCol.addDisabled == 'true') {
    return false;
  }
  if (currentRow.rowType == 'update' && oCol.updateDisabled == 'true') {
    return false;
  } 
  if ( oCol.type=='html' ) {
    return false;
  }
  return true;
}

function isTabStop(oTD) {
	if (oColGroup.children[oTD.cellIndex].tabStop && oColGroup.children[oTD.cellIndex].tabStop == 'no') {
		return false;
	} else {
		return true;
	}
}

 function getCellValue(oTR,name) {
   for(var i=0;i<oColGroup.children.length;i++) {
     var oCol = oColGroup.children[i];
     if ( oCol.name == name ) {
       if (  oCol.type == 'html' || oCol.type == 'htmlarea' || oCol.type == 'FCKeditor' ) {
	 return oTR.cells[i].innerHTML;
       } else if ( oCol.type=='bool' ) {
	 return parseBoolean(stripHTML(oTR.cells[i].innerHTML));
       } else {
	 return unescapeHTML(oTR.cells[i].innerHTML);
       }
     }
   }
   throw "No column named " + name;
 }
 
 function setCellValue(oTR,name,value) {
   for(var i=0;i<oColGroup.children.length;i++) {
     var oCol = oColGroup.children[i];
     if ( oCol.name == name ) {
       if (  oCol.type == 'html' || oCol.type == 'htmlarea' || oCol.type == 'FCKeditor' ) {
	 return oTR.cells[i].innerHTML=value;
       } else if ( oCol.type=='bool' ) {
	 if ( parseBoolean(value) ) {
	   return oTR.cells[i].innerHTML="<span class='clsTrue'>Yes</span>";
	 } else {
	   return oTR.cells[i].innerHTML="<span class='clsFalse'>No</span>";
	 }
       } else {
	 return oTR.cells[i].innerHTML=escapeHTML(value);
       }
     }
   }
   throw "No column named " + name;
 }
//
// ROW
//

function requery(url,data) {
  if ( url == undefined ) {
    url = oTable.dataURL;
  }
  
  // Delete all rows
  while ( oTBody.rows.length > 0 ) {
    oTBody.deleteRow(0);
  }

  var handler = requeryReturn;
  var errorHandler = rowActionReturnError;
  var async = false;
  var type = 'requery';

  httpPost(url,data,handler,errorHandler,async);
}

function requeryReturn(xmlhttp) {
  var xmlDoc = xmlhttp.responseXML;
  var records = xmlDoc.selectNodes('records/record');
  for(var i=0;i<records.length;i++) {
    var oTR = createBlankRow();
    displayRow(oTR,records[i]);
  }
  // calculated
  xmlToChildIDs(xmlDoc,'records/calculated',oTable);
  // html
  xmlToChildIDs(xmlDoc,'records/html',oTable.document);
 
  if ( oTable.enabled == "true" ) {
    init2()
      }
}

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

  httpGet(url,handler,errorHandler,async);
}

function requeryReturn2(xmlhttp) {
  var xmlDoc = xmlhttp.responseXML;
  var records = xmlDoc.selectNodes('records/record');
  for(var i=0;i<records.length;i++) {
       displayRow(oTBody.rows[i],records[i]);
  }
  // calculated
  xmlToChildIDs(xmlDoc,'records/calculated',oTable);
  // html
  xmlToChildIDs(xmlDoc,'records/html',oTable.document);
}

function createBlankRow() {
  var oTR = oTBody.insertRow();
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
  if ( currentCell && oTR.contains(currentCell) ) {
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
  
  if ( currentCell ) {
    if ( oTR.contains(currentCell) ) {
      // Failed to move away
      cellOut(currentCell);
      oTBody.deleteRow(oTR.sectionRowIndex);
    } else {
      oTBody.deleteRow(oTR.sectionRowIndex);
      // Input will be in the wrong position
      cellIn(currentCell);
    }
  } else {
    // Just delete the row
    oTBody.deleteRow(oTR.sectionRowIndex);
  }
}

function setRowState(oTR,newState) {
  var oldState = oTR.rowState;
  if ( newState == 'dirty' ) {
    if ( oldState =='current' && oTR.rowType == 'add' ) {
      // Append New Row
      createNewRow();
    }
    if ( oldState == 'current' || oldState == 'error' ) {
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
    oTR.style.backgroundColor = 'tomato';
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
  setNavCounter(oTR.sectionRowIndex+1);
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

function rowUrlEncode(oTR) {
  var list = new Array;
  for(var i=0;i<oColGroup.children.length;i++) {
    var oCol = oColGroup.children[i];
    if ( oCol.name!=undefined) {
      var name = oCol.name;
      var value = getCellValue(oTR,name);
      list.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    }
  }
  return list.join("&");
}

function rowAction(oTR,type,url,handler,async) {
  if ( handler == undefined ) {
    handler = rowActionReturn;
  }
  
  // If async is true a page refresh may result in the db grid being populated with out of date values.
  // Default async to false if the beforeunload event has been triggered, otherwise default to true.
  if (async==false || (async == undefined && event.type=='beforeunload') ) {
      async = false;
  } else {
      async = true;
  }
  
  if ( type=='add' || type=='update' || type=='delete' ) {
    setRowState(oTR,'updating');
  }
  if (currentCell != undefined) {
    cellWrite();
  }
  
  // Check if there are url encoded variables in the url
  var re = /([^\?]+)\??(.*)/;
  re.exec(url);
  var path = RegExp.$1;
  var queryString = RegExp.$2;
  var data;
  if ( queryString != "" ) {
    data = queryString + '&' + rowUrlEncode(oTR);
  } else {
    data = rowUrlEncode(oTR);
  }
  
  httpPost(url,data,handler,rowActionReturnError,async,type,oTR);
}
 
function rowActionReturn(xmlhttp,type,oTR) {
  var xmlDoc = xmlhttp.responseXML;
  
  if ( type =='update' || type =='add' ) {
    oTR.rowType = 'update';
    oTR.rowError=undefined;
    setRowState(oTR,'current');
  }
  if ( type =='add' ) {
    recCount ++;
    // Refresh counter
    if ( currentCell != undefined ) {
      var currentRow = getContainingElmt(currentCell,'TR');
      setNavCounter(currentRow.sectionRowIndex + 1);
    }
  }
  if ( type == 'delete' ) {
    recCount --;
    // Focus
    rowRemove(oTR);
    setStatus("Deleted.");
  }
  // Row
  var rec = xmlDoc.selectSingleNode('records/record');
  if ( rec ) {displayRow(oTR,rec);}
  // calculated
  xmlToChildIDs(xmlDoc,'records/calculated',oTable);
  // html
  xmlToChildIDs(xmlDoc,'records/html',oTable.document);

  // Info
  var rec = xmlDoc.selectSingleNode('records/info');
  if ( rec ) {setStatus(rec.text);}
  // Alert
  var rec = xmlDoc.selectSingleNode('records/alert');
  if ( rec ) {alert(rec.text);}
  // Custom Event handler
  if ( oTable.onRowActionReturn != undefined ) {
    var action = new Object();
    action.type=type;
    action.elmt=oTR;
    oTable.onRowActionReturn(action);
  }
}
 
 function rowActionReturnError(errorMessage,errorType,actionType,oTR) {
   setRowState(oTR,'error');
   setStatus(errorMessage);
   if ( errorType != 'USER' ) {
     alert(errorMessage);
   }
 }

 function displayRow(oTR,xmlDoc) {
   var oTR;
   var xmlDoc;
   // record
   for(var i=0;i<oColGroup.children.length;i++) {
     var oCol = oColGroup.children[i];
     if (oCol.name) {
       var name = oCol.name;
       var oNode = xmlDoc.selectSingleNode(name);
       if ( oNode ) {
	 var value = oNode.text;
	 setCellValue(oTR,name,value);
       }
     }
   }
   if ( currentCell != undefined && oTR.contains(currentCell) ) {
     cellIn(currentCell,'preserve');
   }
 }
 
 // Status Message
 function setStatus(msg) {
   if (oStatusTable) {
     setObjectValue(oStatusTable.rows[0].cells[0],msg);
   } else {
       window.status=msg;
   }
 }
 function setNavCounter(bookmark) {
   if ( oStatusTable ) {
     var str = 'Record ' + bookmark + ' of ' + recCount;
     setObjectValue(oStatusTable.rows[0].cells[1],str);	
   }
 }
 
//
// GENERAL
//



// end scope
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
function dbGridCombo(callback) {
    // vars
    var editor = $('<input type="text">')
	.addClass('dbEditorCombo')
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
    var comboOptions = $('<div>')
	.addClass('dbEditorComboOptions')
	.appendTo(document.body)
	.css({
	    'position':'absolute',
	    'overflow':'auto',
	    'z-index': 1	    
	})
	.hide();
    var _searchURL;
    var _lastValue;

    // Events
    editor.on({
	'keydown': inputOnKeyDown,
	'keyup': inputOnKeyUp
    });
    comboOptions.on('mouseup', 'div', comboOptionMouseUp);
    comboOptions.on('mouseenter', 'div', comboOptionMouseEnter);

    // Set up dbGrid handlers
    oComboOptions = comboOptions.get(0);
    oInput = editor.get(0);
    oInput.getType = getType;
    oInput.getValue = getValue;
    oInput.show = show;
    oInput.hide = hide;
    oInput.selectText = selectText;
    oInput.destroy = destroy;

    return oInput;

    function getType() {
	return 'combo';
    }

    function show(oTD,value,searchURL) {
	// copy the style of oTD onto oInput
	var oTable = getContainingElmt(oTD,'TABLE');
	if ( oTable.currentStyle.borderCollapse == 'collapse' ) {
	    // BORDER COLLAPSE
	    var oTBody = getContainingElmt(oTD,"TBODY");
	    var oRow = getContainingElmt(oTD,"TR");
	    var rows = oTBody.rows.length - 1;
	    var cells = oRow.cells.length - 1;
	    var rowIndex = oRow.sectionRowIndex;
	    var cellIndex = oTD.cellIndex;
	    var borderWidth = parseInt(oTD.currentStyle.borderWidth);
	    if ( borderWidth%2 == 0 ) {
		// Even
		var borderTopWidth = borderWidth/2;
		var borderRightWidth = borderWidth/2;
		var borderBottomWidth = borderWidth/2;
		var borderLeftWidth = borderWidth/2;
	    } else {
		// Odd
		var borderTopWidth = Math.ceil(borderWidth/2);
		var borderLeftWidth = Math.ceil(borderWidth/2);
		var borderBottomWidth = Math.floor(borderWidth/2);
		var borderRightWidth = Math.floor(borderWidth/2);
	    }
	    // Top Row
	    if ( rowIndex == 0 ) {
		oInput.style.borderTopWidth = '0px';
	    } else {
		oInput.style.borderTopWidth = borderTopWidth;
	    }
	    // Right Boundary
	    if ( cellIndex == cells ) {
		oInput.style.borderRightWidth = '0px';
	    } else {
		oInput.style.borderRightWidth = borderRightWidth;
	    }
	    // Bottom
	    if ( rowIndex == rows ) {
		oInput.style.borderBottomWidth = '0px';
	    } else {
		oInput.style.borderBottomWidth = borderBottomWidth;
	    }
	    // Left
	    if ( cellIndex == 0 ) {
		oInput.style.borderLeftWidth = '0px';
	    } else {
		oInput.style.borderLeftWidth = borderLeftWidth;
	    }
	} else {
	    oInput.style.borderWidth = oTD.currentStyle.borderWidth;
	}
	oInput.style.borderStyle = oTD.currentStyle.borderStyle;
	oInput.style.borderColor = oTD.currentStyle.borderColor;
	
	oInput.style.marginTop = oTD.currentStyle.marginTop;
	oInput.style.marginRight = oTD.currentStyle.marginRight;
	oInput.style.marginBottom = oTD.currentStyle.marginBottom;
	oInput.style.marginLeft = oTD.currentStyle.marginLeft;
	
	oInput.style.paddingTop = oTD.currentStyle.paddingTop;
	oInput.style.paddingRight = oTD.currentStyle.paddingRight;
	oInput.style.paddingBottom = oTD.currentStyle.paddingBottom;
	oInput.style.paddingLeft = oTD.currentStyle.paddingLeft;
	
	oInput.style.textAlign = oTD.currentStyle.textAlign;
	oInput.style.verticalAlign = oTD.currentStyle.verticalAlign;
	oInput.style.fontSize = oTD.currentStyle.fontSize;
	oInput.style.fontFamily = oTD.currentStyle.fontFamily;
	if ( oTD.currentStyle.backgroundColor=='transparent' )	{
	    oInput.style.backgroundColor='white';
	} else {
	    oInput.style.backgroundColor=oTD.currentStyle.backgroundColor;
	}	
	
	oInput.style.pixelWidth = oTD.offsetWidth;
	oInput.style.pixelHeight = oTD.offsetHeight;
	oInput.style.pixelTop = getContainerPixelTop(oTD);
	oInput.style.pixelLeft = getContainerPixelLeft(oTD);
	editor.show();

	oComboOptions.style.backgroundColor = oInput.style.backgroundColor
	oComboOptions.style.borderStyle=oTD.currentStyle.borderStyle;
	oComboOptions.style.borderColor=oTD.currentStyle.borderColor;
	oComboOptions.style.borderWidth=oTD.currentStyle.borderWidth;
	oComboOptions.style.paddingLeft = oTD.currentStyle.paddingLeft;
	oComboOptions.style.paddingRight = oTD.currentStyle.paddingRight;
	oComboOptions.style.width = oInput.offsetWidth;
	oComboOptions.style.pixelTop = getPixelTop(oInput) + oInput.offsetHeight;
	// I think IE has a bug that prevents offsetLeft/offsetParent from
	// correctly calculating position. The width of the container div border
	// is 3 pixels hence the hack.
	oComboOptions.style.pixelLeft = getPixelLeft(oInput)+3;
	
	if ( searchURL == undefined ) { throw "searchURL must be defined" }
	editor.val(value);
	_lastValue = value;
	_searchURL = searchURL;
    }

    function hide() {
	comboOptions.hide();
	editor.hide();
    }

    function getValue() {
	return editor.val();
    }

    function selectText() {
	var rng = oInput.createTextRange();
	rng.select();
    }

    function inputOnKeyDown(e) {
	if (e.keyCode == 38) {
	    // Up Arrow
	    if ( comboOptions.is(':visible') ) {
		// navigate within comboOptions if it is visible
		var index = comboOptions.children('.selected').prev().index();
		if ( index !== -1 ) {
		    selectOption(index);
		}
		return true
	    } else {
		callback(e);
	    }
	}
	if (e.keyCode == 40) {
	    // Down Arrow
	    if ( comboOptions.is(':visible') ) {
		// navigate within comboOptions if it is visible
		var index = comboOptions.children('.selected').next().index();
		if ( index !== -1 ) {
		    selectOption(index);
		}
		return true
	    } else {
		callback(e);
	    }
	}
	if (e.keyCode == 37 && atEditStart(oInput)) {
	    // Left Arrow
	    callback(e);
	}
	if (e.keyCode == 39 && atEditEnd(oInput) ) {
	    // Right Arrow
	    callback(e);
	}
	if (e.keyCode == 9 || e.keyCode == 13) {
	    // TAB or Return
	    if ( comboOptions.is(':visible') ) {
		// Update editor with the selected comboOption
		var option = comboOptions.children('.selected');
		if ( option.index() !== -1 ) {
		    editor.val(option.text());
		    _lastValue = option.text();
		    comboOptions.hide();
		    // trigger keyup on editor to let it listeners know that it's value has changed
		    editor.trigger('keyup');
		}
	    } 
	    callback(e);
	}
	if (e.keyCode == 46) {
	    // Delete
	    callback(e)
	}
	if ( e.keyCode == 83 && e.ctrlKey ) {
	    // Ctrl+S
	    callback(e);
	}
    }

    function inputOnKeyUp(e) {
	if ( editor.val() != _lastValue ) {
	    _lastValue = editor.val();
	    search();
	}
	callback(e)
    }

    function comboOptionMouseUp(e) {
	var option = $(e.currentTarget);

	selectOption(option.index());
	comboOptions.hide();
	editor.val(option.text());
	_lastValue = option.text();
	// trigger keyup on editor to let it listeners know that it's value has changed
	editor.trigger('keyup');
	// Move cursor to end of Input
	var rng = oInput.createTextRange();
	rng.collapse(false);
	rng.select();
    }
    function comboOptionMouseEnter(e) {
	// Select the target option
	var option = $(e.currentTarget);
	selectOption(option.index());
    }

    function selectOption(index) {
	// Select the option for this 0-based index
	comboOptions.children('.selected').removeClass('selected');
	comboOptions.children(':nth-child(' + (index + 1) + ')').addClass('selected');
    }
    
    function search() {
	// Server side search for available options
	comboOptions.show().text("Searching ...");
	
	jQuery.ajax({
	    url: _searchURL,
	    data: {
		value: getValue()
	    },
	    dataType: 'xml',
	    async: false,
	    cache: false,
	    success: function(data) {
		searchReturn(data)
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
		comboOptions.text("Software Bug ! " + textStatus + ': ' + errorThrown);
	    }   
	});
    }

    function searchReturn(xmlDoc) {
	// Populate comboOptions element with server response
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
		selectOption(0);
	    } else {
		// No Matches
		comboOptions.text("No Matches");
	    }
	}
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
	editor.remove();
	comboOptions.remove();
    }

    //
}

/* ==== dbGridDivStatus.js ==== */
function dbGridDivStatus(oDivStatus) {
// This modified version of resize only allows Height Changes
var inZone = false;
var inResize = false;
var type='';
var savedWidth;
var savedHeight;
var savedX;
var savedY;
var tolerance = 10;
var minWidth;
var minHeight = 10;
// The div to resize
var oForDiv = oDivStatus.previousSibling;

// Attach
oDivStatus.attachEvent('onmousemove',onMouseMove);
oDivStatus.attachEvent('onmousedown',onMouseDown);
oDivStatus.attachEvent('onmouseup',onMouseUp);

function onMouseMove() {
	if ( inResize && event.button == 1) {
		// Drag
		var deltaY = event.screenY - savedY;
		var height = savedHeight + deltaY;
		if ( height < minHeight ) {
			height = minHeight;
		}
		// Resize
		oForDiv.runtimeStyle.height = height;
	} else {
		if ( event.offsetY >= oDivStatus.clientHeight + oDivStatus.clientTop + oDivStatus.scrollTop) {
			// Bottom Border
			oDivStatus.runtimeStyle.cursor='S-resize';
			type='S';
			inZone = true;
			
		} else {
			oDivStatus.runtimeStyle.cursor='auto';
			type = '';
			inZone = false;
		}
	}
}

function onMouseDown() {
	if ( inZone && event.button == 1) {
		oDivStatus.setCapture();
		savedX = event.screenX;
		savedY = event.screenY;
		savedHeight = oForDiv.offsetHeight;
		inResize = true;
	} 
}
function onMouseUp () {
	inResize=false;
	oDivStatus.releaseCapture();
}
//
}

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
function dbGridHTMLArea(callback) {

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

function show(oTD,value,editorHeight) {
	// copy the style of oTD onto oHTMLArea
	var oTable = getContainingElmt(oTD,'TABLE');
	if ( oTable.currentStyle.borderCollapse == 'collapse' ) {
		// BORDER COLLAPSE
		var oTBody = getContainingElmt(oTD,"TBODY");
		var oRow = getContainingElmt(oTD,"TR");
		var rows = oTable.rows.length - 1;
		var cells = oRow.cells.length - 1;
		var rowIndex = oRow.rowIndex;
		var cellIndex = oTD.cellIndex;
		var borderWidth = parseInt(oTD.currentStyle.borderWidth);
		if ( borderWidth%2 == 0 ) {
			// Even
			var borderTopWidth = borderWidth/2;
			var borderRightWidth = borderWidth/2;
			var borderBottomWidth = borderWidth/2;
			var borderLeftWidth = borderWidth/2;
		} else {
			// Odd
			var borderTopWidth = Math.ceil(borderWidth/2);
			var borderLeftWidth = Math.ceil(borderWidth/2);
			var borderBottomWidth = Math.ceil(borderWidth/2);
			var borderRightWidth = Math.ceil(borderWidth/2);
		}
		// Top Row
		if ( rowIndex == 0 ) {
			oHTMLArea.style.borderTopWidth = '0px';
		} else {
			oHTMLArea.style.borderTopWidth = borderTopWidth;
		}
		// Right Boundary
		oHTMLArea.style.borderRightWidth = borderRightWidth;
		
		// Bottom
		oHTMLArea.style.borderBottomWidth = borderBottomWidth;
		
		// Left
		if ( cellIndex == 0 ) {
			oHTMLArea.style.borderLeftWidth = '0px';
		} else {
			oHTMLArea.style.borderLeftWidth = borderLeftWidth;
		}
	} else {
		oHTMLArea.style.borderWidth = oTD.currentStyle.borderWidth;
	}
	oHTMLArea.style.borderStyle = oTD.currentStyle.borderStyle;
	oHTMLArea.style.borderColor = oTD.currentStyle.borderColor;
	//oHTMLArea.style.borderColor = 'pink';
	
	oHTMLArea.style.marginTop = oTD.currentStyle.marginTop;
	oHTMLArea.style.marginRight = oTD.currentStyle.marginRight;
	oHTMLArea.style.marginBottom = oTD.currentStyle.marginBottom;
	oHTMLArea.style.marginLeft = oTD.currentStyle.marginLeft;
	
	oHTMLArea.style.paddingTop = oTD.currentStyle.paddingTop;
	oHTMLArea.style.paddingRight = oTD.currentStyle.paddingRight;
	oHTMLArea.style.paddingBottom = oTD.currentStyle.paddingBottom;
	oHTMLArea.style.paddingLeft = oTD.currentStyle.paddingLeft;
	
	oHTMLArea.style.textAlign = oTD.currentStyle.textAlign;
	oHTMLArea.style.verticalAlign = oTD.currentStyle.verticalAlign;
	oHTMLArea.style.fontSize = oTD.currentStyle.fontSize;
	oHTMLArea.style.fontFamily = oTD.currentStyle.fontFamily;
	if ( oTD.currentStyle.backgroundColor=='transparent' )	{
		oHTMLArea.style.backgroundColor='white';
	} else {
		oHTMLArea.style.backgroundColor=oTD.currentStyle.backgroundColor;
	}
	
	if ( editorHeight == undefined ) {
		oHTMLArea.style.pixelWidth = oTD.offsetWidth+parseInt(borderRightWidth);
		oHTMLArea.style.pixelHeight = oTD.offsetHeight+parseInt(borderBottomWidth);	
	} else {
		oHTMLArea.style.pixelWidth = oTD.offsetWidth + parseInt(borderRightWidth);
		oHTMLArea.style.pixelHeight = editorHeight;
	}
	oHTMLArea.style.pixelTop = getContainerPixelTop(oTD);
	oHTMLArea.style.pixelLeft = getContainerPixelLeft(oTD);
	
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

/* ==== dbGridInput.js ==== */
function dbGridInput(callback) {

// vars
var oInput;
var callback;

// Init
oInput = document.createElement('INPUT');
oInput.type='text';
oInput.style.position = 'absolute';
oInput.style.visibility = 'hidden';
oInput.style.backgroundColor='white';

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

function show(oTD,value) {
  // copy the style of oTD onto oInput
  var oTable = getContainingElmt(oTD,'TABLE');
  if ( oTable.currentStyle.borderCollapse == 'collapse' ) {
    // BORDER COLLAPSE
    var oTBody = getContainingElmt(oTD,"TBODY");
    var oRow = getContainingElmt(oTD,"TR");
    var rows = oTable.rows.length - 1;
    var cells = oRow.cells.length - 1;
    var rowIndex = oRow.rowIndex;
    var cellIndex = oTD.cellIndex;
    var borderWidth = parseInt(oTD.currentStyle.borderWidth);
    if ( borderWidth%2 == 0 ) {
      // Even
      var borderTopWidth = borderWidth/2;
      var borderRightWidth = borderWidth/2;
      var borderBottomWidth = borderWidth/2;
      var borderLeftWidth = borderWidth/2;
    } else {
      // Odd
      var borderTopWidth = Math.ceil(borderWidth/2);
      var borderLeftWidth = Math.ceil(borderWidth/2);
      var borderBottomWidth = Math.floor(borderWidth/2);
      var borderRightWidth = Math.floor(borderWidth/2);
    }
    // Top Row
    if ( rowIndex == 0 ) {
      oInput.style.borderTopWidth = '0px';
    } else {
      oInput.style.borderTopWidth = borderTopWidth;
    }
    // Right Boundary
    if ( cellIndex == cells ) {
      oInput.style.borderRightWidth = '0px';
    } else {
      oInput.style.borderRightWidth = borderRightWidth;
    }
    // Bottom
    if ( rowIndex == rows ) {
      oInput.style.borderBottomWidth = '0px';
    } else {
      oInput.style.borderBottomWidth = borderBottomWidth;
    }
    // Left
    if ( cellIndex == 0 ) {
      oInput.style.borderLeftWidth = '0px';
    } else {
      oInput.style.borderLeftWidth = borderLeftWidth;
    }
  } else {
    oInput.style.borderWidth = oTD.currentStyle.borderWidth;
  }
  oInput.style.borderStyle = oTD.currentStyle.borderStyle;
  oInput.style.borderColor = oTD.currentStyle.borderColor;
  
  oInput.style.marginTop = oTD.currentStyle.marginTop;
  oInput.style.marginRight = oTD.currentStyle.marginRight;
  oInput.style.marginBottom = oTD.currentStyle.marginBottom;
  oInput.style.marginLeft = oTD.currentStyle.marginLeft;
  
  oInput.style.paddingTop = oTD.currentStyle.paddingTop;
  oInput.style.paddingRight = oTD.currentStyle.paddingRight;
  oInput.style.paddingBottom = oTD.currentStyle.paddingBottom;
  oInput.style.paddingLeft = oTD.currentStyle.paddingLeft;
  
  oInput.style.textAlign = oTD.currentStyle.textAlign;
  oInput.style.verticalAlign = oTD.currentStyle.verticalAlign;
  oInput.style.fontSize = oTD.currentStyle.fontSize;
  oInput.style.fontFamily = oTD.currentStyle.fontFamily;
  if ( oTD.currentStyle.backgroundColor=='transparent' )	{
    oInput.style.backgroundColor='white';
  } else {
    oInput.style.backgroundColor=oTD.currentStyle.backgroundColor;
  }	
  
  oInput.style.pixelWidth = oTD.offsetWidth;
  oInput.style.pixelHeight = oTD.offsetHeight;
  
  oInput.style.pixelTop = getContainerPixelTop(oTD);
  oInput.style.pixelLeft = getContainerPixelLeft(oTD);
  
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
  oInput.removeNode(true);
}

function storeSelection() {
  var currentRange=document.selection.createRange();
  bookmark = currentRange.getBookmark();
  lastValue=getValue();
 }

//
}


/* ==== dbGridInputBool.js ==== */
function dbGridInputBool(callback) {

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
	return 'bool';
}

function getValue() {
	return parseBoolean(stripHTML(oHTMLArea.innerHTML));
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

function show(oTD,value) {
	// copy the style of oTD onto oHTMLArea
	var oTable = getContainingElmt(oTD,'TABLE');
	if ( oTable.currentStyle.borderCollapse == 'collapse' ) {
		// BORDER COLLAPSE
		var oTBody = getContainingElmt(oTD,"TBODY");
		var oRow = getContainingElmt(oTD,"TR");
		var rows = oTable.rows.length - 1;
		var cells = oRow.cells.length - 1;
		var rowIndex = oRow.rowIndex;
		var cellIndex = oTD.cellIndex;
		var borderWidth = parseInt(oTD.currentStyle.borderWidth);
		if ( borderWidth%2 == 0 ) {
			// Even
			var borderTopWidth = borderWidth/2;
			var borderRightWidth = borderWidth/2;
			var borderBottomWidth = borderWidth/2;
			var borderLeftWidth = borderWidth/2;
		} else {
			// Odd
			var borderTopWidth = Math.ceil(borderWidth/2);
			var borderLeftWidth = Math.ceil(borderWidth/2);
			var borderBottomWidth = Math.ceil(borderWidth/2);
			var borderRightWidth = Math.ceil(borderWidth/2);
		}
		// Top Row
		if ( rowIndex == 0 ) {
			oHTMLArea.style.borderTopWidth = '0px';
		} else {
			oHTMLArea.style.borderTopWidth = borderTopWidth;
		}
		// Right Boundary
		oHTMLArea.style.borderRightWidth = borderRightWidth;
		
		// Bottom
		oHTMLArea.style.borderBottomWidth = borderBottomWidth;
		
		// Left
		if ( cellIndex == 0 ) {
			oHTMLArea.style.borderLeftWidth = '0px';
		} else {
			oHTMLArea.style.borderLeftWidth = borderLeftWidth;
		}
	} else {
		oHTMLArea.style.borderWidth = oTD.currentStyle.borderWidth;
	}
	oHTMLArea.style.borderStyle = oTD.currentStyle.borderStyle;
	oHTMLArea.style.borderColor = oTD.currentStyle.borderColor;
	//oHTMLArea.style.borderColor = 'pink';
	
	oHTMLArea.style.marginTop = oTD.currentStyle.marginTop;
	oHTMLArea.style.marginRight = oTD.currentStyle.marginRight;
	oHTMLArea.style.marginBottom = oTD.currentStyle.marginBottom;
	oHTMLArea.style.marginLeft = oTD.currentStyle.marginLeft;
	
	oHTMLArea.style.paddingTop = oTD.currentStyle.paddingTop;
	oHTMLArea.style.paddingRight = oTD.currentStyle.paddingRight;
	oHTMLArea.style.paddingBottom = oTD.currentStyle.paddingBottom;
	oHTMLArea.style.paddingLeft = oTD.currentStyle.paddingLeft;
	
	oHTMLArea.style.textAlign = oTD.currentStyle.textAlign;
	oHTMLArea.style.verticalAlign = oTD.currentStyle.verticalAlign;
	oHTMLArea.style.fontSize = oTD.currentStyle.fontSize;
	oHTMLArea.style.fontFamily = oTD.currentStyle.fontFamily;
	if ( oTD.currentStyle.backgroundColor=='transparent' )	{
		oHTMLArea.style.backgroundColor='white';
	} else {
		oHTMLArea.style.backgroundColor=oTD.currentStyle.backgroundColor;
	}
	
	oHTMLArea.style.pixelWidth = oTD.offsetWidth+parseInt(borderRightWidth);
	oHTMLArea.style.pixelHeight = oTD.offsetHeight+parseInt(borderBottomWidth);
	
	oHTMLArea.style.pixelTop = getContainerPixelTop(oTD);
	oHTMLArea.style.pixelLeft = getContainerPixelLeft(oTD);
	
	oHTMLArea.style.visibility = 'visible';
	if ( parseBoolean(value) ) {
	  setTrue();
	} else {
	  setFalse();
	}
}

function hide() {
  oHTMLArea.style.visibility = 'hidden';
}

function setTrue() {
  oHTMLArea.innerHTML='<span class=clsTrue>Yes</span>';

}

function setFalse() {
  oHTMLArea.innerHTML='<span class=clsFalse>No</span>';

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
   var e = window.event;
 out: {
     if ( e.keyCode == 32 ) {
       // Spacebar
       if ( parseBoolean(stripHTML(oHTMLArea.innerHTML))) {
	 setFalse();
       } else {
	 setTrue();
       }
       break out;
     }
		
     if (  e.keyCode==97 || e.keyCode==49 || e.keyCode==84 || e.keyCode==89 ) {
       // keypad 1 or 1 or t or y
       setTrue();
       break out;
     }
     if (  e.keyCode==96 || e.keyCode==48 || e.keyCode==70 || e.keyCode==78 ) {
       // 0 or f or n
       setFalse();
       break out;
     }
   }
   // allways propagate
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
function dbGridTextArea(callback) {

// vars
var oTextArea;
var callback;

// Init
oTextArea = document.createElement('TEXTAREA');
oTextArea.style.position = 'absolute';
oTextArea.style.visibility = 'hidden';
oTextArea.style.backgroundColor='white';
oTextArea.style.border='1px solid #aca899';
oTextArea.style.overflow = 'auto';

oTextArea.attachEvent('onkeydown',inputOnKeyDown);
oTextArea.attachEvent('onkeyup',inputOnKeyUp);

// Set up handlers
oTextArea.getType = getType;
oTextArea.getValue = getValue;
oTextArea.show = show;
oTextArea.hide = hide;
oTextArea.selectText = selectText;
oTextArea.destroy = destroy;

return oTextArea;

function getType() {
	return 'textarea';
}

function getValue() {
	var value = oTextArea.value;
	return value.replace(/\r\n/g,"<BR>");
}

function selectText() {
	var rng = oTextArea.createTextRange();
	rng.collapse(true);
	rng.select();
}

function show(oTD,value,editorHeight) {
	// copy the style of oTD onto oTextArea
	var oTable = getContainingElmt(oTD,'TABLE');
	if ( oTable.currentStyle.borderCollapse == 'collapse' ) {
		// BORDER COLLAPSE
		var oTBody = getContainingElmt(oTD,"TBODY");
		var oRow = getContainingElmt(oTD,"TR");
		var rows = oTBody.rows.length - 1;
		var cells = oRow.cells.length - 1;
		var rowIndex = oRow.sectionRowIndex;
		var cellIndex = oTD.cellIndex;
		var borderWidth = parseInt(oTD.currentStyle.borderWidth);
		if ( borderWidth%2 == 0 ) {
			// Even
			var borderTopWidth = borderWidth/2;
			var borderRightWidth = borderWidth/2;
			var borderBottomWidth = borderWidth/2;
			var borderLeftWidth = borderWidth/2;
		} else {
			// Odd
			var borderTopWidth = Math.ceil(borderWidth/2);
			var borderLeftWidth = Math.ceil(borderWidth/2);
			var borderBottomWidth = Math.ceil(borderWidth/2);
			var borderRightWidth = Math.ceil(borderWidth/2);
		}
		// Top Row
		if ( rowIndex == 0 ) {
			oTextArea.style.borderTopWidth = '0px';
		} else {
			oTextArea.style.borderTopWidth = borderTopWidth;
		}
		// Right Boundary
		oTextArea.style.borderRightWidth = borderRightWidth;
		// Bottom
		oTextArea.style.borderBottomWidth = borderBottomWidth;
		// Left
		if ( cellIndex == 0 ) {
			oTextArea.style.borderLeftWidth = '0px';
		} else {
			oTextArea.style.borderLeftWidth = borderLeftWidth;
		}
	} else {
		oTextArea.style.borderWidth = oTD.currentStyle.borderWidth;
	}
	oTextArea.style.borderStyle = oTD.currentStyle.borderStyle;
	oTextArea.style.borderColor = oTD.currentStyle.borderColor;
	
	oTextArea.style.marginTop = oTD.currentStyle.marginTop;
	oTextArea.style.marginRight = oTD.currentStyle.marginRight;
	oTextArea.style.marginBottom = oTD.currentStyle.marginBottom;
	oTextArea.style.marginLeft = oTD.currentStyle.marginLeft;
	
	oTextArea.style.paddingTop = oTD.currentStyle.paddingTop;
	oTextArea.style.paddingRight = oTD.currentStyle.paddingRight;
	oTextArea.style.paddingBottom = oTD.currentStyle.paddingBottom;
	oTextArea.style.paddingLeft = oTD.currentStyle.paddingLeft;
	
	oTextArea.style.textAlign = oTD.currentStyle.textAlign;
	oTextArea.style.verticalAlign = oTD.currentStyle.verticalAlign;
	oTextArea.style.fontSize = oTD.currentStyle.fontSize;
	oTextArea.style.fontFamily = oTD.currentStyle.fontFamily;
	if ( oTD.currentStyle.backgroundColor=='transparent' )	{
		oTextArea.style.backgroundColor='white';
	} else {
		oTextArea.style.backgroundColor=oTD.currentStyle.backgroundColor;
	}
	
	oTextArea.style.pixelWidth = oTD.offsetWidth + parseInt(borderRightWidth);
	if ( editorHeight == undefined ) {
		oTextArea.style.pixelHeight = oTD.offsetHeight;	
	} else {
		oTextArea.style.pixelHeight = editorHeight;
	}
	oTextArea.style.pixelTop = getContainerPixelTop(oTD);
	oTextArea.style.pixelLeft = getContainerPixelLeft(oTD);
	
	oTextArea.style.visibility = 'visible';
	oTextArea.value = value.replace(/<BR>/gi,"\r\n")
}

function hide() {
	oTextArea.style.visibility = 'hidden';
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
		if (e.keyCode == 37 && atEditStart(oTextArea)) {
			// Left Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 38 && atEditStart(oTextArea)) {
			// Up Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 39 && atEditEnd(oTextArea)) {
			// Right Arrow
			callback(e);
			break out;
		}
		if (e.keyCode == 40 && atEditEnd(oTextArea)) {
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
	while (elem.tagName != 'DIV' ) {
		left += elem.offsetLeft - elem.scrollLeft;
		elem = elem.offsetParent;
	}
	return left;
}
function getContainerPixelTop(elem) {
	var top = 0;
	while (elem.tagName != 'DIV') {
		top += elem.offsetTop - elem.scrollTop;
		elem = elem.offsetParent;
	}
	return top;
}

function destroy() {
	oTextArea.removeNode(true);
}

//
}

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


/* ==== jquery.dbFormCombo.js ==== */
;(function($, undefined) {
    $.widget('qcode.dbFormCombo', {
        options: {
	    searchUrl: "",
	    searchLimit: 10,
	    comboHeight: 200
        },
        _create: function() {
            this.options.comboWidth = coalesce(this.options.comboWidth, this.element.outerWidth());
	    this.div = $('<div>')
	        .css({
		    'position': 'absolute',
		    'width': this.options.comboWidth,
		    'height': this.options.comboHeight,
		    'overflow': 'auto',
		    'top': this.element.position().top + this.element.outerHeight(),
		    'left': this.element.position().left,
		    'border': "1px solid black",
		    'background': "white"
	        })
	        .appendTo('body')
	        .hide()
	        .hover(
		    function(){$(this).addClass('hover');},
		    function(){$(this).removeClass('hover');}
	        );
	    this.lastValue = this.element.val();
	    this._on({
	        'keydown': this._onKeyDown,
	        'keyup': this._onKeyUp,
	        'blur': this._onBlur
            });
        },
	show: function(){
	    this.div.show();
	},
	hide: function() {
	    this.div.removeClass('hover').hide();
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
	    var record = $(this.xmlDoc).find('record').eq(index);
	    this.element.val( $(record).find(this.element.attr('name')).text() );
	    this.lastValue = this.element.val();
	    this.hide();
	    this.currentItem = undefined;
	    this.element.focus();
	    this.element.trigger('comboSelect');
	},
	updateList: function() {
	    this.div.empty();
	    this._on(this.div, {
                'click': this._divOnClick,
	        'mouseover': this._divOnMouseOver
            });
	    var dbForm = this;
	    this.xmlDoc.find('record').each(function(i,record){
		var field = $(record).find(dbForm.element.attr('name'));
		$('<div>')
		    .css({
			'width': "100%",
			'cursor': "pointer"
		    })
		    .text( $(field).text() )
		    .appendTo( dbForm.div );
	    });
	    if ( this.div.children().length >= this.options.searchLimit ) {
		this.div.append('.....');
	    }
	    this.currentItem = this.div.children().first();
	    this.highlight(0);
	},
        _onKeyDown: function(event) {
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
        },
        _onKeyUp: function(event) {
	    if ( this.element.val() != this.lastValue ) {
	        this.lastValue = this.element.val();
	        this.search();
	    }
        },
        _onBlur: function(event) {
	    if ( ! this.div.is('.hover') ) {
	        this.hide();
	        this.currentItem = undefined;
	    }
        },
        _divOnClick: function(event) {
	    if ( ! this.div.is(event.target) ) {
	        this.select($(event.target).index());
	    }
        },
        _divOnMouseOver: function(event) {
	    if ( ! this.div.is(event.target) ) {
	        this.highlight($(event.target).index());
	    }
        },
        search: function() {
	    this.currentItem = undefined;
	    this.div.text('Searching ...');
	    this.show();
	    this.div.off('click.dbFormCombo');
	    this.div.off('mouseover.dbFormCombo');
	    this.xmlDoc = undefined;
	    var dbForm = this;
	    $.get(this.options.searchURL, {
	        'name': this.element.attr('name'),
	        'value': this.element.val(),
	        'searchLimit': this.options.searchLimit
	    }, "xml").success(function(data, textStatus, jqXHR){
	        dbForm.xmlDoc = $(data);
	        if ( dbForm.xmlDoc.find('error').length > 0 ) {
		    dbForm.div.text( dbForm.xmlDoc.find('error').text() );
	        } else {
		    if ( dbForm.xmlDoc.find('record').length > 0 ) {
		        dbForm.updateList();
		    } else {
		        dbForm.div.text("No Matches");
		    }
	        }
	    }).error(function(jqXHR, textStatus, errorThrown){
	        dbForm.div.text("Software Bug ! " + errorThrown);
	    });
        }
    });
})(jQuery);

/* ==== jquery.navigate.js ==== */
(function($, window, document, undefined) {
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
            var nextElement
            switch (event.which) {
            case 37:
                // left arrow key pressed - move left (if at selectionStart)
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || atEditStart(currentElement[0])) {
                    nextElement = navigate.prevLeft(currentElement)
                }
                break;
            case 39:
                // right arrow key pressed - move right (if at SelectionEnd) 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || atEditEnd(currentElement[0])) {
                    nextElement = navigate.nextRight(currentElement)
                }
                break;
            case 38:
                // up arrow key pressed - move up 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || atEditStart(currentElement[0])) {
                    nextElement = navigate.prevUp(currentElement)
                }
                break;
            case 40:
                // down arrow key pressed - move down
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || atEditEnd(currentElement[0])) {
                    nextElement = navigate.nextDown(currentElement)
                }
                break;
            case 13:
                // return key pressed - move down 
                nextElement = navigate.nextDown(currentElement)
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
            document.selection.empty();
        }

        // Move focus to nextField and select text contents
        nextField.focus();
        if (nextField.is('input[type=text],textarea,[contenteditable=true]')) {
            if (nextField.is(':input') && nextField[0].createTextRange) {
                // createTextRange directly supported on input DOM elements
                var elmtRange = nextField[0].createTextRange();
            } else {
                // createTextRange is not directly supported on contenteditable DOM elements
                var elmtRange = document.body.createTextRange();
                elmtRange.moveToElementText(nextField[0]);
            }
            elmtRange.select();
        }
    };
    Navigate.prototype.prevLeft = function(fromField) {
        // Returns the field left of the target, or undefined if none exists
        var nextField;
        var fromFieldLeft = fromField.offset().left;
        var fields = jQuery(this.selector + ':visible', this.container).not(fromField);
        fields.each(function() {
            var field = $(this);
            var fieldLeft = field.offset().left;
            if (sameRow(field, fromField) && fieldLeft < fromFieldLeft && (nextField === undefined || fieldLeft > nextFieldLeft)) {
                nextField = field;
                nextFieldLeft = fieldLeft;
            }
        });
        if (nextField === undefined) {
            fields.each(function() {
                var field = $(this);
                var fieldLeft = $(field).offset().left;
                if (aboveRow(fromField, field) && (nextField === undefined || belowRow(nextField, field) || (sameRow(field, nextField) && fieldLeft > nextFieldLeft))) {
                    nextField = field;
                    nextFieldLeft = fieldLeft;
                }
            });
        }
        return nextField;
    };
    Navigate.prototype.nextRight = function(fromField) {
        // Returns the field right of the target, or undefined if none exists
        var nextField;
        var fromFieldLeft = fromField.offset().left;
        var fields = jQuery(this.selector + ':visible', this.container).not(fromField);
        fields.each(function() {
            var field = $(this);
            var fieldLeft = field.offset().left;
            if (sameRow(field, fromField) && fieldLeft > fromFieldLeft && (nextField === undefined || fieldLeft < nextFieldLeft)) {
                nextField = field;
                nextFieldLeft = fieldLeft;
            }
        });
        if (nextField === undefined) {
            fields.each(function() {
                var field = $(this);
                var fieldLeft = $(field).offset().left;
                if (belowRow(fromField, field) && (nextField === undefined || aboveRow(nextField, field) || (sameRow(field, nextField) && fieldLeft < nextFieldLeft))) {
                    nextField = field;
                    nextFieldLeft = fieldLeft;
                }
            });
        }
        return nextField;
    };
    Navigate.prototype.prevUp = function(fromField) {
        // Returns the field above the target, or unedfined if none exists
        var nextField;
        var fromFieldTop = fromField.offset().top;
        var fields = jQuery(this.selector + ':visible', this.container).not(fromField);
        fields.each(function() {
            var field = $(this);
            var fieldTop = field.offset().top;
            if (sameColumn(fromField, field) && fieldTop < fromFieldTop && (nextField === undefined || fieldTop > nextFieldTop)) {
                nextField = field;
                nextFieldTop = fieldTop;
            }
        });
        if (nextField === undefined) {
            fields.each(function() {
                var field = $(this);
                var fieldTop = field.offset().top;
                if (leftOfColumn(fromField, field) && (nextField === undefined || rightOfColumn(nextField, field) || (sameColumn(field, nextField) && fieldTop > nextFieldTop))) {
                    nextField = field;
                    nextFieldTop = fieldTop;
                };
            });
        }
        return nextField;
    };
    Navigate.prototype.nextDown = function(fromField) {
        // Returns the field below the target, or undefined if none exists
        var nextField;
        var fromFieldTop = fromField.offset().top;
        var fields = jQuery(this.selector + ':visible', this.container).not(fromField);
        fields.each(function() {
            var field = $(this);
            var fieldTop = field.offset().top;
            if (sameColumn(fromField, field) && fieldTop > fromFieldTop && (nextField === undefined || fieldTop < nextFieldTop)) {
                nextField = field;
                nextFieldTop = fieldTop;
            }
        });
        if (nextField === undefined) {
            fields.each(function() {
                var field = $(this);
                var fieldTop = field.offset().top;
                if (rightOfColumn(fromField, field) && (nextField === undefined || leftOfColumn(nextField, field) || (sameColumn(field, nextField) && fieldTop < nextFieldTop))) {
                    nextField = field;
                    nextFieldTop = fieldTop;
                }
            });
        }
        return nextField;
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

    // Basic Navigation functions, used by Navigate Objects

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
}(jQuery, window, document));

/* ==== jquery.utils.js ==== */
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

/* ==== qcode-ui-1.5.js ==== */


/* ==== resizeHeight.js ==== */
function resizeHeight(oObject) {

oObject.attachEvent('onmousemove',onMouseMove);
oObject.attachEvent('onmousedown',onMouseDown);
oObject.attachEvent('onmouseup',onMouseUp);

// You must specify an initial height for this object
// else event.offsetY will not fire against the oObject.

var inZone = false;
var inResize = false;
var type='';
var savedHeight;
var savedX;
var savedY;
var tolerance = 10;
var minHeight;

function onMouseMove() {
	if ( inResize && event.button == 1) {
		// Drag
		var deltaY = event.screenY - savedY;
		var height = savedHeight + deltaY;
		if ( height < minHeight ) {
			height = minHeight;
		}
		// Resize
		oObject.runtimeStyle.height = height;
	} else {
		var pixelTop = getPixelTop(oObject);
		if (  event.offsetY >= oObject.clientHeight + oObject.clientTop + oObject.scrollTop ) {
			// Bottom Border
			oObject.runtimeStyle.cursor='S-resize';
			type='S';
			inZone = true;
			
		} else {
			oObject.runtimeStyle.cursor='auto';
			type = '';
			inZone = false;
		}
	}
}

function onMouseDown() {
	if ( inZone && event.button == 1) {
		oObject.setCapture();
		savedX = event.screenX;
		savedY = event.screenY;
		savedWidth = oObject.offsetWidth;
		savedHeight = oObject.offsetHeight;
		inResize = true;
	} 
}
function onMouseUp () {
	inResize=false;
	oObject.releaseCapture();
}
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


/* ==== theadFixed.js ==== */
function theadFixed(oContainer) {
  // Stick an absolutly positioned DIV over THEAD
  // Stick absolutely positioned DIVs for each TH
  var oTable=getChildElementByTagName(oContainer,'TABLE');
  var oTBody=oTable.tBodies[0];
  var oColGroup=getChildElementByTagName(oTable,'COLGROUP');
  var borderCollapsed=(oTable.currentStyle.borderCollapse=='collapse');
  var oThead=getChildElementByTagName(oTable,'THEAD');
  var oBody=document.body;
  var oDivThead=document.createElement('DIV');
  var oDivTH=new Array();
  
  for (var i=0;i<oThead.rows.length;i++) {
    var oTR=oThead.rows[i];
    oDivTH[i]=new Array();
    for (var j=0;j<oTR.cells.length;j++) {
      var oTH=oTR.cells[j];   
      oDivTH[i][j]=document.createElement('DIV');
      oDivTH[i][j].innerHTML=oTH.innerHTML;
      oDivTH[i][j].forTH=oTH;
      fixate(oDivTH[i][j],oTH);
      oDivThead.appendChild(oDivTH[i][j]);
    }
  }

  var prop=new Array('borderTopStyle','borderTopColor','borderTopWidth','borderLeftStyle','borderLeftColor','borderLeftWidth','borderRightStyle','borderRightColor','borderRightWidth');
  for (var i=0;i<prop.length;i++) {
    oDivThead.style[prop[i]]=oTable.currentStyle[prop[i]];
  }
  
  oDivThead.style.backgroundColor='white';
  oDivThead.style.zIndex=1;
  oDivThead.className='clsNoPrint';

  oDivThead.forTable=oTable;
  oTable.theadFixed=oDivThead;

  oDivThead.style.position='absolute';  
  oDivThead.style.pixelWidth=oThead.offsetWidth+parseInt(oTable.currentStyle.borderLeftWidth)+parseInt(oTable.currentStyle.borderRightWidth);
  oDivThead.style.pixelHeight=oThead.offsetHeight+parseInt(oTable.currentStyle.borderTopWidth);
  
  oDivThead.style.pixelTop=getPixelTop(oTable)+oContainer.clientTop+oContainer.scrollTop;
  oDivThead.style.pixelLeft=getPixelLeft(oTable)+oContainer.clientLeft;

  oBody.appendChild(oDivThead);

  oTable.attachEvent('onresize',resize);
  window.attachEvent('onresize',resize);

function resize() {
  for (var i=0;i<oThead.rows.length;i++) {
    var oTR=oThead.rows[i];
    for (var j=0;j<oTR.cells.length;j++) {
      var oTH=oTR.cells[j];
      var borderWidth=parseInt(oTH.currentStyle.borderWidth);
      if ( borderWidth%2 == 0 ) {
	var borderBottomWidth=borderWidth/2;
      } else {
	var borderBottomWidth=Math.floor(borderWidth/2);
      }
      oDivTH[i][j].style.pixelWidth=oTH.offsetWidth;
      if ( borderCollapsed &&  i == oThead.rows.length -1 ) {
	// Last Row
	oDivTH[i][j].style.pixelHeight=oTH.offsetHeight+Math.ceil(borderWidth/2);
      } else {
	oDivTH[i][j].style.pixelHeight=oTH.offsetHeight;
      }
      oDivTH[i][j].style.top = oTH.offsetTop-oTable.clientTop;
      oDivTH[i][j].style.left = oTH.offsetLeft-oTable.clientLeft;
    }
  }
  // Thead
  oDivThead.style.pixelWidth=oThead.offsetWidth+parseInt(oTable.currentStyle.borderLeftWidth)+parseInt(oTable.currentStyle.borderRightWidth);
  oDivThead.style.pixelHeight=oThead.offsetHeight+parseInt(oTable.currentStyle.borderTopWidth);
  oDivThead.style.pixelTop=getPixelTop(oTable)+oContainer.clientTop+oContainer.scrollTop;
  oDivThead.style.pixelLeft=getPixelLeft(oTable)+oContainer.clientLeft;

  // If a col element is hidden then hide the corresponding visible div elements. 
  // If a col element is visible then show the corresponding hidden div elements. 
  jQuery(oColGroup).find("col:hidden").each(function() {
    var col_index = jQuery(this).index() + 1;
    var offset = 0;
    jQuery("tr", oThead).each(function() {
    	div_index = col_index + offset;
	jQuery("div:nth-child(" + div_index + "):visible", oDivThead).hide();	
	offset += jQuery(this).children("th").length;
    });
  });
   jQuery(oColGroup).find("col:visible").each(function() {
    var col_index = jQuery(this).index() + 1;
    var offset = 0;
    jQuery("tr", oThead).each(function() {
        div_index = col_index + offset;
	jQuery("div:nth-child(" + div_index + "):hidden", oDivThead).show();	
	offset += jQuery(this).children("th").length; 
    });
  });
}

function fixate(oDiv,oTH) {
  // copy the style of oTH to oDiv
  
  if ( borderCollapsed ) {
    // BORDER COLLAPSE
    var oThead=getContainingElmt(oTH,"THEAD");
    var oRow=getContainingElmt(oTH,"TR");
    var rows=oThead.rows.length - 1;
    var cells=oRow.cells.length - 1;
    var rowIndex=oRow.rowIndex;
    var cellIndex=oTH.cellIndex;
    if (isNaN(parseInt(oTH.currentStyle.borderWidth))) {
      var borderWidth=0;
    } else {
      var borderWidth=parseInt(oTH.currentStyle.borderWidth);
    }
    if ( borderWidth%2 == 0 ) {
      // Even
      var borderTopWidth=borderWidth/2;
      var borderRightWidth=borderWidth/2;
      var borderBottomWidth=borderWidth/2;
      var borderLeftWidth=borderWidth/2;
    } else {
      // Odd
      var borderTopWidth=Math.ceil(borderWidth/2);
      var borderLeftWidth=Math.ceil(borderWidth/2);
      var borderBottomWidth=Math.floor(borderWidth/2);
      var borderRightWidth=Math.floor(borderWidth/2);
    }
    // Top Row
    if ( rowIndex == 0 ) {
      oDiv.style.borderTopWidth='0px';
    } else {
      oDiv.style.borderTopWidth=borderTopWidth;
    }
    // Right Boundary
    if ( cellIndex == cells ) {
      oDiv.style.borderRightWidth='0px';
    } else {
      oDiv.style.borderRightWidth=borderRightWidth;
    }
    // Bottom
    if ( rowIndex == rows ) {
      oDiv.style.borderBottomWidth=borderWidth;
    } else {
      oDiv.style.borderBottomWidth=borderBottomWidth;
    }
    // Left
    if ( cellIndex == 0 ) {
      oDiv.style.borderLeftWidth='0px';
    } else {
      oDiv.style.borderLeftWidth=borderLeftWidth;
    }
  } else {
    oDiv.style.borderWidth=oTH.currentStyle.borderWidth;
  }
  
  var prop=new Array('borderStyle','borderColor','marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft','textAlign','verticalAlign','fontSize','fontWeight','visibility','display');
  for (var i=0;i<prop.length;i++) {
    oDiv.style[prop[i]]=oTH.currentStyle[prop[i]];
  }
  // display not allways correct
  if ( oTH.offsetWidth==0) {
    oDiv.style.display='none';
  }
  if ( oTH.currentStyle.backgroundColor=='transparent' ) {
    oDiv.style.backgroundColor='white';
  } else {
    oDiv.style.backgroundColor=oTH.currentStyle.backgroundColor;
  }	

  oDiv.style.position='absolute';  
  oDiv.style.pixelWidth=oTH.offsetWidth;
  if ( borderCollapsed && rowIndex == rows ) {
    oDiv.style.pixelHeight=oTH.offsetHeight+ Math.ceil(borderWidth/2);
  } else {
    oDiv.style.pixelHeight=oTH.offsetHeight;
  }
  
  oDiv.style.top = oTH.offsetTop-oTable.clientTop;
  oDiv.style.left = oTH.offsetLeft-oTable.clientLeft;
  
  oDiv.style.zIndex=2; 
  //oDiv.className='clsNoPrint';
 
  return oDiv;
}

 // END
}

function window.onbeforeprint() {
  var divs=document.body.getElementsByTagName('DIV');
  for(var i=0;i<divs.length;i++) {
    var oDiv=divs[i];
    if ( oDiv.className == 'clsNoPrint') {
      oDiv.style.display='none';
    }
    if ( oDiv.className == 'clsScroll' ||  oDiv.className == 'clsDbGridDiv' ) {
      oDiv.savedOverflowX= oDiv.currentStyle.overflowX;
      oDiv.style.overflowX='visible';
    }
  }
}

function window.onafterprint() {
  var divs=document.body.getElementsByTagName('DIV');
  for(var i=0;i<divs.length;i++) {
    var oDiv=divs[i];
    if ( oDiv.className == 'clsNoPrint') {
      oDiv.style.display='block';
    }
    if ( oDiv.className == 'clsScroll' ||  oDiv.className == 'clsDbGridDiv' ) {
      oDiv.style.overflowX=oDiv.savedOverflowX;
    }
  }
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


