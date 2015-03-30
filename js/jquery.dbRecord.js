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
	delete: function(async) {
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
            // Add the authenticity token.
            data['_authenticity_token'] = $('[name=_authenticity_token]').val();
	    // Post
	    httpPost(path, data, this._actionReturn.bind(this, action), this._actionReturnError.bind(this, action), async);
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
        parseXMLResponse: function(response) {
            // Parse the XML response.
            // Set the values of matched elements.
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
	    this.element.trigger('resize');
        },
        parseJSONResponse: function(response) {
            // Parse the JSON response.
            // Check each record item and show a message if invalid otherwise set value.
            var $record = this.element;
            $.each(response.record, function (name, object) {
                var $element = $record.find('[name=' + name + ']');
                if ( ! object.valid ) {
                    // Record item not valid - mark invalid and display message to user.
                    if ( $element.length !== 0 ) {
                        // Show message to user about error.
                        $.check.showMessage($element, object.message);
                        $element.addClass('invalid');
                    }
                } else {
                    $element.removeClass('invalid');
                    $element.val(object.value);
                }
            });
            
            // show any general messages.
            if (response.message) {
                var recordSet = this.getRecordSet();
                $.each(response.message, function(type, object) {
                    recordSet.trigger('message', [{
                        type: 'message',
                        html: object.value
                    }]);
                });
            }

            // Redirect if the redirect action was given
            if (response.action && response.action['redirect']) {
                window.location.href = response.action.redirect.value;
            }
        },
	_actionReturn: function(action, data, status, jqXHR) {
	    // Called on successfull return from a server action (add, update or delete)	    
	    this.error = undefined;
            var returnType = jqXHR.getResponseHeader('content-type');
            var valid = true;
            switch (returnType) {
            case "application/json; charset-utf-8":
                this.parseJSONResponse(data);
                valid = data.status === 'valid';
                break;
            case "text/xml; charset=utf-8":
                this.parseXMLResponse(data);
                break;
            default:
                this._actionReturnError(action, 'Expected XML or JSON but got ' + returnType, 'RESPONSE');
                return;
            }

            if (valid) {
                this.setState('current');
	        switch(action){
	        case "add":
		    // Once added, a record becomes an updatable record
		    this.saveAction = "update";
		    break;
	        }

                // For add and update, we want to handle incoming data before triggering event handlers. For delete, we want event handlers to trigger first.
	        this.element.trigger('dbRecordActionReturn', [action, data, status, jqXHR]);

	        if ( action == "delete" ) {
		    // When a record is deleted, remove it from the DOM.
		    var recordSet = this.getRecordSet();
		    this.destroy();
		    this.element.remove();
		    recordSet.trigger('resize');
	        }
            } else {
                this.setState('error');
            }
	},
	_actionReturnError: function(action, message, type) {
	    // Called when a server action returns an error
	    this.error = message;
	    this.setState('error');
	    if ( type != 'USER' ) {
		qcode.alert(message);
	    }
	    this.element.trigger('dbRecordActionReturnError', [action, message, type]);
	}
    });
})(jQuery);