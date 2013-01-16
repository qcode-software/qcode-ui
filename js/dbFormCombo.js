function dbFormCombo(oInput) {

// parameters
var searchURL = oInput.searchURL;
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
        var record = recs.selectSingleNode('record');
	oInput.value = record.childNodes[idx].text;
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
			var name = field.nodeName;
			var value = field.text;
			if (name == "option") {
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