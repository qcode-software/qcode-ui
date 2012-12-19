// DbGridInput Class Constructor 
var DbGridInput = function(callback, container) {
  var dbGridInput = this;

  var input = jQuery('<input>');
  input.attr('type','text');
  input.css({
    'position':'absolute',
    'visibility':'hidden',
      'background-color':'white',
      '-moz-box-sizing': "content-box", 
      '-ms-box-sizing': "content-box", 
      'box-sizing': "content-box"
  });
  container.append(input);

  // Properties
  dbGridInput.callback = callback;
  dbGridInput.input = input;
  dbGridInput.bookmark;
 
  // Events
  input.on('keyup.dbGridInput', function(e) {
    dbGridInput.inputOnKeyUp(e)    
  });
  input.on('keydown.dbGridInput', function(e) {
    dbGridInput.inputOnKeyDown(e)
  });
  input.on('cut.dbGridInput', function(e) {
    dbGridInput.inputOnCut(e)    
  });
  input.on('paste.dbGridInput', function(e) {
    dbGridInput.inputOnPaste(e)
  });
  input.on('blur.dbGridInput', function(e) {
    dbGridInput.inputOnBlur(e)
  });
};

/**********************************
 * Public DbGridInput Methods Start
 **********************************/  
DbGridInput.prototype.getType = function() {
  return 'text';
};
DbGridInput.prototype.getValue = function() {
  return this.input.val();
};
DbGridInput.prototype.getElmt = function() {
  return this.input;
};
DbGridInput.prototype.storeSelection = function() {
  this.bookmark = this.input.textrange('get');
};
DbGridInput.prototype.inputOnKeyUp = function(e) {
  // allways propagate
  this.callback(e);
  this.storeSelection();
};
DbGridInput.prototype.inputOnKeyDown = function(e) {
  // decide whether to propagate the event to the cell
  // using the callback function passed in
  var textrangeData = this.input.textrange('get'); 
  out: {
    if ( e.which == 9 || e.which == 13 || e.which == 46 ) {
      // TAB or Return or Delete
      this.callback(e)
      break out;
    }
    if ( e.which == 37 && textrangeData.selectionAtStart ) {
      // Left Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 38 ) {
      // Up Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 39 && textrangeData.selectionAtEnd ) {
      // Right Arrow
      this.callback(e);
      break out;
    }
    if ( e.which == 40 ) {
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
DbGridInput.prototype.inputOnCut = function(e) {
  this.callback(e);
  this.storeSelection();
};
DbGridInput.prototype.inputOnPaste = function(e) {
  this.callback(e);
  this.storeSelection();
};
DbGridInput.prototype.inputOnBlur = function(e) {
  this.callback(e);
};
DbGridInput.prototype.selectText = function(option) {
  if ( option == 'end') {
    this.input.textrange('set', 'end');
  }
  if ( option == 'start' ) {
    this.input.textrange('set', 'start');
  }
  if ( option == undefined || option == 'all' ) {
    this.input.textrange('set', 'all');
  }
  if ( option == 'preserve' ) {
    if ( this.bookmark && this.getValue() == this.bookmark.text ) {
      this.input.textrange('set', this.bookmark.selectionStart, this.bookmark.selectionEnd);
    } else {
      this.input.textrange('set','end');
    }
  }
  this.storeSelection();
};
DbGridInput.prototype.show = function(cell,value) {
  var row = cell.closest('tr');
  var table = row.closest('table');
  var input = this.input;

    var relativePosition = cell.positionRelativeTo(table);
  var top = relativePosition.top ;
  var left = relativePosition.left;
    height = cell.height();
    width = cell.width();
  
    if ( cell.css('backgroundColor') != 'transparent' && cell.css('backgroundColor') != "rgba(0, 0, 0, 0)" ) {
    backgroundColor = cell.css('background-color');
  } else if ( row.css('background-color') != 'transparent' && row.css('backgroundColor') != "rgba(0, 0, 0, 0)" ) {
    backgroundColor = row.css('background-color');
  } else {
    backgroundColor = 'white';
  }

  var borderTopWidth = parseInt(cell.css('border-top-width'));
  var borderRightWidth = parseInt(cell.css('border-right-width'));
  var borderBottomWidth = parseInt(cell.css('border-bottom-width'));
  var borderLeftWidth = parseInt(cell.css('border-left-width'));

/*  if ( table.css('border-collapse') == 'collapse' ) {
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
  } */
  
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
    'padding-bottom': parseInt(cell.css('padding-bottom')),
    'padding-left': cell.css('padding-left'),
    
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
  
  // copy td styles onto input
  input.css(styles);

  // adjust padding & height css properties to make input the same height as the cell.
  // If we use only height property we can not vertical align text inside input element
  var inputVerticalAlign = input.css('vertical-align')
  if ( inputVerticalAlign == 'top' ) {
    input.css('padding-bottom', parseInt(cell.css('padding-bottom')) + parseInt(cell.css('height')) - parseInt(input.css('height')));
  } else if ( inputVerticalAlign == 'bottom' ) {
    input.css('padding-top', parseInt(cell.css('padding-top')) + parseInt(cell.css('height')) - parseInt(input.css('height'))) ;
  } else {
    input.css('height', height);
  }

  input.val(value);
};
DbGridInput.prototype.hide = function() {
  this.input.blur();
  this.input.css('visibility','hidden');
};
DbGridInput.prototype.destroy = function() {
  this.input.remove();
};
/**********************************
 * Public DbGridInput Methods End
 **********************************/