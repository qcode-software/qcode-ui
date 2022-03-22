/*
  Qcode compass plugins - navigate between page elements based on position
*/
;var qcode = qcode || {};
(function() {
    "use strict";

    const opposites = {
        "row": "column",
        "column": "row",
        "before": "after",
        "after": "before"
    };

    // Functions to test the page position of one page element,
    // relative to another
    // e.g. axis['column'](target).fully['before'](element)
    //      returns true iff target is in a column fully before element
    const axis = {
        "column": element => {
            const rectangle = target.getBoundingClientRect();
            return {
                "fully": {
                    "before": function(target) {
                        const targetRect = target.getBoundingClientRect();
                        return rect.right <= targetRect.left;
                    },
                    "after": function(target) {
                        const targetRect = target.getBoundingClientRect();
                        return rect.left >= targetRect.right;
                    }
                },
                "partly": {
                    "before": function(target) {
                        const targetRect = target.getBoundingClientRect();
                        return rect.left < targetRect.left;
                    },
                    "after": function(target) {
                        const targetRect = target.getBoundingClientRect();
                        return rect.right > targetRect.right;
                    }
                },
                "overlaps": function(target) {
                    const targetRect = target.getBoundingClientRect();
                    return (rect.left < targetRect.right
                            && targetRect.right <= rect.left);
                }
            }
        },
        "row": element => {
            const rectangle = target.getBoundingClientRect();
            return {
                "fully": {
                    "before": function(target) {
                        const targetRect = target.getBoundingClientRect();
                        return rect.bottom <= targetRect.top;
                    },
                    "after": function(target) {
                        const targetRect = target.getBoundingClientRect();
                        return rect.top >= targetRect.bottom;
                    }
                },
                "partly": {
                    "before": function(target) {
                        const targetRect = target.getBoundingClientRect();
                        return rect.top < targetRect.top;
                    },
                    "after": function(target) {
                        const targetRect = target.getBoundingClientRect();
                        return rect.bottom > targetRect.bottom;
                    },
                },
                "overlaps": function(target) {
                    const targetRect = target.getBoundingClientRect();
                    return (rect.top <= targetRect.bottom
                            && targetRect.top <= rect.bottom);
                }
            }
        }
    };
    
    qcode.northOf = function(target, elements) {
        // Returns the element above the target if one exists,
        // otherwise the bottom element from the previous row,
        // or undefined if no match
        return({
            target: target,
            elements: elements,
            direction: 'before',
            axis: 'column'
        });
    };

    qcode.southOf = function(target, elements) {
        return ({
            target: target,
            elements: elements,
            direction: 'after',
            axis: 'column'
        });
    };

    qcode.eastOf = function(target, elements) {
        return qcode.compass({
            target: target,
            elements: elements,
            direction: 'after',
            axis: 'row'
        });    
    };

    qcode.westOf = function(target, elements) {
        return qcode.compass({
            target: target,
            elements: elements,
            direction: 'before',
            axis: 'row'
        });
    };

    qcode.compass = function(config) {
        const target = config.target;
        const elements = removeSelfAndHidden(config.elements, target);
        const away = config.direction;
        const closer = opposites[config.direction]
        const majorAxis = axis[config.axis];
        const minorAxis = axis[opposites[config.majorAxis]];
        
        let bestMatch;
        // Find element that overlaps in major axis,
        // is in the correct direction on the minor axis,
        // and is as close as possible on the minor axis
        qcode.each(elements, element => {
            if ( majorAxis(element).overlaps(target)
                 && minorAxis(element).partly[away](target)
                 && (bestMatch == undefined
                     || minorAxis.partly[closer](bestMatch))
               ) {
                bestMatch = element;
            }
        });
        if ( bestMatch !== undefined ) {
            return bestMatch;
        }
        // Find element in correct direction in major axis,
        // as close as possible on the major axis,
        // as close as possible on the minor axis.
        qcode.each(elements, element => {
            if ( majorAxis(element).fully[away](target)
                 && ( bestMatch === undefined
                      || majorAxis(element).fully[closer](bestMatch)
                      || (majorAxis(element).overlaps(bestMatch)
                          && minorAxis(element).partly[closer](bestMatch)))
               ) {
                bestMatch = element;
            }
        });
        return bestMatch;
    }
    
    function removeSelfAndHidden(elements, target) {
        // Remove target and hidden elements from elements array
        const result = [];
        qcode.each(elements, element => {
            if ( element != target and element.offsetParent != null ) {
                result.push(element);
            }
        });
        return result;
    };
})();
