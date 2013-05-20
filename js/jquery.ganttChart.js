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

            // Wrap the whole thing in a div
            this.table.wrap('<div class="ganttChart wrapper">');
            this.wrapper = this.table.parent();
            this.wrapper.css('width', this.options.width);

            // Create a scrolling window for the calendar
            this.calendarFrame = $('<div class="calendarFrame">')
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
                'margin-top': this.options.headerHeight - this.table.find('thead').outerHeight(),
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
                this.draw();
            }});
            this._on({'resize': function(event) {
                this.draw();
            }});

            this.draw();
        },
        draw: function() {
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
                bar.remove();
            });
            this.bars = [];

            var Task = ganttChart.constructor.Task;
            this.rows.each(function(rowIndex, domRow) {
                var startDate = ganttChart._getRowStartDate(rowIndex);
                var finishDate = ganttChart._getRowFinishDate(rowIndex);
                if ( Date.isValid(startDate) && Date.isValid(finishDate) ) {
                    var dependents = [];
                    var dependencies = [];
                    var list = ganttChart._getCellValue('dependentIDs', rowIndex);
                    if ( list.length > 0 ) {
                        $.each(list.split(' '), function(i, rowID) {
                            var row = ganttChart._getRowByID(rowID);
                            if ( row.length !== 1 ) {
                                console.log('Could not find taskID ' + rowID + ' from row index ' + rowIndex);
                                return;
                            }
                            var cell = row.children().first();
                            var verticalPosition = row.positionRelativeTo(ganttChart.wrapper).top + ((row.height() - parseInt(cell.css('border-top-width')) - parseInt(cell.css('border-bottom-width'))) / 2);
                            var date = ganttChart._getRowStartDate(row.index());
                            dependents.push({
                                date: date,
                                verticalPosition: verticalPosition
                            });
                        });
                    }
                    var list = ganttChart._getCellValue('dependencyIDs', rowIndex);
                    if ( list.length > 0 ) {
                        $.each(list.split(" "), function(i, rowID) {
                            var row = ganttChart._getRowByID(rowID);
                            if ( row.length !== 1 ) {
                                console.log('Could not find taskID ' + rowID + ' from row index ' + rowIndex);
                                return;
                            }
                            var cell = row.children().first();
                            var verticalPosition = row.positionRelativeTo(ganttChart.wrapper).top + ((row.height() - parseInt(cell.css('border-top-width')) - parseInt(cell.css('border-bottom-width'))) / 2);
                            var date = ganttChart._getRowFinishDate(row.index());
                            dependencies.push({
                                date: date,
                                verticalPosition: verticalPosition
                            });
                        });
                    }
                    var row = $(domRow);
                    var cell = row.children().first();
                            var verticalPosition = row.positionRelativeTo(ganttChart.wrapper).top + ((row.height() - parseInt(cell.css('border-top-width')) - parseInt(cell.css('border-bottom-width'))) / 2)
                    var bar = new Task(ganttChart.calendar, {
                        startDate: startDate,
                        finishDate: finishDate,
                        verticalPosition: verticalPosition,
                        color: ganttChart._getCellValue('barColor', rowIndex),
                        dependencies: dependencies,
                        dependents: dependents,
                        rowHeight: (row.height() - parseInt(cell.css('border-top-width')) - parseInt(cell.css('border-bottom-width')))
                    });
                    ganttChart.calendar.calendar('addObject', bar);
                    ganttChart.bars.push(bar);
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
    // A horizontal bar representing a single task, provides row highlighting and draws lines to dependancies
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
                    this.highlighted = ! this.highlighted;
                    this.calendarCanvas.calendar('draw');
                });
        }

        // Properties and methods
        Task.prototype = $.extend(Object.create(superProto), {
            constructor: Task,
            options: Object.create(superProto.options, {
                rowHeight: undefined,
                dependencyColor: 'grey',
                dependentColor: 'grey',
                highlightColor: 'lightyellow',
                highlightEdge: 'lightgrey',
                dependencies: [],
                dependents: [],
                radius: 20,
                layer: 4
            }),
            draw: function(layer) {
                // Draw this task.
                if ( (layer === undefined || layer === 2) && (this.hover || this.highlighted) ) {
                    // Draw the highlight/hover bar
                    var ctx = this.context;
                    var highlight = {
                        left: 0,
                        width: this.calendarCanvas.calendar('option','width'),
                        top: this.options.verticalPosition - (this.options.rowHeight / 2),
                        height: this.options.rowHeight
                    }
                    if ( this.highlighted ) {
                        ctx.strokeStyle = this.options.highlightEdge;
                        ctx.strokeRect(highlight.left - 0.5, highlight.top - 0.5, highlight.width + 1, highlight.height + 1);
                    }
                    ctx.fillStyle = this.options.highlightColor;
                    ctx.fillRect(highlight.left, highlight.top, highlight.width, highlight.height);

                } else if ( (layer === undefined || layer === 3) && (this.hover || this.highlighted) ) {
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