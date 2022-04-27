// ======================================================================
// Calendar widget. Construct with a HTMLCanvasElement to draw a calendar
// ======================================================================
;var qcode = qcode || {};

qcode.Calendar = class {
    bodyHeight = 150
    headerHeight = 40
    pxPerDay = 20
    styleWeekends = 'rgba(220,220,220,1)'
    styleLines = 'rgba(200,200,200,1)'
    styleText = 'rgba(100,100,100,1)'
    styleToday = 'rgba(160,200,240,1)'
    startDate
    finishDate
    
    _canvas
    _drawTimeout
    _width
    _height
    
    _canvasObjects = []
    get canvasObjects() { return this._canvasObjects }
    
    _context
    get context() { return this._context }
    
    constructor(canvas, options) {
        for (const fieldName of Object.keys(this)) {
            this[fieldName] = coalesce(options[fieldName], this[fieldName])
        }
        
        if ( ! canvas.getContext ) {
            throw "Plugin qcode.calendar requires a canvas";
        }
        
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.newDateHighlighter({
            date: Date.today,
            color: this.styleToday
        });
        
        for (const eventName of [
            'mouseenter',
            'mouseleave',
            'mouseclick'
        ]) {
            canvas.addEventListener(
                eventName,
                this._handleEvent.bind(this, eventName)
            );
        }
    }
    
    draw(draw_async) {
        draw_async = coalesce(draw_async, true);
        if ( draw_async ) {
            if ( this._drawTimeout === undefined ) {
                this._drawTimeout = window.setZeroTimeout(() => {
                    this._drawNow();
                    this._drawTimeout = undefined;
                });
            }
        } else {
            this._drawNow();
            window.clearZeroTimeout(this._drawTimeout);
            this._drawTimeout = undefined;
        }
    }
    
    date2positionLeft(date) {
        // Return the px distance from the left edge of the calendar,
        // to the left edge of the given date
        return (
            Date.daysBetween(
                date, this.startDate
            ) * this.pxPerDay
        );
    }
    
    date2positionRight(date) {
        // Return the px distance from the right edge of the calendar,
        // to the right edge of the given date
        return (
            Date.daysBetween(
                this.finishDate, date
            ) * this.pxPerDay
        );
    }
    
    newDateHighlighter(options) {
        // Create and return a date highlighter attached to this calendar,
        // (see class defs. below)
        const highlighter = new qcode.Calendar.DateHighlighter(
            this, options
        );
        this.addObject(highlighter);
        return highlighter;
    }
    
    newBar(options) {
        // Create and return a horizontal bar attached to this calendar
        // (see class defs. below)
        var bar = new qcode.Calendar.Bar(this, options);
        this.addObject(bar);
        return bar;
    }
    
    _drawNow() {
        // draw (or redraw) the calendar
        this._validate()
        this._updateDimensions()
        this._clear()
        this._drawGrid()
        this._drawCanvasObjects();
    }
    
    _validate() {
        if ( ! Date.isValid(this.startDate) ) {
            throw "Invalid start date for calendar";
        }
        if ( ! Date.isValid(this.finishDate) ) {
            throw "Invalid finish date for calendar";
        }
    }

    _updateDimensions() {
        // Recalculate width/height in case options have changed
        this._width = (
            Date.daysBetween(
                this.finishDate,
                this.startDate
            ) + 1
        ) * this.pxPerDay;
        this.element.setAttribute('width', this._width);
        
        this._height = this.bodyHeight + this.headerHeight;
        this.element.setAttribute('height', height);
    }

    _clear() {
        // Clear the canvas
        this._context.clearRect(
            0, 0, this._width, this._height
        );
    }

    _drawGrid () {
        // Draw the calendar grid (with weekend highlights and headings)
        this._drawWeekendHighlights();
        this._drawWeeklyHeaderText();
        this._drawDailyHeaderText();
        this._drawGridLines();
    }

    _drawGridLines () {
        // Draw vertical lines at the end of each day
        let x = 0.5;
        this.context.beginPath();

        for (const date of Date.days(
            this.startDate, this.finishDate
        )) {
            x += this.pxPerDay;

            if ( date.getDay() == 0 ) {
                this._context.moveTo(x, 0.0);
            } else {
                this._context.moveTo(x, this.headerHeight);
            }
            
            this._context.lineTo(x, height);            
        }

        // Actually draw all the lines
        this._context.strokeStyle = this.stylesLines;
        this._context.stroke();
    }

    _drawWeekendHighlights() {
        // Highlight each weekend
        let x = 0.5;
        this._context.fillStyle = this.stylesWeekends;
        
        for (const date of Date.days(
            this.startDate, this.finishDate
        )) {
            if ( date.getDay() == 0 || date.getDay() == 6 ) {
                this._context.fillRect(
                    x, this.headerHeight,
                    this.pxPerDay, this.bodyHeight
                );
            }
            x += this.pxPerDay;
        }
    }

    _drawDailyHeaderText() {
        // Add first day of letter to top of column
        let x = 0.5;
        this._context.textAlign = "center";
        this._context.fillStyle = this.stylesText;
        
        for (const date of Date.days(
            this.startDate, this.finishDate
        )) {
            this._context.fillText(
                date.getDayLetter(),
                x + (this.pxPerDay / 2),
                (this.headerHeight * 0.75)
            );
            x += this.pxPerDay;
        }
    }

    _drawWeeklyHeaderText() {
        // Add Date of week start to the top of every week
        let x = 0.5;
        this._context.fillStyle = this.stylesText;
        this._context.textAlign = "left";
        
        for (const date of Date.days(
            this.startDate, this.finishDate
        )) {
            if ( date.getDay() == 1 ) {
                this._context.fillText(
                    `{date.getDate()} {date.getMonthShort()}`,
                    x, (this.headerHeight / 4)
                );
            }
            x += this.pxPerDay;
        }
    }

    _drawCanvasObjects() {
        for (const object of this._canvasObjects) {
            object.update();
        };
        
        const topLayer = this._getTopLayer();
        
        for (let layer = 0; layer <= topLayer; layer++) {
            for (const object of this._canvasObjects) {
                object.draw(layer);
            };
        }
    }

    _getTopLayer() {
        let topLayer = 0;
        for (const object of this._canvasObjects) {
            topLayer = Math.max(
                object.topLayer(),
                topLayer
            );
        };
        return topLayer;
    }
    
    _handleEvent(eventName, event) {
        for (const object of this._canvasObjects) {
            object.handleCanvasEvent(eventName, event);
        }
    }
};
// End of calendar widget
// ============================================================


