// Extensions for the javascript Date function
;(function() {
    // Constants
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var dayLetter = ["S", "M", "T", "W", "T", "F", "S"];
    var monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Methods
    Date.prototype.incrDays = function(days) {
        this.setTime(this.getTime() + (days * millisecondsPerDay));
    }
    Date.prototype.getWeekStart = function(base) {
        base = coalesce(base, 1);
        var days_to_subtract = this.getDay() - base;
        if (days_to_subtract < 0) {
            days_to_subtract += 7;
        }
        return new Date(this.getTime() - (days_to_subtract * millisecondsPerDay));
    }
    Date.prototype.getWeekEnd = function(base) {
        base = coalesce(base, 1);
        var days_to_add = base + 6 - this.getDay();
        if (days_to_add > 6) {
            days_to_add -= 7;
        }
        return new Date(this.getTime() + (days_to_add * millisecondsPerDay));
    }
    Date.prototype.getDayLetter = function() {
        return dayLetter[this.getDay()];
    }
    Date.prototype.getMonthShort = function() {
        return monthShort[this.getMonth()];
    }

    // Static functions
    Date.min = function() {
        var min = Infinity;
        for(var i = arguments.length; i > 0; i--) {
            min = Math.min(min, arguments[i - 1].getTime());
        }
        return new Date(min);
    }
    Date.max = function() {
        var max = -Infinity;
        for(var i = arguments.length; i > 0; i--) {
            max = Math.max(max, arguments[i - 1].getTime());
        }
        return new Date(max);
    }
    Date.daysBetween = function(date1, date2) {
        var milliseconds = date1.getTime() - date2.getTime();
        return Math.round(milliseconds / millisecondsPerDay);
    }

    // Static properties
    var now = new Date();
    Date.today = new Date(now.getFullYear(),now.getMonth(),now.getDate());
})();