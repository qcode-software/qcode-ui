// dbRecord plugin
// Part of a dbRecordSet. 
// A dbRecord represents a collection of dbFields.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget('qcode.dbRecord', {
        
	_create: function() {
	    // saveEvent option
	    this.options.saveEvent = coalesce(
                this.element.attr('saveEvent'),
                this.options.saveEvent,
                this.getRecordSet().dbRecordSet("option", "saveEvent")
            );

            // Inital state
	    this.state = 'current';

            // Record type
	    if ( this.element.attr('saveAction') === "add" ) {
		this.saveAction = "add";
	    } else {
		this.saveAction = "update";
	    }

	    if ( this.options.saveEvent === 'recordOut' ) {
		this._on({
		    'dbRecordOut': this._onDbRecordOut
		});
	    }

            // AJAX headers
            this.headers = {
                Accept: "application/json,text/xml"
            }

            this._on({
                'keydown .editable': this._onFieldKeyDown,
                'editorKeyDown': this._onFieldKeyDown
            });
	},
        _onDbRecordOut: function() {
	    if ( this.getState() === "dirty" ) {
		this.save();
	    }
	},
        _onFieldKeyDown: function(event) {
            // ctrl+s to save.
            if ( event.which == 83 // S
                 && event.ctrlKey ) {
                this.save();
                event.preventDefault();
            }
        },
        _sendMessage: function() {
            switch (this.getState()) {
            case "updating":
                this.element.trigger('message', [{
                    type: 'notice',
                    html: 'Updating...'
                }]);
                break;
            case "error":
                this.element.trigger('message', [{
                    type: 'error',
                    html: this.getErrorMessage()
                }]);
                break;
            case "current":
                this.element.trigger('message', [{
                    type: 'notice',
                    html: ''
                }]);
                break;
            case "dirty":
                var saver = $('<span>')
                        .text('save')
                        .on('click',this.save.bind(this, true))
                        .addClass('action save');
                var message = $('<span>')
                        .text('Editing .. to ')
                        .append(saver)
                        .append(', type Ctrl+S');
                this.element.trigger('message', [{
                    type: 'message',
                    html: message
                }]);
                break;
	    default:
		$.error('Invalid state');
	    }
        },
        _destroy: function() {
            this.element.find('.editable').dbField('destroy');
        },
	getRecordSet: function() {
	    return this.element.closest('.record-set');
	}, 
	getState: function() {
	    return this.state;
	}, 
	setState: function(newState) {
	    // Set the state of this record
            if ( this.getState() != newState ) {
	        switch(newState) {
	        case "updating":
	        case "error":
	        case "current":
	        case "dirty":
		    this.element.removeClass("current dirty updating error");
		    this.element.addClass(newState);
		    this.state = newState;
                    this._sendMessage();
                    this.element.trigger('cosmeticChange');
		    break;
	        default:
		    $.error('Invalid state');
	        }
            }
	},
	getErrorMessage: function() {
	    return this.error;
	},
	save: function(async) {
	    // Save this record
	    if ( this.getState() === "updating" ) {
		return false;
	    }
	    var url = this.getRecordSet().attr(this.saveAction + "URL");
	    if ( ! url ) {
		$.error('Could not '+this.saveAction+' record - no url provided');
	    }
	    this.action(this.saveAction, url, async);
	}, 
	"delete": function(async) {
	    // Delete this record
	    if ( this.getState() === "updating" ) {
		return false;
	    }
            var dbRecord = this;
            switch (this.saveAction) {
            case "add":
                var deleteFunction = function() {
		    // When a record is deleted, remove it from the DOM.
		    var recordSet = dbRecord.getRecordSet();
		    dbRecord.destroy();
		    dbRecord.element.remove();
                    recordSet.trigger('message', [{
                        type: 'message',
                        html: 'Record Deleted.'
                    }]);
		    recordSet.trigger('resize');
                }
                break;
            case "update":
                var deleteFunction = function() {
	            var url = dbRecord.getRecordSet().attr('deleteURL');
	            if ( ! url ) {
		        $.error('Could not delete record - no url provided');
	            }
	            dbRecord.action('delete', url, async);
                }
                break;
            default:
                $.error('Attempt to delete record with unknown save action');
            }
            qcode.confirm("Delete the current record?", deleteFunction);
	}, 
	action: function(action, url, async) {
	    // Perform the given action (add, update, delete), by submitting record data to the server.
	    var async = coalesce(async, true);
	    this.setState('updating');

	    var urlPieces = splitURL(url);
	    var path = urlPieces.path;
	    var data = urlPieces.data;
	    // Look for any fields (elements with attr name) and store name/value in data
	    this.element.find('[name]').each(function(i, field) {
		var name = $(field).dbField('getName');
		if ( $(field).dbField('getType') == 'htmlarea' ) {
		    // cannot contain raw html, so escape/unescape field value.
		    var value = escapeHTML($(field).dbField('getValue'));
		} else {
		    var value = $(field).dbField('getValue');
		}
		// If name is used more than once store values in array
		if ( typeof data[name] == "undefined" ) {
		    data[name] = value;
		} else if ( Array.isArray(data[name]) ) {
		    data[name].push(value);
		} else {
		    data[name] = new Array(data[name], value);
		}
	    });
	    // Post
	    httpPost(path, data, this._actionReturn.bind(this, action), this._actionReturnError.bind(this, action), async, this.headers);
	    // custom event 
	    this.element.trigger('dbRecordAction', [action]);
	}, 
	getCurrentField: function() {
	    // Return the field currently being edited (or an empty jQuery object)
	    return this.element.find(this.getRecordSet().dbRecordSet('getCurrentField'));
	},
	recordIn: function(event) {
	    this.getRecordSet().dbRecordSet('setCurrentRecord', this.element);
	    this.element.trigger('dbRecordIn', event);
	}, 
	recordOut: function(event){
	    this.getRecordSet().dbRecordSet('setCurrentRecord', null);
	    this.element.trigger('dbRecordOut', event);
	},
        xmlSetValues: function(response) {
            // Set the values and messages from the XML response and display any user errors.
	    this.element.find('[name]').each(function(i, field) {
		var node = $(response).find('records > record > ' + $(field).dbField('getName'));
		if ( node.length > 0 ) {
		    if ( $(field).dbField('getType') == 'htmlarea') {
			// xml cannot contain raw html, so escape/unescape it.
			$(field).dbField('setValue', unescapeHTML(node.text()));
		    } else {
			$(field).dbField('setValue', node.text());
		    }
		}
	    });
            
            // Messages
            var xmlError = $(response).find('error').first();
            if ( xmlError.length == 1 ) {
                this.error = xmlError.text();
                qcode.alert(xmlError.text());
            }
            
	    this.element.trigger('resize');
        },
        jsonSetValues: function(response) {
            // Set values and messages from the JSON response and display any user errors.
            // Record
            var $record = this.element;
            $.each(response.record, function (name, object) {
                var $element = $record.find('[name=' + name + ']');
                if ( !object.valid && $element.length !== 0 ) {
                    // User error
                    $.check.showMessage($element, object.message);
                    $element.addClass('invalid');
                } else {
                    // Update value
                    $element.removeClass('invalid');
                    $element.dbField('setValue', object.value);
                }
            });
            
            // Messages
            var dbRecord = this;
            if (response.message) {
                var recordSet = this.getRecordSet();
                $.each(response.message, function(type, object) {
                    var message = object.value;
                    switch(type) {
                    case 'alert':
                        qcode.alert(message);
                        recordSet.trigger('message', [{
                            type: 'message',
                            html: message
                        }]);
                        break;
                    case 'notify':
                        recordSet.trigger('message', [{
                            type: 'message',
                            html: message
                        }]);
                        break;
                    case 'error':
                        dbRecord.error = message;
                        qcode.alert(message);
                        break;
                    }
                });
            }

            this.element.trigger('resize');
        },
	_actionReturn: function(action, data, jqXHR) {
	    // Called on successfull return from a server action (add, update or delete)
	    this.error = undefined;
            var contentType = jqXHR.getResponseHeader('content-type');
            var responseValid = true;
            switch (contentType) {
            case "application/json; charset=utf-8":
                // JSON response
                if (data.action && data.action.redirect) {
                    window.location.href = data.action.redirect.value;
                    return;
                }

                this.jsonSetValues(data);
                responseValid = data.status === 'valid';
                break;
            case "text/xml; charset=utf-8":
                // XML response
                this.xmlSetValues(data);
                responseValid = $(data).find('error').first().length == 0;
                break;
            default:
                this.error = 'Expected XML or JSON but got ' + contentType;
                this.setState('error');
                qcode.alert(this.error);
            }

            if ( !responseValid ) {
                // User errors
                this.setState('error');
                this.element.trigger('dbRecordActionReturnError', [action, this.error, 'USER']);
                return;
            }
            
            this.setState('current');
            this.error = undefined;
            
	    switch(action){
	    case "add":
		// Once added, a record becomes an updatable record
		this.saveAction = "update";
		break;
	    }

            // For add and update, we want to handle incoming data before triggering event handlers. For delete, we want event handlers to trigger first.
	    this.element.trigger('dbRecordActionReturn', [action, data, jqXHR]);

	    if ( action == "delete" ) {
		// When a record is deleted, remove it from the DOM.
		var recordSet = this.getRecordSet();
		this.destroy();
		this.element.remove();
		recordSet.trigger('resize');
	    }
	},
	_actionReturnError: function(action, errorType, data, jqXHR) {
	    // Called when a server action returns an error
            switch(errorType) {
            case "NAVIGATION":
                return;
            default:
                var contentType = jqXHR.getResponseHeader('content-type');
                
                switch (contentType) {
                case "application/json; charset=utf-8":
                    // JSON response
                    if (data.action && data.action.redirect) {
                        window.location.href = data.action.redirect.value;
                        return;
                    }

                    if ( data.message && data.message.error ) {
                        this.error = data.message.error.value;
                    }
                    
                    break;
                case "text/xml; charset=utf-8":
                    // XML response
                    var xmlError = $(data).find('error').first();
                    if ( xmlError.length == 1 ) {
                        this.error = xmlError.text();
                    }
                    break;
                default:
                    this.error = data;
                }
	    }
            
            this.setState('error');

            if ( typeof this.error === 'undefined' ) {
                qcode.alert('An unspecified error occurred. An email report has been sent to our engineers.');
                throw 'No error description found in response.'
            }
            
            qcode.alert(this.error);
            this.element.trigger('dbRecordActionReturnError', [action, this.error, errorType]);
        }
    });
})(jQuery);
