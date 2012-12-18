// Apply to elements with recordSet class.
;jQuery(function(){
    jQuery('.recordSet').dbRecordSet();
});

// dbRecordSet plugin
// Call on a DOM element which contains the dbRecords.
;(function($, window, undefined){

    // Use the jQuery UI widget factory.
    $.widget('qcode.dbRecordSet', {
	options: {
	    saveType: "recordOut"
	},
	_create: function(){
	    // Constructor function
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType);

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
	    this.currentRecord = $([]);
	},
	save: function(aysnc) {
	    // Save the current record
	    this.getCurrentRecord().dbRecord('save', async);
	}, 
	getCurrentRecord: function() {
	    // Returns the current record
	    return this.currentRecord;
	},
	setCurrentRecord: function(newRecord) {
	    // Sets the current field
	    this.currentRecord = $(newRecord);
	},
	getCurrentField: function() {
	    // Returns the current field
	    return this.currentField;
	}, 
	setCurrentField: function(newField) {
	    // Sets the current field
	    this.currentField = $(newField);
	}, 
	fieldChange: function(toField) {
	    // Move to the target field
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
