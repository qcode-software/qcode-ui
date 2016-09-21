# Databse Grid - dbGrid
[Fiddle](http://jsfiddle.net/PeterChaplin/j6HPe/)

See also:
- [dbRow](dbRow.md)
- [dbCell](dbCell.md)
- [editable](../../forms/editable.md)

An html table representing a database record set, with editable contents. Each row represents a record, dbGrid expects
\<col\> elements with "name" attributes to describe the field names. Columns can be made non-editable with the custom
attributes "addDisabled" and "updateDisabled".

The plugin uses the "editable" plugin, with the associated "dbEditor" plugins, to allow editing of cell contents.
It adds a \<div\> wrapper around the table in order to support this plugin.

This plugin fires "message" events, as listened for by the "statusFrame" plugin.
It fires "resize" events when the table is resized. When moving from one cell to another, a "cellOut" is fired on the
cell being moved from, then a "cellIn" on the cell being moved to. When these cells are in different rows, a "rowOut"
is fired on the row being moved from, and a "rowIn" is fired on the row being moved to. The sequence is cellOut -> rowOut
-> rowIn -> cellIn.

The plugin Supports adding new rows, updating existing rows, and deleting existing rows via AJAX. The row contents are
submitted as form data on AJAX requests. For add and update requests, the response is checked for a root \<records\>
node, containing a \<record\> node, containing one or more nodes with tag names matching the field names.
If these nodes are present, they are used to update the values in the row.

## $.fn.dbGrid( options )

### options (optional)
Type: object, name-value pairs

Options for dbGrid. Can also be set using custom html attributes of the same name on the table element accepts string "true" or "false" in place of booleans).

#### initialFocus
Type: boolean or string with value "start" or "end" (default true)

If set to "start", give focus to the first cell in the table body on page load.
If set to "end" or true, give focus to the first cell in the last cell of the last row on page load.
Otherwise, do nothing.

#### enabled
Type: boolean (default true)

Enable the dbGrid for editing

#### updateType
Type: string (default "rowOut") (allowed values: "onKeyUp", "onCellOut", "rowOut")

Controls when to automatically save a row - rowOut saves when the user leaves the row, cellOut saves when the user leaves a cell, and keyUp creates a 750ms timeout on keyup events.

#### deleteKey
Type: string (default "delete") (allowed values: "delete", "ctrlDelete", "non")

By default, pressing the delete key while editing a cell brings up a confirmation dialog to delete the row. This can be changed to ctrl+delete, or disabled altogether, using this option.

#### addURL
Type: string (optional)

The url to submit row data to when adding a new row. If absent, the dbGrid will not support creating additional rows. If present, the plugin will add an additional row to the tbody element (see $.fn.dbGrid('createNewRow') ).

#### updateURL
Type: string (optional)

The url to submit row data to when updating a row.

#### deleteURL
Type: string (optional)

The url to submit row data to when deleting a row.

#### dataURL
Type: string (optional)

The url to retrieve data from when the requery method is called.

## $.fn.dbGrid('getInitialFocusCell')
Returns a jQuery selection of 0 or 1 elements, representing the initial focus cell as defined by the initialFocus option (see above).

## $.fn.dbGrid('getEditorDiv')
Returns a jQuery selection representing the \<div\> element added for support of the "editable" plugin.

## $.fn.dbGrid('incrRecCount', increment)
Increments the record count value displayed by the navigation bar

### increment
Type: integer

The amount to increment the record count by. May be negative.

## $.fn.dbGrid('setNavCounter', rowIndex)
Trigger a navCount message to update the navigation bar (if used with the statusBar plugin or an equivalent)

### rowIndex
Type: integer

The 0-based row index of the current record.

## $.fn.dbGrid('getCurrentCell')
Returns the cell currently being edited, as a jQuery selection.

## $.fn.dbGrid('setCurrentCell', cell)
Set the cell currently being edited (note: this is mainly intended for internal use, cellChange is preferred)

## $.fn.dbGrid('cellChange', newCell)
Perform any necessary cellOut/rowOut & cellIn/rowIn to begin editing newCell

The cell to begin editing

## $.fn.dbGrid('find', colName, search)
Search withing the column matching colName for a string matching search. If found, begin editing the first record with a
match. If not found, open an alert dialog indicating thatthe searched-for value was not found.

## $.fn.dbGrid('save', row, async)
Save a row, either as a new record or an update to an existing record.

### row (optional, if undefined or an empty jQuery object then defaults to current row)
Type: jQuery selection

The \<tr\> element to save.

### async
Type: boolean (default true)

Determines whether the http request used to save the row is handled asynchronously, or blocks execution of the code.

## $.fn.dbGrid('delete', row)
Delete a record. Raises a confirmation dialog. To delete a record without raising a confirmation dialog, call
$.fn.dbRecord('delete') instead for existing records, or $.fn.dbGrid('removeRow', row) for unsaved "add" rows.

### row (optional, if undefined or an empty jQuery object then defaults to current row)
Type: jQuery selection

The \<tr\> element representing the record to delete.

## $.fn.dbGrid('removeRow', row)
Remove a row from the table - note that this does not make a server request to delete the corresponding record. It does,
however, trigger rowOut and cellOut events.

### row
Type: jQuery selection

The \<tr\> element to delete.

## $.fn.dbGrid('createBlankRow')
Add a new, blank, "update" row to the table. As a general rule, you should only call this method if you plan to
populate the row with data for an existing record yourself. Otherwise, consider $.fn.dbGrid('createNewRow') instead.

## $.fn.dbGrid('createNewRow')
Add a new row to the grid. This will be an "add" row (ie. it will save to the addURL). This method will inspect the
table's \<col\> elements for a "defaultValue" attribute, and if this is present, it will popoulate the newly created
row with the corresponding default values.

## $.fn.dbGrid('requery', data, url)
Empty the grid and re-query the data url to re-populate.

### data
Type: object

Any additional data to be passed in to the re-query request.

### url
Type: string (optional, defaults to options.dataURL)

The url to use for the re-query.

### $.fn.dbGrid('cellAbove', fromCell)
### $.fn.dbGrid('cellRightOf', fromCell, searchNextRows)
### $.fn.dbGrid('cellBelow', fromCell)
### $.fn.dbGrid('cellLeftOf', fromCell, searchPreviousRows)
Return a jQuery selection of the nearest editable cell in the direction specified. Returns fromCell if no match is found.

#### fromCell
Type: jQuery selection

The cell to search from

#### searchNextRows / searchPreviousRows
Type: boolean (optional, default true)

Enable wrapped search.

## $.fn.dbGrid('resize', colIndex, width)
Resize the width of a column. Trigger resize event on window to resize any editors.

### colIndex
Type: integer

0-based column index of the colum to resize

### width
Type: string, number, or function

The width to resize the column to, as per jQuery.fn.width( value ).