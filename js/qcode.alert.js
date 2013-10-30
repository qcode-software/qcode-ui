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
        close: function() {
            $(this).remove();
        },
        dialogClass: "alert"
    };
    qcode.alert = function(message) {
        $('<div>')
            .html(message)
            .dialog(options);
    }
})();