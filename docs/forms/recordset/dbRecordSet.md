# Database Record Set plugin - dbRecordSet
[Fiddle](http://jsfiddle.net/PeterChaplin/yCFQP/)

## See Also 
- [dbRecord.js](recordset/dbRecord.md)
- [dbField.js](recordset/dbField.md)

Call on a page element representing an editable database record set. This element should contain descendants that
represent individual records, which in turn should contain elements representing individual fields. The records should
have class "record", and the fields should have "name" attributes. Editable fields should have the "editable" class,
and should be focussable - use the tabIndex attribute to control this.

This plugin uses the dbRecord and dbField plugins. Also uses the $.fn.editable plugin.

Use the custom attributes "addURL", "updateURL" and "deleteURL" to specify urls for AJAX-based addition, update, and
deletion of records.

## Events
Fires:
- message
- cosmeticChange
- dbRecordAction
- dbRecordActionReturn
- dbRecordActionReturnError
- resize
- dbRecordIn
- dbRecordOut
- dbFieldIn
- dbFieldOut

## $.fn.dbRecordSet(options)
Initialise the plugin

### options.saveEvent
Type: String (optional, defaults "recordOut") (allowed: "recordOut", "fieldOut", "blur")

Determines when the recordSet will attempt to automatically save a record. Can also be set using the custom attribute
"saveEvent" on the record-set element.

## $.fn.dbRecordSet("save")
Save the current record

## $.fn.dbRecordSet("getCurrentRecord")
Get the current record

## $.fn.dbRecordSet("setCurrentRecord", record)
Intended for internal use. Sets the current record. Prefer "fieldChange" to control focus.

## $.fn.dbRecordSet("getCurrentField")
Get the current field

## $.fn.dbRecordSet("setCurrentField", field)
Intended for internal use. Sets the current field. Prefer "fieldChange" to control focus.

## $.fn.dbRecordSet("fieldChange", newField)
Change the current field, switching to the new field.