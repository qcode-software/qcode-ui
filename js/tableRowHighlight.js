// Table row highlighter plugin
$.widget("qcode.tableRowHighlight", {
    options: {
	class: "background-yellow"
    },
    _create: function() {
	this._on(this.element, {
	    "click td": function(event) {
		jQuery(event.target).closest("tr").toggleClass(this.options.class);
	    }
	});
    }
});