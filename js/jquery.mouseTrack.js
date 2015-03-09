/*
  mouseTrack plugin
  Track mouse movement over an area of the page,
  provide methods to report position, speed, acceleration, and bearing.

  nb. Recommend always calling on $(body), and calling "update" within any
  mouse event handler where this plugin is to be used.

  For acceleration, speed, position, and bearing, time2 defaults to now,
  time1 defaults to interval ms ago, interval defaults to 100, times will
  be matched as closely as possible, up to a maximum 500ms difference.
  These methods may return null if there is insufficient tracking data recorded.

  Usages:

  # $(element).mouseTrack();
  # $(element).mouseTrack('track');
  Begin recording mousemove events for the target element

  # $(element).mouseTrack('update', event)
  Call from within a mousemove event handler to ensure that the current
  event has been recorded by mouseTrack.

  # $(element).mouseTrack('acceleration')
  # $(element).mouseTrack('acceleration', interval)
  # $(element).mouseTrack('acceleration', time1, time2)
  Return mouse acceleration (change in speed) in px/(ms^2) between time1 and time2

  # $(element).mouseTrack('bearing')
  # $(element).mouseTrack('bearing', interval)
  # $(element).mouseTrack('bearing', time1, time2)
  Return mouse bearing in radians clockwise from north, between time1 and time2

  # $(element).mouseTrack('speed')
  # $(element).mouseTrack('speed', interval)
  # $(element).mouseTrack('speed', time1, time2)
  Return mouse speed in px/ms, between time1 and time2

  # $(element).mouseTrack('position')
  # $(element).mouseTrack('position', interval)
  Return the last known mouse position, if recorded with the last "interval" ms
*/
;(function(undefined) {
    "use strict";
    var trail = [];
    var maxTrailLength = 1000;
    var maxTimeDifference = 500;

    $.fn.mouseTrack = function(method) {
        var $target = this;
        var args = Array.prototype.slice.call(arguments, 1);
        switch (method) {
        case undefined:
        case 'track':
            $target.on('mousemove', trackMouse);
            break;
        case 'update':
            trackMouse.apply(this, args);
            break;
        case 'acceleration':
            return mouseAcceleration.apply(this, args);
        case 'bearing':
            return mouseBearing.apply(this, args);
        case 'speed':
            return mouseSpeed.apply(this, args);
        case 'position':
            return mousePosition.apply(this, args);
        default:
            throw new Error('Unknown mouseTrack method ' + method);
        }
        return $target;
    }

    // Use best available time measuring
    if ( window.performance ) {
        var now = function() {
            return window.performance.now();
        }
    } else if ( Date.now ) {
        var now = function() {
            return Date.now();
        }
    } else {
        var now = function() {
            return new Date().getTime();
        }
    }

    // Trail - array of captured mouse movement
    // (nb - how often mouse events fire depends on the user's mouse)
    // Brief research suggest it's usually less than 100 times per second
    var lastAdded;
    function trackMouse(event) {
        if ( lastAdded !== event.originalEvent ) {
            lastAdded = event.originalEvent;
            trail.push({
                time: now(),
                pageX: event.pageX,
                pageY: event.pageY
            });
            if ( trail.length > maxTrailLength ) {
                trail.shift();
            }
        }
    }

    // Return mouse acceleration (change in speed) px/(ms^2)
    function mouseAcceleration(t1, t2) {
        if ( trail.length < 3 ) {
            return null;
        }
        var settings = timePeriod(100, t1, t2);
        var timeFrom = settings.from;
        var timeTo = settings.to;
        var timeMiddle = (timeFrom + timeTo) / 2;

        // Find 3 different points that fit the specified times as closely as possible
        var i1 = indexOfClosest(trail, timeFrom);
        var i2 = indexOfClosest(trail, timeMiddle);
        var i3 = indexOfClosest(trail, timeTo);
        if ( i1 === null || i2 === null || i3 === null ) {
            return null;
        }
        if ( i1 === i2 ) {
            i1--;
            if ( i1 < 0 || Math.abs(trail[i1].time - timeFrom) > maxTimeDifference ) {
                return null;
            }
        }
        if ( i3 === i2 ) {
            i3++;
            if ( i3 >= trail.length || Math.abs(trail[i3].time - timeTo) > maxTimeDifference ) {
                return null;
            }
        }

        // Calculate deltas (x, y, time, displacement)
        var dX1 = trail[i2].pageX - trail[i1].pageX;
        var dX2 = trail[i3].pageX - trail[i1].pageX;
        var dY1 = trail[i2].pageY - trail[i1].pageY;
        var dY2 = trail[i3].pageY - trail[i1].pageY;
        var dT1 = trail[i2].time - trail[i1].time;
        var dT2 = trail[i3].time - trail[i1].time;
        var s1 = Math.sqrt( Math.pow(dX1, 2) + Math.pow(dY1, 2) );
        var s2 = Math.sqrt( Math.pow(dX2, 2) + Math.pow(dY2, 2) );

        return ((s2 * dT1) - (s1 * dT2)) / (dT1 * dT2 * (dT2 - dT1));
    }

    // Return mouse bearing (radians clockwise from north, 0 to 2PI)
    function mouseBearing(t1, t2) {
        if ( trail.length < 2 ) {
            return null;
        }
        var settings = timePeriod(100, t1, t2);
        var timeFrom = settings.from;
        var timeTo = settings.to;
        
        var range = closestRange(trail, timeFrom, timeTo);
        if ( range === null ) {
            return null;
        }
        var dX = trail[range.to].pageX - trail[range.from].pageX;
        var dY = trail[range.to].pageY - trail[range.from].pageY;

        return Math.PI + Math.atan2(-dX,dY);
    }

    // Return mouse speed px/ms
    function mouseSpeed(t1, t2) {
        if ( trail.length < 2 ) {
            return null;
        }
        var settings = timePeriod(100, t1, t2);
        var timeFrom = settings.from;
        var timeTo = settings.to;

        var range = closestRange(trail, timeFrom, timeTo);
        if ( range === null ) {
            return null;
        }
        var dX = trail[range.to].pageX - trail[range.from].pageX;
        var dY = trail[range.to].pageY - trail[range.from].pageY;
        var dT = trail[range.to].time - trail[range.from].time;
        if ( dT == 0 ) {
            throw new Error("Invalid mouse trail");
        }
        var distance = Math.sqrt( Math.pow(dX, 2) + Math.pow(dY, 2) );
        return distance / dT;
    }

    // Return mouse position (top/left)
    function mousePosition(interval) {
        if ( trail.length == 0 ) {
            return null;
        }
        if ( interval === undefined ) {
            interval = 100;
        }
        var index = indexOfClosest(trail, now() - interval);
        if ( index === null ) {
            return null;
        }
        return {
            top: trail[index].pageX,
            left: trail[index].pageY
        }
    }

    // User-defined range, as two times, or interval to now, or default interval to now
    function timePeriod(defaultInterval, t1, t2) {
        if ( typeof t2 == 'undefined' ) {
            if ( typeof t1 == 'undefined' ) {
                t1 = now() - defaultInterval;
            } else {
                t1 = now() - t1;
            }
            t2 = now();
        }
        return {
            from: t1,
            to: t2
        }
    }

    // Return an object containing 2 array indicies (from and to), representing 2 different
    // array elements which most closely match the search times.
    // Returns null if a matching range cannot be found within maxTimeDifference of the
    // specified times.
    function closestRange(trail, timeFrom, timeTo) {
        if ( trail.length < 2 ) {
            throw new Error("Cannot select a range from an array of less than 2 items");
        }
        var indexFrom = indexOfClosest(trail, timeFrom);
        var indexTo = indexOfClosest(trail, timeTo);
        if ( indexFrom === null || indexTo === null ) {
            return null;
        }
        if ( indexFrom != indexTo ) {
            return {
                from: indexFrom,
                to: indexTo
            }
        }
        if ( indexFrom == 0 ) {
            if ( Math.abs(trail[1].time - timeTo) > maxTimeDifference ) {
                return null;
            }
            return {
                from: 0,
                to: 1
            }
        }
        var end = trail.length - 1;
        if ( indexTo == end ) {
            if ( Math.abs(trail[end - 1].time - timeFrom) > maxTimeDifference ) {
                return null;
            }
            return {
                from: end - 1,
                to: end
            }
        }
        if ( (trail[indexFrom].time - trail[indexFrom - 1].time)
             <
             (trail[indexTo + 1].time - trail[indexTo]) ) {
            if ( Math.abs(trail[indexFrom - 1].time - timeFrom) > maxTimeDifference ) {
                return null;
            }
            return {
                from: indexFrom - 1,
                to: indexTo
            }
        } else {
            if ( Math.abs(trail[indexTo + 1].time - timeTo) > maxTimeDifference ) {
                return null;
            }
            return {
                from: indexFrom,
                to: indexTo + 1
            }
        }
    }

    // Return array index of the element in trail closest to searchTime,
    // within maxTimeDifference of searchTime.
    // Returns null if such an element cannot be found.
    function indexOfClosest(trail, searchTime) {
        if ( trail.length == 0 ) {
            throw new Error("Cannot search an empty array");
        }
        var index;
        if ( trail.length == 1 ) {
            index = 0;

        } else if ( trail.length == 2 ) {
            if ( (searchTime - trail[0].time) < (trail[1].time - searchTime) ) {
                index = 0;
            } else {
                index = 1;
            }

        } else {
            var end = trail.length - 1;
            var oldest = trail[0].time;
            var newest = trail[end].time;

            if ( searchTime < oldest ) {
                index = 0;

            } else if ( searchTime > newest ) {
                index = end;

            } else {
                // Interpolated search (similar to binary search)
                var searchIndex = Math.round(end * (searchTime - oldest) / (newest - oldest));
                if ( searchIndex == 0 ) {
                    searchIndex = 1;
                }
                if ( searchIndex == end ) {
                    searchIndex = end - 1;
                }

                if ( trail[searchIndex].time == searchTime ) {
                    return searchIndex;

                } else if ( trail[searchIndex].time > searchTime ) {
                    var i = 0;
                    var j = searchIndex;
                    
                } else {
                    var i = searchIndex;
                    var j = end;

                }
                var subTrail = trail.slice(i, j);
                index = i + indexOfClosest(subTrail, searchTime);
            }
        }
        if ( Math.abs(trail[index].time - searchTime) > maxTimeDifference ) {
            return null;
        } else {
            return index;
        }
    }
})();