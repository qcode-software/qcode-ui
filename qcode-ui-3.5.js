/*
 * This file contains the concatented JavaScript Libary for Qcode Software Limited.
 *
 * https://svn.qcode.co.uk/js/trunk
 * https://trac.qcode.co.uk/js
 *
 * Copyright (c) 2004-2012, Qcode Software Limited <hackers@qcode.co.uk> 
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   - Neither the name of Qcode Software Limited nor the names of its contributors may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* ==== 0.jquery-hacks.js ==== */
// Bug fix for table border width detection in ie9
(function($){
    if ( $.browser.msie && parseInt($.browser.version, 10) == "9" ) {
        var oldCssFunction = $.fn.css;
        $.fn.css = function() {
            if ( this.first().is('table') && arguments.length == 1 ) {
		var table = this.first();
                switch(arguments[0]){
                case "border-left-width":
		case "borderLeftWidth":
                    var totalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    this.css('border-left-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-left-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-right-width":
		case "borderRightWidth":
                    var totalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    this.css('border-right-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetWidth) - getInnerWidth(table);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-right-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-top-width":
		case "borderTopWidth":
                    var totalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    this.css('border-top-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-top-width', borderWidth);
                    return borderWidth + "px";
                    
                case "border-bottom-width":
		case "borderBottomWidth":
                    var totalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    this.css('border-bottom-width', 0);
                    var newTotalBorderWidth = parseInt(this[0].offsetHeight) - getInnerHeight(this);
                    var borderWidth = totalBorderWidth - newTotalBorderWidth;
                    this.css('border-bottom-width', borderWidth);
                    return borderWidth + "px";
                    
                default:
                    return oldCssFunction.apply(this,arguments);
                }
            } else {
                return oldCssFunction.apply(this,arguments);
            }
        };
    }
    function getInnerWidth(table) {
        var borderSpacing = table.css('border-spacing');
        var horizontalSpacing = borderSpacing.split(' ').shift();
        return parseInt(table.find('tbody').outerWidth()) + (parseInt(horizontalSpacing) * 2);
    }
    function getInnerHeight(table) {
        var borderSpacing = table.css('border-spacing');
        var verticalSpacing = parseInt(borderSpacing.split(' ').pop());
        var totalHeight = verticalSpacing;
        table.find('thead, tbody, tfoot').each(function(){
            if ( $(this).css('position') != "absolute" ) {
                totalHeight += parseInt($(this).outerHeight()) + verticalSpacing;
            }
        });
        return totalHeight;
    }

    jQuery.expr[":"].focus = function( elem ) {
	var doc = elem.ownerDocument;
	return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex || elem.isContentEditable);
    }
})(jQuery);

/* ==== 0.jquery-ui-hacks.js ==== */
;(function($) {
    if ( $.isFunction($.widget) ) {
	var slice = Array.prototype.slice;

	$.widget.bridge = function( name, object ) {
	    var fullName = object.prototype.widgetFullName || name;
	    $.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
		args = slice.call( arguments, 1 ),
		returnValue = this;
		
		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
		    $.widget.extend.apply( null, [ options ].concat(args) ) :
		    options;

		if ( isMethodCall ) {
		    this.each(function() {
			var methodValue,
			instance = $.data( this, fullName );
			if ( !instance ) {
			    $.data( this, fullName, new object( undefined, this ) );
			    instance = $.data( this, fullName );
			}
			if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
			    return $.error( "no such method '" + options + "' for " + name + " widget instance" );
			}
			methodValue = instance[ options ].apply( instance, args );
			if ( methodValue !== instance && methodValue !== undefined ) {
			    returnValue = methodValue && methodValue.jquery ?
				returnValue.pushStack( methodValue.get() ) :
				methodValue;
			    return false;
			}
		    });
		} else {
		    this.each(function() {
			var instance = $.data( this, fullName );
			if ( instance ) {
			    instance.option( options || {} )._init();
			} else {
			    $.data( this, fullName, new object( options, this ) );
			}
		    });
		}

		return returnValue;
	    };
	}
    }
}) (jQuery);


/* ==== 0.js-hacks.js ==== */
// Support for Function.prototype.bound in earlier browsers - taken from developer.mozilla.org
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
	if (typeof this !== "function") {
	    // closest thing possible to the ECMAScript 5 internal IsCallable function
	    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	}
	
	var aArgs = Array.prototype.slice.call(arguments, 1), 
	fToBind = this, 
	fNOP = function () {},
	fBound = function () {
	    // If the bound function is called with the "new" keyword, the scope will be the new object instead of oThis
	    return fToBind.apply(this instanceof fNOP && oThis
				 ? this
				 : oThis,
				 aArgs.concat(Array.prototype.slice.call(arguments)));
	};
	
	// The bound function prototype inherits from the original function prototype
	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();
	
	return fBound;
    };
}

// Support for Object.create in earlier browsers
if (!Object.create) {
    Object.create = function (p, o) {
        function F() {}
        F.prototype = p;
        var object = new F();
        if (arguments.length > 1) {
            console.warn('Object.create implementation incomplete');
            jQuery.extend(object, o);
        }
        return object;
    };
}

if (typeof console == "undefined") {
    console = {
        log: function() {},
        warn: function() {},
        info: function() {}
    }
}
if (typeof console.time == "undefined" ) {
    console.time = function() {};
    console.timeEnd = function() {};
}

/* ==== date.js ==== */
// Extensions for the javascript Date function
;(function() {
    // ==============================
    // Constants
    // ==============================
    var millisecondsPerMinute = 1000 * 60;
    var millisecondsPerDay =  millisecondsPerMinute * 60 * 24;
    var dayLetter = ["S", "M", "T", "W", "T", "F", "S"];
    var monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // ==============================
    // Methods
    // ==============================
    Date.prototype.incrDays = function(days) {
        // Move this date forward by a number of days. Accepts negative and non-integer values.
        var oldOffset = this.getTimezoneOffset();
        this.setTime(this.getTime() + (days * millisecondsPerDay));
        var newOffset = this.getTimezoneOffset();
        if ( oldOffset != newOffset ) {
            this.setTime(this.getTime() - (oldOffset - newOffset) * millisecondsPerMinute);
        }
    }
    Date.prototype.getWeekStart = function(base) {
        // Get a new date object representing the first day of this date's week.
        // Optional: base - the day to start the week on. 0 = Sunday, 1 = Monday, etc.
        base = coalesce(base, 1);
        var days_to_subtract = this.getDay() - base;
        if (days_to_subtract < 0) {
            days_to_subtract += 7;
        }
        var oldOffset = this.getTimezoneOffset();
        var newDate =  new Date(this.getTime() - (days_to_subtract * millisecondsPerDay));
        var newOffset = newDate.getTimezoneOffset();
        if ( oldOffset != newOffset ) {
            newDate.setTime(newDate.getTime() - (oldOffset - newOffset) * millisecondsPerMinute);
        }
        return newDate;
    }
    Date.prototype.getWeekEnd = function(base) {
        // Get a new date object representing the last day of this date's week.
        // Optional: base - the day to start the week on. 0 = Sunday, 1 = Monday, etc.
        base = coalesce(base, 1);
        var days_to_add = base + 6 - this.getDay();
        if (days_to_add > 6) {
            days_to_add -= 7;
        }
        var oldOffset = this.getTimezoneOffset();
        var newDate =  new Date(this.getTime() + (days_to_add * millisecondsPerDay));
        var newOffset = newDate.getTimezoneOffset();
        if ( oldOffset != newOffset ) {
            newDate.setTime(newDate.getTime() - (oldOffset - newOffset) * millisecondsPerMinute);
        }
        return newDate;
    }
    Date.prototype.getDayLetter = function() {
        // Get the first letter of this date's day of week name
        return dayLetter[this.getDay()];
    }
    Date.prototype.getMonthShort = function() {
        // Get the short name of this date's month
        return monthShort[this.getMonth()];
    }

    // ==============================
    // Static functions
    // ==============================
    Date.min = function() {
        // Returns a the earliest from the dates passed in - takes any number of arguments
        var min = Infinity;
        for(var i = arguments.length; i > 0; i--) {
            min = Math.min(min, arguments[i - 1].getTime());
        }
        return new Date(min);
    }
    Date.max = function() {
        // Returns a the latest from the dates passed in - takes any number of arguments
        var max = -Infinity;
        for(var i = arguments.length; i > 0; i--) {
            max = Math.max(max, arguments[i - 1].getTime());
        }
        return new Date(max);
    }
    Date.daysBetween = function(date1, date2) {
        // Returns the number of days between date1 and date2 (negative if date1 is earlier than date2)
        var milliseconds = date1.getTime() - date2.getTime();
        return Math.round(milliseconds / millisecondsPerDay);
    }
    Date.isValid = function(date) {
        // Returns true if passed a valid date object. Returns false if the argument is not a valid date object
        return (date instanceof Date) && ( ! isNaN(date.getTime()) );
    }

    // ==============================
    // Static properties
    // ==============================
    var now = new Date();
    // A date representing mindnight (00:00:00) today
    Date.today = new Date(now.getFullYear(),now.getMonth(),now.getDate());
})();

/* ==== dbHeader.js ==== */
function dbHeader(oTable) {
  // Resize table columns

  // vars
  var inZone = false;
  var inResize = false;
  var savedWidth;
  var savedX;
  var tolerance = 10;
  var minWidth = 10;
  var oTH;
  var oTHfixed;

  oTheadFixed=oTable.theadFixed;
  oTheadFixed.attachEvent('onmousedown',OnMouseDown);
  oTheadFixed.attachEvent('onmousemove',OnMouseMove);
  oTheadFixed.attachEvent('onmouseup',OnMouseUp);
  
  
  function OnMouseDown () {
    var srcElement = event.srcElement;	
    if ( inZone && event.button == 1) {
      oTheadFixed.setCapture();
      savedX = event.screenX;
      savedWidth = oTHfixed.clientWidth;
      inResize = true;
    }
  }
  
  function OnMouseMove () {
    if ( inResize && event.button == 1  ) {	
      // Drag
      var width = savedWidth + event.screenX - savedX;
      if ( width > minWidth ) {
	//
      }
    } else {
      // Mouse over
      srcElement = event.srcElement;
      if ( srcElement.forTH && srcElement.offsetWidth - event.offsetX < tolerance) {
	// This cell left of right boundery
	inZone = true;
	oTHfixed=srcElement;
	oTH=oTHfixed.forTH;
	oTheadFixed.runtimeStyle.cursor='col-resize';
      } else if ( event.offsetX < tolerance && srcElement.forTH && srcElement.forTH.cellIndex>0 ) {
	// This cell right of left boundery
	inZone = true;
	oTHfixed=oTheadFixed.children[srcElement.forTH.cellIndex-1];
	oTH=oTHfixed.forTH;
	oTheadFixed.runtimeStyle.cursor='col-resize';
      } else {
	inZone = false;
	oTheadFixed.runtimeStyle.cursor='auto';
      }
    }
  }
  
  function OnMouseUp () {
    if ( inResize ) {
      var width = savedWidth + event.screenX - savedX;
      if ( width > minWidth ) {
	oTable.resize(oTH.cellIndex,width);
      }
      inResize=false;
      oTheadFixed.releaseCapture();
    }
  }
  //
}


/* ==== dynamicResize.js ==== */
function dynamicResize(oContainer) {
    // Dynamically resize container when window is resized.
    window.attachEvent('onresize',resize);
    resize();
    function resize() {
	var window_height = jQuery(window).height();
	var container_height = jQuery(oContainer).height();
	var container_position_bottom = jQuery(oContainer).position().top +  container_height;
	var new_height;
	var position_bottom;
	var content_height = 0;

	// Determine height of all content.
	jQuery("body").children().each(function() {
	    position_bottom = jQuery(this).position().top + jQuery(this).height();
	    if (position_bottom > content_height) {
		content_height = position_bottom;
	    }	
	});

	if (content_height < window_height) {
	    // All content is visible within the window.
	    // Increase container_height so that overall content_height = window_height
	    jQuery(oContainer).height(container_height + (window_height - content_height));
	} else if (content_height > window_height) {
	    // Content is only partially visible within window.
	    // Try to decrease container_height (minimum height = 300) so that all content 
	    // is visible within the window.

	    new_height = container_height - (content_height - window_height);
	    if (new_height > 300) {
		// Decrease container height as long as it's new_height is greater than 300. 
		jQuery(oContainer).height(new_height);
	    } else {
		// It is not possible to display all content within the window, unless we reduce the 
		// container height below the minimum.
		// Instead ensure that the container is completely visible within the window.
		if (container_position_bottom > window_height) {
		    new_height = window_height - 40;
		    jQuery(oContainer).height(new_height);
		}
	    }
	}
    }
}

/* ==== jquery.actionConfirm.js ==== */
// actionConfirm plugin
// Call on <a>, generates a modal dialog asking the user to confirm when the user tries to use the link.
;(function($, undefined) {
    $.fn.actionConfirm = function() {
        this.on('click', function(event) {
	    var link = $(this);
	    if ( ( ! link.is('.disabled')) && link.attr('href') ) {
	        var url = link.attr('href');
                var text = 'Are you sure you want to ' + coalesce(link.attr('title'), link.text()) + '?';
	        $('<div>')
		    .text(text)
		    .dialog({
		        title: link.text(),
		        buttons: {
			    Yes: function(){
			        window.location = url;
			    },
			    No: function() {
			        $(this).dialog('close').dialog('destroy').remove();
			    }
		        },
		        modal: true,
		        width: 400,
		        height: 200
		    });
	        event.preventDefault();
	    }
        });
    }
})(jQuery);

/* ==== jquery.calendar.js ==== */
;(function($, window, undefined) {
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
            this.drawTimeout = undefined;
        },
        draw: function(async) {
            var async = coalesce(async, true);
            var calendar = this;
            if ( async ) {
                if ( this.drawTimeout === undefined ) {
                    this.drawTimeout = window.setZeroTimeout(function() {
                        calendar._drawNow();
                        calendar.drawTimeout = undefined;
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
})(jQuery, window);

/* ==== jquery.colInherit.js ==== */
// colInherit plugin
// Call on tables to copy classes and inline styles from column elements onto cell elements
// Does not overwrite existing cell inline styles.
// Optionally takes an array of custom attribute names to also be copied.
;(function($, undefined) {
    $.fn.colInherit = function(options) {
	var settings = jQuery.extend({
	    customAttributes: []
	}, options);

        var css = {};
	$(this).filter('table').each(function(){
	    var table = $(this);
            var id = table.getID();

	    table.children('colgroup').andSelf().children('col').each(function() {
		var col = $(this);

		var colIndex = col.index();
		var tds = table.children('thead, tbody, tfoot').andSelf().children('tr').children('td, th').filter(':nth-child(' + (colIndex + 1) + ')');

		// apply col classes to td and th elements
		if (col.attr('class')) {
		    tds.addClass(col.attr('class'));
		}

		// apply col styles to td and th elements
		if (col.attr('style')) {
                    var style = col.attr('style');
                    var selector = '#'+id+'>tr>*:nth-child('+(colIndex+1)+'),' +
                        '#'+id+'>*>tr>*:nth-child('+(colIndex+1)+')';
                    css[selector] = {};

                    style.split(';').forEach(function(declaration) {
                        var property = jQuery.trim(declaration.split(':')[0]);
                        var value = jQuery.trim(declaration.split(':')[1]);
                        if ( ! (property === "display" && value === "table-column") ) {
                            css[selector][property] = value;
                        }
                    });
		}
		
                // apply custom attributes from cols to td and th elements
		settings.customAttributes.forEach(function(name) {
		    if ( col.attr(name) ) {
			tds.each(function() {
			    var td = $(this);
			    if ( ! td.attr(name) ) {
				td.attr(name, col.attr(name));
			    }
			});
		    }
		});
	    });
	});
        qcode.style(css);
	return this;
    }
})(jQuery);

/* ==== jquery.columnResize.js ==== */
// Column Resize plugin
// Uses jQuery UI resizable, but resizes the entire column
// If the content does not fit the column, use behaviour defined by overflow options:
// - normal: do nothing, let the underlying css/UA handle it. Usually means the column just won't shrink any further.
// - shrink: reduce the font size (down to min-font-size) until the content fits. Supports only a single font size for the column.
// - shrink-one-line (default): as shrink, but force no wrapping
// - break-word: force word break to try and make the content fit.
;(function($, undefined) {
    $.fn.columnResize = function(options) {
        var options = $.extend({
            overflow: "shrink-one-line",
            'min-font-size': 1
        }, options);

        this.find('th').each(function() {
            var th = $(this);
            var index = th.index();
            var id = th.closest('table').getID();

            qcode.style('#'+id+' col:nth-child('+(index+1)+')', 'width', th.innerWidth() + "px");

            switch ( options.overflow ) {
            case 'shrink-one-line':
                qcode.style('#'+id+' tr>*:nth-child('+(index+1)+')', 'white-space', "nowrap");

            case 'shrink':
                th.data('original-font-size', parseInt(th.css('font-size')));
                break;

            case 'normal':
            case 'break-word':
                break;

            default:
                $.error('Unrecognised value for options.overflow - supported options are "shrink", "shrink-one-line", "normal", "break-word"');
                break;
            }

            th.resizable({
                handles: "e",
                resize: onResize
            });
        });

        function onResize(e, ui) {
            var th = $(this);
            th.css('width', '');

            var index = th.index();
            var table = th.closest('table');
            var id = table.getID();
            var col = table.find('col').filter(':nth-child('+(index+1)+')');
            var cells = table.find('td').filter(':nth-child('+(index+1)+')');
            var colSelector = '#'+id+' col:nth-child('+(index+1)+'), #'+id+' tr>*:nth-child('+(index+1)+')';

            switch ( options.overflow ) {
            case 'break-word':
                qcode.style(colSelector, 'word-break', "normal");
                qcode.style(colSelector, 'width', ui.size.width + "px");
                if ( th.width() > ui.size.width ) {
                    qcode.style(colSelector, 'word-break', 'break-all');
                }
                break;

            case 'shrink-one-line':
            case 'shrink':
                qcode.style(colSelector, 'width', ui.size.width + "px");

                var fontSize = th.data('original-font-size');
                qcode.style(colSelector, 'font-size', fontSize + 'px');

                var width = th.width();
                var lastChangeFontSize = fontSize;
                while ( width > ui.size.width ) {
                    fontSize--;
                    if (fontSize < options['min-font-size']) {
                        break;
                    }
                    qcode.style(colSelector, 'font-size', fontSize + 'px');
                    if ( th.width() < width ) {
                        lastChangeFontSize = fontSize;
                    }
                    width = th.width();
                }
                qcode.style(colSelector, 'font-size', lastChangeFontSize + 'px');
                break;

            default:
                qcode.style(colSelector, 'width', ui.size.width + "px");
                break;
            }
            event.stopPropagation();
            table.trigger('resize');
        }
        return this;
    }
})(jQuery);

/* ==== jquery.columnsShowHide.js ==== */
// Show and/or hide selected columns of tables
// showHide is an optional string "show" or "hide", if undefined selected columns will toggle visibility
;(function($, undefined) {
    $.fn.columnsShowHide = function(column_selector, showHide) {
        $(this).each(function() {
	    var table = jQuery(this);
            var id = table.getID();
            var css = {}

            table.find(column_selector).each(function() {
                var column = jQuery(this);
                var index = column.index();
                var nth = ':nth-child(' + (index+1) + ')';
                if ( (showHide === "hide") || (showHide === undefined && column.css('display') === "table-column") ) {
                    css['#'+id+' col' + nth] = {display: "none"};
                    css['#'+id+' tr>*' + nth] = {display: "none"};
                } else {
                    css['#'+id+' col' + nth] = {display: "table-column"};
                    css['#'+id+' tr>*' + nth] = {display: "table-cell"};
                }
            });

            qcode.style(css);
            table.trigger('resize');
        });
    };
})(jQuery);

/* ==== jquery.columnsShowHideControl.js ==== */
// Initialise column show/hide control
;(function($, undefined) {
    $.fn.columnsShowHideControl = function() {
        // ----------------------------------------
        // Show/hide columns when the user toggles the buttons
        // ----------------------------------------
        $(this).on('click',function(e) {
            var checkbox = $(e.delegateTarget).children(':checkbox');
            if ( ! ($(e.target).is(checkbox) || $(e.target).is('label')) ) {
                // checkbox was not the event target, toggle checkbox state
                e.preventDefault();           
                checkbox.prop('checked', !checkbox.prop('checked'));
                checkbox.change();
            }
        });
        $(this).on('change',':checkbox',function(e) {           
            var checkbox = $(this);
            var sticky = checkbox.attr('sticky');
            var stickyURL = checkbox.attr('sticky_url');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            if ( checkbox.is(':checked') ) {
                // Show columns
                $(this).parent().addClass('checked');
                $(tableSelector).columnsShowHide(colSelector,'show');
            } else {
                // Hide columns
                $(this).parent().removeClass('checked');
                $(tableSelector).columnsShowHide(colSelector,'hide');
            }

            if ( parseBoolean(sticky) ) {
                // Update Sticky to remember user preference            
                var data = {}
                data[checkbox.attr('name')] = checkbox.is(':checked');
                if ( stickyURL) {
                    data['sticky_url'] = stickyURL;
                }
                $.post('sticky_save.html', data);
            }
        });
                
        // ----------------------------------------
        // Highlight columns when the user hovers over a button
        // ----------------------------------------
        $(this).on('mouseenter', function(e) {
            var checkbox = $(e.delegateTarget).children(':checkbox');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            $(this).addClass('hover');
            $(tableSelector).find(colSelector).addClass('highlight');
            $(tableSelector).runDetached();
        });
        $(this).on('mouseleave', function(e) {
            var checkbox = $(e.delegateTarget).children(':checkbox');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            $(this).removeClass('hover');
            $(tableSelector).find(colSelector).removeClass('highlight');
            $(tableSelector).runDetached();
        });

        // Show/Hide columns on document ready
        $(this).each(function() {
            var checkbox = $(this).children(':checkbox');
            var colSelector = checkbox.attr('col_selector');
            var tableSelector = checkbox.attr('table_selector');

            if ( $(tableSelector).has(this).length > 0 ) {
                $.error('Columns show/hide control targetting its own ancestor is not supported');
            }

            if ( checkbox.is(':checked') ) {
                // Show columns
                $(this).addClass('checked');
                $(tableSelector).columnsShowHide(colSelector,'show');
            } else {
                // Hide columns
                $(this).removeClass('checked');
                $(tableSelector).columnsShowHide(colSelector,'hide');
            }
        });
    };
})(jQuery);

/* ==== jquery.compass.js ==== */
;(function($, window, document, undefined) {
    $.fn.northOf = function(selection) {
        // Returns the element above the target, or an empty set if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementTop = fromElement.offset().top;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementTop = element.offset().top;
            if (sameColumn(fromElement, element) && elementTop < fromElementTop && (nextElement === undefined || elementTop > nextElementTop)) {
                nextElement = element;
                nextElementTop = elementTop;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementTop = element.offset().top;
                if (leftOfColumn(fromElement, element) && (nextElement === undefined || rightOfColumn(nextElement, element) || (sameColumn(element, nextElement) && elementTop > nextElementTop))) {
                    nextElement = element;
                    nextElementTop = elementTop;
                };
            });
        }
        return $(nextElement);
    }
    $.fn.eastOf = function(selection) {
        // Returns the element right of the target, or an empty set if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementLeft = fromElement.offset().left;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementLeft = element.offset().left;
            if (sameRow(element, fromElement) && elementLeft > fromElementLeft && (nextElement === undefined || elementLeft < nextElementLeft)) {
                nextElement = element;
                nextElementLeft = elementLeft;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementLeft = $(element).offset().left;
                if (belowRow(fromElement, element) && (nextElement === undefined || aboveRow(nextElement, element) || (sameRow(element, nextElement) && elementLeft < nextElementLeft))) {
                    nextElement = element;
                    nextElementLeft = elementLeft;
                }
            });
        }
        return $(nextElement);
    }
    $.fn.southOf = function(selection) {
        // Returns the element below the target, or an empty set if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementTop = fromElement.offset().top;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementTop = element.offset().top;
            if (sameColumn(fromElement, element) && elementTop > fromElementTop && (nextElement === undefined || elementTop < nextElementTop)) {
                nextElement = element;
                nextElementTop = elementTop;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementTop = element.offset().top;
                if (rightOfColumn(fromElement, element) && (nextElement === undefined || leftOfColumn(nextElement, element) || (sameColumn(element, nextElement) && elementTop < nextElementTop))) {
                    nextElement = element;
                    nextElementTop = elementTop;
                }
            });
        }
        return $(nextElement);
    }
    $.fn.westOf = function(selection) {
        // Returns the element left of the target, or an empty set if none exists
	var fromElement = $(this);
        var nextElement;
        var fromElementLeft = fromElement.offset().left;
        var elements = $(selection).filter(':visible').not(fromElement);
        elements.each(function() {
            var element = $(this);
            var elementLeft = element.offset().left;
            if (sameRow(element, fromElement) && elementLeft < fromElementLeft && (nextElement === undefined || elementLeft > nextElementLeft)) {
                nextElement = element;
                nextElementLeft = elementLeft;
            }
        });
        if (nextElement === undefined) {
            elements.each(function() {
                var element = $(this);
                var elementLeft = $(element).offset().left;
                if (aboveRow(fromElement, element) && (nextElement === undefined || belowRow(nextElement, element) || (sameRow(element, nextElement) && elementLeft > nextElementLeft))) {
                    nextElement = element;
                    nextElementLeft = elementLeft;
                }
            });
        }
        return $(nextElement);
    }

    function sameRow(a, b) {
        // Takes two elements and returns true if they are on the same row
        return (a.offset().top <= (b.offset().top + b.outerHeight())) && ((a.offset().top + a.outerHeight()) >= b.offset().top);
    }

    function belowRow(a, b) {
        // Takes two elements and returns true if "b" is on a row below "a"
        return b.offset().top > (a.offset().top + a.outerHeight());
    }

    function aboveRow(a, b) {
        // Takes two elements and returns true if "b" is on a row above "a"
        return (b.offset().top + b.outerHeight()) < a.offset().top;
    }

    function sameColumn(a, b) {
        // Takes two elements and returns true if they are in the same column
        return (a.offset().left <= (b.offset().left + b.outerWidth())) && ((a.offset().left + a.outerWidth()) >= b.offset().left);
    }

    function leftOfColumn(a, b) {
        // Takes two elements and returns true if "b" is in a column left of "a"
        return (b.offset().left + b.outerWidth()) < a.offset().left;
    }

    function rightOfColumn(a, b) {
        // Takes two elements and returns true if "b" is in a column right of "a"
        return (a.offset().left + a.outerWidth()) < b.offset().left;
    }
})(jQuery, window, document);

/* ==== jquery.cycleClasses.js ==== */
// cycleClasses plugin. Takes an array of classes as an argument, expects the target to be a single element with one of those classes, and replaces class with the next one in the array, looping back to the beginning when the end is reached.
(function($){
    $.fn.cycleClasses = function(classes) {
	var nextClass = classes[0];
	for(var i = classes.length - 1; i >= 0; i--) {
	    thisClass = classes[i];
	    if ( this.hasClass(thisClass) ) {
		this.removeClass(thisClass);
		this.addClass(nextClass);
		return this;
	    } else {
		nextClass = thisClass;
	    }
	}
	this.addClass(nextClass);
	return this;
    }
})(jQuery);

/* ==== jquery.cycleText.js ==== */
// cycleText plugin. Takes an array of strings, expects the target to be a single element with text equal to one of those strings, and replaces the text on that element with the next string in the array, looping back to the beginning when the end is reached.
(function($){
    $.fn.cycleText = function(labels) {
	var nextLabel = labels[0];
	for(var i = labels.length - 1; i >= 0; i--) {
	    thisLabel = labels[i];
	    if ( this.text() === thisLabel ) {
		this.text(nextLabel);
		return this;
	    } else {
		nextLabel = thisLabel;
	    }
	}
	this.text(nextLabel);
	return this;
    }
})(jQuery);

