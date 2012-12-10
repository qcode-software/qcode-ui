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
	moveLeft: function(fromField) {
	    // Returns the field one step left of the target, or the target itself if none exists
	    var nextField;
	    var fromFieldLeft = fromField.offset().left;
	    var fields = this.element.find('.editable');
	    fields.each(function() {
		var field = $(this);
		var fieldLeft = field.offset().left;
		if ( sameRow(field, fromField)
		     && fieldLeft < fromFieldLeft
		     && ( nextField === undefined || fieldLeft > nextFieldLeft )
		   ) {
		    nextField = field;
		    nextFieldLeft = fieldLeft;
		}
	    });
	    if ( nextField === undefined ) {
		fields.each(function() {
		    var field = $(this);
		    var fieldLeft = $(field).offset().left;
		    if ( aboveRow(fromField, field)
			 && (nextField === undefined
			     || belowRow(nextField, field)
			     || (sameRow(field, nextField) && fieldLeft > nextFieldLeft )
			    )
		       ) {
			nextField = field;
			nextFieldLeft = fieldLeft;
		    }
		});
	    }
	    if ( nextField === undefined ) {
		return fromField;
	    } else {
		return nextField;
	    }
	}, 
	moveRight: function(fromField) {
	    // Returns the field one step right of the target, or the target itself if none exists
	    var nextField;
	    var fromFieldLeft = fromField.offset().left;
	    var fields = this.element.find('.editable');
	    fields.each(function() {
		var field = $(this);
		var fieldLeft = field.offset().left;
		if ( sameRow(field, fromField)
		     && fieldLeft > fromFieldLeft
		     && ( nextField === undefined || fieldLeft < nextFieldLeft )
		   ) {
		    nextField = field;
		    nextFieldLeft = fieldLeft;
		}
	    });
	    if ( nextField === undefined ) {
		fields.each(function() {
		    var field = $(this);
		    var fieldLeft = $(field).offset().left;
		    if ( belowRow(fromField, field)
			 && (nextField === undefined
			     || aboveRow(nextField, field)
			     || (sameRow(field, nextField) && fieldLeft < nextFieldLeft)
			    )
		       ) {
			nextField = field;
			nextFieldLeft = fieldLeft;
		    }
		});
	    }
	    if ( nextField === undefined ) {
		return fromField;
	    } else {
		return nextField;
	    }
	}, 
	moveUp: function(fromField) {
	    // Returns the field one step above the target, or the target itself if none exists
	    var nextField;
	    var fromFieldTop = fromField.offset().top;
	    var fields = this.element.find('.editable');
	    fields.each(function() {
		var field = $(this);
		var fieldTop = field.offset().top;
		if ( sameColumn(fromField, field)
		     && fieldTop < fromFieldTop
		     && (nextField === undefined || fieldTop > nextFieldTop)
		   ) {
		    nextField = field;
		    nextFieldTop = fieldTop;
		}
	    });
	    if ( nextField === undefined ) {
		fields.each(function() {
		    var field = $(this);
		    var fieldTop = field.offset().top;
		    if ( leftOfColumn(fromField, field)
			 && (nextField === undefined
			     || rightOfColumn(nextField, field)
			     || (sameColumn(field, nextField) && fieldTop > nextFieldTop)
			    )
		       ) {
			nextField = field;
			nextFieldTop = fieldTop;
		    };
		});
	    }
	    if ( nextField === undefined ) {
		return fromField;
	    } else {
		return nextField;
	    }
	}, 
	moveDown: function(fromField) {
	    // Returns the field one step below the target, or the target itself if none exists
	    var nextField;
	    var fromFieldTop = fromField.offset().top;
	    var fields = this.element.find('.editable');
	    fields.each(function() {
		var field = $(this);
		var fieldTop = field.offset().top;
		if ( sameColumn(fromField, field)
		     && fieldTop > fromFieldTop
		     && ( nextField === undefined || fieldTop < nextFieldTop )
		   ) {
		    nextField = field;
		    nextFieldTop = fieldTop;
		}
	    });
	    if ( nextField === undefined ) {
		fields.each(function() {
		    var field = $(this);
		    var fieldTop = field.offset().top;
		    if ( rightOfColumn(fromField, field)
			 && ( nextField === undefined
			      || leftOfColumn(nextField, field)
			      || (sameColumn(field, nextField) && fieldTop < nextFieldTop)
			    )
		       ) {
			nextField = field;
			nextFieldTop = fieldTop;
		    }
		});
	    }
	    if ( nextField === undefined ) {
		return fromField;
	    } else {
		return nextField;
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

    // Navigation functions, used by the "move" functions
    function sameRow(a, b) {
	// Takes two elements and returns true if they are on the same row
	return (a.offset().top <= (b.offset().top + b.outerHeight()))
	    && ((a.offset().top + a.outerHeight()) >= b.offset().top);
    }
    function belowRow(a, b) {
	// Takes two elements and returns true if "b" is on a row below "a"
	return b.offset().top > (a.offset().top + a.outerHeight());
    }
    function aboveRow(a, b) {
	// Takes two elements and returns true if "b" is on a row above "a"
	return (b.offset().top + b.outerHeight()) < a.offset().top;
    }
    function sameColumn(a, b) {
	// Takes two elements and returns true if they are in the same column
	return (a.offset().left <= (b.offset().left + b.outerWidth()))
	    && ((a.offset().left + a.outerWidth()) >= b.offset().left);
    }
    function leftOfColumn(a, b) {
	// Takes two elements and returns true if "b" is in a column left of "a"
	return (b.offset().left + b.outerWidth()) < a.offset().left;
    }
    function rightOfColumn(a, b) {
	// Takes two elements and returns true if "b" is in a column right of "a"
	return (a.offset().left + a.outerWidth()) < b.offset().left;
    }
})(jQuery, window);
