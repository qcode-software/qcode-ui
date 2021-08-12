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
global.ready_page = async function(html_file) {
    let page = await browser.newPage();
    page = await browser.newPage();
    page.on('pageerror', message => console.log('Error: ' + message));
    await page.goto('http://localhost:4444/test/headless-browser/' + html_file,{
        waitUntil: "domcontentloaded"
    });
    await load_qcode_ui(page);
    await dom_ready(page);
    return page;
}
