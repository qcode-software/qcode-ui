/*
  tableRowDeleteButton

  call on a button inside a th, provide a UI for deleting rows
  depends on dbGrid for delete functionality

  each tbody cell in the column containing the button gains class "row-selector", and becomes clickable.
  selected row gain the "selected" class, and are deleted if the user clicks the button, then confirms.
*/
;(function($, undefined) {
    var repaint;

    $.fn.tableRowDeleteButton = function() {

        // Initialise the repaint function
        if ( repaint === undefined ) {
            repaint = function(button) {
                if ( button.closest('table').children('tbody').children('tr.selected:not(.updating)').length > 0 ) {
                    button.removeClass('disabled');
                    button.removeAttr('disabled');
                } else {
                    button.addClass('disabled');
                    button.attr('disabled', true); // Possibly should use $().prop(), but that breaks theadFixed
                }
            }
        }

        var buttons = this;
        buttons.each(function() {
            var button = $(this);
            var tbody = button.closest('table').children('tbody');

            // Add row selector class to all tbody cells in this column
            tbody.children('tr').children(':nth-child(' + (button.closest('th').index() + 1) + ')')
                .addClass('row-selector');

            // Delegated event listener for selecting a row
            tbody.on('click.tableRowDeleteButton', 'td.row-selector', function(event) {
                $(event.currentTarget).parent().toggleClass('selected');
                repaint(button);
            });

            // Event listener for clicking the delete button
            button.on('click.tableRowDeleteButton', function() {
                if ( ! button.hasClass('disabled') ) {
                    var rows = tbody.children('.selected:not(.updating)');
		    if ( window.confirm("Delete these " + rows.length + " records?") ) {
                        rows.each(function(i, row) {
                            if ( $(row).dbRow('option', 'type') === 'add' ) {
                                if ( $(row).dbRow('getState') === 'dirty'
                                     || $(row).dbRow('getState') === 'error' ) {
                                    // No db interaction if row has not been "added"
                                    tbody.parent().dbGrid('removeRow', $(row));
                                } else {
                                    // Do not remove unmodified "add" row
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

            // Event listeners to animate the "click" action with class "clicking"
            button.on('mousedown.tableRowDeleteButton', function() {
                button.addClass('clicking');
                button.one('mouseup.tableRowDeleteButton mouseleave.tableRowDeleteButton', function() {
                    button.removeClass('clicking');
                });
            });

            tbody.parent().on('dbRowStateChange.tableRowDeleteButton', repaint.bind(this, button));

            repaint(button);
        });

        // Enable jQuery plugin chaining
        return buttons;
    }
})(jQuery);