/* ==== jquery.dbCell.js ==== */
// ============================================================
// dbCell plugin - a single table gell in a database grid
// ============================================================
;(function($, window, document, undefined){
    $.widget("qcode.dbCell", {
        options: {
            deleteKey: 'delete',
            type: "text",
            tab_on_return: true
        },
	_create: function(){
	    this.keyUpTimer;
            this.options.type = coalesce(this.getCol().attr('type'), this.options.type);
            if ( this.getCol().attr('tab_on_return') === "false" ) {
                this.options.tab_on_return = false;
            }
	},
	getRow: function(){
	    return this.element.closest('tr');
	},
	getGrid: function(){
	    return this.element.closest('table');
	},
	getCol: function(){
	    return this.getGrid().children('colgroup').children().eq(this.element.index());
	},
	getType: function(){
	    return this.options.type;
	},
	getEditorPluginName: function(){
	    switch ( this.getType() ) {
	    case 'bool': return "dbEditorBool"
	    case 'combo': return "dbEditorCombo"
	    case 'htmlarea': return "dbEditorHTMLArea"
	    case 'text': return "dbEditorText"
	    case 'textarea': return "dbEditorTextArea"
	    default:
		$.error('Unknown editor for cell type : ' + this.getType());
		return;
	    }
	},
	editor: function() {
	    var grid = this.getGrid();
	    var editorDiv = grid.dbGrid('getEditorDiv');
	    var editorPluginName = this.getEditorPluginName();
            return $.fn[editorPluginName].apply(editorDiv, arguments);
	},
	getValue: function(){
	    var cellType = this.getType();

            if ( cellType === "htmlarea" || cellType === "html" ) {
                return this.element.html();
            } else if ( cellType === "bool" ) {
		return parseBoolean(stripHTML(this.element.html()));
	    } else if ( this.element.is(':input') ) {
                return this.element.val();
            } else {
                return this.element.text();
            }
	},
	setValue: function(value){
	    var cellType = this.getType();
            var oldWidth = this.element.width();
            var oldHeight = this.element.height();

            if ( cellType === "htmlarea" || cellType === "html" ) {
		this.element.html(value);

            } else if ( cellType === "bool" ) {
		if ( parseBoolean(value) ) {
		    this.element.html("<span class='true'>Yes</span>");
		} else {
		    this.element.html("<span class='false'>No</span>");
		}

	    } else if ( this.element.is(':input') ) {
                this.element.val(value);

            } else {
                this.element.text(value);
            }

            if ( this.element.width() !== oldWidth || this.element.height() !== oldHeight ) {
                this.element.trigger('resize');
            }
	},
	isEditable: function() {
	    var row = this.getRow();
	    var col = this.getCol();

	    if ( row.dbRow('getState') === 'updating' ) {
		return false;
	    } 
	    // Is the cell visible/hidden
	    if ( ! this.element.is(':visible') ) {
		return false;
	    }
	    // No name defined
	    if ( col.attr('name') === undefined ) {
		return false;
	    }
	    if ( row.dbRow('option','type') === 'add' && parseBoolean(col.attr('addDisabled')) === true ) {
		return false;
	    }
	    if ( row.dbRow('option','type') === 'update' && parseBoolean(col.attr('updateDisabled')) === true ) {
		return false;
	    } 
	    if ( col.attr('type') === 'html' ) {
		return false;
	    }
	    return true;
	},
	isTabStop: function() {
	    if ( this.getCol().attr('tabStop') === 'no' ) {
		return false;
	    } else {
		return true;
	    }
	},
	hide: function(){
	    this.element.css('visibility','hidden');
	},
	show: function(){
	    this.element.css('visibility','inherit');
	},
	cellIn: function(select) {
	    // Update currentCell dbGrid variable, hide the cell, show the editor and set editor text selection.
	    var cell = this.element;
	    var grid = this.getGrid();

            cell.trigger('dbCellIn');

	    this.hide();
            this.editor('option', 'tab_on_return', this.options.tab_on_return);
	    if ( this.getType() === 'combo' ) {
                var data = this.getRow().dbRow('getRowData');
                var searchURL = this.getCol().attr('searchURL');
                $.each(data, function(name, value) {
                    searchURL = urlSet(searchURL, name, value);
                });
		this.editor('show', cell, this.getValue(), searchURL);
	    } else {
		this.editor('show', cell, this.getValue())
	    }
	    select = coalesce(select, this.getCol().attr('cellInSelect'), 'all');
	    this.editor('selectText', select);
	    grid.dbGrid('setCurrentCell', cell);
	},
	cellOut: function(){
	    // Write editor to cell, show cell, hide editor, unset currentCell dbGrid variable
	    var cell = this.element;
	    var row = this.getRow();
	    var grid = this.getGrid();
	    
	    // Custom Event: Trigger any dbCellOut events bound to this grid
	    cell.trigger('dbCellOut');
	    
	    var oldValue = this.getValue();
	    var newValue = this.editor('getValue');
	    this.write();
	    this.show();
	    this.editor('hide');
	    grid.dbGrid('setCurrentCell', $([]));
	  
	    // Perform any custom action for this column
	    if ( row.dbRow('getState') === 'dirty' &&  this.getCol().attr('action') ) {
		var actionURL = this.getCol().attr('action');
		row.dbRow('action','custom',actionURL,false);
	    }

	    // Auto-save depending on dbGrid's updateType
	    switch ( grid.dbGrid('option', 'updateType') ) {
	    case 'onKeyUp': 
		// cancel any delayed save and save immediately
		this._cancelDelayedSave();
		if (row.dbRow('getState') === 'dirty') {
		    row.dbRow('save');
		}
		break;	    
	    case 'onCellOut': 
		// save immediately
		if (row.dbRow('getState') === 'dirty') {
		    row.dbRow('save');
		}
	    }
	},
	write: function(){
	    // Write the contents of the editor to the current cell
	    this.setValue(this.editor('getValue'));
	},
	editorBlur: function(){
	    // Perform a cellout if the editor blurs and updateType == "onCellOut"
	    var grid = this.getGrid();
	    var row = this.getRow();
	    if ( grid.dbGrid('option', 'updateType') === 'onCellOut' ) {
		this.cellOut();
	    }		   
	},
        editorValueChange: function(){
	    // If the Editor's value has changed, mark row as dirty.
	    var row = this.getRow();
	    var grid = this.getGrid();

	    if ( this.getValue() !== this.editor('getValue') ) {
		row.dbRow('setState', 'dirty');
	    }
	    if ( grid.dbGrid('option','updateType') === "onKeyUp" ) {
		this._cancelDelayedSave();
		this.keyUpTimer = setTimeout(this._delayedSave.bind(this),750);
	    }
        },
	editorKeyDown: function(event){
	    var cell = this.element;
	    var grid = this.getGrid();

	    // Alt key combination
	    if ( event.altKey ) { return true; }

	    switch(event.which) {
	    case 38: // Up Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellAbove', cell));
		break;
	    case 40: // Down Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellBelow', cell));
		break;
	    case 37: // Left Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellLeftOf', cell));
		break;
	    case 39: // Right Arrow
		grid.dbGrid('cellChange', grid.dbGrid('cellRightOf', cell));
		break;		
	    case 83: // s Key
		if ( event.ctrlKey ) {
		    // Ctrl + s
		    grid.dbGrid('save');
		    break;
		}
	    case 46: // Delete Key
                if ( this.options.deleteKey === 'delete'
                     || ( this.options.deleteKey === 'ctrlDelete'
                          && event.ctrlKey
                        )
                   ) {
		    grid.dbGrid('delete');
		    break;
                } else {
                    return true;
                }
	    case 13: // Return Key
		grid.dbGrid('cellChange', grid.dbGrid('cellRightOf', cell));
		if ( grid.dbGrid('getCurrentCell').is(cell) ) {
		    // We are on the last editable cell 
		    grid.dbGrid('save');
		}
		break;
	    case 9: // Tab Key
		if ( event.shiftKey ) {
		    grid.dbGrid('cellChange', grid.dbGrid('cellLeftOf', cell));
		} else {
		    grid.dbGrid('cellChange', grid.dbGrid('cellRightOf', cell));
		}
		if ( grid.dbGrid('getCurrentCell').is(cell) ) {
		    // We are on the last editable cell 
		    grid.dbGrid('save');
		    return true;
		}
		break;

	    default: // handle event using browser defaults
		return true;
	    }
	    
	    // prevent event propagation and browser defaults 
	    event.preventDefault();
	    event.stopPropagation();
	    return false
	},
        onMouseDown: function(event) {
            this.hasMouseDown = true;
            this._on({
                'mouseleave': function() {
                    this.hasMouseDown = false;
                    this._off(this.element, 'mouseleave');
                }
            });
        },
	onMouseUp: function(event){
	    // Mouse up event on an editable cell - call changeCell
	    var grid = this.getGrid();

            // mousedown did not occur on this cell
            if ( ! this.hasMouseDown ) {
                return true;
            }
            this.hasMouseDown = false;
            this._off(this.element, 'mouseleave');

	    // Cell is not editable
	    if ( ! this.isEditable() ) {
                return true;
            } 
	    
	    grid.dbGrid('cellChange', this.element);
	},
	_delayedSave: function(){
	    var row = this.getRow();
	    if ( row.dbRow('getState') === 'dirty' ) {
		row.dbRow('save');
	    }
	},
	_cancelDelayedSave: function(){
	    if ( this.keyUpTimer !== undefined ) {
		clearTimeout(this.keyUpTimer);
	    }
	    this.keyUpTimer=undefined;
	},
    });
})(jQuery, window, document);

