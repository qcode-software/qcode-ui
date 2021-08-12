page.on('pageerror', message => console.log('Error: ' + message));

global.load_qcode_ui = function(page) {
    // Concatenate all the .js files in qcode-ui to load in a source tag
    const fs = require('fs');
    var source = "";
    for (const filename of fs.readdirSync('./js/').sort()) {
        if ( filename.slice(-3) === '.js' ) {
            source += fs.readFileSync('./js/' + filename,'utf8') + "\n";
        }
    }
    return page.addScriptTag({
        content: source
    });
}
global.dom_ready = function(page) {
    return page.evaluate(
        () => new Promise(
            resolve => $(resolve)
        )
    );
}
