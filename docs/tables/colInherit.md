# colInherit
## jQuery.fn.colInherit( [options] )
[Fiddle](http://jsfiddle.net/PeterChaplin/U74LT/)

Call on a \<table> element. Copies classes from the \<col> elements to each \<td> and \<th> element in that column.
Creates :nth-child css rules to apply inline styles from the \<col> elements to each \<td> and \<th> element in that column. Optionally copies some attributes from the \<col> elements to each \<th> and \<td>.

### options
Type: Object

#### customAttributes
Type: Array of strings

Treat each string in options.customAttributes as the name of an attribute to copy (see above).