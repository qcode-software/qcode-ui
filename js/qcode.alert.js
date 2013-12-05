;/*
   qcode.alert

   Display a modal dialog alert
   Accepts an htmlString message.
 */

var qcode = qcode || {};

(function(jQuery, undefined) {
    var options = {
        resizable: false,
        modal: true,
        buttons: {
            OK: function() {
                $(this).dialog('close');
            }
        },
        dialogClass: "alert"
    };
    qcode.alert = function(message) {

        // Remember focus and silently blur
        var toFocus = $(document.activeElement);
        var textRange = toFocus.textrange('get');
        toFocus.trigger('blur.qcodeAlert');
        
        $('<div>')
                .html(message)
                .dialog(options, {
                    close: function() {
                        $(this).remove();
                        
                        // Silently restore focus
                        toFocus.trigger('focus.qcodeAlert');
                        toFocus.textrange('set', textRange.selectionStart, textRange.selectionEnd);
                    }
                });
    }
})();