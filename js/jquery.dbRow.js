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
	actionReturn: function(action, data, status, jqXHR){
	    // Called on successful return from a server action (add, update or delete)
	    var grid = this.getGrid();
            var contentType = jqXHR.getResponseHeader('Content-Type');
            
            switch(contentType) {
            case "application/json; charset=utf-8":
                // Redirect if action is given
                if ( data.action && data.action.redirect ) {
                    window.location.href = data.action.redirect.value;
                    return;
                }
                this.jsonSetValues(data);
                break;
            case "text/xml; charset=utf-8":
                this.xmlSetValues(data);
                break;
            default:
                this.error = "Expected XML or JSON but got " + contentType;
                qcode.alert(this.error);
                this.setState('error');
                return;
            }
            
	    this.error = undefined;

	    switch(action){
	    case "update":
		this.setState('current');
		break;
	    case "add":
		// Once added, a record becomes an updatable record
		this.option('type', "update");
		this.setState('current');
		grid.dbGrid('incrRecCount', 1);
		break;
	    }

	    // For add and update, we want to handle incoming data before triggering event handlers. For delete, we want event handlers to trigger first.
	    this.element.trigger('dbRowActionReturn', [action, data, status, jqXHR]);

	    if ( action == "delete" ) {
		// When a record is deleted, remove it from the DOM.	
		grid.dbGrid('removeRow',this.element)
		grid.dbGrid('incrRecCount', -1);
                grid.trigger('message', [{
                    type: 'notice',
                    html: "Deleted."
                }]);
		this.destroy();
	    }
	},
	actionReturnError: function(action, errorMessage, errorType, jqXHR) {
            // Handler for errors returned from server.
            var dbRow = this;
            
            switch(errorType) {
            case "NAVIGATION":
                return;
            case "USER":
                // Fall through
            case "HTTP":
                var errorList = $('<ul></ul>');
                var contentType = jqXHR.getResponseHeader('Content-Type');
                
                switch(contentType) {
                case "application/json; charset=utf-8":
                    var json = $.parseJSON(jqXHR.responseText);
                    
                    if ( json.action && json.action.redirect ) {
                        // Redirect
                        window.location.href = json.action.redirect.value;
                        return;
                    } else if ( json.message ) {
                        // Show messages
                        var element = this.element;
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
                            case 'error':
                                errorList.append($('<li>' + properties.value + '</li>'));
                                break;
                            }
                        });
                    }

                    // Add invalid cell messages to error message.
                    $.each(json.record, function(name, properties) {
                        if ( !properties.valid ) {
                            errorList.append($('<li>' + properties.message + '</li>'));
                        }
                    });

                    this.error = errorList;
                    break;
                case "text/xml; charset=utf-8":
                    var xml = $.parseXML(jqXHR.responseText);
                    var xmlError = $(xml).find('error').first();
                    if ( xmlError.length == 1 ) {
                        this.error = xmlError.text();
                    }
                    break;
                default:
                    this.error = "Expected XML or JSON but got " + contentType;
                }
                
                break;
            default:
                this.error = errorMessage;
            }

            // Alert on all errors that aren't user errors.
            if ( jqXHR.status !== 400 && jqXHR.status !== 200 ) {
                qcode.alert(this.error)
            }
            this.setState('error');
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
                    case 'error':
                        dbRow.error = properties.value;
                        dbRow.setState('error');
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
	}
    });
})(jQuery, window, document);