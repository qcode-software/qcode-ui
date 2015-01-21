# Database record plugin - dbRecord
Intended for use by dbRecordSet

A plugin for an element representing a single record in a database record set. This plugin applies classes "current",
"dirty", "updating", and "error" as the record moves through those states.

## $.fn.dbRecord(options)

### options.saveEvent
Type: string (optional)

See dbRecordSet docs - dbRecord allows saveEvent to be set on individual records via a custom attribute "saveEvent", but
default to its recordSet's saveEvent option.

## $.fn.dbRecord("getRecordSet")
Get the associated recordSet

## $.fn.dbRecord("getState")
Get the current state of the record ("current", "dirty", "updating", or "error").

## $.fn.dbRecord("setState", newState)
Set the state of the record

## $.fn.dbRecord("getErrorMessage")
Get the error message from the last save attempt for this record. Returns undefined if this record has not attempted to
save, or if the most recent attempt to save was successful.

## $.fn.dbRecord("save", async)
Attempt to save this record.

### async
Type: boolean (optional, default true)
Determines whether to make the http request asynchronously, or wait for a return from the server.

## $.fn.dbRecord("delete", async)
Attempt to delete this record. If this element represents an existing record on the server (ie. has type "update"),
this will perform an AJAX request to delete the corresponding record.

### async
Type: boolean (optional, default true)
Determines whether to make the http request asynchronously, or wait for a return from the server.

## $.fn.dbRecord("action", actionName, url, async)
Attempt to perform the specified server-request action. This is intended as a low-level function, generally "save" or
"delete" are preferred.

### actionName
Type: string (values: "add", "update", "delete")

The name of the action to be performed.

### url
Type: string

The url to send the request to.

### async
Type: boolean (optional, default true)
Determines whether to make the http request asynchronously, or wait for a return from the server.

## $.fn.dbRecord("getCurrentField")
Get the field currently being edited, or an empty jQuery object if no field is being edited.

## $.fn.dbRecord("setValues", xmlDoc)
Set the values of fields in this record using the xml document provided.

## $.fn.dbRecord("recordIn", orignialEvent)
Intended for internal use. Set this record as the current record and trigger a dbRecordIn event using orignalEvent. See
dbRecordSet("fieldChange", newField) for controlling the field focus.

## $.fn.dbRecord("recordOut", originalEvent)
Intended for internal use. Trigger a dbRecordOut, using originalEvent. See
dbRecordSet("fieldChange", newField) for controlling the field focus.