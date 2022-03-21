;var qcode = qcode || {};

(function() {
    "use strict";
    qcode.on = function(target, eventSelector, callback) {
        const [eventName, namespaces] = parseEventSelector(eventSelector);
        const wrapper = event => {
            for (const namespace of qcode.triggeredEventNamespaces) {
                if ( namespaces.indexOf(namespace) == -1 ) {
                    return;
                }
            }
            callback(event);
        };
        qcode.events.push({
            event: wrapper,
            eventName: eventName,
            namespaces: namespaces,
            target: target
        });
        target.addEventListener(eventName, wrapper);
    };

    qcode.off = function(target, eventSelector) {
        const [eventName, namespaces] = parseEventSelector(eventSelector);
        for (const event of qcode.events) {
            if ( target != event.target ) {
                continue;
            }
            if ( eventName != "" && eventName != event.eventName ){
                continue;
            }
            let namespacesMatch = true
            for (const namespace of namespaces) {
                if ( event.namespaces.indexOf(namespace) == -1 ) {
                    namespacesMatch = false
                    break;
                }
            }
            if ( ! namespacesMatch ) {
                continue
            }
            target.removeEventListener(event.eventName, event.event);
        }
    };

    qcode.trigger = function(target, event, namespaces = []) {
        qcode.triggeredEventNamespaces = namespaces;
        target.dispatchEvent(event);
        qcode.triggeredEventNamespaces = []
    };

    qcode.triggeredEventNamespaces = [];
    qcode.events = [];
    function parseEventSelector(eventSelector) {
        const parts = eventSelector.split('.');
        const eventName = parts[0];
        const namespaces = parts.slice(1);
        return [eventName, namespaces];
    };
})();
