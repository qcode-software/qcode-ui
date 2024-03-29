// editable
// - plugin to standardise editable elements
// - uses dbEditor plugins to make non-form elements, such as <div>s, editable
// Exposes methods for setValue, getValue, setRange (the selected text range), and hasFocus.

// fires
// editorValueChange event
;(function($, undefined) {
    $.widget('qcode.editable', {
        options: {
            // editorType - type of editor (or "input" for no editor)
            // currently one of "auto","input","text","bool","textarea","htmlarea"
            // "auto" defaults to "input" for form elements,
            // and otherwise looks for a "type" attribute (defaulting to "text")
            editorType: "auto",

            // defaultRange - range to select on focus. currently one of null,"start","end","all"
            // (null defaults to "all" for non-form elements because the browser won't put the
            // cursor to where the mouse was clicked.
            defaultRange: null,

            // container for the editor plugins. Should be a the target element's offset parent or a descendent thereof.
            // defaults to the element's offset parent.
            container: null
        },
        _create: function() {
            // Replace "auto" editorType with default
            if ( this.options.editorType === "auto" ) {
                if ( this.element.is(':input') ) {
                    this.options.editorType = "input";
                } else {
                    switch ( this.element.attr('type') ) {
                    case "bool":
                    case "textarea":
                    case "htmlarea":
                        this.options.editorType = this.element.attr('type');
                        break;
                    case "text":
                    case undefined:
                        this.options.editorType = "text";
                        break;
                    default:
                        $.error('Unknown editor type');
                    }
                }
            }

            // defaultRange for non-form elements
            if ( this.options.editorType !== "input"
                 && this.options.defaultRange === null
               ) {
                this.options.defaultRange = "all";
            }

            // default container
            if ( this.options.container === null ) {
                this.options.container = this.element[0].offsetParent;
            }
            if ( $(this.options.container).is('html') ) {
                this.options.container = $('body');
            }

            // event listeners
            this._on({
                'focus': this._onFocus,
                'cut': this._onCut,
                'paste': this._onPaste,
                'keyup': this._onKeyUp
            });
            if ( this.options.editorType !== "input" ) {
                this._on({
                    'editorBlur': function() {
                        this._editor('hide');
                        this.setValue(this._editor('getValue'));
                    }
                });
            } else {
                this._on({
                    'blur': function() {
                        this.element.trigger('editorBlur');
                    }
                });
            }

            // Initialised on already-focussed element (probably in response to focus event)
            if ( this.element.is(':focus') ) {
                this._onFocus();
            }
        },
        _onFocus: function() {
            if ( ! this.element.is('[disabled]') ) {
                if ( this.options.editorType !== "input" ) {
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
        _onCut: function() {
            this.trigger('editorValueChange');
        },
        _onPaste: function() {
            this.trigger('editorValueChange');
        },
        _onKeyUp: function(e) {
            // On keyup of a "printable" key or backspace, fire valueChange event.
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
                     || ( this.options.editorType !== "input"
                          && this._editor('getCurrentElement').is(this.element)
                        )
                   );
        },
        getValue: function() {
            if ( this.options.editorType !== "input"
                 && this._editor('getCurrentElement').is(this.element)
               ) {
                return this._editor('getValue');

            } else if ( this.options.editorType === "htmlarea" ) {
                return this.element.html();

            } else if ( this.element.is(':input') ) {
                return this.element.val();

            } else {
                return this.element.text();
            }
        },
        setValue: function(newValue) {
            if ( this.options.editorType !== "input"
                 && this._editor('getCurrentElement').is(this.element)
               ) {
                this._editor('setValue',newValue);
                return
            }
            if ( this.options.editorType === "bool" ) {
                newValue = newValue ? "Yes" : "No";
            }
            if ( this.options.editorType === "htmlarea" ) {
                this.element.html(newValue);

            } else if ( this.element.is(':input') ) {
                this.element.val(newValue);

            } else {
                this.element.text(newValue);
            }
        },
        setRange: function(newRange) {
            if ( this.options.editorType !== "input" 
                 && this._editor('getCurrentElement').is(this.element) ) {
                this._editor('selectText', newRange);

            } else {
                switch (newRange) {
                case "start":
		    qcode.textRange.set(this.element[0], "start", "start");
                    break;
                case "end":
		    qcode.textRange.set(this.element[0], "end", "end");
                    break;
                case "all":
		    qcode.textRange.set(this.element[0], "all");
                    break;
                default:
                    $.error('Unrecognised range declaration');
                }
            }
        },
        _editor: function(args) {
            switch(this.options.editorType) {
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
