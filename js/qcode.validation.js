;var qcode = qcode || {};

qcode.Validation = class {
    static defaults = {
        qtip: {
            position: {
                my: 'bottom center',
                at: 'bottom center'
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
        crossDomainRequest: false,
        timeout: 20000,
        scrollToFeedback: {
            enabled: true, // true, false
            behavior: 'smooth' // smooth, instant, auto
        }
    }
    
    options
    form
    validationState = "clean"
    state
    message = [];
    activeRequest
    _onThisSuccess
    _onThisError
    _onThisComplete
    
    constructor(form, options) {
        this.options = qcode.deepCopy(qcode.Validation.defaults, options);
        this.form = form;

        if ( this.options.method === undefined ) {
            this.options.method = this._getDefaultMethod();
        }

        if ( this.options.url === undefined ) {
            this.options.url = this.form.getAttribute('action');
        }

        this._onThisSuccess = this._onSuccess.bind(this);
        this._onThisError = this._onError.bind(this);
        this._onThisComplete = this._onComplete.bind(this);

        this._setupSubmitValueInclusion();

        this.form.on('submit', event => {
            event.preventDefault();
            this.validate(new FormData(this.form));
        });
    }

    validate(data) {
        if ( ['validating','redirecting'].includes(this.state) ) {
            return
        }
        this.state = 'validating';
        this.form.classList.add('validating');
        
        this._autocompleteBugfixHack();

        this.hideMessages();

        let ajaxMathod;
        if ( ['GET','POST'].includes(this.options.method) ) {
            ajaxMethod = this.options.method;
        } else {
            ajaxMethod = 'POST';
            data.set('_method',method);
        }

        const ajaxOptions = {
            url: this.options.url,
            data: data,
            method: ajax_method,
            dataType: 'JSON',
            xhrFields: {
                withCredentials: this.options.crossDomainRequest
            },
            cache: false,
            headers: {
                'X-Authenticity-Token': Cookies.get('authenticity_token')
            },
            timeout: this.options.timeout,
            success: this._onThisSuccess,
            error: this._onThisError,
            complete: this._onThisComplete
            processData: false,
            contentType: false
        }

        const xhr = new XMLHttpRequest();
        xhr.timeout = this.options.timeout;
        xhr.withCredentials = this.options.crossDomainRequest;
        xhr.addEventListener('load', this._onThisSuccess);
        xhr.addEventListener('error', this._onThisError);
        xhr.open(ajaxMethod, this.options.url);
        xhr.setRequestHeader(
            'X-Authenticity-Token',
            Cookies.get('authenticity_token')
        );
        xhr.send(data);

        this.activeRequest = xhr;
    }

    hideMessages() {
        this.hideValidationMessage();
        this.hideMessage('alert');
        this.hideMessage('notify');
        this.hideMessage('error');
    }

    _autocompleteBugfixHack() {
        if ( document.activeElement instanceof HTMLInputElement
             && document.activeElement.hasAttribute('type')
             && ['text','email','tel','password'].includes(
                 document.activeElement.getAttribute('type'))
           ) {
            document.activeElement.blur();
            document.activeElement.focus();
        }
    }

    _setupSubmitValueInclusion() {
        for (const input of this._getNamedSubmitElements()) {
            const name = input.getAttribute('name');
            const value = input.getAttribute('value');
            input.addEventListener('click', event => {
                if ( ! this._hasHiddenInput(name) ) {
                    this._addHiddenInput(name, value, input);
                }
            });
        }
    }

    _addHiddenInput(name, value, input) {
        const hidden = document.createElement('input');
        hidden.setAttribute('name', name);
        hidden.setAttribute('value', value);
        input.parentElement.insertBefore(hidden, input);
    }

    _hasHiddenInput(name) {
        return (this.form.querySelector(`input[type="${name}"]`)
                instanceof HTMLElement);
    }

    _getNamedSubmitElements() {
        return this.form.querySelectorAll(`
button[name][value]:not([type]),
button[name][value][type="submit"],
input[name][value][type="submit"]`);
    }

    _getDefaultMethod() {
        if ( this.form.hasAttribute('method')
             && ! this.form.getAttribute('method') === "GET"
           ) {
            return "POST";
        } else {
            return "VALIDATE";
        }
    }
}
