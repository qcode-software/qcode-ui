;(function($, undefined) {
    $.fn.tableRowDeleteButton = function() {
        var buttons = this;
        buttons.each(function() {
            var button = $(this);
            var table = button.closest('table');
            table.find('tr>*:nth-child(' + (button.closest('th').index() + 1) + ')').addClass('row-select');
            if ( table.find('.highlight').length > 0 ) {
                button.removeClass('disabled');
            } else {
                button.addClass('disabled');
            }
            button.on('click', function() {
                if ( ! button.hasClass('disabled') ) {
                    var rows = table.find('.highlight')
		    if ( window.confirm("Delete these " + rows.length + " records?") ) {
                        rows.each(function(i, row) {
                            if ( $(row).dbRow('option', 'type') == 'add' && $(row).dbRow('getState') != 'dirty') {
                                $(row).removeClass('highlight');
                                return;
                            }
                            $(row).dbRow('delete', true);
                        });
                        if ( table.find('.highlight').length > 0 ) {
                            button.removeClass('disabled');
                        } else {
                            button.addClass('disabled');
                        }
                    }
                }
            });
            table.on('toggleHighlight', function(event) {
                if ( table.find('.highlight').length > 0 ) {
                    button.removeClass('disabled');
                } else {
                    button.addClass('disabled');
                }
            });
            button.on('mousedown', function() {
                button.addClass('clicking');
                button.one('mouseup mouseleave', function() {
                    button.removeClass('clicking');
                });
            });
            table.on('dbRowActionReturn', function() {
                if ( table.find('.highlight').length > 0 ) {
                    button.removeClass('disabled');
                } else {
                    button.addClass('disabled');
                }
            });
        });
        return buttons;
    }
})(jQuery);