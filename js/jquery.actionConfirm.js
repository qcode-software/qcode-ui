// actionConfirm plugin
// Call on <a> or <button>
// Prompts user with a dialog box to confirm their action.
// If the user confirms then the form is submitted if a button otherwise navigates to the anchor href.
;(function($, undefined) {
    $.fn.actionConfirm = function() {
        this.on('click', function(event) {
            event.preventDefault();
	    var $element = $(this);

            if ( ( ! $element.is('.disabled')) ) {
                var title = $element.text();
                var text = 'Are you sure you want to ' + coalesce($element.attr('title'), $element.text()) + '?';
                var tag = $element.prop('tagName');
                switch(tag) {
                case "BUTTON":
                    var yesFunction = function() {
                        // Submit the form that the button belongs to.
                        $element.closest('form').submit();
                    }
                    
                    break;
                case "A":
                    if ( ! $element.attr('href') ) {
                        return;
                    }
                    
                    var yesFunction = function() {
                        // Navigate to the anchor href.
                        window.location = $element.attr('href');
                    }
                    
                    break;
                default:
                    return;
                }

                // Dialog prompt for user to confirm their action.
	        $('<div>')
		        .text(text)
		        .dialog({
		            title: title,
		            buttons: {
			        Yes: yesFunction,
			        No: function() {
			            $(this).dialog('close').dialog('destroy').remove();
			        }
		            },
		            modal: true,
		            width: 400,
		            height: 200
		        });
	    }
        });
    }
})(jQuery);