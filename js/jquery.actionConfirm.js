// actionConfirm plugin
// Call on <a>, <button>, or <form>
// Prompts user with a modal dialog box to confirm their action.
// If the user confirms then the form is submitted if a button or form otherwise navigates to the anchor href.
;(function($, window, document) {

    $.widget('qcode.actionConfirm', {

        _create: function() {
            
            var $element = $(this.element);
            
            if ( $element.is('form') ) {
                
                // function to perform if user confirms their action
                this.yesFunction = function() {
                    // submit the form
                    $element.submit();
                }

                var $submitButtons = $(this.element).find('input[type=submit], button[type=submit], button:not([type])');
                $submitButtons.on('click', function(event) {
                    event.preventDefault();
                    var $this = $(this);
                    if ( ! $this.is('.disabled') && ! $this.prop('disabled') ) {
                        var action = $this.attr('title');
                        if ( typeof action === "undefined" ) {
                            // element has no title
                            if ( $this.is('button') ) {
                                // element is button
                                action = $this.text();
                            } else {
                                // element is an input
                                 action = $this.val();
                            }
                            
                            if ( action === "" ) {
                                // button/input doesn't have text/a value
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
                
            } else if ( $element.is('button') ) {
                
                // function to perform if user confirms their action
                this.yesFunction = function() {
                    // submit the closest form
                    $element.closest('form').submit();
                }

                $element.on('click', function(event) {
                    event.preventDefault();
                    if ( ! $element.is('.disabled') && ! $element.prop('disabled') ) {
                        var action = coalesce($element.attr('title'), $element.text());
                        $element.actionConfirm('confirmAction', action);
                    }
                });
                
            } else if ( $element.is('a') ) {

                if ( ! $element.attr('href') ) {
                    // element has no href attribute
                    throw "<a> must have an href property."
                }

                // function to perform if user confirms their action
                this.yesFunction = function() {
                    // navigate to the href
                    window.location = $element.attr('href');
                }

                $element.on('click', function(event) {
                    event.preventDefault();
                    if ( ! $element.is('.disabled') && ! $element.prop('disabled') ) {
                        var action = coalesce($element.attr('title'), $element.text());
                        $element.actionConfirm('confirmAction', action);
                    }
                });
            }
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
