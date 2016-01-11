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
        
        return qcode.copy(html);
    }
})();