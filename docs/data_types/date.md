#Date
Qcode extensions to the Date api.

[Fiddle](http://jsfiddle.net/PeterChaplin/vq21npu8/)

##Date.prototype.incrDays(days)
Move this date forward by a number of days (accepts negative and non-integer values)

##Date.prototype.getWeekStart( [base] )
Return a new date object representing the first day of this date's week. Optionaly takes a base - 0 for Sunday, 1 for Monday, etc. Defaults to Monday as a base.

##Date.prototype.getWeekEnd( [base] )
Return the last day of the week, as for getWeekStart (above).

##Date.prototype.getDayLetter()
Get the first letter of this date's day of week name

##Date.prototype.getMonthShort()
Get the short (three-letter) version of this date's month name

##Date.min( [date1][, ..dateN] )
Get the earliest of the dates passed in.

##Date.max( [date1][, ..dateN] )
Get the latest of the dates passed in.

##Date.daysBetween( date1, date2 )
Returns how many days later date1 is than date2

##Date.isValid( date )
return true if passed a Date object with a valid date
