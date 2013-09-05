// actionConfirm plugin
// Call on <a>, generates a modal dialog asking the user to confirm when the user tries to use the link.
;(function($, undefined) {
    $.fn.actionConfirm = function() {
        this.on('click', function(event) {
	    var link = $(this);
	    if ( ( ! link.is('.disabled')) && link.attr('href') ) {
	        var url = link.attr('href');
                var text = 'Are you sure you want to ' + coalesce(link.attr('title'), link.text()) + '?';
	        $('<div>')
		    .text(text)
		    .dialog({
		        title: link.text(),
		        buttons: {
			    Yes: function(){
			        window.location = url;
			    },
			    No: function() {
			        $(this).dialog('close').dialog('destroy').remove();
			    }
		        },
		        modal: true,
		        width: 400,
		        height: 200
		    });
	        event.preventDefault();
	    }
        });
    }
})(jQuery);