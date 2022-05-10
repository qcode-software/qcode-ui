/*
  Client-side validation plugin
*/
;var qcode = qcode || {};
qcode.Check = class {
    form
    options
    
    constructor(form, options) {
        this.form = form;
        this.options = options;
        this._setup();
    }

    _setup() {        
        for (const selector of Object.keys(this.options)) {
            const fieldOptions = this.options[selector];
            for (const field of this.form.querySelectorAll(selector)) {
                field.addEventListener('blur', () => {
                    qcode.Check.validateField(field, fieldOptions);
                });
            }
        }
        this.form.addEventListener('submit', () => {
            if ( ! this.validate() ) {
                event.preventDefault();
            }
        });
        this.form.addEventListener('reset', () => {
            for (const selector of Object.keys(this.options)) {
                for (const field of this.form.querySelectorAll(selector)) {
                    qcode.Check.hideMessage(field);
                }
            }
        });
    }

    validate() {
        let valid = true;
        for (const selector of Object.keys(this.options)) {
            const fieldOptions = this.options[selector];
            for (const field of this.form.querySelectorAll(selector)) {
                valid = ( qcode.Check.validateField(field, fieldOptions)
                          && valid );
            }
        }
        return valid;
    }

    static validateField(field, fieldOptions) {
        field.value = field.value.trim();
        if ( ! fieldOptions.check(field) ) {
            qcode.Check.showMessage(
                field, fieldOptions.message
            );
            return false
        }
        return true
    }

    static required = {
        check: field => {
            return field.value != "";
        },
        message: "This field is required."
    }
    
    static isPostcode(string) {
        var re1 = /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/;
        var re2 = /^BFPO ?[0-9]+$/;
        return re1.test(string) || re2.test(string);
    }
    
    static isInteger(string) {
        var re = /^\d+$/;
        return re.test(string);
    }
    
    static isDate(string) {
        var re1 = /^\d{4}-\d{2}-\d{2}$/;
        var re2 = /^\d{2}\/\d{2}\/\d{4}$/;
        return re1.test(string) || re2.test(string);
    }
    
    static isEmail(string) {
        var re = /^[a-zA-Z0-9_\-]+([\.\+][a-zA-Z0-9_\-]+)*@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)+$/;
        return re.test(string);
    }

    static showMessage(element, message) {
        const qtip = element.qcodeQtip;
        if ( qtip === undefined ) {
            element.qcodeQtip = new qcode.Qtip(
                element, {
                    content: message,
                    position: {
                        my: "left top",
                        at: "top right"
                    }
                }
            );
        } else {
            // Update existing qtip and show
            qtip.set_content(message);
            qtip.show();
        }
    }

    static hideMessage(element) {
        if ( element.qcodeQtip !== undefined ) {
            element.qcodeQtip.hide();
        }
    }
};
