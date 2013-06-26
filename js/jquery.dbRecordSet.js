// dbRecordSet plugin
// Provides an ui for editable database records.
;(function($, window, undefined){

    // Use the jQuery UI widget factory.
    $.widget('qcode.dbRecordSet', {
	options: {
	    saveType: "recordOut"
	},
	_create: function(){
	    // check saveType attr
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType);
	    // Ensure recordSet class is set
	    this.element.addClass('recordSet');

	    // Elements with class "editable" are editable fields.
	    this._on({
		'mousedown .editable': function(event) {
		    $(event.currentTarget).dbField('onMouseDown', event);
		},
		'editorKeyDown .editable': function(event) {
		    $(event.currentTarget).dbField('editorKeyDown', event);
		},
                'editorValueChange .editable': function(event) {
                    $(event.currentTarget).dbField('editorValueChange', event);
                },
		'editorBlur .editable': function(event) {
		    $(event.currentTarget).dbField('editorBlur', event);
		}
	    });
	    this._on(window, {
		'beforeunload': this._onBeforeUnload,
		'beforeprint': this._onBeforePrint,
	    });

	    // Initialize as empty jQuery object.
	    this.currentField = $([]);
	    this.currentRecord = $([]);
	},
        _destroy: function() {
            this.currentField.dbField('fieldOut');
            this.element.find('.record').dbRecord('destroy');
        },
	save: function(aysnc) {
	    // Save the current record
	    this.getCurrentRecord().dbRecord('save', async);
	}, 
	getCurrentRecord: function() {
	    return this.currentRecord;
	},
	setCurrentRecord: function(newRecord) {
	    this.currentRecord = $(newRecord);
	},
	getCurrentField: function() {
	    return this.currentField;
	}, 
	setCurrentField: function(newField) {
	    this.currentField = $(newField);
	}, 
	fieldChange: function(toField) {
	    //
	    var currentRecord = this.getCurrentRecord();
	    var newRecord = toField.dbField('getRecord');

	    this.getCurrentField().dbField('fieldOut');
	    if ( ! currentRecord.is(newRecord) ) {
		currentRecord.dbRecord('recordOut');
	    }

	    toField.dbField('fieldIn');
	    if ( ! currentRecord.is(newRecord) ) {
		newRecord.dbRecord('recordIn');
	    }
	},
	_onBeforeUnload: function(event){
	    // Before leaving the page, offer the user a chance to save changes.
	    var records = this.element.find('.record');
	    for (var i = 0; i < records.length; i++) {
		var record = records.eq(i);
		if ( record.dbRecord('getState') === 'dirty' || record.dbRecord('getState') === 'error' ) {
		    return "Your changes have not been saved.\nStay on the current page to correct.";
		}
	    }
	},
	_onBeforePrint: function(event){
	    // Before printing, stop editing
	    this.getCurrentField().dbField('fieldOut');
	    this.getCurrentRecord().dbRecord('recordOut');
	}
    });
})(jQuery, window);
