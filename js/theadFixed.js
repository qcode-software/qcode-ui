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
  oDivThead.className='no-print';

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

$(window).on('beforeprint', function() {
  var divs=document.body.getElementsByTagName('DIV');
  for(var i=0;i<divs.length;i++) {
    var oDiv=divs[i];
    if ( oDiv.className == 'no-print') {
      oDiv.style.display='none';
    }
    if ( oDiv.className == 'scroll' ||  oDiv.className == 'db-grid-wrapper' ) {
      oDiv.savedOverflowX= oDiv.currentStyle.overflowX;
      oDiv.style.overflowX='visible';
    }
  }
});

$(window).on('afterprint', function() {
  var divs=document.body.getElementsByTagName('DIV');
  for(var i=0;i<divs.length;i++) {
    var oDiv=divs[i];
    if ( oDiv.className == 'no-print') {
      oDiv.style.display='block';
    }
    if ( oDiv.className == 'scroll' ||  oDiv.className == 'db-grid-wrapper' ) {
      oDiv.style.overflowX=oDiv.savedOverflowX;
    }
  }
});

