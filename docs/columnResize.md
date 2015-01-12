# columnResize
## jquery.columnResize( [options] )
[Fiddle](http://jsfiddle.net/PeterChaplin/ft1hrw6n/)

Call on a \<table> element, make each column resizable by dragging the right border of that column's \<th> element.
(Requires the table to have a \<colgroup> with \<col> elements)

### options
Type: Object {overflow, 'min-font-size'}

#### overflow
Type: String, one of "normal", "hidden", "shrink", "shrink-one-line", "break-word"

Default: "shrink-one-line"

What to do when the content no longer fits the column

##### normal
Do nothing, leave handling overflow to the browser, css, or other plugins.

##### hidden
Clip the cell contents

##### shrink
Reduce the font size until the content fits, down to a minimum specified by options.min-font-size . Forces the entire column into a single font size, using the \<th> font size as a starting point

##### shrink-one-line
As "shrink", but forces no wrapping, to keep the content on a single line.

##### break-word
Forces word breaking to try and make the content fit

#### min-font-size
Type: Integer, default 1