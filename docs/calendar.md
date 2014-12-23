# Calendar

## jQuery.fn.calendar
Built using [jQuery UI Widget Factory](http://api.jqueryui.com/jQuery.widget/) - see jQuery UI docs for more info.
Call on a <canvas> element to draw a calendar.

### options
#### bodyHeight
Type: integer, default: 150
Height of the calendar body, in pixels.

#### headerHeight
Type: integer, default: 40
Height of the calendar header, in pixels.

#### startDate
Type: Date (required)
Start date of the calendar

#### finishDate
Type: Date (required)
Finish date of the calendar

#### pxPerDay
Type: integer, default: 20
Pixel width of each day column

#### styles
Type: object

##### weekends
Type: [CanvasRenderingContext2D.fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.fillStyle), default: "rgba(220,220,220,1)"
Fill style of weekend columns

##### lines
Type: [CanvasRenderingContext2D.strokeStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.strokeStyle), default: "rgba(200,200,200,1)"
Style of all the calendar lines

##### text
Type: [CanvasRenderingContext2D.fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.fillStyle), default: "rgba(100,100,100,1)"
Fill style of the calendar text

### draw( [async] )
(Re-)draw the calendar to the canvas. If async is true or undefined, the redraw will occur asynchronously after the current event handlers have finished running - this also prevents multiple calls to .draw() from having such a negative impact on performance.

### date2positionLeft(date)
Return the px distance from the left edge of the calendar to the left edge of the given date

### date2positionRight(date)
Return the px distance from the right edge of the calendar to the right edge of the given date

### newDateHighlighter(options)
Create a new jQuery.qcode.calendar.DateHighlighter object (see below) with the given options and adds it to the calendar

### newBar(options)
Create a new jQuery.qcode.calendar.Bar object (see below) with the given options and adds it to the calendar

### addObject(canvasOpbject)
Add the given jQuery.qcode.calendar.CanvasObject (see below) to the calendar

### removeObject(canvasObject)
Remove the given jQuery.qcode.calendar.CanvasObject (see below) from the calendar, if present

### getContext()
Return the drawing canvas of the calendar (a [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) object)

## jQuery.qcode.calendar.CanvasObject(canvas, options)
Draws a rectangle on the canvas and binds mouse events for it

### options
#### top
Pixel y position of the rectangle
#### left
Pixel x position of the rectangle
#### width
Pixel width of the rectangle
#### height
Pixel height of the rectangle
#### color
Type: [CanvasRenderingContext2D.fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.fillStyle) default: "lightblue"
Fill colour/style of the rectangle
#### layer
Type: integer, default 1
What canvas layer to draw the rectangle on.

### update()
re-read the position and dimensions from the options, ready for redraw

### draw ( [layer] )
If layer is undefined, re-draw the entire object. Otherwise, re-draw whatever parts of this object are drawn on the given layer. Note that the base CanvasObject only has one "part", and so only draws on one layer.

### topLayer()
Return the top layer index of this object. Note that the base CanvasObject only has one layer.

### on(eventName, handler)
Bind an event handler to one of the mouse events provided by this object.
eventName must be one of "mouseenter", "mouseleave", or "click"

### off
Remove an event handler bound with on().

### remove
Remove all event listeners, and remove this CanvasObject from the calendar canvas.

## jQuery.qcode.calendar.DateHighlighter
Extends jQuery.qcode.calendar.CanvasObject
A canvas object that highlights a single date in the chosen calendar

### options
#### color (as jQuery.qcode.calendar.CanvasObject)
#### layer (as jQuery.qcode.calendar.CanvasObject)
#### date
Type: Date (required)
The date to highlight

### setDate(newDate)
Update the date and re-draw.

### setColor(newColor)
Update the colur and re-draw.

## jQuery.qcode.calendar.Bar
Extends jQuery.qcode.calendar.CanvasObject
A horizontal bar added to the calendar

### options
#### color (as jQuery.qcode.calendar.CanvasObject)
#### layer (as jQuery.qcode.calendar.CanvasObject, but defaults to 2)
#### startDate
Type: Date (required)
Date to start the bar from

#### finishDate
Type: Date (required)
Date to finish the bar on

#### barHeight
Type: integer, default 10
Pixel height of the bar

#### verticalPosition
Type: integer (required)
Pixel distance from canvas top to center the bar on