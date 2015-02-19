# Database form - dbForm
[Fiddle](http://jsfiddle.net/PeterChaplin/gpfRg/)

[Navigation Fiddle](http://jsfiddle.net/PeterChaplin/jeojasyk/)

A form representing a database record. Can be saved using AJAX, and provides tools for navigating between database records using AJAX requests.

## $.fn.dbForm( [options] )
Initialise the plugin

### options.formType
Type: string (optional, default "update") (allowed: "update", "add", "submit")

The type of record - "update" indicates an existing record to be updated, "add" indicates a new record to be created, "submit" indicated that the form should be submitted rather than saved through AJAX requests.

### options.updateType
Type: string (optional, default "manual") (allowed: "manual", "keyup", "focus", "blur")

Only applicable when options.formType is "update", controls how attempts to save the form will be triggered.

### options.enabled
Type: boolean (optional, default true)

If false, disables editing of the form

### options.checkOnExit
Type: boolean (optional, default true)

Only applicable when options.formType is "update", brings up a confirmation dialog if the user attempts to leave the page while there are unsaved changes.

### options.initialFocus
Type: boolean (optional, default true)

If true, give focus to the first form element.

### options.initialFind
Type: string (optional) in the form "name=value"

If set, the form will perform a search, using $.fn.dbForm("find", name, value)

### options.dataURL
Type: string (optional)

If set, the plugin will query the dataURL to populate the form.

### options.qryURL
Type: string (optional)

The url to use for navigation between records. If set, will initially attempt to navigate to the first record in the set.

### options.updateURL
Type: string (optional)

Url to send AJAX requests to when saving a form of type "update"

### options.addURL
Type: string (optional)

Url to send AJAX requests to when saving a form of type "add"

### options.submitURL
Type: string (optional)

Url to submit the form to if it is of type "submit"

### options.searchURL
Type: string (optional)

Url to to send search requests to when $.dbForm("find") is called

### options.deleteURL
Type: string (optional)

Url to send delete requests to when $.dbForm("del") is called

### options.formActionReturn
Type: function (optional)

Function to call back on return from a server. Equivalent to using $.fn.on('formActionReturn') to bind the function.

## $.fn.dbForm('save', async)
Attempt to save this form. Asynchronous by default, can be made synchronous using the optional async flag.

## $.fn.dbForm('formAction', type, url, handler, errorHandler, async)
Low-level function for performing form actions involving server requests.

## $.fn.dbForm('focus')
Give focus to the first focussable element of the form.

## $.fn.dbForm('nav', navTo)
Attempt to navigate to a different record. Requires a (normally hidden) form element named "navTo". Sends a server request to options.qryURL with the current form data, including the value of navTo.

## $.fn.dbForm('find', [name1, value1 .. nameN, valueN] )
Uses a request to options.searchURL to navigate to another record. Accepts any even number of "name, value" arguments to pass in as additional form data to the request.

## $.fn.dbForm('del')
Display a confirmation dialog, on confirm delete the current record with a request to options.deleteURL.

## $.fn.dbForm('setState', newState)
Set the state of the current record. Records begin in state "current", and become "dirty" when the user begins editing. Records waiting for a server response (eg. when saving) are put into state "updating". On response from a sucessful server requests, records are put back into state "current", on error they are put into state "error" (until the user begins editing again).

## $.fn.dbForm('setDirty')
Alias of $.fn.dbForm('setState', 'dirty').

## $.fn.dbForm('setStatus', message)
Set the status message to be displayed in the status bar. Message can be an html fragment.

## $.fn.dbForm('formData')
Get a simple javascript object of name-value data from the form field elements.