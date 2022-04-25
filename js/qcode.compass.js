/*
  Qcode compass plugins - navigate between page elements based on position
*/
;var qcode = qcode || {};
(function() {
    "use strict";

    // Constants to define relationships between
    // axes, directions, and boundaries
    const opposites = {
        "row": "column",
        "column": "row",
        "before": "after",
        "after": "before"
    };
    const boundaries = {
        "row": {
            "min": "top",
            "max": "bottom"
        },
        "column": {
            "min": "left",
            "max": "right"
        }
    }

    // Shorthand methods for readability:
    // ====
    qcode.northOf = function(target, elements) {
        // Returns the element above the target if one exists,
        // otherwise the bottom element from the previous column,
        // or undefined if no match
        return qcode.compass({
            target: target,
            elements: elements,
            direction: 'before',
            axis: 'column'
        });
    };

    qcode.southOf = function(target, elements) {
        // Returns the element below the target if one exists,
        // otherwise the top element from the next column,
        // or undefined if no match
        return qcode.compass({
            target: target,
            elements: elements,
            direction: 'after',
            axis: 'column'
        });
    };

    qcode.eastOf = function(target, elements) {
        // Returns the element right of the target if one exists,
        // otherwise the leftmost element from the next row,
        // or undefined if no match
        return qcode.compass({
            target: target,
            elements: elements,
            direction: 'after',
            axis: 'row'
        });    
    };

    qcode.westOf = function(target, elements) {
        // Returns the element left of the target if one exists,
        // otherwise the rightmost element from the previous row,
        // or undefined if no match
        return qcode.compass({
            target: target,
            elements: elements,
            direction: 'before',
            axis: 'row'
        });
    };


    /* ====
      Returns whichever element from "elements",
      is the closest in the given "direction",
      to the "target" element,
      within the given "axis"
      e.g.
      config = {
        target: HTMLElement (basis for comparison),
        elements: Array of HTMLElements (elements to choose from),
        direction: 'before' or 'after',
        axis: 'row' or 'column'
      }
    */
    qcode.compass = function(config) {
        const target = config.target;
        const elements = removeSelfAndHidden(config.elements, target);
        const direction = config.direction;
        const closer = opposites[direction]
        const majorAxis = config.axis;
        const minorAxis = opposites[config.axis];
        
        let bestMatch;
        // Find an element that overlaps in major axis,
        // is in the correct direction on the minor axis,
        // and is as close as possible on the minor axis
        // (if such an element exists)
        qcode.each(elements, element => {
            if ( compare(element,
                         'overlaps',
                         target,
                         majorAxis)
                 && compare(element,
                            `partly ${direction}`,
                            target,
                            minorAxis)
                 && (bestMatch == undefined
                     || compare(element,
                                `partly ${closer}`,
                                bestMatch,
                                minorAxis))
               ) {
                bestMatch = element;
            }
        });
        if ( bestMatch !== undefined ) {
            return bestMatch;
        }
        
        // Find element in correct direction in major axis,
        // as close as possible on the major axis,
        // as close as possible to the "near" end of the minor axis
        // (if such an element exists)
        qcode.each(elements, element => {
            if ( compare(element,
                         `fully ${direction}`,
                         target,
                         majorAxis)
                 && ( bestMatch === undefined
                      || compare(element,
                                 `fully ${closer}`,
                                 bestMatch,
                                 majorAxis)
                      || (compare(element,
                                  'overlaps',
                                  bestMatch,
                                  majorAxis)
                          && compare(element,
                                     `partly ${closer}`,
                                     bestMatch,
                                     minorAxis)))
               ) {
                bestMatch = element;
            }
        });
        
        return bestMatch;
    }

    // Compare position of element to comparator,
    // using the comparison type within the given axis
    // e.g. compare(element, 'fully before', comparator, 'row')
    // => returns a boolean true/false
    function compare(element, type, comparator, axis) {
        const rect = element.getBoundingClientRect();
        const base = comparator.getBoundingClientRect();

        const minKey = boundaries[axis].min;
        const maxKey = boundaries[axis].max;
        
        switch (type) {
        case 'fully before':
            return rect[maxKey] <= base[minKey];
        case 'fully after':
            return rect[minKey] >= base[maxKey];
        case 'partly before':
            return rect[minKey] < base[minKey];
        case 'partly after':
            return rect[maxKey] > base[maxKey];
        case 'overlaps':
            return (rect[minKey] < base[maxKey]
                    && rect[maxKey] > base[minKey]);
        }
    }
    
    function removeSelfAndHidden(elements, target) {
        // Remove target and hidden elements from elements array
        const result = [];
        qcode.each(elements, element => {
            if ( element != target && element.offsetParent != null ) {
                result.push(element);
            }
        });
        return result;
    };
})();
