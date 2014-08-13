// dbField plugin - a field in a dbRecord.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget("qcode.dbField", {
	_create: function() {
	    // saveEvent
	    this.options.saveEvent = coalesce(
                this.element.attr('saveEvent'),
                this.options.saveEvent,
                this.getRecord().dbRecord("option", "saveEvent")
            );
	    
	    switch ( this.options.saveEvent ) {
            case 'fieldOut':
		this._on({
		    'dbFieldOut': this._onDbFieldOut
		});
                break;
            case 'blur':
                this._on({
                    'editorBlur': function() {
	                if ( this.getRecord().dbRecord('getState') === "dirty" ) {
		            this.getRecord().dbRecord('save');
	                }
	            }
                });
	    }
            this._on({
                'editorValueChange': this._onValueChange
            });
	},
        _onValueChange: function() {
            this.getRecord().dbRecord('setState','dirty');
        },
        _onDbFieldOut: function() {
	    if ( this.getRecord().dbRecord('getState') === "dirty" ) {
		this.getRecord().dbRecord('save');
	    }
	},
	getRecordSet: function() {
	    return this.element.closest('.record-set');
	},
	getRecord: function(){
	    return this.element.closest('.record');
	},
	getName: function() {
	    return this.element.attr('name');
	},
	getValue: function(){
            return this.element.editable('getValue');
	}, 
	setValue: function(newValue){
            this.element.editable('setValue', newValue);
	}, 
	fieldIn: function(select){
            this.getRecordSet().dbRecordSet('setCurrentField', this.element);
	    this.element.trigger('dbFieldIn');
	}, 
	fieldOut: function(){
            if ( this.element.editable('hasFocus') ) {
                this.element.blur();
            }
            this.getRecordSet().dbRecordSet('setCurrentField', this.element);
	    this.element.trigger('dbFieldOut');
	}, 
	getType: function(){
	    // Returns the field type
	    return coalesce(this.element.attr('type'), "text");
	}, 
	isEditable: function(){
	    return (this.element.is('.editable')
                    && this.getRecord().dbRecord('getState') != "updating");
	}
    });
})(jQuery);