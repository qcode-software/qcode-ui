// calendar plugin. Call on a canvas to draw a calendar
;(function($, undefined) {
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
                $.error("Plugin qcode.calendar currently requires a canvas");
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

            // Canvas html width/height attributes function differently to css width/height
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
            $.each(this.canvasObjects, function(i, object) {
                object.draw();
            });
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
            var highlighter = new this.constructor.DateHighlighter(this, options);
            this.addObject(highlighter);
            return highlighter;
        },
        newBar: function(options) {
            // Create and return a horizontal bar attached to this calendar (see class defs. below)
            var bar = new this.constructor.Bar(this, options);
            this.addObject(bar);
            return bar;
        },
        addObject: function(canvasObject) {
            this.canvasObjects.push(canvasObject);
        },
        removeObject: function(canvasObject) {
            var index = this.canvasObjects.indexOf(canvasObject);
            this.canvasObjects.splice(index, 1);
        }
    });
    // End of calendar widget


    jQuery.qcode.calendar.CanvasObject = (function() {
        var CanvasObject = function(calendarWidget, options) {
            this.calendarWidget = calendarWidget;
            this.context = this.calendarWidget.context;
            this.options = $.extend({
                color: 'lightblue'
            }, options);
            this.left = this.options.left;
            this.width = this.options.width;
            this.top = this.options.top;
            this.height = this.options.height;
            this.hover = false;
            this._eventHandlers = {
                mouseenter: [],
                mouseleave: [],
                click: []
            };

            this._moveListener = this._moveListener.bind(this);
            this._leaveListener = this._leaveListener.bind(this);
            this._clickListener = this._clickListener.bind(this);

            this.calendarWidget.element.on('mousemove', this._moveListener);
        }
        $.extend(CanvasObject.prototype, {
            remove: function() {
                this.calendarWidget.element.off('mousemove', this._moveListener);
                this.calendarWidget.element.off('mousemove', this._leaveListener);
                this.calendarWidget.element.off('mousemove', this._clickListener);
                this.calendarWidget.removeObject(this);
            },
            draw: function() {
                var ctx = this.context;
                ctx.fillStyle = this.options.color;
                ctx.fillRect(this.left, this.top, this.width, this.height);
            },
            on: function(eventName, handler) {
                if ( ! Array.isArray(this._eventHandlers[eventName]) ) {
                    $.error('Event ' + eventName + ' not supported by canvas object');
                }
                this._eventHandlers[eventName].push(handler);
                return this;
            },
            off: function(eventName, handler) {
                var index = this._eventHandlers[eventName].indexOf(handler);
                this._eventHandlers.splice(index, 1);
                return this;
            },
            _moveListener: function(event) {
                var canvasObject = this;
                var canvas = this.calendarWidget.element;
                var offset = canvas.offset();
                if ( (event.pageX > offset.left + this.left - canvas.scrollLeft())
                     && (event.pageX < offset.left + this.left + this.width - canvas.scrollLeft())
                     && (event.pageY > offset.top + this.top - canvas.scrollTop())
                     && (event.pageY < offset.top + this.top + this.height - canvas.scrollTop()) ) {
                    if ( ! this.hover ) {
                        this.hover = true;
                        this.calendarWidget.element.on('click', this._clickListener);
                        $.each(this._eventHandlers['mouseenter'], function(i, handler) {
                            handler.call(canvasObject, event);
                        });
                        this.calendarWidget.element.one('mouseleave', this.leaveListener);
                    }
                } else {
                    if ( this.hover ) {
                        this.hover = false;
                        this.calendarWidget.element.off('click', this._clickListener);
                        $.each(this._eventHandlers['mouseleave'], function(i, handler) {
                            handler.call(canvasObject, event);
                        });
                        this.calendarWidget.element.off('mouseleave', this.leaveListener);
                    }
                }
            },
            _leaveListener: function(event) {
                var canvasObject = this;
                this.hover = false;
                this.calendarWidget.element.off('click', this._clickListener);
                $.each(this._eventHandlers['mouseleave'], function(i, handler) {
                    handler.call(canvasObject, event);
                });
            },
            _clickListener: function(event) {
                var canvasObject = this;
                $.each(this._eventHandlers['click'], function(i, handler) {
                    handler.call(canvasObject, event);
                });
            },
        });
        return CanvasObject;
    })();


    // DateHighlighter class
    // This object highlights a single date in a calendar.
    jQuery.qcode.calendar.DateHighlighter = (function() {
        var superProto = jQuery.qcode.calendar.CanvasObject.prototype;
        var DateHighlighter = function(calendarWidget, options) {
            superProto.constructor.call(this, calendarWidget, options);
            this.draw();
        }
        DateHighlighter.prototype = $.extend(Object.create(superProto), {
            constructor: DateHighlighter,
            setDate: function(newDate) {
                this.options.date = newDate;
                this.calendarWidget.draw();
            },
            setColor: function(newColor) {
                this.options.color = newColor;
                this.draw();
            },
            draw: function() {
                if ( ! Date.isValid(this.options.date) ) {
                    $.error("Invalid Date");
                }
                this.left = this.calendarWidget.date2positionLeft(this.options.date);
                this.right = this.calendarWidget.date2positionRight(this.options.date);
                this.width = this.calendarWidget.option('width') - this.left - this.right;
                this.top = this.calendarWidget.option('headerHeight');
                this.height = this.calendarWidget.option('bodyHeight');
                superProto.draw.call(this);
            }
        });
        return DateHighlighter;
    })();
    // End of DateHighlighter class


    // Bar class
    // A horizontal bar added to the calendar
    jQuery.qcode.calendar.Bar = (function() {
        var superProto = jQuery.qcode.calendar.CanvasObject.prototype;
        var Bar = function(calendarWidget, options) {
            superProto.constructor.call(this, calendarWidget, options);
            this.options = $.extend({
                startDate: undefined,
                finishDate: undefined,
                barHeight: 10,
                rowHeight: undefined,
                verticalPosition: undefined
            }, this.options);
        }
        Bar.prototype = $.extend(Object.create(superProto), {
            constructor: Bar,
            draw: function() {
                this.left = this.calendarWidget.date2positionLeft(this.options.startDate);
                this.right = this.calendarWidget.date2positionRight(this.options.finishDate);
                this.width = this.calendarWidget.option('width') - this.left - this.right;
                this.top = this.options.verticalPosition - (this.options.barHeight / 2);
                this.height = this.options.barHeight;

                superProto.draw.call(this);
            }
        });
        return Bar;
    })();
    // End of Bar class
})(jQuery);