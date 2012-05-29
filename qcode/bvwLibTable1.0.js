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