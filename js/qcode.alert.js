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
            var textRange;
            var toFocus = $(document.activeElement);
            if ( toFocus.is(':input') ) {
                textRange = toFocus.textrange('get');
            }

            var div = document.createElement('div');
            div.innerHTML = message;
            const dialog = qcode.Dialog(div, {
                resizable: false,
                modal: true,
                buttons: {
                    OK: null
                },
                classes: {"dialog": "alert"}
            });
            qcode.on(dialog, 'close', function() {                    
                // Restore focus
                toFocus.trigger('focus');
                if ( toFocus.is(':input') ) {
                    toFocus.textrange(
                        'set',
                        textRange.selectionStart,
                        textRange.selectionEnd);
                }
                if ( typeof callback == "function" ) {
                    callback();
                }
                showNextMessage();
            });
            if ( qcode.Sound
                 && qcode.Sound.supported
                 && qcode.alert.config.sound
               ) {
                qcode.alert.config.sound.play();
            }
        });
        showNextMessage();
    }
    qcode.alert.config = {};

    qcode.confirm = function(message, onConfirm, onCancel) {
        alertQueue.push(function() {
            var supportsSelection, textrange;
            var toFocus = $(document.activeElement);
            if ( toFocus.is(':input') ) {
                try {
                    toFocus[0].selectionStart;
                    supportsSelection = true;
                } catch (e) {
                    supportsSelection = false;
                }
                if ( supportsSelection ) {
                    textRange = toFocus.textrange('get');
                }
            }

            var div = document.createElement('div');
            div.innerHTML = message;
            var dialog = qcode.Dialog(div,{
                resizable: false,
                modal: true,
                classes: {"dialog": "confirm"},
                buttons: [
                    {
                        text: "Yes",
                        click: function() {
                            if ( typeof onConfirm === "function" ) {
                                onConfirm();
                            }
                        },
                        keydown: function(event) {
                            // Arrow key events
                            if ( event.which >= 37
                                 && event.which <= 40
                               ) {
                                $(this).next().focus();
                            }
                        }
                    },
                    {
                        text: "No",
                        click: function() {
                            if ( typeof onCancel === "function" ) {        
                                onCancel();
                            }
                        },
                        keydown: function(event) {
                            // Arrow key events
                            if ( event.which >= 37
                                 && event.which <= 40
                               ) {
                                $(this).prev().focus();
                            }
                        }
                    }
                ]
            });
            qcode.on(dialog, 'close', function() {
                toFocus.trigger('focus');
                if ( toFocus.is(':input') && supportsSelection ) {
                    toFocus.textrange(
                        'set',
                        textRange.selectionStart,
                        textRange.selectionEnd);
                }
                showNextMessage();
            });
            
            if ( qcode.Sound
                 && qcode.Sound.supported
                 && qcode.confirm.config.sound
               ) {
                qcode.confirm.config.sound.play();
            }
        });
        showNextMessage();
    }
    qcode.confirm.config = {};
})(jQuery);
