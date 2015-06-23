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
                    event: 'focus blurs reset keydown paste cut',
                    delay: 0
                },
                style: {
                    classes: 'qtip-qcode'
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
            }
        },
        
        _create: function() {
            // Click handlers for submit buttons on the form.
            // Used to add hidden input elements with the button's name and value because jQuery form.serialize() function does not
            // include submit button data since it has no way of knowing which button was used to submit the form.
            var $form = $(this.element);
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
                // Get rid of old messages
                $form.validation('hideMessage', 'alert');
                $form.validation('hideMessage', 'notify');
                $form.validation('hideMessage', 'error');
                // POST the form data
                var path = $form.attr('action');
                $.ajax({
                    url: path,
                    data: $form.serialize(),
                    type: 'POST',
                    dataType: 'JSON',
                    success: function(response, success, request) {
                        $form.validation('parseResponse', response);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // HTTP ERROR
	                if ( jqXHR.status != 200 && jqXHR.status != 0 ) {
                            $form.validation('parseResponse', $.parseJSON(jqXHR.responseText));
                            return;
                        }

                        switch (textStatus) {
                        case "parseerror":
                            $form.validation('showMessage', 'error', "Couldn't parse the response.");
                            break;
                        case "timeout":
                            $form.validation('showMessage', 'error', "Request timed out.");
                            break;
                        case "abort":
                            $form.validation('showMessage', 'error', "Request was aborted.");
                            break;
                        default:
                            $form.validation('showMessage', 'error', "An error occurred: " + errorThrown);
                        }
                    }
                });
            }
            
            $(this.element).on('submit.validate', validate);
        },

        parseResponse: function(response) {
            // Parses the response to show qtips and messages where necessary.
            var $form = $(this.element);
            var allValid = true;
            // Check each record item is valid.
            $.each(response.record, function (name, object) {
                var $element = $form.find('[name=' + name + ']');
                if ( ! object.valid ) {
                    // Record item not valid - mark invalid and display message to user.
                    allValid = false;
                    if ( $element.length !== 0 ) {
                        $form.validation('showValidationMessage', $element, object.message);
                        $element.addClass('invalid');
                    }
                } else {
                    $element.removeClass('invalid');
                }
            });
            
            if ( allValid && response.status === 'valid') {
                if (response.action && response.action['redirect']) {
                    // Redirect if record was valid and the redirect action was given
                    window.location.href = response.action['redirect'].value;
                } else if (response.message['notify']) {
                    $form.validation('showMessage', 'notify', response.message['notify'].value);
                    $form.validation('reposition');
                }
                // Reset the form
                $form.trigger('reset');
                
            } else if (response.message) {
                $.each(response.message, function(type, object) {
                    $form.validation('showMessage', type, object.value);
                    $form.validation('reposition');
                });
            }
            // Trigger validation completion event
            $form.trigger({
                type: 'validationComplete',
                response: response
            });
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
            if (! this[type]) {
                // Message area doesn't exist so create it.
                var messageDiv = $('<div></div>').addClass(this.options.messages[type].classes)
                var messageContent = $('<span></span>').html(message).addClass('message-content');
                var messageClose = $('<span></span>').html('&times;').addClass('icon icon--cross');
                
                messageDiv.append(messageClose, messageContent);
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

                this[type] = messageDiv;
            } else {
                // Update the message
                $('.' + type + ' > .message-content').html(message);
            }
        },
        
        hideMessage: function(type) {
            // Hide the message with the given type.
            if (this[type]) {
                this[type].remove();
                this[type] = undefined;
            }
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
            this._validationMessagesDestroy();
            this._messagesDestroy();
        },
        
        _validationMessagesDestroy: function() {
            // Destroy any tooltips associated with this element or it's descendants.
            $(this.element).find('[data-hasqtip]').qtip('destroy');
        },
        
        _messagesDestroy: function() {
            // Remove all messages added by this plugin.
            this['alert'].remove();
            this['error'].remove();
            this['notify'].remove();
        }
        
    });
    
})(jQuery, window, document);