/* ==== jquery.dbEditorBool.js ==== */
// dbEditorBool plugin
// A hovering editor for boolean input
;(function($, window, undefined) {

    // css attributes to copy from the target element to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height', 'box-sizing'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorBool', {
	_create: function() {
	    // Constructor function - create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });
	    this.editor = $('<div>')
		.attr('contentEditable',true)
		.addClass('db-editor boolean')
		.appendTo(this.element)
		.css({
		    'position': "absolute"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
	},
	getValue: function() {
	    // Get the current value of the editor
	    return parseBoolean(this.editor.text());
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = $(element);
	    this.editor.show();
	    this.repaint()
	    if ( parseBoolean(value) ) {
		this.setTrue();
	    } else {
		this.setFalse();
	    }
	},
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	}, 
	repaint: function() {
	    // repaint the editor
	    if ( this.currentElement.length == 1 ) {
		var editor = this.editor;
		var element = this.currentElement;

		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

                if ( element.css('border-collapse') === "collapse" ) {
                    editor.css({
                        width: "+=" + (
                            ( parseInt(element.css('border-left-width'))
                              + parseInt(element.css('border-right-width'))
                            ) / 2
                        ),
                        height: "+=" + (
                            ( parseInt(element.css('border-top-width'))
                              + parseInt(element.css('border-bottom-width'))
                            ) / 2
                        ),
                    });
                }

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent'
		     || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}
		// position
		editor.css(element.positionRelativeTo(this.editor.offsetParent()));
	    }
	},
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	setTrue: function() {
	    this.editor.html('<span class=true>Yes</span>');
            this.currentElement.trigger('editorValueChange');
	},
	setFalse: function() {
	    this.editor.html('<span class=false>No</span>');
            this.currentElement.trigger('editorValueChange');
	},
	_onResize: function(event) {
	    // Any event that might change the size or position of the editor's target needs to trigger this.
	    // It is bound to the window resize event, so triggering a resize event on any element should propagate up and trigger this.
	    // Ensures that the editor is still positioned correctly over the target element.
	    if ( this.currentElement ) {
		var element = this.currentElement;
		var editor = this.editor;
		$.each(['width', 'height'], function(i, name){
		    editor.css(name, element.css(name));
		});
		editor.css(element.positionRelativeTo(this.element));
	    }
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behaviour.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}
	    case 38: // up
	    case 37: // left
	    case 40: // down
	    case 39: // right
	    case 46: // delete 
	    case 13: // return
	    case 9: // tab 
		break;
	    
	    default: return true 
	    }

	    // propagate event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    this.currentElement.trigger(event);
            if ( event.isDefaultPrevented() ) {
	        e.preventDefault();
            }
	},
	_inputOnKeyUp: function(e) {
	     switch(e.which) {
	     case 97: // 1
	     case 49: // 1
	     case 84: // t
	     case 89: // y
		 this.setTrue();
		 break;
	     case 96: // 0
	     case 48: // 0
	     case 70: // f
	     case 78: // n
		 this.setFalse();
		 break; 
	     }

	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
	    if ( this.getValue() ) {
		this.setFalse();
	    } else {
		this.setTrue();
	    }

	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e, source) {
	    // If handlers responding to an event that caused the editor to lose focus cause it to regain focus, don't pass the blur event on to the target element (especially since the current target has probably changed since then).
	    // Otherwise, pass blur events on to the target element.
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorCombo.js ==== */
// dbEditorCombo plugin
// A hovering editor for with combo completion
;(function($, window, undefined) {

    // css attributes to copy from the target element to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height', 'box-sizing'];

    // css attributes to copy from the editor to the options div when it is shown
    var copyOptionsAttributes = ['backgroundColor',
                                 'borderTopStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderRightStyle',
                                 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor',
                                 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
                                 'fontSize', 'fontFamily', 'fontWeight',
                                 'width', 'box-sizing'];
        
    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorCombo', {
	_create: function() {
	    // Create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });

            this._on(this.element.parentsUntil('html'), {
                'scroll': this.repaint
            });

	    this.editor = $('<input type="text">')
		.addClass('db-editor combo')
		.appendTo(this.element)
		.css({
		    'position': "absolute",
		    'background': "white",
		    'overflow': "visible",
		    'z-index': 1
		})
		.hide();
	    this._on(this.editor, {
                'focus': this._inputOnFocus,
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });

	    this.comboOptions = $('<div>')
		.addClass('options-container')
		.appendTo('body')
		.css({
		    'position':'absolute',
		    'overflow':'auto',
		    'z-index': 1
		})
		.hide();
	    this._on(this.comboOptions, {
		'mouseup div': this._comboOptionMouseUp,
		'mouseenter div': this._comboOptionMouseEnter
	    });

	    this.currentElement = $([]);
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.val();
	},
        setValue: function(value) {
            this.editor.val(value);
            this._valueChanged();
        },
	show: function(element, value, searchURL){
	    // Show this editor positioned over the target element and set the value of the editor
	    this.currentElement = $(element);
	    this.editor.show();
	    this.lastValue = value;
	    this.searchURL = searchURL;
	    this.repaint();
	    this.editor.val(value);
	}, 
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.add(this.comboOptions)
		.hide();
	},
	selectOption: function(index) {
	    // Select the option for this 0-based index
	    this.comboOptions.children('.selected').removeClass('selected');
	    this.comboOptions.children(':nth-child(' + (index + 1) + ')').addClass('selected');
	},
	repaint: function() {
	    // repaint the editor
	    if ( this.currentElement.length == 1 ) {
		var editor = this.editor;
		var comboOptions = this.comboOptions;
		var element = this.currentElement;

		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

		// Copy various style from the editor to combo options div
		$.each(copyOptionsAttributes, function(i, name){
		    comboOptions.css(name, editor.css(name));
		});
		var borderWidth = Math.max(
		    parseInt(editor.css('borderTopWidth')),
		    parseInt(editor.css('borderRightWidth')),
		    parseInt(editor.css('borderBottomWidth')),
		    parseInt(editor.css('borderLeftWidth'))
		) + 'px';
		comboOptions.css({
		    'borderTopWidth': borderWidth,
		    'borderRightWidth': borderWidth,
		    'borderBottomWidth': borderWidth,
		    'borderLeftWidth': borderWidth
		});

                if ( element.css('border-collapse') === "collapse" ) {
                    editor.css({
                        width: "+=" + (
                            ( parseInt(element.css('border-left-width'))
                              + parseInt(element.css('border-right-width'))
                            ) / 2
                        ),
                        height: "+=" + (
                            ( parseInt(element.css('border-top-width'))
                              + parseInt(element.css('border-bottom-width'))
                            ) / 2
                        ),
                    });
                }

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent'
		     || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.add(comboOptions)
			.css('backgroundColor', "white");
		} else {
		    editor.add(comboOptions)
			.css('backgroundColor', element.css('backgroundColor'));
		}

		// position
		var position = element.positionRelativeTo(this.editor.offsetParent());
		editor.css({
		    'left': position.left,
		    'top': position.top
		});

                var pagePosition = editor.positionRelativeTo('body');
		comboOptions.css({
		    'left': pagePosition.left + parseInt(editor.css('borderLeftWidth')) - parseInt(comboOptions.css('borderLeftWidth')),
		    'top': pagePosition.top + editor.outerHeight() - parseInt(comboOptions.css('borderTopWidth'))
		});
	    }
	}, 
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	search: function() {
	    // Server side search for available options
	    dbEditorCombo = this;
	    dbEditorCombo.comboOptions.show().text("Searching ...");
	    
	    jQuery.ajax({
		url: dbEditorCombo.searchURL,
		data: {
		    value: dbEditorCombo.getValue()
		},
		dataType: 'xml',
		async: false,
		cache: false,
		success: function(data) {
		    dbEditorCombo.searchReturn(data)
		},
		error: function(jqXHR, textStatus, errorThrown) {
		    dbEditorCombo.comboOptions.text("Software Bug ! " + textStatus + ': ' + errorThrown);
		}   
	    });
	},
	searchReturn: function(xmlDoc) {
	    // Populate comboOptions element with server response
	    var comboOptions = this.comboOptions;
	    comboOptions.empty();

	    var rec = jQuery('error:first', xmlDoc);
	    if ( rec.size() ) {
		// Error returned by Server
		comboOptions.text(rec.text());
	    } else {
		// Success
		var recs = jQuery('records > record > option', xmlDoc);
		if ( recs.size() ) {
		    // Matches Found
		    recs.each(function() {
			var comboOption = jQuery('<div>')
			    .text($(this).text())
			    .css({
				'width': '100%',
				'cursor': 'pointer'
			    })
			    .appendTo(comboOptions);
		    });
		    // selectOption first option
		    this.selectOption(0);
		} else {
		    // No Matches
		    comboOptions.text("No Matches");
		}
	    }
	},
        _valueChanged: function() {	
	    this.lastValue = this.getValue();
            this.currentElement.trigger('editorValueChange');
        },
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	  
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}	   
	    case 39: // right
		if ( selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}
	    case 38: // up
		if ( this.comboOptions.is(':visible') ) {
		    // navigate within comboOptions if it is visible
		    var index = this.comboOptions.children('.selected').prev().index();
		    if ( index !== -1 ) {
			this.selectOption(index);
		    }
		    return true
		}
                break;
	    case 40: // down
		if ( this.comboOptions.is(':visible') ) {
		    // navigate within comboOptions if it is visible
		    var index = this.comboOptions.children('.selected').next().index();
		    if ( index !== -1 ) {
			this.selectOption(index);
		    }
		    return true
		}
                break;
	    case 9: // tab 
	    case 13: // return
		if ( this.comboOptions.is(':visible') ) {
		    // Update editor with the selected comboOption
		    var option = this.comboOptions.children('.selected');
		    if ( option.index() !== -1 ) {
                        this.setValue(option.text());
			this.comboOptions.hide();
	                e.preventDefault();
                        return true;
		    }
		}
                break;

	    case 46: // delete 
		break;

	    default: return true 
	    }

	    // propagate custom event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    this.currentElement.trigger(event);
            if ( event.isDefaultPrevented() ) {
	        e.preventDefault();
            }
	},
        _inputOnFocus: function(e) {
	    //this.search();
        },
	_inputOnKeyUp: function(e) {
	    if ( this.getValue() !== this.lastValue ) {
                this._valueChanged();
	        this.search();
	    }

	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
            this._valueChanged();
	    this.search();

	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
            this._valueChanged();
	    this.search();

	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e, source) {
	    if ( ! this.editor.is(':focus') ) {
		// really is blurred
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	},
	_comboOptionMouseUp: function(e) {
	    // Select the target option and update editor value
	    var option = $(e.currentTarget);
	    
	    this.selectOption(option.index());
            this.setValue(option.text());	   
	    this.selectText('end');
	    this.comboOptions.hide();
	},
	_comboOptionMouseEnter: function(e) {
	    // Select the target option
	    var option = $(e.currentTarget);
	    this.selectOption(option.index());
	},
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	    this.comboOptions.remove();
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorHTMLArea.js ==== */
// dbEditorHTMLArea plugin
// A hovering editor for multi-line input with a contentEditable div to allow html markup
;(function($, window, undefined){

    // css attributes to copy from target elements to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'box-sizing'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorHTMLArea', {
        options: {
	    tab_on_return: false
	},
	_create: function() {
	    // Constructor function - create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });
	    this.editor = $('<div>')
		.attr('contentEditable', true)
		.addClass('db-editor html-area')
		.appendTo(this.element)
		.css({
		    'overflow': "auto",
		    'position': "absolute"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
	    this.currentElement = $([]);
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.html();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = $(element);
	    this.editor.show();
	    this.repaint();
	    this.editor.html(value);
	},
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	repaint: function() {
	    if ( this.currentElement.length == 1 ) {
		// Copy various style from the target element to the editor
		var editor = this.editor;
		var element = this.currentElement;
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});
		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}

		editor
		    .height((typeof element.data('editorHeight') == "undefined") ? element.height() : element.data('editorHeight'))
		    .css(element.positionRelativeTo(this.editor.offsetParent()));

                if ( element.css('border-collapse') === "collapse" ) {
                    editor.css({
                        width: "+=" + (
                            ( parseInt(element.css('border-left-width'))
                              + parseInt(element.css('border-right-width'))
                            ) / 2
                        )
                    });
                    if ( typeof element.data('editorHeight') == "undefined" ) {
                        editor.css({
                            height: "+=" + (
                                ( parseInt(element.css('border-top-width'))
                                  + parseInt(element.css('border-bottom-width'))
                                ) / 2
                            ),
                        });
                    }
                }

	    }
	},
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	    case 38: // up
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}
	    case 40: // down
	    case 39: // right
		if ( selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}

	    case 46: // delete 
		break;

	    case 13: // return
                if (e.shiftKey) {
	            return true;
                }
		if ( this.option('tab_on_return') || (selection.selectionAtStart && selection.selectionAtEnd) ) {
		    break;
		}
                // Normalize the effect of the enter key to make browsers behave consistently
	        var selection = window.getSelection();

                if ( document.queryCommandSupported('insertLineBreak') ) {
	            // Webkit
                    document.execCommand('insertLineBreak');
                    e.preventDefault();
                } else if ( document.queryCommandSupported('insertBrOnReturn') ) {
	            // Firefox only
                    document.execCommand('insertBrOnReturn');
                } else if (selection && selection.rangeCount > 0) {
	            // IE Standards
	            var range = selection.getRangeAt(0);
	            var brNode1 = jQuery('<br>').get(0);
	    	    
                    range.deleteContents();
	            range.insertNode(brNode1);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    e.preventDefault();
	        }
                return true;

	    case 9: // tab 
		break;

	    default: return true 
	    }

	    // propagate custom event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    this.currentElement.trigger(event);
            if ( event.isDefaultPrevented() ) {
	        e.preventDefault();
            }
	},
	_inputOnKeyUp: function(e) {
            this.currentElement.trigger('editorValueChange');
	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
            this.currentElement.trigger('editorValueChange');
	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
            this.currentElement.trigger('editorValueChange');
	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e, source) {
	    // If handlers responding to an event that caused the editor to lose focus cause it to regain focus, don't pass the blur event on to the target element (especially since the current target has probably changed since then).
	    // Otherwise, pass blur events on to the target element.
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorText.js ==== */
// dbEditorText plugin
// A hovering editor for single-line input
;(function($, window, undefined) {

    // css attributes to copy from the target element to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height', 'box-sizing'];

    // Uses the jQuery UI widget factory
    $.widget('qcode.dbEditorText', {
	_create: function() {
	    // Create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });
	    this.editor = $('<input type="text">')
		.addClass('db-editor text')
		.appendTo(this.element)
		.css({
		    'position': "absolute", 
		    'background': "white", 
		    'overflow': "visible",
		    'z-index': 1
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
	    this.currentElement = $([]);
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.val();
	}, 
	show: function(element, value){
	    // Show this editor positioned over the target element and set the value of the editor
	    this.currentElement = $(element);
	    this.editor.show();
	    this.repaint();
	    this.editor.val(value);
	}, 
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.editor.hide();
	},
	repaint: function() {
	    // repaint the editor
	    if ( this.currentElement.length == 1 ) {
		var editor = this.editor;
		var element = this.currentElement;

		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

                if ( element.css('border-collapse') === "collapse" ) {
                    editor.css({
                        width: "+=" + (
                            ( parseInt(element.css('border-left-width'))
                              + parseInt(element.css('border-right-width'))
                            ) / 2
                        ),
                        height: "+=" + (
                            ( parseInt(element.css('border-top-width'))
                              + parseInt(element.css('border-bottom-width'))
                            ) / 2
                        ),
                    });
                }

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent'
		     || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}
		// position
		editor.css(element.positionRelativeTo(this.editor.offsetParent()));
	    }
	}, 
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	  
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}	   
	    case 39: // right
		if ( selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}
	    case 38: // up
	    case 40: // down
	    case 46: // delete 
	    case 13: // return
	    case 9: // tab 
		break;

	    default: return true 
	    }

	    // propagate custom event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    this.currentElement.trigger(event);
            if ( event.isDefaultPrevented() ) {
	        e.preventDefault();
            }
	},
	_inputOnKeyUp: function(e) {
            this.currentElement.trigger('editorValueChange');
	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
            this.currentElement.trigger('editorValueChange');
	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
            this.currentElement.trigger('editorValueChange');
	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e, source) {
	    if ( ! this.editor.is(':focus') ) {
		// really is blurred
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbEditorTextArea.js ==== */
// dbEditorTextArea plugin
// A hovering editor for multi-line text input
;(function($, window, undefined){

    // css attributes to copy from target elements to the editor when editor is shown
    var copyAttributes = ['borderTopWidth', 'borderTopStyle', 'borderTopColor', 
			  'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 
			  'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 
			  'borderRightWidth', 'borderRightStyle', 'borderRightColor', 
			  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
			  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 
			  'textAlign', 'verticalAlign', 'fontSize', 'fontFamily', 'fontWeight', 
			  'width', 'height', 'box-sizing'];

    // Uses the jQuery UI widget factory
    $.widget( 'qcode.dbEditorTextArea', {
	_create: function() {
	    // Constructor function - create the editor element, and bind event listeners.
	    this._on(window, {
		'resize': this.repaint
	    });
	    this.editor = $('<textarea>')
		.appendTo(this.element)
		.addClass('db-editor text-area')
		.css({
		    'position': "absolute", 
		    'resize': "none",
		    'overflow': "auto"
		})
		.hide();
	    this._on(this.editor, {
		'keydown': this._inputOnKeyDown,
		'keyup': this._inputOnKeyUp,
		'cut': this._inputOnCut,
		'paste': this._inputOnPaste,
		'blur': this._inputOnBlur
	    });
	    this.currentElement = $([]);
	},
	getValue: function() {
	    // Get the current value of the editor
	    return this.editor.val();
	}, 
	show: function(element, value){
	    // Show this editor over the target element and set the value
	    this.currentElement = $(element);
	    this.editor.show();
	    this.repaint();
	    this.editor.val(value);
	}, 
	hide: function() {
	    // Hide the editor
	    if ( this.editor.is(':focus') ) {
		this.editor.trigger('blur');
	    }
	    this.currentElement = $([]);
	    this.editor.hide();
	},
	repaint: function() {
	    if ( this.currentElement.length == 1 ) {
		var editor = this.editor;
		var element = this.currentElement;
		// Copy various style from the target element to the editor
		$.each(copyAttributes, function(i, name){
		    editor.css(name, element.css(name));
		});

                if ( element.css('border-collapse') === "collapse" ) {
                    editor.css({
                        width: "+=" + (
                            ( parseInt(element.css('border-left-width'))
                              + parseInt(element.css('border-right-width'))
                            ) / 2
                        ),
                        height: "+=" + (
                            ( parseInt(element.css('border-top-width'))
                              + parseInt(element.css('border-bottom-width'))
                            ) / 2
                        ),
                    });
                }

		// Different browsers return different css for transparent elements
		if ( element.css('backgroundColor') == 'transparent' || element.css('backgroundColor') == "rgba(0, 0, 0, 0)" ) {
		    editor.css('backgroundColor', "white");
		} else {
		    editor.css('backgroundColor', element.css('backgroundColor'));
		}

		// (Note: I haven't yet figured out why the +1 height is needed to stop scrollbars from appearing)
		editor
		    /*.css({
			'height': "+=1", 
			'padding-bottom': "-=1"
		    })*/
		    .css(element.positionRelativeTo(this.editor.offsetParent()));
	    }
	},
	selectText: function(option) {
	    // Set the text selection / cursor position
	    switch(option) {
	    case "start":
		this.editor.textrange('set', "start", "start");
		break;
	    case "end":
		this.editor.textrange('set', "end", "end");
		break;
	    case "all":
		this.editor.textrange('set', "all");
		break;
	    }
	}, 
	destroy: function() {
	    // If the widget is destroyed, remove the editor from the DOM.
	    this.editor.remove();
	},
	_inputOnKeyDown: function(e) {
	    // Some key events are passed to the target element, but only the ones where we might need some non-default behavior.
	    var selection = this.editor.textrange('get');

	    switch(e.which) {
	    case 38: // up
	    case 37: // left
		if ( selection.selectionAtStart ) {
		    break;
		} else {
		    return true;
		}
	    case 40: // down
	    case 39: // right
		if ( selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 83: // S
		if ( e.ctrlKey ) {
		    break;
		} else {
		    return true;
		}

	    case 46: // delete 
		break;
	    case 13: // return
		if ( selection.selectionAtStart && selection.selectionAtEnd ) {
		    break;
		} else {
		    return true;
		}
	    case 9: // tab 
		break;

	    default: return true 
	    }

	    // propagate event to target element
	    var event = jQuery.Event('editorKeyDown', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
	    });
	    this.currentElement.trigger(event);
            if ( event.isDefaultPrevented() ) {
	        e.preventDefault();
            }
	},
	_inputOnKeyUp: function(e) {
            this.currentElement.trigger('editorValueChange');
	    // Pass all key up events on to the target element.
            var event = jQuery.Event('editorKeyUp', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnCut: function(e) {
            this.currentElement.trigger('editorValueChange');
	    // Pass all cut events on to the target element.
            var event = jQuery.Event('editorCut', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnPaste: function(e) {
            this.currentElement.trigger('editorValueChange');
	    // Pass all paste events on to the target element.
            var event = jQuery.Event('editorPaste', {
		'data': e.data, 
		'ctrlKey': e.ctrlKey, 
		'altKey': e.altKey, 
		'shiftKey': e.shiftKey, 
		'which': e.which
            });
	    this.currentElement.trigger(event);
	},
	_inputOnBlur: function(e) {
	    // If handlers responding to an event that caused the editor to lose focus cause it to regain focus, don't pass the blur event on to the target element (especially since the current target has probably changed since then).
	    // Otherwise, pass blur events on to the target element.
	    if ( ! this.editor.is(':focus') ) {
		var event = jQuery.Event('editorBlur', {
		    'data': e.data
		});
		this.currentElement.trigger(event);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.dbField.js ==== */
// dbField plugin - a field in a dbRecord.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget("qcode.dbField", {
	_create: function() {
	    // saveType
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType, this.getRecord().dbRecord("option", "saveType"))
	    
	    if ( this.options.saveType === 'fieldOut' ) {
		this._on({
		    'dbFieldOut': function() {
			if ( this.getRecord().dbRecord('getState') === "dirty" ) {
			    this.getRecord().dbRecord('save');
			}
		    }
		});
	    }
	},
        _destroy: function() {
            //this.editor('destroy');
        },
	getRecordSet: function() {
	    return this.element.closest('.record-set');
	},
	getRecord: function(){
	    return this.element.closest('.record');
	},
	getName: function() {
	    return this.element.attr('name');
	},
	getValue: function(){
	    if ( this.getType() == "htmlarea" ) {
		return this.element.html();
	    } else if ( this.element.is(':input') ) {
		return this.element.val();
	    } else {
		return this.element.text();
	    }
	}, 
	setValue: function(newValue){
	    if ( this.getType() == "htmlarea" ) {
		this.element.html(newValue);
	    } else if ( this.element.is(':input') ) {
		this.element.val(newValue);
	    } else {
		this.element.text(newValue);
	    }
	}, 
	fieldIn: function(select){
	    // Show the editor on this field
	    // select can be one of "all", "start" or "end", and indicates the text range to select
	    var recordSet = this.getRecordSet();
	    
	    recordSet.dbRecordSet('setCurrentField', this.element);
	    this.element.css('visibility', "hidden");
	    
	    // Call the appropriate dbEditor plugin on the record set to show the editor over this field
	    this.editor('show', this.element, this.getValue());

	    // Optionally set the text selection
	    if (select) {
		this.editor('selectText', select);
	    } else if ( this.element.attr('fieldInSelect') != null ) {
		this.editor('selectText', this.element.attr('fieldInSelect'));
	    } else {
		this.editor('selectText', 'all');
	    }
	    // custom event
	    this.element.trigger('dbFieldIn');
	}, 
	fieldOut: function(){
	    var recordSet = this.getRecordSet();
	    recordSet.dbRecordSet('setCurrentField', null);

	    // Check if dirty
	    if ( this.getValue() !== this.editor('getValue') ) {
		this.write();
		var record = this.getRecord();
		record.dbRecord('setState', 'dirty');
	    }

	    this.element.css('visibility', "inherit");
	    this.editor('hide');
	    // custom event
	    this.element.trigger('dbFieldOut');
	}, 
	getType: function(){
	    // Returns the field type
	    return coalesce(this.element.attr('type'), "text");
	}, 
	isEditable: function(){
	    return (this.element.is('.editable') && this.getRecord().dbRecord('getState') != "updating");
	}, 
	onClick: function(event){
	    if ( this.isEditable() ) {
		this.getRecordSet().dbRecordSet('fieldChange', this.element);
		// Don't blur the editor that we just showed
		event.preventDefault();
	    }
	}, 
	editorKeyDown: function(event){
	    // Capture key down events propagated here by the editor
	    if ( event.altKey ) {
		return true;
	    }
	    var recordSet = this.getRecordSet();
	    var field = this.element;
	    var fields = recordSet.find('.editable');
	    var newField = $([]);
	    switch (event.which) {
	    case 37: // left arrow
		newField = field.westOf(fields);
		break;
	    case 38: // up arrow
		newField = field.northOf(fields);
		break;
	    case 39: // right arrow
		newField = field.eastOf(fields);
		break;
	    case 40: // down arrow
		newField = field.southOf(fields);
		break;
	    case 9: // tab key 
		if ( event.shiftKey ) {
		    newField = field.westOf(fields);
		} else {
		    newField = field.eastOf(fields);
		}
		if ( newField.length === 0 && this.getRecord().dbRecord('getState') === 'dirty' ) {
		    // save if on last record 
		    this.getRecord().dbRecord('save');
		}
		break;
	    case 13: // return key
		newField = field.eastOf(fields);
		if ( newField.length === 0 && this.getRecord().dbRecord('getState') === 'dirty' ) {
		    // save if on last record 
		    this.getRecord().dbRecord('save');
		}
		break;
	    case 83: // Ctrl + S - save the current record.
		if ( event.ctrlKey ) {
		    this.getRecord().dbRecord('save');
		    event.preventDefault();
		}
		break;
	    }
	    if ( newField.length === 1 ) {
		recordSet.dbRecordSet('fieldChange', newField);
	    }
	    event.preventDefault();
	},
	editorBlur: function(event){
	    // When the editor becomes blurred, move out.
	    this.fieldOut();
	},
        editorValueChange: function(event){
	    if ( this.getValue() !== this.editor('getValue') ) {
	        this.getRecord().dbRecord('setState', 'dirty');
            }
        },
	write: function(){
	    // Write the editor's contents to the field
	    this.setValue(this.editor('getValue'));
	},
	editor: function(method) {
	    var recordSet = this.getRecordSet();
	    var pluginName;
	    switch(this.getType()){
            case "combo":
                pluginName="dbEditorCombo";
                break;
            case "bool":
                pluginName="dbEditorBool";
                break;
	    case "text":
		pluginName="dbEditorText";
		break;
	    case "textarea":
		pluginName="dbEditorTextArea";
		break;
	    case "htmlarea":
		pluginName="dbEditorHTMLArea";
		break;
	    }
	    return recordSet[pluginName].apply(recordSet, arguments);
	}
    });
})(jQuery);

/* ==== jquery.dbForm.js ==== */
// dbForm plugin
;(function($, window, undefined){
    // ============================================================
    // dbForm class
    // ============================================================

    // Constructor function
    function DbForm(form) {
	this.form = $(form);
	this.elements = $([]);
    }

    // ============================================================

    // Public methods
    $.extend(DbForm.prototype, {
	init: function(options) {
            // Initialise the dbForm

            // Default settings
	    this.settings = $.extend({
		formType: "update", // Update, add, or submit
                updateType: "manual", //(with formType=="update"): manual, keyup, focus, or blur
		enabled: true,
		checkOnExit: true,
		initialFocus: true,
                initialFind: undefined, // "name=value"
                dataURL: undefined,
                qryURL: undefined,
                updateURL: undefined,
                addURL: undefined,
                submitURL: undefined,
                searchURL: undefined,
                deleteURL: undefined,
                formActionReturn: undefined // function
	    }, options);
	    if ( typeof this.settings.formActionReturn == "function" ) {
		this.form.on('formActionReturn.DbForm', this.settings.formActionReturn);
	    }

            // Class variables
	    this.state = 'current';

	    this.divStatus = this.form.find('.db-form-status').last();
	    this.elements = this.elements
                .add('input', this.form)
                .add('select', this.form)
                .add('textarea', this.form)
                .add('.db-form-html-area, radio-group', this.form);

	    this.error = undefined;

	    if ( typeof this.settings.dataURL != "undefined" ) {
		this.formAction('requery', this.settings.dataURL);
	    }
	    if ( typeof this.settings.qryURL != "undefined" ) {
		this.nav('FIRST');
	    }

            // Event listeners
	    this.form.on('change.DbForm', 'select, input[type="checkbox"], input[type="radio"]', this.setDirty.bind(this));
	    if ( this.settings.checkOnExit && this.settings.formType === "update" ) {
		$(window).on('beforeunload.DbForm', onBeforeUnload.bind(this));
	    }
	    this.form.on('keydown.DbForm', onKeyDown.bind(this));
	    this.form.on('keypress.DbForm', onKeyPress.bind(this));
	    this.form.on('submit.DbForm', onSubmit.bind(this));
            if ( this.settings.formType == "update" ) {
                var dbForm = this;
                var saveHandler = function(event) {
                    if ( $(event.target).is(dbForm.elements) && dbForm.state == 'dirty' ) {
                        dbForm.save();
                    }
                }
                switch ( this.settings.updateType ) {
                case "focus":
                    this.form.on('focusin.DbForm', saveHandler);
                    this.form.on('change.DbForm', 'input[type="checkbox"], input[type="radio"]', saveHandler);
                    break;
                case "blur":
                    this.form.on('focusout.DbForm', saveHandler);
                    break;
                case "keyup":
                    this.form.on('keyup.DbForm', function(event) {
                        if ( $(event.target).is(dbForm.elements) ) {
                            cancelDelayedSave.call(dbForm);
                            dbForm.keyUpTimer = window.setTimeout(dbForm.save.bind(dbForm),750);
                        }
                    });
                    this.form.on('change.DbForm', 'input[type="checkbox"], input[type="radio"]', saveHandler);
                    break;
                }
            }

            // Should initial focus go to this form?
	    if ( this.settings.initialFocus ) {
		this.focus();
	    }
            
            // Do we have an inital search?
	    if ( typeof this.settings.initialFind == "string" ) {
		var name = this.settings.initialFind.split('=')[0];
		var value = this.settings.initialFind.split('=')[1];
		this.find(name, value);
	    }
	},
	save: function(async) {
            async = coalesce(async, false);
	    switch( this.settings.formType ) {
	    case "update":
		this.setState('updating');
		this.formAction('update', this.settings.updateURL,undefined,undefined,async);
		break;
	    case "add":
		this.setState('updating');
		this.formAction('add', this.settings.addURL,undefined,undefined,async);
		break;
	    case "submit":
		this.form.attr('action', this.settings.submitURL);
		this.elements.filter('.db-form-html-area').each(function(i, div){
		    this.form.append(
			$('<input type="hidden">')
			    .attr('name', $(div).attr('name'))
			    .val($(div).html())
		    );
		}.bind(this));
		this.elements.filter('input[type="checkbox"]:not(:checked)').each(function(i, input) {
		    if ( $(input).attr('boolean') ) {
			this.form.append(
			    $('<input type="hidden">')
				.attr('name', $(input).attr('name'))
				.val("false")
			);
		    }
		}.bind(this));
		this.form.submit();
		break;
	    }
	},
	formAction: function(type,url,handler,errorHandler,async) {
	    var dbForm = this;
	    if ( typeof handler == "undefined" ) {
		handler = function(data, textStatus, jqXHR){
		    formActionSuccess.call(dbForm, data, type);
		}
	    }
	    if ( typeof errorHandler == "undefined" ) {
		errorHandler = function(errorMessage, errorType){
		    formActionError.call(dbForm, errorMessage);
		}
	    }
	    if ( typeof async == "undefined" ) {
		async = false;
	    }
	    httpPost(url, formData.call(this, this.form), handler, errorHandler, async);
	},
	focus: function() {
	    this.elements.each(function(){
		$(this).focus();
		return ! $(this).is(':focus');
	    });
	},
	nav: function(navTo) {
	    this.form.find('[name="navTo"]').val(navTo);
	    if ( this.state === "dirty" ) {
		this.save();
	    } else {
		this.setState('loading');
		this.formAction('qry', this.settings.qryURL);
	    }
	},
	find: function() {
	    if ( this.state === "dirty" ) {
		this.save();
	    } else {
		this.setState('loading');
	    }
	    var data = {};
	    for(var i = 0; i < arguments.length; i+=2){
		data[arguments[i]] = arguments[i+1];
	    }
	    var dbForm = this;
	    httpPost(this.settings.searchURL, data, function(data, textStatus, jqXHR) {
		formActionSuccess.call(dbForm, data, "search");
	    }, formActionError.bind(this), true);
	},
	del: function() {
            var dbForm = this;
	    qcode.confirm('Delete the current record?', function() {
		dbForm.setState('deleting');
		dbForm.formAction('delete',dbForm.settings.deleteURL);
	    });
	},
	setState: function(newState) {
	    switch(newState) {
	    case "dirty":
		var span = $('<span>').text('save').click(this.save.bind(this)).addClass('action save');
		var message = $('<span>').text('Editing ... To ').append(span).append(', type Ctrl+S');
		this.setStatus(message);
		this.form.find('[name="nav_new"]').prop('disabled', ( ! this.settings.addURL) );
		this.form.find('[name="nav_prev"], [name="nav_next"]').prop('disabled', false);
		break;
	    case "updating":
		this.setStatus('Updating ...');
		break;
	    case "current":
		switch(this.state) {
		case "updating":
		    this.setStatus('Saved.');
		    break;
		case "loading":
		    this.setStatus('');
		    break;
		case "deleting":
		    this.setStatus('Deleted.');
		    break;
		default:
		    this.setStatus('');
		    break;
		}
		break;
	    };
	    this.state = newState;
	},
	setDirty: function() {
	    this.setState('dirty');
	},
	setStatus: function(message) {
	    if ( typeof this.divStatus != "undefined" ) {
		$(this.divStatus).empty().append(message);
	    }
	}
    });
    // End of public methods

    // ============================================================

    // Private methods
    function onBeforeUnload(event) {
	if ( this.state == 'dirty' ) {
	    return "Your changes have not been saved.\nStay on the current page to correct.";
	}
    }
    function onSubmit() {
	if ( this.settings.formType == 'submit' ) {
	    return true;
	}
	return false;
    }
    function onKeyDown(e) {
	if ( e.which == 83 && e.ctrlKey ) {
	    // Ctrl+S
	    this.save();
	    e.returnValue = false;
	    e.preventDefault();
	}
	// Backspace
	if ( e.which == 8) {
	    this.setState('dirty');
	}
    }
    function onKeyPress() {
	this.setState('dirty');
    }
    function formActionSuccess(xmlDoc, type) {
	var dbForm = this;
	$('records > record *', xmlDoc).each(function(i, xmlNode){
	    dbForm.form.find('#' + $(xmlNode).prop('nodeName') + ', [name="' + $(xmlNode).prop('nodeName') + '"]').each(function(j, target){
		if ( $(target).is('input, textarea, select') ) {
		    $(target).val($(xmlNode).text());
		} else {
		    $(target).html($(xmlNode).text());
		}
	    });
	});
	$('records > html *', xmlDoc).each(function(i, xmlNode){
	    behave(
                $('#'+$(xmlNode).prop('nodeName')).each(function(j, target) {
		    if ( $(target).is('input, textarea, select') ) {
		        $(target).val($(xmlNode).text());
		    } else {
		        $(target).html($(xmlNode).text());
		    }
	        })
            );
	});
	
	if ( type == 'update' || type== 'add' ||  type== 'delete' || type=='qry') {
	    this.setState('current');
	}
	
	// Info
	var rec = $(xmlDoc).find('records > info').first();
	if ( rec.length == 1 ) {
	    this.setStatus(rec.text());
	}
	// Alert
	var rec = $(xmlDoc).find('records > alert').first();
	if ( rec.length == 1 ) {
	    qcode.alert(rec.text());
	}
	// Nav
	if ( this.form.find('[name="recordsLength"]').length > 0 && this.form.find('[name="recordNumber"]').length > 0 ) {
	    var recordsLength =  this.form.find('[name="recordsLength"]').val();
	    var recordNumber = this.form.find('[name="recordNumber"]').val();
	    if ( recordNumber==1 ) {
		this.form.find('[name="nav_first"]').prop('disabled', true);
		this.form.find('[name="nav_prev"]').prop('disabled', true);
	    } else {
		this.form.find('[name="nav_first"]').prop('disabled', false);
		this.form.find('[name="nav_prev"]').prop('disabled', false);
	    }
	    if ( recordNumber==recordsLength ) {
		this.form.find('[name="nav_last"]').prop('disabled', true);
		this.form.find('[name="nav_next"]').prop('disabled', true);
	    } else {
		this.form.find('[name="nav_last"]').prop('disabled', false);
		this.form.find('[name="nav_next"]').prop('disabled', false);
	    }
	    if ( recordNumber==0 ) {
		// New Record
		this.settings.formType = 'add';
		this.form.find('[name="nav_new"]').prop('disabled', true);
		this.form.find('[name="nav_prev"]').prop('disabled', true);
		this.form.find('[name="nav_next"]').prop('disabled', true);
		this.form.find('[name="nav_del"]').prop('disabled', true);
	    } else {
		this.settings.formType = 'update';
		if ( this.settings.addURL ) {
		    this.form.find('[name="nav_new"]').prop('disabled', false);
		} else {
		    this.form.find('[name="nav_new"]').prop('disabled', true);
		}
		if ( this.settings.deleteURL ) {
		    this.form.find('[name="nav_del"]').prop('disabled', false);
		} else {
		    this.form.find('[name="nav_del"]').prop('disabled', true);
		}
	    }
	    this.form.find('#recordIndicator').html(recordNumber + ' of ' + recordsLength);
	    this.form.find('[name="navTo"]').val('HERE');
	}
	// Event onFormActionReturn
	this.form.trigger('formActionReturn', [type])
    }
    function formActionError(errorMessage) {
	this.setState('error');
	this.setStatus(errorMessage);
	qcode.alert("Your changes could not be saved.<br>" + stripHTML(errorMessage));
	this.form.trigger('formActionError', [errorMessage]);
    }
    function formData(form) {
	var data = {};
	this.elements
	    .filter(function(){ return $(this).prop('name') != ""; })
	    .filter(function(){ return $(this).prop('type') != "checkbox" || $(this).attr('boolean') == "true" || $(this).is(':checked'); })
	    .filter(function(){ return $(this).prop('type') != "radio" || $(this).is(':checked'); })
	    .not('div.radio-group')
	    .each(function(){
		var name = $(this).attr('name');
		var value = "";
		if ( $(this).is('input') ) {
		    if ( $(this).prop('type') == "checkbox" ) {
			if ( $(this).attr('boolean') == "true" ) {
			    value = $(this).is(':checked');
			} else {
			    value = $(this).is(':checked') ? $(this).val() : '';
			}
		    } else {
			value = $(this).val();
		    }
		} else if ( $(this).is('textarea') ) {
		    value = $(this).val();
		} else if ( $(this).is('select') ) {
		    value = $(this).val();
		} else {
		    value = $(this).html();
		}
		if ( data[name] === undefined ) {
		    data[name] = value;
		} else if ( typeof data[name] !== 'object' ) {
		    data[name] = new Array(data[name], value);
		} else {
		    data[name].push(value);
		}

	    });
	return data;
    }
    function cancelDelayedSave() {
	if ( this.keyUpTimer !== undefined ) {
	    clearTimeout(this.keyUpTimer);
	}
	this.keyUpTimer = undefined;
    }
    // End of private methods

    // ============================================================

    // Provide jQuery plugin interface
    $.fn.dbForm = function(method) {
	var args = arguments;
	var forms = this;
	var returnVal;

	forms.each(function(){

            // Get the dbForm object for this element, create one if none exists
	    var dbForm = $(this).data('dbForm');
	    if ( ! dbForm ) {
		dbForm = new DbForm($(this));
		$(this).data('dbForm', dbForm);
	    }

            // With no arguments or an options object, call the init method
	    if ( typeof method == "object" || typeof method == "undefined" ) {
		dbForm.init.apply( dbForm, args );

	    } else if ( typeof dbForm[method] == "function" ) {
                // Method call
		returnVal = dbForm[method].apply( dbForm, Array.prototype.slice.call( args, 1 ) );

	    } else if ( typeof dbForm.settings[method] != "undefined" && args.length == 1 ) {
                // Get a setting value
		returnVal = dbForm.settings[method];

	    } else if ( typeof dbForm.settings[method] != "undefined" && args.length == 2 ) {
                // Set a setting value
		dbForm.settings[method] = args[1];

	    } else if ( typeof dbForm[method] != "undefined" && args.length == 1 ) {
                // Get a class variable
		returnVal = dbForm[method];

	    } else if ( typeof dbForm[method] != "undefined" && args.length == 2 ) {
                // Set a class variable
		dbForm[method] = args[1];

	    } else {
		$.error( 'Method or property ' + method + ' does not exist on jQuery.dbForm' );
	    }

            // Break the loop if we have a return value.
            if ( typeof returnVal != "undefined" ) {
                return false;
            }

	});
        // For methods with a return value and for getting setting values/class variables, return the value.
	if ( typeof returnVal != "undefined" ) {
	    return returnVal;

	} else {
            // Return the original jQuery object for chaining
	    return forms;
        }
    };
    // End of dbForm plugin
})(jQuery, window);


/* ==== jquery.dbFormCombo.js ==== */
;(function($, undefined) {
    $.widget('qcode.dbFormCombo', {
        options: {
	    searchURL: "",
	    searchLimit: 10,
	    comboHeight: 200
        },
        _create: function() {
            this.options.comboWidth = coalesce(this.options.comboWidth, this.element.outerWidth());
	    this.div = $('<div>')
	        .css({
		    'position': 'absolute',
		    'width': this.options.comboWidth,
		    'height': this.options.comboHeight,
		    'overflow': 'auto',
		    'border': "1px solid black",
		    'background': "white"
	        })
	        .appendTo('body')
	        .hide()
	        .hover(
		    function(){$(this).addClass('hover');},
		    function(){$(this).removeClass('hover');}
	        );
	    this.lastValue = this.element.val();
	    this._on({
	        'keydown': this._onKeyDown,
	        'keyup': this._onKeyUp,
	        'blur': this._onBlur
            });
	    this._on(this.div, {
                'click': this._divOnClick,
	        'mouseover': this._divOnMouseOver
            });
        },
	show: function(){
	    this.div
                .show()
	        .css({
		    'top': this.element.position().top + this.element.outerHeight(),
		    'left': this.element.position().left
	        });
	},
	hide: function() {
	    this.div.removeClass('hover').hide();
	},
	highlight: function(index) {
	    this.currentItem.css({
		'background': "",
		'color': ""
	    });
	    this.currentItem = this.div.children().eq(index);
	    this.currentItem.css({
		'background': "highlight",
		'color': "highlighttext"
	    });
	},
	select: function(index) {
	    var option = $(this.xmlDoc).find('records > record > option').eq(index);
	    this.element.val( option.text() );
	    this.lastValue = this.element.val();
	    this.hide();
	    this.currentItem = undefined;
	    this.element.focus();
	    this.element.trigger('comboSelect');
	},
	updateList: function() {
	    this.div.empty();
	    var dbForm = this;
	    this.xmlDoc.find('records > record > option').each(function(){
		var field = $(this);
		$('<div>')
		    .css({
			'width': "100%",
			'cursor': "pointer"
		    })
		    .text( $(field).text() )
		    .appendTo( dbForm.div );
	    });
	    if ( this.div.children().length >= this.options.searchLimit ) {
		this.div.append('.....');
	    }
	    this.currentItem = this.div.children().first();
	    this.highlight(0);
	},
        _onKeyDown: function(event) {
	    if ( typeof this.currentItem == "undefined" ) {
	        return;
	    }
	    var index = this.currentItem.index();
	    switch (event.which) {
	    case 38:
	        if ( index != 0 ) {
		    this.highlight(index - 1);
	        }
	        break;
	    case 40:
	        if ( index != (this.div.children().length - 1) ){
		    this.highlight(index + 1);
	        }
	        break;
	    case 13: //return
	        this.select(index);
	        event.preventDefault();
	        event.stopPropagation();
	        break;
	    case 9: //tab
	        this.select(index);
	        break;
	    }
        },
        _onKeyUp: function(event) {
	    if ( this.element.val() != this.lastValue ) {
	        this.lastValue = this.element.val();
	        this.search();
	    }
        },
        _onBlur: function(event) {
	    if ( ! this.div.is('.hover') ) {
	        this.hide();
	        this.currentItem = undefined;
                this.element.trigger('comboBlur');
	    }
        },
        _divOnClick: function(event) {
	    if ( ! this.div.is(event.target) ) {
	        this.select($(event.target).index());
	    }
        },
        _divOnMouseOver: function(event) {
	    if ( ! this.div.is(event.target) ) {
	        this.highlight($(event.target).index());
	    }
        },
        search: function() {
	    this.currentItem = undefined;
	    this.div.text('Searching ...');
	    this.show();
	    this.div.off('click.dbFormCombo');
	    this.div.off('mouseover.dbFormCombo');
	    this.xmlDoc = undefined;
	    var dbForm = this;
	    $.get(this.options.searchURL, {
	        'name': this.element.attr('name'),
	        'value': this.element.val(),
	        'searchLimit': this.options.searchLimit
	    }, "xml").success(function(data, textStatus, jqXHR){
	        dbForm.xmlDoc = $(data);
	        if ( dbForm.xmlDoc.find('error').length > 0 ) {
		    dbForm.div.text( dbForm.xmlDoc.find('error').text() );
	        } else {
		    if ( dbForm.xmlDoc.find('record').length > 0 ) {
		        dbForm.updateList();
		    } else {
		        dbForm.div.text("No Matches");
		    }
	        }
	    }).error(function(jqXHR, textStatus, errorThrown){
	        dbForm.div.text("Software Bug ! " + errorThrown);
	    });
        }
    });
})(jQuery);

/* ==== jquery.dbFormHTMLArea.js ==== */
function dbFormHTMLArea(oDiv) {
    var oDiv = $(oDiv);
    var oForm = oDiv.closest('form');
    $(oForm).on('submit',function () {
	var oInput = $('<input type="hidden">')
	    .attr('name', oDiv.attr('name'))
	    .val(oDiv.html());
	oForm.append(oInput);
    });

// End 
}

/* ==== jquery.dbFormImageCombo.js ==== */
// A widget containing a dbFormCombo which allows the user to choose a filename, and an image that is updated when they do.
;(function($, undefined) {
    $.widget('qcode.dbFormImageCombo', {
        options: {
            noImageURL: "/Graphics/noimage.png",
            loadingImageURL: "/Graphics/animated_progress.gif"
        },
        _create: function() {
            // Attempt to load the "loading" image and the "no image" image into the browser cache, if they aren't already there
            this.preLoader = new Image();
            this.preLoader.src = this.options.loadingImageURL;
            this.preLoader.src = this.options.noImageURL;

            // Load options from attributes
            this.input = this.element.find('input');
            this.options = $.extend({
	        searchURL: $(this.input).attr('searchURL'),
	        boundName: $(this.input).attr('boundName'),
	        searchLimit: $(this.input).attr('searchLimit'),
	        comboWidth: $(this.input).attr('comboWidth'),
	        comboHeight: $(this.input).attr('comboHeight'),
                imageURL: $(this.input).attr('imageURL')
            }, this.options);

            // Use dbFormCombo to handle the filename options combo
            this.input.dbFormCombo({
	        searchURL: this.options.searchURL,
	        boundName: this.options.boundName,
	        searchLimit: this.options.searchLimit,
	        comboWidth: this.options.comboWidth,
	        comboHeight: this.options.comboHeight
	    })

            // Update the image when a new filename is chosen
            this.image = this.element.find('img');
            this._on(this.input, {
                'comboSelect': this.loadImage,
                'comboBlur': this.loadImage
            });

            // Add a wrapper to cope with change in image size
            this.image.wrap('<div>');
            this.imageWrapper = this.image.parent();
            this.imageWrapper.addClass('image-wrapper');
        },
        loadImage: function() {
            // Attempt to load a new image based on the chosen filename
            var filename = this.input.val();
            if (filename) {
                this.image.attr('src', this.options.loadingImageURL);
                this._whenLoaded(function() {
                    this.image.attr('src', urlSet(this.options.imageURL, 'filename', filename));
                    this._whenLoaded(function() {
                        this.imageWrapper.stop().animate({
                            'width': this.image.width() + "px",
                            'height': this.image.height() + "px"
                        });
                    });
                });
            } else {
                this.image.attr('src', this.options.noImageURL);
                this._whenLoaded(function() {
                    this.imageWrapper.stop().animate({
                        'width': this.image.width() + "px",
                        'height': this.image.height() + "px"
                    });
                });
            }
        },
        _whenLoaded: function(callback) {
            // Call the callback function when the image is finished loading -
            // Some browsers will not fire a load event when the image is already cached.
            var img = this.image[0];
            if (img.complete || img.readyState == 'complete') {
                callback.call(this);
            } else {
                this.image.one('load', callback.bind(this));
            }
        }
    });
})(jQuery);

/* ==== jquery.dbGrid.js ==== */
/* dbGrid plugin
   Turns a table into an editable database grid
*/
;(function($, window, document, undefined){
    $.widget('qcode.dbGrid', {
	options: {
	    initialFocus: true,
	    enabled: true,
	    updateType: 'rowOut',
            deleteKey: 'delete',
            addURL: undefined,
            updateURL: undefined,
            deleteURL: undefined,
            dataURL: undefined
	},
	_create: function(){
	    var dbGrid = this;
	    
	    // Plugin Variables
	    dbGrid.colgroup = this.element.children('colgroup');
	    dbGrid.tbody = dbGrid.element.children('tbody');
	    dbGrid.currentCell = $([]);
	    dbGrid.editorDiv = $([]);
	    dbGrid.recCount = dbGrid.tbody.children('tr').size();
	  	    
	    // Update options with those set via table attributes
	    var attributes = ['initialFocus', 'enabled', 'updateType', 'addURL', 'updateURL', 'deleteURL','dataURL','deleteKey'];
	    $.each(attributes, function(i, name) {
		var value = dbGrid.element.attr(name);
		if ( value !== undefined ) {
                    if ( value === "true" ) {
                        dbGrid.option(name,true);
                    } else if ( value === "false" ) {
                        dbGrid.option(name,false);
                    } else {
		        dbGrid.option(name,value);
                    }
		}
	    });

	    // Create a container to attach editors
	    dbGrid.editorDiv = $('<div>');
	    dbGrid.editorDiv.addClass('db-grid-editor-container');
	    dbGrid.editorDiv.css('position','relative');
	    dbGrid.editorDiv.attr('forTable', dbGrid.element.attr('id'));
	    dbGrid.element.before(dbGrid.editorDiv);
	    dbGrid.element.add(dbGrid.editorDiv).wrapAll('<div class="db-grid-wrapper">');
	    
	    // Enable the grid for editing
	    if ( dbGrid.option('enabled') ) {
		// Event listeners - instead of separate event listeners for each cell, delegated event listeners are added to the dbGrid.
		dbGrid._on(dbGrid.tbody, {
		    'mousedown td': function(event){
			$(event.currentTarget).dbCell('onMouseDown');
		    },
		    'mouseup td': function(event){
			$(event.currentTarget).dbCell('onMouseUp');
		    },
		    'editorKeyDown td': function(event){
			$(event.currentTarget).dbCell('editorKeyDown', event);
		    },
                    'editorValueChange td': function(event){
                        $(event.currentTarget).dbCell('editorValueChange', event);
                    },
		    'editorBlur td': function(event){
			$(event.currentTarget).dbCell('editorBlur', event);
		    }
		});
		dbGrid._on(window, {
		    'beforeunload': dbGrid._onBeforeUnload,
		    'beforeprint': dbGrid._onBeforePrint
		});
		
		// Create New Row
		if ( dbGrid.option('addURL') ) {
		    dbGrid.createNewRow();
		}

		// initialFocus
		$('body').one('pluginsReady', function() {
		    var initialFocusCell = dbGrid.getInitialFocusCell();
		    if ( initialFocusCell.size() ) {
			dbGrid.cellChange(initialFocusCell);
		    }
		});

		// preformatted columns
		var rows = dbGrid.tbody.children('tr');
		dbGrid.colgroup.children('[type=text],[type=textarea]').each(function() {
		    var col = $(this);
		    var colIndex = col.index();
		    
		    // apply class to existing td elements in tbody
		    rows.children('td:nth-child(' + (colIndex + 1)  + ')').addClass('preformatted')

		    // apply class to this column that can later be inherited by new rows
		    col.addClass('preformatted')
		});
	    }
	},
	getInitialFocusCell: function(){
	    var dbGrid = this;
	  
	    if ( dbGrid.option('initialFocus') === 'end' ) {
		// Return the first editable cell in the last row
		initialFocusCell = $('tr:last > td:first', dbGrid.tbody);
		if ( ! initialFocusCell.dbCell('isEditable') ) {
		    initialFocusCell = dbGrid.cellRightOf(initialFocusCell);
		}
		if ( initialFocusCell.dbCell('isEditable') ) {
		    return initialFocusCell
		}
	    } else if ( dbGrid.option('initialFocus') === "start" || parseBoolean(dbGrid.option('initialFocus')) === true ) {
		// Focus on first editableCell
		var initialFocusCell = $('tr:first > td:first', dbGrid.tbody);
		if ( ! initialFocusCell.dbCell('isEditable') ) {
		    initialFocusCell = dbGrid.cellRightOf(initialFocusCell);
		}
		if ( initialFocusCell.dbCell('isEditable') ) {
		    return initialFocusCell
		}
	    }

	    return $([]);
	},
	getEditorDiv: function(){
	    return this.editorDiv;
	},
	incrRecCount: function(i){
	    this.recCount += i;
	},
	setNavCounter: function(rowIndex){
	    // Update the NavCounter in the status bar using 0-based rowIndex (if a status bar or equivalent exists)
	    var str = 'Record ' + (rowIndex + 1) + ' of ' + this.recCount;
            this.element.trigger('message', [{
                type: 'navCount',
                html: str
            }]);
	},
	getCurrentCell: function(){
	    return this.currentCell;
	},
	setCurrentCell: function(cell){
	    this.currentCell = cell;
	},
	cellChange: function(newCell){
	    // Perform any necessary cellOut/rowOut & cellIn/rowIn to begin editing newCell
	    var newRow = newCell.dbCell('getRow');
	    if ( ! this.currentCell.size() ) {
		// No cell is currently being edited
		newRow.dbRow('rowIn');
		newCell.dbCell('cellIn');
	    } else {
		var oldCell = this.currentCell;
		var oldRow = oldCell.dbCell('getRow');		
		if ( newRow.index() == oldRow.index() ) {
		    // Same Row 
		    oldCell.dbCell('cellOut');
		    newCell.dbCell('cellIn');
		} else {
		    // Row Change
		    oldCell.dbCell('cellOut');
		    oldRow.dbRow('rowOut');
		    newRow.dbRow('rowIn');
		    newCell.dbCell('cellIn');		    
		}
	    }
            newCell.dbCell('option', 'deleteKey', this.options.deleteKey);
	},
	find: function(colName, search){
	    // Search within ColName.
	    // If search string is found begin editing corresponding record.
	    // Otherwise raise an alert.
	    var dbGrid = this;
	    var found = false;
	    var colIndex = this.colgroup.children('col[name=' + colName + ']').index();
	    if ( colIndex !== -1 ) {
		// found matching col element
		var colCells = this.tbody.children('tr').children('td:nth-child(' + (colIndex + 1) + ')');
		
		colCells.each(function() {
		    cell = $(this);
		    if ( cell.text() == search ) {
			// found matching cell
			if ( ! cell.dbCell('isEditable') ) {
			    // move to next editable cell within the same row
			    cell = dbGrid.cellRightOf(cell, false);
			}
			if ( ! cell.dbCell('isEditable') ) {
			    // move to previous editable cell with the same row
			    cell = dbGrid.cellLeftOf(cell, false);
			}
			if ( cell.dbCell('isEditable') ) {
			    dbGrid.cellChange(cell);
			    found = true;
			}
			return false; // break out of $.each loop			
		    }
		});
	    }
	    if ( ! found ) {
		qcode.alert("Could not find " + escapeHTML(search) + ".");
	    }
	},
	save: function(row,async) {
	    if ( row === undefined || ! row.size() ) {
		var row = this.currentCell.closest('tr');
	    }
	    row.dbRow('save',async);
	},
	delete: function(row) {
	    if ( row === undefined || ! row.size() ) {
		var row = this.currentCell.closest('tr');
	    }
	    if ( row.dbRow('option', 'type') === 'update' && this.options.deleteURL !== undefined ) {
		qcode.confirm("Delete the current record?", function() {
		    row.dbRow('delete', false);
		});
	    }
	    if ( row.dbRow('option', 'type') == 'add'
                 && ( row.dbRow('getState') === 'dirty' || row.dbRow('getState') === 'error' )
               ) {
                var dbGrid = this;
		qcode.confirm("Delete the current row?", function() {
		    dbGrid.removeRow(row);
                    // Notify plugins such as statusFrame
                    dbGrid.element.trigger('message', [{
                        type: 'notice',
                        html: "Deleted."
                    }]);
		});
	    }
	},
	removeRow: function(row) {
	    // Try to move away from the current row
	    if ( row.find(this.currentCell).size() ) {
		// Move Down
		this.cellChange(this.cellBelow(this.currentCell));
	    }
	    if ( row.find(this.currentCell).size() ) {	
		// Still on same cell try to Move Up instead
		this.cellChange(this.cellAbove(this.currentCell));
	    }
            if ( row.find(this.currentCell).size() ) {
		// Failed to move away
		this.currentCell.dbCell('cellOut');
	    } 
	    row.remove();
	    this.element.trigger('resize');
	},
	createBlankRow: function(){
	    // Append a blank row to the dbGrid with type='update'
	    var row = $('<tr>');
	    var cols = this.colgroup.children('col');
	    for(var i=0;i<this.colgroup.children('col').size();i++) {
		var cell = $('<td>');
		var colClass = cols.eq(i).attr('class');
		if ( colClass ) {
		    cell.attr('class', colClass);
		}
		row.append(cell);
	    }
	    row.dbRow({'type': 'update'});

	    this.tbody.append(row);
            row.trigger('resize');
	    return row;
	},
	createNewRow: function(){
	    // Append a new row to the dbGrid with type='add' and with any defaultValues defined on the colgroup
	    var row = $('<tr>');
	    var cols = this.colgroup.children('col');
	    for(var i=0;i<this.colgroup.children('col').size();i++) {
		var cell = $('<td>');
		var defaultValue = cols.eq(i).attr('defaultValue');
		if ( defaultValue ) {
		    cell.text(defaultValue);
		}
		var colClass = cols.eq(i).attr('class');
		if ( colClass ) {
		    cell.attr('class', colClass);
		}
		row.append(cell);
	    }
	    row.dbRow({'type': 'add'});

	    this.tbody.append(row);
            row.trigger('resize');
	    return row;
	},
	requery: function(data, url){
	    // Remove all rows from the dbGrid and requery the dataURL to re-populate the grid
	    if ( url === undefined ) {
		url = this.option('dataURL');
	    }
            // Clear the message on plugins such as statusFrame
            this.element.trigger('message', [{
                type: 'notice',
                html: ''
            }]);
	    if ( this.currentCell.size() ) {
		this.currentCell.dbCell('cellOut');
	    }
	    // Remove all rows
	    this.tbody.children('tr').remove();
	    
	    httpPost(url,data,this._requeryReturn.bind(this),this._requeryReturnError.bind(this),false);
	},
	_requeryReturn: function(xmlDoc){
	    // Rebuild dbGrid from requeryReturn response
	    var dbGrid = this;

	    // Create rows for each record in xmlDoc
	    var records = $('records record', xmlDoc).each(function(){
		var rec = $(this);
		var row = dbGrid.createBlankRow();
		rec.children().each(function() {
		    var xmlNode = $(this);
		    var colName = xmlNode.prop('nodeName');
		    var value = xmlNode.text()
		    row.dbRow('setCellValue', colName, value);		    
		});	
	    });

	    // Update 'Calculated' elements within grid
	    $('records > calculated', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id, dbGrid.table).setObjectValue(value);
	    });

	    // Update html elements external to the grid
	    $('records > html', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id + ',[name="' + id + '"]').setObjectValue(value);
	    });
	    
	    if ( parseBoolean(dbGrid.option('enabled')) === true ) {
		// Create New Row
		if ( dbGrid.option('addURL') ) {
		    dbGrid.createNewRow();
		}

		// initialFocus
		var initialFocusCell = dbGrid.getInitialFocusCell();
		if ( initialFocusCell.size() ) {
		    dbGrid.cellChange(initialFocusCell);
		}
	    }
	},
	_requeryReturnError: function(errorMessage) {
            // Notify plugins such as statusFrame of the error
            this.element.trigger('message', [{
                type: 'error',
                html: errorMessage
            }]);
	    qcode.alert(errorMessage);
	},
	cellAbove: function(fromCell) {
	    // Return the first editable cell of the same column on previous rows. 
	    // Return fromCell if unable to find previous cell
	    var prevCell = $([]);
	    var prevRow = fromCell.closest('tr').prev('tr');
	    var colIndex = fromCell.index();

	    while ( prevRow.size() ) {
		prevCell = prevRow.children().eq(colIndex);
		if ( prevCell.size() && prevCell.dbCell('isEditable') && prevCell.dbCell('isTabStop') ) {
		    return prevCell;
		}
		prevRow = prevRow.prev('tr');
	    }
	    // Unable to find previous editable cell 
	    return fromCell;
	},
	cellRightOf: function(fromCell, searchNextRows) {
	    // Return the next editable cell (optionally search subsequent rows). 
	    // Return fromCell if unable to next editable cell
	    searchNextRows = searchNextRows === undefined ? true : searchNextRows;
	    var nextCell = fromCell.next('td');
	    
	    // Search for next editable cell on the same row
	    while ( nextCell.size() ) {
		if ( nextCell.dbCell('isEditable') && nextCell.dbCell('isTabStop') ) {
		    return nextCell;
		} 
		nextCell = nextCell.next('td');
	    }
	    if ( searchNextRows == true ) {
		// Search for next editable cell on any subsequent row.
		var nextRow = fromCell.closest('tr').next('tr');
		while ( nextRow.size() ) {
		    nextCell = nextRow.children('td').first();
		    while ( nextCell.size() ) {
			if ( nextCell.dbCell('isEditable') && nextCell.dbCell('isTabStop') ) {
			    return nextCell;
			}
			nextCell = nextCell.next('td');
		    }
		    nextRow = nextRow.next('tr');
		}
	    }
	    // Unable to find next editable cell 
	    return fromCell;
	},
	cellBelow: function(fromCell) {
	    // Return the first editable cell of the same column on subsequent rows.
	    var nextCell = $([]);
	    var nextRow = fromCell.closest('tr').next('tr');
	    var colIndex = fromCell.index();
	    
	    while ( nextRow.size() ) {
		nextCell = nextRow.children().eq(colIndex);
		if  (nextCell.size() && nextCell.dbCell('isEditable') && nextCell.dbCell('isTabStop') ) {
		    return nextCell;
		}
		nextRow = nextRow.next('tr');
	    }
	    // Unable to find next editable cell 
	    return fromCell;
	},
	cellLeftOf: function(fromCell, searchPreviousRows) {
	    // Return the previous editable cell (optionally search previous rows). 
	    // Return fromCell if unable to previous editable cell
	    searchPreviousRows = searchPreviousRows === undefined ? true : searchPreviousRows

	    var prevCell = fromCell.prev('td');
	    
	    // Search for previous editable cell on the same row
	    while ( prevCell.size() ) {
		if ( prevCell.dbCell('isEditable') && prevCell.dbCell('isTabStop') ) {
		    return prevCell;
		} 
		prevCell = prevCell.prev('td');
	    }
	    if ( searchPreviousRows == true ) {
		// Search for previous editable cell on any subsequent row.
		var prevRow = fromCell.closest('tr').prev('tr');
		while ( prevRow.size() ) {
		    prevCell = prevRow.children('td').last();
		    while ( prevCell.size() ) {
			if ( prevCell.dbCell('isEditable') && prevCell.dbCell('isTabStop') ) {
			    return prevCell;
			}
			prevCell = prevCell.prev('td');
		    }
		    prevRow = prevRow.prev('tr');
		}
	    }
	    // Unable to find previous editable cell 
	    return fromCell;
	},
	resize: function(colIndex, width){
	    // Resize the width of a column. Trigger resize event on window to resize any editors.
	    // 0-based colIndex
	    this.colgroup.children('col').eq(colIndex).width(width);
	    $(window).trigger('resize');
	},
	_onBeforeUnload: function(){
	    if ( ! this.currentCell.size() ) {	
		// No cells are begin edited
		return;
	    }
	    
	    var currentRow = this.currentCell.closest('tr');
	    if ( currentRow.dbRow('getState') !== 'current' ) {
		return "Your changes have not been saved.\nStay on the current page to correct.";
	    }    
	},
	_onBeforePrint: function(){
	    if ( this.currentCell.size() ) {
		this.currentCell.dbCell('cellOut');
	    }	
	}
    });
})(jQuery, window, document);

/* ==== jquery.dbRecord.js ==== */
// dbRecord plugin
// Part of a dbRecordSet. 
// A dbRecord represents a collection of dbFields.
;(function($, undefined){

    // Use the jQuery UI widget factory
    $.widget('qcode.dbRecord', {
	_create: function() {
	    // saveType option
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType, this.getRecordSet().dbRecordSet("option", "saveType"));
	    this.state = 'current';
	    if ( this.element.attr('recordType') === "add" ) {
		this.type = "add";
	    } else {
		this.type = "update";
	    }
	    if ( this.options.saveType === 'recordOut' ) {
		this._on({
		    'dbRecordOut': function() {
			if ( this.getState() === "dirty" ) {
			    this.save();
			}
		    }
		});
	    }
	},
        _destroy: function() {
            this.element.find('.editable').dbField('destroy');
        },
	getRecordSet: function() {
	    return this.element.closest('.record-set');
	}, 
	getState: function() {
	    return this.state;
	}, 
	setState: function(newState) {
	    // Set the state of this record
	    switch(newState) {
	    case "updating":
	    case "error":
	    case "current":
	    case "dirty":
		this.element.removeClass("current dirty updating error");
		this.element.addClass(newState);
		this.state = newState;
		this.getCurrentField().dbField('editor', 'repaint');
		this.element.trigger('dbRecordStateChange');
		break;
	    default:
		$.error('Invalid state');
	    }
	},
	getErrorMessage: function() {
	    return this.error;
	},
	save: function(async) {
	    // Save this record
	    if ( this.getState() === "updating" ) {
		return false;
	    }
	    var url = this.getRecordSet().attr(this.type + "URL");
	    if ( ! url ) {
		$.error('Could not '+this.type+' record - no url provided');
	    }
	    this.action(this.type, url, async);
	}, 
	delete: function(async) {
	    // Delete this record
	    if ( this.getState() === "updating" ) {
		return false;
	    }
	    var url = this.getRecordSet().attr('deleteURL');
	    if ( ! url ) {
		$.error('Could not delete record - no url provided');
	    }
	    this.action('delete', url, async);
	}, 
	action: function(action, url, async) {
	    // Perform the given action (add, update, delete), by submitting record data to the server.
	    var async = coalesce(async, true);

	    this.setState('updating');
	    this.getCurrentField().dbField('write');

	    var urlPieces = splitURL(url);
	    var path = urlPieces.path;
	    var data = urlPieces.data;
	    // Look for any fields (elements with attr name) and store name/value in data
	    this.element.find('[name]').each(function(i, field) {
		var name = $(field).dbField('getName');
		if ( $(field).dbField('getType') == 'htmlarea' ) {
		    // xml cannot contain raw html, so escape/unescape field value.
		    var value = escapeHTML($(field).dbField('getValue'));
		} else {
		    var value = $(field).dbField('getValue');
		}
		// If name is used more than once store values in array
		if ( typeof data[name] == "undefined" ) {
		    data[name] = value;
		} else if ( Array.isArray(data[name]) ) {
		    data[name].push(value);
		} else {
		    data[name] = new Array(data[name], value);
		}
	    });
	    // Post
	    httpPost(path, data, this._actionReturn.bind(this, action), this._actionReturnError.bind(this, action), async);
	    // custom event 
	    this.element.trigger('dbRecordAction', [action]);
	}, 
	getCurrentField: function() {
	    // Return the field currently being edited (or an empty jQuery object)
	    return this.element.find(this.getRecordSet().dbRecordSet('getCurrentField'));
	},
	setValues: function(xmlDoc) {
	    // Takes an xml document/fragment and attempts to match the nodes to fields in the record, setting the values of those elements.
	    this.element.find('[name]').each(function(i, field) {
		var node = $(xmlDoc).find('records > record > ' + $(field).dbField('getName'));
		if ( node.length > 0 ) {
		    if ( $(field).dbField('getType') == 'htmlarea') {
			// xml cannot contain raw html, so escape/unescape it.
			$(field).dbField('setValue', unescapeHTML(node.text()));
		    } else {
			$(field).dbField('setValue', node.text());
		    }
		}
	    });
	    this.element.trigger('resize');
	}, 
	recordIn: function(event) {
	    this.getRecordSet().dbRecordSet('setCurrentRecord', this.element);
	    this.element.trigger('dbRecordIn', event);
	}, 
	recordOut: function(event){
	    this.getRecordSet().dbRecordSet('setCurrentRecord', null);
	    this.element.trigger('dbRecordOut', event);
	},
	_actionReturn: function(action, xmlDoc, status, jqXHR) {
	    // Called on successfull return from a server action (add, update or delete)
	    this.setState('current');
	    this.error = undefined;
	    switch(action){
	    case "update":
		this.setValues(xmlDoc);
		break;
	    case "add":
		// Once added, a record becomes an updatable record
		this.type = "update";
		this.setValues(xmlDoc);
		break;
	    }

	    // For add and update, we want to handle incoming data before triggering event handlers. For delete, we want event handlers to trigger first.
	    this.element.trigger('dbRecordActionReturn', [action, xmlDoc, status, jqXHR]);

	    if ( action == "delete" ) {
		// When a record is deleted, remove it from the DOM.
		var recordSet = this.getRecordSet();
		this.destroy();
		this.element.remove();
		recordSet.trigger('resize');
	    }
	},
	_actionReturnError: function(action, message, type) {
	    // Called when a server action returns an error
	    this.setState('error');
	    if ( type != 'USER' ) {
		qcode.alert(message);
	    }
	    this.error = message;
	    this.element.trigger('dbRecordActionReturnError', [action, message, type]);
	}
    });
})(jQuery);

/* ==== jquery.dbRecordSet.js ==== */
// dbRecordSet plugin
// Provides an ui for editable database records.
;(function($, window, undefined){

    // Use the jQuery UI widget factory.
    $.widget('qcode.dbRecordSet', {
	options: {
	    saveType: "recordOut" /*recordOut or fieldOut*/
	},
	_create: function(){
	    // check saveType attr
	    this.options.saveType = coalesce(this.element.attr('saveType'), this.options.saveType);
	    // Ensure recordSet class is set
	    this.element.addClass('record-set');

	    // Elements with class "editable" are editable fields.
	    this._on({
		'click .editable': function(event) {
		    $(event.currentTarget).dbField('onClick', event);
		},
		'editorKeyDown .editable': function(event) {
		    $(event.currentTarget).dbField('editorKeyDown', event);
		},
                'editorValueChange .editable': function(event) {
                    $(event.currentTarget).dbField('editorValueChange', event);
                },
		'editorBlur .editable': function(event) {
		    $(event.currentTarget).dbField('editorBlur', event);
		}
	    });
	    this._on(window, {
		'beforeunload': this._onBeforeUnload,
		'beforeprint': this._onBeforePrint,
	    });

	    // Initialize as empty jQuery object.
	    this.currentField = $([]);
	    this.currentRecord = $([]);
	},
        _destroy: function() {
            this.currentField.dbField('fieldOut');
            this.element.find('.record').dbRecord('destroy');
        },
	save: function(aysnc) {
	    // Save the current record
	    this.getCurrentRecord().dbRecord('save', async);
	}, 
	getCurrentRecord: function() {
	    return this.currentRecord;
	},
	setCurrentRecord: function(newRecord) {
	    this.currentRecord = $(newRecord);
	},
	getCurrentField: function() {
	    return this.currentField;
	}, 
	setCurrentField: function(newField) {
	    this.currentField = $(newField);
	}, 
	fieldChange: function(toField) {
	    //
	    var currentRecord = this.getCurrentRecord();
	    var newRecord = toField.dbField('getRecord');

	    this.getCurrentField().dbField('fieldOut');
	    if ( ! currentRecord.is(newRecord) ) {
		currentRecord.dbRecord('recordOut');
	    }

	    toField.dbField('fieldIn');
	    if ( ! currentRecord.is(newRecord) ) {
		newRecord.dbRecord('recordIn');
	    }
	},
	_onBeforeUnload: function(event){
	    // Before leaving the page, offer the user a chance to save changes.
	    var records = this.element.find('.record');
	    for (var i = 0; i < records.length; i++) {
		var record = records.eq(i);
		if ( record.dbRecord('getState') === 'dirty' || record.dbRecord('getState') === 'error' ) {
		    return "Your changes have not been saved.\nStay on the current page to correct.";
		}
	    }
	},
	_onBeforePrint: function(event){
	    // Before printing, stop editing
	    this.getCurrentField().dbField('fieldOut');
	    this.getCurrentRecord().dbRecord('recordOut');
	}
    });
})(jQuery, window);


/* ==== jquery.dbRow.js ==== */
(function($, window, document, undefined){
    $.widget("qcode.dbRow", {
	options: {
	    'type': 'update'
	},
	_create: function(){
	    this.state = 'current';
	    this.error = undefined;
	},
	getGrid: function(){
	    return this.element.closest('table');
	},
	getColgroup: function(){
	    return this.getGrid().children('colgroup');
	},
	getCurrentCell: function() {
	    return this.getGrid().dbGrid('getCurrentCell');
	},
	getState: function(){
	    return this.state;
	},
	getRowData: function(){
	    // Return object with name/value pairs of row data
	    var data = {};
	    this.element.children('td').each(function() {
		var cell = $(this);
		var colName = cell.dbCell('getCol').attr('name');
		var cellValue = cell.dbCell('getValue');
		data[colName] = cellValue;
	    });
	    return data;
	},
	setState: function(newState){
	    // Set the state of this row
	    var grid = this.getGrid();
	    var oldState = this.state;
	    var message;
            var messageType = 'notice';
	    
	    switch (newState) {
	    case 'dirty':
		if ( oldState === 'current' && this.option('type') === 'add' ) {
		    // Append New Row
		    grid.dbGrid('createNewRow');
		}
		if ( oldState === 'current' || oldState === 'error' ) {
		    var span = $('<span>').text('save').click(this.save.bind(this)).addClass('action save');
		    var message = $('<span>').text('Editing ... to ').append(span).append(', type Ctrl+S');
		}
		break;
	    case 'current': 
		message = "Saved.";
		break;
	    case 'updating': 
		message = "Updating ...";
		break;
	    case 'error': 
		message = this.error;
                messageType = 'error';
		break;
	    default:
		$.error('Invalid state');
		return;
	    }

	    this.element.removeClass("current dirty updating error");
	    this.element.addClass(newState);
            // Notify plugins such as statusFrame
            this.element.trigger('message', [{
                type: messageType,
                html: message
            }]);
	    this.state = newState;
	    this.getCurrentCell().dbCell('editor', 'repaint');
	    this.element.trigger('dbRowStateChange');
	},
	rowIn: function(){  
	    // Update NavCounter and statusBarMsg
	    var row = this.element;
	    var grid = this.getGrid();

	    // Custom Event: Trigger any dbRowIn events bound to this table
	    row.trigger('dbRowIn');

	    if ( this.error ) {
                this.element.trigger('message', [{
                    type: 'error',
                    html: this.error
                }]);
	    }
	    grid.dbGrid('setNavCounter', row.index());
	},
	rowOut: function(){
	    // Save row if dirty
	    // Custom Event: Trigger any dbRowOut events bound to this table
	    this.element.trigger('dbRowOut');
	    
	    if ( this.state === 'dirty' ) {
		this.save();
	    }
	},
	save: function(async){
	    // Save this row, using an add or update url as appropriate
	    var grid = this.getGrid();

	    if ( this.state === "updating" ) {
		return false;
	    }
	    switch(this.option('type')){
	    case "update":
		var url = grid.dbGrid('option', "updateURL");
		break;
	    case "add":
		var url = grid.dbGrid('option', "addURL");
		break;
	    }
	    if ( ! url ) {
		$.error('Could not ' + this.option('type') + ' record - no url provided');
	    }
	    this.action(this.option('type'), url, async);
	},
	action: function(action, url, async){
	    // Perform the given action (add, update, delete), by submitting row data to the server.
	    var grid = this.getGrid();

	    async = coalesce(async, true);
	    if ( action === 'add' || action === 'update' || action === 'delete' ) {
		this.setState('updating');
	    }
	    grid.dbGrid('getCurrentCell').dbCell('write');

	    var urlPieces = splitURL(url);
	    var path = urlPieces.path;
	    var data = $.extend(urlPieces.data, this.getRowData());
	    httpPost(path, data, this.actionReturn.bind(this, action), this.actionReturnError.bind(this, action), async);
	    this.element.trigger('dbRowAction', [action]);
	},
	actionReturn: function(action, xmlDoc, status, jqXHR){
	    // Called on successful return from a server action (add, update or delete)
	    var grid = this.getGrid();

	    this.xmlSetValues(xmlDoc);
	    this.error = undefined;

	    switch(action){
	    case "update":
		this.setState('current');
		break;
	    case "add":
		// Once added, a record becomes an updatable record
		this.option('type', "update");
		this.setState('current');
		grid.dbGrid('incrRecCount', 1);
		break;
	    }

	    // For add and update, we want to handle incoming data before triggering event handlers. For delete, we want event handlers to trigger first.
	    this.element.trigger('dbRowActionReturn', [action, xmlDoc, status, jqXHR]);

	    if ( action == "delete" ) {
		// When a record is deleted, remove it from the DOM.	
		grid.dbGrid('removeRow',this.element)
		grid.dbGrid('incrRecCount', -1);
                grid.trigger('message', [{
                    type: 'notice',
                    html: "Deleted."
                }]);
		this.destroy();
	    }
	},
	actionReturnError: function(action,errorMessage, errorType){
	    this.error = errorMessage;
	    this.setState('error');
	    if ( errorType != 'USER' ) {
		qcode.alert(errorMessage);
	    }
	},
	xmlSetValues: function(xmlDoc) {
	    // Update row, calculated & external html values,
	    // Display info and alert messages
	    var grid = this.getGrid();
	    var currentCell = grid.dbGrid('getCurrentCell')
	    var dbRow = this;

	    // Update row with record values in xmlDoc response
	    var rec = $('records record', xmlDoc).first();
	    if ( rec.size() ) {
		rec.children().each(function() {
		    var xmlNode = $(this);
		    var colName = xmlNode.prop('nodeName');
		    var value = xmlNode.text()
		    dbRow.setCellValue(colName, value);		    
		});		
		if ( currentCell.size() && this.element.find(currentCell).size() ) {
		    currentCell.dbCell('cellIn', 'end');
		}
	    }

	    // Update 'Calculated' elements within grid
	    $('records > calculated', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		$('#' + id, grid).setObjectValue(value);
	    });

	    // Update html elements external to the grid
	    $('records > html', xmlDoc).children().each(function() {
		xmlNode = $(this);
		var id = xmlNode.prop('nodeName');
		var value = xmlNode.text();
		behave(
                    $('#' + id + ',[name="' + id + '"]').setObjectValue(value)
                );
	    });

	    // Display info message in statusBar
	    var xmlNode = $('records > info', xmlDoc);
	    if ( xmlNode.size() ) {
                this.element.trigger('message', [{
                    type: 'info',
                    html: xmlNode.text()
                }]);
	    }

	    // Alert
	    var xmlNode = $('records > alert', xmlDoc);
	    if ( xmlNode.size() ) {
		qcode.alert(xmlNode.text());
	    }
	},
	setCellValue: function(colName, value){
	    // Set the value of the cell corresponding to colName.
	    var colIndex = $('col[name='+colName+']', this.getColgroup()).index();
	    if ( colIndex !== -1 ) {
		var cell = this.element.children('td').eq(colIndex);
		cell.dbCell('setValue',value);
	    }
	},
	delete: function(async){
	    var grid = this.getGrid();
	    var url = grid.dbGrid('option', 'deleteURL');
	    if ( ! url ) {
		$.error('Could not delete record - no url provided');
	    }
	    this.action('delete', url, async); 
	}
    });
})(jQuery, window, document);

/* ==== jquery.delayedGroupHover.js ==== */
;(function($, window, undefined) {
    // Delayed Group Hover plugin.
    // Treats all the elements in the current jQuery object as a single "group";
    // Invokes a user-defined callback when the user hovers over elements of the current jQuery object for more than a given time,
    // or when they hover out of all the elements of the current jQuery object for more than a given time.
    $.fn.delayedGroupHover = function(options) {
	// hoverIn and hoverOut are optional callback functions.
	var options = $.extend({
	    inTime: 200,
	    outTime: 200,
	    hoverIn: undefined,
	    hoverOut: undefined
	}, options);

	var timer;
	var group = this;
	function mouseEnter(event) {
	    if ( $(event.relatedTarget).is(group) ) {
		// mouse was already in the group
		return;
	    }
	    if ( timer !== undefined ) {
		// reset the timer
		window.clearTimeout(timer);
	    }
	    if ( typeof options.hoverIn === "function" ) {
		// schedule the hoverIn function to be called
		timer = window.setTimeout(options.hoverIn.bind(group), options.inTime);
	    }
	}
	function mouseLeave(event) {
	    if ( $(event.relatedTarget).is(group) ) {
		// mouse isn't leaving the group
		return;
	    }
	    if ( timer !== undefined ) {
		// reset the timer
		window.clearTimeout(timer);
	    }
	    if ( typeof options.hoverOut === "function" ) {
		// schedule the hoverOut function to be called
		timer = window.setTimeout(options.hoverOut.bind(group), options.outTime);
	    }
	}
	// bind events
	group
	    .on('mouseenter', mouseEnter)
	    .on('mouseleave', mouseLeave);
    }
})(jQuery, window);

/* ==== jquery.delayedHover.js ==== */
;(function($, window, undefined) {
    // Delayed hover plugin.
    // Triggers custom events "delayedHoverIn" and "delayedHoverOut".
    // Optionally takes a selector which tracks delayed mouse events on each element.
    $.fn.delayedHover = function(options){
	var options = $.extend({
	    inTime: 200,
	    outTime: 200,
	    selector: undefined
	}, options);

	function mouseEnter(event) {
	    var target = $(this);
	    var timer = target.data('delayedHoverTimer');
	    if ( timer !== undefined ) {
		// reset the timer
		window.clearTimeout(timer);
	    }
	    // schedule event to be triggered
	    timer = window.setTimeout(function() {
		target.trigger('delayedHoverIn');
	    }, options.inTime)
	    target.data('delayedHoverTimer', timer);
	}
	function mouseLeave(event) {
	    var target = $(this);
	    var timer = target.data('delayedHoverTimer');
	    if ( timer !== undefined ) {
		window.clearTimeout(timer);
	    }
	    timer = window.setTimeout(function() {
		target.trigger('delayedHoverOut');
	    }, options.outTime)
	    target.data('delayedHoverTimer', timer);
	}

	if ( options.selector === undefined ) {
	    $(this)
		.on('mouseenter', mouseEnter)
		.on('mouseleave', mouseLeave);
	} else {
	    // Apply to each element matching the selector
	    $(this)
		.on('mouseenter', options.selector, mouseEnter)
		.on('mouseleave', options.selector, mouseLeave);
	}
    }
})(jQuery, window);

/* ==== jquery.enableDisable.js ==== */
// enable and disable plugins. Enable or disable links, buttons, etc.
(function ($) {
    $.fn.disable = function () {
	return $(this).each(function () { 
	    switch($(this)[0].nodeName.toUpperCase()) {
	    case "A":
		jQuery.data($(this)[0],"href",$(this).attr("href"));
		$(this).removeAttr('href');
	    default:
		$(this).attr('disabled', 'disabled').addClass('disabled');
	    }
	});
    };
    $.fn.enable = function () {
	return $(this).each(function () { 
	    switch($(this)[0].nodeName.toUpperCase()) {
	    case "A":
		if ( typeof jQuery.data($(this)[0],"href")!="undefined" ) {
		    $(this).attr("href",jQuery.data($(this)[0],"href"));
		}
	    default:
		$(this).removeAttr('disabled').removeClass("disabled"); 
	    }
	});
    };
})(jQuery);

/* ==== jquery.ganttChart.js ==== */
// ganttChart plugin. Call on a table to make it into a gantt chart.
// options -
//  width: any css width, width of the entire chart (table + calendar)
//  headerHeight: integer, height of the chart header
//  columns: object mapping keys to any jQuery selector/element/elementArray/object
//   use "columns" to match columns containing the row start dates, finish dates and bar colors
//   rowID to give each task a unique ID, dependen(cy/t)IDs hold space-separated list of IDs to reference.
//  pxPerDay: integer, width of 1 day in the calendar
//  barHeight: integer, px height of the bars
;(function($, undefined) {
    jQuery.widget('qcode.ganttChart', {
        options: {
            width: "100%",
            headerHeight: 40,
            columns: {
                rowID: "[name=task_id]",
                dependencyIDs: "[name=dependency_ids]",
                dependentIDs: "[name=dependent_ids]",
                startDate: "[name=start_date]",
                finishDate: "[name=finish_date]",
                barColor: "[name=bar_color]"
            },
            pxPerDay: 15,
            barHeight: 10
        },
        _create: function() {
            // Get options from custom attributes
            $.each(this.options, (function(name, value) {
                this.options[name] = coalesce(this.element.attr(name), value);
            }).bind(this));
            this.options = $.extend(this.element.data(this.widgetName), this.options);

            // Initialise some properties
            this.bars = [];
            this.table = this.element;
            this.rows = this.table.children('tbody').children('tr');
            this.drawTimeout = undefined;

            // Wrap the whole thing in a div
            this.table.wrap('<div class="gantt-chart wrapper">');
            this.wrapper = this.table.parent();
            this.wrapper.css('width', this.options.width);

            // Create a scrolling window for the calendar
            this.calendarFrame = $('<div class="calendar-frame">')
                .css({
                    left: this.table.outerWidth(),
                    right: 0,
                    top: 0,
                    bottom: 0
                })
                .insertAfter(this.table);
            var scrollBarWidth = this.calendarFrame.height() - this.calendarFrame[0].scrollHeight;

            // Record the old margin in case we want to destroy this widget
            this.oldMarginTop = this.table.css('margin-top');
            this.oldMarginBottom = this.table.css('margin-bottom');
            this.table.css({
                'margin-top': this.options.headerHeight - parseInt(this.table.css('border-top-width')) - this.table.find('thead').outerHeight(),
                'margin-bottom': scrollBarWidth
            });

            // Create a canvas for the calendar
            this.calendar = $('<canvas class="calendar">').appendTo(this.calendarFrame);

            // In case the table is a dbGrid, listen for updates.
            this._on({'dbRowActionReturn': function(event, action, xmlDoc, status, jqXHR) {
                var ganttChart = this;
                $('records other_record', xmlDoc).each(function(i, record) {
                    var taskID = $(record).children('task_id').text();
                    var barColor = $(record).children('bar_color').text();
                    ganttChart._getRowByID(taskID).dbRow('setCellValue', 'bar_color', barColor);
                });
                var targetRowIndex = $(event.target).index();
                this.rowUpdate(targetRowIndex);
                this.getDependentRows(targetRowIndex).each(function(i, row) {
                    ganttChart.rowUpdate($(row).index());
                });
                this.getDependencyRows(targetRowIndex).each(function(i, row) {
                    ganttChart.rowUpdate($(row).index());
                });
            }});

            // When the table is resized, check whether the table width or any row height has changed
            // Redraw as needed
            var rowHeights = [];
            this.element.find('tr').each(function(i, row) {
                rowHeights[i] = $(row).height();
            });
            var tableWidth = this.element.width();
            this._on({'resize': function(event) {
                var rowHeightChanged = false;
                var tableWidthChanged = false;
                this.element.find('tr').each(function(i, row) {
                    var height = $(row).height();
                    if ( rowHeights[i] != height ) {
                        rowHeights[i] = height;
                        rowHeightChanged = true;
                    }
                });
                if ( tableWidth != this.element.width() ) {
                    tableWidth = this.element.width();
                    this.calendarFrame.css('left', this.table.outerWidth());
                }
                if ( rowHeightChanged ) {
                    this.draw();
                }
            }});

            this.draw();
        },
        rowUpdate: function(rowIndex) {
            // Update a single row
            var ganttChart = this;
            if ( this.bars[rowIndex] !== undefined ) {
                this.bars[rowIndex].remove();
            }
            this.bars[rowIndex] = undefined;
            var rowData = ganttChart._getRowData(rowIndex);
            var Task = ganttChart.constructor.Task;
            if ( rowData !== false ) {
                var bar = new Task(ganttChart.calendar, rowData);
                ganttChart.calendar.calendar('addObject', bar);
                ganttChart.bars[rowIndex] = bar;
            }
            // Redraw the calendar
            this.calendar.calendar('draw');

            // Google Chrome bug fix hack
            this.calendarFrame.scrollLeft(this.calendarFrame.scrollLeft() + 1);
            this.calendarFrame.scrollLeft(this.calendarFrame.scrollLeft() - 1);
        },
        _getRowData: function(rowIndex) {
            // Get the data for a single row, as used by the Tasks object
            var ganttChart = this;
            var startDate = ganttChart._getRowStartDate(rowIndex);
            var finishDate = ganttChart._getRowFinishDate(rowIndex);

            if ( Date.isValid(startDate) && Date.isValid(finishDate) ) {
                var dependents = [];
                var dependencies = [];

                ganttChart.getDependentRows(rowIndex).each(function(i, row) {
                    var row = $(row);
                    var cell = row.children().first();
                    var verticalPosition = row.positionRelativeTo(ganttChart.wrapper).top + (row.height() / 2);
                    var date = ganttChart._getRowStartDate(row.index());
                    dependents.push({
                        date: date,
                        verticalPosition: verticalPosition
                    });
                });

                ganttChart.getDependencyRows(rowIndex).each(function(i, row) {
                    var row = $(row);
                    var cell = row.children().first();
                    var verticalPosition = row.positionRelativeTo(ganttChart.wrapper).top + (row.height() / 2);
                    var date = ganttChart._getRowFinishDate(row.index());
                    dependencies.push({
                        date: date,
                        verticalPosition: verticalPosition
                    });
                });

                var row = this.rows.eq(rowIndex);
                var cell = row.children().first();
                var rowHeight = row.height();
                if ( row.css('border-collapse') === "collapse" ) {
                    rowHeight += (parseInt(cell.css('border-top-width')) + parseInt(cell.css('border-bottom-width'))) / 2;
                }

                var verticalPosition = row.positionRelativeTo(ganttChart.wrapper).top + (rowHeight / 2);

                return {
                    startDate: startDate,
                    finishDate: finishDate,
                    verticalPosition: verticalPosition,
                    color: ganttChart._getCellValue('barColor', rowIndex),
                    dependencies: dependencies,
                    dependents: dependents,
                    rowHeight: rowHeight,
                    row: row
                }
            } else {
                return false
            }
        },
        draw: function(async) {
            // Redraw the gantt chart. If async is true (default),
            // wait until all event handlers are finished
            // so that we only redraw once.
            var async = coalesce(async, true);
            var ganttChart = this;
            if ( async ) {
                if ( this.drawTimeout === undefined ) {
                    this.drawTimeout = window.setZeroTimeout(function() {
                        ganttChart._drawNow();
                        ganttChart.drawTimeout = undefined;
                    });
                }
            } else {
                this._drawNow();
                window.clearZeroTimeout(this.drawTimeout);
                this.drawTimeout = undefined;
            }
        },
        _drawNow: function() {
            // Draw (or redraw) this gantt chart
            var ganttChart = this;
            this.calendarFrame.css('left', this.table.outerWidth());

            // Calculate a suitable range of dates for the calendar
            var minDate;
            var maxDate;
            this.rows.each(function(rowIndex, domRow) {
                var startDate = ganttChart._getRowStartDate(rowIndex);
                var finishDate = ganttChart._getRowFinishDate(rowIndex);
                
                if ( Date.isValid(startDate) && Date.isValid(finishDate) ) {
                    if ( Date.isValid(minDate) && Date.isValid(maxDate) ) {
                        minDate = Date.min(minDate,startDate);
                        maxDate = Date.max(maxDate,finishDate);
                    } else {
                        minDate = startDate;
                        maxDate = finishDate;
                    }
                }
            });
            if ( ! Date.isValid(maxDate) || ! Date.isValid(minDate) ) {
                var minDate = new Date(Date.today.getTime());
                var maxDate = new Date(Date.today.getTime());
                minDate.incrDays(-7);
                maxDate.incrDays(7);
            }
            maxDate.incrDays(7);
            var startDate = minDate.getWeekStart();
            var finishDate = maxDate.getWeekEnd();

            // Initialize the calendar
            this.calendar.calendar({
                bodyHeight: this.table.find('tbody').outerHeight(),
                headerHeight: this.options.headerHeight,
                startDate: startDate,
                finishDate: finishDate,
                pxPerDay: this.options.pxPerDay,
                barHeight: this.options.barHeight
            });

            // Draw the bars (remove any existing bars first)
            $.each(this.bars, function(i, bar) {
                if ( bar !== undefined ) {
                    bar.remove();
                }
            });
            this.bars = [];

            var Task = ganttChart.constructor.Task;
            this.rows.each(function(rowIndex, domRow) {
                var rowData = ganttChart._getRowData(rowIndex);
                if ( rowData !== false ) {
                    var bar = new Task(ganttChart.calendar, rowData);
                    ganttChart.calendar.calendar('addObject', bar);
                    ganttChart.bars[rowIndex] = bar;
                } else {
                    ganttChart.bars[rowIndex] = undefined;
                }
            });

            // Draw the calendar
            this.calendar.calendar('draw');

            // Google Chrome bug fix hack
            this.calendarFrame.scrollLeft(this.calendarFrame.scrollLeft() + 1);
            this.calendarFrame.scrollLeft(this.calendarFrame.scrollLeft() - 1);
        },
        _getRowStartDate: function(rowIndex) {
            // Get the start date of a given row
            return new Date(this._getCellValue('startDate', rowIndex));
        },
        _getRowFinishDate: function(rowIndex) {
            // Get the finish date of a given row
            return new Date(this._getCellValue('finishDate', rowIndex));
        },
        _getCellValue: function(colName, rowIndex) {
            // Using the column selector from this.options.columns with the key colName,
            // find the first matching cell in the indexed row, and return the contents.
            return this.rows.eq(rowIndex).findByColumn(this.options.columns[colName]).text();
        },
        _getRowByID: function(ID) {
            // Search the rowID column for ID, return the first matching row.
            var row = $([]);
            this.rows.findByColumn(this.options.columns.rowID).each(function(i, cell) {
                if ($(cell).text() == ID) {
                    row = $(cell).parent();
                    return false;
                }
            });
            return row;
        },
        getDependentRows: function(rowIndex) {
            var ganttChart = this;
            var rows = [];
            var list = ganttChart._getCellValue('dependentIDs', rowIndex);
            if ( list.length > 0 ) {
                $.each(list.split(' '), function(i, rowID) {
                    var row = ganttChart._getRowByID(rowID);
                    if ( row.length !== 1 ) {
                        console.log('Could not find taskID ' + rowID + ' from row index ' + rowIndex);
                        return;
                    }
                    rows.push(row[0]);
                });
            }
            return $(rows);
        },
        getDependencyRows: function(rowIndex) {
            var ganttChart = this;
            var rows = [];
            var list = ganttChart._getCellValue('dependencyIDs', rowIndex);
            if ( list.length > 0 ) {
                $.each(list.split(' '), function(i, rowID) {
                    var row = ganttChart._getRowByID(rowID);
                    if ( row.length !== 1 ) {
                        console.log('Could not find taskID ' + rowID + ' from row index ' + rowIndex);
                        return;
                    }
                    rows.push(row[0]);
                });
            }
            return $(rows);
        },
        newDateHighlighter: function(date, style) {
            // Create and return a new date highlighter object
            return this.calendar.calendar('newDateHighlighter', {date: date, color: style});
        },
        widget: function() {
            return this.wrapper;
        },
        getCalendar: function() {
            return this.calendar;
        },
        destroy: function() {
            // Destroy this widget and return the table to its initial state
            this.bars.each(function() {
                this.remove();
            });
            this.calendar.calendar('destroy').remove();
            this.calendarFrame.remove();
            this.table.unwrap().css('margin-top', this.oldMarginTop);
        }
    });
    // End of ganttChart widget
    // ============================================================


    // ============================================================
    // class Task
    // extends jQuery.qcode.calendar.Bar
    // A horizontal bar representing a single task, provides row highlighting and draws lines to dependencies
    // Takes dependencies and dependents as arrays of objects with properties "date" and "verticalPosition"
    // ============================================================
    // Wait for first instantiation to initialise the class, to ensure the superclass is initialised first
    $.qcode.ganttChart.Task = function(calendarCanvas, options) {
        var superProto = $.qcode.calendar.Bar.prototype;

        // Constructor function
        var Task = function(calendarCanvas, options) {
            superProto.constructor.call(this, calendarCanvas, options);
            this.options.rowHeight = coalesce(this.options.rowHeight, this.options.barHeight * 2);
            this.highlighted = false;
            this
                .on('mouseenter', function() {
                    this.calendarCanvas.calendar('draw');
                })
                .on('mouseleave', function() {
                    this.calendarCanvas.calendar('draw');
                })
                .on('click', function() {
                    this.options.row.data('highlighted', ! this.options.row.data('highlighted'));
                    this.calendarCanvas.calendar('draw');
                });
        }

        // Properties and methods
        Task.prototype = $.extend(Object.create(superProto), {
            constructor: Task,
            options: $.extend(Object.create(superProto.options), {
                rowHeight: undefined,
                dependencyColor: 'grey',
                dependentColor: 'grey',
                highlightColor: 'lightyellow',
                highlightEdge: 'lightgrey',
                dependencies: [],
                dependents: [],
                radius: 20,
                layer: 4,
                row: undefined
            }),
            draw: function(layer) {
                // Draw this task.
                if ( (layer === undefined || layer === 2) && (this.hover || this.options.row.data('highlighted')) ) {
                    // Draw the highlight/hover bar
                    var ctx = this.context;

                    // Draw the left and right borders 1px beyond the edge of the canvas
                    var highlight = {
                        left: -1,
                        width: this.calendarCanvas.calendar('option','width') + 2,
                        top: this.options.verticalPosition - (this.options.rowHeight / 2),
                        height: this.options.rowHeight
                    }
                    // Draw a 1px border inside the specified boundaries
                    if ( this.options.row.data('highlighted') ) {
                        ctx.strokeStyle = this.options.highlightEdge;
                        ctx.strokeRect(highlight.left + 0.5, highlight.top + 0.5, highlight.width - 1, highlight.height - 1);
                    }
                    // Fill the region inside the border
                    ctx.fillStyle = this.options.highlightColor;
                    ctx.fillRect(highlight.left + 1, highlight.top + 1, highlight.width - 2, highlight.height - 2);

                } else if ( (layer === undefined || layer === 3) && (this.hover || this.options.row.data('highlighted')) ) {
                    // Draw the dependency lines
                    this._drawDependencies();
                    this._drawDependents();
                }
                superProto.draw.call(this, layer);
            },
            _drawDependencies: function() {
                // Draw lines to this task's dependencies
                var task = this;
                var ctx = this.context;
                var start = {
                    x: this.left,
                    y: this.options.verticalPosition
                };
                ctx.strokeStyle = this.options.dependencyColor;
                ctx.beginPath();
                $.each(this.options.dependencies, function(i, dependency) {
                    ctx.moveTo(start.x,start.y);
                    var end = {
                        x: task.calendarCanvas.calendar('option','width') - task.calendarCanvas.calendar('date2positionRight',dependency.date),
                        y: dependency.verticalPosition
                    }
                    var cp1 = {
                        x: start.x - task.options.radius,
                        y: start.y
                    }
                    var cp2 = {
                        x: end.x + task.options.radius,
                        y: end.y
                    }
                    ctx.bezierCurveTo(cp1.x,cp1.y,cp2.x,cp2.y,end.x,end.y);
                });
                ctx.stroke();
            },
            _drawDependents: function() {
                // Draw lines to this task's dependents
                var task = this;
                var ctx = this.context;
                var start = {
                    x: this.width + this.left,
                    y: this.options.verticalPosition
                };
                ctx.strokeStyle = this.options.dependentColor;
                ctx.beginPath();
                $.each(this.options.dependents, function(i, dependency) {
                    ctx.moveTo(start.x,start.y);
                    var end = {
                        x: task.calendarCanvas.calendar('date2positionLeft',dependency.date),
                        y: dependency.verticalPosition
                    }
                    var cp1 = {
                        x: start.x + task.options.radius,
                        y: start.y
                    }
                    var cp2 = {
                        x: end.x - task.options.radius,
                        y: end.y
                    }
                    ctx.bezierCurveTo(cp1.x,cp1.y,cp2.x,cp2.y,end.x,end.y);
                });
                ctx.stroke();
            }
        });

        // The first time this function runs, it replaces itself with the class then returns and instance of the class.
        jQuery.qcode.ganttChart.Task = Task;
        return new Task(calendarCanvas, options);
    };
    // End of class Task
    // ============================================================
})(jQuery);

/* ==== jquery.getID.js ==== */
;/*
getID -
Returns a unique id for the first matched element
uses the existing id if it has one
 */
(function($, undefined) {
    var nextID = 0;
    $.fn.getID = function() {
        var element = this.first();

        // Assign a unique ID if none exists
        if ( element.attr('id') === undefined ) {
            element.attr('id', 'qcode_jquery_id_' + (nextID++));
        }

        return element.attr('id');
    }
})(jQuery);

/* ==== jquery.hoverScroller.js ==== */
// Hover Scroller plugin - Create controls at the top and bottom of a scrollable box that scroll the box on mouse hover.
// Clicking the controls will quickly scroll to the end.
;(function($, undefined){
    $.fn.hoverScroller = function(options){
	// scrollbox is the box to scroll,
	// container is the element to add the controls to (normally the scrollbox's parent)
	// scrollSpeed is measured in pixels/millisecond and determines how fast the box scrolls (only a single fixed speed is currently supported)
	// snapTime how fast (in milliseconds) the scrollbox will scroll to the end if one of the controls is clicked.
	var settings = $.extend({
	    scrollBox: $(this),
	    container: $(this).parent(),
	    scrollSpeed: 0.3,
	    snapTime: 100
	}, options);
	var scrollBox = settings.scrollBox.addClass('hover-scroller');
	var container = settings.container.addClass('hover-scroller-container');
	var scrollSpeed = settings.scrollSpeed;
	var snapTime = settings.snapTime;
        var scrollTarget = scrollBox.scrollTop();
        var destination = 0;

        scrollBox.on('mousewheel', function(event) {
            if ( $(event.target).is(':input')
                 && parseInt($(event.target).prop('scrollHeight')) != $(event.target).innerHeight()
               ) {
                return true;
            }
            scrollTo(destination - event.originalEvent.wheelDeltaY, 0);
            event.preventDefault();
            event.stopPropagation();
        });

        var threshold = 10;
        scrollBox.on('mousedown', function(event) {
            if ( $(event.target).is(':input') ) {
                return true;
            }
            var dragMouseFrom = event.pageY;
            var scrollFrom = scrollBox.scrollTop();
            var dragging = false;
            scrollBox.on('mousemove.dragListener', function(event) {
                if ( dragging || Math.abs(event.pageY - dragMouseFrom) > threshold ) {
                    dragging = true;
                    var destination = scrollFrom - (event.pageY - dragMouseFrom);
                    scrollTo(destination, 0);
                }
            });
            scrollBox.one('mouseup mouseleave', function() {
                scrollBox.off('mousemove.dragListener');
            });
            $(event.target).one('click', function(event) {
                if ( dragging ) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            });
        });

	// A div which appears at the bottom of the container, which scrolls the scrollBox down when you hover the mouse over it
	var downScroller = $('<div>')
	    .appendTo(container)
	    .addClass('down scroller')
	    .on('mouseenter', function() {
		// When the mouse enter the scroller, make the scroller more opaque then start scrolling
		downScroller.stop().fadeTo(0, 0.5);
		upScroller.stop().fadeTo(0, 0.2);
                startScrollingDown();
	    })
	    .on('mouseleave', function() {
		downScroller.stop().fadeTo(0, 0.2);
		stopScrolling();
	    })
	    .on('click', function() {
                scrollTo(scrollBox.prop('scrollHeight') - scrollBox.height(), snapTime);
	    });

	// A div which appears at the top of the container, which scrolls the scrollBox up when you hover the mouse over it
	var upScroller = $('<div>')
	    .prependTo(container)
	    .addClass('up scroller')
	    .on('mouseenter', function(){
		// When the mouse enter the scroller, make the scroller more opaque then start scrolling
		upScroller.stop().fadeTo(0, 0.5);
		downScroller.stop().fadeTo(0, 0.2);
		startScrollingUp();
	    })
	    .on('mouseleave', function(){
		if ( scrollBox.is('.scrolling') ) {
		    // If the mouse leaves the upwards scroller before scrolling is finished, stop scrolling and return the scroller to its base opacity
		    upScroller.stop().fadeTo(0, 0.2);
		    stopScrolling();
		}
	    })
	    .on('click', function() {
                scrollTo(0, 0);
	    });


	scrollBox.on('scroll', function() {
	    updateControls();
	});
	$(window).on('resize.hoverScroller', updateControls);
	updateControls();

	// End of hover scroller plugin; return original target for jQuery chainability
	return this;

	// Only display the scroller controls when the content is overflowing - listen for resize events to indicate that this may have changed.
	function updateControls() {
	    if ( ! scrollBox.is('.scrolling') ) {
		if ( parseInt(scrollBox.prop('scrollHeight')) == parseInt(scrollBox.height()) ) {
		    upScroller.add(downScroller)
                        .stop()
                        .fadeOut(0);
		} else {
		    if ( scrollBox.scrollTop() > 0 ) {
			upScroller.fadeTo(0, 0.2);
		    } else {
			upScroller.fadeOut();
		    }
		    if ( scrollBox.scrollTop() + scrollBox.height() < scrollBox.prop('scrollHeight') ) {
			downScroller.fadeTo(0, 0.2);
		    } else {
			downScroller.fadeOut();
		    }
		}
	    }
	}

        function scrollTo(newDestination, duration) {
            destination = newDestination;
            scrollBox
                .stop()
                .addClass('scrolling')
                .animate(
                    {'scrollTop': destination},
                    duration,
                    stopScrolling
                );
        }
        function startScrollingUp() {
            destination = 0;
            var duration = scrollBox.scrollTop() / scrollSpeed;
            scrollTo(destination, duration);
        }
        function startScrollingDown() {
            destination = scrollBox.prop('scrollHeight') - scrollBox.height();
            var duration = (destination - scrollBox.scrollTop()) / scrollSpeed;
            scrollTo(destination, duration);
        }
        function stopScrolling() {
            destination = scrollBox.scrollTop();
            scrollBox
                .stop()
                .removeClass('scrolling');
            updateControls();
        }
    }
})(jQuery);

/* ==== jquery.maximiseHeight.js ==== */
// Maximise the height of an element so that the content of a page spans the entire height of the window.  
;(function($, window, undefined){
    // Uses the jQuery UI widget factory.
    $.widget('qcode.maximizeHeight', {
	options: {
	    minimumHeight: 300
	},
	_create: function(){
	    // Constructor function
	    this._resize();

	    // Event listeners 
	    this._on(window, {
		'resize': this._resize
	    });
	},
	_resize: function() {
	    var windowHeight = jQuery(window).height();
	    var bodyHeight = jQuery('body').outerHeight(true);
	    var elementHeight = this.element.height();
	   
	    if (bodyHeight < windowHeight) {
		// Entire body is visible within the window.
		// Increase element's height so that bodyHeight = windowHeight
		this.element.height(elementHeight + (windowHeight - bodyHeight));
	    } else if (bodyHeight > windowHeight) {
		// Body is only partially visible within window.
		// Try to decrease element's height so that entire page contents is visible within the window.
		// Do not decrease below minimumHeight.
		var newHeight = elementHeight - (bodyHeight - windowHeight);
		if (newHeight < this.option('minimumHeight')) {
		    newHeight = this.option('minimumHeight');
		}
		this.element.height(newHeight);
	    }
	}
    });
})(jQuery, window);

/* ==== jquery.navigate.js ==== */
;(function($, window, document, undefined) {
    // Navigate Class constructor
    var Navigate = function(container, selector) {
        var navigate = this;
        this.container = container;
        this.selector = selector;

        // Default selector
        if (selector === undefined) {
            this.selector = ':input:not(:button,:submit)';
        }

        // Events     
        container.on('keydown', function(event) {
            var currentElement = jQuery(event.target)
            var nextElement;
            var fields = jQuery(this.selector, this.container);
            switch (event.which) {
            case 37:
                // left arrow key pressed - move left (if at selectionStart)
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtStart) {
                    nextElement = currentElement.westOf(fields);
                }
                break;
            case 39:
                // right arrow key pressed - move right (if at SelectionEnd) 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtEnd) {
                    nextElement = currentElement.eastOf(fields);
                }
                break;
            case 38:
                // up arrow key pressed - move up 
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtStart) {
                    nextElement = currentElement.northOf(fields);
                }
                break;
            case 40:
                // down arrow key pressed - move down
                if (currentElement.is(':not(input[type=text],textarea,[contenteditable=true])') || currentElement.textrange('get').selectionAtEnd) {
                    nextElement = currentElement.southOf(fields);
                }
                break;
            case 13:
                // return key pressed - move down 
                nextElement = currentElement.southOf(fields);
                break;
            case 9:
                // tab key pressed - default tab action
                return true;
                break;
            default:
                return true;
            }

            // if nextElement exists change focus and prevent event defaults
            if (nextElement.length === 1) {
                navigate.changeFocus(currentElement, nextElement);
                event.preventDefault();
                return false;
            }
        });
    };
    Navigate.prototype.changeFocus = function(fromField, nextField) {
        // Collapse current textrange selection
        if (fromField.is('input[type=text],textarea,[contenteditable=true]')) {
            fromField.textrange('set','start','start');
        }

        // Move focus to nextField and select text contents
        nextField.focus();
        if (nextField.is('input[type=text],textarea,[contenteditable=true]')) {
            nextField.textrange('set','all');
        }
    };

    // Make Navigate Class available as a jQuery plugin   
    $.fn.navigate = function(selector) {
        var containers = this;
        for (var i = 0; i < containers.size(); i++) {
            var container = containers.eq(i);
            if (!container.data('navigate')) {
                container.data('navigate', new Navigate(container, selector));
            }
        }
        return containers;
    };
}(jQuery, window, document));

