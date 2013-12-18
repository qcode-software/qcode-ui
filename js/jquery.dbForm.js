// dbForm plugin
;(function($, window, undefined){
    // ============================================================
    // dbForm class
    // ============================================================

    // Constructor function
    function DbForm(form) {
	this.form = $(form);
	this.elements = $([]);
    }

    // ============================================================

    // Public methods
    $.extend(DbForm.prototype, {
	init: function(options) {
            // Initialise the dbForm

            // Default settings
	    this.settings = $.extend({
		formType: "update", // Update, add, or submit
                updateType: "manual", //(with formType=="update"): manual, keyup, focus, or blur
		enabled: true,
		checkOnExit: true,
		initialFocus: true,
                initialFind: undefined, // "name=value"
                dataURL: undefined,
                qryURL: undefined,
                updateURL: undefined,
                addURL: undefined,
                submitURL: undefined,
                searchURL: undefined,
                deleteURL: undefined,
                formActionReturn: undefined // function
	    }, options);
	    if ( typeof this.settings.formActionReturn == "function" ) {
		this.form.on('formActionReturn.DbForm', this.settings.formActionReturn);
	    }

            // Class variables
	    this.state = 'current';

	    this.divStatus = this.form.find('.db-form-status').last();
	    this.elements = this.elements
                .add('input', this.form)
                .add('select', this.form)
                .add('textarea', this.form)
                .add('.db-form-html-area, radio-group', this.form);

	    this.error = undefined;

	    if ( typeof this.settings.dataURL != "undefined" ) {
		this.formAction('requery', this.settings.dataURL);
	    }
	    if ( typeof this.settings.qryURL != "undefined" ) {
		this.nav('FIRST');
	    }

            // Event listeners
	    this.form.on('change.DbForm', 'select, input[type="checkbox"], input[type="radio"]', this.setDirty.bind(this));
	    if ( this.settings.checkOnExit && this.settings.formType === "update" ) {
		$(window).on('beforeunload.DbForm', onBeforeUnload.bind(this));
	    }
	    this.form.on('keydown.DbForm', onKeyDown.bind(this));
	    this.form.on('keypress.DbForm', onKeyPress.bind(this));
	    this.form.on('submit.DbForm', onSubmit.bind(this));
            if ( this.settings.formType == "update" ) {
                var dbForm = this;
                var saveHandler = function(event) {
                    if ( $(event.target).is(dbForm.elements) && dbForm.state == 'dirty' ) {
                        dbForm.save();
                    }
                }
                switch ( this.settings.updateType ) {
                case "focus":
                    this.form.on('focusin.DbForm', saveHandler);
                    this.form.on('change.DbForm', 'input[type="checkbox"], input[type="radio"]', saveHandler);
                    break;
                case "blur":
                    this.form.on('focusout.DbForm', saveHandler);
                    break;
                case "keyup":
                    this.form.on('keyup.DbForm', function(event) {
                        if ( $(event.target).is(dbForm.elements) ) {
                            cancelDelayedSave.call(dbForm);
                            dbForm.keyUpTimer = window.setTimeout(dbForm.save.bind(dbForm),750);
                        }
                    });
                    this.form.on('change.DbForm', 'input[type="checkbox"], input[type="radio"]', saveHandler);
                    break;
                }
            }

            // Should initial focus go to this form?
	    if ( this.settings.initialFocus ) {
		this.focus();
	    }
            
            // Do we have an inital search?
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
		this.elements.filter('.db-form-html-area').each(function(i, div){
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
	    httpPost(url, this.formData(), handler, errorHandler, async);
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
            var dbForm = this;
	    qcode.confirm('Delete the current record?', function() {
		dbForm.setState('deleting');
		dbForm.formAction('delete',dbForm.settings.deleteURL);
	    });
	},
	setState: function(newState) {
	    switch(newState) {
	    case "dirty":
		var span = $('<span>').text('save').click(this.save.bind(this)).addClass('action save');
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
	},
        formData: function() {
	    var data = {};
	    this.elements
	            .filter(function(){ return $(this).prop('name') != ""; })
	            .filter(function(){ return $(this).prop('type') != "checkbox" || $(this).attr('boolean') == "true" || $(this).is(':checked'); })
	            .filter(function(){ return $(this).prop('type') != "radio" || $(this).is(':checked'); })
	            .not('div.radio-group')
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
    });
    // End of public methods

    // ============================================================

    // Private methods
    function onBeforeUnload(event) {
	if ( this.state == 'dirty' ) {
	    return "Your changes have not been saved.\nStay on the current page to correct.";
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
	    behave(
                $('#'+$(xmlNode).prop('nodeName')).each(function(j, target) {
		    if ( $(target).is('input, textarea, select') ) {
		        $(target).val($(xmlNode).text());
		    } else {
		        $(target).html($(xmlNode).text());
		    }
	        })
            );
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
	    qcode.alert(rec.text());
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
	this.form.trigger('formActionReturn', [type])
    }
    function formActionError(errorMessage) {
	this.setState('error');
	this.setStatus(errorMessage);
	qcode.alert("Your changes could not be saved.<br>" + stripHTML(errorMessage));
	this.form.trigger('formActionError', [errorMessage]);
    }
    function cancelDelayedSave() {
	if ( this.keyUpTimer !== undefined ) {
	    clearTimeout(this.keyUpTimer);
	}
	this.keyUpTimer = undefined;
    }
    // End of private methods

    // ============================================================

    // Provide jQuery plugin interface
    $.fn.dbForm = function(method) {
	var args = arguments;
	var forms = this;
	var returnVal;

	forms.each(function(){

            // Get the dbForm object for this element, create one if none exists
	    var dbForm = $(this).data('dbForm');
	    if ( ! dbForm ) {
		dbForm = new DbForm($(this));
		$(this).data('dbForm', dbForm);
	    }

            // With no arguments or an options object, call the init method
	    if ( typeof method == "object" || typeof method == "undefined" ) {
		dbForm.init.apply( dbForm, args );

	    } else if ( typeof dbForm[method] == "function" ) {
                // Method call
		returnVal = dbForm[method].apply( dbForm, Array.prototype.slice.call( args, 1 ) );

	    } else if ( typeof dbForm.settings[method] != "undefined" && args.length == 1 ) {
                // Get a setting value
		returnVal = dbForm.settings[method];

	    } else if ( typeof dbForm.settings[method] != "undefined" && args.length == 2 ) {
                // Set a setting value
		dbForm.settings[method] = args[1];

	    } else if ( typeof dbForm[method] != "undefined" && args.length == 1 ) {
                // Get a class variable
		returnVal = dbForm[method];

	    } else if ( typeof dbForm[method] != "undefined" && args.length == 2 ) {
                // Set a class variable
		dbForm[method] = args[1];

	    } else {
		$.error( 'Method or property ' + method + ' does not exist on jQuery.dbForm' );
	    }

            // Break the loop if we have a return value.
            if ( typeof returnVal != "undefined" ) {
                return false;
            }

	});
        // For methods with a return value and for getting setting values/class variables, return the value.
	if ( typeof returnVal != "undefined" ) {
	    return returnVal;

	} else {
            // Return the original jQuery object for chaining
	    return forms;
        }
    };
    // End of dbForm plugin
})(jQuery, window);
