// inputEditor plugin
(function($){
    // Namespace for event handlers
    var eventNamespace = '.inputEditor';

    // css attributes to copy from target elements to the editor when editor is shown
    var copyAttributes = ['borderTopWidth','borderTopStyle','borderTopColor',
			  'borderBottomWidth','borderBottomStyle','borderBottomColor',
			  'borderLeftWidth','borderLeftStyle','borderLeftColor',
			  'borderRightWidth','borderRightStyle','borderRightColor',
			  'marginTop','marginRight','marginBottom','marginLeft',
			  'paddingTop','paddingRight','paddingBottom','paddingLeft',
			  'textAlign','verticalAlign','fontSize','fontFamily','fontWeight',
			  'width','height'];

    // class InputEditor
    // constructor function - takes container which the editor is to be appended to as an argument.
    function InputEditor(container) {
	this.container = container;
	this.editor = $('<input type="text">')
	    .addClass('inputEditor')
	    .appendTo(container)
	    .css({
		'position': "absolute",
		'background': "white",
		'overflow': "visible",
		'-moz-box-sizing': "content-box",
		'-ms-box-sizing': "content-box",
		'box-sizing': "content-box",
		'z-index': 1
	    })
	    .hide()
	    .on('keydown' + eventNamespace, inputOnKeyDown.bind(this))
	    .on('keyup' + eventNamespace, inputOnKeyUp.bind(this))
	    .on('cut' + eventNamespace, inputOnCut.bind(this))
	    .on('paste' + eventNamespace, inputOnPaste.bind(this))
	    .on('blur' + eventNamespace, inputOnBlur.bind(this));
    }

    // Public methods for class inputEditor
    $.extend(InputEditor.prototype, {
	getType: function() {
	    return 'text';
	},
	getValue: function() {
	    return this.editor.val();
	},
	show: function(element,value){
	    this.currentElement = element;
	    var editor = this.editor;
	    $.each(copyAttributes, function(i,name){
		editor.css(name,element.css(name));
	    });
	    if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		editor.css('backgroundColor', "white");
	    } else {
		editor.css('backgroundColor', element.css('backgroundColor'));
	    }
	    editor
		.css({
		    'top': element.position().top + element.offsetParent().scrollTop(),
		    'left': element.position().left + element.offsetParent().scrollLeft()
		})
		.show()
		.val(value)
		.focus();
	},
	onResize: function() {
	    if ( this.currentElement ) {
		var element = this.currentElement;
		var editor = this.editor;
		$.each(['width','height'], function(i,name){
		    editor.css(name,element.css(name));
		});
		editor.css({
		    'top': element.position().top + element.offsetParent().scrollTop(),
		    'left': element.position().left + element.offsetParent().scrollLeft()
		});
	    }
	},
	hide: function(element) {
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	selectText: function(element,option) {
	    // TO DO - figure out if there's a way to do this
	},
	destroy: function() {
	    this.editor.remove();
	}
    });

    // Private methods for class inputEditor
    function inputOnKeyDown(e) {
	switch(e.which) { //nb. Switch cascades; lack of breaks is intended
	case 83: //S
	    if ( ! e.ctrlKey ) break;
	case 13: //return
	case 9: //tab
	    e.preventDefault();
	case 38: //up
	case 40: //down
            var event = jQuery.Event(e.type,{
		'data': e.data,
		'ctrlKey': e.ctrlKey,
		'altKey': e.altKey,
		'shiftKey': e.shiftKey,
		'which': e.which
            });
	    this.currentElement.trigger(event);
	    break;
	}
    }
    function inputOnKeyUp(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentElement.trigger(event);
    }
    function inputOnCut(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentElement.trigger(event);
    }
    function inputOnPaste(e) {
        var event = jQuery.Event(e.type,{
            'data': e.data,
	    'ctrlKey': e.ctrlKey,
	    'altKey': e.altKey,
	    'shiftKey': e.shiftKey,
            'which': e.which
        });
	this.currentElement.trigger(event);
    }
    function inputOnBlur(e, source) {
	if ( ! this.editor.is(':focus') ) {
            var event = jQuery.Event(e.type,{
		'data': e.data
            });
	    this.currentElement.trigger(event);
	}
    }

    // inputEditor plugin function
    $.fn.inputEditor = function(){
	var returnValue;
	var target = $(this);
	var control = target.data('inputEditor');
	if ( ! control ) {
	    target.data('inputEditor', new InputEditor(target));
	    var control = target.data('inputEditor');
	}
	if ( arguments.length > 0 ) {
	    var method = arguments[0];
	    if ( typeof control[method] == "function" ) {
		returnValue = control[method].apply(control,Array.prototype.slice.call(arguments,1));
	    } else {
		$.error('Invalid method ' + method + ' of inputEditor');
	    }
	}
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return target;
	}
    }
})(jQuery);