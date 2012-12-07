// DbGridCombo Class Constructor 
var DbGridCombo = function(callback, container) {
  var dbGridCombo = this;
  
  var combo = jQuery('<input>');
  combo.attr('type','text');
  combo.css({
    'position':'absolute',
    'visibility':'hidden'
  });
  container.append(combo);

  var comboDiv = jQuery('<div>');
  comboDiv.css({
    'border-width':'1px',
    'border-style':'solid',
    'border-color':'black',
    'background-color':'white',
    'position':'absolute',
    'overflow':'auto',
    'visibility':'hidden'
  });
  container.append(comboDiv);


  // Public Properties
  dbGridCombo.callback = callback;
  dbGridCombo.combo = combo;
  dbGridCombo.comboDiv = comboDiv; // The dropdown container
  dbGridCombo.xmlDoc;
  dbGridCombo.currentItem = jQuery([]); // The highlighted row selected
  dbGridCombo.lastValue;
  dbGridCombo._name;
  dbGridCombo._value;
  dbGridCombo._boundValue;
  dbGridCombo._boundName;
  dbGridCombo._searchURL;

  // Events  	
  combo.on('keydown.dbGridCombo', function(e) {
    dbGridCombo.inputOnKeyDown(e);
  });
  combo.on('keyup.dbGridCombo', function(e) {
    dbGridCombo.inputOnKeyUp(e);
  });
  combo.on('blur.dbGridCombo', function(e) {
    dbGridCombo.inputOnBlur(e);
  });
};

/**********************************
 * Public DbGridCombo Methods Start
 **********************************/ 
