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
            timeout: 20000
        },
        
        _create: function() {
            var widget = this;
            var $form = $(this.element);
            this.message = [];
            
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
            
            // Default url used for validation service.
            if ( typeof this.options.url === 'undefined' ) {
                var url = $form.attr('action');
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
            function validate (event) {
                // Stop the form submission.
                event.preventDefault();
                var $form = $(this);

                // Do not allow concurrent validation requests
                if ( ! $form.is('.validating') ) {
                    $form.addClass('validating');

                    // blur() then focus() any text inputs in the form that currently have focus
                    // hack to fix bug where autocomplete popup can become detached from input when page layout changes (when error messages displayed/hidden)
                    $('input[type=text]:focus', $form).blur().focus();

                    // Hide any existing validation messages
                    $('[data-hasqtip]:visible').qtip('hide');
                    $form.validation('hideMessage', 'alert');
                    $form.validation('hideMessage', 'notify');
                    $form.validation('hideMessage', 'error');

                    // Set up form data
                    var data = $form.serializeArray();
                    var ajax_method;
                    if ( method === 'POST' || method === 'GET' ) {
                        ajax_method = method;
                    } else {
                        // Emulate HTTP method
                        ajax_method = 'POST';
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
                    
                    // Send the form data
                    $.ajax({
                        url: url,
                        data: data,
                        method: ajax_method,
                        dataType: 'JSON',
                        headers: {
                            'X-Authenticity-Token': Cookies.get('authenticity_token')
                        },
                        timeout: widget.options.timeout,
                        success: function(response, success, request) {
                            $form.validation('parseResponse', response);
                            
                            // Trigger validationComplete event
                            $form.trigger({
                                type: 'validationComplete',
                                response: response
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            var returnType = jqXHR.getResponseHeader('content-type');
                            
                            if ( returnType == "application/json; charset=utf-8" && jqXHR.status != 200 && jqXHR.status != 0 ) {
                                // HTTP Error with JSON response
                                var response = $.parseJSON(jqXHR.responseText)
                                $form.validation('parseResponse', response);

                                // Trigger validationComplete event
                                $form.trigger({
                                    type: 'validationComplete',
                                    response: response
                                });

                            } else {
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
                                scrollToElement($form.validation('getMessage', 'error'), 200);
                                
                                // Trigger validationError event
                                $form.trigger({
                                    type: 'validationError',
                                    errorMessage: errorMessage
                                });
                            }
                        },
                        complete: function(jqXHR, textStatus) {
                            $form.removeClass('validating');
                        }                            
                    });
                }
            }
            
            $form.on('submit.validate', validate);
        },

        parseResponse: function(response) {
            // Parses the response to show qtips and messages where necessary.
            var $form = $(this.element);
            var $scrollElement = undefined;
            // Check each record item is valid.
            $.each(response.record, function (name, object) {
                var $element = $form.find('[name=' + name + ']');
                if ( ! object.valid ) {
                    // Record item not valid - mark invalid and display message to user.
                    if ( $element.length !== 0 ) {
                        $form.validation('showValidationMessage', $element, object.message);
                        $element.addClass('invalid');

                        // Compare to highest element on page so far
                        if ( typeof $scrollElement === 'undefined' || $element.offset().top < $scrollElement.offset().top ) {
                            $scrollElement = $element;
                        }
                    }
                } else {
                    $element.removeClass('invalid');
                }
            });
            
            // Show messages if action redirect is not given
            var showMessages = true;
            if ( response.action && response.action.redirect ) {
                // don't show messages if redirect action was given
                showMessages = false;
            }
            if ( response.action && response.action.resubmit && $form.data('resubmit-disabled')!==true ) {
                // don't show messages if resubmit action was given and resubmission has not been disabled
                showMessages = false;
            }
            if ( showMessages && response.message ) {
                $.each(response.message, function(type, object) {
                    $form.validation('showMessage', type, object.value);
                    // Compare message to highest element on page
                    var $message = $form.validation('getMessage', type);
                    if ( typeof $scrollElement === 'undefined' ||
                         ($message.is(':visible') && $message.offset().top < $scrollElement.offset().top) ) {
                        $scrollElement = $message;
                    }
                });
            }
            
            if ( response.status === 'valid' ) {
                // submission was valid
                
                // re-enable future resubmit actions
                $form.data('resubmit-disabled',false);
                
                // redirect action
                if ( response.action && response.action.redirect ) {
                    // Redirect if record was valid and the redirect action was given
                    window.location.href = response.action.redirect.value;
                    return;
                } else if ( this.options.submit ) {
                    // default action
                    // resubmit form without validation
                    $form.off('submit.validate').submit();
                    return;
                }
            } else {
                // submission was invalid

                // resubmit action - used for authenticity token errors
                if ( response.action && response.action.resubmit && $form.data('resubmit-disabled')!==true ) {
                    // resubmit the form
                    $form.submit();
                    // disable future resubmit actions to prevent inifite loop
                    $form.data('resubmit-disabled',true);
                    return;
                } else {
                    // re-enable future resubmit actions
                    $form.data('resubmit-disabled',false);
                }
            }

            // Scroll to the element if there is one to scroll to
            if ( typeof $scrollElement !== 'undefined' && typeof $scrollElement.qtip('api') !== 'undefined' ) {
                // $scrollElement exists and has has a qtip
                
                var scrollToHighest = function(api) {
                    // Scrolls to the highest element on the page out of three possible elements:
                    // the qtip, the element the qtip is bound to, and the label for the element if it has one.
                    
                    // Check if element has a label
                    var $label = $form.find('label[for=' + $scrollElement.attr('id') + ']');
                    if ( $label.length === 0 ) {
                        $label = $scrollElement.closest('label');
                    }

                    // If a label was found then check if the label is higher than the element on the page
                    if ( $label.length > 0 && $label.offset().top < $scrollElement.offset().top ) {
                        $scrollElement = $label
                    }
                    
                    // Compare the top offset of highest elements to the qtip tooltip
                    if ( api.tooltip.offset().top < $scrollElement.offset().top ) {
                        $scrollElement = api.tooltip;
                    }

                    scrollToElement($scrollElement, 200);
                }

                if ( $scrollElement.qtip('api').rendered ) {
                    // Qtip for element has been rendered so can scroll to it
                    scrollToHighest($scrollElement.qtip('api'));
                } else {
                    // Qtip hasn't been rendered yet - listen for render event then scroll to element
                    $scrollElement.qtip('api').set('events.render', function(event, api) {
                        // Clicking on the tooltip causes the target element to gain focus and hides the tooltip.
			api.elements.tooltip.on('click', function(event) {
                            api.elements.target.focus();
                            // Call the hide method in case the default hide events were overwritten
                            api.hide();
                        });
                        scrollToHighest(api);
		    });
                }
            } else if ( typeof $scrollElement !== 'undefined' ) {
                // $scrollElement exists but has no qtip - scroll to the $scrollElement
                scrollToElement($scrollElement, 200);
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
            // Hide the validation message for the given element.
            $element.qtip('hide');
            return $element;
        },
        
        showMessage: function(type, message) {
            // Show the message of the type given with message as the content.
            if (! this.message[type]) {
                // Message area doesn't exist so create it.
                var messageDiv = $('<div></div>').addClass(this.options.messages[type].classes)
                var messageContent = $('<span></span>').html(message).addClass('message-content');
                
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
            this.message['alert'].remove();
            this.message['error'].remove();
            this.message['notify'].remove();
        }
        
    });
    
})(jQuery, window, document);
