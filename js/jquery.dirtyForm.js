// Plugin to check if form is dirty (has unsaved data)
;(function($, undefined) {
    $.widget('qcode.dirtyForm',{
	_create: function(){
	    // Event listener
	    this._on(this.element, {
		'keyup': this._onKeyUp,
		'change select, input[type="checkbox"], input[type="radio"]': this._onChange,
		'cut': this._onCut,
		'paste': this._onPaste,
	    });
	},
	_onKeyUp: function(e) {
	    if ( isEditingKeyEvent(e) ) {
		this.setDirty();
		return;
	    } 

	    if ( e.which == 13 // return key
		 && $(e.target).is('textarea') ) {
		this.setDirty();
	    }
	},
	_onChange: function(e) {
	    this.setDirty();
	},
	_onCut: function(e) {
	    if($(e.target).attr('type')=='text' || $(e.target).is('textarea')){
		this.setDirty();
	    }
	},
	_onPaste: function(e) {
	    if($(e.target).attr('type')=='text' || $(e.target).is('textarea')){
		this.setDirty();
	    }
	},
	setDirty: function() {
	    this.element.trigger('formDirty');
	}
	
    });
})(jQuery);