/* ==== jquery.positionRelativeTo.js ==== */
// positionRelative to plugin - returns the position of the first element in the selection relative to the target.
// nb. if either element is in the offset parent chain of the other, position will account for scrolling of that element.
(function ($, undefined) {
    $.fn.positionRelativeTo = function(target) {
        if ( ! this.length ) {
            $.error('positionRelativeTo called on empty object');
        }
	var target = $(target);
        if ( ! target.length ) {
            $.error('positionRelativeTo called with empty target');
        }
	var $body = $('body');

	// Find chain of offset parents from this element to body
	var myOffsetParents = this;
	var current = this;
	while ( ! current.is($body) ) {
	    current = current.offsetParent();
	    myOffsetParents = myOffsetParents.add(current);
            if ( current.length !== 1 ) {
                $.error('Offset chain error - perhaps positionRelativeTo was called on a detached object?');
            }
	}

	// Search offset parents from target element up until a common offset parent is found
	current = target;
	while ( ! current.is(myOffsetParents) ) {
	    current = current.offsetParent();
            if ( current.length !== 1 ) {
                $.error('Offset chain error - perhaps positionRelativeTo was called with a detached target?');
            }
	}
	var commonOffsetParent = current;

	// Find position of this element relative to the common offset parent
	var myPosition = {
	    left: 0,
	    top: 0
	}
	current = this;
	while ( ! current.is(commonOffsetParent) ) {
	    var positionOfCurrent = current.position();
	    myPosition.left += positionOfCurrent.left;
	    myPosition.top += positionOfCurrent.top;
	    current = current.offsetParent();
	}
	if ( ! (this.is(commonOffsetParent) || commonOffsetParent.is('body')) ) {
	    myPosition.left += commonOffsetParent.scrollLeft();
	    myPosition.top += commonOffsetParent.scrollTop();
	}

	// Find position of target element relative to the common offset parent
	var targetPosition = {
	    left: 0,
	    top: 0
	}
	current = target;
	while ( ! current.is(commonOffsetParent) ) {
	    var positionOfCurrent = current.position();
	    targetPosition.left += positionOfCurrent.left;
	    targetPosition.top += positionOfCurrent.top;
	    current = current.offsetParent();
	}
	if ( ! (target.is(commonOffsetParent) || commonOffsetParent.is('body')) ) {
	    targetPosition.left += commonOffsetParent.scrollLeft();
	    targetPosition.top += commonOffsetParent.scrollTop();
	}

	// Return the difference of the two calculated positions
	return {
	    left: myPosition.left - targetPosition.left,
	    top: myPosition.top - targetPosition.top
	}
    };
})(jQuery);

