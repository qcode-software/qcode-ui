# Columns Show/Hide
## jQuery.fn.columnsShowHide( column_selector [, show_hide] )
[Fiddle](http://jsfiddle.net/PeterChaplin/o5zmh38w/)

Call on one or more \<table> elements to show or hide selected columns of those tables. Add a css rule to the page, so additional table rows added later will be subject to the same rule.

### column_selector
Type: String (jQuery selector) (required)

Selector for the column(s) to show or hide

### show_hide
Type: String ("show" or "hide")

Whether to show or hide the columns. If undefined, default behavior is to toggle (show hidden columns, hide visible columns).