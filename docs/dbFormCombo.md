# dbFormCombo
[Fiddle](http://jsfiddle.net/PeterChaplin/1p69er2n/)

Call on a text input, provides an AJAX-based autocomplete dropdown. The current input value is passed in as a form
variable named "value", the input name is passed in as a form variable named "name". The response is expected to be
xml in the following form:
```
<records>
        <record>
                <option>Option A</option>
                <option>Option B</option>
                ..
        </record>
</records>
```
The dropdown is implemented using a `<div>` appended to the `<body>`

## $.fn.dbFormCombo(options)
Initialise the plugin

### options.comboWidth
Type: String or Number

Width of the dropdown wrapper

### options.searchURL
Type: String

The url to send requests to

### options.searchLimit
Type: Number (optional, default 10)

The maximum number of autocomplete options to display. Passed in asa form variable named "searchLimit"

### options.comboHeight
Type: Number (optional, default 200)

The height, in pixels, of the autocomplete dropdown.

## $.fn.dbFormCombo("show")
Show the autocomplete dropdown, with its current values

## $.fn.dbFormCombo("hide")
Hide the autocomplete dropdown

## $.fn.dbFormCombo("highlight", index)
Highlight one of the dropdown options, using a 0-based index.

## $.fn.dbFormCombo("select", index)
Select one of the dropdown options, using a 0-based index.

## $.fn.dbFormCombo("updateList")
Intended for internal use. Update the list with the results from the most recent AJAX request.

## $.fn.dbFormCombo("search")
Perform an AJAX request to update the list.