/* ==== jquery.resizableHeight.js ==== */
(function($){
  // ResizableHeight Class Constructor - vertical resize on bottom border
  var ResizableHeight = function(resizeElmt) {
    // Private Class Variables
    var inZone = false;
    var inResize = false;
    var savedHeight;
    var savedY;
    var minHeight = 10;
    // The element to resize
    var resizeElmnt = resizeElmt;
    
    // Events
    resizeElmnt.on('mousemove.resizableHeight', onMouseMoveResizeElmt);
    resizeElmnt.on('mousedown.resizableHeight', onMouseDownResizeElmt);
    jQuery(document).on('mouseup.resizableHeight',onMouseUpWindow);
    jQuery(document).on('mousemove.resizableHeight', onMouseMoveWindow);
    
    // Private Class Methods
    function onMouseMoveResizeElmt(e) {
      if ( e.pageY >= resizeElmnt.height() + resizeElmnt.offset().top + resizeElmnt.scrollTop()) {
	// Bottom Border
	resizeElmnt.css('cursor','S-resize');
	inZone = true;	  
      } else if ( ! inResize ) {
	resizeElmnt.css('cursor','auto');
	inZone = false;
      } 
    }  
    function onMouseDownResizeElmt(e) {
      if ( inZone && e.which == 1) {
	inResize = true;
	savedY = e.screenY;
	savedHeight = resizeElmt.height();
	return false;
      } 
    }
    function onMouseMoveWindow(e) {
      if ( inResize ) {
	// Drag
	var deltaY = e.screenY - savedY;
	var height = savedHeight + deltaY;
	if ( height < minHeight ) {
	  height = minHeight;
	}
	// Resize
	resizeElmt.height(height);
      }
    }
    function onMouseUpWindow(e) {
      if ( inResize ) {
	inResize = false;
      }
    }
  };

  // Make ResizableHeight Class available as a jquery plugin
  $.fn.resizableHeight = function() {
    var elmts = this

    // Initialise ResizableHeight objects for each elmt unless this has already been done
    for ( var i=0; i< elmts.size(); i++ ) {
      var elmt = elmts.eq(i);
      var resizableHeight = elmt.data('resizableHeight');

      if ( ! resizableHeight ) {
	resizableHeight = new ResizableHeight(elmt);
	elmt.data('resizableHeight',resizableHeight);
      }
    }
    
    return elmts;
  };

}) (jQuery);

/* ==== jquery.runDetached.js ==== */
// runDetached jQuery plugin.
// Detach selected elements, call a function (optional), then re-attach.
// function is called in scope of the jQuery object
// If the function returns a value, return that. Otherwise return the jQuery object for chaining.
;(function(jQuery, undefined) {
    jQuery.fn.runDetached = function(toDo) {
        var returnValue;

        // For each element, store a re-insertion point. This will either be the previous sibling, or the parent.
        var previousSibling = {};
        var parent = {};
        this.each(function(index) {
            previousSibling[index] = $(this).prev();
            if ( previousSibling[index].length === 0 ) {
                parent[index] = $(this).parent();
            }
        });

        // If the target elements contain the currently focussed element, record the text range
        if ( $(document.activeElement).closest(this).length > 0 ) {
            var toFocus = $(document.activeElement);
            var textRange = toFocus.textrange('get');
            toFocus.trigger('blur.runDetached');
        }

        // Detach the elements
        this.detach();

        // Run the function
        if ( typeof toDo == "function" ) {
            returnValue = toDo.call(this);
        }

        // Re-attach the elements
        this.each(function(index) {
            if ( previousSibling[index].length === 0 ) {
                $(this).prependTo(parent[index]);
            } else {
                $(this).insertAfter(previousSibling[index]);
            }
        });

        // Restore focus.
        if ( toFocus !== undefined ) {
            toFocus.trigger('focus.runDetached');
            toFocus.textrange('set', textRange.selectionStart, textRange.selectionEnd);
        }

        return coalesce(returnValue, this);
    }
})(jQuery);

/* ==== jquery.sidebar.js ==== */
// Sidebar plugin - makes the target div a right sidebar, resizable (width only) and collapsible
;(function($, window, document, undefined){
    $.widget('qcode.sidebar', {
        options: {
            collapsedWidth: 25
        },
	_create: function(){
            this.storageKey = "qcode.sidebar.url(" + window.location.origin + window.location.pathname + ")";
	    // Even collapsed, the sidebar will take up some space, so add a margin to the body to prevent the collapsed sidebar from obscuring any page contents
	    $('body').css('margin-right', "+="+(10+this.options.collapsedWidth)+"px");

	    var sidebar = this.element.addClass('sidebar');
	    var toolbar = this.toolbar = sidebar.find('.toolbar');
            if ( localStorage[this.storageKey + '.width'] ) {
                sidebar.width(localStorage[this.storageKey + '.width']);
            }
	    var initialWidth = sidebar.width();

	    // An invisible div sitting on the sidebar's edge, to capture click & drag events for resizing the sidebar.
	    var handle = this.handle = $('<div>')
		.addClass('handle')
		.prependTo(sidebar);

	    this._on(handle, {
		'mousedown': this._dragStart,
		'dragStart': function(event, data) {
		    initialWidth = sidebar.width() + parseInt(sidebar.css('right'));
                    sidebar.animate({
                        'right': 0,
                        'width': initialWidth
                    }, 100);
	            this.restoreButton.hide();
	            this.collapseButton.show();
                    localStorage[this.storageKey + '.collapsed'] = "false";
                    localStorage[this.storageKey + '.width'] = initialWidth;
		},
		'drag': function(event, data) {
                    var newWidth = initialWidth - data.offset;
		    sidebar.width(newWidth);
                    localStorage[this.storageKey + '.width'] = newWidth;
		    sidebar.trigger('resize');
		},
		'dragEnd': function(event, data) {
		    initialWidth = sidebar.width();
		}
	    });

	    // Button to collapse the sidebar
	    this.collapseButton = $('<button>')
		.text('\u00bb')
                .attr('title', 'Collapse')
		.addClass('collapse')
		.prependTo(toolbar);

	    this._on(this.collapseButton, {
		'click': this.collapse
	    });

	    // Button to restore a collapsed sidebar
	    this.restoreButton = $('<button>')
		.text('\u00ab')
                .attr('title', 'Restore')
		.addClass('restore')
		.prependTo(toolbar)
		.hide();

	    this._on(this.restoreButton, {
		'click': this.restore
	    });

            if ( localStorage[this.storageKey + '.collapsed'] == "true" ) {
                this.collapse(false);
            }
	},
	collapse: function(animated) {
	    // "Collapse" the sidebar (actually just hides most of it beyond the edge of the window).
            var animated = coalesce(animated, true);
	    this.collapseButton.hide();
	    this.restoreButton.show();
            if ( animated ) {
	        this.element.stop().animate({
		    'right': this.options.collapsedWidth - this.element.width()
	        });
            } else {
                this.element.stop().css('right', this.options.collapsedWidth - this.element.width());
            }
            localStorage[this.storageKey + '.collapsed'] = "true";
	},
	restore: function(animated) {
	    // Restore a collapsed sidebar
            var animated = coalesce(animated, true);
	    this.restoreButton.hide();
	    this.collapseButton.show();
            if ( animated ) {
	        this.element.stop().animate({
		    'right': 0
	        });
            } else {
	        this.element.stop().css('right', 0);
            }
            localStorage[this.storageKey + '.collapsed'] = "false";
	},
	_dragStart: function(event){
	    var target = $(event.target);
	    event.preventDefault();
	    this._on($(window), {
		'mousemove': this._drag.bind(this, target, event.pageX),
		'mouseup': this._dragEnd.bind(this, target, event.pageX)
	    });
	    target.trigger('dragStart');
	},
	_drag: function(target, initialX, event){
	    event.preventDefault();
	    target.trigger('drag', [{
		'offset': event.pageX - initialX
	    }]);
	},
	_dragEnd: function(target, initialX, event){
	    this._off($(window), 'mousemove mouseup');
	    target.trigger('dragEnd');
	}
    });
})(jQuery, window, document);

