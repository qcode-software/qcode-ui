# dbEditorHTMLArea plugin
See also:
[$.fn.editable](editable.md)

A hovering editor for multi-line input, using a contentEditable div to allow html markup.

## $.fn.dbEditorHTMLArea( options )
Initialise the plugin

### options.tab_on_return
Type: boolean (optional, default false)

If true, using the Enter/Return key without the shift key will be passed to the element being edited, so that it can be
used for navigation.

## $.fn.dbEditorHTMLArea('getCurrentElement')
Get the element currently being edited

## $.fn.dbEditorHTMLArea('getValue')
Get the currnet value of the editor

## $.fn.dbEditorHTMLArea('show', element, value)
Show the element over the specified element, with the specified value

## $.fn.dbEditorHTMLArea('hide')
Hide the editor

## $.fn.dbEditorHTMLArea('repaint')
Re-apply the current element's css to the editor

## $.fn.dbEditorHTMLArea('selectText', range)
Set the cursor position / selection range. Accepts "all", "end", "start" as options.