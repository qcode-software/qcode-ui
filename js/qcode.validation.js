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
    state = "clean"
    message = [];
    activeRequest
    _onThisSuccess
    _onThisError
    _onThisSubmit
    
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

        this._setupSubmitValueInclusion();

        this._onThisSubmit = event => {
            event.preventDefault();
            this.validate(new FormData(this.form));
        };
        this.form.on('submit', this._onThisSubmit);
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

        const xhr = new XMLHttpRequest();
        xhr.timeout = this.options.timeout;
        xhr.withCredentials = this.options.crossDomainRequest;
        xhr.addEventListener('load', this._onThisSuccess);
        xhr.addEventListener('error', this._onThisError);
        xhr.open(
            ajaxMethod,
            urlSet(
                this.options.url,
                '_timestamp',
                Date.now()
            )
        );
        xhr.setRequestHeader(
            'X-Authenticity-Token',
            Cookies.get('authenticity_token')
        );
        xhr.responseType = 'json';
        xhr.send(data);

        this.activeRequest = xhr;
    }

    hideMessages() {
        this.hideValidationMessage();
        this.hideMessage('alert');
        this.hideMessage('notify');
        this.hideMessage('error');
    }

    showValidationMessage(element, message) {
        const qtip = element.qcodeQtip;
        if ( qtip === undefined ) {
            let qtipOptions = qcode.deepCopy(
                this.options.qtip,
                {content: message}
            );
            for (const selector of Object.keys(this.options.hints)) {
                if ( element.matches(selector) ) {
                    qtipOptions = qcode.deepCopy(
                        qtipOptions, this.options.hints[selector]
                    );
                }
            }
            element.qcodeQtip = new qcode.Qtip(element, qtipOptions);
        } else {
            qtip.set_content(message);
            qtip.show();
        }
    }

    _onSuccess() {
        this.form.classList.remove('validating');
        this._parseResponse(
            this.activeRequest.response
        );
    }

    _parseResponse(response) {
        if ( this._shouldRedirect(response) ) {
            this._parseRedirect(response);
            return;
        }
        if ( this._shouldResubmit(response) ) {
            this._parseResubmit(response);
            return;
        }
        if ( this._shouldSubmit(response) ) {
            this._parseSubmit(response);
            return;
        }
        
        this._parseRecords(response);
        this._parseMessages(response);

        if ( this._responseIsValid(response) ) {
            this._parseValidResponse(response);
        } else {
            this._parseInvalidResponse(response);
        }

        if ( this._shouldScrollToFeedback(response) ) {
            this.scrollToFeedback();
        }
    }

    _responseIsValid(response) {
        return response.status === 'valid';
    }

    _parseValidResponse(response) {
        this.state = 'valid';
        this.form.dataSet.resubmitDisabled = false;

        this.form.dispatchEvent(
            new CustomEvent('valid', {
                details: { response: response }
            })
        );
    }

    _shouldSubmit(response) {
        return response.status === 'valid' && this.options.submit;
    }

    _parseSubmit(response) {
        this.state = 'valid';
        this.form.dataSet.resubmitDisabled = false;
        
        this.form.removeEventListener('submit', this._onThisSubmit);
        this.form.submit();
    }

    _parseInvalidResponse(response) {
        this.state = 'invalid';
        this.form.dataSet.resubmitDisabled = false;
        this.form.dispatchEvent(
            new CustomEvent('invalid', {
                details: { response: response }
            })
        );
    }

    _shouldResubmit(response) {
        return ( response.action
                 && response.action.resubmit
                 && this.form dataSet.resubmitDisabled !== true );
    }

    _shouldRedirect(response) {
        return response.action && response.action.redirect;
    }

    _parseMessages(response) {
        if ( ! response.message ) {
            return
        }
        for (const type of Object.keys(response.message)) {
            this.showMessage(type, response.message[type].value);
        }
    }

    _parseRedirect(response) {
        this.state = 'redirecting';
        window.location.href = response.action.redirect.value;
        this.form.dispatchEvent(
            new CustomEvent('redirect', {
                bubbles: true,
                detail: { response: response }
            });
        );
    }

    _parseResubmit(response) {
        this.state = 'invalid';
        
        this.form.classList.remove('validating');
        this.form.submit();
        this.form.dataSet.resubmitDisabled = true;
    }

    _parseRecords(response) {
        for (const name of Object.keys(response.record)) {
            const object = response.record[name];
            const elements = this.form.querySelectorAll(
                `[name="${name}"]:not(input[type="hidden"])`
            );
            elements.forEach(element => {
                if ( ! object.valid ) {
                    this.showValidationMessage(element, object.message);
                    element.classList.add('invalid');
                } else {
                    element.classList.remove('invalid');
                }
            });
        }
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

    _onError() {
        this.form.classList.remove('validating');

        const returnType = this.activeRequest.getResponseHeader('content-type');

        if ( returnType === "application/json; charset=utf-8"
             && ! [0,200].includes(this.activeRequest.status)
           ) {
            this._parseResponse( this.activeRequest.response );
        } else {
            this.state = 'error';

            
        }
    }
}
