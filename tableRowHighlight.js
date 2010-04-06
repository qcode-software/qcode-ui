function tableRowHighlight(oTable) {
	var oTBody = oTable.tBodies[0];
	oTBody.attachEvent('onclick',onClick);

	function onClick() {
		var exception;
		var elmt =window.event.srcElement;
	
		try {
			var oTR = getContainingElmt(elmt,'TR');
		} catch(exception) {
			return false;
		}
		if ( oTR.style.backgroundColor == '' ) {
			oTR.style.backgroundColor='lemonchiffon';
		} else {
			oTR.style.backgroundColor = '';
		}
	}
}