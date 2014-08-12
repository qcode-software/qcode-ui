// editable
// - plugin to standardise editable elements
// - uses dbEditor plugins to make non-form elements, such as <div>s, editable
;(function($, undefined) {
    $.widget('qcode.editable', {
        options: {
            // type - type of editor
            // currently one of "auto","input","text","combo","bool","textarea","htmlarea"
            type: "auto",

            // defaultRange - range to select on focus. currently one of null,"start","end","all"
            // (null defaults to "all" for non-form elements because the browser won't put the
            // cursor to where the mouse was clicked.
            defaultRange: null,
            container: null
        },
        _create: function() {
            if ( this.options.type === "auto" ) {
                if ( this.element.is(':input') ) {
                    this.options.type = "input";
                } else {
                    switch ( this.element.attr('type') ) {
                    case "combo":
                    case "bool":
                    case "textarea":
                    case "htmlarea":
                        this.options.type = this.element.attr('type');
                        break;
                    case "text":
                    case undefined:
                        this.options.type = "text";
                        break;
                    default:
                        $.error('Unknown editor type');
                    }
                }
            }
            if ( this.options.type !== "input"
                 && this.options.defaultRange === null
               ) {
                this.options.defaultRange = "all";
            }
            if ( this.options.container === null ) {
                this.options.container = this.element.offsetParent();
            }
            if ( $(this.options.container).is('html') ) {
                this.options.container = $('body');
            }
            this._on({
                'focus': this._onFocus,
                'editorBlur': this._onEditorBlur,
                'cut': this._onCut,
                'paste': this._onPaste,
                'keyup': this._onKeyUp
            });
            if ( this.options.type !== "input" ) {
                this._on({
                    'editorBlur': this._onEditorBlur
                });
            } else {
                this._on({
                    'blur': function() {
                        this.element.trigger('editorBlur');
                    }
                });
            }
            if ( this.element.is(':focus') ) {
                // Initialised on already-focussed element (probably in response to focus event)
                this._onFocus();
            }
        },
        _onFocus: function() {
            if ( ! this.element.is('[disabled]') ) {
                if ( this.options.type !== "input" ) {
                    this._editor('show', this.element, this.getValue());
                }
                if ( this.options.defaultRange !== null ) {
                    var editable = this;
                    window.setZeroTimeout(function() {
                        editable.setRange(editable.options.defaultRange);
                    });
                }
            }
        },
        _onEditorBlur: function() {
            this._editor('hide');
            this.setValue(this._editor('getValue'));
        },
        _onCut: function() {
            this.trigger('valueChange');
        },
        _onPaste: function() {
            this.trigger('valueChange');
        },
        _onKeyUp: function(e) {
            // On keyup of a "printable" key or backspace, fire editorValueChange event.
            if ( isEditingKeyEvent(e) ) {
                this.element.trigger('editorValueChange');
            }
            if ( e.which == 13 // return key
                 && this.element.is('textarea') ) {
                this.element.trigger('editorValueChange');
            }
        },
        hasFocus: function() {
            return ( this.element.is(':focus') 
                     || ( this.options.type !== "input"
                          && this._editor('getCurrentElement').is(this.element)
                        )
                   );
        },
        getValue: function() {
            if ( this.options.type !== "input"
                 && this._editor('getCurrentElement').is(this.element)
               ) {
                return this._editor('getValue');

            } else if ( this.options.type === "htmlarea" ) {
                return this.element.html();

            } else if ( this.element.is(':input') ) {
                return this.element.val();

            } else {
                return this.element.text();
            }
        },
        setValue: function(newValue) {
            if ( this.options.type !== "input"
                 && this._editor('getCurrentElement').is(this.element)
               ) {
                this._editor('setValue',newValue);
                return
            }
            
            if ( this.options.type === "htmlarea" ) {
                this.element.html(newValue);

            } else if ( this.element.is(':input') ) {
                this.element.val(newValue);

            } else {
                this.element.text(newValue);
            }
        },
        setRange: function(newRange) {
            if ( this.options.type !== "input" 
                 && this._editor('getCurrentElement').is(this.element) ) {
                this._editor('selectText', newRange);

            } else {
                switch (newRange) {
                case "start":
		    this.element.textrange('set', "start", "start");
                    break;
                case "end":
		    this.element.textrange('set', "end", "end");
                    break;
                case "all":
		    this.element.textrange('set', "all");
                    break;
                default:
                    $.error('Unrecognised range declaration');
                }
            }
        },
        _editor: function(args) {
            switch(this.options.type) {
            case "combo":
                pluginName="dbEditorCombo";
                break;
            case "bool":
                pluginName="dbEditorBool";
                break;
	    case "text":
		pluginName="dbEditorText";
		break;
	    case "textarea":
		pluginName="dbEditorTextArea";
		break;
	    case "htmlarea":
		pluginName="dbEditorHTMLArea";
		break;
            default:
                $.error('Unknown editor type');
            }
            return $(this.options.container)[pluginName].apply($(this.options.container), arguments);
        }
    });
})(jQuery);