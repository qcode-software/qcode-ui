function accessKey() {
	var e = window.event;
	// Global Key bindings
	if (e.ctrlKey && e.keyCode == 48) {
		// Ctrl+0
		document.location = 'menu1_sales.html';
		return false;
	}
	if (e.ctrlKey && e.keyCode == 49) {
		// Ctrl+1
		document.location = 'sales_order_new_form.html';
		return false;
	}
	if (e.ctrlKey && e.keyCode == 50) {
		// Ctrl+2
		document.location = 'customer_select.html';
		return false;
	}
	if (e.ctrlKey && e.keyCode == 51) {
		// Ctrl+3
		document.location = 'sales_account_select.html';
		return false;
	}
	if (e.ctrlKey && e.keyCode == 52) {
		// Crtl+4
		document.location = 'product_select.html';
		return false;
	}
	if (e.ctrlKey && e.keyCode == 54) {
		// Ctrl+6
		document.location = 'sales_order_select.html';
		return false;
	}
	if ( e.altKey || e.ctrlKey ) {
		var keyChar =  String.fromCharCode(e.keyCode).toLowerCase();
		var hrefs = document.body.getElementsByTagName('A');
		for(var i=0;i<hrefs.length;i++) {
			// AccessKeys
			if (e.altKey && hrefs[i].accessKey.toLowerCase() == keyChar) {
				document.location = hrefs[i].href;
			}
			// ActionKeys
			if (e.ctrlKey && !e.altKey && hrefs[i].actionKey && hrefs[i].actionKey.toLowerCase() == keyChar) {
				// Must open a window to cancel accelerator keys
				e.returnValue = false;
				e.cancelBubble=true;
				e.keyCode = undefined;
				if (window.confirm('Are you sure you want to ' + hrefs[i].innerText)) {
					document.location = hrefs[i].href;
				}
				return false;
			}
		}
	}
	
}  

