(function($){
    function DbFormCombo(input, settings) {
	this.input = input;
	this.settings = $.extend({
	    searchUrl: "",
	    boundName: "",
	    searchLimit: 10,
	    comboWidth: input.outerWidth(),
	    comboHeight: 200,
	}, settings);
	this.div = $('<div>')
	    .css({
		'position': 'absolute',
		'width': this.settings.comboWidth,
		'height': this.settings.comboHeight,
		'overflow': 'auto',
		'top': input.position().top + input.outerHeight(),
		'left': input.position().left,
		'border': "1px solid black",
		'background': "white",
	    })
	    .appendTo('body')
	    .hide()
	    .hover(
		function(){$(this).addClass('hover');},
		function(){$(this).removeClass('hover');}
	    );
	this.lastValue = input.val();
	input
	    .on('keydown', onKeyDown.bind(this))
	    .on('keyup', onKeyUp.bind(this))
	    .on('blur', onBlur.bind(this));
    }
    $.extend(DbFormCombo.prototype, {
	show: function(){
	    this.div.show();
	    $('select').css('visibilty', 'hidden');
	},
	hide: function() {
	    this.div.removeClass('hover').hide();
	    $('select').css('visibility', 'visible');
	},
	highlight: function(index) {
	    this.currentItem.css({
		'background': "",
		'color': ""
	    });
	    this.currentItem = this.div.children().eq(index);
	    this.currentItem.css({
		'background': "highlight",
		'color': "highlighttext"
	    });
	},
	select: function(index) {
	    var form = this.input.closest('form');
	    var record = $(this.xmlDoc).find('record').eq(index);
	    form.find('[name="' + this.settings.boundName + '"]').val( $(record).find(this.settings.boundName).text() );
	    this.input.val( $(record).find(this.input.attr('name')).text() );
	    this.lastValue = this.input.val();
	    this.hide();
	    this.currentItem = "undefined";
	    this.input.focus();
	    this.input.trigger('comboSelect');
	},
	updateList: function() {
	    this.div.empty();
	    this.div.on('click.dbFormCombo',divOnClick.bind(this));
	    this.div.on('mouseover.dbFormCombo',divOnMouseOver.bind(this));
	    var dbForm = this;
	    this.xmlDoc.find('record').each(function(i,record){
		var field = $(record).find(dbForm.input.attr('name'));
		$('<div>')
		    .css({
			'width': "100%",
			'cursor': "pointer"
		    })
		    .text( $(field).text() )
		    .appendTo( dbForm.div );
	    });
	    if ( this.div.children().length >= this.settings.searchLimit ) {
		this.div.append('.....');
	    }
	    this.currentItem = this.div.children().first();
	    this.highlight(0);
	}
    });
    function onKeyDown(event) {
	if ( typeof this.currentItem == "undefined" ) {
	    return;
	}
	var index = this.currentItem.index();
	switch (event.which) {
	case 38:
	    if ( index != 0 ) {
		this.highlight(index - 1);
	    }
	    break;
	case 40:
	    if ( index != (this.div.children().length - 1) ){
		this.highlight(index + 1);
	    }
	    break;
	case 13:
	    this.select(index);
	    event.preventDefault();
	    event.stopPropagation();
	    break;
	case 9:
	    this.select(index);
	    break;
	}
    }
    function onKeyUp(event) {
	if ( this.input.val() != this.lastValue ) {
	    this.lastValue = this.input.val();
	    search.call(this);
	}
    }
    function onBlur(event) {
	if ( ! this.div.is('.hover') ) {
	    this.hide();
	    this.currentItem = undefined;
	}
    }
    function divOnClick(event) {
	if ( event.target != this.div ) {
	    this.select($(event.target).index());
	}
    }
    function divOnMouseOver(event) {
	if ( event.target != this.div ) {
	    this.highlight($(event.target).index());
	}
    }
    function search(){
	this.currentItem = undefined;
	this.div.text('Searching ...');
	this.show();
	this.div.off('click.dbFormCombo');
	this.div.off('mouseover.dbFormCombo');
	this.xmlDoc = undefined;
	var dbForm = this;
	$.get(this.settings.searchURL, {
	    'name': this.input.attr('name'),
	    'value': this.input.val(),
	    'searchLimit': this.settings.searchLimit,
	    'boundName': this.settings.boundName
	}, "xml").success(function(data, textStatus, jqXHR){
	    dbForm.xmlDoc = $(data);
	    if ( dbForm.xmlDoc.find('error').length > 0 ) {
		dbForm.div.text( dbForm.xmlDoc.find('error').text() );
	    } else {
		if ( dbForm.xmlDoc.find('record').length > 0 ) {
		    dbForm.updateList();
		} else {
		    dbForm.div.text("No Matches");
		    dbForm.input.closest('form').find('[name="]'+dbForm.settings.boundName+'"]').val("");
		}
	    }
	}).error(function(jqXHR, textStatus, errorThrown){
	    dbForm.div.text("Software Bug ! " + errorThrown);
	});
    }

    $.fn.dbFormCombo = function() {
	var settings = {};
	if ( typeof arguments[0] == "object" ) {
	    var settings = arguments[0];
	} else if ( typeof arguments[0] == "string" ) {
	    var method = arguments[0];
	}
	var inputs = $(this);
	if ( inputs.not('input').length > 0 ) {
	    $.error('dbFrmCombo requires input elements');
	}
	var returnValue;
	inputs.each(function(i,element){
	    var input = $(element);
	    var dbFormCombo = input.data('dbFormCombo');
	    if ( ! dbFormCombo ) {
		dbFormCombo = new DbFormCombo(input, settings);
		input.data('dbFormCombo', dbFormCombo);
	    }
	    if ( method ) {
		if ( typeof dbForm[method] == "function" ) {
		    returnVal = dbForm[method].apply( dbForm, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof dbForm.settings[method] != "undefined" ) {
		    if ( arguments.length == 1 ) {
			returnValue = dbForm.settings[method];
		    } else if ( arguments.length == 2 ) {
			dbForm.settings[method] = arguments[1];
		    } else {
			$.error( 'Invalid argument count for jQuery.dbFormCombo' );
		    }
		} else if ( typeof dbForm[method] != "undefined" || method == "currentItem" ) {
		    if ( arguments.length == 1 ) {
			returnValue = dbForm[method];
		    } else if ( arguments.length == 2 ) {
			dbForm[method] = arguments[1];
		    } else {
			$.error( 'Invalid argument count for jQuery.dbFormCombo' );
		    }
		} else {
		    $.error( 'Method or property ' + method + ' does not exist on jQuery.dbFormCombo' );
		}
	    }
	    if ( typeof returnValue != "undefined" ) {
		return false; //Break out of each-loop
	    }
	});
	if ( typeof returnValue != "undefined" ) {
	    return returnValue;
	} else {
	    return inputs;
	}
    };
})(jQuery);