// actionConfirm plugin
// Call on <a>, <button>, or <input>
// Prompts user with a modal dialog box to confirm their action.
// If the user confirms then the form is submitted if a button or input otherwise navigates to the anchor href.
;(function($, window, document) {

    $.fn.actionConfirm = function() {

        this.each(function(index, element) {
            if ( $(element).is('button[type=submit], button:not([type]), input[type=submit], input[type=button]') ) {
                
                var yesFunction = function() {
                    // submit the closest form
                    $(element).closest('form').submit();
                }
                
            } else if ( $(element).is('a') ) {

                if ( ! $(element).is('.disabled') && ! $(element).prop('disabled') && ! $(element).attr('href') ) {
                    // element has no href attribute
                    $.error("<a> must have an href property.");
                }

                var yesFunction = function() {
                    // navigate to the href
                    window.location = $(element).attr('href');
                }
                
            } else {
                // Unsupported element
                $.error('Unsupported element ' + $(element).prop('tagName') + '. actionConfirm only supports <a>, <button>, <input>.');
            }

            // bind confirm dialog to the element's clickable item(s).
            $(element).on('click', function(event) {
                event.preventDefault();
                var $this = $(this);
                if ( ! $this.is('.disabled') && ! $this.prop('disabled') ) {
                    var action = $this.attr('title');
                    if ( typeof action === "undefined" ) {
                        // element has no title
                        if ( $this.is('a, button') ) {
                            // element is <button> or <a>
                            action = $this.text();
                        } else {
                            // element is <input>
                            action = $this.val();
                        }
                        
                        if ( action === "" ) {
                            // element doesn't have a value/text
                            if ( $this.parent().is('label') && $this.parent().text() !== "") {
                                // use the label parent's text
                                action = $this.parent().text();
                            } else {
                                // use a general message
                                action = "proceed"
                            }
                        }
                    }

                    // Display a modal dialog to confirm a user's action.
                    $('<div>')
		            .text("Are you sure you wish to " + action + "?")
		            .dialog({
		                title: "Confirm Action",
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
        });

        return this;
    }     
                            
})(jQuery, window, document);
