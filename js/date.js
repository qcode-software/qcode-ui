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
    if ( !Date.prototype.toISODateString ) {
        // Format Date as an ISO Date yyyy-mm-dd
        ( function() {
            function pad(number) {
                var r = String(number);
                if ( r.length === 1 ) {
                    r = '0' + r;
                }
                return r;
            }
            
            Date.prototype.toISODateString = function() {
                return this.getUTCFullYear() + '-' + pad( this.getUTCMonth() + 1 ) + '-' + pad( this.getUTCDate() );                      
            };
            
        }() );
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
    Date.days = function* (from_date, to_date) {
        // Generator for iterating over a date range
        const date = new Date(from_date.getTime());
        while( date.getTime() <= to_time.getTime() ) {
            yield date;
            date.incrDays(1);
        }
    }
    Date.isValid = function(date) {
        // Returns true if passed a valid date object. Returns false if the argument is not a valid date object
        return (date instanceof Date) && ( ! isNaN(date.getTime()) );
    }

    // ==============================
    // Static properties
    // ==============================
    var now = new Date();
    // A date representing midnight (00:00:00) today
    Date.today = new Date(now.getFullYear(),now.getMonth(),now.getDate());
})();
