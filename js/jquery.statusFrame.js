/* statusFrame plugin
   Wraps the target in a resizable div with a status bar at the bottom
   Listens for "message" events, and displays messages

   Options: {
   resizable: boolean, default true, is the frame resizable
   minHeight: int, default 10, if the frame is resizable, the minimum height.
   height: css height, default "auto", the (initial) height of the frame
   initialScroll: "start" does nothing, "end" will scroll the frame to the end.
   }

   Methods:
   setNavCounter: takes an html string and sets the navCount
   setMessage: takes an html string and sets the current message

   message event handlers take 1 addition argument, which is an object as follows:
   {
   type: string 'error', 'notice', or 'navCount' - the type of message.
   html: string - the message to be displayed, in html format.
   }
*/
;(function($, window, undefined) {
    $.widget('qcode.statusFrame', {
        options: {
            resizable: true,
            minHeight: 10,
            height: "auto",
            initialScroll: "start"
        },
        _create: function() {
            this.element.wrap('<div>');
            this.statusFrame = this.element.parent()
                .addClass('status-frame')
                .css('height', this.options.height);
            this.statusBar = $('<div>')
                .addClass('status-bar')
                .insertAfter(this.statusFrame);
            this.messageBox = $('<span>')
                .addClass('message')
                .appendTo(this.statusBar);
            this.navCounter = $('<span>')
                .addClass('info')
                .appendTo(this.statusBar);

            if ( this.options.resizable ) {
                this.handle = $('<div>')
                    .addClass('handle')
                    .prependTo(this.statusBar);
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
            if ( this.options.initialScroll === "end" ) {
                var statusFrame = this.statusFrame;
                $('body').one('pluginsReady', function() {
                    var scrollTop = this.statusFrame[0].scrollHeight - this.statusFrame.height();
                    this.statusFrame.scrollTop(scrollTop);
                });
            }
            this._on({
                'message': function(event, data) {
                    this.messageBox.removeClass('error');
                    switch(data.type) {
                    case "navCount":
                        this.setNavCounter(data.html);
                        break;

                    case "error":
                        this.messageBox.addClass('error');
                    case "notice":
                    default:
                        this.setMessage(data.html);
                        break;
                    }
                }
            });
        },
        setNavCounter: function(message) {
            var oldHeight = this.statusBar.height();
            this.navCounter.html(message);
            if ( this.statusBar.height() !== oldHeight ) {
                this.statusBar.trigger('resize');
            }
        },
        setMessage: function(message) {
            var oldHeight = this.statusBar.height();
            this.messageBox.html(message);
            if ( this.statusBar.height() !== oldHeight ) {
                this.statusBar.trigger('resize');
            }
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