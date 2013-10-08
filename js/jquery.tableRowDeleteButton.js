;(function($, undefined) {
    var repaint;
    $.fn.tableRowDeleteButton = function() {
        if ( repaint === undefined ) {
            repaint = function(button) {
                if ( button.closest('table').children('tbody').children('tr.selected:not(.updating)').length > 0 ) {
                    button.removeClass('disabled');
                } else {
                    button.addClass('disabled');
                }
            }
        }
        var buttons = this;
        buttons.each(function() {
            var button = $(this);
            var tbody = button.closest('table').children('tbody');

            tbody.children('tr').children(':nth-child(' + (button.closest('th').index() + 1) + ')').addClass('row-select');

            tbody.on('click.tableRowDeleteButton', 'td.row-select', function(event) {
                $(event.currentTarget).toggleClass('selected');
                repaint(button);
            });

            button.on('click.tableRowDeleteButton', function() {
                if ( ! button.hasClass('disabled') ) {
                    var rows = tbody.children('.selected:not(.updating)');
		    if ( window.confirm("Delete these " + rows.length + " records?") ) {
                        rows.each(function(i, row) {
                            if ( $(row).dbRow('option', 'type') === 'add' ) {
                                if ( $(row).dbRow('getState') === 'dirty'
                                     || $(row).dbRow('getState') === 'error' ) {
                                    tbody.parent().dbGrid('removeRow', $(row));
                                } else {
                                    $(row).removeClass('selected');
                                }
                            } else {
                                $(row).dbRow('delete', true);
                            }
                        });
                        repaint(button);
                    }
                }
            });

            button.on('mousedown.tableRowDeleteButton', function() {
                button.addClass('clicking');
                button.one('mouseup.tableRowDeleteButton mouseleave.tableRowDeleteButton', function() {
                    button.removeClass('clicking');
                });
            });

            tbody.parent().on('dbRowStateChange.tableRowDeleteButton', repaint.bind(this, button));

            repaint(button);
        });
        return buttons;
    }
})(jQuery);