/* ==== jquery.statusFrame.js ==== */
/* statusFrame plugin
   Wraps the target in a resizable div with a status bar at the bottom
   Listens for "message" events, and displays messages

   Options: {
   resizable: boolean, default true, is the frame resizable
   minHeight: int, default 10, if the frame is resizable, the minimum height.
   height: css height, default "auto", the (initial) height of the frame
   }

   Methods:
   setNavCounter: takes an html string and sets the navCount
   setMessage: takes an html string and sets the current message

   message event handlers take 1 addition argument, which is an object as follows:
   {
   type: string 'error', 'notice', or 'navCount' - the type of message.
   html: string - the message to be displayed, in html format.
   }
*/
;(function($, window, undefined) {
    $.widget('qcode.statusFrame', {
        options: {
            resizable: true,
            minHeight: 10,
            height: "auto"
        },
        _create: function() {
            this.element.wrap('<div>');
            this.statusFrame = this.element.parent()
                .addClass('status-frame')
                .css('height', this.options.height);
            this.statusBar = $('<div>')
                .addClass('status-bar')
                .insertAfter(this.statusFrame);
            this.messageBox = $('<span>')
                .addClass('message')
                .appendTo(this.statusBar);
            this.navCounter = $('<span>')
                .addClass('info')
                .appendTo(this.statusBar);

            if ( this.options.resizable ) {
                this.handle = $('<div>')
                    .addClass('handle')
                    .prependTo(this.statusBar);
                var initialHeight;
                this._on(this.handle, {
                    'mousedown': this._dragStart,
                    'dragStart': function(event, data) {
                        initialHeight = this.statusFrame.height();
                    },
                    'drag': function(event, data) {
                        this.statusFrame.height(Math.max(initialHeight + data.offset, this.options.minHeight));
                        this.statusFrame.trigger('resize');
                    }
                });
            }
            this._on({
                'message': function(event, data) {
                    this.messageBox.removeClass('error');
                    switch(data.type) {
                    case "navCount":
                        this.setNavCounter(data.html);
                        break;

                    case "error":
                        this.messageBox.addClass('error');
                    case "notice":
                    default:
                        this.setMessage(data.html);
                        break;
                    }
                }
            });
        },
        setNavCounter: function(message) {
            var oldHeight = this.statusBar.height();
            this.navCounter.html(message);
            if ( this.statusBar.height() !== oldHeight ) {
                this.statusBar.trigger('resize');
            }
        },
        setMessage: function(message) {
            var oldHeight = this.statusBar.height();
            this.messageBox.html(message);
            if ( this.statusBar.height() !== oldHeight ) {
                this.statusBar.trigger('resize');
            }
        },
	_dragStart: function(event){
	    var target = $(event.target);
	    event.preventDefault();
	    this._on($(window), {
		'mousemove': this._drag.bind(this, target, event.pageY),
		'mouseup': this._dragEnd.bind(this, target, event.pageY)
	    });
	    target.trigger('dragStart');
	},
	_drag: function(target, initialY, event){
	    event.preventDefault();
	    target.trigger('drag', [{
		'offset': event.pageY - initialY
	    }]);
	},
	_dragEnd: function(target, initialY, event){
	    this._off($(window), 'mousemove mouseup');
	    target.trigger('dragEnd');
	}
    });
})(jQuery, window);

/* ==== jquery.tableFilterMin.js ==== */
// tableFilterMin - client-side table row filter based on user-defined minimum values
;(function(jQuery, window, undefined) {
    // keyup timer
    var timer;

    jQuery.fn.tableFilterMin = function() {
        var $table = $(this).filter('table');
        $table.find('thead>tr>th>input')
            .on('click', function() {
                $(this).textrange('set', 'all');
            })
            .on('keyup', function() {
                window.clearTimeout(timer);
                timer = window.setTimeout(function() {
                    updateFilters.call($table);
                }, 400);
            })
            .on('change', function() {
                updateFilters.call($table);
            });
    }

    function updateFilters() {
        $table = this;

        // Clear the keyup timer
        window.clearTimeout(timer);

        // Map column index (0-based) to filter value
        var filters = {};
        $table.find('thead>tr>th>input').each(function() {
            var $input = $(this);
            var value = parseFloat($input.val());
            if ( isNaN(value) ) {
                var value = 0;
            }
            filters[$input.parent().index()] = value;
        });

        $table.find('tbody').runDetached(function() {
            this.children('tr').each(function() {
                var $row = $(this);
                // Hide if row fails any of the filters, show otherwise
                var hide = false;
                $row.children('td').each(function(index, cell){
                    var cellValue = parseFloat($(cell).text());
                    if ( isNaN(cellValue) ) {
                        var cellValue = 0;
                    }
                    if ( filters[index] !== undefined && cellValue < filters[index] ) {
                        hide = true;
                        //false return breaks the jQuery loop - no need to check the other columns when one has failed.
                        return false;
                    }
                });
                if (hide) {
                    $row.hide();
                } else {
                    $row.show();
                }
            });
        });
    }
})(jQuery, window);

/* ==== jquery.tableRowDeleteButton.js ==== */
/*
  tableRowDeleteButton

  call on a button inside a th, provide a UI for deleting rows
  depends on dbGrid for delete functionality

  each tbody cell in the column containing the button gains class "row-selector", and becomes clickable.
  selected row gain the "selected" class, and are deleted if the user clicks the button, then confirms.
*/
;(function($, undefined) {
    var repaint;

    $.fn.tableRowDeleteButton = function() {

        // Initialise the repaint function
        if ( repaint === undefined ) {
            repaint = function(button) {
                if ( button.closest('table').children('tbody').children('tr.selected:not(.updating)').length > 0 ) {
                    button.removeClass('disabled');
                    button.removeAttr('disabled');
                } else {
                    button.addClass('disabled');
                    button.attr('disabled', true); // Possibly should use $().prop(), but that breaks theadFixed
                }
            }
        }

        var buttons = this;
        buttons.each(function() {
            var button = $(this);
            var tbody = button.closest('table').children('tbody');

            // Add row selector class to all tbody cells in this column
            tbody.children('tr').children(':nth-child(' + (button.closest('th').index() + 1) + ')')
                .addClass('row-selector');

            // Delegated event listener for selecting a row
            tbody.on('click.tableRowDeleteButton', 'td.row-selector', function(event) {
                $(event.currentTarget).parent().toggleClass('selected');
                repaint(button);
            });

            // Event listener for clicking the delete button
            button.on('click.tableRowDeleteButton', function() {
                if ( ! button.hasClass('disabled') ) {
                    var rows = tbody.children('.selected:not(.updating)');
		    qcode.confirm("Delete these " + rows.length + " records?", function() {
                        rows.each(function(i, row) {
                            if ( $(row).dbRow('option', 'type') === 'add' ) {
                                if ( $(row).dbRow('getState') === 'dirty'
                                     || $(row).dbRow('getState') === 'error' ) {
                                    // No db interaction if row has not been "added"
                                    tbody.parent().dbGrid('removeRow', $(row));
                                } else {
                                    // Do not remove unmodified "add" row
                                    $(row).removeClass('selected');
                                }
                            } else {
                                $(row).dbRow('delete', true);
                            }
                        });
                        repaint(button);
                    });
                }
            });

            // Event listeners to animate the "click" action with class "clicking"
            button.on('mousedown.tableRowDeleteButton', function() {
                button.addClass('clicking');
                button.one('mouseup.tableRowDeleteButton mouseleave.tableRowDeleteButton', function() {
                    button.removeClass('clicking');
                });
            });

            tbody.parent().on('dbRowStateChange.tableRowDeleteButton', repaint.bind(this, button));

            repaint(button);
        });

        // Enable jQuery plugin chaining
        return buttons;
    }
})(jQuery);

/* ==== jquery.tablesorter.js ==== */
/*
 * 
 * TableSorter 2.0 - Client-side table sorting with ease!
 * Version 2.0.5b
 * @requires jQuery v1.2.3
 * 
 * Copyright (c) 2007 Christian Bach
 * Examples and docs at: http://tablesorter.com
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */
/**
 * 
 * @description Create a sortable table with multi-column sorting capabilitys
 * 
 * @example $('table').tablesorter();
 * @desc Create a simple tablesorter interface.
 * 
 * @example $('table').tablesorter({ sortList:[[0,0],[1,0]] });
 * @desc Create a tablesorter interface and sort on the first and secound column column headers.
 * 
 * @example $('table').tablesorter({ headers: { 0: { sorter: false}, 1: {sorter: false} } });
 *          
 * @desc Create a tablesorter interface and disableing the first and second  column headers.
 *      
 * 
 * @example $('table').tablesorter({ headers: { 0: {sorter:"integer"}, 1: {sorter:"currency"} } });
 * 
 * @desc Create a tablesorter interface and set a column parser for the first
 *       and second column.
 * 
 * 
 * @param Object
 *            settings An object literal containing key/value pairs to provide
 *            optional settings.
 * 
 * 
 * @option String cssHeader (optional) A string of the class name to be appended
 *         to sortable tr elements in the thead of the table. Default value:
 *         "header"
 * 
 * @option String cssAsc (optional) A string of the class name to be appended to
 *         sortable tr elements in the thead on a ascending sort. Default value:
 *         "headerSortUp"
 * 
 * @option String cssDesc (optional) A string of the class name to be appended
 *         to sortable tr elements in the thead on a descending sort. Default
 *         value: "headerSortDown"
 * 
 * @option String sortInitialOrder (optional) A string of the inital sorting
 *         order can be asc or desc. Default value: "asc"
 * 
 * @option String sortMultisortKey (optional) A string of the multi-column sort
 *         key. Default value: "shiftKey"
 * 
 * @option String textExtraction (optional) A string of the text-extraction
 *         method to use. For complex html structures inside td cell set this
 *         option to "complex", on large tables the complex option can be slow.
 *         Default value: "simple"
 * 
 * @option Object headers (optional) An array containing the forces sorting
 *         rules. This option let's you specify a default sorting rule. Default
 *         value: null
 * 
 * @option Array sortList (optional) An array containing the forces sorting
 *         rules. This option let's you specify a default sorting rule. Default
 *         value: null
 * 
 * @option Array sortForce (optional) An array containing forced sorting rules.
 *         This option let's you specify a default sorting rule, which is
 *         prepended to user-selected rules. Default value: null
 * 
 * @option Boolean sortLocaleCompare (optional) Boolean flag indicating whatever
 *         to use String.localeCampare method or not. Default set to true.
 * 
 * 
 * @option Array sortAppend (optional) An array containing forced sorting rules.
 *         This option let's you specify a default sorting rule, which is
 *         appended to user-selected rules. Default value: null
 * 
 * @option Boolean widthFixed (optional) Boolean flag indicating if tablesorter
 *         should apply fixed widths to the table columns. This is usefull when
 *         using the pager companion plugin. This options requires the dimension
 *         jquery plugin. Default value: false
 * 
 * @option Boolean cancelSelection (optional) Boolean flag indicating if
 *         tablesorter should cancel selection of the table headers text.
 *         Default value: true
 * 
 * @option Boolean debug (optional) Boolean flag indicating if tablesorter
 *         should display debuging information usefull for development.
 * 
 * @type jQuery
 * 
 * @name tablesorter
 * 
 * @cat Plugins/Tablesorter
 * 
 * @author Christian Bach/christian.bach@polyester.se
 */

(function ($) {
    $.extend({
        tablesorter: new
        function () {

            var parsers = [],
                widgets = [];

            this.defaults = {
                cssHeader: "header",
                cssAsc: "headerSortUp",
                cssDesc: "headerSortDown",
                cssChildRow: "expand-child",
                sortInitialOrder: "asc",
                sortMultiSortKey: "shiftKey",
                sortForce: null,
                sortAppend: null,
                sortLocaleCompare: true,
                textExtraction: "simple",
                parsers: {}, widgets: [],
                widgetZebra: {
                    css: ["even", "odd"]
                }, headers: {}, widthFixed: false,
                cancelSelection: true,
                sortList: [],
                headerList: [],
                dateFormat: "us",
                decimal: '/\.|\,/g',
                onRenderHeader: null,
                selectorHeaders: 'thead th',
                debug: false
            };

            /* debuging utils */

            function benchmark(s, d) {
                log(s + "," + (new Date().getTime() - d.getTime()) + "ms");
            }

            this.benchmark = benchmark;

            function log(s) {
                if (typeof console != "undefined" && typeof console.debug != "undefined") {
                    console.log(s);
                } else {
                    alert(s);
                }
            }

            /* parsers utils */

            function buildParserCache(table, $headers) {

                if (table.config.debug) {
                    var parsersDebug = "";
                }

                if (table.tBodies.length == 0) return; // In the case of empty tables
                var rows = table.tBodies[0].rows;

                if (rows[0]) {

                    var list = [],
                        cells = rows[0].cells,
                        l = cells.length;

                    for (var i = 0; i < l; i++) {

                        var p = false;

                        if ($.metadata && ($($headers[i]).metadata() && $($headers[i]).metadata().sorter)) {

                            p = getParserById($($headers[i]).metadata().sorter);

                        } else if ((table.config.headers[i] && table.config.headers[i].sorter)) {

                            p = getParserById(table.config.headers[i].sorter);
                        }
                        if (!p) {

                            p = detectParserForColumn(table, rows, -1, i);
                        }

                        if (table.config.debug) {
                            parsersDebug += "column:" + i + " parser:" + p.id + "\n";
                        }

                        list.push(p);
                    }
                }

                if (table.config.debug) {
                    log(parsersDebug);
                }

                return list;
            };

            function detectParserForColumn(table, rows, rowIndex, cellIndex) {
                var l = parsers.length,
                    node = false,
                    nodeValue = false,
                    keepLooking = true;
                while (nodeValue == '' && keepLooking) {
                    rowIndex++;
                    if (rows[rowIndex]) {
                        node = getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex);
                        nodeValue = trimAndGetNodeText(table.config, node);
                        if (table.config.debug) {
                            log('Checking if value was empty on row:' + rowIndex);
                        }
                    } else {
                        keepLooking = false;
                    }
                }
                for (var i = 1; i < l; i++) {
                    if (parsers[i].is(nodeValue, table, node)) {
                        return parsers[i];
                    }
                }
                // 0 is always the generic parser (text)
                return parsers[0];
            }

            function getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex) {
                return rows[rowIndex].cells[cellIndex];
            }

            function trimAndGetNodeText(config, node) {
                return $.trim(getElementText(config, node));
            }

            function getParserById(name) {
                var l = parsers.length;
                for (var i = 0; i < l; i++) {
                    if (parsers[i].id.toLowerCase() == name.toLowerCase()) {
                        return parsers[i];
                    }
                }
                return false;
            }

            /* utils */

            function buildCache(table) {

                if (table.config.debug) {
                    var cacheTime = new Date();
                }

                var totalRows = (table.tBodies[0] && table.tBodies[0].rows.length) || 0,
                    totalCells = (table.tBodies[0].rows[0] && table.tBodies[0].rows[0].cells.length) || 0,
                    parsers = table.config.parsers,
                    cache = {
                        row: [],
                        normalized: []
                    };

                for (var i = 0; i < totalRows; ++i) {

                    /** Add the table data to main data array */
                    var c = $(table.tBodies[0].rows[i]),
                        cols = [];

                    // if this is a child row, add it to the last row's children and
                    // continue to the next row
                    if (c.hasClass(table.config.cssChildRow)) {
                        cache.row[cache.row.length - 1] = cache.row[cache.row.length - 1].add(c);
                        // go to the next for loop
                        continue;
                    }

                    cache.row.push(c);

                    for (var j = 0; j < totalCells; ++j) {
                        cols.push(parsers[j].format(getElementText(table.config, c[0].cells[j]), table, c[0].cells[j]));
                    }

                    cols.push(cache.normalized.length); // add position for rowCache
                    cache.normalized.push(cols);
                    cols = null;
                };

                if (table.config.debug) {
                    benchmark("Building cache for " + totalRows + " rows:", cacheTime);
                }

                return cache;
            };

            function getElementText(config, node) {

                var text = "";

                if (!node) return "";

                if (!config.supportsTextContent) config.supportsTextContent = node.textContent || false;

                if (config.textExtraction == "simple") {
                    if (config.supportsTextContent) {
                        text = node.textContent;
                    } else {
                        if (node.childNodes[0] && node.childNodes[0].hasChildNodes()) {
                            text = node.childNodes[0].innerHTML;
                        } else {
                            text = node.innerHTML;
                        }
                    }
                } else {
                    if (typeof(config.textExtraction) == "function") {
                        text = config.textExtraction(node);
                    } else {
                        text = $(node).text();
                    }
                }
                return text;
            }

            function appendToTable(table, cache) {

                if (table.config.debug) {
                    var appendTime = new Date()
                }

                var c = cache,
                    r = c.row,
                    n = c.normalized,
                    totalRows = n.length,
                    checkCell = (n[0].length - 1),
                    tableBody = $(table.tBodies[0]),
                    rows = [];


                for (var i = 0; i < totalRows; i++) {
                    var pos = n[i][checkCell];

                    rows.push(r[pos]);

                    if (!table.config.appender) {

                        //var o = ;
                        var l = r[pos].length;
                        for (var j = 0; j < l; j++) {
                            tableBody[0].appendChild(r[pos][j]);
                        }

                        // 
                    }
                }



                if (table.config.appender) {

                    table.config.appender(table, rows);
                }

                rows = null;

                if (table.config.debug) {
                    benchmark("Rebuilt table:", appendTime);
                }

                // apply table widgets
                applyWidget(table);

                // trigger sortend
                setTimeout(function () {
                    $(table).trigger("sortEnd");
                }, 0);

            };

            function buildHeaders(table) {

                if (table.config.debug) {
                    var time = new Date();
                }

                var meta = ($.metadata) ? true : false;
                
                var header_index = computeTableHeaderCellIndexes(table);

                $tableHeaders = $(table.config.selectorHeaders, table).each(function (index) {

                    this.column = header_index[this.parentNode.rowIndex + "-" + this.cellIndex];
                    // this.column = index;
                    this.order = formatSortingOrder(table.config.sortInitialOrder);
                    
					
					this.count = this.order;

                    if (checkHeaderMetadata(this) || checkHeaderOptions(table, index)) this.sortDisabled = true;
					if (checkHeaderOptionsSortingLocked(table, index)) this.order = this.lockedOrder = checkHeaderOptionsSortingLocked(table, index);

                    if (!this.sortDisabled) {
                        var $th = $(this).addClass(table.config.cssHeader);
                        if (table.config.onRenderHeader) table.config.onRenderHeader.apply($th);
                    }

                    // add cell to headerList
                    table.config.headerList[index] = this;
                });

                if (table.config.debug) {
                    benchmark("Built headers:", time);
                    log($tableHeaders);
                }

                return $tableHeaders;

            };

            // from:
            // http://www.javascripttoolbox.com/lib/table/examples.php
            // http://www.javascripttoolbox.com/temp/table_cellindex.html


            function computeTableHeaderCellIndexes(t) {
                var matrix = [];
                var lookup = {};
                var thead = t.getElementsByTagName('THEAD')[0];
                var trs = thead.getElementsByTagName('TR');

                for (var i = 0; i < trs.length; i++) {
                    var cells = trs[i].cells;
                    for (var j = 0; j < cells.length; j++) {
                        var c = cells[j];

                        var rowIndex = c.parentNode.rowIndex;
                        var cellId = rowIndex + "-" + c.cellIndex;
                        var rowSpan = c.rowSpan || 1;
                        var colSpan = c.colSpan || 1
                        var firstAvailCol;
                        if (typeof(matrix[rowIndex]) == "undefined") {
                            matrix[rowIndex] = [];
                        }
                        // Find first available column in the first row
                        for (var k = 0; k < matrix[rowIndex].length + 1; k++) {
                            if (typeof(matrix[rowIndex][k]) == "undefined") {
                                firstAvailCol = k;
                                break;
                            }
                        }
                        lookup[cellId] = firstAvailCol;
                        for (var k = rowIndex; k < rowIndex + rowSpan; k++) {
                            if (typeof(matrix[k]) == "undefined") {
                                matrix[k] = [];
                            }
                            var matrixrow = matrix[k];
                            for (var l = firstAvailCol; l < firstAvailCol + colSpan; l++) {
                                matrixrow[l] = "x";
                            }
                        }
                    }
                }
                return lookup;
            }

            function checkCellColSpan(table, rows, row) {
                var arr = [],
                    r = table.tHead.rows,
                    c = r[row].cells;

                for (var i = 0; i < c.length; i++) {
                    var cell = c[i];

                    if (cell.colSpan > 1) {
                        arr = arr.concat(checkCellColSpan(table, headerArr, row++));
                    } else {
                        if (table.tHead.length == 1 || (cell.rowSpan > 1 || !r[row + 1])) {
                            arr.push(cell);
                        }
                        // headerArr[row] = (i+row);
                    }
                }
                return arr;
            };

            function checkHeaderMetadata(cell) {
                if (($.metadata) && ($(cell).metadata().sorter === false)) {
                    return true;
                };
                return false;
            }

            function checkHeaderOptions(table, i) {
                if ((table.config.headers[i]) && (table.config.headers[i].sorter === false)) {
                    return true;
                };
                return false;
            }
			
			 function checkHeaderOptionsSortingLocked(table, i) {
                if ((table.config.headers[i]) && (table.config.headers[i].lockedOrder)) return table.config.headers[i].lockedOrder;
                return false;
            }
			
            function applyWidget(table) {
                var c = table.config.widgets;
                var l = c.length;
                for (var i = 0; i < l; i++) {

                    getWidgetById(c[i]).format(table);
                }

            }

            function getWidgetById(name) {
                var l = widgets.length;
                for (var i = 0; i < l; i++) {
                    if (widgets[i].id.toLowerCase() == name.toLowerCase()) {
                        return widgets[i];
                    }
                }
            };

            function formatSortingOrder(v) {
                if (typeof(v) != "Number") {
                    return (v.toLowerCase() == "desc") ? 1 : 0;
                } else {
                    return (v == 1) ? 1 : 0;
                }
            }

            function isValueInArray(v, a) {
                var l = a.length;
                for (var i = 0; i < l; i++) {
                    if (a[i][0] == v) {
                        return true;
                    }
                }
                return false;
            }

            function setHeadersCss(table, $headers, list, css) {
                // remove all header information
                $headers.removeClass(css[0]).removeClass(css[1]);

                var h = [];
                $headers.each(function (offset) {
                    if (!this.sortDisabled) {
                        h[this.column] = $(this);
                    }
                });

                var l = list.length;
                for (var i = 0; i < l; i++) {
                    h[list[i][0]].addClass(css[list[i][1]]);
                }
            }

            function fixColumnWidth(table, $headers) {
                var c = table.config;
                if (c.widthFixed) {
                    var colgroup = $('<colgroup>');
                    $("tr:first td", table.tBodies[0]).each(function () {
                        colgroup.append($('<col>').css('width', $(this).width()));
                    });
                    $(table).prepend(colgroup);
                };
            }

            function updateHeaderSortCount(table, sortList) {
                var c = table.config,
                    l = sortList.length;
                for (var i = 0; i < l; i++) {
                    var s = sortList[i],
                        o = c.headerList[s[0]];
                    o.count = s[1];
                    o.count++;
                }
            }

            /* sorting methods */

            function multisort(table, sortList, cache) {

                if (table.config.debug) {
                    var sortTime = new Date();
                }

                var dynamicExp = "var sortWrapper = function(a,b) {",
                    l = sortList.length;

                // TODO: inline functions.
                for (var i = 0; i < l; i++) {

                    var c = sortList[i][0];
                    var order = sortList[i][1];
                    // var s = (getCachedSortType(table.config.parsers,c) == "text") ?
                    // ((order == 0) ? "sortText" : "sortTextDesc") : ((order == 0) ?
                    // "sortNumeric" : "sortNumericDesc");
                    // var s = (table.config.parsers[c].type == "text") ? ((order == 0)
                    // ? makeSortText(c) : makeSortTextDesc(c)) : ((order == 0) ?
                    // makeSortNumeric(c) : makeSortNumericDesc(c));
                    var s = (table.config.parsers[c].type == "text") ? ((order == 0) ? makeSortFunction("text", "asc", c) : makeSortFunction("text", "desc", c)) : ((order == 0) ? makeSortFunction("numeric", "asc", c) : makeSortFunction("numeric", "desc", c));
                    var e = "e" + i;

                    dynamicExp += "var " + e + " = " + s; // + "(a[" + c + "],b[" + c
                    // + "]); ";
                    dynamicExp += "if(" + e + ") { return " + e + "; } ";
                    dynamicExp += "else { ";

                }

                // if value is the same keep orignal order
                var orgOrderCol = cache.normalized[0].length - 1;
                dynamicExp += "return a[" + orgOrderCol + "]-b[" + orgOrderCol + "];";

                for (var i = 0; i < l; i++) {
                    dynamicExp += "}; ";
                }

                dynamicExp += "return 0; ";
                dynamicExp += "}; ";

                if (table.config.debug) {
                    benchmark("Evaling expression:" + dynamicExp, new Date());
                }

                eval(dynamicExp);

                cache.normalized.sort(sortWrapper);

                if (table.config.debug) {
                    benchmark("Sorting on " + sortList.toString() + " and dir " + order + " time:", sortTime);
                }

                return cache;
            };

            function makeSortFunction(type, direction, index) {
                var a = "a[" + index + "]",
                    b = "b[" + index + "]";
                if (type == 'text' && direction == 'asc') {
                    return "(" + a + " == " + b + " ? 0 : (" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : (" + a + " < " + b + ") ? -1 : 1 )));";
                } else if (type == 'text' && direction == 'desc') {
                    return "(" + a + " == " + b + " ? 0 : (" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : (" + b + " < " + a + ") ? -1 : 1 )));";
                } else if (type == 'numeric' && direction == 'asc') {
                    return "(" + a + " === null && " + b + " === null) ? 0 :(" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : " + a + " - " + b + "));";
                } else if (type == 'numeric' && direction == 'desc') {
                    return "(" + a + " === null && " + b + " === null) ? 0 :(" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : " + b + " - " + a + "));";
                }
            };

            function makeSortText(i) {
                return "((a[" + i + "] < b[" + i + "]) ? -1 : ((a[" + i + "] > b[" + i + "]) ? 1 : 0));";
            };

            function makeSortTextDesc(i) {
                return "((b[" + i + "] < a[" + i + "]) ? -1 : ((b[" + i + "] > a[" + i + "]) ? 1 : 0));";
            };

            function makeSortNumeric(i) {
                return "a[" + i + "]-b[" + i + "];";
            };

            function makeSortNumericDesc(i) {
                return "b[" + i + "]-a[" + i + "];";
            };

            function sortText(a, b) {
                if (table.config.sortLocaleCompare) return a.localeCompare(b);
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            };

            function sortTextDesc(a, b) {
                if (table.config.sortLocaleCompare) return b.localeCompare(a);
                return ((b < a) ? -1 : ((b > a) ? 1 : 0));
            };

            function sortNumeric(a, b) {
                return a - b;
            };

            function sortNumericDesc(a, b) {
                return b - a;
            };

            function getCachedSortType(parsers, i) {
                return parsers[i].type;
            }; /* public methods */
            this.construct = function (settings) {
                return this.each(function () {
                    // if no thead or tbody quit.
                    if (!this.tHead || !this.tBodies) return;
                    // declare
                    var $this, $document, $headers, cache, config, shiftDown = 0,
                        sortOrder;
                    // new blank config object
                    this.config = {};
                    // merge and extend.
                    config = $.extend(this.config, $.tablesorter.defaults, settings);
                    // store common expression for speed
                    $this = $(this);
                    // save the settings where they read
                    $.data(this, "tablesorter", config);
                    // build headers
                    $headers = buildHeaders(this);
                    // try to auto detect column type, and store in tables config
                    this.config.parsers = buildParserCache(this, $headers);
                    // build the cache for the tbody cells
                    cache = buildCache(this);
                    // get the css class names, could be done else where.
                    var sortCSS = [config.cssDesc, config.cssAsc];
                    // fixate columns if the users supplies the fixedWidth option
                    fixColumnWidth(this);
                    // apply event handling to headers
                    // this is to big, perhaps break it out?
                    $headers.click(

                    function (e) {
                        var totalRows = ($this[0].tBodies[0] && $this[0].tBodies[0].rows.length) || 0;
                        if (!this.sortDisabled && totalRows > 0) {
                            // Only call sortStart if sorting is
                            // enabled.
                            $this.trigger("sortStart");
                            // store exp, for speed
                            var $cell = $(this);
                            // get current column index
                            var i = this.column;
                            // get current column sort order
                            this.order = this.count++ % 2;
							// always sort on the locked order.
							if(this.lockedOrder) this.order = this.lockedOrder;
							
							// user only whants to sort on one
                            // column
                            if (!e[config.sortMultiSortKey]) {
                                // flush the sort list
                                config.sortList = [];
                                if (config.sortForce != null) {
                                    var a = config.sortForce;
                                    for (var j = 0; j < a.length; j++) {
                                        if (a[j][0] != i) {
                                            config.sortList.push(a[j]);
                                        }
                                    }
                                }
                                // add column to sort list
                                config.sortList.push([i, this.order]);
                                // multi column sorting
                            } else {
                                // the user has clicked on an all
                                // ready sortet column.
                                if (isValueInArray(i, config.sortList)) {
                                    // revers the sorting direction
                                    // for all tables.
                                    for (var j = 0; j < config.sortList.length; j++) {
                                        var s = config.sortList[j],
                                            o = config.headerList[s[0]];
                                        if (s[0] == i) {
                                            o.count = s[1];
                                            o.count++;
                                            s[1] = o.count % 2;
                                        }
                                    }
                                } else {
                                    // add column to sort list array
                                    config.sortList.push([i, this.order]);
                                }
                            };
                            setTimeout(function () {
                                // set css for headers
                                setHeadersCss($this[0], $headers, config.sortList, sortCSS);
                                appendToTable(
	                                $this[0], multisort(
	                                $this[0], config.sortList, cache)
								);
                            }, 1);
                            // stop normal event by returning false
                            return false;
                        }
                        // cancel selection
                    }).mousedown(function () {
                        if (config.cancelSelection) {
                            this.onselectstart = function () {
                                return false
                            };
                            return false;
                        }
                    });
                    // apply easy methods that trigger binded events
                    $this.bind("update", function () {
                        var me = this;
                        setTimeout(function () {
                            // rebuild parsers.
                            me.config.parsers = buildParserCache(
                            me, $headers);
                            // rebuild the cache map
                            cache = buildCache(me);
                        }, 1);
                    }).bind("updateCell", function (e, cell) {
                        var config = this.config;
                        // get position from the dom.
                        var pos = [(cell.parentNode.rowIndex - 1), cell.cellIndex];
                        // update cache
                        cache.normalized[pos[0]][pos[1]] = config.parsers[pos[1]].format(
                        getElementText(config, cell), cell);
                    }).bind("sorton", function (e, list) {
                        $(this).trigger("sortStart");
                        config.sortList = list;
                        // update and store the sortlist
                        var sortList = config.sortList;
                        // update header count index
                        updateHeaderSortCount(this, sortList);
                        // set css for headers
                        setHeadersCss(this, $headers, sortList, sortCSS);
                        // sort the table and append it to the dom
                        appendToTable(this, multisort(this, sortList, cache));
                    }).bind("appendCache", function () {
                        appendToTable(this, cache);
                    }).bind("applyWidgetId", function (e, id) {
                        getWidgetById(id).format(this);
                    }).bind("applyWidgets", function () {
                        // apply widgets
                        applyWidget(this);
                    });
                    if ($.metadata && ($(this).metadata() && $(this).metadata().sortlist)) {
                        config.sortList = $(this).metadata().sortlist;
                    }
                    // if user has supplied a sort list to constructor.
                    if (config.sortList.length > 0) {
                        $this.trigger("sorton", [config.sortList]);
                    }
                    // apply widgets
                    applyWidget(this);
                });
            };
            this.addParser = function (parser) {
                var l = parsers.length,
                    a = true;
                for (var i = 0; i < l; i++) {
                    if (parsers[i].id.toLowerCase() == parser.id.toLowerCase()) {
                        a = false;
                    }
                }
                if (a) {
                    parsers.push(parser);
                };
            };
            this.addWidget = function (widget) {
                widgets.push(widget);
            };
            this.formatFloat = function (s) {
                // commified numbers
                if (/^[-+]?[0-9]{1,3}(,[0-9]{1,3})+(\.[0-9]+)?$/.test(s)) {
                    i=s.replace(/,/g,'');
                } else {
                    var i = parseFloat(s);
                }
                return (isNaN(i)) ? 0 : i;
            };
            this.formatInt = function (s) {
                var i = parseInt(s);
                return (isNaN(i)) ? 0 : i;
            };
            this.isDigit = function (s, config) {
                // replace all an wanted chars and match.
                return /^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g, '')));
            };
            this.clearTableBody = function (table) {
                if ($.browser.msie) {
                    function empty() {
                        while (this.firstChild)
                        this.removeChild(this.firstChild);
                    }
                    empty.apply(table.tBodies[0]);
                } else {
                    table.tBodies[0].innerHTML = "";
                }
            };
        }
    });

    // extend plugin scope
    $.fn.extend({
        tablesorter: $.tablesorter.construct
    });

    // make shortcut
    var ts = $.tablesorter;

    // add default parsers
    ts.addParser({
        id: "text",
        is: function (s) {
            return true;
        }, format: function (s) {
            return $.trim(s.toLocaleLowerCase());
        }, type: "text"
    });

    ts.addParser({
        id: "digit",
        is: function (s, table) {
            var c = table.config;
            return $.tablesorter.isDigit(s, c);
        }, format: function (s) {
            return $.tablesorter.formatFloat(s);
        }, type: "numeric"
    });

    ts.addParser({
        id: "currency",
        is: function (s) {
            return /^[£$€?.]/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g), ""));
        }, type: "numeric"
    });

    ts.addParser({
        id: "ipAddress",
        is: function (s) {
            return /^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);
        }, format: function (s) {
            var a = s.split("."),
                r = "",
                l = a.length;
            for (var i = 0; i < l; i++) {
                var item = a[i];
                if (item.length == 2) {
                    r += "0" + item;
                } else {
                    r += item;
                }
            }
            return $.tablesorter.formatFloat(r);
        }, type: "numeric"
    });

    ts.addParser({
        id: "url",
        is: function (s) {
            return /^(https?|ftp|file):\/\/$/.test(s);
        }, format: function (s) {
            return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//), ''));
        }, type: "text"
    });

    ts.addParser({
        id: "isoDate",
        is: function (s) {
            return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat((s != "") ? new Date(s.replace(
            new RegExp(/-/g), "/")).getTime() : "0");
        }, type: "numeric"
    });

    ts.addParser({
        id: "percent",
        is: function (s) {
            return /\%$/.test($.trim(s));
        }, format: function (s) {
            return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g), ""));
        }, type: "numeric"
    });

    ts.addParser({
        id: "usLongDate",
        is: function (s) {
            return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));
        }, format: function (s) {
            return $.tablesorter.formatFloat(new Date(s).getTime());
        }, type: "numeric"
    });

    ts.addParser({
        id: "shortDate",
        is: function (s) {
            return /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);
        }, format: function (s, table) {
            var c = table.config;
            s = s.replace(/\-/g, "/");
            if (c.dateFormat == "us") {
                // reformat the string in ISO format
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$1/$2");
            } else if (c.dateFormat == "uk") {
                // reformat the string in ISO format
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1");
            } else if (c.dateFormat == "dd/mm/yy" || c.dateFormat == "dd-mm-yy") {
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, "$1/$2/$3");
            }
            return $.tablesorter.formatFloat(new Date(s).getTime());
        }, type: "numeric"
    });
    ts.addParser({
        id: "time",
        is: function (s) {
            return /^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat(new Date("2000/01/01 " + s).getTime());
        }, type: "numeric"
    });
    ts.addParser({
        id: "metadata",
        is: function (s) {
            return false;
        }, format: function (s, table, cell) {
            var c = table.config,
                p = (!c.parserMetadataName) ? 'sortValue' : c.parserMetadataName;
            return $(cell).metadata()[p];
        }, type: "numeric"
    });
    // add default widgets
    ts.addWidget({
        id: "zebra",
        format: function (table) {
            if (table.config.debug) {
                var time = new Date();
            }
            var $tr, row = -1,
                odd;
            // loop through the visible rows
            $("tr:visible", table.tBodies[0]).each(function (i) {
                $tr = $(this);
                // style children rows the same way the parent
                // row was styled
                if (!$tr.hasClass(table.config.cssChildRow)) row++;
                odd = (row % 2 == 0);
                $tr.removeClass(
                table.config.widgetZebra.css[odd ? 0 : 1]).addClass(
                table.config.widgetZebra.css[odd ? 1 : 0])
            });
            if (table.config.debug) {
                $.tablesorter.benchmark("Applying Zebra widget", time);
            }
        }
    });
})(jQuery);

