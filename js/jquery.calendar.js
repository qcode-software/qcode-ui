;(function($, undefined) {
    // ======================================================================
    // calendar widget plugin. Call on a <canvas> to draw a calendar
    // ======================================================================
    jQuery.widget('qcode.calendar', {
        options: {
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
        },
        _create: function() {
            var domCanvas = this.element[0];
            if ( ! domCanvas.getContext ) {
                $.error("Plugin qcode.calendar requires a canvas");
            }
            this.context = domCanvas.getContext('2d');
            this.canvasObjects = [];
            this.newDateHighlighter({
                date: Date.today,
                color: 'rgba(160,200,240,1)'
            });
        },
        draw: function() {
            // draw (or redraw) the calendar
            var ctx = this.context;
            var options = this.options;

            if ( ! Date.isValid(options.startDate) ) {
                $.error("Invalid start date for calendar");
            }
            if ( ! Date.isValid(options.finishDate) ) {
                $.error("Invalid finish date for calendar");
            }

            // Recalculate width/height in case options have changed
            options.width = (Date.daysBetween(options.finishDate, options.startDate) + 1) * options.pxPerDay;

            // Use canvas html width/height attributes, NOT css width/height
            this.element
                .attr('width', options.width)
                .attr('height', options.bodyHeight + options.headerHeight);

            // Clear the canvas
            ctx.clearRect(0, 0, options.width, options.bodyHeight);

            // Offset path to account for line width, and begin a path to draw all the grid lines
            var x = 0.5;
            ctx.beginPath();
            ctx.textBaseline = "middle";

            // Loop over all days from start date to finish date
            var date = new Date(options.startDate.getTime());
            while( date.getTime() <= options.finishDate.getTime() ) {

                // Header text
                ctx.fillStyle = options.styles.text;
                // Label start of week on mondays
                if ( date.getDay() == 1 ) {
                    ctx.textAlign = "left";
                    ctx.fillText(date.getDate() + " " + date.getMonthShort(), x, (options.headerHeight / 4));
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, options.headerHeight);
                }
                ctx.textAlign = "center";
                ctx.fillText(date.getDayLetter(), x + (options.pxPerDay / 2), (3 * options.headerHeight / 4));

                // Highlight weekends
                if ( date.getDay() == 0 || date.getDay() == 6 ) {
                    ctx.fillStyle = this.options.styles.weekends;
                    ctx.fillRect(x, options.headerHeight, options.pxPerDay, options.bodyHeight);
                }
                // Draw vertical lines at the end of each day
                ctx.moveTo(x + options.pxPerDay, options.headerHeight);
                ctx.lineTo(x + options.pxPerDay, options.bodyHeight + options.headerHeight);
                
                x += options.pxPerDay;
                date.incrDays(1);
            }

            // Actually draw all the lines
            ctx.strokeStyle = options.styles.lines;
            ctx.stroke();

            // Redraw bars and highlights
            var topLayer = 0;
            $.each(this.canvasObjects, function(i, object) {
                topLayer = Math.max(object.topLayer(), topLayer);
                object.update();
            });
            for (var layer = 0; layer <= topLayer; layer++) {
                $.each(this.canvasObjects, function(i, object) {
                    object.draw(layer);
                });
            }
        },
        date2positionLeft: function(date) {
            // Return the px distance from the left edge of the calendar to the left edge of the given date
            var left = Date.daysBetween(date, this.options.startDate) * this.options.pxPerDay;
            return left;
        },
        date2positionRight: function(date) {
            // Return the px distance from the right edge of the calendar to the right edge of the given date
            var right = Date.daysBetween(this.options.finishDate, date) * this.options.pxPerDay;
            return right;
        },
        newDateHighlighter: function(options) {
            // Create and return a date highlighter attached to this calendar (see class defs. below)
            var highlighter = new this.constructor.DateHighlighter(this.element, options);
            this.addObject(highlighter);
            return highlighter;
        },
        newBar: function(options) {
            // Create and return a horizontal bar attached to this calendar (see class defs. below)
            var bar = new this.constructor.Bar(this.element, options);
            this.addObject(bar);
            return bar;
        },
        addObject: function(canvasObject) {
            // Add a canvas object (such as a bar or date highlight) to the calendar
            this.canvasObjects.push(canvasObject);
            this.draw();
        },
        removeObject: function(canvasObject) {
            // Remove a canvas object from the calendar
            var index = this.canvasObjects.indexOf(canvasObject);
            this.canvasObjects.splice(index, 1);
        },
        getContext: function() {
            // Returns the drawing context of the canvas
            return this.context;
        }
    });
    // End of calendar widget
    // ============================================================


    // ======================================================================
    // Class CanvasObject
    // draws a rectangle on the canvas and binds mouse events for it.
    // ======================================================================
    jQuery.qcode.calendar.CanvasObject = (function() {
        var CanvasObject = function(calendarCanvas, options) {
            // calendarCanvas should be a jQuery object holding the canvas
            this.calendarCanvas = calendarCanvas;
            this.context = this.calendarCanvas.calendar('getContext');

            // Initialise options
            this.options = $.extend(Object.create(this.options), options);

            // True during mouse hover
            this.hover = false;

            // Initialise store for event handlers
            this._eventHandlers = {
                mouseenter: [],
                mouseleave: [],
                click: []
            };

            // Listeners need to be passed in to jquery's on and off methods, so need to be bound to this instance
            this._moveListener = this._moveListener.bind(this);
            this._leaveListener = this._leaveListener.bind(this);
            this._clickListener = this._clickListener.bind(this);

            this.calendarCanvas.on('mousemove', this._moveListener);
        }
        $.extend(CanvasObject.prototype, {
            options: {
                color: 'lightblue',
                layer: 1
            },
            update: function() {
                this.left = this.options.left;
                this.width = this.options.width;
                this.top = this.options.top;
                this.height = this.options.height;
            },
            draw: function(layer) {
                // Draw/redraw this object
                if ( layer === undefined || layer === this.options.layer ) {
                    var ctx = this.context;
                    ctx.fillStyle = this.options.color;
                    ctx.fillRect(this.left, this.top, this.width, this.height);
                }
            },
            topLayer: function() {
                return this.options.layer;
            },
            on: function(eventName, handler) {
                // Bind an event handler to one of the mouse events provided by this class
                if ( ! Array.isArray(this._eventHandlers[eventName]) ) {
                    $.error('Event ' + eventName + ' not supported by canvas object');
                }
                this._eventHandlers[eventName].push(handler);
                return this;
            },
            off: function(eventName, handler) {
                // Remove an event bound with on()
                var index = this._eventHandlers[eventName].indexOf(handler);
                this._eventHandlers.splice(index, 1);
                return this;
            },
            remove: function() {
                // Remove all event listeners and remove this from the calendar
                this.calendarCanvas.off('mousemove', this._moveListener);
                this.calendarCanvas.off('mousemove', this._leaveListener);
                this.calendarCanvas.off('mousemove', this._clickListener);
                this.calendarCanvas.calendar('removeObject',this);
            },
            _moveListener: function(event) {
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
})(jQuery);