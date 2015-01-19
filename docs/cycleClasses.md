# Class cycle plugin
## $.fn.cycleClasses( classes )
[Fiddle](http://jsfiddle.net/PeterChaplin/jQHpJ/)
Call on a single element which has at most one of the classes in the given array (otherwise behavior is unspecified).
Cycles through the given classes in the order given (each call removes the current class and applies the next one).
When the end of the array is reached, loop back to the beginning.
If the element does not have any of the given classes, apply the first one.

### classes
Type: Array (required)

An array of class names to cycle through.