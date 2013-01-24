(function($, window, document, undefined){
    $.widget("qcode.dbCell", {
	_create: function(){
	    this.keyUpTimer
	},
	getRow: function(){
	    return this.element.closest('tr');
	},
	getGrid: function(){
	    return this.element.closest('table');
	},
	getCol: function(){
	    return this.getGrid().children('colgroup').children().eq(this.element.index());
	},
	getType: function(){
	    // default type == 'text'
	    return coalesce(this.getCol().attr('type'), 'text');
	},
	getEditorPluginName: function(){
	    switch ( this.getType() ) {
	    case 'bool': return "dbEditorBool"
	    case 'combo': return "dbEditorCombo"
	    case 'htmlarea': return "dbEditorHTMLArea"
	    case 'text': return "dbEditorText"
	    case 'textarea': return "dbEditorTextArea"
	    default:
		$.error('Unknown editor for cell type : ' + this.getType());
		return;
	    }
	},
	editor: function() {
	    var grid = this.getGrid();
	    var editorDiv = grid.dbGrid('getEditorDiv');
	    var editorPluginName = this.getEditorPluginName();
	    return $.fn[editorPluginName].apply(editorDiv, arguments);
	},
	getValue: function(){
	    var cellType = this.getType();

            if ( cellType === "htmlarea" || cellType === "html" ) {
                return this.element.html();
            } else if ( cellType === "bool" ) {
		return parseBoolean(stripHTML(this.element.html()));
	    } else if ( this.element.is(':input') ) {
                return this.element.val();
            } else {
                return this.element.text();
            }
	},
	setValue: function(value){
	    var cellType = this.getType();

            if ( cellType === "htmlarea" || cellType === "html" ) {
		this.element.html(value);
            } else if ( cellType === "bool" ) {
		if ( parseBoolean(value) ) {
		    this.element.html("<span class='clsTrue'>Yes</span>");
		} else {
		    this.element.html("<span class='clsFalse'>No</span>");
		}
	    } else if ( this.element.is(':input') ) {
                this.element.val(value);
            } else {
                this.element.text(value);
            }

            this.element.trigger('resize');
	},
	isEditable: function() {
	    var row = this.getRow();
	    var col = this.getCol();

	    if ( row.dbRow('getState') === 'updating' ) {
		return false;
	    } 
	    // Is the column visible
	    if ( col.hasClass('clsHidden') ) {
		return false;
	    }
	    // No name defined
	    if ( col.attr('name') === undefined ) {
		return false;
	    }
	    if ( row.dbRow('option','type') === 'add' && parseBoolean(col.attr('addDisabled')) === true ) {
		return false;
	    }
	    if ( row.dbRow('option','type') === 'update' && parseBoolean(col.attr('updateDisabled')) === true ) {
		return false;
	    } 
	    if ( col.attr('type') === 'html' ) {
		return false;
	    }
	    return true;
	},
	isTabStop: function() {
	    if ( this.getCol().attr('tabStop') === 'no' ) {
		return false;
	    } else {
		return true;
	    }
	},
	hide: function(){
	    this.element.css('visibility','hidden');
	},
	show: function(){
	    this.element.css('visibility','inherit');
	},
	cellIn: function(select) {
	    // Update currentCell dbGrid variable, hide the cell, show the editor and set editor text selection.
	    var cell = this.element;
	    var grid = this.getGrid();

            cell.trigger('dbCellIn');

	    this.hide();
	    if ( this.getType() === 'combo' ) {
                var data = this.getRow().dbRow('getRowData');
                var searchURL = this.getCol().attr('searchURL');
                $.each(data, function(name, value) {
                    searchURL = urlSet(searchURL, name, value);
                });
		this.editor('show', cell, this.getValue(), searchURL);
	    } else {
		this.editor('show', cell, this.getValue())
	    }
	    select = coalesce(select, this.getCol().attr('cellInSelect'), 'all');
	    this.editor('selectText', select); 
	    grid.dbGrid('setCurrentCell', cell);
	},
	cellOut: function(){
	    // Write editor to cell, show cell, hide editor, unset currentCell dbGrid variable
	    var cell = this.element;
	    var row = this.getRow();
	    var grid = this.getGrid();
	    
	    // Custom Event: Trigger any dbCellOut events bound to this grid
	    cell.trigger('dbCellOut');
	    
	    var oldValue = this.getValue();
	    var newValue = this.editor('getValue');
	    this.write();
	    this.show();
	    this.editor('hide');
	    grid.dbGrid('setCurrentCell', $([]));
	  
	    // Perform any custom action for this column
	    if ( row.dbRow('getState') === 'dirty' &&  this.getCol().attr('action') ) {
		var actionURL = this.getCol().attr('action');
		row.dbRow('action','custom',actionURL,false);
	    }

	    // Auto-save depending on dbGrid's updateType
	    switch ( grid.dbGrid('option', 'updateType') ) {
	    case 'onKeyUp': 
		// cancel any delayed save and save immediately
		this._cancelDelayedSave();
		if (row.dbRow('getState') === 'dirty') {
		    row.dbRow('save',false);
		}
		break;	    
	    case 'onCellOut': 
		// save immediately
		if (row.dbRow('getState') === 'dirty') {
		    row.dbRow('save',false);
		}
	    }
	},
	write: function(){
	    // Write the contents of the editor to the current cell
	    this.setValue(this.editor('getValue'));
	},
	editorBlur: function(){
	    // Perform a cellout if the editor blurs and updateType == "onCellOut"
	    var grid = this.getGrid();
	    var row = this.getRow();
	    if ( grid.dbGrid('option', 'updateType') === 'onCellOut' ) {
		this.cellOut();
	    }		   
	},
        editorValueChange: function(){
	    // If the Editor's value has changed, mark row as dirty.
	    var row = this.getRow();
	    var grid = this.getGrid();

	    if ( this.getValue() !== this.editor('getValue') ) {
		row.dbRow('setState', 'dirty');
	    }
	    if ( grid.dbGrid('option','updateType') === "onKeyUp" ) {
		this._cancelDelayedSave();
		this.keyUpTimer = setTimeout(this._delayedSave.bind(this),750);
	    }
        },
	editorKeyDown: function(event){
	    var cell = this.element;
	    var grid = this.getGrid();

	    // Alt key combination
	    if ( event.altKey ) { return true; }

	    switch(event.which) {
	    case 38: // Up Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellAbove', cell));
		break;
	    case 40: // Down Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellBelow', cell));
		break;
	    case 37: // Left Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellLeftOf', cell));
		break;
	    case 39: // Right Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellRightOf', cell));
		break;		
	    case 83: // s Key
		if ( event.ctrlKey ) {
		    // Ctrl + s
		    grid.dbGrid('save');
		    break;
		}
	    case 46: // Delete Key
		grid.dbGrid('delete');
		break;
	    case 13: // Return Key
		grid.dbGrid('cellChange', grid.dbGrid('cellRightOf', cell));
		if ( grid.dbGrid('getCurrentCell').is(cell) ) {
		    // We are on the last editable cell 
		    grid.dbGrid('save');
		}
		break;
	    case 9: // Tab Key
		if ( event.shiftKey ) {
		    grid.dbGrid('cellChange', grid.dbGrid('cellLeftOf', cell));
		} else {
		    grid.dbGrid('cellChange', grid.dbGrid('cellRightOf', cell));
		}
		if ( grid.dbGrid('getCurrentCell').is(cell) ) {
		    // We are on the last editable cell 
		    grid.dbGrid('save');
		    return true;
		}
		break;

	    default: // handle event using browser defaults
		return true;
	    }
	    
	    // prevent event propagation and browser defaults 
	    event.preventDefault();
	    event.stopPropagation();
	    return false
	},
	onMouseUp: function(event){
	    // Mouse up event on an editable cell - call changeCell
	    var grid = this.getGrid();

	    // Cell is not editable
	    if ( ! this.isEditable() ) { return true; } 
	    
	    grid.dbGrid('cellChange', this.element);
	},
	_delayedSave: function(){
	    var row = this.getRow();
	    if ( row.dbRow('getState') === 'dirty' ) {
		row.dbRow('save');
	    }
	},
	_cancelDelayedSave: function(){
	    if ( this.keyUpTimer !== undefined ) {
		clearTimeout(this.keyUpTimer);
	    }
	    this.keyUpTimer=undefined;
	},
    });
})(jQuery, window, document);