/* ==== jquery.textrange.js ==== */
/* ==== jquery.textrange.js ==== */
(function($, undefined) {
    var textrange = {
        get: function(property) {
            var selectionText="";
            var selectionAtStart=false;
            var selectionAtEnd=false;
            var selectionStart;
            var selectionEnd
            var text = this.is(':input') ?  this.val() :  this.text();

            if (this.is(':input') && this[0].selectionStart !== undefined) {
                // Standards compliant input elements
                selectionStart = this[0].selectionStart;
                selectionEnd = this[0].selectionEnd;
                selectionText = text.substring(this[0].selectionStart, this[0].selectionEnd);
                if (selectionStart == 0) {
                    selectionAtStart = true
                } else {
                    selectionAtStart = false
                }
                if (selectionEnd == text.length) {
                    selectionAtEnd = true
                } else {
                    selectionAtEnd = false
                }
            } else {
                // Content editable HTML areas
                var selection =  window.getSelection();
                if (selection.rangeCount>0) {
                    var selectedRange = selection.getRangeAt(0);
                    var elmtRange = document.createRange();
		    elmtRange.selectNodeContents(this[0]);

		    if (elmtRange.toString().search(/\S/)!=-1) {
			// Find the index of the first text not markup or whitespace.
			var editStartPosition = getRangePosition(this,elmtRange.toString().search(/\S/));
		    } else {
			var editStartPosition = getRangePosition(this,0);
		    }
		    if (elmtRange.toString().search(/\s+$/)!=-1) {
			// index of whitespace at the end of the string
			editEndPosition = getRangePosition(this,elmtRange.toString().search(/\s+$/));
		    } else {
			editEndPosition = getRangePosition(this,elmtRange.toString().length);
		    }

		    // editRange spans the editable text
		    editRange  = document.createRange();
		    editRange.setStart(editStartPosition.node,editStartPosition.offset);
		    editRange.setEnd(editEndPosition.node,editEndPosition.offset);

		    // At edit start or edit end
		    selectionAtStart = Boolean(selectedRange.compareBoundaryPoints(Range.START_TO_START,editRange)<=0);
		    selectionAtEnd = Boolean(selectedRange.compareBoundaryPoints(Range.END_TO_END,editRange)>=0);

                    // selectionStart
                    var myRange = document.createRange();
                    myRange.setStart(elmtRange.startContainer,elmtRange.startOffset);
                    myRange.setEnd(selectedRange.startContainer,selectedRange.startOffset);
                    selectionStart = myRange.toString().length;
                    // selectionEnd
                    myRange.setStart(selectedRange.endContainer,selectedRange.endOffset);
                    myRange.setEnd(elmtRange.endContainer,elmtRange.endOffset);
                    selectionEnd = elmtRange.toString().length - myRange.toString().length;
                    // selectedText
                    selectionText = selectedRange.toString();
                }
            }
            
            var props = {
                selectionText: selectionText,
                selectionAtStart: selectionAtStart,
                selectionAtEnd: selectionAtEnd,
                selectionStart: selectionStart,
                selectionEnd: selectionEnd,
                text: text

            };

            return typeof property === 'undefined' ? props : props[property];
        },

        set: function(selectionStart, selectionEnd) {
            this.focus();
            var text = this.is(':input') ?  this.val() :  this.text();
            if (selectionStart === 'start') {
                selectionStart = 0;
            } 
            if (selectionStart === 'end') {
                selectionStart = text.length;
            }
            if (selectionEnd === 'start') {
                selectionEnd = 0;
            }
            if (selectionEnd === 'end') {
                selectionEnd = text.length;
            }
            if (selectionStart === 'all' && selectionEnd===undefined ) {
                selectionStart=0
                selectionEnd = text.length;
            }
            if (this.is(':input') && this[0].selectionStart != undefined) {
                // Standards compliant input elements
                this[0].selectionStart = selectionStart;
                this[0].selectionEnd = selectionEnd;
            } else if (this.is('[contenteditable=true]') && window.getSelection && window.getSelection().rangeCount > 0) {
                // Content editable
                var selection = window.getSelection();
                var range = document.createRange();

                var startPosition = getRangePosition(this, selectionStart);
                var endPosition = getRangePosition(this, selectionEnd);

                range.setStart(startPosition.node, startPosition.offset);
                range.setEnd(endPosition.node, endPosition.offset);
                selection.removeAllRanges();
                selection.addRange(range);
            } 
            return this;
        }
    };
    function getRangePosition(node, index) {
        // Find the text node (possibly nested) and corresponding offset on the left of 
	// character at index from start of this node
        var childNodes = node.contents();
	var myRange =  document.createRange();
        if (childNodes.size()) {
            for (var i = 0; i < childNodes.size(); i++) {
                var childNode = childNodes.eq(i);
		myRange.selectNode(childNode[0]);
                textLength = myRange.toString().length;
                if ((textLength > 0 && index < textLength) || (i==childNodes.size()-1 && index==textLength)) {
		    // The point we are looking for is in this child
                    return getRangePosition(childNode, index);
                }
                index -= textLength;
            }
        } else {
            return {
                node: node[0],
                offset: index
            }
        }
    }

    $.fn.textrange = function(method) {
        if (!this.is(':input') && !this.is('[contenteditable=true]')) {
            $.error('jQuery.textrange requires that only input or contenteditable elements are contained in the jQuery object');
        }

	if (typeof textrange[method] === 'function') {
            return textrange[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error("Method " + method + " does not exist in jQuery.textrange");
        }
    };
})(jQuery);

/* ==== jquery.thSortMenu.js ==== */
// thSortMenu plugin - support for server-side table sorting
;(function($, window, undefined) {
    // Static variables, shared by all instances of this plugin on the page
    var urlData = splitURL(window.location.href);
    var path = urlData.path;
    var qryData = urlData.data;
    if ( qryData.sortCols !== undefined ) {
	var sortColsArray = qryData.sortCols.split(" ");
	var currentSortColName = sortColsArray[0];
	var currentSortColType = coalesce(sortColsArray[1], 'ASC');
    }

    // The actual widget prototype
    $.widget('qcode.thSortMenu', {
	_create: function() {
	    // Constructor function
	    // Apply default column and sort type
	    if ( this.options.column === undefined ) {
		this.options.column = this.element.parent('th').closest('table').find('col').eq( this.element.parent('th').index() );
	    }
	    if ( ! this.options.column.is('col') || this.options.column.length != 1 ) {
		$.error('Invalid column for thSortMenu');
	    }
	    if ( this.options.type === undefined ) {
		this.options.type = this.getColType(this.options.column);
	    }

	    // Bind events
	    this._on({
		'click': this.menuShow
	    });

	    // Remember parent's background color
	    this.savedBackground = this.element.parent().css('background-color');
	},
	menuShow: function(target) {
	    // Show the menu. Target is the event or element to position against.
	    if ( this.menu === undefined ) {
		this._menuCreate();
	    }
	    this.element.parent().css({
		'background-color': "#ffffe9"
	    });
	    // Use jQuery UI position method
	    this.menu
                .show()
                .position({
		    'my': "left top",
		    'of': target,
		    'collision': "fit"
	        });
	},
	menuHide: function() {
	    // Hide the menu
	    this.menu.hide();
	    this.element.parent().css({
		'background-color': this.savedBackground
	    });
	},
	getColType: function(col) {
	    // Get the sort type of the given column
	    if ( col.hasClass('rank') ) {
                return 'ranking';
            } else if ( col.hasClass('number') || col.hasClass('money') ) {
		return 'numeric';
	    } else if ( col.hasClass('date') ) {
		return 'date';
	    } else {
		return 'alpha';
	    }
	},
	_menuCreate: function() {
	    // Create the menu
	    var colName = this.options.column.attr('name');

	    var ascURL = urlSet(window.location.href, 'sortCols', colName + " " + "ASC");
	    var descURL = urlSet(window.location.href, 'sortCols', colName + " " + "DESC");

	    // Generate link text from sort type
	    var ascText;
	    var descText;
	    switch(this.options.type) {
            case 'ranking':
                ascText = "Sort Top to Bottom";
                descText = "Sort Bottom to Top";
                break;

	    case 'numeric':
		ascText = "Sort Low to High";
		descText = "Sort High to Low";
		break;

	    case 'date':
		ascText = "Sort Old to New";
		descText = "Sort New to Old";
		break;

	    default:
		ascText = "Sort A-Z";
		descText = "Sort Z-A";
	    }

	    // Create the links
	    var ascLink = $('<a>')
		.attr( 'href',  ascURL )
		.html( ascText.replace(/\s/g, "&nbsp;") )
		.linkNoHistory();
	    var descLink = $('<a>')
		.attr( 'href',  descURL )
		.html( descText.replace(/\s/g, "&nbsp;") )
		.linkNoHistory();

	    // Create the menu element
	    this.menu = $('<div>')
		.addClass('th-sort-menu')
		.appendTo($('body'))
		.css({
		    'position': "absolute",
		    'display': "none",
		    'z-index': 3
		});

	    // Add the required links to the menu
	    if ( colName === currentSortColName ) {
		if ( currentSortColType == "ASC" ) {
		    this.menu.append(descLink);
		} else {
		    this.menu.append(ascLink);
		}
	    } else {
		this.menu.append(ascLink).append(descLink);
	    }

	    // Add the menu to the widget and bind hover events
	    this.element.add(this.menu)
		.delayedGroupHover({
		    inTime: 400,
		    outTime: 400,
		    hoverOut: this.menuHide.bind(this)
		});
	}
    });
})(jQuery, window);

/* ==== jquery.theadFixed.js ==== */
/*
theadFixed plugin

Makes the body + foot of a table scrollable, while a "fixed" copy of the thead.
*/
;(function($, undefined) {
    /* css to copy from original th elements */
    var copy_th_css = [
        'display', 'color', 'background-color',
        'font-family', 'font-weight', 'font-size', 'font-style', 'text-align', 'vertical-align',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
        'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
        'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'
    ];
    /* css to copy from the original table */
    var copy_table_css = [
        'border-spacing', 'border-collapse',
        'border-top-width', 'border-right-width', 'border-left-width',
        'border-top-style', 'border-right-style', 'border-left-style',
        'border-top-color', 'border-right-color', 'border-left-color'
    ];

    // Find the element whose DOM location relative to otherRoot is the same as element's postion relative to root.
    // eg. If element is the 3rd child of the 5th child of root, find the 3rd child of the 5th child of otherRoot
    function treeMap(element, root, otherRoot) {
        if ( element.length == 0 ) {
            return $();
        } else if ( element.is(root) ) {
            return otherRoot;
        } else {
            var mappedParent = treeMap(element.parent(), root, otherRoot);
            return mappedParent.children().eq(element.index());
        }
    }

    $.widget('qcode.theadFixed', {
	options: {
	    'height': "500px",
            'fixedWidth': false
	},
	_create: function() {
            this.table = this.element;
            this.theadCells = this.table.children('thead').children('tr').first().children('th');

            // Create the new thead as a separate table
            this.head = $('<table>')
                .append(this.table.children('colgroup').clone())
                .append(this.table.children('thead').clone())
                .addClass('thead-fixed-clone');
            this.head.children('tbody, tfoot').remove();
            var id = this.head.getID();
            qcode.style('#'+id, 'table-layout', "fixed");


            // Generate and store column selectors
            var colSelectors = {};
            this.theadCells.each(function(i, th) {
                colSelectors[i] = '#'+id+' col:nth-child('+(i+1)+')';
            });
            this.colSelectors = colSelectors;


            // Create the wrappers
            this.table.wrap('<div class="scroll-box">');
            this.scrollBox = this.table.parent().wrap('<div class="thead-fixed-wrapper">');
            this.wrapper = this.scrollBox.parent().css({height: this.options.height});
            this.wrapper.prepend(this.head);


            // Add the resize event listeners - only repaint when the table is resized
            // or the window width changes.
            var windowWidth = $(window).width();
            var widget = this;
            // On window resize, or when a resize bubbles to the window.
            this._on($(window), {
                'resize': function(event) {
                    if ( $(event.target).closest(this.element.add(this.clone)).length > 0 ) {
                        this.repaintWidths();

                    } else if (( ! this.options.fixedWidth )
                               && windowWidth != $(window).width() ) {
                        this.repaintWidths();
                        windowWidth = $(window).width();
                    }
                }
            });

            
            // Copy click events back to the matching element in the original thead
            var handlers = {};
            var copy = function(event) {
                var target = $(event.target);
                var eventCopy = jQuery.Event(event.type);
                $.each(['pageX', 'pageY', 'which', 'data', 'metaKey', 'namespace', 'timeStamp'], function(i, property) {
                    eventCopy[property] = event[property];
                });
                $.each(['target', 'relatedTarget'], function(i, property) {
                    if ( $(event[property]).closest(this.table).length > 0 ) {
                        eventCopy[property] = treeMap(event[property], this.head, this.table);
                    } else {
                        eventCopy[property] = event[property];
                    }
                });
                treeMap(target, this.head, this.table).trigger(eventCopy);
                return event.result;
            };
            jQuery.each(['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'], function(i, eventName) {
                handlers[eventName] = copy;
            });
            this._on(this.head, handlers);


            /* Where supported, MutationObserver allows us to listen for changes to the DOM */
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            if ( MutationObserver ) {
                // When the contents or structure of the table change, repaint.
                this.observer = new MutationObserver(this.repaintWidths.bind(this));
                this.observer.observe(
                    this.wrapper[0],
                    {
                        childList: true,
                        characterData: true,
                        subtree: true
                    }
                );

                // When the class or style of any element in the original thead change,
                // replicate this change to the thead copy.
                this.headObserver = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        var target = $(mutation.target);
                        var attribute = mutation.attributeName;
                        if ( target.attr(attribute) === undefined ) {
                            treeMap(target, widget.table, widget.head)
                                .removeAttr(attribute);
                        } else {
                            treeMap(target, widget.table, widget.head)
                                .attr(attribute, target.attr(attribute));
                        }
                    });
                    widget.repaintStyles();
                });
                this.headObserver.observe(
                    this.table.children('thead')[0],
                    {
                        attributes: true,
                        attributeFilter: ['class', 'style', 'disabled'],
                        subtree: true
                    }
                );
            }
            
            // Call repaint once to set the widths and styles
            this.repaint();
            // end of _create;
	},
	repaint: function() {
            this.repaintStyles();
            this.repaintWidths();
        },
        repaintWidths: function() {
            // Measure and apply table and column widths
            var id = this.head.getID();
            var colSelectors = this.colSelectors;

            var styles = {};
            styles['#' + id] = {
                'width': this.table.outerWidth() + "px"
            }
            this.theadCells.each(function(i, th) {
                styles[colSelectors[i]] = {
                    'width': $(th).outerWidth() + "px"
                };
            });
            qcode.style(styles);
        },
        repaintStyles: function() {
            // Copy styles from the original table to the copied table,
            // and from the original th elements to the copied ones.
            var id = this.head.getID();
            var widget = this;
            var styles = {};
            selector = '#' + id;
            styles[selector] = {};
            $.each(copy_table_css, function(i, name) {
                if ( widget.head.css(name) !== widget.table.css(name) ) {
                    styles[selector][name] = widget.table.css(name);
                }
            });
            this.theadCells.each(function(i, th) {
                var thSelector = '#'+id+'>thead>tr>th:nth-child('+(i+1)+')';
                styles[thSelector] = {};
                $.each(copy_th_css, function(j, name) {
                    var copy_th = widget.head.find('th:nth-child('+(i+1)+')');
                    if ( copy_th.css(name) !== $(th).css(name) ) {
                        styles[thSelector][name] = $(th).css(name);
                    }
                });
            });
            qcode.style(styles);
        },
        getWrapper: function() {
            return this.wrapper;
        }
    });
})(jQuery);

/* ==== jquery.utils.js ==== */
// Used for inheritance. Prefer Object.create
function heir(p) {
    return Object.create(o);
};

// Returns the first non-undefined argument
function coalesce() {
    for(var i = 0; i < arguments.length; i++){
	if ( typeof arguments[i] != "undefined" ) {
	    return arguments[i];
	}
    }
};

// Takes an url with query data and splits it, returning the path (with no data) and an object representing the data as name/value pairs.
function splitURL(url) {
    var re = /([^\?]+)\??(.*)/;
    re.exec(url);
    var path = RegExp.$1;
    var queryString = RegExp.$2;
    var data = {};
    if ( queryString !== "" ) {
	$.each(queryString.split('&'),function(i, pair){
	    var pair = pair.split('=');
	    var name = decodeURIComponent( pair[0].replace(/\+/g, " ") );
	    var value = decodeURIComponent( pair[1].replace(/\+/g, " ") );
	    if ( typeof data[name] == "undefined" ) {
		data[name] = value;
	    } else if ( typeof data[name] == "object" ) {
		data[name].push(value);
	    } else {
		data[name] = new Array(data[name], value);
	    }
	});
    }
    return {
	'path': path,
	'data': data
    }
};

// Focus on the first focussable element of a form. Considers all descendants regardless of depth.
function formFocus(form) {
    $(form).find('input, textarea, select').each(function(){
	$(this).focus();
	if ( $(this).is(':focus') ) {
	    return false;
	}
    });
};
// Focus on the first focussable child of element. Only inspects immediate children (does not traverse further down the DOM).
function focusFirstChild(element) {
    $(element).children().each(function(){
	$(this).focus();
	if ( $(this).is(':focus') ) {
	    return false;
	}
    });
};

function stripHTML(html) {
    return html.replace(/<[^>]+>/gi,"");
};
function escapeHTML(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&#34;").replace(/\'/g,"&#39;");
};
function unescapeHTML(str) {
    return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
};

function urlSet(url,name,value) {
    var re = /([^\?]+)\??(.*)/;
    re.exec(url);
    var path = RegExp.$1;
    var queryString = RegExp.$2;
    url = path + "?" + urlDataSet(queryString,name,value);
    return url;
};

function urlDataSet(data,name,value) {
    var list = new Array();
    var a = new Array();
    var b = new Array();
    var c = new Array();
    
    if ( data != "" ) {
	var a = data.split('&');
    }
    for (var i=0;i<a.length;i++) {
	b = a[i].split('=');
	var n = decodeURIComponent(b[0].replace(/\+/g,' '));
	var v = decodeURIComponent(b[1].replace(/\+/g,' '));
	c[n]=v;
    }
    c[name] = value;
    for (key in c) {
	list.push(encodeURIComponent(key) + "=" + encodeURIComponent(c[key]));
    }
    
    data=list.join("&");
    return data;
};

function httpPost(url,data,handler,errorHandler,async) {
    jQuery.ajax ({
	type: "POST",
	cache: false,
	async: async,
	dataType: 'xml',
	url: url,
	data: data,
	success: function(data, textStatus, jqXHR) {
	    // USER ERROR
	    var error = jQuery('error', data).first();
	    if ( error.size() ) {
		var errorMessage = error.text();
		return errorHandler(errorMessage,'USER');
	    }

	    // NORMAL COMPLETION
	    return handler(data, textStatus, jqXHR);
	},
	error: function(jqXHR, textStatus) {
	    // HTTP ERROR
	    if ( jqXHR.status != 200 && jqXHR.status != 0 ) {
		errorMessage = "Error ! Expected response 200 but got " + jqXHR.status;
		return errorHandler(errorMessage,'HTTP');
	    }

	    // XML ERROR
	    if ( textStatus == 'parsererror' ) {
		errorMessage = 'Error ! Unable to parse XML response';
		return errorHandler(errorMessage,'XML');
	    }
	    
	    // DEFAULT ERROR
	    errorMessage = 'Error ! '+ textStatus;
	    return errorHandler(errorMessage, 'UNKNOWN');
	}
    });
};

// linkNoHistory plugin - change behaviour of links so that following them does not create an entry in browser history.
$.fn.linkNoHistory = function() {
    $(this).filter('a').on('click', function(event) {
	window.location.replace($(this).attr('href'));
	event.preventDefault();
    });
    return this;
};

$.fn.setObjectValue = function(value) {
    // Set the value of the target elements based on their type.
    this.each(function() {
	var element = $(this);
	if ( element.is('select, input, textarea') ) {
	    element.val(value);
	} else if ( element.is('.radio-group') ) {
		element.find('[name="'+element.prop('name')+'"][value="'+value+'"]').val(true);
	} else {
	    element.html(value);
	}
    });		 
    return this;
};

// Filter to only table cells in a column
$.fn.findByColumn = function(colSelector) {
    var newSelection = $([]);
    var cells = this.find('td, th');
    this.closest('table').find('col').filter(colSelector).each(function(j, col) {
        newSelection = newSelection.add(cells.filter(':nth-child('+($(col).index()+1)+')'));
    });
    return this.pushStack(newSelection);
};

function parseBoolean(value) {
  value = stripHTML(String(value)).toLowerCase();
  var truth = ['true','yes','y','1','t'];
  for (var i=0;i<truth.length;i++) {
    if ( value == truth[i].toLowerCase() ) {
      return true;
    } 
  }
  return false;
}

;(function($, undefined) {
    $.fn.hrefClick = function() {
        if ( this.length == 0 || this.attr('href') === undefined ) {
            return this;
        }
        if ( this.length > 1 || ( ! this.is('a')) ) {
            $.error('Invalid usage of hrefClick');
        }
        var clickEvent = jQuery.Event('click');
        this.trigger(clickEvent);
        if ( ! clickEvent.isDefaultPrevented() ) {
            window.location = this.attr('href');
        }
    }
})(jQuery);

function preloadImages() {
    // Preload the images given as arguments
    for(var i = 0; i < arguments.length; i++) {
        (new Image()).src = arguments[i];
    }
}

// setZeroTimeout / clearZeroTimeout
// equivalent to setTimeout(function, 0) but uses window.postMessage to bypass browser minimum timeouts
// In other words, schedule a function to be executed after all the other event handlers are finished
// Does not take additional arguments (to pass additional arguments to the callback, use closures instead)
(function(window, undefined) {
    if ( window.postMessage ) {
        var timeouts = []; // Array of functions
        var ids = {}; // Hash of keys, used by clearZeroTimeout, referencing indices of timeouts
        var messageName = "zero-timeout-message";
        var nextID = 0;

        function setZeroTimeout(fn) {
            nextID++;
            timeouts.push(fn);
            ids[nextID] = timeouts.length - 1;
            window.postMessage(messageName, "*");
            return nextID;
        }

        function clearZeroTimeout(index) {
            if ( ids[index] !== undefined ) {
                timeouts.splice(ids[index], 1);
                delete ids[nextID];
            }
        }

        function handleMessage(event) {
            if (event.source == window && event.data == messageName) {
                if ( event.stopPropagation ) {
                    event.stopPropagation();
                }
                if (timeouts.length > 0) {
                    var fn = timeouts.shift();
                    for (index in ids) {
                        if ( ids[index] === timeouts.length ) {
                            delete ids[index];
                            break;
                        }
                    }
                    fn();
                }
                return false;
            }
        }

        if ( window.addEventListener ) {
            window.addEventListener("message", handleMessage, true);
        } else if ( window.attachEvent ) {
            window.attachEvent("onmessage", handleMessage);
        } else {
            window.onmessage = handleMessage;
        }

        window.setZeroTimeout = setZeroTimeout;
        window.clearZeroTimeout = clearZeroTimeout;
    } else {
        window.setZeroTimeout = function(fn) {
            return window.setTimeout(fn, 0);
        }
        window.clearZeroTimeout = function(timeout) {
            window.clearTimeout(timeout);
        }
    }
})(window);

/* ==== qcode.alert.js ==== */
;/*
============================================================
   qcode.alert

   Queue a message to display to the user in a modal dialog
   Takes an htmlString message, and an optional callback

============================================================
   qcode.confirm
   
   Queue a message with Yes/No options for the user,
   Takes an htmlString message and an on-confirm callback

============================================================
 */

var qcode = qcode || {};

(function($, undefined) {
    var ding;
    var alertQueue = [];
    var timeout;
    $(function() {
        if ( qcode.Sound.supported ) {
            ding = new qcode.Sound('/Sounds/Windows%20Ding.wav');
        }
    });

    function showNextMessage() {
        if ( alertQueue.length > 0 && timeout === undefined ) {
            timeout = window.setZeroTimeout(function() {
                var callback = alertQueue.shift();
                timeout = undefined;
                callback();
            });
        }
    }

    qcode.alert = function(message, callback) {
        alertQueue.push(function() {
            // Remember focus and blur
            var toFocus = $(document.activeElement);
            if ( toFocus.is(':input') ) {
                var textRange = toFocus.textrange('get');
            }
            
            $('<div>')
                    .html(message)
                    .dialog({
                        resizable: false,
                        modal: true,
                        buttons: {
                            OK: function() {
                                $(this).dialog('close');
                            }
                        },
                        dialogClass: "alert",
                        close: function() {
                            $(this).remove();
                            
                            // Restore focus
                            toFocus.trigger('focus');
                            if ( toFocus.is(':input') ) {
                                toFocus.textrange('set', textRange.selectionStart, textRange.selectionEnd);
                            }
                            if ( typeof callback == "function" ) {
                                callback();
                            }
                            showNextMessage();
                        }
                    });
            if ( qcode.Sound && qcode.Sound.supported ) {
                ding.play();
            }
        });
        showNextMessage();
    }

    qcode.confirm = function(message, onConfirm) {
        alertQueue.push(function() {
            var toFocus = $(document.activeElement);
            if ( toFocus.is(':input') ) {
                var textRange = toFocus.textrange('get');
            }
            
            $('<div>')
                    .html(message)
                    .dialog({
                        resizable: false,
                        modal: true,
                        dialogClass: "confirm",
                        buttons: [
                            {
                                text: "Yes",
                                click: function() {
                                    $(this).dialog('close');
                                    onConfirm();
                                },
                                keydown: function(event) {
                                    // Arrow key events
                                    if ( event.which >= 37 && event.which <= 40 ) {
                                        $(this).next().focus();
                                    }
                                }
                            },
                            {
                                text: "No",
                                click: function() {
                                    $(this).dialog('close');
                                },
                                keydown: function(event) {
                                    // Arrow key events
                                    if ( event.which >= 37 && event.which <= 40 ) {
                                        $(this).prev().focus();
                                    }
                                }
                            }
                        ],
                        close: function() {
                            $(this).remove();
                            toFocus.trigger('focus');
                            if ( toFocus.is(':input') ) {
                                toFocus.textrange('set', textRange.selectionStart, textRange.selectionEnd);
                            }
                            showNextMessage();
                        }
                    });
            if ( qcode.Sound && qcode.Sound.supported ) {
                ding.play();
            }
        });
        showNextMessage();
    }
})(jQuery);

/* ==== qcode.sound.js ==== */
;var qcode = qcode || {};
/*
  qcode.Sound
  simple sound API (currently webkit only)

  Create a new sound object with "new qcode.Sound(url)";
  test if sound has loaded with property "loaded" (boolean)
  listen for loading with jQuery "load" event
  play with method "play()";

  eg.
  var mySound = new qcode.Sound('/Sounds/demo.wav');
  $(mySound).on('load', function() {
    mySound.play();
  });
*/
(function(window, undefined) {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    if ( window.AudioContext === undefined ) {
        qcode.Sound = {
            supported: false
        }
    } else {
        var context = new AudioContext();
        qcode.Sound = function(url) {
            this.loaded = false;
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            var sound = this;
            request.onload = function() {
                context.decodeAudioData(request.response, function(buffer) {
                    sound._buffer = buffer;
                    sound.loaded = true;
                    jQuery(sound).trigger('load');
                });
            }
            request.send();
        }
        jQuery.extend(qcode.Sound.prototype, {
            play: function() {
                if ( ! this.loaded ) {
                    $(this).on('load', this.play.bind(this));
                } else {
                    var source = context.createBufferSource();
                    source.buffer = this._buffer;
                    source.connect(context.destination);
                    source.start(0);
                }
            }
        });
        qcode.Sound.supported = true;
    }
})(window);

/* ==== qcode.style.js ==== */
;/*
    qcode.style
   
    Append css rules to the page

    Accepts a single argument - an object mapping selectors to objects mapping css properties to values -
    or 3 arguments - a selector, followed by a css property name, followed by a value.

    New values will overwite old values, empty strings will delete.

    Examples:
    # Set 1 style
    qcode.style('#mytable th', 'font-weight', 'bold');

    # Set styles with multiple selectors
    qcode.style({
        '#mytable td:nth-child(3)': {
            'color': 'black',
            'font-weight': 'bold'
        }
        '#mytable td:nth-child(2)': {
            'color': 'red'
        }
    });

    # Remove a declaration
    qcode.style('body', 'background', "");

    # Remove a rule
    qcode.style({
        '#mytable': ""
    });
*/

// Ensure qcode namespace object exists
if ( typeof qcode === "undefined" ) {
    var qcode = {};
}

