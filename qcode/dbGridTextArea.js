// DbGridTextArea Class Constructor 
var DbGridTextArea = function(callback, container) {
  var dbGridTextArea = this;

  var textArea =  jQuery('<textarea>');
  textArea.css({
    'position':'absolute',
    'visibility':'hidden',
    'background-color':'white',
    'border':'1px solid #aca899',
    'overflow':'auto'
  });
  container.append(textArea);

  // Properties
  dbGridTextArea.callback = callback;
  dbGridTextArea.textArea = textArea;

  // Events
  textArea.on('keyup.dbGridTextArea', function(e) {
    dbGridTextArea.inputOnKeyUp(e)    
  });
  textArea.on('keydown.dbGridTextArea', function(e) {
    dbGridTextArea.inputOnKeyDown(e)
  });
};

/************************************
 * Public DbGridTextArea Methods Start
 ************************************/
DbGridTextArea.prototype.getType = function() {
  return 'textarea';
};
DbGridTextArea.prototype.getValue = function() {
  var value = this.textArea.val();
  return value.replace(/\r\n|\n/g,"<br>");
};
DbGridTextArea.prototype.getElmt = function() {
  return this.textArea;
};
DbGridTextArea.prototype.inputOnKeyDown = function(e) {
  // decide whether to propagate the event to the cell
  // using the callback function passed in
  var textrangeData = this.textArea.textrange('get'); 
  out: {
    if ( e.which == 9 || e.which == 46 ) {
      // TAB or Delete
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
DbGridTextArea.prototype.inputOnKeyUp = function(e) {
  // allways propagate
  this.callback(e);
};
DbGridTextArea.prototype.selectText = function(option) {
  if ( option == 'end') {
    this.textArea.textrange('set', 'end');
  }
  if ( option == 'start' ) {
    this.textArea.textrange('set', 'start');
  }
  if ( option == undefined || option == 'all' ) {
    this.textArea.textrange('set', 'all');
  }
};
DbGridTextArea.prototype.show = function(cell,value,editorHeight) {
  var row = cell.closest('tr');
  var table = row.closest('table');
  var container = table.closest('div');
  var textArea = this.textArea;

  var top = cell.position().top + container.scrollTop() ;
  var left =  cell.position().left + container.scrollLeft();
  if ( editorHeight == undefined ) {
    height = cell.height();
  } else {
    height = editorHeight;
  }
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
    'padding-bottom': parseInt(cell.css('padding-bottom')),
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
  
  // copy td styles onto textArea
  textArea.css(styles);
  textArea.val(value.replace(/<br>/gi,"\r\n"));
};
DbGridTextArea.prototype.hide = function() {
  this.textArea.css('visibility','hidden');
};
DbGridTextArea.prototype.destroy = function() {
  this.textArea.remove();
};
/************************************
 * Public DbGridTextArea Methods End
 ************************************/