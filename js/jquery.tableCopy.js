/* ============================================================
   tableCopy plugin
   Copy the selected table to the clipboard
   Returns a promise, which resolves true if the copy
   succeeds, false if it is cancelled.
   To Do: clean up hidden table cells, links, etc.
*/
;(function() {
    "use strict";
    jQuery.fn.tableCopy = function() {
        var deferred = new jQuery.Deferred();
        var clone = this.clone();
        var wrapper = $('<div>');
        wrapper.append(clone);
        var html = wrapper.html();
        var textarea = $('<textarea>');
        textarea.val(html);

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
})();