# dbEditorTextArea

See also:
[$.fn.editable](editable.md)

Hovering textarea plugin. Call on an element to contain the editor, then pass in an element for the editor to hover
over as a method argument. Use for editing text-only contents of non-editable elements such as \<div\>s and \<td\>s.
Copies css from the target element to the editor.

## $.fn.dbEditorTextArea()
Initialise the plugin.

## $.fn.dbEditorTextArea('getCurrentElement')
Get the element currently being edited, as a jQuery selection.

## $.fn.dbEditorTextArea('setValue', newValue)
Set the value of the editor

## $.fn.dbEditorTextArea('getValue')
Get the value of the editor

## $.fn.dbEditorTextArea('show', element, value)
Show the editor over the given element, with the given value.

## $.fn.dbEditorTextArea('hide')
Hide the editor

## $.fn.dbEditorTextArea('repaint')
Re-apply the css form the currenly edited element to the editor.

## $.fn.dbEditorTextArea('selectText', range)
Set the text selection / cursor position. Accepts "start", "end", or "all" as the range options.