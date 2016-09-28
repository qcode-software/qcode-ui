# dbEditorBool plugin

See Also:
[$.fn.editable](editable.md)

A hovering editor for boolean input. Copies various css attributes from the target element to try and look the same. Note
that this plugin should be called on the element which will contain the editor, not on the element to be edited.

## $.fn.dbEditorBool()
Initialise the plugin.

## $.fn.dbEditorBool('getCurentElement')
Get the element currently being edited.

## $.fn.dbEditorBool('getValue')
Get the current value of the editor. Returns a boolean true or false.

## $.fn.dbEditorBool('setValue', newValue)
Set the value of editor.

## $.fn.dbEditorBool('show', element, value)
Show this editor over the specified element, with the specified value.

## $.fn.dbEditorBool('hide')
Hide the editor

## $.fn.dbEditorBool('repaint')
Update the editor css from the currentElement

## $.fn.dbEditorBool('selectText' range)
Set the cursor position / text selection. Accepts "start", "end", or "all" as the range.

## $.fn.dbEditorBool('setTrue')
## $.fn.dbEditorBool('setFalse')
Set the value to true or false