// Use a closure to hide helper functions and local variables
(function(jQuery, undefined) {
    // Hold a reference to the stylesheet between function calls
    var sheet;

    qcode.style = function(styleChanges) {
        // --------------------------------------------------------------------------------
        // 1. Parse the arguments, read the existing styles, and product 2 objects - oldStyles and newStyles

        // If called with 3 arguments, translate into a single object
        if ( arguments.length === 3 ) {
            var selectorString = arguments[0];
            var property = arguments[1];
            var value = arguments[2];
            var styleChanges = {};
            styleChanges[selectorString] = {};
            styleChanges[selectorString][property] = value;

        } else if ( arguments.length !== 1 ) {
            jQuery.error('Invalid usage of qcode.style - requires 1 or 3 arguments');
        }

        // On first call, attach <style> element to head.
        if ( sheet === undefined ) {
            sheet = $('<style>').appendTo('head')[0].sheet;
        }

        // Read existing styles from the styleSheet
        var oldStyles = {};
        jQuery.each(sheet.cssRules, function(i, cssRule) {
            var selector = cleanCSSSelector(cssRule.selectorText);
            if ( oldStyles[selector] === undefined ) {
                oldStyles[selector] = {};
            }
            for ( var i = 0 ; i < cssRule.style.length ; i++ ) {
                var attribute = cssRule.style.item(i);
                var value = cssRule.style.getPropertyValue(attribute);
                oldStyles[selector][attribute] = value;
            }
        });

        // Copy the styles object
        var newStyles = jQuery.extend(true, {}, oldStyles);

        // Clean selectors and extend new styles object.
        jQuery.each(styleChanges, function(selectorString, declarationChanges) {
            var selector = cleanCSSSelector(selectorString);
            newStyles[selector] = jQuery.extend(newStyles[selector], declarationChanges);
        });
        deleteEmptyStrings(newStyles, true);
        deleteEmptyObjects(newStyles);


        // --------------------------------------------------------------------------------
        // 2. Compare oldStyles with newStyles and determine which rules and declarations need to be added/updated/removed

        var ruleAdditions = {};
        var ruleRemovals = [];
        var declarationUpdates = {};
        var declarationRemovals = {};

        jQuery.each(oldStyles, function(selector, declarations) {
            if ( newStyles[selector] === undefined ) {
                // DELETE RULE
                ruleRemovals.push(selector);
            }
        });

        jQuery.each(newStyles, function(selector, declarations) {
            if ( oldStyles[selector] === undefined ) {
                // ADD RULE
                ruleAdditions[selector] = declarations;

            } else {
                // UPDATE RULE (if changed)
                var newDeclarations = newStyles[selector];
                var oldDeclarations = oldStyles[selector];

                declarationRemovals[selector] = [];
                jQuery.each(oldDeclarations, function(attribute, value) {
                    if ( newDeclarations[attribute] === undefined ) {
                        // REMOVE DECLARATION
                        declarationRemovals[selector].push(attribute);
                    }
                });

                declarationUpdates[selector] = {};
                jQuery.each(newDeclarations, function(attribute, value) {
                    if ( oldDeclarations[attribute] === undefined || oldDeclarations[attribute] !== value ) {
                        // ADD/UPDATE DECLARATION
                        declarationUpdates[selector][attribute] = value;
                    }
                });
                
            }
        });


        // --------------------------------------------------------------------------------
        // 3. Apply the required changes

        // Remove old rules
        jQuery.each(ruleRemovals, function(j, toRemove) {
            for ( var i = sheet.cssRules.length - 1 ; i >= 0 ; i-- ) {
                var cssRule = sheet.cssRules[i];
                var selector = cleanCSSSelector(cssRule.selectorText);
                if ( selector === toRemove ) {
                    sheet.deleteRule(i);
                };
            };
        });

        // Update existing rules
        for ( var i = sheet.cssRules.length - 1 ; i >= 0 ; i-- ) {
            var cssRule = sheet.cssRules[i];
            var selector = cleanCSSSelector(cssRule.selectorText);
            var declarationBlock = cssRule.style;
            jQuery.each(declarationUpdates[selector], function(attribute, value) {
                declarationBlock.setProperty(attribute, value);
            });
            jQuery.each(declarationRemovals[selector], function(i, attribute) {
                declarationBlock.removeProperty(attribute);
            });
        }

        // Add new rules
        jQuery.each(ruleAdditions, function(selector, declarations) {
            var declarationBlock = declarations2cssBlock(declarations);
            sheet.insertRule(selector + ' { ' + declarationBlock + ' } ', sheet.cssRules.length);
        });

        // --------------------------------------------------------------------------------


        // ================================================================================
        // Helper functions:

        function declarations2cssBlock(declarations) {
            // Takes a declaration object mapping attributes to values,
            // outputs a string css declaration block.
            var declarationBlock = "";
            jQuery.each(declarations, function(attribute, value) {
                declarationBlock += attribute + ': ' + value + '; ';
            });
            return declarationBlock;
        }

        function deleteEmptyStrings(object, recursive) {
            // Delete empty strings from an object
            jQuery.each(object, function(key, value) {
                if ( value === "" ) {
                    delete object[key];
                } else if ( recursive && jQuery.isPlainObject(object[key]) ) {
                    deleteEmptyStrings(object[key], true);
                }
            });
        }

        function deleteEmptyObjects(object, recursive) {
            // Delete empty nested objects from an object
            jQuery.each(object, function(key, value) {
                if ( jQuery.isPlainObject(value) && jQuery.isEmptyObject(value) ) {
                    delete object[key];
                } else if ( recursive && jQuery.isPlainObject(object[key]) ) {
                    deleteEmptyObjects(object[key], true);
                }
            });
        }

        function cleanCSSSelector(selector) {
            // "Clean up" a css selector, in an attempt to make string representations consistent.
            selector = selector.replace(/\s*([>+~])\s*/g, " $1 ");
            selector = selector.replace(/\s+/g, ' ');
            selector = selector.trim();
            return selector.toLowerCase();
        }
        // ================================================================================
    }
})(jQuery);

/* ==== tableRowHighlight.js ==== */
function tableRowHighlight(oTable) {
    jQuery(oTable).children('tbody').on('click', 'tr', function(event) {
	var target_td = jQuery(event.target).closest("td");
	jQuery(this).toggleClass('highlight');
        $(event.target).trigger('toggleHighlight');
    });
}

/* ==== wiky.js ==== */
/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/

	Author:  Stefan Goessner/2005-06
	Web:     http://goessner.net/ 
*/
var Wiky = {
  version: 0.95,
  blocks: null,
  rules: {
     all: [
       "Wiky.rules.pre",
       "Wiky.rules.nonwikiblocks",
       "Wiky.rules.wikiblocks",
       "Wiky.rules.post",
     ],
     pre: [
       { rex:/(\r?\n)/g, tmplt:"\xB6" },  // replace line breaks with '¶' ..
     ],
     post: [
       { rex:/(^\xB6)|(\xB6$)/g, tmplt:"" },  // .. remove linebreaks at BOS and EOS ..
       { rex:/@([0-9]+)@/g, tmplt:function($0,$1){return Wiky.restore($1);} }, // resolve blocks ..
       { rex:/\xB6/g, tmplt:"\n" } // replace '¶' with line breaks ..
     ],
     nonwikiblocks: [
       { rex:/\\([%])/g, tmplt:function($0,$1){return Wiky.store($1);} },
       { rex:/\[(?:\{([^}]*)\})?(?:\(([^)]*)\))?%(.*?)%\]/g, tmplt:function($0,$1,$2,$3){return ":p]"+Wiky.store("<pre"+($2?(" lang=\"x-"+Wiky.attr($2)+"\""):"")+Wiky.style($1)+">" + Wiky.apply($3, $2?Wiky.rules.lang[Wiky.attr($2)]:Wiky.rules.code) + "</pre>")+"[p:";} } //programm code block
     ],
     wikiblocks: [
       "Wiky.rules.nonwikiinlines",
       "Wiky.rules.escapes",
       { rex:/(?:^|\xB6)(={1,6})(.*?)[=]*(?=\xB6|$)/g, tmplt:function($0,$1,$2){ var h=$1.length; return ":p]\xB6<h"+h+">"+$2+"</h"+h+">\xB6[p:";} }, // <h1> .. <h6>
       { rex:/(?:^|\xB6)[-]{4}(?:\xB6|$)/g, tmplt:"\xB6<hr/>\xB6" },  // horizontal ruler ..
       { rex:/\\\\([ \xB6])/g, tmplt:"<br/>$1" },  // forced line break ..
       { rex:/(^|\xB6)([*01aAiIg]*[\.*])[ ]/g, tmplt:function($0,$1,$2){var state=$2.replace(/([*])/g,"u").replace(/([\.])/,"");return ":"+state+"]"+$1+"["+state+":";}},
       { rex:/(?:^|\xB6);[ ](.*?):[ ]/g, tmplt:"\xB6:l][l:$1:d][d:"},  // ; term : definition
       { rex:/\[(?:\{([^}]*)\})?(?:\(([^)]*)\))?\"/g, tmplt:function($0,$1,$2){return ":p]<blockquote"+Wiky.attr($2,"cite",0)+Wiky.attr($2,"title",1)+Wiky.style($1)+">[p:"; } }, // block quotation start
       { rex:/\"\]/g, tmplt:":p]</blockquote>[p:" }, // block quotation end
       { rex:/\[(\{[^}]*\})?\|/g, tmplt:":t]$1[r:" },  // .. start table ..
       { rex:/\|\]/g, tmplt:":r][t:" },  // .. end table ..
       { rex:/\|\xB6[ ]?\|/g, tmplt:":r]\xB6[r:" },  // .. end/start table row ..
       { rex:/\|/g, tmplt:":c][c:" },  // .. end/start table cell ..
       { rex:/^(.*)$/g, tmplt:"[p:$1:p]" },  // start paragraph '[p:' at BOS .. end paragraph ':p]' at EOS ..
       { rex:/(([\xB6])([ \t\f\v\xB6]*?)){2,}/g, tmplt:":p]$1[p:" },  // .. separate paragraphs at blank lines ..
       { rex:/\[([01AIacdgilprtu]+)[:](.*?)[:]([01AIacdgilprtu]+)\]/g, tmplt:function($0,$1,$2,$3){return Wiky.sectionRule($1==undefined?"":$1,"",Wiky.apply($2,Wiky.rules.wikiinlines),!$3?"":$3);} },
       { rex:/\[[01AIacdgilprtu]+[:]|[:][01AIacdgilprtu]+\]/g, tmplt:"" },  // .. remove singular section delimiters (they frequently exist with incomplete documents while typing) ..
       { rex:/<td>(?:([0-9]*)[>])?([ ]?)(.*?)([ ]?)<\/td>/g, tmplt:function($0,$1,$2,$3,$4){return "<td"+($1?" colspan=\""+$1+"\"":"")+($2==" "?(" style=\"text-align:"+($2==$4?"center":"right")+";\""):($4==" "?" style=\"text-align:left;\"":""))+">"+$2+$3+$4+"</td>";} },
       { rex:/<(p|table)>(?:\xB6)?(?:\{(.*?)\})/g, tmplt:function($0,$1,$2){return "<"+$1+Wiky.style($2)+">";} },
       { rex:/<p>([ \t\f\v\xB6]*?)<\/p>/g, tmplt:"$1" },  // .. remove empty paragraphs ..
       "Wiky.rules.shortcuts"
     ],
     nonwikiinlines: [
       { rex:/%(?:\{([^}]*)\})?(?:\(([^)]*)\))?(.*?)%/g, tmplt:function($0,$1,$2,$3){return Wiky.store("<code"+($2?(" lang=\"x-"+Wiky.attr($2)+"\""):"")+Wiky.style($1)+">" + Wiky.apply($3, $2?Wiky.rules.lang[Wiky.attr($2)]:Wiky.rules.code) + "</code>");} }, // inline code
       { rex:/%(.*?)%/g, tmplt:function($0,$1){return Wiky.store("<code>" + Wiky.apply($2, Wiky.rules.code) + "</code>");} }
     ],
     wikiinlines: [
       { rex:/\*\*((\*?[^\*])+)\*\*/g, tmplt:"<strong>$1</strong>" },  // .. bold ..
       { rex:/__((_?[^_])+)__/g, tmplt:"<u>$1</u>" },
       { rex:/(^|[^a-z0-9:])\/\/((\/?[^\/])+)\/\/([^a-z0-9]|$)/gi, tmplt:"$1<em>$2</em>$4" },
       { rex:/\^([^^]+)\^/g, tmplt:"<sup>$1</sup>" },
       { rex:/~([^~]+)~/g, tmplt:"<sub>$1</sub>" },
       { rex:/\(-(.+?)-\)/g, tmplt:"<del>$1</del>" },
       { rex:/\?([^ \t\f\v\xB6]+)\((.+)\)\?/g, tmplt:"<abbr title=\"$2\">$1</abbr>" },  // .. abbreviation ..
       { rex:/\[(?:\{([^}]*)\})?[Ii]ma?ge?\:([^ ,\]]*)(?:[, ]([^\]]*))?\]/g, tmplt:function($0,$1,$2,$3){return Wiky.store("<img"+Wiky.style($1)+" src=\""+$2+"\" alt=\""+($3?$3:$2)+"\" title=\""+($3?$3:$2)+"\"/>");} },  // wikimedia image style ..
       { rex:/\[([^ ,]+)[, ]([^\]]*)\]/g, tmplt:function($0,$1,$2){return Wiky.store("<a href=\""+$1+"\">"+$2+"</a>");}},  // wiki block style uri's ..
       { rex:/(((http(s?))\:\/\/)?[A-Za-z0-9\._\/~\-:]+\.(?:png|jpg|jpeg|gif|bmp))/g, tmplt:function($0,$1,$2){return Wiky.store("<img src=\""+$1+"\" alt=\""+$1+"\"/>");} },  // simple images .. 
       { rex:/((mailto\:|javascript\:|(news|file|(ht|f)tp(s?))\:\/\/)[A-Za-z0-9\.:_\/~%\-+&$#?!=()@\x80-\xB5\xB7\xFF]+)/g, tmplt:"<a href=\"$1\">$1</a>" }  // simple uri's .. 
     ],
     escapes: [
       { rex:/\\([|*~\^])/g, tmplt:function($0,$1){return Wiky.store($1);} },
       { rex:/\\&/g, tmplt:"&amp;" },
       { rex:/\\>/g, tmplt:"&gt;" },
       { rex:/\\</g, tmplt:"&lt;" }
     ],
     shortcuts: [
       { rex:/---/g, tmplt:"&#8212;" },  // &mdash;
       { rex:/--/g, tmplt:"&#8211;" },  // &ndash;
       { rex:/[\.]{3}/g, tmplt:"&#8230;"}, // &hellip;
       { rex:/<->/g, tmplt:"&#8596;"}, // $harr;
       { rex:/<-/g, tmplt:"&#8592;"}, // &larr;
       { rex:/->/g, tmplt:"&#8594;"}, //&rarr;
     ],
     code: [
       { rex:/&/g, tmplt:"&amp;"},
       { rex:/</g, tmplt:"&lt;"},
       { rex:/>/g, tmplt:"&gt;"}
     ],
     lang: {}
   },

   inverse: {
     all: [
       "Wiky.inverse.pre",
       "Wiky.inverse.nonwikiblocks",
       "Wiky.inverse.wikiblocks",
       "Wiky.inverse.post"
     ],
     pre: [
       { rex:/(\r?\n)/g, tmplt:"\xB6" }  // replace line breaks with '¶' ..
     ],
     post: [
       { rex:/@([0-9]+)@/g, tmplt:function($0,$1){return Wiky.restore($1);} },  // resolve blocks ..
       { rex:/\xB6/g, tmplt:"\n" }  // replace '¶' with line breaks ..
     ],
     nonwikiblocks: [
       { rex:/<pre([^>]*)>(.*?)<\/pre>/mgi, tmplt:function($0,$1,$2){return Wiky.store("["+Wiky.invStyle($1)+Wiky.invAttr($1,["lang"]).replace(/x\-/,"")+"%"+Wiky.apply($2, Wiky.hasAttr($1,"lang")?Wiky.inverse.lang[Wiky.attrVal($1,"lang").substr(2)]:Wiky.inverse.code)+"%]");} } //code block
     ],
     wikiblocks: [
       "Wiky.inverse.nonwikiinlines",
       "Wiky.inverse.escapes",
       "Wiky.inverse.wikiinlines",
       { rex:/<h1>(.*?)<\/h1>/mgi, tmplt:"\xB6=$1=\xB6" },
       { rex:/<h2>(.*?)<\/h2>/mgi, tmplt:"\xB6==$1==\xB6" },
       { rex:/<h3>(.*?)<\/h3>/mgi, tmplt:"\xB6===$1===\xB6" },
       { rex:/<h4>(.*?)<\/h4>/mgi, tmplt:"\xB6====$1====\xB6" },
       { rex:/<h5>(.*?)<\/h5>/mgi, tmplt:"\xB6=====$1=====\xB6" },
       { rex:/<h6>(.*?)<\/h6>/mgi, tmplt:"\xB6======$1======\xB6" },
       { rex:/<(p|table)[^>]+(style=\"[^\"]*\")[^>]*>/mgi, tmplt:function($0,$1,$2){return "<"+$1+">"+Wiky.invStyle($2);} },
       { rex:/ *\xB6{2} *<li/mgi, tmplt:"\xB6<li" },  // ie6 only ..
       { rex:/ *<li class=\"?([^ >\"]*)\"?[^>]*?>([^<]*)/mgi, tmplt:function($0,$1,$2){return $1.replace(/u/g,"\xB6*").replace(/([01aAiIg])$/,"$1.")+" "+$2;}},  // list items ..
       { rex:/(^| *\xB6) *<(u|o)l[^>]*?>\xB6/mgi, tmplt:"$1" },  // only outer level list start at BOL ...
       { rex:/(<\/(?:dl|ol|ul|p)> *[ \xB6]* *<(?:p)>)/gi, tmplt:"\xB6\xB6" },
       { rex:/ *<dt>(.*?)<\/dt> *[ \f\n\r\t\v]* *<dd>/mgi, tmplt:"; $1: " },
       { rex:/<blockquote([^>]*)>/mgi, tmplt:function($0,$1){return Wiky.store("["+Wiky.invStyle($1)+Wiky.invAttr($1,["cite","title"])+"\"");} },
       { rex:/<\/blockquote>/mgi, tmplt:"\"]" },
       { rex:/<td class=\"?lft\"?>\xB6*[ ]?|<\/tr>/mgi, tmplt:"|" },  // ie6 only ..
       { rex:/\xB6<tr(?:[^>]*?)>/mgi, tmplt:"\xB6" },
       { rex:/<td colspan=\"([0-9]+)\"(?:[^>]*?)>/mgi, tmplt:"|$1>" },
       { rex:/<td(?:[^>]*?)>/mgi, tmplt:"|" },
       { rex:/<table>/mgi, tmplt:"[" },
       { rex:/<\/table>/mgi, tmplt:"]" },
       { rex:/<tr(?:[^>]*?)>\xB6*|<\/td>\xB6*|<tbody>\xB6*|<\/tbody>/mgi, tmplt:"" },
       { rex:/<hr\/?>/mgi, tmplt:"\xB6----\xB6" },
       { rex:/<br\/?> */mgi, tmplt:"\\\\\xB6" },
       { rex:/( *<p>| *<(d|o|u)l[^>]*>|<\/(dl|ol|ul)> *|<\/(li|dd)> *)/mgi, tmplt:"" },
       { rex:/(<\/p> *)/mgi, tmplt:"\xB6" },
       "Wiky.inverse.shortcuts"
     ],
     nonwikiinlines: [
       { rex:/<code>(.*?)<\/code>/g, tmplt:function($0,$1){return Wiky.store("%"+Wiky.apply($1, Wiky.inverse["code"])+"%");} }
     ],
     wikiinlines: [
       { rex:/<strong[^a-z>]*?>(.*?)<\/strong>/mgi, tmplt:"**$1**" },
       { rex:/<b[^a-z>]*?>(.*?)<\/b>/mgi, tmplt:"**$1**" },
       { rex:/<em[^a-z>]*?>(.*?)<\/em>/mgi, tmplt:"//$1//" },
       { rex:/<i[^a-z>]*?>(.*?)<\/i>/mgi, tmplt:"//$1//" },
       { rex:/<u[^a-z>]*?>(.*?)<\/u>/mgi, tmplt:"__$1__" },
       { rex:/<sup[^>]*?>(.*?)<\/sup>/mgi, tmplt:"^$1^" },
       { rex:/<sub[^>]*?>(.*?)<\/sub>/mgi, tmplt:"~$1~" },
       { rex:/<del[^>]*?>(.*?)<\/del>/mgi, tmplt:"(-$1-)" },
       { rex:/<abbr title=\"([^\"]*)\">(.*?)<\/abbr>/mgi, tmplt:"?$2($1)?" },
       { rex:/<a href=\"([^\"]*)\"[^>]*?>(.*?)<\/a>/mgi, tmplt:function($0,$1,$2){return $1==$2?$1:"["+$1+","+$2+"]";}},
       { rex:/<img([^>]*)\/>/mgi, tmplt:function($0,$1){var a=Wiky.attrVal($1,"alt"),h=Wiky.attrVal($1,"src"),t=Wiky.attrVal($1,"title"),s=Wiky.attrVal($1,"style");return s||(t&&h!=t)?("["+Wiky.invStyle($1)+"img:"+h+(t&&(","+t))+"]"):h;}},
     ],
     escapes: [
       { rex:/([|*~%\^])/g, tmplt:"\\$1" },
       { rex:/&amp;/g, tmplt:"\\&" },
       { rex:/&gt;/g, tmplt:"\\>" },
       { rex:/&lt;/g, tmplt:"\\<" }
     ],
     shortcuts: [
       { rex:/&#8211;|\u2013/g, tmplt:"--"},
       { rex:/&#8212;|\u2014/g, tmplt:"---"},
       { rex:/&#8230;|\u2026/g, tmplt:"..."},
       { rex:/&#8596;|\u2194/g, tmplt:"<->"},
       { rex:/&#8592;|\u2190/g, tmplt:"<-"},
       { rex:/&#8594;|\u2192/g, tmplt:"->"}
     ],
     code: [
       { rex:/&amp;/g, tmplt:"&"},
       { rex:/&lt;/g, tmplt:"<"},
       { rex:/&gt;/g, tmplt:">"}
     ],
     lang: {}
   },

   toHtml: function(str) {
      Wiky.blocks = [];
      return Wiky.apply(str, Wiky.rules.all);
   },

   toWiki: function(str) {
      Wiky.blocks = [];
      return Wiky.apply(str, Wiky.inverse.all);
   },

   apply: function(str, rules) {
      if (str && rules)
         for (var i in rules) {
            if (typeof(rules[i]) == "string")
               str = Wiky.apply(str, eval(rules[i]));
            else
               str = str.replace(rules[i].rex, rules[i].tmplt);
         }
      return str;
   },
   store: function(str, unresolved) {
      return unresolved ? "@" + (Wiky.blocks.push(str)-1) + "@"
                        : "@" + (Wiky.blocks.push(str.replace(/@([0-9]+)@/g, function($0,$1){return Wiky.restore($1);}))-1) + "@";
   },
   restore: function(idx) {
      return Wiky.blocks[idx];
   },
   attr: function(str, name, idx) {
      var a = str && str.split(",")[idx||0];
      return a ? (name ? (" "+name+"=\""+a+"\"") : a) : "";
   },
   hasAttr: function(str, name) {
      return new RegExp(name+"=").test(str);
   },
   attrVal: function(str, name) {
      return str.replace(new RegExp("^.*?"+name+"=\"(.*?)\".*?$"), "$1");
   },
   invAttr: function(str, names) {
      var a=[], x;
      for (var i in names)
         if (str.indexOf(names[i]+"=")>=0) 
            a.push(str.replace(new RegExp("^.*?"+names[i]+"=\"(.*?)\".*?$"), "$1"));
      return a.length ? ("("+a.join(",")+")") : "";
   },
   style: function(str) {
      var s = str && str.split(/,|;/), p, style = "";
      for (var i in s) {
         p = s[i].split(":");
         if (p[0] == ">")       style += "margin-left:4em;";
         else if (p[0] == "<")  style += "margin-right:4em;";
         else if (p[0] == ">>") style += "float:right;";
         else if (p[0] == "<<") style += "float:left;";
         else if (p[0] == "=") style += "display:block;margin:0 auto;";
         else if (p[0] == "_")  style += "text-decoration:underline;";
         else if (p[0] == "b")  style += "border:solid 1px;";
         else if (p[0] == "c")  style += "color:"+p[1]+";";
         else if (p[0] == "C")  style += "background:"+p[1]+";";
         else if (p[0] == "w")  style += "width:"+p[1]+";";
         else                   style += p[0]+":"+p[1]+";";
      }
      return style ? " style=\""+style+"\"" : "";
   },
   invStyle: function(str) {
      var s = /style=/.test(str) ? str.replace(/^.*?style=\"(.*?)\".*?$/, "$1") : "",
          p = s && s.split(";"), pi, prop = [];
      for (var i in p) {
         pi = p[i].split(":");
         if (pi[0] == "margin-left" && pi[1]=="4em") prop.push(">");
         else if (pi[0] == "margin-right" && pi[1]=="4em") prop.push("<");
         else if (pi[0] == "float" && pi[1]=="right") prop.push(">>");
         else if (pi[0] == "float" && pi[1]=="left") prop.push("<<");
         else if (pi[0] == "margin" && pi[1]=="0 auto") prop.push("=");
         else if (pi[0] == "display" && pi[1]=="block") ;
         else if (pi[0] == "text-decoration" && pi[1]=="underline") prop.push("_");
         else if (pi[0] == "border" && pi[1]=="solid 1px") prop.push("b");
         else if (pi[0] == "color") prop.push("c:"+pi[1]);
         else if (pi[0] == "background") prop.push("C:"+pi[1]);
         else if (pi[0] == "width") prop.push("w:"+pi[1]);
         else if (pi[0]) prop.push(pi[0]+":"+pi[1]);
      }
      return prop.length ? ("{" + prop.join(",") + "}") : "";
   },
   sectionRule: function(fromLevel, style, content, toLevel) {
      var trf = { p_p: "<p>$1</p>",
                  p_u: "<p>$1</p><ul$3>",
                  p_o: "<p>$1</p><ol$3>",
                  // p - ul
                  // ul - p
                  u_p: "<li$2>$1</li></ul>",
                  u_c: "<li$2>$1</li></ul></td>",
                  u_r: "<li$2>$1</li></ul></td></tr>",
                  uu_p: "<li$2>$1</li></ul></li></ul>",
                  uo_p: "<li$2>$1</li></ol></li></ul>",
                  uuu_p: "<li$2>$1</li></ul></li></ul></li></ul>",
                  uou_p: "<li$2>$1</li></ul></li></ol></li></ul>",
                  uuo_p: "<li$2>$1</li></ol></li></ul></li></ul>",
                  uoo_p: "<li$2>$1</li></ol></li></ol></li></ul>",
                  // ul - ul
                  u_u: "<li$2>$1</li>",
                  uu_u: "<li$2>$1</li></ul></li>",
                  uo_u: "<li$2>$1</li></ol></li>",
                  uuu_u: "<li$2>$1</li></ul></li></ul></li>",
                  uou_u: "<li$2>$1</li></ul></li></ol></li>",
                  uuo_u: "<li$2>$1</li></ol></li></ul></li>",
                  uoo_u: "<li$2>$1</li></ol></li></ol></li>",
                  u_uu: "<li$2>$1<ul$3>",
                  // ul - ol
                  u_o: "<li$2>$1</li></ul><ol$3>",
                  uu_o: "<li$2>$1</li></ul></li></ul><ol$3>",
                  uo_o: "<li$2>$1</li></ol></li></ul><ol$3>",
                  uuu_o: "<li$2>$1</li></ul></li></ul></li></ul><ol$3>",
                  uou_o: "<li$2>$1</li></ul></li></ol></li></ul><ol$3>",
                  uuo_o: "<li$2>$1</li></ol></li></ul></li></ul><ol$3>",
                  uoo_o: "<li$2>$1</li></ol></li></ol></li></ul><ol$3>",
                  u_uo: "<li$2>$1<ol$3>",
                  // ol - p
                  o_p: "<li$2>$1</li></ol>",
                  oo_p: "<li$2>$1</li></ol></li></ol>",
                  ou_p: "<li$2>$1</li></ul></li></ol>",
                  ooo_p: "<li$2>$1</li></ol></li></ol>",
                  ouo_p: "<li$2>$1</li></ol></li></ul></li></ol>",
                  oou_p: "<li$2>$1</li></ul></li></ol></li></ol>",
                  ouu_p: "<li$2>$1</li></ul></li></ul></li></ol>",
                  // ol - ul
                  o_u: "<li$2>$1</li></ol><ul$3>",
                  oo_u: "<li$2>$1</li></ol></li></ol><ul$3>",
                  ou_u: "<li$2>$1</li></ul></li></ol><ul$3>",
                  ooo_u: "<li$2>$1</li></ol></li></ol></li></ol><ul$3>",
                  ouo_u: "<li$2>$1</li></ol></li></ul></li></ol><ul$3>",
                  oou_u: "<li$2>$1</li></ul></li></ol></li></ol><ul$3>",
                  ouu_u: "<li$2>$1</li></ul></li></ul></li></ol><ul$3>",
                  o_ou: "<li$2>$1<ul$3>",
                  // -- ol - ol --
                  o_o: "<li$2>$1</li>",
                  oo_o: "<li$2>$1</li></ol></li>",
                  ou_o: "<li$2>$1</li></ul></li>",
                  ooo_o: "<li$2>$1</li></ol></li></ol></li>",
                  ouo_o: "<li$2>$1</li></ol></li></ul></li>",
                  oou_o: "<li$2>$1</li></ul></li></ol></li>",
                  ouu_o: "<li$2>$1</li></ul></li></ul></li>",
                  o_oo: "<li$2>$1<ol$3>",
                  // -- dl --
                  l_d: "<dt>$1</dt>",
                  d_l: "<dd>$1</dd>",
                  d_u: "<dd>$1</dd></dl><ul>",
                  d_o: "<dd>$1</dd></dl><ol>",
                  p_l: "<p>$1</p><dl>",
                  u_l: "<li$2>$1</li></ul><dl>",
                  o_l: "<li$2>$1</li></ol><dl>",
                  uu_l: "<li$2>$1</li></ul></li></ul><dl>",
                  uo_l: "<li$2>$1</li></ol></li></ul><dl>",
                  ou_l: "<li$2>$1</li></ul></li></ol><dl>",
                  oo_l: "<li$2>$1</li></ol></li></ol><dl>",
                  d_p: "<dd>$1</dd></dl>",
                  // -- table --
                  p_t: "<p>$1</p><table>",
                  p_r: "<p>$1</p></td></tr>",
                  p_c: "<p>$1</p></td>",
                  t_p: "</table><p>$1</p>",
                  r_r: "<tr><td>$1</td></tr>",
                  r_p: "<tr><td><p>$1</p>",
                  r_c: "<tr><td>$1</td>",
                  r_u: "<tr><td>$1<ul>",
                  c_p: "<td><p>$1</p>",
                  c_r: "<td>$1</td></tr>",
                  c_c: "<td>$1</td>",
//                  c_u: "<td>$1<ul>",
                  u_t: "<li$2>$1</li></ul><table>",
                  o_t: "<li$2>$1</li></ol><table>",
                  d_t: "<dd>$1</dd></dl><table>",
                  t_u: "</table><p>$1</p><ul>",
                  t_o: "</table><p>$1</p><ol>",
                  t_l: "</table><p>$1</p><dl>"
      };
      var type = { "0": "decimal-leading-zero",
                   "1": "decimal",
                   "a": "lower-alpha",
                   "A": "upper-alpha",
                   "i": "lower-roman",
                   "I": "upper-roman",
                   "g": "lower-greek" };

      var from = "", to = "", maxlen = Math.max(fromLevel.length, toLevel.length), sync = true, sectiontype = type[toLevel.charAt(toLevel.length-1)], transition;

      for (var i=0; i<maxlen; i++)
         if (fromLevel.charAt(i+1) != toLevel.charAt(i+1) || !sync || i == maxlen-1)
         {
            from += fromLevel.charAt(i) == undefined ? " " : fromLevel.charAt(i);
            to += toLevel.charAt(i) == undefined ? " " : toLevel.charAt(i);
            sync = false;
         }
      transition = (from + "_" + to).replace(/([01AIagi])/g, "o");
      return !trf[transition] ? ("?(" +  transition + ")")  // error string !
                              : trf[transition].replace(/\$2/, " class=\"" + fromLevel + "\"")
                                               .replace(/\$3/, !sectiontype ? "" : (" style=\"list-style-type:" + sectiontype + ";\""))
                                               .replace(/\$1/, content)
                                               .replace(/<p><\/p>/, "");
   }
}


