// Apply to elements with recordSet class.
;jQuery(function(){
    jQuery('.recordSet').dbRecordSet();
});

// dbRecordSet plugin
// Call on a DOM element which contains the dbRecords.
;(function($, window, undefined){

    // Use the jQuery UI widget factory.
    $.widget('qcode.dbRecordSet', {
	_create: function(){
	    // Constructor function

	    // Event listeners - instead of seperate event listeners for each field, delegated event listeners are added to the container.
	    // Elements with class "editable" should be editable fields.
	    this._on({
		'mousedown .editable': function(event) {
		    $(event.currentTarget).dbField('onMouseDown', event);
		},
		'editorKeyDown .editable': function(event) {
		    $(event.currentTarget).dbField('editorKeyDown', event);
		},
		'editorKeyUp .editable': function(event) {
		    $(event.currentTarget).dbField('editorKeyUp', event);
		},
		'editorCut .editable': function(event) {
		    $(event.currentTarget).dbField('editorCut', event);
		},
		'editorPaste .editable': function(event) {
		    $(event.currentTarget).dbField('editorPaste', event);
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
	},
	save: function(aysnc) {
	    // Save the current record
	    this.getCurrentRecord().dbRecord('save', async);
	}, 
	getCurrentRecord: function() {
	    // Returns the current record or an empty jQuery object if none exists.
	    return this.currentField.dbField('getRecord');
	}, 
	getCurrentField: function() {
	    // Returns the current field, or an empty jQuery object if none exists.
	    return this.currentField;
	}, 
	setCurrentField: function(newField) {
	    // Sets the "currentField" property directly, please use fieldChange to change the current field.
	    this.currentField = $(newField);
	}, 
	fieldChange: function(toField) {
	    // Move to the target field
	    var currentRecord = this.currentField.dbField('getRecord');
	    var newRecord = toField.dbField('getRecord');
	    this.currentField.dbField('fieldOut');
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
	    var record = this.getCurrentRecord();
	    if ( record.dbRecord('getState') == 'dirty' ) {
		if ( window.confirm('Do you want to save your changes?') ) {
		    record.dbRecord('save', false);
		    if ( record.dbRecord('getState') == 'error' ) {
			return "Your changes could not be saved.\nStay on the current page to correct.";
		    }
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
