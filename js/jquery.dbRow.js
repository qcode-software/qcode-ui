(function($, window, document, undefined){
    $.widget("qcode.dbRow", {
	options: {
	    'type': 'update'
	},
	_create: function(){
	    this.state = 'current';
	    this.error = undefined;
            // AJAX headers
            this.headers = {
                Accept: "application/json,text/xml"
            }
	},
	getGrid: function(){
	    return this.element.closest('table');
	},
	getColgroup: function(){
	    return this.getGrid().children('colgroup');
	},
	getCurrentCell: function() {
	    return this.getGrid().dbGrid('getCurrentCell');
	},
	getState: function(){
	    return this.state;
	},
	getRowData: function(){
	    // Return object with name/value pairs of row data
	    var data = {};
	    this.element.children('td').each(function() {
		var cell = $(this);
		var colName = cell.dbCell('getCol').attr('name');
		var cellValue = cell.dbCell('getValue');
		data[colName] = cellValue;
	    });
	    return data;
	},
	setState: function(newState){
	    // Set the state of this row
	    var grid = this.getGrid();
	    var oldState = this.state;
	    var message;
            var messageType = 'notice';
	    
	    switch (newState) {
	    case 'dirty':
		if ( oldState === 'current' && this.option('type') === 'add' ) {
		    // Append New Row
		    grid.dbGrid('createNewRow');
		}
		if ( oldState === 'current' || oldState === 'error' ) {
		    var span = $('<span>').text('save').click(this.save.bind(this)).addClass('action save');
		    var message = $('<span>').text('Editing ... to ').append(span).append(', type Ctrl+S');
		}
		break;
	    case 'current': 
		message = "Saved.";
		break;
	    case 'updating': 
		message = "Updating ...";
		break;
	    case 'error': 
		message = this.error;
                messageType = 'error';
		break;
	    default:
		$.error('Invalid state');
		return;
	    }

	    this.element.removeClass("current dirty updating error");
	    this.element.addClass(newState);
            // Notify plugins such as statusFrame
            this.element.trigger('message', [{
                type: messageType,
                html: message
            }]);
	    this.state = newState;
	    this.getCurrentCell().dbCell('editor', 'repaint');
	    this.element.trigger('dbRowStateChange');
	},
	rowIn: function(){  
	    // Update NavCounter and statusBarMsg
	    var row = this.element;
	    var grid = this.getGrid();

	    // Custom Event: Trigger any dbRowIn events bound to this table
	    row.trigger('dbRowIn');

	    if ( this.error ) {
                this.element.trigger('message', [{
                    type: 'error',
                    html: this.error
                }]);
	    }
	    grid.dbGrid('setNavCounter', row.index());
	},
	rowOut: function(){
	    // Save row if dirty
	    // Custom Event: Trigger any dbRowOut events bound to this table
	    this.element.trigger('dbRowOut');
	    
	    if ( this.state === 'dirty' ) {
		this.save();
	    }
	},
	save: function(async){
	    // Save this row, using an add or update url as appropriate
	    var grid = this.getGrid();

	    if ( this.state === "updating" ) {
		return false;
	    }
	    switch(this.option('type')){
	    case "update":
		var url = grid.dbGrid('option', "updateURL");
		break;
	    case "add":
		var url = grid.dbGrid('option', "addURL");
		break;
	    }
	    if ( ! url ) {
		$.error('Could not ' + this.option('type') + ' record - no url provided');
	    }
	    this.action(this.option('type'), url, async);
	},
	action: function(action, url, async){
	    // Perform the given action (add, update, delete), by submitting row data to the server.
	    var grid = this.getGrid();

	    async = coalesce(async, true);
	    if ( action === 'add' || action === 'update' || action === 'delete' ) {
		this.setState('updating');
	    }
	    grid.dbGrid('getCurrentCell').dbCell('write');

	    var urlPieces = splitURL(url);
	    var path = urlPieces.path;
	    var data = $.extend(urlPieces.data, this.getRowData());
	    httpPost(path, data, this.actionReturn.bind(this, action), this.actionReturnError.bind(this, action), async, this.headers);
	    this.element.trigger('dbRowAction', [action]);
	},
	actionReturn: function(action, data, jqXHR){
	    // Called on successful return from a server action (add, update or delete)
	    var grid = this.getGrid();
            var contentType = jqXHR.getResponseHeader('Content-Type');
            
            switch(contentType) {
            case 'application/json; charset=utf-8':
                // JSON response
                // Check if redirect action given
                if ( data.action && data.action.redirect ) {
                    window.location.href = data.action.redirect.value;
                    return;
                }

                // Set row values if response valid otherwise feedback errors.
                if ( data.status === 'valid' ) {
                    this.jsonSetValues(data);
                } else {
                    // User errors
                    this.error = this._jsonParseErrors(data);
                    this.setState('error');
                    return;
                }
                break;
            case 'text/xml; charset=utf-8':
                // XML response
                // Check for user errors
                var xmlError = $(data).find('error').first();
                if ( xmlError.length == 1 ) {
                    this.error = xmlError.text();
                    this.setState('error');
                    return;
                } else {
                    // No errors - set row values
                    this.xmlSetValues(data);
                }
                break;
            default:
                // Not XML or JSON
                this.error = 'Expected XML or JSON but got ' + contentType;
                this.setState('error');
                qcode.alert(this.error);
                return;
            }
            
	    this.error = undefined;

	    switch(action) {
	    case 'update':
		this.setState('current');
		break;
	    case 'add':
		// Once added, a record becomes an updatable record
		this.option('type', 'update');
		this.setState('current');
		grid.dbGrid('incrRecCount', 1);
		break;
	    }

	    // For add and update, we want to handle incoming data before triggering event handlers. For delete, we want event handlers to trigger first.
	    this.element.trigger('dbRowActionReturn', [action, data, jqXHR]);

	    if ( action == 'delete' ) {
		// When a record is deleted, remove it from the DOM.	
		grid.dbGrid('removeRow',this.element)
		grid.dbGrid('incrRecCount', -1);
                grid.trigger('message', [{
                    type: 'notice',
                    html: 'Deleted.'
                }]);
		this.destroy();
	    }
	},
	actionReturnError: function(action, errorType, data, jqXHR) {
            // Handler for errors returned from server.            
            switch(errorType) {
            case "NAVIGATION":
                return;
            default:
                var contentType = jqXHR.getResponseHeader('Content-Type');
                
                switch(contentType) {
                case "application/json; charset=utf-8":
                    // JSON response
                    this.error = this._jsonParseErrors(data);
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
            qcode.alert(this.error);
	},
	xmlSetValues: function(xmlDoc) {
	    // Update row, calculated & external html values,
	    // Display info and alert messages
	    var grid = this.getGrid();
	    var currentCell = grid.dbGrid('getCurrentCell')
	    var dbRow = this;
            
	    // Update row with record values in xmlDoc response
	    var rec = $('records record', xmlDoc).first();
	    if ( rec.size() ) {
		rec.children().each(function() {
		    var xmlNode = $(this);
		    var colName = xmlNode.prop('nodeName');
		    var value = xmlNode.text()
		    dbRow.setCellValue(colName, value);		    
		});		
		if ( currentCell.size() && this.element.find(currentCell).size() ) {
		    currentCell.dbCell('cellIn', 'end');
		}
	    }

	    // Update 'Calculated' elements within grid
	    $('records > calculated', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id, grid).setObjectValue(value);
	    });

	    // Update html elements external to the grid
	    $('records > html', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		behave(
                    $('#' + id + ',[name="' + id + '"]').setObjectValue(value)
                );
	    });

	    // Display info message in statusBar
	    var xmlNode = $('records > info', xmlDoc);
	    if ( xmlNode.size() ) {
                this.element.trigger('message', [{
                    type: 'info',
                    html: xmlNode.text()
                }]);
	    }

	    // Alert
	    var xmlNode = $('records > alert', xmlDoc);
	    if ( xmlNode.size() ) {
		qcode.alert(xmlNode.text());
	    }
	},
        jsonSetValues: function(json) {
            // Update row, calculated & external html values, and display messages.
            var grid = this.getGrid();
            var currentCell = grid.dbGrid('getCurrentCell');
            var dbRow = this;

            // Update row record values
            if ( json.record ) {
                $.each(json.record, function(name, properties) {
                    dbRow.setCellValue(name, properties.value);
                });
                
                if ( currentCell.size() && this.element.find(currentCell).size() ) {
		    currentCell.dbCell('cellIn', 'end');
		}
            }

            // Update 'calculated' elements
            if ( json.calculated ) {
                $.each(json.calculated, function(name, value) {                
                    $('#' + name, grid).setObjectValue(value);
                });
            }

            // Update html elements outwith the grid
            if ( json.html ) {
                $.each(json.html, function(name, value) {
                    behave(
                        $('#' + name + ',[name=' + name + ']').setObjectValue(value)
                    );
                });
            }

            // Display messages
            var element = this.element;
            if ( json.message && (!json.action || !json.action.redirect) ) {
                $.each(json.message, function(type, properties) {
                    switch(type) {
                    case 'notify':
                        element.trigger('message', [{
                            type: 'info',
                            html: properties.value
                        }]);
                        break;
                    case 'alert':
                        qcode.alert(properties.value);
                        break;
                    }
                });
            }
        },
	setCellValue: function(colName, value){
	    // Set the value of the cell corresponding to colName.
	    var colIndex = $('col[name='+colName+']', this.getColgroup()).index();
	    if ( colIndex !== -1 ) {
		var cell = this.element.children('td').eq(colIndex);
		cell.dbCell('setValue',value);
	    }
	},
	delete: function(async){
	    var grid = this.getGrid();
	    var url = grid.dbGrid('option', 'deleteURL');
	    if ( ! url ) {
		$.error('Could not delete record - no url provided');
	    }
	    this.action('delete', url, async); 
	},
        _jsonParseErrors: function(json) {
            // Parses error messages in the JSON object and returns an HTML formatted string.
            var errors = [];

            // Add messages from invalid record items.
            $.each(json.record, function(name, properties) {
                if ( !properties.valid ) {
                    errors.push(properties.message);
                }
            });
            
            // Check for error message
            if ( json.message && json.message.error ) {
                errors.push(json.message.error.value);
            }

            if ( errors.length == 1 ) {
                // Return the error
                return errors[0];
            } else if ( errors.length > 1 ) {
                // Return errors as an unordered list
                var errorList = $('<ul></ul>');
                $.each(errors, function(index, value) {
                    errorList.append('<li>' + value + '</li>')
                });
                return errorList;
            } else {
                throw "No error descriptions found!"
            }
        }
    });
})(jQuery, window, document);