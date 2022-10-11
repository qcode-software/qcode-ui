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
                classes: 'message-area message-area--error'
            },
            notify: {
                classes: 'message-area message-area--notify'
            },
            alert: {
                classes: 'message-area message-area--alert'
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
    
    static states = [
        'clean',
        'error',
        'validating',
        'redirecting',
        'valid',
        'invalid'
    ]
    _state = "clean"
    get state() {
        return this._state;
    }
    set state(new_state) {
        for (const state of qcode.Validation.states) {
            if ( new_state === state ) {
                this.form.classList.add(state);
            } else {
                this.form.classList.remove(state);
            }
        }
        this._state = new_state;
    }

    options
    form
    messageAreas = {}
    activeRequest
    _resubmitDisabled = false
    _onThisSuccess
    _onThisError
    _onThisTimeout
    _onThisSubmit
    
    constructor(form, options) {
        this.form = form;
        
        this.options = qcode.deepCopy(
            qcode.Validation.defaults,
            this._getDefaultsFromHTML(),
            coalesce(options,{})
        );

        this._bindEvents();

        this._setupSubmitValueInclusion();
        
        this.form.addEventListener('submit', this._onThisSubmit);
    }

    _getDefaultsFromHTML() {
        return {
            method: this._getDefaultMethod(),
            url: this.form.getAttribute('action')
        };
    }

    _bindEvents() {
        this._onThisSuccess = this._onSuccess.bind(this);
        this._onThisError = this._onError.bind(this);
        this._onThisTimeout = this._onTimeout.bind(this);
        this._onThisSubmit = this._onSubmit.bind(this);
    }

    _onSubmit(event) {
        event.preventDefault();
        this.validate(new FormData(this.form));
    }

    validate(data) {
        if ( ['validating','redirecting'].includes(this.state) ) {
            return
        }
        this.state = 'validating';
        
        this._autocompleteBugfixHack();

        this.hideMessages();

        let ajaxMethod;
        if ( ['GET','POST'].includes(this.options.method) ) {
            ajaxMethod = this.options.method;
        } else {
            ajaxMethod = 'POST';
            data.set('_method',this.options.method);
        }

        const xhr = new XMLHttpRequest();
        xhr.timeout = this.options.timeout;
        xhr.withCredentials = this.options.crossDomainRequest;
        xhr.addEventListener('load', this._onThisSuccess);
        xhr.addEventListener('error', this._onThisError);
        xhr.addEventListener('timeout', this._onThisTimeout);
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
        xhr.setRequestHeader(
            'Accept',
            'application/json, text/javascript, */*; q=0.01'
        );
        xhr.responseType = 'json';
        xhr.send(data);

        this.activeRequest = xhr;
    }

    showMessage(type, message) {
        if ( ! this.hasMessageArea(type) ) {
            this._initMessageArea(type);
        }
        const messageArea = this.getMessageArea(type);
        messageArea.setMessage(message);
        messageArea.show();
    }

    hideMessage(type) {
        if ( this.hasMessageArea(type) ) {
            this.getMessageArea(type).hide();
        }
    }

    hasMessageArea(type) {
        return this.messageAreas[type] !== undefined;
    }

    getMessageArea(type) {
        return this.messageAreas[type];
    }

    getMessageAreasElements() {
        const elements = [];
        for (const messageArea of Object.values(this.messageAreas)) {
            elements.push(messageArea.root);
        }
        return elements;
    }

    _initMessageArea(type) {
        const messageArea = new qcode.Validation.MessageArea(
            this.options.messages[type]
        );
        messageArea.root.addEventListener(
            'hide', this.reposition.bind(this)
        );
        messageArea.root.addEventListener(
            'show', this.reposition.bind(this)
        );
        this.messageAreas[type] = messageArea;
    }

    reposition() {
        for (const field of this.getVisibleFields()) {
            if ( field.qcodeQtip === undefined ) {
                continue;
            }
            if ( qcode.isVisible(field) ) {
                field.qcodeQtip.hide();
            } else {
                field.qcodeQtip.reposition();
            }
        }
    }

    setValuesFromResponse(response) {
        if ( response.record === undefined ) {
            return;
        }
        const fields = this._getFieldElementsByName();
        for (const name of Object.keys(response.record)) {
            const record = response.record[name];
            const element = fields[name];
            if ( element === undefined
                 || ! record.valid
                 || ! record.hasOwnProperty('value')
               ) {
                continue
            }
            const value = record.value;
            qcode.Validation._setFieldValue(element, value);
        }
    }

    abort() {
        this.activeRequest.abort();
        this.state = error;
    }

    _getFieldElementsByName() {
        const nodeList = this.form.querySelectorAll('[name]');
        const fieldElements = {};
        for (const element of Array.from(nodeList)) {
            const name = element.getAttribute('name');
            fieldElements[name] = element;
        }
        return fieldElements;
    }

    static _setFieldValue(element, value) {
        if ( ! qcode.Validation._isCheckbox(element) ) {
            element.value = value;
            return;
        }
        if ( element.value === value ) {
            element.checked = true;
            return;
        }
        if ( parseBoolean(element.value)
             && parseBoolean(value)
           ) {
            element.checked = true;
        } else {
            element.checked = false;
        }
    }

    static _isCheckbox(element) {
        return ( element.hasAttribute('type')
                 && element.getAttribute('type') === 'checkbox' );
    }

    hideMessages() {
        this.hideValidationMessage();
        this.hideMessage('alert');
        this.hideMessage('notify');
        this.hideMessage('error');
    }

    showValidationMessage(element, message) {
        let qtip = element.qcodeQtip;
        if ( qtip === undefined ) {
            qtip = new qcode.Qtip(
                element,
                this._getElementQtipOptions(element)
            );
            element.qcodeQtip = qtip
        }
        qtip.set_content(message);
        qtip.show();
    }

    hideValidationMessage(element) {
        if ( element === undefined ) {
            for (const field of this.getVisibleFields()) {
                this.hideValidationMessage(field);
            }
            return
        }
        if ( element.qcodeQtip !== undefined ) {
            element.qcodeQtip.hide();
        }
    }

    _getElementQtipOptions(element) {
        let qtipOptions = qcode.deepCopy(this.options.qtip, {});
        for (const selector of Object.keys(this.options.hints)) {
            if ( element.matches(selector) ) {
                qtipOptions = qcode.deepCopy(
                    qtipOptions, this.options.hints[selector]
                );
            }
        }
        return qtipOptions;
    }

    _onSuccess() {
        const status = this.activeRequest.status;
        const statusOK = status >= 200 && status < 300 || status === 304;
        if ( ! statusOK ) {
            this._onError();
            return;
        }
        
        if ( this.activeRequest.response == null ) {
            this._onParserError();
            return;
        }
        
        this._parseResponse(
            this.activeRequest.response
        );
    }

    _parseResponse(response) {
        if ( this._shouldRedirect(response) ) {
            this._parseRedirect(response);
            return;
        }
        
        if ( this._responseHasRecords(response) ) {
            this._parseRecords(response);
        }
        
        if ( this._shouldResubmit(response) ) {
            this._parseResubmit(response);
            return;
        }

        if ( this._responseHasMessages(response) ) {
            this._parseMessages(response);
        }
        
        if ( this._shouldSubmit(response) ) {
            this._parseSubmit(response);
            return;
        }

        if ( this._responseIsValid(response) ) {
            this._parseValidResponse(response);
        } else {
            this._parseInvalidResponse(response);
        }

        if ( this.options.scrollToFeedback.enabled ) {
            this.scrollToFeedback();
        }
    }

    _responseIsValid(response) {
        return response.status === 'valid';
    }

    _parseValidResponse(response) {
        this.state = 'valid';
        this._resubmitDisabled = false;

        this.form.dispatchEvent(
            new CustomEvent('valid', {
                detail: { response: response }
            })
        );
    }

    _shouldSubmit(response) {
        return response.status === 'valid' && this.options.submit;
    }

    _parseSubmit(response) {
        this.state = 'valid';
        this._resubmitDisabled = false;
        
        this.form.removeEventListener('submit', this._onThisSubmit);

        // this.form.submit(), but don't let the function
        // be masked by an input element with a name or id of "submit".
        HTMLFormElement.prototype.submit.call(this.form);
    }

    _parseInvalidResponse(response) {
        this.state = 'invalid';
        this._resubmitDisabled = false;
        this.form.dispatchEvent(
            new CustomEvent('invalid', {
                details: { response: response }
            })
        );
    }

    _shouldResubmit(response) {
        return ( response.action
                 && response.action.resubmit
                 && this._resubmitDisabled !== true );
    }

    _shouldRedirect(response) {
        return response.action && response.action.redirect;
    }

    _responseHasMessages(response) {
        return response.hasOwnProperty('message');
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
            })
        );
    }

    _parseResubmit(response) {
        this.state = 'invalid';
        
        this.form.classList.remove('validating');
        this.form.submit();
        this._resubmitDisabled = true;
    }

    _responseHasRecords(response) {
        return response.hasOwnProperty('record');
    }

    _parseRecords(response) {
        const elements = this._getFieldElementsByName();
        for (const name of Object.keys(response.record)) {
            const object = response.record[name];
            if ( elements[name] === undefined ) {
                continue;
            }
            const element = elements[name];
            if ( ! object.valid ) {
                this.showValidationMessage(element, object.message);
                element.classList.add('invalid');
            } else {
                element.classList.remove('invalid');
            }
        }
    }

    getVisibleFields() {
        return Array.from(
            this.form.querySelectorAll(
                `[name]:not(input[type="hidden"])`
            )
        );
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
        hidden.setAttribute('type', 'hidden');
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
             && this.form.getAttribute('method') != "GET"
           ) {
            return "POST";
        } else {
            return "VALIDATE";
        }
    }

    _onError() {
        const returnType = this.activeRequest.getResponseHeader('content-type');
        if ( returnType === "application/json; charset=utf-8"
             && ! [0,200].includes(this.activeRequest.status)
           ) {
            this._parseResponse( this.activeRequest.response );
            return;
        }
        
        this.state = 'error';
        const errorMessage = "Sorry, something went wrong. Please try again.";
        this.showMessage('error', errorMessage);

        if ( this.options.scrollToFeedback.enabled ) {
            this.scrollToFeedback();
        }

        this.form.dispatchEvent(new CustomEvent('error', {
            detail: {
                message: errorMessage
            }
        }));
    }

    _onParserError() {
        this.state = 'error';
        const errorMessage =
              "Sorry, we were unable to parse the server's response. Please try again.";
        this.showMessage('error', errorMessage);

        if ( this.options.scrollToFeedback.enabled ) {
            this.scrollToFeedback();
        }

        this.form.dispatchEvent(new CustomEvent('error', {
            detail: {
                message: errorMessage
            }
        }));
    }

    _onTimeout() {
        this.state = 'error';
        const errorMessage = "Sorry, your request timed out. Please try again.";
        this.showMessage('error', errorMessage);

        if ( this.options.scrollToFeedback.enabled ) {
            this.scrollToFeedback();
        }

        this.form.dispatchEvent(new CustomEvent('error', {
            detail: {
                message: errorMessage
            }
        }));
    }

    scrollToFeedback() {
        const messageAreas = this.getMessageAreasElements();
        const visibleFields = this.getVisibleFields();
        const feedbackElements = messageAreas.concat(visibleFields);
        const highestElement = 
              qcode.Validation._getHighestElement(feedbackElements);

        if ( highestElement === undefined ) {
            return;
        }
        highestElement.scrollIntoView(this.options.scrollToFeedback);
    }

    static _getHighestElement(elements) {
        let highestElement;
        let highestTop = Infinity;
        for (const element of elements) {
            if ( ! qcode.isVisible(element) ) {
                continue;
            }
            const top = element.getBoundingClientRect().top;
            if ( top < highestTop ) {
                highestTop = top;
                highestElement = element;
            }
        }
        return highestElement;
    }
}

