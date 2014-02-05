/* ===================================================================
   Backwards-compatible support for String.prototype.trim()
   Remove leading and trailing whitespace from a string
=================================================================== */
if ( ! String.prototype.trim ) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/gm, '');
    }
}