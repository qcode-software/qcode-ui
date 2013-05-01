(function($, undefined){
    function DbForm(form) {
	this.form = $(form);
	this.elements = $([]);
    }
    $.extend(DbForm.prototype, {
	init: function(options) {
	    this.settings = $.extend({
		formType: "update",
		enabled: true,
		checkOnExit: true,
		initialFocus: true
	    }, options);
	    if ( typeof this.settings.formActionReturn == "function" ) {
		this.form.on('formActionReturn.DbForm', this.settings.formActionReturn);
	    }

	    this.state = 'current';
	    this.divStatus = this.form.find('div.clsDbFormDivStatus').last();
	    this.elements = this.elements.add('input', this.form).add('select', this.form).add('textarea', this.form).add('div.clsDbFormHTMLArea, div.clsRadioGroup', this.form);
	    this.error = undefined;
	    if ( typeof this.settings.dataURL != "undefined" ) {
		this.formAction('requery', this.settings.dataURL);
	    }
	    if ( typeof this.settings.qryURL != "undefined" ) {
		this.nav('FIRST');
	    }
	    this.form.on('change.DbForm', 'select', this.setDirty.bind(this));
	    this.form.on('click.DbForm', 'input[type="checkbox"], input[type="radio"]', this.setDirty.bind(this));
	    if ( this.settings.checkOnExit && this.settings.formType === "update" ) {
		$(window).on('beforeunload.DbForm', onBeforeUnload.bind(this));
	    }
	    this.form.on('keydown.DbForm', onKeyDown.bind(this));
	    this.form.on('keypress.DbForm', onKeyPress.bind(this));
	    this.form.on('submit.DbForm', onSubmit.bind(this));
	    if ( this.settings.initialFocus ) {
		this.focus();
	    }
	    if ( typeof this.settings.initialFind == "string" ) {
		var name = this.settings.initialFind.split('=')[0];
		var value = this.settings.initialFind.split('=')[1];
		this.find(name, value);
	    }
	},
	save: function(async) {
            async = coalesce(async, false);
	    switch( this.settings.formType ) {
	    case "update":
		this.setState('updating');
		this.formAction('update', this.settings.updateURL,undefined,undefined,async);
		break;
	    case "add":
		this.setState('updating');
		this.formAction('add', this.settings.addURL,undefined,undefined,async);
		break;
	    case "submit":
		this.form.attr('action', this.settings.submitURL);
		this.elements.filter('div.clsDbFormHTMLArea').each(function(i, div){
		    this.form.append(
			$('<input type="hidden">')
			    .attr('name', $(div).attr('name'))
			    .val($(div).html())
		    );
		}.bind(this));
		this.elements.filter('input[type="checkbox"]:not(:checked)').each(function(i, input) {
		    if ( $(input).attr('boolean') ) {
			this.form.append(
			    $('<input type="hidden">')
				.attr('name', $(input).attr('name'))
				.val("false")
			);
		    }
		}.bind(this));
		this.form.submit();
		break;
	    }
	},
	formAction: function(type,url,handler,errorHandler,async) {
	    var dbForm = this;
	    if ( typeof handler == "undefined" ) {
		handler = function(data, textStatus, jqXHR){
		    formActionSuccess.call(dbForm, data, type);
		}
	    }
	    if ( typeof errorHandler == "undefined" ) {
		errorHandler = function(errorMessage, errorType){
		    formActionError.call(dbForm, errorMessage);
		}
	    }
	    if ( typeof async == "undefined" ) {
		async = false;
	    }
	    httpPost(url, formData.call(this, this.form), handler, errorHandler, async);
	},
	focus: function() {
	    this.elements.each(function(){
		$(this).focus();
		return ! $(this).is(':focus');
	    });
	},
	nav: function(navTo) {
	    this.form.find('[name="navTo"]').val(navTo);
	    if ( this.state === "dirty" ) {
		this.save();
	    } else {
		this.setState('loading');
		this.formAction('qry', this.settings.qryURL);
	    }
	},
	find: function() {
	    if ( this.state === "dirty" ) {
		this.save();
	    } else {
		this.setState('loading');
	    }
	    var data = {};
	    for(var i = 0; i < arguments.length; i+=2){
		data[arguments[i]] = arguments[i+1];
	    }
	    var dbForm = this;
	    httpPost(this.settings.searchURL, data, function(data, textStatus, jqXHR) {
		formActionSuccess.call(dbForm, data, "search");
	    }, formActionError.bind(this), true);
	},
	del: function() {
	    if ( window.confirm('Delete the current record?') ) {
		this.setState('deleting');
		this.formAction('delete',this.settings.deleteURL);
	    }
	},
	setState: function(newState) {
	    switch(newState) {
	    case "dirty":
		var span = $('<span>').text('save').click(this.save.bind(this)).addClass('clickToSave');
		var message = $('<span>').text('Editing ... To ').append(span).append(', type Ctrl+S');
		this.setStatus(message);
		this.form.find('[name="nav_new"]').prop('disabled', ( ! this.settings.addURL) );
		this.form.find('[name="nav_prev"], [name="nav_next"]').prop('disabled', false);
		break;
	    case "updating":
		this.setStatus('Updating ...');
		break;
	    case "current":
		switch(this.state) {
		case "updating":
		    this.setStatus('Saved.');
		    break;
		case "loading":
		    this.setStatus('');
		    break;
		case "deleting":
		    this.setStatus('Deleted.');
		    break;
		default:
		    this.setStatus('');
		    break;
		}
		break;
	    };
	    this.state = newState;
	},
	setDirty: function() {
	    this.setState('dirty');
	},
	setStatus: function(message) {
	    if ( typeof this.divStatus != "undefined" ) {
		$(this.divStatus).empty().append(message);
	    }
	}
    });
    function onBeforeUnload() {
	if ( this.state == 'dirty' ) {
	    if (window.confirm('Do you want to save your changes?')) {
		this.save();
		if (this.state == 'error' ) {
		    event.returnValue = "Your changes could not been saved.\nStay on the current page to correct.";
		}
	    }
	}
    }
    function onSubmit() {
	if ( this.settings.formType == 'submit' ) {
	    return true;
	}
	return false;
    }
    function onKeyDown(e) {
	if ( e.which == 83 && e.ctrlKey ) {
	    // Ctrl+S
	    this.save();
	    e.returnValue = false;
	    e.preventDefault();
	}
	// Backspace
	if ( e.which == 8) {
	    this.setState('dirty');
	}
    }
    function onKeyPress() {
	this.setState('dirty');
    }

    function formActionSuccess(xmlDoc, type) {
	var dbForm = this;
	$('records > record *', xmlDoc).each(function(i, xmlNode){
	    dbForm.form.find('#' + $(xmlNode).prop('nodeName') + ', [name="' + $(xmlNode).prop('nodeName') + '"]').each(function(j, target){
		if ( $(target).is('input, textarea, select') ) {
		    $(target).val($(xmlNode).text());
		} else {
		    $(target).html($(xmlNode).text());
		}
	    });
	});
	$('records > html *', xmlDoc).each(function(i, xmlNode){
	    $('#'+$(xmlNode).prop('nodeName')).each(function(j, target) {
		if ( $(target).is('input, textarea, select') ) {
		    $(target).val($(xmlNode).text());
		} else {
		    $(target).html($(xmlNode).text());
		}
	    });
	});
	
	if ( type == 'update' || type== 'add' ||  type== 'delete' || type=='qry') {
	    this.setState('current');
	}
	
	// Info
	var rec = $(xmlDoc).find('records > info').first();
	if ( rec.length == 1 ) {
	    this.setStatus(rec.text());
	}
	// Alert
	var rec = $(xmlDoc).find('records > alert').first();
	if ( rec.length == 1 ) {
	    alert(rec.text());
	}
	// Nav
	if ( this.form.find('[name="recordsLength"]').length > 0 && this.form.find('[name="recordNumber"]').length > 0 ) {
	    var recordsLength =  this.form.find('[name="recordsLength"]').val();
	    var recordNumber = this.form.find('[name="recordNumber"]').val();
	    if ( recordNumber==1 ) {
		this.form.find('[name="nav_first"]').prop('disabled', true);
		this.form.find('[name="nav_prev"]').prop('disabled', true);
	    } else {
		this.form.find('[name="nav_first"]').prop('disabled', false);
		this.form.find('[name="nav_prev"]').prop('disabled', false);
	    }
	    if ( recordNumber==recordsLength ) {
		this.form.find('[name="nav_last"]').prop('disabled', true);
		this.form.find('[name="nav_next"]').prop('disabled', true);
	    } else {
		this.form.find('[name="nav_last"]').prop('disabled', false);
		this.form.find('[name="nav_next"]').prop('disabled', false);
	    }
	    if ( recordNumber==0 ) {
		// New Record
		this.settings.formType = 'add';
		this.form.find('[name="nav_new"]').prop('disabled', true);
		this.form.find('[name="nav_prev"]').prop('disabled', true);
		this.form.find('[name="nav_next"]').prop('disabled', true);
		this.form.find('[name="nav_del"]').prop('disabled', true);
	    } else {
		this.settings.formType = 'update';
		if ( this.settings.addURL ) {
		    this.form.find('[name="nav_new"]').prop('disabled', false);
		} else {
		    this.form.find('[name="nav_new"]').prop('disabled', true);
		}
		if ( this.settings.deleteURL ) {
		    this.form.find('[name="nav_del"]').prop('disabled', false);
		} else {
		    this.form.find('[name="nav_del"]').prop('disabled', true);
		}
	    }
	    this.form.find('#recordIndicator').html(recordNumber + ' of ' + recordsLength);
	    this.form.find('[name="navTo"]').val('HERE');
	}
	// Event onFormActionReturn
	this.form.trigger('formActionReturn.dbForm', [type])
    }
    function formActionError(errorMessage) {
	this.setState('error');
	this.setStatus(errorMessage);
	alert("Your changes could not be saved.\n" + stripHTML(errorMessage));
	this.form.trigger('formActionError.dbForm', [errorMessage]);
    }

    function formData(form) {
	var data = {};
	this.elements
	    .filter(function(){ return $(this).prop('name') != ""; })
	    .filter(function(){ return $(this).prop('type') != "checkbox" || $(this).attr('boolean') == "true" || $(this).is(':checked'); })
	    .filter(function(){ return $(this).prop('type') != "radio" || $(this).is(':checked'); })
	    .filter(function(){ return ! $(this).is('div.clsRadioGroup'); })
	    .each(function(){
		var name = $(this).attr('name');
		var value = "";
		if ( $(this).is('input') ) {
		    if ( $(this).prop('type') == "checkbox" ) {
			if ( $(this).attr('boolean') == "true" ) {
			    value = $(this).is(':checked');
			} else {
			    value = $(this).is(':checked') ? $(this).val() : '';
			}
		    } else {
			value = $(this).val();
		    }
		} else if ( $(this).is('textarea') ) {
		    value = $(this).val();
		} else if ( $(this).is('select') ) {
		    value = $(this).val();
		} else {
		    value = $(this).html();
		}
		if ( data[name] === undefined ) {
		    data[name] = value;
		} else if ( typeof data[name] !== 'object' ) {
		    data[name] = new Array(data[name], value);
		} else {
		    data[name].push(value);
		}

	    });
	return data;
    }

    $.fn.dbForm = function(method) {
	var args = arguments;
	var forms = this;
	var returnVal;

	forms.each(function(){
	    var dbForm = $(this).data('dbForm');
	    if ( ! dbForm ) {
		dbForm = new DbForm($(this));
		$(this).data('dbForm', dbForm);
	    }
	    if ( typeof method == "object" || typeof method == "undefined" ) {
		dbForm.init.apply( dbForm, args );
	    } else if ( typeof dbForm[method] == "function" ) {
		returnVal = dbForm[method].apply( dbForm, Array.prototype.slice.call( args, 1 ) );
		if ( typeof returnVal != "undefined" ) {
		    return returnVal;
		}
	    } else if ( typeof dbForm.settings[method] != "undefined" && args.length == 1 ) {
		return dbForm.settings[method];
	    } else if ( typeof dbForm.settings[method] != "undefined" && args.length == 2 ) {
		dbForm.settings[method] = args[1];
	    } else if ( typeof dbForm[method] != "undefined" && args.length == 1 ) {
		return dbForm[method];
	    } else if ( typeof dbForm[method] != "undefined" && args.length == 2 ) {
		dbForm[method] = args[1];
	    } else {
		$.error( 'Method or property ' + method + ' does not exist on jQuery.dbForm' );
	    }
	});
	return forms;
    };
})(jQuery);