qcode.Validation.MessageArea = class {
    root
    contentWrapper
    
    constructor(options) {
        const htmlClasses = options.classes.split(' ');
        this.root = document.createElement('div');
        this.root.classList.add(...htmlClasses);
        this.root.style.transitionProperty = 'transform';
        this.root.style.transitionDuration = '0.2s';

        this.contentWrapper = document.createElement('div');
        this.contentWrapper.classList.add('message-content');
        this.root.append(this.contentWrapper);

        this.root.addEventListener('click', this.hide.bind(this));

        if ( options.before ) {
            options.before.before(this.root);
        } else if ( options.after ) {
            options.after.after(this.root);
        } else {
            document.body.append(this.root);
        }

        this.hide();
    }

    setMessage(newMessage) {
        this.contentWrapper.innerHTML = newMessage;
    }

    show() {
        this.root.style.display = 'block';
        window.setZeroTimeout(() => {
            this.root.style.transform = 'scale(1,1)';
        });
    }

    hide() {
        this.root.style.transform = 'scale(1,1)';
    }

    _onTransitionEnd() {
        const transform = window.getComputedStyle(this.root).transform;
        if ( transform.replace(/\s/g,'') == 'matrix(0,0,0,0,0,0)' ) {
            this.root.style.display = 'none';
            this.root.dispatchEvent(new CustomEvent('hide'));
        } else {
            this.root.dispatchEvent(new CustomEvent('show'));
        }
    }
}
