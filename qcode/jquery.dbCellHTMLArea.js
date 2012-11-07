(function($){
    var eventNamespace = '.dbCellControl.dbCellHTMLArea';
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight']
    function DbCellHTMLArea(container,cells,options) {
	cells.data('dbCellControl', this);
	this.editor = $('<div>')
	    .attr('contentEditable', true)
	    .addClass('dbCellControl dbCellHTMLArea')
	    .appendTo(container)
	    .css({
		'position': "absolute"
	    })
	    .hide()
	    .on('keydown' + eventNamespace, inputOnKeyDown.bind(this))
	    .on('keyup' + eventNamespace, inputOnKeyUp.bind(this));
    }
    $.extend(DbCellHTMLArea.prototype, {
	pluginName: 'dbCellHTMLArea',
	add: function(container,cells){
	    cells.data('dbCellControl', this);
	},
	getType: function() {
	    return 'htmlarea';
	},
	getValue: function() {
	    return this.editor.html();
	},
	show: function(cell,value){
	    this.currentCell = cell;
	    var editor = this.editor;
	    $.each(copyAttributes, function(i,name){
		editor.css(name,cell.css(name));
	    });
	    if ( cell.css('backgroundColor') == 'transparent' ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', cell.css('backgroundColor'));
	    }
	    editor
		.width(cell.innerWidth())
		.height((typeof cell.data('editorHeight') == "undefined") ? cell.innerHeight() : cell.data('editorHeight'))
		.css({
		    'top': cell.position().top + cell.offsetParent().scrollTop(),
		    'left': cell.position().left + cell.offsetParent().scrollLeft()
		})
		.show()
		.html(value)
		.focus();
	},
	hide: function(cell) {
	    this.editor.hide();
	},
	selectText: function(cell,text) {
	    // TO DO - figure out if there's a way to do this
	},
	destroy: function() {
	    this.editor.remove();
	}
    });
    function inputOnKeyDown(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    function inputOnKeyUp(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
            'which': e.which
        });
	this.currentCell.trigger(event);
    }
    $.fn.dbCellHTMLArea = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('dbCellControl');
	if ( ! control ) {
	    control = target.data('dbCellHTMLArea');
	} else if ( control.pluginName !== 'dbCellHTMLArea' ) {
	    $.error('Cannot apply dbCellHTMLArea - element has another control already');
	}
	if ( ! control ) {
	    var cells = arguments[0];
	    var options = arguments[1];
	    target.data('dbCellHTMLArea', new DbCellHTMLArea(target,cells,options));
	} else {
	    var method = arguments[0];
	    var args = [target].concat(Array.prototype.slice.call(arguments,1));
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,args);
	    } else {
		$.error('Invalid method of dbCellHTMLArea');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);