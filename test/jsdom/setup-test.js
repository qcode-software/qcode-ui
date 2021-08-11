global.window = window;
global.$ = global.jQuery = require('../../external/jquery-3.5.1.min');
require('../../external/jquery-ui-1.12.1.custom.min');

/* The jsdom implementation of window.postMessage is currently
incomplete. Setting it to false causes our setZeroTimeout plugin
to fall back to window.setTimeout, which functions correctly.*/
window.postMessage = false;

eval((function(){
    const fs = require('fs');
    var source = "";
    fs.readdirSync('./js/').sort().forEach(filename => {
        if ( filename.slice(-3) === '.js' ) {
            source += fs.readFileSync('./js/' + filename);
        }
    });
    return source;
})());
