// ======================================================================
// calendar widget plugin. Call on a <canvas> to draw a calendar
// ======================================================================
;var qcode = qcode || {};
qcode.Calendar = function(canvas, options) {
    "use strict";
    options = Object.assign({
        bodyHeight: 150,
        headerHeight: 40,
        startDate: undefined,
        finishDate: undefined,
        pxPerDay: 20,
        styles: {
            weekends: 'rgba(220,220,220,1)',
            lines: 'rgba(200,200,200,1)',
            text: 'rgba(100,100,100,1)'
        }
    }, options);
    if ( ! canvas.getContext ) {
        throw "Plugin qcode.calendar requires a canvas";
    }
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.canvasObjects = [];
    this.addObject(
        new qcode.Calendar.DateHighlighter({
            date: Date.today,
            color: 'rgba(160,200,240,1)'
        })
    );
    canvas.addEventListener('mousemove', this._mouseMove);
};
Object.assign(qcode.Calendar.prototype, {
    draw: function(draw_async) {
        draw_async = coalesce(draw_async, true);
        if ( draw_async ) {
            if ( this.drawTimeout === undefined ) {
                this.drawTimeout = window.setZeroTimeout(() => {
                    this._drawNow();
                    this.drawTimeout = undefined;
                });
            }
        } else {
            this._drawNow();
            window.clearZeroTimeout(this.drawTimeout);
            this.drawTimeout = undefined;
        }
    },
    _drawNow: function() {
        // draw (or redraw) the calendar
        if ( ! Date.isValid(this.options.startDate) ) {
            throw "Invalid start date for calendar";
        }
        if ( ! Date.isValid(this.options.finishDate) ) {
            throw "Invalid finish date for calendar";
        }

        // Recalculate width/height in case options have changed
        this.options.width = (
            Date.daysBetween(
                this.options.finishDate,
                this.options.startDate
            ) + 1
        ) * this.options.pxPerDay;

        // Use canvas html width/height attributes, NOT css width/height
        this.element.setAttribute('width', this.options.width);
        const height = this.options.bodyHeight + this.options.headerHeight;
        this.element.setAttribute('height', height);

        // Clear the canvas
        this.context.clearRect(
            0, 0,
            this.options.width, this.options.bodyHeight
        );

        // Offset path to account for line width,
        // and begin a path to draw all the grid lines
        let x = 0.5;
        this.context.beginPath();
        this.context.textBaseline = "middle";

        // Loop over all days from start date to finish date
        const date = new Date(this.options.startDate.getTime());
        while( date.getTime() <= this.options.finishDate.getTime() ) {

            // Header text
            this.context.fillStyle = this.options.styles.text;
            // Label start of week on mondays
            if ( date.getDay() == 1 ) {
                this.context.textAlign = "left";
                this.context.fillText(
                    `{date.getDate()} {date.getMonthShort()}`,
                    x, (options.headerHeight / 4)
                );
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.options.headerHeight);
            }
            this.context.textAlign = "center";
            this.context.fillText(
                date.getDayLetter(),
                x + (this.options.pxPerDay / 2),
                (3 * this.options.headerHeight / 4)
            );

            // Highlight weekends
            if ( date.getDay() == 0 || date.getDay() == 6 ) {
                this.context.fillStyle = this.options.styles.weekends;
                this.context.fillRect(
                    x, this.options.headerHeight,
                    this.options.pxPerDay, this.options.bodyHeight
                );
            }
            // Draw vertical lines at the end of each day
            this.context.moveTo(
                x + this.options.pxPerDay,
                this.options.headerHeight
            );
            this.context.lineTo(
                x + this.options.pxPerDay,
                this.options.bodyHeight + this.options.headerHeight
            );
            
            x += this.options.pxPerDay;
            date.incrDays(1);
        }

        // Actually draw all the lines
        this.context.strokeStyle = this.options.styles.lines;
        this.context.stroke();

        // Redraw bars and highlights
        let topLayer = 0;
        for (const object of this.canvasObjects) {
            topLayer = Math.max(
                object.topLayer(),
                topLayer
            );
            object.update();
        };
        for (let layer = 0; layer <= topLayer; layer++) {
            for (const object of this.canvasObjects) {
                object.draw(layer);
            };
        }
    },
    date2positionLeft: function(date) {
        // Return the px distance from the left edge of the calendar,
        // to the left edge of the given date
        return (
            Date.daysBetween(
                date,
                this.options.startDate
            ) * this.options.pxPerDay
        );
    },
    date2positionRight: function(date) {
        // Return the px distance from the right edge of the calendar,
        // to the right edge of the given date
        return (
            Date.daysBetween(
                this.options.finishDate,
                date
            ) * this.options.pxPerDay
        );
    },
    newDateHighlighter: function(options) {
        // Create and return a date highlighter attached to this calendar,
        // (see class defs. below)
        const highlighter = new qcode.Calendar.DateHighlighter(
            this.element, options
        );
        this.addObject(highlighter);
        return highlighter;
    },
    newBar: function(options) {
        // Create and return a horizontal bar attached to this calendar
        // (see class defs. below)
        var bar = new qcode.Calendar.Bar(this.element, options);
        this.addObject(bar);
        return bar;
    },
    addObject: function(canvasObject) {
        // Add a canvas object (such as a bar or date highlight)
        // to the calendar
        this.canvasObjects.push(canvasObject);
        this.draw();
    },
    removeObject: function(canvasObject) {
        // Remove a canvas object from the calendar
        const index = this.canvasObjects.indexOf(canvasObject);
        this.canvasObjects.splice(index, 1);
    },
    getContext: function() {
        // Returns the drawing context of the canvas
        return this.context;
    },
    _mouseMove: function(event) {
        for (const object of this.canvasObjects) {
            object._mouseMove(this, event);
        }
    }
});
// End of calendar widget
// ============================================================


