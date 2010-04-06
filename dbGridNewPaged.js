
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
