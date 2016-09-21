# Database field plugin - dbField
Intended for use by dbRecordSet

An element representing a single field in a single record in a database record set. Uses the $.fn.editable plugin.

## $.fn.dbField(options)

### options.saveEvent
See dbRecordSet and dbRecord docs.

## $.fn.dbField("getRecordSet")
Get the record-set element associated with this field.

## $.fn.dbField("getRecord")
Get the record element associated with this field.

## $.fn.dbField("getName")
Get the name of this field

## $.fn.dbField("getValue")
Get the current value of this field

## $.fn.dbField("setValue", newValue)
Set the value of this field

## $.fn.dbField("fieldIn")
For internal use. See dbRecordSet("fieldChange", newField) for controlling the field focus.

## $.fn.dbField("fieldOut")
For internal use. See dbRecordSet("fieldChange", newField) for controlling the field focus.

## $.fn.dbField("getType")
Get the field type

## $.fn.dbField("isEditable")
Returns true if the field is currently editable, otherwise returns false