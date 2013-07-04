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
    if ( oCell.className == 'db-cell') {
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
  while (oNode.className!='db-cell' && oNode.parentNode) {
    oNode = oNode.parentNode;
  }
  if (oNode.className == 'db-cell') {
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
