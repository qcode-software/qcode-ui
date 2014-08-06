// editable
// - plugin to standardise editable elements
// - uses dbEditor plugins to make non-form elements, such as <div>s, editable
;(function($, undefined) {
    $.widget('qcode.editable', {
        options: {
            type: "auto",
            defaultRange: null,
            container: null
        }
        _create: function() {
            if ( this.options === "auto" ) {
                if ( this.element.is(':input') ) {
                    options.type = "input";
                } else {
                    options.type = "text";
                }
            }
            if ( this.options.container === null ) {
                this.options.container = this.element.offsetParent();
            }
            if ( this.options.container.is('html') ) {
                this.options.container = $('body');
            }
            this._on({
                'focus': this._onFocus,
                'editorBlur': function() {
                    this.element.setValue(this._editor('getValue'));
                },
                'editorValueChange': function() {
                    this.element.trigger('valueChange');
                }
            });
            if ( this.element.is(':focus') ) {
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
        hasFocus: function() {
            return ( ( this.options.type !== "input"
                       && this._editor('getCurrentElement').is(this.element)
                     )
                     || this.element.is(':focus')
                   );        
        },
        getValue: function() {
            if ( this.options.type !== "input"
                 && this._editor('getCurrentElement').is(this.element)
               ) {
                return this._editor.getValue();

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
                this._editor.setValue(newValue);
                return
            }
            
            if ( this.options.type === "htmlarea" ) {
                this.element.html(newValue);

            } else if ( this.element.is(':input') ) {
                this.element.val(newValue);

            } else {
                this.element.text(newValue);
            }
            this.element.trigger('valueChange');
        },
        setRange: function(newRange) {
            if ( this.options.type !== "input" 
                 && this._editor('getCurrentElement').is(this.element) ) {
                this._editor('selectText', newRange);

            } else {
                switch (newRange) {
                case "start":
                    break;
                case "end":
                    break;
                case "all";
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
            return this.options.container[pluginName].apply(recordSet, arguments);
        }
    });
})(jQuery);