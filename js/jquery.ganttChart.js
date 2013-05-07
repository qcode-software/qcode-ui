// ganttChart plugin. Call on a table to make it into a gantt chart.
// options -
//  width: any css width, width of the entire chart (table + calendar)
//  headerHeight: integer, height of the chart header
//  columns: object mapping keys to any jQuery selector/element/elementArray/object
//   use "columns" to match columns containing the row start dates, finish dates and bar colors
//  pxPerDay: integer, width of 1 day in the calendar
//  barHeight: integer, px height of the bars
;(function($, undefined) {
    var scrollBarWidth = "18px";
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

            // Record the old margin in case we want to destroy this widget
            this.oldMarginTop = this.table.css('margin-top');
            this.oldMarginBottom = this.table.css('margin-bottom');
            this.table.css({
                'margin-top': this.options.headerHeight - this.table.find('thead').outerHeight(),
                'margin-bottom': scrollBarWidth
            });

            // Create a scrolling window for the calendar
            this.calendarFrame = $('<div class="calendarFrame">')
                .css({
                    left: this.table.outerWidth(),
                    right: 0,
                    top: 0,
                    bottom: 0
                })
                .insertAfter(this.table);

            // Create a canvas for the calendar
            this.calendar = $('<canvas>').appendTo(this.calendarFrame);

            // In case the table is a dbGrid, listen for updates.
            this._on({'dbRowActionReturn': function() {
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
                maxDate.incrDays(14);
            }
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
            var calendarWidget = this.calendar.data('calendar');
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
                            var verticalPosition = row.positionRelativeTo(ganttChart.wrapper).top + (row.height() / 2);
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
                            var verticalPosition = row.positionRelativeTo(ganttChart.wrapper).top + (row.height() / 2);
                            var date = ganttChart._getRowFinishDate(row.index());
                            dependencies.push({
                                date: date,
                                verticalPosition: verticalPosition
                            });
                        });
                    }
                    var verticalPosition = $(domRow).positionRelativeTo(ganttChart.wrapper).top + ($(domRow).height() / 2);
                    var bar = new Task(calendarWidget, {
                        startDate: startDate,
                        finishDate: finishDate,
                        verticalPosition: verticalPosition,
                        color: ganttChart._getCellValue('barColor', rowIndex),
                        dependencies: dependencies,
                        dependents: dependents
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

    $.qcode.ganttChart.Task = function(calendarWidget, options) {
        var superProto = $.qcode.calendar.Bar.prototype;
        $.qcode.ganttChart.Task = function(calendarWidget, options) {
            superProto.constructor.call(this, calendarWidget, options);
            this.options = $.extend({
                dependencyColor: 'grey',
                dependentColor: 'grey',
                radius: 20
            }, this.options);
            this.options.rowHeight = coalesce(this.options.rowHeight, this.options.barHeight * 2);
            this.highlight = false;
            this
                .on('mouseenter', function() {
                    this.calendarWidget.draw();
                })
                .on('mouseleave', function() {
                    this.calendarWidget.draw();
                })
                .on('click', function() {
                    this.highlight = ! this.highlight;
                });
        }
        $.qcode.ganttChart.Task.prototype = $.extend(Object.create(superProto), {
            constructor: $.qcode.ganttChart.Task,
            draw: function() {
                superProto.draw.call(this);
                if ( this.hover || this.highlight ) {
                    var ctx = this.context;

                    var highlight = {
                        x: 0,
                        width: this.calendarWidget.option('width'),
                        y: this.options.verticalPosition - (this.options.rowHeight / 2),
                        height: this.options.rowHeight
                    }
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.strokeStyle = 'lightgrey';
                    ctx.fillStyle = 'lightyellow';
                    ctx.strokeRect(highlight.x - 0.5, highlight.y - 0.5, highlight.width + 1, highlight.height + 1);
                    ctx.fillRect(highlight.x, highlight.y, highlight.width, highlight.height);

                    ctx.globalCompositeOperation = 'source-over';
                    this.drawDependencies();
                    this.drawDependents();
                }
            },
            drawDependencies: function() {
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
                        x: task.calendarWidget.options.width - task.calendarWidget.date2positionRight(dependency.date),
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
            drawDependents: function() {
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
                        x: task.calendarWidget.date2positionLeft(dependency.date),
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
        return new $.qcode.ganttChart.Task(calendarWidget, options);
    };
})(jQuery);