;

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
        var message = message.replace(/\n/g, "<br>");
        $('<div>')
            .html(message)
            .dialog(options);
    }
})();