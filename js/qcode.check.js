/*
  Client-side validation plugin
*/
;var qcode = qcode || {};
(function() {
    const formOptions = {};
    
    qcode.check = function(form, options) {
        if ( options === "validate" ) {
            return validateIfHasOptions(form);
        }
        return setup(form, options);
    };

    function validateIfHasOptions(form) {
        const id = qcode.getID(form);
        const options = formOptions[id];
        if ( options === undefined ) {
            return true
        }
        return validate(form, options);
    }

    function setup(form, options) {
        formOptions[id] = options;
        
        for (const selector of options.keys()) {
            const fieldOptions = options[selector];
            for (const field of form.querySelectorAll(selector)) {
                field.addEventListener('blur', () => {
                    validateField(field, fieldOptions);
                });
                field.addEventListener('focus', () => {
                    qcode.check.hideMessage(field);
                });
            }
        }
        form.addEventListener('submit', () => {
            if ( ! validate(form, options)) {
                event.preventDefault();
            }
        });
        form.addEventListener('reset', () => {
            for (const selector of options.keys()) {
                for (const field of form.querySelectorAll(selector)) {
                    qcode.check.hideMessage(field);
                }
            }
        });
        return form;
    }

    function validate(form, options) {
        let valid = true;
        for (const selector of options.keys()) {
            const fieldOptions = options[selector];
            for (const field of form.querySelectorAll(selector)) {
                valid = validateField(field, fieldOptions) && valid;
            }
        }
    }

    function validateField(field, fieldOptions) {
        field.value = field.value.trim();
        if ( ! fieldOptions.check.call(field) ) {
            qcode.check.showMessage(
                field, fieldOptions.message
            );
            return false
        }
        return true
    }

    Object.assign(qcode.check, {
        required: {
            check: () => {
                return this.value != "";
            },
            message: "This field is required."
        },
        isPostcode: string => {
            var re1 = /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/;
            var re2 = /^BFPO ?[0-9]+$/;
            return re1.test(string) || re2.test(string);
        },
        isInteger: string => {
            var re = /^\d+$/;
            return re.test(string);
        },
        isDate: string => {
            var re1 = /^\d{4}-\d{2}-\d{2}$/;
            var re2 = /^\d{2}\/\d{2}\/\d{4}$/;
            return re1.test(string) || re2.test(string);
        },       
        isEmail: string => {
            var re = /^[a-zA-Z0-9_\-]+([\.\+][a-zA-Z0-9_\-]+)*@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)+$/;
            return re.test(string);
        },    
        showMessage: (element, message) => {
            // Set zindex to be lower than jquery-ui dialog
            $.fn.qtip.zindex = 100;
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
                        event: false,
                        ready: true
                    },
                    hide: {
                        event: 'focus blurs reset keydown paste cut',
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
    });
})();
