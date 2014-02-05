/* ===================================================================
Backwards-compatible support for Number.isNaN
Return true iff the argument provided is the special value NaN
=================================================================== */
if ( ! Number.isNaN ) {
    Number.isNaN = function(value) {
        return (value != value);
    }
}