#compass
##$.fn.northOf( selector )
##$.fn.eastOf( selector )
##$.fn.southOf( selector )
##$.fn.westOf( selector )
[Fiddle](http://jsfiddle.net/PeterChaplin/47js0aog/)

Returns a jQuery selection of length 0 or 1, representing the element which:

- matches the selector passed in
- is visible, and
- is positioned north, east, south, or west* of the first element from the set this plugin is called from.

if one exists.

*ie. up, right, down, left, respecively. Terms like "above" and "below" can get a little confusing when elements overlap.

### selector
Type: String or Element or Array of Elements or jQuery

(In short, anything accepted by jQuery() to get a set of elements appearing in this document)