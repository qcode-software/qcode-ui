// tableFilterMin - client-side table row filter based on user-defined minimum values
;(function(jQuery, window, undefined) {
    // keyup timer
    var timer;

    jQuery.fn.tableFilterMin = function() {
        var $table = $(this).filter('table');
        $table.find('thead>tr>th>input')
            .on('keyup', function() {
                var $input = $(this);
                window.clearTimeout(timer);
                timer = window.setTimeout(function() {
                    $table.runDetached(updateFilters);
                    $input.focus();
                }, 400);
            })
            .on('change', function() {
                var $input = $(this);
                $table.runDetached(updateFilters);
                $input.focus();
            });
    }

    function updateFilters() {
        $table = this;

        // Clear the keyup timer
        window.clearTimeout(timer);

        // Map column index (0-based) to filter value
        var filters = {};
        $table.find('thead>tr>th>input').each(function() {
            var $input = $(this);
            var value = parseFloat($input.val());
            if ( isNaN(value) ) {
                var value = 0;
            }
            if ( value == 0 ) {
                $input.val("");
            } else {
                $input.val(value);
            }
            filters[$input.parent().index()] = value;
        });

        $table.find('tbody>tr').each(function() {
            var $row = $(this);
            // Hide if row fails any of the filters, show otherwise
            var hide = false;
            $row.children('td').each(function(index, cell){
                var cellValue = parseFloat($(cell).text());
                if ( isNaN(cellValue) ) {
                    var cellValue = 0;
                }
                if ( filters[index] !== undefined && cellValue < filters[index] ) {
                    hide = true;
                    //false return breaks the jQuery loop - no need to check the other columns when one has failed.
                    return false;
                }
            });
            if (hide) {
                $row.hide();
            } else {
                $row.show();
            }
        });
    }
})(jQuery, window);