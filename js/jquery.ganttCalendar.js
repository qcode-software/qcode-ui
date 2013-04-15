;(function($, undefined) {
    var dayLetter = ["S", "M", "T", "W", "T", "F", "S"];
    var monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    jQuery.fn.ganttCalendar = function(options) {
        var canvas = this[0];
        var width = this.attr('width');
        var height = this.attr('height');
        var startDate = options.startDate;
        var finishDate = options.finishDate;
        var pxPerDay = options.pxPerDay;
        var headerHeight = options.headerHeight;

        if ( ! canvas.getContext ) {
            $.error("Plugin ganttCalendar currently requires a canvas");
        }
        var ctx = canvas.getContext('2d');

        var date = new Date(startDate.getTime());
        var today = Date.today;
        var x = 0.5;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(200,200,200,1)';
        ctx.textBaseline = "middle";
        while( date.getTime() < finishDate.getTime() ) {
            ctx.fillStyle = 'rgba(100,100,100,1)';
            if ( date.getDay() == 1 ) {
                ctx.textAlign = "left";
                ctx.fillText(date.getDate() + " " + monthShort[date.getMonth()], x, (headerHeight / 4));
                ctx.moveTo(x,0);
                ctx.lineTo(x, headerHeight);
            }
            ctx.textAlign = "center";
            ctx.fillText(dayLetter[date.getDay()], x + (pxPerDay / 2), (3 * headerHeight / 4));

            if ( Date.daysBetween(date, today) == 0  ) {
                ctx.fillStyle = 'rgba(160,200,240,1)';
                ctx.fillRect(x, headerHeight, pxPerDay, (height - headerHeight));
            } else if ( date.getDay() == 0 || date.getDay() == 6 ) {
                ctx.fillStyle = 'rgba(220,220,220,1)';
                ctx.fillRect(x, headerHeight, pxPerDay, (height - headerHeight));
            } else {
                ctx.moveTo(x + pxPerDay, headerHeight);
                ctx.lineTo(x + pxPerDay, height);
            }
            x += pxPerDay;
            date.incrDays(1);
        }
        ctx.stroke();
        return this;
    }
})(jQuery);