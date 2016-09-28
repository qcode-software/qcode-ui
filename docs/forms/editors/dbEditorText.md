# dbEditorText

See also:
[$.fn.editable](editable.md)

Hovering text input plugin. Call on an element to contain the editor, then pass in an element for the editor to hover
over as a method argument. Use for editing text-only contents of non-editable elements such as \<div\>s and \<td\>s.
Copies css from the target element to the editor.

## $.fn.dbEditorArea()
Initialise the plugin.

## $.fn.dbEditorArea('getCurrentElement')
Get the element currently being edited, as a jQuery selection.

## $.fn.dbEditorArea('setValue', newValue)
Set the value of the editor

## $.fn.dbEditorArea('getValue')
Get the value of the editor

## $.fn.dbEditorArea('show', element, value)
Show the editor over the given element, with the given value.

## $.fn.dbEditorArea('hide')
Hide the editor

## $.fn.dbEditorArea('repaint')
Re-apply the css form the currenly edited element to the editor.

## $.fn.dbEditorArea('selectText', range)
Set the text selection / cursor position. Accepts "start", "end", or "all" as the range options.