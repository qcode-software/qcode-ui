var qcode = qcode || {};
qcode.copy = function(content) {
    "use strict";
    var deferred = new jQuery.Deferred();
    var textarea = $('<textarea>');
    textarea.val(content);

    var success = false;
    if ( document.queryCommandSupported('copy') ) {
        textarea.appendTo('body');
        textarea.select();
        success = document.execCommand('copy');
        textarea.remove();
    }

    if ( success ) {
        deferred.resolve(true);

    } else {
        var dialog = $('<div>');
        dialog.append('<p>Please use ctrl+c to copy.</p>');
        textarea.appendTo(dialog);
        dialog.dialog({
            modal: true,
            buttons: {
                Cancel: function() {
                    deferred.resolve(false);
                    $(this).dialog('close');
                }
            },
            close: function() {
                $(this).remove();
            }
        });
        textarea.select();
        textarea.on('copy', function() {
            deferred.resolve(true);
            window.setZeroTimeout(function() {
                dialog.dialog('close');
            });
        });
    }

    return deferred.promise();
}