// Initialise column show/hide control
;(function(undefined) {
    jQuery.fn.columnsShowHideControl = function() {
        // ----------------------------------------
        // Show/hide columns when the user toggles the buttons
        // ----------------------------------------
        jQuery(this).on('click',function(e) {           
            var checkbox = jQuery(e.delegateTarget).children(':checkbox');
            var label = jQuery(e.delegateTarget).children('label');
            var sticky = checkbox.attr('sticky');
            var stickyURL = checkbox.attr('sticky_url');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            if ( !jQuery(e.target).is(checkbox) && !jQuery(e.target).is(label) ) {
                // label or checkbox was not the event target, toggle checkbox state
                checkbox.prop('checked', !checkbox.prop('checked'));
            }             

            if ( checkbox.is(':checked') ) {
                // Show columns
                jQuery(this).addClass('checked');
                jQuery(tableSelector).columns_show_hide(colSelector,'show');
            } else {
                // Hide columns
                jQuery(this).removeClass('checked');
                jQuery(tableSelector).columns_show_hide(colSelector,'hide');
            }

            if ( sticky === 'true' ) {
                // Update Sticky to remember user preference            
                var data = {}
                data[checkbox.attr('name')] = checkbox.is(':checked');
                if ( stickyURL) {
                    data['sticky_url'] = stickyURL;
                }
                $.post('sticky_save.html', data);
            }
        });

        // ----------------------------------------
        // Highlight columns when the user hovers over a button
        // ----------------------------------------
        jQuery(this).on('mouseenter', function(e) {
            var checkbox = jQuery(e.delegateTarget).children(':checkbox');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            jQuery(colSelector, tableSelector).add(this).addClass('hover');
        });
        jQuery(this).on('mouseleave', function(e) {
            var checkbox = jQuery(e.delegateTarget).children(':checkbox');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            jQuery(colSelector, tableSelector).add(this).removeClass('hover');
        });   

        // Show/Hide columns on document ready
        jQuery(this).each(function() {
            var checkbox = jQuery(this).children(':checkbox');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            if ( checkbox.is(':checked') ) {
                // Show columns
                jQuery(this).addClass('checked');
                jQuery(tableSelector).columns_show_hide(colSelector,'show');
            } else {
                // Hide columns
                jQuery(this).removeClass('checked');
                jQuery(tableSelector).columns_show_hide(colSelector,'hide');
            }
        });
    };
})();
