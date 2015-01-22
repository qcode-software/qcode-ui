# Text cycle plugin
## $.fn.cycleText( labels )
[Fiddle](http://jsfiddle.net/PeterChaplin/6nuMD/)

Call on a single element with text content matching one of the labels provided (otherwise behavior is unspecified).
Cycles through the given labels (each call replaces the current contents of the element with the next label).
When the end of the array is reached, cycle back to the first one.

### labels
Type: Array (required)

An array of label stringsto cycle through.