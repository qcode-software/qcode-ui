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