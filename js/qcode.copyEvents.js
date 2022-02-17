/*
  Qcode Copy Events plugin
  Copy specified events from one element to another
*/
;var qcode = qcode || {};
qcode.copyEvents = function(sourceElement, copyRoot, eventNames) {
    "use strict";

    const copyEvent = event => {
        let copiedEvent;
        
        const target = qcode.equivalentDescendant(
            sourceElement,
            event.target,
            copyRoot
        );
        
        const properties = {}
        for (const key of [
            'bubbles',
            'cancelable',
            'composed']
            ) {
            properties[key] = event[key];
        }
        
        if ( event instanceof MouseEvent ) {
            for (const key of [
                'screenX',
                'screenY',
                'clientX',
                'clientY',
                'ctrlKey',
                'shiftKey',
                'altKey',
                'metaKey',
                'button',
                'buttons']
                ){
                properties[key] = event[key];
            }
            if ( event.relatedTarget instanceof HTMLElement ) {
                properties['relatedTarget'] = qcode.equivalentDescendant(
                    sourceElement,
                    event.relatedTarget,
                    targetElement
                );
            }
                
            copiedEvent = new MouseEvent(event.type, properties);
        } else {
            copiedEvent = new Event(event.type, properties);
        }

        target.dispatchEvent(copiedEvent);
        if ( event.defaultPrevented ) {
            copiedEvent.preventDefault();
        }
    };

    for (const eventName of eventNames) {
        sourceElement.addEventListener(eventName, copyEvent);
    }
};
