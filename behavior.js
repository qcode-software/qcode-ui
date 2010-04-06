function behave() {
  var divs = document.body.getElementsByTagName('DIV');
  for(var i=0;i<divs.length;i++) {
    var oDiv = divs[i];
    if ( oDiv.className == 'clsDbGridDivStatus') {
      dbGridDivStatus(oDiv);
    }
    if ( oDiv.className == 'clsOrderPreview' || oDiv.className == 'clsResizeable') {
      resizeHeight(oDiv);
    }
    if ( oDiv.className == 'clsDbFormHTMLArea') {
      dbFormHTMLArea(oDiv);
    }
    if ( oDiv.className == 'clsScroll' ||  oDiv.className == 'clsDbGridDiv' ) {
      theadFixed(oDiv);
    }
    if ( oDiv.className == 'clsDbCells') {
      dbCells(oDiv);
    }
  }
  var tables = document.body.getElementsByTagName('TABLE');
  for(var i=0;i<tables.length;i++) {
    var oTable = tables[i];
    if ( oTable.className == 'clsDbGrid') {
      dbGrid(oTable);
      dbHeader(oTable);
    }
    if ( oTable.className == 'clsDbFlexGrid') {
      dbGrid(oTable);
    }
    if ( oTable.className == 'clsDbList') {
      dbList(oTable);
    }
    if ( oTable.className == 'clsFlexGrid') {
      tableRowHighlight(oTable);
    }
  }
  var forms = document.body.getElementsByTagName('FORM');
  for(var i=0;i<forms.length;i++) {
    var oForm = forms[i];
    if ( oForm.className == 'clsDbForm') {
      dbForm(oForm);
    }
    if ( oForm.className == 'clsSearch') {
      formFocus(oForm);
    }
  }
  
  var inputs = document.body.getElementsByTagName('INPUT');
  for(var i=0;i<inputs.length;i++) {
    var oInput = inputs[i];
    if ( oInput.className == 'clsDbFormCombo') {
      dbFormCombo(oInput);
    }
  }
  
  var spans = document.body.getElementsByTagName('SPAN');
  for(var i=0;i<spans.length;i++) {
    var oSpan = spans[i];
    if ( oSpan.className == 'clsSort') {
      thSortMenu(oSpan);
    }
  }

  //document.attachEvent('onkeydown',accessKey);
}
