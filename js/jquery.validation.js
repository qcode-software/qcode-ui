/* validation plugin
   - example usage -
   $('#my_form').validation({
       '#age': {
           check: function() {
               if ( isInt($(this).val()) ) {
                   return true;
               } else {
                   return false;
               }
           },
           message: "Age must be an integer."
       },
       '#name': $.validation.required,
       '#height': {
           check: function() {
               return $(this).val() > 10;
           },
           message: "Height must be greater than 10"
       }
   });

   - also exposes -
   $.validation.showMessage($element, message);
   $.validation.hideMessage($element);
   $.validation.isPostcode(value);
*/
(function($, undefined) {
    // Closure variables
    var submitButtonSelector = "input[type=button],input[type=image],button[type!=reset][type!=button][type!=menu]";

    // Plugin function
    $.fn.validation = function(arg1) {
        var $form = this;
        if ( arg1 === "validate" ) {
            var options = $form.data('qcode-validation-options');
            if ( options === undefined ) {
                return true;
            } else {
                return validate($form, options);
            }
        } else {
            var options = arg1;
            $form.data('qcode-validation-options', options);
            $.each(options, function(selector, fieldOptions) {
                // Validate each element on blur
                $form.find(selector)
                        .on('blur', function() {
                            $(this).val($(this).val().trim());
                            if ( ! fieldOptions.check.call(this) ) {
                                $.validation.showMessage($(this), fieldOptions.message);
                            }
                        })
                        .on('focus', function() {
                            $.validation.hideMessage($(this));
                        });
            });
            $form.on('submit', function(event) {
                // Validate the entire form on submit
                if ( ! validate($form, options) ) {
                    event.preventDefault();
                }
                // Disable submit buttons to prevent duplicate submission
                if ( ! event.isDefaultPrevented() ) {
                    $(this).find(submitButtonSelector).attr('disabled', true);
                }
            });
            $form.on('reset', function() {
                $.each(options, function(selector, fieldOptions) {
                    $form.find(selector).each(function() {
                        $.validation.hideMessage($(this));
                    });
                });
            });
            return this;
        }
    }

    function validate($form, options) {
        // Validate the entire form
        var valid = true;
        $.each(options, function(selector, fieldOptions) {
            $form.find(selector).each(function() {
                $(this).val($(this).val().trim());
                if ( ! fieldOptions.check.call(this) ) {
                    $.validation.showMessage($(this), fieldOptions.message);
                    valid = false;
                }
            });
        });
        return valid;
    }

    // Utils
    $.validation = {
        required: {
            check: function() {
                return $(this).val() != "";
            },
            message: "This field is required."
        },
        isPostcode: function(string) {
            var re1 = /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/;
            var re2 = /^BFPO ?[0-9]+$/;
            return re1.test(string) || re2.test(string);
        },
        isInteger: function(string) {
            var re = /^\d+$/;
            return re.test(string);
        },
        isDate: function(string) {
            var re1 = /^\d{4}-\d{2}-\d{2}$/;
            var re2 = /^\d{2}\/\d{2}\/\d{4}$/;
            return re1.test(string) || re2.test(string);
        },       
        isEmail: function(string) {
            var re = /^[a-zA-Z0-9_\-]+([\.\+][a-zA-Z0-9_\-]+)*@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)+$/;
            return re.test(string);
        },    
        showMessage: function($element, message) {
            var api = $element.qtip('api');
            if ( api === undefined ) {
                // initialise qtip
                $element.qtip({
                    content: message,
                    position: {
                        my: "left top",
                        at: "top right",
                        target: $element
                    },
                    show: {
                        ready: true
                    },
                    hide: {
                        event: 'focus',
                        delay: 0
                    }
                });
            } else {
                // Update existing qtip and show
                api.set('content.text', message);
                api.reposition();
                api.show();
            }
        },
        hideMessage: function($element) {
            $element.qtip('hide');
        }
    }
})(jQuery);