// ======================================================================
// Class CanvasObject
// draws a rectangle on the canvas and binds mouse events for it.
// ======================================================================
qcode.Calendar.CanvasObject = function(options) {
    Object.assign(this.options, options);
    
    // True during mouse hover
    this.hover = false;

    // Initialise store for event handlers
    this._eventHandlers = {
        mouseenter: [],
        mouseleave: [],
        click: []
    };

    this.update(options);
}
Object.assign(qcode.Calendar.CanvasObject.prototype, {
    options: {
        color: 'lightblue',
        layer: 1
    },
    update: function(options) {
        this.left = options.left;
        this.width = options.width;
        this.top = options.top;
        this.height = options.height;
    },
    draw: function(qcodeCanvas, layer) {
        // Draw/redraw this object
        if ( layer === undefined || layer === this.options.layer ) {
            qcodeCanvas.context.fillStyle = this.options.color;
            qcodeCanvas.context.fillRect(
                this.left, this.top, this.width, this.height
            );
        }
    },
    topLayer: function() {
        return this.options.layer;
    },
    on: function(eventName, handler) {
        // Bind an event handler
        // to one of the mouse events provided by this class
        if ( ! Array.isArray(this._eventHandlers[eventName]) ) {
            throw `Event {eventName} not supported by canvas object`;
        }
        this._eventHandlers[eventName].push(handler);
        return this;
    },
    off: function(eventName, handler) {
        // Remove an event bound with on()
        this._eventHandlers.splice(
            this._eventHandlers[eventName].indexOf(handler), 1);
        return this;
    },
    remove: function(qcodeCanvas) {
        // Remove all event listeners and remove this from the calendar
        this.calendarCanvas.calendar('removeObject',this);
    },
    _mouseMove: function(qcodeCanvas, event) {
        // Listens to mousemove events on the canvas in order to detect mouseenter/mouseleave events
        var canvasObject = this;
        var canvas = this.calendarCanvas;
        var offset = canvas.offset();
        if ( (event.pageX > offset.left + this.left - canvas.scrollLeft())
             && (event.pageX < offset.left + this.left + this.width - canvas.scrollLeft())
             && (event.pageY > offset.top + this.top - canvas.scrollTop())
             && (event.pageY < offset.top + this.top + this.height - canvas.scrollTop()) ) {
            // Mouse is inside this object - if it wasn't already then fire mouseenter and begin listening for click events. Also listen for the mouse leaving the canvas entirely.
            if ( ! this.hover ) {
                this.hover = true;
                this.calendarCanvas.on('click', this._clickListener);
                $.each(this._eventHandlers['mouseenter'], function(i, handler) {
                    handler.call(canvasObject, event);
                });
                this.calendarCanvas.one('mouseleave', this.leaveListener);
            }
        } else {
            // Mouse is outside the object - if it wasn't already then fire mouseleave and stop listening for click
            if ( this.hover ) {
                this.hover = false;
                this.calendarCanvas.off('click', this._clickListener);
                $.each(this._eventHandlers['mouseleave'], function(i, handler) {
                    handler.call(canvasObject, event);
                });
                this.calendarCanvas.off('mouseleave', this.leaveListener);
            }
        }
    },
        _leaveListener: function(event) {
            // Listens for mouseleave fired on the canvas
            var canvasObject = this;
            this.hover = false;
            this.calendarCanvas.off('click', this._clickListener);
            $.each(this._eventHandlers['mouseleave'], function(i, handler) {
                handler.call(canvasObject, event);
            });
        },
        _clickListener: function(event) {
            // Listens for clicks on the canvas
            var canvasObject = this;
            $.each(this._eventHandlers['click'], function(i, handler) {
                handler.call(canvasObject, event);
            });
        },
    });
    return CanvasObject;
})();
// End of class CanvasObject
// ============================================================


