;/*
============================================================
   qcode.alert

   Queue a message to display to the user in a modal dialog
   Takes an htmlString message, and an optional callback

============================================================
   qcode.confirm
   
   Queue a message with Yes/No options for the user,
   Takes an htmlString message and an on-confirm callback

============================================================
 */

var qcode = qcode || {};

(function($, undefined) {
    var ding;
    var alertQueue = [];
    var timeout;
    $(function() {
        if ( qcode.Sound.supported ) {
            ding = new qcode.Sound('/Sounds/Windows%20Ding.wav');
        }
    });

    function showNextMessage() {
        if ( alertQueue.length > 0 && timeout === undefined ) {
            timeout = window.setZeroTimeout(function() {
                var callback = alertQueue.shift();
                timeout = undefined;
                callback();
            });
        }
    }

    qcode.alert = function(message, callback) {
        alertQueue.push(function() {
            // Remember focus and blur
            var toFocus = $(document.activeElement);
            if ( toFocus.is(':input') ) {
                var textRange = toFocus.textrange('get');
            }
            
            $('<div>')
                    .html(message)
                    .dialog({
                        resizable: false,
                        modal: true,
                        buttons: {
                            OK: function() {
                                $(this).dialog('close');
                            }
                        },
                        dialogClass: "alert",
                        close: function() {
                            $(this).remove();
                            
                            // Restore focus
                            toFocus.trigger('focus');
                            if ( toFocus.is(':input') ) {
                                toFocus.textrange('set', textRange.selectionStart, textRange.selectionEnd);
                            }
                            if ( typeof callback == "function" ) {
                                callback();
                            }
                            showNextMessage();
                        }
                    });
            if ( qcode.Sound && qcode.Sound.supported ) {
                ding.play();
            }
        });
        showNextMessage();
    }

    qcode.confirm = function(message, onConfirm) {
        alertQueue.push(function() {
            var toFocus = $(document.activeElement);
            if ( toFocus.is(':input') ) {
                var textRange = toFocus.textrange('get');
            }
            
            $('<div>')
                    .html(message)
                    .dialog({
                        resizable: false,
                        modal: true,
                        dialogClass: "confirm",
                        buttons: [
                            {
                                text: "Yes",
                                click: function() {
                                    $(this).dialog('close');
                                    onConfirm();
                                },
                                keydown: function(event) {
                                    // Arrow key events
                                    if ( event.which >= 37 && event.which <= 40 ) {
                                        $(this).next().focus();
                                    }
                                }
                            },
                            {
                                text: "No",
                                click: function() {
                                    $(this).dialog('close');
                                },
                                keydown: function(event) {
                                    // Arrow key events
                                    if ( event.which >= 37 && event.which <= 40 ) {
                                        $(this).prev().focus();
                                    }
                                }
                            }
                        ],
                        close: function() {
                            $(this).remove();
                            toFocus.trigger('focus');
                            if ( toFocus.is(':input') ) {
                                toFocus.textrange('set', textRange.selectionStart, textRange.selectionEnd);
                            }
                            showNextMessage();
                        }
                    });
            if ( qcode.Sound && qcode.Sound.supported ) {
                ding.play();
            }
        });
        showNextMessage();
    }
})(jQuery);