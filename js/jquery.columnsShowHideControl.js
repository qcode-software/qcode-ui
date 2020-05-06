// Initialise column show/hide control
;(function($, undefined) {
    $.fn.columnsShowHideControl = function() {
        // ----------------------------------------
        // Show/hide columns when the user toggles the buttons
        // ----------------------------------------
        $(this).on('click',function(e) {
            var checkbox = $(e.delegateTarget).children(':checkbox');
            if ( ! ($(e.target).is(checkbox) || $(e.target).is('label')) ) {
                // checkbox was not the event target, toggle checkbox state
                e.preventDefault();           
                checkbox.prop('checked', !checkbox.prop('checked'));
                checkbox.change();
            }
        });
        $(this).on('change',':checkbox',function(e) {           
            var checkbox = $(this);
            var sticky = checkbox.attr('sticky');
            var stickyURL = checkbox.attr('sticky_url');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            if ( checkbox.is(':checked') ) {
                // Show columns
                $(this).parent().addClass('checked');
                $(tableSelector).columnsShowHide(colSelector,'show');
            } else {
                // Hide columns
                $(this).parent().removeClass('checked');
                $(tableSelector).columnsShowHide(colSelector,'hide');
            }

            if ( parseBoolean(sticky) ) {
                // Update Sticky to remember user preference            
                var data = {}
                data[checkbox.attr('name')] = checkbox.is(':checked');
                if ( stickyURL) {
                    data['sticky_url'] = stickyURL;
                }
                httpPost('/sticky_save.html',
                         data,
                         function(){},
                         function(){});
            }
        });
                
        // ----------------------------------------
        // Highlight columns when the user hovers over a button
        // ----------------------------------------
        $(this).on('mouseenter', function(e) {
            var checkbox = $(e.delegateTarget).children(':checkbox');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            $(this).addClass('hover');
            $(tableSelector).find(colSelector).addClass('highlight');
            $(tableSelector).runDetached();
        });
        $(this).on('mouseleave', function(e) {
            var checkbox = $(e.delegateTarget).children(':checkbox');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            $(this).removeClass('hover');
            $(tableSelector).find(colSelector).removeClass('highlight');
            $(tableSelector).runDetached();
        });

        // Show/Hide columns on document ready
        $(this).each(function() {
            var checkbox = $(this).children(':checkbox');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            if ( $(tableSelector).has(this).length > 0 ) {
                $.error('Columns show/hide control targetting its own ancestor is not supported');
            }

            if ( checkbox.is(':checked') ) {
                // Show columns
                $(this).addClass('checked');
                $(tableSelector).columnsShowHide(colSelector,'show');
            } else {
                // Hide columns
                $(this).removeClass('checked');
                $(tableSelector).columnsShowHide(colSelector,'hide');
            }
        });
    };
})(jQuery);