// ============================================================
// DateHighlighter class
// Extends CanvasObject
// This object highlights a single date in a calendar.
// ============================================================
jQuery.qcode.calendar.DateHighlighter = (function() {
    var superProto = jQuery.qcode.calendar.CanvasObject.prototype;
    var DateHighlighter = function(calendarCanvas, options) {
        superProto.constructor.call(this, calendarCanvas, options);
    }
    DateHighlighter.prototype = $.extend(Object.create(superProto), {
        constructor: DateHighlighter,
        setDate: function(newDate) {
            this.options.date = newDate;
            this.calendarCanvas.calendar('draw');
        },
        setColor: function(newColor) {
            this.options.color = newColor;
            this.calendarCanvas.calendar('draw');
        },
        update: function(){
            if ( ! Date.isValid(this.options.date) ) {
                $.error("Invalid Date");
            } 
            this.left = this.calendarCanvas.calendar('date2positionLeft',this.options.date);
            this.right = this.calendarCanvas.calendar('date2positionRight',this.options.date);
            this.width = this.calendarCanvas.calendar('option', 'width') - this.left - this.right;
            this.top = this.calendarCanvas.calendar('option','headerHeight');
            this.height = this.calendarCanvas.calendar('option','bodyHeight');
        }
    });
    return DateHighlighter;
})();
// End of DateHighlighter class
// ============================================================


// ============================================================
// Bar class
// Extends CanvasObject
// A horizontal bar added to the calendar
// ============================================================
jQuery.qcode.calendar.Bar = (function() {
    var superProto = jQuery.qcode.calendar.CanvasObject.prototype;
    var Bar = function(calendarCanvas, options) {
        superProto.constructor.call(this, calendarCanvas, options);
    }
    Bar.prototype = $.extend(Object.create(superProto), {
        constructor: Bar,
        options: $.extend(Object.create(superProto.options), {
            startDate: undefined,
            finishDate: undefined,
            barHeight: 10,
            verticalPosition: undefined,
            layer: 2
        }),
        update: function() {
            this.left = this.calendarCanvas.calendar('date2positionLeft',this.options.startDate);
            this.right = this.calendarCanvas.calendar('date2positionRight',this.options.finishDate);
            this.width = this.calendarCanvas.calendar('option','width') - this.left - this.right;
            this.top = this.options.verticalPosition - (this.options.barHeight / 2);
            this.height = this.options.barHeight;
        }
    });
    return Bar;
})();
// End of Bar class
// ============================================================
})(jQuery, window);
