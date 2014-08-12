// dbRecordSet plugin
// Provides an ui for editable database records.
// Relies on records having class "record", all fields having "name" attributes,
// and all editable fields having the "editable" class.
// All editable fields must be focussable - use the tabIndex attribute, if required, to force this.

// Fires:
// message
// dbRecordStateChange
// cosmeticChange
// dbRecordAction
// dbRecordActionReturn
// dbRecordActionReturnError
// resize
// dbRecordIn
// dbRecordOut
// dbFieldIn
// dbFieldOut
;(function($, window, undefined){

    // Use the jQuery UI widget factory.
    $.widget('qcode.dbRecordSet', {
	options: {
	    saveEvent: "recordOut" /*recordOut, fieldOut, or blur*/
	},
	_create: function(){
	    // check saveEvent attr
	    this.options.saveEvent = coalesce(this.element.attr('saveEvent'), this.options.saveEvent);

	    // Ensure recordSet class is set
	    this.element.addClass('record-set');

	    // Elements with class "editable" are editable fields.
	    this._on({
                'focus .editable': this._onFieldFocus,
                'dbRecordActionReturn': this._onDbRecordActionReturn
	    });
	    this._on(window, {
		'beforeunload': this._onBeforeUnload,
		'beforeprint': this._onBeforePrint,
	    });

	    // Initialize as empty jQuery object.
	    this.currentField = $([]);
	    this.currentRecord = $([]);
	},
        _onFieldFocus: function(event) {
            // Ensure editable plugin is initialised, then switch to the chosen field.
            $(event.currentTarget).editable({container: this.element});
            this.fieldChange($(event.currentTarget));
        },
        _onDbRecordActionReturn: function(event, action) {
            if ( action == "delete" ) {
                this.element.trigger('message', [{
                    type: 'message',
                    html: 'Record Deleted.'
                }]);
            }
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
	fieldChange: function(newField) {
            // Change the current field.
	    var newRecord = newField.dbField('getRecord');
            var currentField = this.getCurrentField();
	    var currentRecord = this.getCurrentRecord();
            
            if ( ! currentField.is(newField) ) {
	        currentField.dbField('fieldOut');

	        if ( ! currentRecord.is(newRecord) ) {
		    currentRecord.dbRecord('recordOut');
	        }

	        newField.dbField('fieldIn');

	        if ( ! currentRecord.is(newRecord) ) {
		    newRecord.dbRecord('recordIn');
	        }
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
