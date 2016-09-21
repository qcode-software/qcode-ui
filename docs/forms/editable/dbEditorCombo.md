# db combo editor
[Fiddle](http://jsfiddle.net/PeterChaplin/7zsoekk8/)

A hovering editor with an autocomplete dropdown. Note that this element should be called on the element that will act
as a container for the editor, not the element(s) that will be edited. This editor requires a searchURL, which it uses
to populate the auto-complete dropdown. It does this using a "GET" request with the current value of the editor provided
as a form data value named "value". The request is expected to be in the structure:
```
<records>
        <record>
                <option>Value1</option>
                <option>Value2</option>
                ...
        </record>
</records
```

## $.fn.dbEditorCombo()
Initialise the plugin

## $.fn.dbEditorCombo('getCurrentElement')
Get the element currently being edited.

## $.fn.dbEditorCombo('getValue')
Get the current value of the editor.

## $.fn.dbEditorCombo('setValue', newValue)
Set the value of the editor.

## $.fn.dbEditorCombo('show', element, value, searchURL)
Show the editor over the target element, with an initial value set,
and specify the searchURL to use for the auto-complete.

## $.fn.dbEditorCombo('hide')
Hide the editor

## $.fn.dbEditorCombo('selectOption', index)
Select an option from the drop-down, using a 0-based index

## $.fn.dbEditorCombo('repaint')
Re-apply css values from the current element to the editor

## $.fn.dbEditorCombo('selectText', range)
Set the cursor position / text selection. Accepts "start", "end", or "all" for the range.

## $.fn.dbEditorCombo('search')
Trigger a search request to the server.

## $.fn.dbEditorCombo('searchReturn')
Intended for internal use. Handle a return from a search request from the server.