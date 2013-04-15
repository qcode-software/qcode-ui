(function() {
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    Date.prototype.incrDays = function(days) {
        this.setTime(this.getTime() + (days * millisecondsPerDay));
    }
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
    var now = new Date();
    Date.today = new Date(now.getFullYear(),now.getMonth(),now.getDate());
})();