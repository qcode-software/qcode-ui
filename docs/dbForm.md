# Database form - dbForm
[Fiddle](http://jsfiddle.net/PeterChaplin/gpfRg/)

[Navigation Fiddle](http://jsfiddle.net/PeterChaplin/jeojasyk/) (incomplete)

A form representing a database record. Can be saved using AJAX, and provides tools for navigating between records.

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

Url to send delete requests to.

TO DO: finish this