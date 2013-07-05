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
      oMenu.className='sort-menu';
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
     if ( className == 'number' ||  className == 'money') {
       return 'NUMERIC';
     } else if ( className=='date' ) {
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