// ======================================================================
// Class CanvasObject
// draws a rectangle on the canvas and binds mouse events for it.
// ======================================================================
qcode.Calendar.CanvasObject = class {
    color = 'lightblue'
    layer = 1
    left
    width
    top
    height

    _calendar
    get calendar() {return this._calendar}
    set calendar(newValue) {this._calendar = newValue}
    
    _hover = false
    _eventHandlers = {
        mouseEnter: [],
        mouseLeave: [],
        click: []    
    }
    
    constructor(calendar, options) {
        this.updateCanvasObject(options);
        this._calendar = calendar;
    }

    update(options) {
        this.updateCanvasObject(options)
    }
    
    updateCanvasObject(options) {
        if ( options === undefined ) {
            return
        }
        for (const fieldName of Object.keys(this)) {
            this[fieldName] = coalesce(options[fieldName], this[fieldName])
        }
    }
    
    draw(layer) {
        // Draw/redraw this object
        if ( layer === undefined || layer === this.layer ) {
            qcodeCanvas.context.fillStyle = this.color;
            qcodeCanvas.context.fillRect(
                this.left, this.top, this.width, this.height
            );
        }
    }
    
    topLayer() {
        return this.layer;
    }
    
    on(eventName, handler) {
        // Bind an event handler
        // to one of the mouse events provided by this class
        if ( ! Array.isArray(this._eventHandlers[eventName]) ) {
            throw `Event {eventName} not supported by canvas object`;
        }
        this._eventHandlers[eventName].push(handler);
        return this;
    }
    
    off(eventName, handler) {
        // Remove an event bound with on()
        this._eventHandlers.splice(
            this._eventHandlers[eventName].indexOf(handler), 1
        );
        return this;
    }
    
    remove(qcodeCanvas) {
        // Remove all event listeners and remove this from the calendar
        this.calendarCanvas.calendar('removeObject',this);
    }

    handleCanvasEvent(eventName, eventObject) {
        const handler = {
            'mousemove': this._canvasMouseMove,
            'mouseleave': this._canvasMouseLeave,
            'mouseclick': this._canvasMouseClick
        }[eventName];
        
        handler.call(this, eventObject);
    }
    
    _canvasMouseClick(event) {
        // Listens for clicks on the canvas
        if ( ! this._hover ) {
            return;
        }
        for (const handler of this._eventHandlers['click']) {
            handler.call(this, event);
        };
    }
    
    _canvasMouseMove(event) {
        // Listens to mousemove events on the canvas
        // in order to detect mouseenter/mouseleave events
        const point = this._eventPositionToCanvas([
            event.pageX, event.pageY
        ]);
        if ( this._overlaps(point) ) {
            if ( ! this._hover ) {
                this._mouseEnter(event);
            }
        } else {
            if ( this._hover ) {
                this._mouseLeave(event);
            }
        }
    }

    _canvasMouseLeave(event) {
        if ( this._hover ) {
            this._mouseLeave(event);
        }
    }

    _mouseEnter(event) {
        this._hover = true;
        for (const handler of this._eventHandlers['mouseEnter']) {
            handler.call(this, event);
        }
    }

    _mouseLeave(event) {
        this._hover = false;
        for (const handler of this._eventHandlers['mouseLeave']) {
            handler.call(this, event);
        }
    }
    
    _overlaps(point) {
        return (point[0] > this.left
                && point[0] < this.left + this.width
                && point[1] > this.top
                && point[1] < this.top + this.height);
    }

    _eventPositionToCanvas(position) {
        const offset = this.canvas.offset()
        return [
            event.pageX + this.canvas.scrollLeft() - offset.left,
            event.pageY + this.canvas.scrollTop() - offset.top
        ];
    }
};
// End of class CanvasObject
// ============================================================


