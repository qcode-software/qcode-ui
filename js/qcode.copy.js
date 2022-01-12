/* ======================================================================
   qcode.copy plugin
   Attempt to copy some content to the clipboard.
   If not able to do so directly, open a dialog for the user to copy
   with Ctrl+C

   Usage: qcode.copy(content)

   Returns a Promise, which resolves true if content is copied,
   false if the user cancels the copy from the dialog
*/
var qcode = qcode || {};
qcode.copy = function(content) {
    "use strict";
    var deferred = new jQuery.Deferred();
    var textarea = $('<textarea>');
    textarea.val(content);

    // Attempt to copy directly
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
        // Unable to copy directly - use a dialog instead
        var div = $('<div>');
        div.append('<p>Please use ctrl+c to copy.</p>');
        textarea.appendTo(div);
        var dialog = qcode.Dialog(div[0],{
            modal: true,
            buttons: {
                Cancel: function() {
                    deferred.resolve(false);
                }
            }
        });
        textarea.select();

        // Close the dialog when the user copies the content
        textarea.on('copy', function() {
            deferred.resolve(true);
            window.setZeroTimeout(function() {
                dialog.close();
            });
        });
    }

    return deferred.promise();
}
