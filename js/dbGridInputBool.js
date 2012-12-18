// DbGridInputBool Class Constructor 
var DbGridInputBool = function(callback, container) {
  var dbGridInputBool = this;

  var inputBool = jQuery('<div>');
  inputBool.attr('contentEditable',true);
  inputBool.css({
    'position':'absolute',
    'visibility':'hidden'
  });
  container.append(inputBool);

  // Properties
  dbGridInputBool.callback = callback;
  dbGridInputBool.inputBool = inputBool;
  
  // Events
  inputBool.on('keyup.dbGridInputBool', function(e) {
    dbGridInputBool.inputOnKeyUp(e)    
  });
  inputBool.on('keydown.dbGridInputBool', function(e) {
    dbGridInputBool.inputOnKeyDown(e)
  }); 
};

/************************************
 * Public DbGridInputBool Methods Start
 ************************************/
DbGridInputBool.prototype.getType = function() {
  return 'bool';
};
DbGridInputBool.prototype.getValue = function() {
  return parseBoolean(stripHTML(this.inputBool.html()));
};
DbGridInputBool.prototype.getElmt = function() {
  return this.inputBool;
};
DbGridInputBool.prototype.setTrue = function() {
  this.inputBool.html('<span class=clsTrue>Yes</span>');
};
DbGridInputBool.prototype.setFalse = function() {
  this.inputBool.html('<span class=clsFalse>No</span>');
};
DbGridInputBool.prototype.inputOnKeyDown = function(e) {
  // decide whether to propagate the event to the cell
  // using the callback function passed in
  var textrangeData = this.inputBool.textrange('get'); 
  out: {
    if ( e.which == 9 || e.which == 46 ) {
      // TAB or Delete
      this.callback(e)
      break out;
    }
    if ( e.which == 13 && ! e.shiftKey ) {
      // Return no shift
      this.callback(e)
      break out;
    }
    if ( e.which == 37 && textrangeData.selectionAtStart ) {
      // Left Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 38 && textrangeData.selectionAtStart ) {
      // Up Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 39 && textrangeData.selectionAtEnd ) {
      // Right Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 40 && textrangeData.selectionAtEnd ) {
      // Down Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 83 && e.ctrlKey ) {
      // Ctrl+S
      this.callback(e);
      break out;
    }
    // Default 
    // don't propagate
  }
};
DbGridInputBool.prototype.inputOnKeyUp = function(e) {
  out: {
    if ( e.which == 32 ) {
      // Spacebar
      if ( parseBoolean(stripHTML(oHTMLArea.innerHTML))) {
	this.setFalse();
      } else {
	this.setTrue();
      }
      break out;
    }
    
    if (  e.which==97 || e.which==49 || e.which==84 || e.which==89 ) {
      // keypad 1 or 1 or t or y
      this.setTrue();
      break out;
    }
    if (  e.which==96 || e.which==48 || e.which==70 || e.which==78 ) {
      // 0 or f or n
      this.setFalse();
      break out;
    }
  }
  // allways propagate
  this.callback(e);
};
DbGridInputBool.prototype.selectText = function(option) {
  if ( option == undefined || option == 'end') {
    this.inputBool.textrange('set', 'end');
  }
  if ( option == 'start' ) {
    this.inputBool.textrange('set', 'start');
  }
  if ( option == 'all' ) {
    this.inputBool.textrange('set', 'all');
  }
};
DbGridInputBool.prototype.show = function(cell,value) {
  var row = cell.closest('tr');
  var table = row.closest('table');
  var inputBool = this.inputBool;

  var relativePosition = cell.positionRelativeTo(table);
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

  // get styles applied to td
  var styles = {
    'border-top-width': borderTopWidth,
    'border-right-width': borderRightWidth,
    'border-bottom-width': borderBottomWidth,
    'border-left-width': borderLeftWidth,

    'border-top-style': cell.css('border-top-style'),
    'border-right-style': cell.css('border-right-style'),
    'border-bottom-style': cell.css('border-bottom-style'),
    'border-left-style': cell.css('border-left-style'),

    'border-top-color': cell.css('border-top-color'),
    'border-right-color': cell.css('border-right-color'),
    'border-bottom-color': cell.css('border-bottom-color'),
    'border-left-color': cell.css('border-left-color'),

    'margin-top': cell.css('margin-top'),
    'margin-right': cell.css('margin-right'),
    'margin-bottom': cell.css('margin-bottom'),
    'margin-left': cell.css('margin-left'),
    
    'padding-top': cell.css('padding-top'),
    'padding-right': cell.css('padding-right'),
    'padding-bottom': cell.css('padding-bottom'),
    'padding-left': cell.css('padding-left'),
    
    'text-align': cell.css('text-align'),
    'vertical-align': cell.css('vertical-align'),
    'font-size': cell.css('font-size'),
    'font-family': cell.css('font-family'),

    'top': top,
    'left': left,
    'width': width,
    'height': height,

    'background-color': backgroundColor,

    'visibility': 'visible'
  };
  
  // copy td styles onto inputBool
  inputBool.css(styles);

  if ( parseBoolean(value) ) {
    this.setTrue();
  } else {
    this.setFalse();
  }
};

DbGridInputBool.prototype.hide = function() {
  this.inputBool.css('visibility','hidden');
};
DbGridInputBool.prototype.destroy = function() {
  this.inputBool.remove();
};
/**********************************
 * Public DbGridInputBool Methods End
 **********************************/
