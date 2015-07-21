// actionConfirm plugin
// Call on <a>, generates a modal dialog asking the user to confirm when the user tries to use the link.
;(function($, undefined) {
    $.fn.actionConfirm = function() {
        
        var action = function(event) {
            event.preventDefault();
	    var $element = $(this);

            if ( ( ! $element.is('.disabled')) ) {
                var tag = $element.prop('tagName');
                switch(tag) {
                case "FORM":
                    var title = 'Confirm',
                    var text = 'Are you sure you want to carry out that action?';
                    var yesFunction = function() {
                        $element.off('submit.actionConfirm');
                        $element.submit();
                    }
                    
                    break;
                case "A":
                    if ( ! $element.attr('href') ) {
                        return;
                    }
                    var title = $element.text();
                    var text = 'Are you sure you want to ' + coalesce($element.attr('title'), $element.text()) + '?';
                    var yesFunction = function() {
                        window.location = $element.attr('href');
                    }
                    
                    break;
                }
                
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
        }
        
        if ( this.is('form') ) {
            this.on('submit.actionConfirm', action);
        } else if ( this.is('a') ) {
            this.on('click', action);
        }
    }
})(jQuery);