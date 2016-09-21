# Database grid cell - dbCell
Designed as a a sub-component of [dbGrid](dbGrid.md)

A \<td\> element representing a single field in a single record in a database record set.

## $.fn.dbCell( options )
Initialise the dbCell plugin

### options
Type: object

#### options.deleteKey
Type: text (optional, default "delete") (values: "delete", "ctrlDelete", "none")

If set to "delete", pressing the Delete key while editing the cell will be interpreted as an attempt to delete the entire
row, and will bring up a confirmation dialog. If set to "ctrlDelete", this behaviour will only be triggered by Ctrl+Delete.
If set to "none" (or anything else), this behaviour will not be triggered.

#### options.type
Type: text (optional, default "text") (values: "text", "bool", "combo", "htmlarea", "textarea")

Indicates the type of dbEditor to use when editing this cell.

#### options.tab_on_return
Type: boolean

Only meaningful with type htmlarea, see $.fn.dbEditorHTMLArea() for details

## $.fn.dbCell('getRow')
Get the $('tr') associated with this cell.

## $.fn.dbCell('getGrid')
Get the $('table') associated with this cell.

## $.fn.dbCell('getCol')
Get the $('col') associated with this cell.

## $.fn.dbCell('getType')
Return options.type

## $.fn.dbCell('getEditorPluginName')
Return the name of the editor plugin for this cell. For example, if options.type is "text", returns "dbEditorText",
because we would call $.fn.dbEditorText() for editing this cell.

## $.fn.dbCell('editor', [args] )
Call the editor plugin for this cell with whatever args are passed in. Return the return value.

## $.fn.dbCell('getValue')
Return the value of this cell.

## $.fn.dbCell('setValue', value)
Set the value of this cell. May trigger a resize event.

## $.fn.dbCell('isEditable')
Return true/false if the cell is/is not currently editable. Cells are editable if they are visible, not awaiting a
response from the server, have a name defined on thier \<col\> element, and do not have the addDisabled/updateDisabled
attribute (as appropriate for thier row type) set.

## $.fn.dbCell('isTabStop')
Returns true if navigation within the grid will stop on this cell - if false then the user will need to click the cell
directly to gain focus. Controlled by the custom "tabStop" attribute on the corresponding \<col\> element.

## $.fn.dbCell('cellIn')
Intended for use by dbGrid - see $.fn.dbGrid('cellChange', newCell) to change cell focus. This method triggers all the
behaviour associated with a cell gaining focus, but not the associated cellOut, rowIn, or rowOut behaviour.

## $.fn.dbCell('cellOut')
Intended for use by dbGrid - see $.fn.dbGrid('cellChange', newCell) to change cell focus. This method triggers all the
behaviour associated with a cell losing focus, but not the associated cellOut, rowIn, or rowOut behaviour.

## $.fn.dbCell('write')
Intended for Internal use. Write the current contents of the editor to the \<td\> element.

## $.fn.dbCell('editorBlur')
Intended for Internal use. Called when the editor blurs. Performs cellout if the updateType is "onCellOut".

## $.fn.dbCell('editorValueChange')
Intended for Internal use. Called when the editor value changes. Marks the row as dirty. If updateType is "onKeyUp", sets a delayed save timeout.

## $.fn.dbCell('editorKeyDown', event)
Intended for Internal use. Called on keyDown event on editor.

## $.fn.dbCell('onMouseDown', event)
Intended for Internal use. Called on mouseUp.
