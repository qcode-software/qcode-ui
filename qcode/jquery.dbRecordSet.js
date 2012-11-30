// dbRecordSet is hard-coded to work with the "recordSet" class, so we may as well call it here rather than in behaviour files.
jQuery(function(){
    jQuery('.recordSet').dbRecordSet();
});

// DbRecords Plugins
(function($, window, undefined){
    $.widget('qcode.dbRecordSet', {
	_create: function(){
	    this.currentField = $([]);

	    // Event listeners - instead of seperate event listeners for each field, delegated event listeners are added to the container.
	    this._on({
		'mousedown .editable': function(event){
		    $(event.target).dbField('onMouseDown', event);
		},
		'keydown .editable': function(event){
		    $(event.target).dbField('onKeyDown', event);
		},
		'keyup .editable': function(event){
		    $(event.target).dbField('onKeyUp', event);
		},
		'cut .editable': function(event){
		    $(event.target).dbField('onCut', event);
		},
		'paste .editable': function(event){
		    $(event.target).dbField('onPaste', event);
		},
		'blur .editable': function(event){
		    $(event.target).dbField('onBlur', event);
		}
	    });
	    this._on(window, {
		'beforeunload': this._onBeforeUnload,
		'beforeprint': this._onBeforePrint,
	    });
	},
	save: function(aysnc) {
	    // Save the current record
	    this.getCurrentRecord().dbRecord('save', async);
	}, 
	getCurrentRecord: function() {
	    // Returns the current record (the record containing the current field), or an empty jQuery object if none exists.
	    return this.currentField.dbField('getRecord');
	}, 
	getCurrentField: function() {
	    // Returns the current field, or an empty jQuery object if none exists.
	    return this.currentField;
	}, 
	setCurrentField: function(newField) {
	    // Sets the "currentField" property - this is intended for internal use, please use fieldChange to change the current field.
	    this.currentField = $(newField);
	}, 
	fieldChange: function(newField) {
	    // Switch to the target field
	    var currentRecord = this.currentField.dbField('getRecord');
	    var newRecord = newField.dbField('getRecord');
	    this.currentField.dbField('fieldOut');
	    if ( ! currentRecord.is(newRecord) ) {
		currentRecord.dbRecord('recordOut');
	    }
	    newField.dbField('fieldIn');
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
	    this.getCurrentField().dbField('fieldOut');
	    this.getCurrentRecord().dbRecord('recordOut');
	}
    });

    // Navigation functions
    function sameRow(a, b) {
	// Takes two elements and returns true if they are on the same row
	return (a.offset().top <= (b.offset().top + b.outerHeight()))
	    && ((a.offset().top + a.outerHeight()) >= b.offset().top);
    }
    function belowRow(a, b) {
	// Takes two elements and returns true if "a" is on a row below "b"
	return b.offset().top > (a.offset().top + a.outerHeight());
    }
    function aboveRow(a, b) {
	// Takes two elements and returns true if "a" is on a row above "b"
	return (b.offset().top + b.outerHeight()) < a.offset().top;
    }
    function sameColumn(a, b) {
	// Takes two elements and returns true if they are in the same column
	return (a.offset().left <= (b.offset().left + b.outerWidth()))
	    && ((a.offset().left + a.outerWidth()) >= b.offset().left);
    }
    function leftOfColumn(a, b) {
	// Takes two elements and returns true if "a" is in a column left of "b"
	return (b.offset().left + b.outerWidth()) < a.offset().left;
    }
    function rightOfColumn(a, b) {
	// Takes two elements and returns true if "a" is in a column right of "b"
	return (a.offset().left + a.outerWidth()) < b.offset().left;
    }
})(jQuery, window);
