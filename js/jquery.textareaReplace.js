/* textareaReplace plugin
   performs a regexp-replace on the contents of a textarea, while preserving the caret/selection.
*/
$.fn.textareaReplace = function(regexp, replacement) {
    var textarea = this;
    var oldValue = textarea.val();
    var selection = textarea.textrange('get');
    var start = selection.selectionStart;
    var end = selection.selectionEnd;
    var match = oldValue.match(regexp);
    if ( match ) {
        var diff = replacement.length - match[0].length;
        if ( start > match.index ) {
            start += diff;
        }
        if ( end > match.index ) {
            end += diff;
        }
        var newValue = oldValue.slice(0,match.index) + replacement + oldValue.slice(match.index + match[0].length);
        textarea.val(newValue);
        textarea.textrange('set',start,end);
    }
    return this;
};