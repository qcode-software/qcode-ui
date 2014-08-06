// editablesContainer
// - An element with editable descendants
;(function($, undefined) {
    $.widget('qcode.editablesContainer', {
        _create: function() {
            this._on({
                'focus .editable': function(event) {
                    $(event.currentTarget).editable();
                }
            });
        }
    });
})(jQuery);