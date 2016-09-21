# Editable
[Fiddle](http://jsfiddle.net/PeterChaplin/t155eadk/)

Use a hovering input to edit an otherwise non-editable element, such as a \<td\> or \<div\>. Supports
several editor types - text, textarea, htmlarea, combo, bool - by using the associated dbGrid plugins. Also
supports using the "input" type to wrap the same API around a form input element.

## $.fn.editable(options)
Initialise the editable plugin

### options
Type: object

#### options.editorType
Type: String (optional, default "auto") (allowed values: "auto", "input", "text", "textarea", "htmlarea", "bool")

The type of editor to use. The value "auto" defaults to "input" for form elements, otherwise looks for a "type" attribute
on the element, and defaults to "text" if not found.

#### options.defaultRange
Type: String or null (optional, default null) (allowed values: "start", "end", "all", null)

Default cursor position/selection to use on focus. Null allows the browser to set cusror position for form elements, but
defaults to "all" for other elements.

#### options.container
Type: jQuery selection (optional, defaults this element's offset parent)

Container for the editor to be appended to. Should be the target element's offset parent, or a descendent thereof,
such that the editor and the target element will scroll together (if the container is scrolled).

## $.fn.editable('hasFocus')
Test if the element has focus, or the editor has focus over this element.

## $.fn.editable('getValue')
Return the current value of this editable.

## $.fn.editable('setValue', newValue)
Set the value of this editable

## $.fn.editable('setRange', newRange)
Set the cursor position / selection range

### newRange
Type: string (allowed values "start", "end", "all")