DbGridCombo.prototype.getType = function() {
  return 'combo';
};
DbGridCombo.prototype.getValue = function() {
  return this._value;
};
DbGridCombo.prototype.getBoundName = function() {
  return this._boundName;
};
DbGridCombo.prototype.getBoundValue = function() {
  return this._boundValue;
};
DbGridCombo.prototype.getElmt = function() {
  return this.combo;
};
DbGridCombo.prototype.show = function(cell,name,value,boundName,boundValue,searchURL) {
  var row = cell.closest('tr');
  var table = row.closest('table');
  var combo = this.combo;
  var comboDiv = this.comboDiv;

  relativePosition = cell.positionRelativeTo(table);
  var top = relativePosition.top;
  var left = relativePosition.left;
  height = cell.height();
  width = cell.width();
  
  if ( cell.css('backgroundColor') != 'transparent' ) {
    backgroundColor = cell.css('background-color');
  } else if ( row.css('background-color') != 'transparent' ) {
    backgroundColor = row.css('background-color');
  } else {
    backgroundColor = 'white';
  }

  var borderTopWidth = parseInt(cell.css('border-top-width'));
  var borderRightWidth = parseInt(cell.css('border-right-width'));
  var borderBottomWidth = parseInt(cell.css('border-bottom-width'));
  var borderLeftWidth = parseInt(cell.css('border-left-width'));

  var borderTopColor = cell.css('border-top-color');
  var borderRightColor = cell.css('border-right-style');
  var borderBottomColor = cell.css('border-bottom-color');
  var borderLeftColor = cell.css('border-left-color');


  if ( table.css('border-collapse') == 'collapse' ) {
    if ( borderTopWidth%2 == 0 ) {
      var borderTopWidth = borderTopWidth/2;
    } else {
      var borderTopWidth = Math.ceil(borderTopWidth/2);
    }
    
    if ( borderRightWidth%2 == 0 ) {
      var borderRightWidth = borderRightWidth/2;
    } else {
      var borderRightWidth = Math.ceil(borderRightWidth/2);
    }

    if ( borderBottomWidth%2 == 0 ) {
      var borderBottomWidth = borderBottomWidth/2;
    } else {
      var borderBottomWidth = Math.ceil(borderBottomWidth/2);
    }

    if ( borderLeftWidth%2 == 0 ) {
      var borderLeftWidth = borderLeftWidth/2;
    } else {
      var borderLeftWidth = Math.ceil(borderLeftWidth/2);
    }

    top -=  borderTopWidth;
    left -= borderLeftWidth;
    height +=  borderTopWidth;
    width +=  borderLeftWidth;
  } 

  var paddingTop = cell.css('padding-top');
  var paddingRight = cell.css('padding-right');
  var paddingBottom = cell.css('padding-bottom');
  var paddingLeft = cell.css('padding-left');

  // get styles applied to td
  var comboStyles = {
    'border-top-width': borderTopWidth,
    'border-right-width': borderRightWidth,
    'border-bottom-width': borderBottomWidth,
    'border-left-width': borderLeftWidth,

    'border-top-style': cell.css('border-top-style'),
    'border-right-style': borderRightColor,
    'border-bottom-style': cell.css('border-bottom-style'),
    'border-left-style': cell.css('border-left-style'),

    'border-top-color': borderTopColor,
    'border-right-color': borderRightColor,
    'border-bottom-color': borderBottomColor,
    'border-left-color': borderLeftColor,

    'margin-top': cell.css('margin-top'),
    'margin-right': cell.css('margin-right'),
    'margin-bottom': cell.css('margin-bottom'),
    'margin-left': cell.css('margin-left'),
    
    'padding-top': paddingTop,
    'padding-right': paddingRight,
    'padding-bottom': paddingBottom,
    'padding-left': paddingLeft,
    
    'text-align': cell.css('text-align'),
    'vertical-align': cell.css('vertical-align'),
    'font-size': cell.css('font-size'),
    'font-family': cell.css('font-family'),

    'top': top,
    'left': left,
    'width': width,
    
    'background-color': backgroundColor,

    'visibility': 'visible'
  };
  // copy td styles onto combo
  combo.css(comboStyles);
  // adjust padding & height css properties to make combo the same height as the cell.
  // If we use only height property we can not vertical align text inside combo element
  var comboVerticalAlign = combo.css('vertical-align')
  if ( comboVerticalAlign == 'top' ) {
    combo.css('padding-bottom', parseInt(cell.css('padding-bottom')) + parseInt(cell.css('height')) - parseInt(combo.css('height')));
  } else if ( comboVerticalAlign == 'bottom' ) {
    combo.css('padding-top', parseInt(cell.css('padding-top')) + parseInt(cell.css('height')) - parseInt(combo.css('height'))) ;
  } else {
    combo.css('height', height);
  }

  var comboDivStyles = {
    'border-top-color': borderTopColor,
    'border-right-color': borderRightColor,
    'border-bottom-color': borderBottomColor,
    'border-left-color': borderLeftColor,

    'padding-right': paddingRight,
    'padding-left': paddingLeft,

    'width': width,
    'height': 150,

    'top': top + height,
    'left': left
  };
  // copy td styles onto comboDiv
  comboDiv.css(comboDivStyles);

  if ( searchURL == undefined ) { throw "searchURL must be defined" }
  if ( boundName == undefined ) { throw "boundName must be defined" }
  if ( name == undefined ) { throw "name must be defined" }
  this._name = name;
  this._value = value;
  this.lastValue = value;
  this._searchURL = searchURL;
  this._boundName = boundName;
  this._boundValue = boundValue;
  
  combo.val(value);
};
DbGridCombo.prototype.hide = function() {
  this.combo.css('visibility','hidden');
  this.comboDiv.css('visibility','hidden');
};
DbGridCombo.prototype.selectText = function(option) {
  if ( option == 'end') {
    this.combo.textrange('set', 'end');
  }
  if ( option == 'start' ) {
    this.combo.textrange('set', 'start');
  }
  if ( option == undefined || option == 'all' ) {
    this.combo.textrange('set', 'all');
  }
};
DbGridCombo.prototype.inputOnKeyDown = function(e) {
  // Decide whether to callback event.
  if ( this.currentItem.size() ) {
    active = true;
  } else {
    active = false;
  } 
  var textrangeData = this.combo.textrange('get');
  if ( e.which == 38 ) {
    // Up Arrow
    if ( active ) {
      var idx = this.currentItem.index();
      if ( idx !=0 ) {
	this.highlight(idx-1);
      }
    } else {
      this.callback(e);
    }
  }
  if ( e.which == 40 ) {
    // Down Arrow
    if ( active ) {
      var idx = this.currentItem.index();
      if ( idx != this.comboDiv.children().size() -1 ) {
	this.highlight(idx+1);
      }
    } else {
      this.callback(e);
    }
  }
  if ( e.which == 37 && textrangeData.selectionAtStart ) {
    // Left Arrow
    this.callback(e);
  }
  if ( e.which == 39 && textrangeData.selectionAtEnd ) {
    // Right Arrow
    this.callback(e);
  }
  if ( e.which == 9 || e.which == 13 ) {
    // TAB or Return
    this.callback(e);
  }
  if ( e.which == 46 ) {
    // Delete
    this.callback(e)
  }
  if ( e.which == 83 && e.ctrlKey ) {
    // Ctrl+S
    this.callback(e);
  }
};
DbGridCombo.prototype.inputOnKeyUp = function(e) {
  if ( this.combo.val() != this.lastValue ) {
    this.lastValue = this.combo.val();
    this.search();
  }
  this.callback(e)  
};
DbGridCombo.prototype.inputOnBlur = function(e) {
  var activeElmt = jQuery(document.activeElement);
  if ( !this.comboDiv.is(activeElmt) && !this.comboDiv.find(activeElmt).size()  ) {
    if ( this.currentItem.size() ) {
      var idx = this.currentItem.index();
      this.select(idx);
      // trigger key up event to set row to dirty
      this.combo.trigger('keyup.dbGridCombo');
    }
    this.comboDivHide();
    this.currentItem = jQuery([]);
  }
};
DbGridCombo.prototype.comboDivHide = function() {
  this.comboDiv.css('visibility','hidden');
  this.currentItem = jQuery([]);
};
DbGridCombo.prototype.comboDivShow = function() {
  this.comboDiv.css({
    'visibility':'visible',
    'display':'block'
  });
};
DbGridCombo.prototype.comboDivOnClick = function(e) {
  var targetElmt = jQuery(e.target);
  if ( !targetElmt.is(this.comboDiv) ) {
    var idx = targetElmt.index();
    this.select(idx);
    // trigger key up event to set row to dirty
    this.combo.trigger('keyup.dbGridCombo');
  }
};
DbGridCombo.prototype.comboDivOnMouseOver = function(e) {
  var targetElmt = jQuery(e.target);
  if ( !targetElmt.is(this.comboDiv) ) {
    var idx = targetElmt.index();
    this.highlight(idx);
  }
};
DbGridCombo.prototype.select = function(idx) {
  this.combo.val(this._value);
  this.lastValue = this._value;
  this.comboDivHide();
  // Move cursor to end of Input
  this.selectText('end');
};
DbGridCombo.prototype.highlight = function(idx) {
  var rec = jQuery('records record', this.xmlDoc).eq(idx);
  this._value = jQuery(this._name + ':first', rec).text();
  this._boundValue = jQuery(this._boundName + ':first', rec).text();

  this.currentItem.css({
    'background-color': '',
    'color':''
  });
  this.currentItem = this.comboDiv.children().eq(idx);
  this.currentItem.css({
    'background-color':'highlight',
    'color':'highlighttext'
  });
};
DbGridCombo.prototype.search = function() {
  //TODO
  dbGridCombo = this;
  comboDiv = dbGridCombo.comboDiv;

  dbGridCombo.currentItem = jQuery([]);
  comboDiv.text("Searching ...");
  dbGridCombo.comboDivShow();

  comboDiv.off('click.dbGridCombo');
  comboDiv.off('mouseover.dbGridCombo');
 
  jQuery.ajax({
    url: dbGridCombo._searchURL,
    data: {
      name: dbGridCombo._name,
      value: dbGridCombo.combo.val(),
      boundName: dbGridCombo._boundName
    },
    dataType: 'xml',
    async: false,
    cache: false,
    success: function(data) {
      dbGridCombo.searchReturn(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      comboDiv.text("Software Bug ! " + textStatus + ': ' + errorThrown);
    }   
  });
};
DbGridCombo.prototype.searchReturn = function(xmlDoc) {
  this.xmlDoc = xmlDoc;
  var rec = jQuery('error:first', xmlDoc);
  if ( rec.size() ) {
    // Error returned by Server
    var error=rec.text;
    this.comboDiv.text(rec.text());
  } else {
    // Success
    var recs = jQuery('records record', xmlDoc);
    if ( recs.size() ) {
      // Matches Found
      this.updateList(recs);
    } else {
      // No Matches
      this.comboDiv.text("No Matches");
      this._value = "";
      this._boundValue = "";
    }
  }
};
DbGridCombo.prototype.updateList = function(recs) {
  dbGridCombo = this;
  comboDiv = dbGridCombo.comboDiv;

  comboDiv.html('');

  comboDiv.on('click.dbGridCombo', function(e) {
    dbGridCombo.comboDivOnClick(e);
  });
  comboDiv.on('mouseover.dbGridCombo', function(e) {
    dbGridCombo.comboDivOnMouseOver(e);
  });
  for(var i=0;i<recs.size();i++) {
    var rec = recs.eq(i);
    for(var j=0;j<rec.children().size();j++) {
      var field = rec.children().eq(j);
      var name= field.prop("nodeName");
      var value = field.text();
      if (name == dbGridCombo._name ) {
	var item = jQuery('<div>');
	item.css({
	  'width': '100%',
	  'cursor': 'pointer'
	});
	item.text(value);
	comboDiv.append(item);
      }
    }
  }
  
  dbGridCombo.currentItem = comboDiv.children().first();
  dbGridCombo.highlight(0);
};
DbGridCombo.prototype.destroy = function() {
  this.combo.remove();
  this.comboDiv.remove();
};
/**********************************
 * Public DbGridCombo Methods End
 **********************************/
