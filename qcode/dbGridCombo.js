function dbGridCombo(callback) {
    // vars
    var editor = $('<input type="text">')
	.addClass('dbEditorCombo')
	.css({
	    'position': "absolute", 
	    'background': "white", 
	    'overflow': "visible", 
	    '-moz-box-sizing': "content-box", 
	    '-ms-box-sizing': "content-box", 
	    'box-sizing': "content-box", 
	    'z-index': 1
	})
	.hide();
    var comboOptions = $('<div>')
	.addClass('dbEditorComboOptions')
	.appendTo(document.body)
	.css({
	    'position':'absolute',
	    'background': "white", 
	    'overflow':'auto',
	    'border-width':'1px',
	    'border-style':'solid',
	    'border-color':'black',
	    'height':'150px',
	    'z-index': 1	    
	})
	.hide();
    var _searchURL;
    var _lastValue;

    // Events
    editor.on({
	'keydown': inputOnKeyDown,
	'keyup': inputOnKeyUp
    });
    comboOptions.on('mouseup', 'div', comboOptionMouseUp);
    comboOptions.on('mouseenter', 'div', comboOptionMouseEnter);

    // Set up dbGrid handlers
    oComboOptions = comboOptions.get(0);
    oInput = editor.get(0);
    oInput.getType = getType;
    oInput.getValue = getValue;
    oInput.show = show;
    oInput.hide = hide;
    oInput.selectText = selectText;
    oInput.destroy = destroy;

    return oInput;

    function getType() {
	return 'combo';
    }

    function show(oTD,value,searchURL) {
	// copy the style of oTD onto oInput
	var oTable = getContainingElmt(oTD,'TABLE');
	if ( oTable.currentStyle.borderCollapse == 'collapse' ) {
	    // BORDER COLLAPSE
	    var oTBody = getContainingElmt(oTD,"TBODY");
	    var oRow = getContainingElmt(oTD,"TR");
	    var rows = oTBody.rows.length - 1;
	    var cells = oRow.cells.length - 1;
	    var rowIndex = oRow.sectionRowIndex;
	    var cellIndex = oTD.cellIndex;
	    var borderWidth = parseInt(oTD.currentStyle.borderWidth);
	    if ( borderWidth%2 == 0 ) {
		// Even
		var borderTopWidth = borderWidth/2;
		var borderRightWidth = borderWidth/2;
		var borderBottomWidth = borderWidth/2;
		var borderLeftWidth = borderWidth/2;
	    } else {
		// Odd
		var borderTopWidth = Math.ceil(borderWidth/2);
		var borderLeftWidth = Math.ceil(borderWidth/2);
		var borderBottomWidth = Math.floor(borderWidth/2);
		var borderRightWidth = Math.floor(borderWidth/2);
	    }
	    // Top Row
	    if ( rowIndex == 0 ) {
		oInput.style.borderTopWidth = '0px';
	    } else {
		oInput.style.borderTopWidth = borderTopWidth;
	    }
	    // Right Boundary
	    if ( cellIndex == cells ) {
		oInput.style.borderRightWidth = '0px';
	    } else {
		oInput.style.borderRightWidth = borderRightWidth;
	    }
	    // Bottom
	    if ( rowIndex == rows ) {
		oInput.style.borderBottomWidth = '0px';
	    } else {
		oInput.style.borderBottomWidth = borderBottomWidth;
	    }
	    // Left
	    if ( cellIndex == 0 ) {
		oInput.style.borderLeftWidth = '0px';
	    } else {
		oInput.style.borderLeftWidth = borderLeftWidth;
	    }
	} else {
	    oInput.style.borderWidth = oTD.currentStyle.borderWidth;
	}
	oInput.style.borderStyle = oTD.currentStyle.borderStyle;
	oInput.style.borderColor = oTD.currentStyle.borderColor;
	
	oInput.style.marginTop = oTD.currentStyle.marginTop;
	oInput.style.marginRight = oTD.currentStyle.marginRight;
	oInput.style.marginBottom = oTD.currentStyle.marginBottom;
	oInput.style.marginLeft = oTD.currentStyle.marginLeft;
	
	oInput.style.paddingTop = oTD.currentStyle.paddingTop;
	oInput.style.paddingRight = oTD.currentStyle.paddingRight;
	oInput.style.paddingBottom = oTD.currentStyle.paddingBottom;
	oInput.style.paddingLeft = oTD.currentStyle.paddingLeft;
	
	oInput.style.textAlign = oTD.currentStyle.textAlign;
	oInput.style.verticalAlign = oTD.currentStyle.verticalAlign;
	oInput.style.fontSize = oTD.currentStyle.fontSize;
	oInput.style.fontFamily = oTD.currentStyle.fontFamily;
	if ( oTD.currentStyle.backgroundColor=='transparent' )	{
	    oInput.style.backgroundColor='white';
	} else {
	    oInput.style.backgroundColor=oTD.currentStyle.backgroundColor;
	}	
	
	oInput.style.pixelWidth = oTD.offsetWidth;
	oInput.style.pixelHeight = oTD.offsetHeight;
	oInput.style.pixelTop = getContainerPixelTop(oTD);
	oInput.style.pixelLeft = getContainerPixelLeft(oTD);
	editor.show();

	oComboOptions.style.borderColor=oTD.currentStyle.borderColor;
	oComboOptions.style.paddingLeft = oTD.currentStyle.paddingLeft;
	oComboOptions.style.paddingRight = oTD.currentStyle.paddingRight;
	oComboOptions.style.width = oInput.offsetWidth;
	oComboOptions.style.height = 150;
	oComboOptions.style.pixelTop = getPixelTop(oInput) + oInput.offsetHeight;
	// I think IE has a bug that prevents offsetLeft/offsetParent from
	// correctly calculating position. The width of the container div border
	// is 3 pixels hence the hack.
	oComboOptions.style.pixelLeft = getPixelLeft(oInput)+3;
	
	if ( searchURL == undefined ) { throw "searchURL must be defined" }
	editor.val(value);
	_lastValue = value;
	_searchURL = searchURL;
    }

    function hide() {
	comboOptions.hide();
	editor.hide();
    }

    function getValue() {
	return editor.val();
    }

    function selectText() {
	var rng = oInput.createTextRange();
	rng.select();
    }

    function inputOnKeyDown(e) {
	if (e.keyCode == 38) {
	    // Up Arrow
	    if ( comboOptions.is(':visible') ) {
		// navigate within comboOptions if it is visible
		var index = comboOptions.children('.selected').prev().index();
		if ( index !== -1 ) {
		    selectOption(index);
		}
		return true
	    } else {
		callback(window.event);
	    }
	}
	if (e.keyCode == 40) {
	    // Down Arrow
	    if ( comboOptions.is(':visible') ) {
		// navigate within comboOptions if it is visible
		var index = comboOptions.children('.selected').next().index();
		if ( index !== -1 ) {
		    selectOption(index);
		}
		return true
	    } else {
		callback(window.event);
	    }
	}
	if (e.keyCode == 37 && atEditStart(oInput)) {
	    // Left Arrow
	    callback(window.event);
	}
	if (e.keyCode == 39 && atEditEnd(oInput) ) {
	    // Right Arrow
	    callback(window.event);
	}
	if (e.keyCode == 9 || e.keyCode == 13) {
	    // TAB or Return
	    if ( comboOptions.is(':visible') ) {
		// Update editor with the selected comboOption
		var option = comboOptions.children('.selected');
		if ( option.index() !== -1 ) {
		    editor.val(option.text());
		    _lastValue = option.text();
		}
		comboOptions.hide();
	    } 
	    callback(window.event);
	}
	if (e.keyCode == 46) {
	    // Delete
	    callback(window.event)
	}
	if ( e.keyCode == 83 && e.ctrlKey ) {
	    // Ctrl+S
	    callback(window.event);
	}
    }

    function inputOnKeyUp(e) {
	if ( editor.val() != _lastValue ) {
	    _lastValue = editor.val();
	    search();
	}
	callback(window.event)
    }

    function comboOptionMouseUp(e) {
	var option = $(e.currentTarget);

	selectOption(option.index());
	comboOptions.hide();
	editor.val(option.text());
	_lastValue = option.text();
	// Move cursor to end of Input
	var rng = oInput.createTextRange();
	rng.collapse(false);
	rng.select();
    }
    function comboOptionMouseEnter(e) {
	// Select the target option
	var option = $(e.currentTarget);
	selectOption(option.index());
    }

    function selectOption(index) {
	// Select the option for this 0-based index
	comboOptions.children('.selected').removeClass('selected');
	comboOptions.children(':nth-child(' + (index + 1) + ')').addClass('selected');
    }

    
    function search() {
	// Server side search for available options
	comboOptions.show().text("Searching ...");
	
	jQuery.ajax({
	    url: _searchURL,
	    data: {
		value: getValue()
	    },
	    dataType: 'xml',
	    async: false,
	    cache: false,
	    success: function(data) {
		searchReturn(data)
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
		comboOptions.text("Software Bug ! " + textStatus + ': ' + errorThrown);
	    }   
	});
    }

    function searchReturn(xmlDoc) {
	// Populate comboOptions element with server response
	comboOptions.empty();

	var rec = jQuery('error:first', xmlDoc);
	if ( rec.size() ) {
	    // Error returned by Server
	    comboOptions.text(rec.text());
	} else {
	    // Success
	    var recs = jQuery('records > record > option', xmlDoc);
	    if ( recs.size() ) {
		// Matches Found
		recs.each(function() {
		    var comboOption = jQuery('<div>')
			.text($(this).text())
			.css({
			    'width': '100%',
			    'cursor': 'pointer'
			})
			.appendTo(comboOptions);
		});
		// selectOption first option
		selectOption(0);
	    } else {
		// No Matches
		comboOptions.text("No Matches");
	    }
	}
    }

    function getContainerPixelLeft(elem) {
	var left = 0;
	while (elem.tagName != 'DIV' && elem.tagName !='BODY') {
	    left += elem.offsetLeft - elem.scrollLeft;
	    elem = elem.offsetParent;
	}
	return left;
    }
    function getContainerPixelTop(elem) {
	var top = 0;
	while (elem.tagName != 'DIV' && elem.tagName !='BODY') {
	    top += elem.offsetTop - elem.scrollTop;
	    elem = elem.offsetParent;
	}
	return top;
    }

    function destroy() {
	editor.remove();
	comboOptions.remove();
    }

    //
}