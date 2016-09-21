# dbFormImageCombo
TO DO: Add a jsFiddle for this widget

A widget containing an input which becomes a dbFormCombo widget, allowing the user to choose a filename, and an image that is updated when they do. Images should be made available from an url which accepts filename as a query string variable
eg. "/my_images?filename=roses.jpg"

Wraps the `<img>` element in a `<div>` with class "image-wrapper".

## $.fn.dbFormImageCombo(options)
Initialise the plugin. All the options can be set by adding custom attributes of the same name to the input element.

### options.loadingImageURL
Type: String (optional, default "/Graphics/animated_progress.gif")

Url of image to display while the image is loading.

### options.noImageURL
Type: String (optional, default "/Graphics/noimage.png")

Url of image to display while no image is selected.

### options.searchURL
Type: String

Url to search for a list of filenames (see dbFormCombo for details)

### options.searchLimit
Type: Number

Maximum number of filenames to display (see dbFormCombo for details)

### options.comboWidth
Type: Number

Pixel width of autocomplete dropdown (see dbFormCombo for details)

### options.comboHeight
Type: Number

Pixel height of autocomplete dropdown (see dbFormCombo for details)

### options.imageURL
Type: String

The url to get the image from. The selected filename will be added to the query string of this url.

## $.fn.dbFormImageCombo("loadImage")
Attempt to update the image based on the contents of the input. Normally this will happen automatically when a new value is selected.