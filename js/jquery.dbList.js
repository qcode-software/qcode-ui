// A table, with 1 row selected, which can be updated from the server.
;(function($, undefined) {
    $.widget('qcode.dbList', {
        options: {
            selectedRowIndex: -1,
            dataURL: undefined
        },
        _create: function() {
            // Get options from custom attributes
            this.options.selectedRowIndex = coalesce(this.element.attr('selectedRowIdx'), this.options.selectedRowIndex);
            this.options.dataURL = coalesce(this.element.attr('dataURL'), this.options.dataURL);
            this.options = $.extend(this.element.data(this.widgetName), this.options);

            if ( this.options.selectedRowIndex >= 0 ) {
                this.row = this.element.children('tbody').children('tr').eq(this.options.selectedRowIndex);
                this.row.css({
                    'background': 'highlight',
                    'color': 'highlighttext'
                })
            }
        },
        update: function(async) {
	    async = coalesce(async, true);
            if ( this.row === undefined || this.options.dataURL === undefined ) {
                return;
            }
            var urlPieces = splitURL(this.options.dataURL);
	    var path = urlPieces.path;
	    var data = urlPieces.data;
            var columns = this.element.find('col');
            var cells = this.row.children('td');
            cells.each(function(index, domCell) {
                data[columns.eq(index).attr('name')] = $(domCell).text();
            });
            httpPost(path, data, this._actionReturn.bind(this), this._actionReturnError.bind(this), async);
        },
        _actionReturn: function(xmlDoc, status, jqXHR) {
            var dbList = this;

	    // Update row with record values in xmlDoc response
	    var rec = $('records record', xmlDoc).first();
	    if ( rec.length > 0 ) {
		rec.children().each(function() {
		    var xmlNode = $(this);
		    var colName = xmlNode.prop('nodeName');
		    var value = xmlNode.text()
                    dbList.row.findByColumn('[name='+colName+']').text(value);	    
		});
	    }

	    // Update 'Calculated' elements within grid
	    $('records > calculated', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id, dbList.element).setObjectValue(value);
	    });

	    // Update html elements external to the grid
	    $('records > html', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id + ',[name="' + id + '"]').setObjectValue(value);
	    });

	    // Alert
	    var xmlNode = $('records > alert', xmlDoc);
	    if ( xmlNode.size() ) {
		alert(xmlNode.text());
	    }
            this.row.css('background', 'highlight');
        },
        _actionReturnError: function(message, type) {
            this.row.css('background', 'red');
	    if ( type != 'USER' ) {
		alert(message);
	    }
        }
    });
})(jQuery);