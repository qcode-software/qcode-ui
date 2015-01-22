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
    var alertQueue = [];
    var timeoutID;

    function showNextMessage() {
        if ( alertQueue.length > 0 && timeoutID === undefined ) {
            timeoutID = window.setZeroTimeout(function() {
                var callback = alertQueue.shift();
                timeoutID = undefined;
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
            if ( qcode.Sound && qcode.Sound.supported && qcode.alert.config.sound ) {
                qcode.alert.config.sound.play();
            }
        });
        showNextMessage();
    }
    qcode.alert.config = {};

    qcode.confirm = function(message, onConfirm, onCancel) {
        alertQueue.push(function() {
            var toFocus = $(document.activeElement);
            if ( toFocus.is(':input') ) {
                try {
                    toFocus[0].selectionStart;
                    var supportsSelection = true;
                } catch (e) {}
                if ( supportsSelection ) {
                    var textRange = toFocus.textrange('get');
                }
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
                                    if ( typeof onConfirm === "function" ) {
                                        onConfirm();
                                    }
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
                                    if ( typeof onCancel === "function" ) {
                                        onCancel();
                                    }
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
                            if ( toFocus.is(':input') && supportsSelection ) {
                                toFocus.textrange('set', textRange.selectionStart, textRange.selectionEnd);
                            }
                            showNextMessage();
                        }
                    });
            if ( qcode.Sound && qcode.Sound.supported && qcode.confirm.config.sound ) {
                qcode.confirm.config.sound.play();
            }
        });
        showNextMessage();
    }
    qcode.confirm.config = {};
})(jQuery);