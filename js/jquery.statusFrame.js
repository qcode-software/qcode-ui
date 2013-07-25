;(function($, window, undefined) {
    $.widget('qcode.statusFrame', {
        options: {
            resizable: true,
            minHeight: 10
        },
        _create: function() {
            this.element.wrap('<div>');
            this.statusFrame = this.element.parent()
                .addClass('status-frame');
            this.statusBar = $('<div>')
                .addClass('status-bar')
                .insertAfter(this.statusFrame)
                .wrap('<div>');
            this.statusBarWrapper = this.statusBar.parent()
                .addClass('status-bar-wrapper');
            this.messageBox = $('<span>')
                .addClass('message')
                .appendTo(this.statusBar);
            this.navCounter = $('<span>')
                .addClass('info')
                .appendTo(this.statusBar);
            this.handle = $('<div>')
                .addClass('handle')
                .prependTo(this.statusBar);

            if ( this.options.resizable ) {
                var initialHeight;
                this._on(this.handle, {
                    'mousedown': this._dragStart,
                    'dragStart': function(event, data) {
                        initialHeight = this.statusFrame.height();
                    },
                    'drag': function(event, data) {
                        this.statusFrame.height(Math.max(initialHeight + data.offset, this.options.minHeight));
                        this.statusFrame.trigger('resize');
                    }
                });
            }
            this._on({
                'message': function(event, data) {
                    this.messageBox.removeClass('error');
                    switch(data.type) {
                    case "error":
                        this.messageBox.addClass('error');
                    case "notice":
                        this.setMessage(data.html);
                        break;
                    case "navCount":
                        this.setNavCounter(data.html);
                        break;
                    }
                },
                'clearMessages': function() {
                    this.messageBox.removeClass('error');
                    this.setMessage('');
                }
            });
        },
        setNavCounter: function(message) {
            this.navCounter.html(message);
        },
        setMessage: function(message) {
            this.messageBox.html(message);
        },
	_dragStart: function(event){
	    var target = $(event.target);
	    event.preventDefault();
	    this._on($(window), {
		'mousemove': this._drag.bind(this, target, event.pageY),
		'mouseup': this._dragEnd.bind(this, target, event.pageY)
	    });
	    target.trigger('dragStart');
	},
	_drag: function(target, initialY, event){
	    event.preventDefault();
	    target.trigger('drag', [{
		'offset': event.pageY - initialY
	    }]);
	},
	_dragEnd: function(target, initialY, event){
	    this._off($(window), 'mousemove mouseup');
	    target.trigger('dragEnd');
	}
    });
})(jQuery, window);