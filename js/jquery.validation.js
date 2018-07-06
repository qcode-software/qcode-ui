// Server-side validation plugin
;(function($, window, document) {

    $.widget('qcode.validation', {

        options: {
            qtip: {
                position: {
                    my: 'bottom center',
                    at: 'bottom center',
                    viewport: $(window)
                },
                show: {
                    event: false,
                    ready: true
                },
                hide: {
                    event: 'click focus blurs reset keydown paste cut',
                    delay: 0
                },
                style: {
                    classes: 'qtip-qcode'
                },
                events: {
                    render: function(event, api) {
                        // Clicking on the tooltip causes the target element to gain focus and hides the tooltip.
                        api.elements.tooltip.on('click', function(event) {
                            api.elements.target.focus();
                            // Call the hide method in case the default hide events were overwritten
                            api.hide();
                        });
                    }
                }
            },
            hints: {},
            messages: {
                error: {
                    classes: 'message-area error'
                },
                notify: {
                    classes: 'message-area notify'
                },
                alert: {
                    classes: 'message-area alert'
                }
            },
            submit: true,
            timeout: 20000,
            scrollToFeedback: {
                enabled: true, // true, false
                behavior: 'smooth' // smooth, instant, auto
            }
        },

        _create: function() {
            var widget = this;
            var $form = $(this.element);
            this.validationState = "clean";
            this.message = [];
            this.validationAJAX;

            // Logic for default http method to be used for validation service.
            if ( typeof this.options.method === 'undefined' ) {
                if ( typeof $form.attr('method') === 'undefined' || $form.attr('method') === 'GET' ) {
                    var method = 'VALIDATE';
                } else {
                    var method = 'POST';
                }
            } else {
                method = this.options.method;
            }

            // Click handlers for submit buttons on the form.
            // Used to add hidden input elements with the button's name and value because jQuery form.serialize() function does not
            // include submit button data since it has no way of knowing which button was used to submit the form.
            $form.find('button:not([type]), button[type="submit"], input[type="submit"]').click(function(event) {
                var name = $(this).attr('name');
                var value = $(this).attr('value');

                if ($form.find('input[type="hidden"][name="' + name + '"]').length === 0) {
                    $(this).before('<input type="hidden" name="' + name  + '" value="' + value  + '">');
                }
            });

            // Handler function for submit event.
            $form.on('submit.validate', function(event) {

                // Default url used for validation service.
                if ( typeof widget.options.url === 'undefined' ) {
                    var url = $form.attr('action');
                }

                if ( typeof FormData === "function"
                     && typeof FormData.prototype.get === "function"
                   ) {
                    // AJAX file upload fully supported

                    // Stop the form submission.
                    event.preventDefault();

                    // Set up form data
                    var data = new FormData($form[0]);

                    // perform validation
                    $form.validation('validate', method, url, data);


                } else if ( typeof FormData === "function" ) {
                    // AJAX file upload append-only supported

                    // Stop the form submission.
                    event.preventDefault();

                    // Cannot modify FormData once created,
                    // so fix "_method" before calling validate method
                    var ajax_method;
                    if ( method === 'POST' || method === 'GET' ) {
                        ajax_method = method;
                        var data = new FormData($form[0]);

                    } else {
                        ajax_method = 'POST';

                        var hidden = $form.find('[name="_method"]');
                        if ( hidden.length > 0 ) {
                            var _method = hidden.val();
                            hidden.val(method);
                            var data = new FormData($form[0]);
                            hidden.val(_method);

                        } else {
                            var hidden = $('<input type="hidden" name="_method"/>')
                                .val(method)
                                .appendTo($form);
                            var data = new FormData($form[0]);
                            hidden.remove();
                        }
                    }
                    $form.validation('validate', ajax_method, url, data);

                } else if ( $form.prop('enctype') === "application/x-www-form-urlencoded" ) {
                    // File upload not supported, but unneeded

                    // Stop the form submission.
                    event.preventDefault();

                    // Set up form data
                    var data = $form.serializeArray();

                    // perform validation
                    $form.validation('validate', method, url, data);

                }
                // Otherwise fall back to default form submission
            });
        },

        validate: function(method, url, post_data) {
            // Function to perform validation

            var isFormData = typeof FormData === "function"
                && FormData.prototype.isPrototypeOf(post_data);

            var widget = this;
            var $form = $(widget.element);
            data = post_data || [];

            // Do not allow concurrent validation requests
            if ( $form.validation('state') !== 'validating' && $form.validation('state') !== 'redirecting' ) {
                // update plugin state
                $form.validation('state','validating');
                $form.addClass('validating');

                // blur() then focus() any text inputs in the form that currently have focus
                // hack to fix bug where autocomplete popup can become detached from input when page layout changes (when error messages displayed/hidden)
                $('input:focus', $form).filter('[type=text],[type=email],[type=tel],[type=password]').blur().focus();

                // Hide any existing validation messages
                $form.validation('hideValidationMessage');
                $form.validation('hideMessage', 'alert');
                $form.validation('hideMessage', 'notify');
                $form.validation('hideMessage', 'error');

                // AJAX method
                var ajax_method;
                if ( method === 'POST' || method === 'GET' ) {
                    ajax_method = method;

                } else {
                    // Emulate HTTP method
                    ajax_method = 'POST';

                    if ( isFormData ) {
                        data.set('_method',method);

                    } else {
                        var found = false;

                        $.each(data, function(index, item) {
                            if ( item.name === '_method' ) {
                                item.value = method;
                                found = true;
                                return;
                            }
                        });

                        if ( !found ) {
                            data.push({
                                name: '_method',
                                value: method
                            });
                        }
                    }
                }

                // Send the form data
                var ajaxOptions = {
                    url: url,
                    data: data,
                    method: ajax_method,
                    dataType: 'JSON',
                    cache: false,
                    headers: {
                        'X-Authenticity-Token': Cookies.get('authenticity_token')
                    },
                    timeout: widget.options.timeout,
                    success: function(response, success, request) {
                        $form.validation('parseResponse', response);

                        // Deprecated (replaced by valid, invalid & redirect events) - Trigger validationComplete event
                        $form.trigger({
                            type: 'validationComplete',
                            response: response
                        });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        if ( errorThrown != "abort" ) {
                            var returnType = jqXHR.getResponseHeader('content-type');

                            if ( returnType == "application/json; charset=utf-8" && jqXHR.status != 200 && jqXHR.status != 0 ) {
                                // HTTP Error with JSON response
                                var response = $.parseJSON(jqXHR.responseText)
                                $form.validation('parseResponse', response);

                                // Deprecated (replaced by valid, invalid & redirect events) - Trigger validationComplete event
                                $form.trigger({
                                    type: 'validationComplete',
                                    response: response
                                });

                            } else {
                                // Update plugin state
                                $form.validation('state', 'error');

                                if ( textStatus == "parsererror" ) {
                                    // Parse error
                                    var errorMessage = "Sorry, we were unable to parse the server's response. Please try again.";
                                } else if ( textStatus == "timeout" ) {
                                    // Timeout
                                    var errorMessage = "Sorry, your request timed out. Please try again.";
                                } else {
                                    // Generic error message
                                    var errorMessage = "Sorry, something went wrong. Please try again.";
                                }

                                // Show error message
                                $form.validation('showMessage', 'error', errorMessage);
                                
                                if ( this.options.scrollToFeedback.enabled ) {
                                    // scroll to highest feedback element
                                    $form.validation('scrollToFeedback');
                                }

                                // Deprecated (replaced by error event) - Trigger validationError event
                                $form.trigger({
                                    type: 'validationError',
                                    errorMessage: errorMessage
                                });
                                // Trigger error event
                                $form.trigger({
                                    type: 'error.validation',
                                    errorMessage: errorMessage
                                });
                            }
                        }
                    },
                    complete: function(jqXHR, textStatus) {
                        $form.removeClass('validating');
                    }
                };
                if ( isFormData ) {
                    ajaxOptions.processData = false;
                    ajaxOptions.contentType = false;
                }
                widget.validationAJAX = $.ajax(ajaxOptions);
            }
        },

        parseResponse: function(response) {
            // Parses the response to show qtips and messages where necessary.
            var $form = $(this.element);

            if ( response.action && response.action.redirect ) {
                // Redirect if the redirect action was given

                // Update plugin state
                $form.validation('state', 'redirecting');

                // Initiate redirect
                window.location.href = response.action.redirect.value;

                // Trigger redirect event
                $form.trigger({
                    type: 'redirect.validation',
                    response: response
                });
                return;
            }

            // Check each record item is valid.
            $.each(response.record, function (name, object) {
                var $element = $form.find('[name=' + name + ']:not(input[type=hidden])');
                if ( ! object.valid ) {
                    // Record item not valid - mark invalid and display message to user.
                    if ( $element.length !== 0 ) {
                        $form.validation('showValidationMessage', $element, object.message);
                        $element.addClass('invalid');
                    }
                } else {
                    $element.removeClass('invalid');
                }
            });

            // Show messages if action redirect is not given
            var showMessages = true;
            if ( response.action && response.action.resubmit && $form.data('resubmit-disabled')!==true ) {
                // don't show messages if resubmit action was given and resubmission has not been disabled
                showMessages = false;
            }
            if ( showMessages && response.message ) {
                $.each(response.message, function(type, object) {
                    $form.validation('showMessage', type, object.value);
                });
            }

            if ( response.status === 'valid' ) {
                // submission was valid
                $form.validation('state', 'valid');

                // re-enable future resubmit actions
                $form.data('resubmit-disabled',false);

                if ( this.options.submit ) {
                    // default action
                    // resubmit form without validation
                    $form.off('submit.validate').submit();
                    return;
                }

                // Trigger valid event
                $form.trigger({
                    type: 'valid.validation',
                    response: response
                });
            } else {
                // submission was invalid
                $form.validation('state', 'invalid');

                // resubmit action - used for authenticity token errors
                if ( response.action && response.action.resubmit && $form.data('resubmit-disabled')!==true ) {
                    // remove the validating flag before auto-resubmission
                    $form.removeClass('validating');
                    // resubmit the form
                    $form.submit();
                    // disable future resubmit actions to prevent inifite loop
                    $form.data('resubmit-disabled',true);
                    return;
                } else {
                    // re-enable future resubmit actions
                    $form.data('resubmit-disabled',false);
                }

                // Trigger invalid event
                $form.trigger({
                    type: 'invalid.validation',
                    response: response
                });
            }

            if ( this.options.scrollToFeedback.enabled ) {
                // scroll to highest feedback element
                $form.validation('scrollToFeedback');
            }
        },

        showValidationMessage: function($element, message) {
            // Show the validation message with the message as the content for the given element.
            var api = $element.qtip('api');
            if ( api === undefined ) {
                var qtipOptions = {
                    content: message,
                    position: {
                        target: $element
                    }
                };
                $.extend(true, qtipOptions, this.options.qtip);
                $.each(this.options.hints, function(selector, hintOptions) {
                    if ( $element.is(selector) ) {
                        $.extend(true, qtipOptions, hintOptions);
                    }
                });
                // initialise qtip
                $element.qtip(qtipOptions);
            } else {
                // Update existing qtip and show
                api.set('content.text', message);
                api.reposition();
                api.show();
            }
            return $element;
        },

        hideValidationMessage: function($element) {
            // Hide the validation tooltip for the given element or all tooltips
            // if no arguments given.
            if ( arguments.length == 0 ) {
                return $('[data-hasqtip]:visible',$(this.element)).each(function(index, element) {
                    $(element).qtip('hide');
                });
            } else {
                $element.qtip('hide');
                return $element;
            }
        },

        showMessage: function(type, message) {
            // Show the message of the type given with message as the content.
            if (! this.message[type]) {
                // Message area doesn't exist so create it.
                var messageDiv = $('<div></div>').addClass(this.options.messages[type].classes)
                var messageContent = $('<div></div>').html(message).addClass('message-content');

                messageDiv.append(messageContent).hide();
                var validationElement = $(this.element);
                messageDiv.click(function(event){
                    validationElement.validation('hideMessage', type);
                    validationElement.validation('reposition');
                });

                if (this.options.messages[type].before) {
                    $(this.options.messages[type].before).before(messageDiv);
                } else if (this.options.messages[type].after) {
                    $(this.options.messages[type].after).after(messageDiv);
                } else {
                    $('body').append(messageDiv);
                }

                this.message[type] = messageDiv;
                messageDiv.show(200, $.proxy(function() {
                    this.reposition();
                }, this));
            } else {
                // Update the message
                this.message[type].find('.message-content').html(message);
                this.message[type].show(200, $.proxy(function() {
                    this.reposition();
                }, this));
            }
        },

        hideMessage: function(type) {
            // Hide the message with the given type.
            if (this.message[type]) {
                this.message[type].hide(100, $.proxy(function() {
                    this.reposition();
                }, this));
            }
        },

        getMessage: function(type) {
            // Returns the jquery object for the message of the given type
            return this.message[type];
        },

        reposition: function() {
            // Reposition or hide all validation messages.
            $('[data-hasqtip]').each(function() {
                if ( ! $(this).is(':visible') ) {
                    $(this).qtip('hide');
                } else {
                    $(this).qtip('reposition');
                }
            });
        },

        _destroy: function() {
            // Remove the elements created by this plugin.
            this.element.unbind('submit.validate');
            $(this.element).removeClass('validating');
            this._validationMessagesDestroy();
            this._messagesDestroy();
        },

        _validationMessagesDestroy: function() {
            // Destroy any tooltips associated with this element or it's descendants.
            $(this.element).find('[data-hasqtip]').qtip('destroy');
        },

        _messagesDestroy: function() {
            // Remove all messages added by this plugin.
            if ( this.message['alert'] ) {
                this.message['alert'].remove();
            }
            if ( this.message['error'] ) {
                this.message['error'].remove();
            }
            if ( this.message['notify'] ) {
                this.message['notify'].remove();
            }
        },

        setValuesFromResponse: function(response) {
            // Set form values from the response
            var $form = $(this.element);
            if (typeof response !== "undefined" && 'record' in response) {
                $.each(response.record, function(name, object) {
                    var $element = $form.find('[name=' + name + ']');
                    if ('valid' in object && object.valid && 'value' in object) {
                        if ($element.is("input[type='checkbox']")) {
                            // Checkbox - set checked property
                            if ($element.val() === object.value) {
                                // Check checkbox if values match
                                $element.prop("checked", true);
                            } else {
                                // Check checkbox if casted values are both true
                                var checked = parseBoolean($element.val()) && parseBoolean(object.value);
                                $element.prop("checked", checked);
                            }
                        } else {
                            // Set the value of the field
                            $element.val(object.value);
                        }
                    }
                });
            }
        },

        state: function(newState) {
            // Get/set the state of the plugin
            if(typeof(newState)=== "undefined") {
                return this.validationState;
            } else {
                this.validationState= newState;
            }
        },

        abort: function() {
            // Abort current validation request
            var widget = this;
            var $form = $(widget.element);
            // abort current AJAX request
            widget.validationAJAX.abort()
            // set validation plugin state to error
            $form.validation('state', 'error');
            // remove validating class
            $form.removeClass('validating');
            // re-enable future resubmit actions
            $form.data('resubmit-disabled',false);
        },
        
        scrollToFeedback: function() {
            // Scroll to highest feedback element.
            var $form = $(this.element);
            var $element = $([]);
            
            // notification messages - find highest element.
            $.each(["error", "alert", "notify"], function(type) {
                var $message = $form.validation('getMessage', type);
                if ( $element.length === 0
                     || ( typeof $message !== "undefined"
                          && $message.is(':visible')
                          && $message.offset().top < $element.offset().top
                        )
                   ) {
                    $element = $message;              
                } 
            });
            
            // invalid inputs - find highest element.
            $('.invalid[name]:not(input[type=hidden])', $form).each(function() {
                var $input = $(this);
                if ( $element.length === 0
                     || $input.offset().top < $element.offset().top
                   ) {
                    $element = $input;  
                } 
            });
            
            // scroll to highest element.
            if ( $element.length ) {
                $element.get(0).scrollIntoView(this.options.scrollToFeedback);
                
            }         
        }
    });

})(jQuery, window, document);
