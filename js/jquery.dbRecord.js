// dbRecord plugin
// Part of a dbRecordSet. 
// A dbRecord represents a collection of dbFields which will be added, updated, or deleted together.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget('qcode.dbRecord', {
	_create: function() {
	    // Constructor function
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType, this.getRecordSet().dbRecordSet("option", "saveType"));
	    this.state = 'current';
	    if ( this.element.attr('recordType') === "add" ) {
		this.type = "add";
	    } else {
		this.type = "update";
	    }
	    if ( this.options.saveType === 'recordOut' ) {
		this._on({
		    'dbRecordOut': function() {
			if ( this.getState() === "dirty" ) {
			    this.save();
			}
		    }
		});
	    }
	},
	getRecordSet: function() {
	    // Get the record-set element containing this record
	    return this.element.closest('.recordSet');
	}, 
	getState: function() {
	    // Get the state of this record
	    return this.state;
	}, 
	setState: function(newState) {
	    // Set the state of this record
	    switch(newState) {
	    case "updating":
	    case "error":
	    case "current":
	    case "dirty":
		this.element.removeClass("current dirty updating error");
		this.element.addClass(newState);
		this.state = newState;
		this.getCurrentField().dbField('editor', 'refresh');
		this.element.trigger('dbRecordStateChange');
		break;
	    default:
		$.error('Invalid state');
	    }
	},
	getErrorMessage: function() {
	    return this.error;
	},
	save: function(async) {
	    // Save this record, using an add or update url as appropriate
	    if ( this.getState() === "updating" ) {
		return false;
	    }
	    var url = this.getRecordSet().attr(this.type + "URL");
	    if ( ! url ) {
		$.error('Could not '+this.type+' record - no url provided');
	    }
	    this.action(this.type, url, async);
	}, 
	delete: function(async) {
	    // Delete this record, by sending a delete request to the server
	    if ( this.getState() === "updating" ) {
		return false;
	    }
	    var url = this.getRecordSet().attr('deleteURL');
	    if ( ! url ) {
		$.error('Could not delete record - no url provided');
	    }
	    this.action('delete', url, async);
	}, 
	action: function(action, url, async) {
	    // Perform the given action (add, update, delete), by submitting record data to the server.
	    var async = coalesce(async, true);

	    this.setState('updating');
	    this.getCurrentField().dbField('write');

	    var urlPieces = splitURL(url);
	    var path = urlPieces.path;
	    var data = urlPieces.data;
	    this.element.find('[name]').each(function(i, field) {
		var name = $(field).dbField('getName');
		if ( $(field).dbField('getType') == 'htmlarea' ) {
		    // xml cannot contain raw html, so escape/unescape it.
		    var value = escapeHTML($(field).dbField('getValue'));
		} else {
		    var value = $(field).dbField('getValue');
		}
		if ( typeof data[name] == "undefined" ) {
		    data[name] = value;
		} else if ( typeof data[name] == "object" ) {
		    data[name].push(value);
		} else {
		    data[name] = new Array(data[name]);
		}
	    });

	    httpPost(path, data, this._actionReturn.bind(this, action), this._actionReturnError.bind(this, action), async);
	    this.element.trigger('dbRecordAction', [action]);
	}, 
	getCurrentField: function() {
	    // Return the field currently being edited (or an empty jQuery object if none are)
	    return this.element.find(this.getRecordSet().dbRecordSet('getCurrentField'));
	},
	setValues: function(xmlDoc) {
	    // Takes an xml document/fragment and attempts to match the nodes to fields in the record, setting the values of those elements.
	    this.element.find('[name]').each(function(i, field) {
		var node = $(xmlDoc).find('records record ' + $(field).dbField('getName'));
		if ( node.length > 0 ) {
		    if ( $(field).dbField('getType') == 'htmlarea') {
			// xml cannot contain raw html, so escape/unescape it.
			$(field).dbField('setValue', unescapeHTML(node.text()));
		    } else {
			$(field).dbField('setValue', node.text());
		    }
		}
	    });
	    this.element.trigger('resize');
	}, 
	recordIn: function(event) {
	    // Call to start editing this record. Does nothing much because focus is determined by fields, not records.
	    this.getRecordSet().dbRecordSet('setCurrentRecord', this.element);
	    this.element.trigger('dbRecordIn', event);
	}, 
	recordOut: function(event){
	    // Call when done editing this record.
	    this.getRecordSet().dbRecordSet('setCurrentRecord', null);
	    this.element.trigger('dbRecordOut', event);
	},
	_actionReturn: function(action, xmlDoc, status, jqXHR) {
	    // Called on successfull return from a server action (add, update or delete)
	    this.setState('current');
	    this.error = undefined;
	    switch(action){
	    case "update":
		this.setValues(xmlDoc);
		break;
	    case "add":
		// Once added, a record becomes an updatable record
		this.type = "update";
		this.setValues(xmlDoc);
		break;
	    }

	    // For add and update, we want to handle incoming data before triggering event handlers. For delete, we want event handlers to trigger first.
	    this.element.trigger('dbRecordActionReturn', [action, xmlDoc, status, jqXHR]);

	    if ( action == "delete" ) {
		// When a record is deleted, remove it from the DOM.
		var recordSet = this.getRecordSet();
		this.destroy();
		this.element.remove();
		recordSet.trigger('resize');
	    }
	},
	_actionReturnError: function(action, message, type) {
	    // Called when a server action returns an error
	    this.setState('error');
	    if ( type != 'USER' ) {
		alert(message);
	    }
	    this.error = message;
	    this.element.trigger('dbRecordActionReturnError', [action, message, type]);
	}
    });
})(jQuery);