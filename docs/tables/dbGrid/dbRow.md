# Database Grid Row - dbRow
Designed as a sub-component of [dbGrid](dbGrid.md).

An html \<tr\> element representing a database record, as part of a database grid. Applies classes "current", "dirty",
"updating", and "error" to indicated the current row state:

- Current: the row is up-to-date with the corresponding record
- Dirty: the row has been modified, but not saved
- Updating: the row is awaiting a server response from an attempted save or delete
- Error: the row received an error from the server when attempting to save or delete (removed when the user begins editing)

## $.fn.dbRow(options)
Initialise the dbRow plugin

### options
Type: object

#### options.type
Type: string (allowed values: "add", "update")

"Add" rows are used for creating new records, "Update" rows are used for updating or deleting existing records.

## $.fn.dbRow('getGrid')
Returns the \<table\> element associated with this row, as a jQuery selection.

## $.fn.dbRow('getColGroup')
Returns the \<colground\> element associated with this row, as a jQuery selection.

## $.fn.dbRow('getCurrentCell')
Returns the cell currently being edited by this grid, as a jQuery selection.

## $.fn.dbRow('getState')
Returns the "state" of this row - one of "current", "dirty", "updating", or "error".

## $.fn.dbGrid('setState', newState)
Set the state of this row

### newState
Type: string (allowed values: "current", "dirty", "updating", "error")

The new state to set the row to

## $.fn.dbRow('rowIn')
Call to indicate that this row is now being edited. Updates the status bar (if one is present), and fires "rowIn". Mostly intended to be called by dbGrid.

## $.fn.dbRow('rowOut')
Call to indicate that this row is no longer being edited. Saves if the row is dirty, triggers dbRowOut. Mostly intended to be called by dbGrid.

## $.fn.dbRow('save', async)
Save this row.

### async
Type: boolean (optional, default true)

Whether to handle the save asynchronously, or block javascript execution while waiting for a server response.

## $.fn.dbRow('action', action, url, async)
Perform the given action (eg. add, update, delete), by submitting row data to the server.

### action
Type: string

The name of the action to be performed

### url
Type: string

The url to submit the action request to.

### async
Type: boolean (optional, default true)

Whether to handle the action asynchronously, or block javascript execution while waiting for a server response.

## $.fn.dbRow('xmlSetValues', xmlDoc)
Update the row data based on the given xml document

## $.fn.dbRow('setCellValue', colName, value)
Set the value of the cell corresponding to colName in this row.

## $.fn.dbRow('delete', async)
Delete this row
Type: boolean (optional, default true)

Whether to handle the delete asynchronously, or block javascript execution while waiting for a server response.