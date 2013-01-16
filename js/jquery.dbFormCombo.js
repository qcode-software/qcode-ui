;(function($, undefined) {
    $.widget('qcode.dbFormCombo', {
        options: {
	    searchUrl: "",
	    searchLimit: 10,
	    comboHeight: 200
        },
        _create: function() {
            this.options.comboWidth = coalesce(this.options.comboWidth, this.element.outerWidth());
	    this.div = $('<div>')
	        .css({
		    'position': 'absolute',
		    'width': this.options.comboWidth,
		    'height': this.options.comboHeight,
		    'overflow': 'auto',
		    'top': this.element.position().top + this.element.outerHeight(),
		    'left': this.element.position().left,
		    'border': "1px solid black",
		    'background': "white"
	        })
	        .appendTo('body')
	        .hide()
	        .hover(
		    function(){$(this).addClass('hover');},
		    function(){$(this).removeClass('hover');}
	        );
	    this.lastValue = this.element.val();
	    this._on({
	        'keydown': this._onKeyDown,
	        'keyup': this._onKeyUp,
	        'blur': this._onBlur
            });
        },
	show: function(){
	    this.div.show();
	},
	hide: function() {
	    this.div.removeClass('hover').hide();
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
	    var record = $(this.xmlDoc).find('record').eq(index);
	    this.element.val( $(record).find(this.element.attr('name')).text() );
	    this.lastValue = this.element.val();
	    this.hide();
	    this.currentItem = undefined;
	    this.element.focus();
	    this.element.trigger('comboSelect');
	},
	updateList: function() {
	    this.div.empty();
	    this._on(this.div, {
                'click': this._divOnClick,
	        'mouseover': this._divOnMouseOver
            });
	    var dbForm = this;
	    this.xmlDoc.find('record').each(function(i,record){
		var field = $(record).find(dbForm.element.attr('name'));
		$('<div>')
		    .css({
			'width': "100%",
			'cursor': "pointer"
		    })
		    .text( $(field).text() )
		    .appendTo( dbForm.div );
	    });
	    if ( this.div.children().length >= this.options.searchLimit ) {
		this.div.append('.....');
	    }
	    this.currentItem = this.div.children().first();
	    this.highlight(0);
	},
        _onKeyDown: function(event) {
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
        },
        _onKeyUp: function(event) {
	    if ( this.element.val() != this.lastValue ) {
	        this.lastValue = this.element.val();
	        this.search();
	    }
        },
        _onBlur: function(event) {
	    if ( ! this.div.is('.hover') ) {
	        this.hide();
	        this.currentItem = undefined;
	    }
        },
        _divOnClick: function(event) {
	    if ( ! this.div.is(event.target) ) {
	        this.select($(event.target).index());
	    }
        },
        _divOnMouseOver: function(event) {
	    if ( ! this.div.is(event.target) ) {
	        this.highlight($(event.target).index());
	    }
        },
        search: function() {
	    this.currentItem = undefined;
	    this.div.text('Searching ...');
	    this.show();
	    this.div.off('click.dbFormCombo');
	    this.div.off('mouseover.dbFormCombo');
	    this.xmlDoc = undefined;
	    var dbForm = this;
	    $.get(this.options.searchURL, {
	        'name': this.element.attr('name'),
	        'value': this.element.val(),
	        'searchLimit': this.options.searchLimit
	    }, "xml").success(function(data, textStatus, jqXHR){
	        dbForm.xmlDoc = $(data);
	        if ( dbForm.xmlDoc.find('error').length > 0 ) {
		    dbForm.div.text( dbForm.xmlDoc.find('error').text() );
	        } else {
		    if ( dbForm.xmlDoc.find('record').length > 0 ) {
		        dbForm.updateList();
		    } else {
		        dbForm.div.text("No Matches");
		    }
	        }
	    }).error(function(jqXHR, textStatus, errorThrown){
	        dbForm.div.text("Software Bug ! " + errorThrown);
	    });
        }
    });
})(jQuery);