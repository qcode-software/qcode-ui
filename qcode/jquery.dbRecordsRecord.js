// dbRecord plugin
// Part of a dbRecordSet, a dbRecord represents a collection of dbFields which need to be added, updated, or deleted together.
;(function($, undefined){
    $.widget('qcode.dbRecord', {
	_create: function(){
	    this.state = 'current';
	    if ( this.element.attr('saveAction') === "add" ) {
		this.saveAction = "add";
	    } else {
		this.saveAction = "update";
	    }
	},
	getRecordSet: function(){
	    // Get the record-set element for this record
	    return this.element.closest('.recordSet');
	}, 
	getState: function(){
	    // Get the state of this record
	    return this.state;
	}, 
	setState: function(newState){
	    // Set the state of this record
	    switch(newState) {
	    case "updating":
	    case "error":
	    case "current":
	    case "dirty":
		this.element.removeClass("current dirty updating error");
		this.element.addClass(newState);
		this.state = newState;
		this.element.trigger('dbRecordStateChange');
		break;
	    default:
		$.error('Invalid state');
	    }
	}, 
	save: function(async){
	    // Save this record, using an add or update url as appropriate
	    if ( this.getState() === "updating" ) return false;
	    var url = this.getRecordSet().attr(this.saveAction + "URL");
	    if ( ! url ) {
		$.error('Could not '+this.saveAction+' record - no url provided');
	    }
	    this.action(this.saveAction, url, async);
	}, 
	delete: function(async){
	    // Delete this record, by sending a delete request to the server
	    if ( this.getState() === "updating" ) return false;
	    var url = this.getRecordSet().attr('deleteURL');
	    if ( ! url ) {
		$.error('Could not delete record - no url provided');
	    }
	    this.action('delete', url, async);
	}, 
	action: function(action, url, async){
	    // Perform the given action (add, update, delete), by submitting record data to the server.
	    var async = coalesce(async, true);

	    this.setState('updating');
	    this.getCurrentField().dbField('write');

	    var urlPieces = splitURL(url);
	    var path = urlPieces.path;
	    var data = urlPieces.data;
	    this.element.find('[name]').each(function(i, field) {
		var name = $(field).dbField('getName');
		var value = $(field).dbField('getValue');
		data[name] = value;
	    });

	    httpPost(path, data, this._actionReturn.bind(this, action), this._actionReturnError.bind(this, action), async);
	    this.element.trigger('dbRecordAction', [action]);
	}, 
	getCurrentField: function(){
	    return this.element.find(this.getRecordSet().dbRecordSet('getCurrentField'));
	}, 
	getFields: function(){
	    // Returns all editable fields in the record
	    return this.element.find('.editable');
	}, 
	setValues: function(xmlDoc){
	    // Takes an xml document/fragment and attempts to match the nodes to fields in the record, setting the values of those elements.
	    this.element.find('[name]').each(function(i, field) {
		var node = $(xmlDoc).find('records record ' + $(field).dbField('getName'));
		if ( node.length > 0 ) {
		    $(field).dbField('setValue', node.text());
		}
	    });
	    this.element.trigger('resize');
	}, 
	recordIn: function(event){
	    this.element.trigger('dbRecordIn', event);
	}, 
	recordOut: function(event){
	    if ( this.getState() === "dirty" ) {
		this.save();
	    }
	    this.element.trigger('dbRecordOut', event);
	},
	_actionReturn: function(action, xmlDoc, status, jqXHR){
	    this.setState('current');
	    switch(action){
	    case "update":
		this.setValues(xmlDoc);
		break;
	    case "add":
		this.saveAction = "update";
		this.setValues(xmlDoc);
		break;
	    }
	    this.element.trigger('dbRecordActionReturn', [action, xmlDoc, status, jqXHR]);
	    if ( action == "delete" ) {
		this.element.remove();
		this.getRecordSet().trigger('resize');
	    }
	},
	_actionReturnError: function(action, message, type, error){
	    this.setState('error');
	    if ( type != 'USER' ) {
		alert(message);
	    }
	    this.element.trigger('dbRecordActionReturnError', [action, message, type, error]);
	}
    });
})(jQuery);