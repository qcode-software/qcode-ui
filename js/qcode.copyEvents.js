/*
  Qcode Copy Events plugin
  Copy specified events from one element to another
*/
;var qcode = qcode || {};
qcode.copyEvents = function(sourceElement, targetElement, eventNames) {
    "use strict";

    const copyEvent = event => {
    };

    for (const eventName of eventNames) {
        sourceElement.addEventListener(eventName, copyEvent);
    }
};