// ============================================================
// DateHighlighter class
// Extends CanvasObject
// This object highlights a single date in a calendar.
// ============================================================
qcode.Calendar.DateHighlighter = class extends qcode.Calendar.CanvasObject {    
    date
    set date(newDate) {
        this.date = date
        this.calendar.draw();
    }
    
    color
    setColor(newColor) {
        this.color = newColor;
        this.calendar.draw();
    }
    
    update(options) {
        if ( options !== undefined ) {
            super.update(options)
        }
        this.date = options.date;
        this.color = options.color;
        if ( ! Date.isValid(this.date) ) {
            throw "Invalid Date";
        } 
        this.left = this.calendar.date2positionLeft(this.date);
        const right = this.calendar.date2positionRight(this.date);
        this.width = this.calendar.width - this.left - right;
        this.top = this.calendar.headerHeight;
        this.height = this.calendar.bodyHeight;
    }
};
// End of DateHighlighter class
// ============================================================


// ============================================================
// Bar class
// Extends CanvasObject
// A horizontal bar added to the calendar
// ============================================================
qcode.Calendar.Bar = class extends qcode.Calendar.CanvasObject {
    barHeight = 10
    layer = 2
    startDate
    finishDate
    
    update(options) {
        if ( options !== undefined ) {
            super.update(options)
        }
        this.left = this.calendar.date2positionLeft(this.startDate);
        const right = this.calendar.date2positionRight(this.finishDate);
        this.width = this.calendarCanvas.width - this.left - right;
    }
};
// End of Bar class
// ============================================================
