function behave() {
    jQuery("div").each(function() {
	var oDiv = this;
	if ( jQuery(oDiv).is(".clsDbGridDivStatus") ) {
	    dbGridDivStatus(oDiv);
	}
	if ( jQuery(oDiv).is(".clsOrderPreview, .clsResizeable") ) {
	    resizeHeight(oDiv);
	}
	if ( jQuery(oDiv).is(".clsDbFormHTMLArea") ) {
	    dbFormHTMLArea(oDiv);
	}
	if ( jQuery(oDiv).is(".clsScroll, .clsDbGridDiv") ) {
      	    theadFixed(oDiv);
	}
	if ( jQuery(oDiv).is(".clsDbCells") ) {
	    dbCells(oDiv);
	}
    });    
    jQuery("table").each(function() {
	var oTable = this;
	if ( jQuery(oTable).is(".clsDbGrid") ) {
	    dbGrid(oTable);
	    dbHeader(oTable);
	}
	if ( jQuery(oTable).is(".clsDbFlexGrid") ) {
	    dbGrid(oTable);
	}
	if ( jQuery(oTable).is(".clsDbList") ) {
	    dbList(oTable);
	}
	if ( jQuery(oTable).is(".clsFlexGrid, .rowHighlight") ) {
	    tableRowHighlight(oTable);
	}
    });    
    jQuery("form").each(function() {
	var oForm = this;
	if ( jQuery(oForm).is(".clsDbForm") ) {
	    dbForm(oForm);
	}
	if ( jQuery(oForm).is(".clsSearch") ) {
	    formFocus(oForm);
	}
    });    
    jQuery("input").each(function() {
	var oInput = this;
	if ( jQuery(oInput).is(".clsDbFormCombo") ) {
	    dbFormCombo(oInput);
	}
    });    
    jQuery("span").each(function() {
	var oSpan = this;
	if ( jQuery(oSpan).is(".clsSort") ) {
	    thSortMenu(oSpan);
	}
    });    
    if ( typeof(accessKey)=='function' ) {
	jQuery(document).keydown(accessKey);
    }  
    jQuery("div").each(function() {
	var oDiv = this;
	if ( jQuery(oDiv).is(".dynamicResize") ) {
	    dynamicResize(oDiv);
	}
    }); 
}