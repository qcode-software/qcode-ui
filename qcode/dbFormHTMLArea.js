function dbFormHTMLArea(oDiv) {

var oDiv;
var oForm = getContainingElmt(oDiv,'FORM');
oForm.attachEvent('onsubmit',onSubmit);

function onSubmit() {
	var oInput = document.createElement('INPUT');
	oInput.type='hidden';
	oInput.name = oDiv.name;
	oInput.value= oDiv.innerHTML;
	oForm.appendChild(oInput);
}

// End 
}