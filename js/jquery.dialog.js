/* Dialog plugin */
;(function($, window, document, undefined){
    "use strict";
    $.widget('qcode.dialog', {
        options: {
            title: null
            buttons: []
            modal: false,
            width: 300,
            height "auto",
            resizable: false,
            dialogClass: "",
            close: null,
            open: null,
            autoOpen: true,
            maxWidth: null,
            maxHeight: null
        },
        _create: function(){
            this._createWrapper();
            this.element.addClass('dialog__content');
            this._createTitlebar();
            this._createButtonPane();
            if ( this.options.autoOpen ) {
                this.open();
            }
        },
        open: function(){
            this._setSize();
            if ( this.options.modal ) {
                this._createOverlay();
            }
            this._show();
            this._focusTabbable();
            this._trigger("open");
        },
        close: function(){
        },
        destroy: function(){
        },
        _createWrapper: function(){
            this.wrapper = $('<div>')
                    .hide()
                    .addClass('dialog')
                    .appendTo('body');
            
            if ( this.options.dialogClass ) {
                this.wrapper.addClass(
                    this.options.dialogClass
                );
            }
            
            this.element
                    .show()
                    .appendTo(this.wrapper);
        },
        _createTitlebar: function(){
            this.titlebar = $('<div>')
                    .addClass('dialog__titlebar');
            if ( this.options.title ) {
                this.titlebar.html(this.options.title);
            }
            this.titlebarClose = $('<button type="button">')
                    .text('X')
                    .addClass('dialog__closebutton')
                    .appendTo(this.titlebar);
            this.titlebar.prependTo(this.wrapper);
        },
        _createButtonPane: function(){
            if ( $.isEmptyObject( this.options.buttons )
                 || ( Array.isArray( this.options.buttons )
                      && ! this.options.buttons.length > 0 )
               ) {
                return;
            }            
            this.buttonPane = $('<div>')
                    .addClass('dialog__buttonpane')
                    .appendTo(this.wrapper);
            $.each(this.options.buttons, this._addButton.bind(this));
        },
        _addButton: function(name, properties){
            if ( typeof properties === "function" ) {
                properties = {
                    click: properties,
                    text: name
                }
            }
            var button = $('<button>')
                .text(properties.text)
                .addClass('dialog__button')
                .on('click',properties.click.bind(this.element[0]))
                .appendTo(this.buttonPane);
            
            if ( properties.keydown ) {
                button.on('keydown',properties.keydown.bind(this.element[0]));
            }
        },
        _setSize: function(){
            this.wrapper.css({
                width: this.options.width,
                height: this.options.height,
                maxWidth: this.options.minWidth,
                maxHeight: this.options.maxHeight
            });
        },
        _createOverlay: function(){
            this.overlay = $('<div>')
                    .addClass('dialog__overlay')
                    .appendTo('body')
        },
        _show: function(){
        }
    });
})(jQuery, window, document);
