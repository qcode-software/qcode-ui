// actionConfirm plugin
// Call on <a>, <button>, or <form>
// Prompts user with a modal dialog box to confirm their action.
// If the user confirms then the form is submitted if a button or form otherwise navigates to the anchor href.
;(function($, window, document) {

    $.widget('qcode.actionConfirm', {

        _create: function() {
            
            var $element = $(this.element);
            var $clickables;
            
            if ( $element.is('form') ) {
                
                this.yesFunction = function() {
                    // submit the form
                    $element.submit();
                }

                $clickables = $(this.element).find('input[type=submit], button[type=submit], button:not([type])');
                
            } else if ( $element.is('button') ) {
                
                this.yesFunction = function() {
                    // submit the closest form
                    $element.closest('form').submit();
                }

                $clickables = $element;
                
            } else if ( $element.is('a') ) {

                if ( ! $element.attr('href') ) {
                    // element has no href attribute
                    $.error("<a> must have an href property.");
                }

                this.yesFunction = function() {
                    // navigate to the href
                    window.location = $element.attr('href');
                }

                $clickables = $element;
                
            } else {
                // Unsupported element
                $.error('Unsupported element ' + $element.prop('tagName') + '. actionConfirm only supports <a>, <button>, and <form>.');
            }

            // bind confirm dialog to the element's clickable item(s).
            $clickables.on('click', function(event) {
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
                    
                    $element.actionConfirm('confirmAction', action);
                }
            });
        },

        confirmAction: function(action) {
            // Display a modal dialog to confirm a user's action. 
            var message = "Are you sure you wish to " + action + "?";
            $('<div>')
		    .text(message)
		    .dialog({
		        title: "Confirm Action",
		        buttons: {
			    Yes: this.yesFunction,
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
})(jQuery, window, document);
