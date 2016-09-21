# Columns Show/Hide Control
## jQuery.fn.columnsShowHideControl()
[Fiddle](http://jsfiddle.net/PeterChaplin/hono0zb8/)

Uses one or more clickable controls to show and hide table columns. Each control should contain a checkbox - an \<input> element with type="checkbox". The checkboxes should have two non-standard additional attributes - table_selector and col_selector. Both should contain css selector strings, for selecting the \<table> and \<col> element(s) for that control.

If the checkbox is checked when the page loads, the columns will be shown, otherwise they will be hidden. The plugin also adds and removes the "highlight" class to elements matching the col_selector of a control when the mouse hovers over it.

Finally, if the checkbox has the "sticky" attribute set to true, checking or unchecking the control will send an POST to "sticky_save.html" with the name of the control and its current value as one form argument, and the sticky_url attribute of the checkbox (if present) as another.