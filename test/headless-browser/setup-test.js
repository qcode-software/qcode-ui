global.load_qcode_ui = async function(page) {
    // Concatenate all the .js files in qcode-ui to load in a source tag
    const fs = require('fs');
    var source = "";
    for (const filename of fs.readdirSync('./js/').sort()) {
        if ( filename.slice(-3) === '.js' ) {
            source += fs.readFileSync('./js/' + filename,'utf8') + "\n";
        }
    }
    await page.addScriptTag({
        content: source
    });
    // Concatenate all the .css files in qcode-ui to load in a style tag
    var css = "";
    for (const filename of fs.readdirSync('./css/').sort()) {
        if ( filename.slice(-4) === '.css' ) {
            css += fs.readFileSync('./css/' + filename,'utf8') + "\n";
        }
    }
    return page.addStyleTag({
        content: css
    });
}
global.dom_ready = function(page) {
    return page.evaluate(
        () => new Promise(
            resolve => {
                if ( document.readyState === "complete" ) {
                    setTimeout(resolve, 1);
                } else {
                    window.addEventListener('DOMContentLoaded',resolve);
                }
            }
        )
    );
}
global.ready_page = async function(html_file) {
    let page = await browser.newPage();
    page.on('pageerror', message => console.log('Error: ' + message));
    await page.goto('http://localhost:4444/test/headless-browser/' + html_file,{
        waitUntil: "domcontentloaded"
    });
    await load_qcode_ui(page);
    await dom_ready(page);
    return page;
}
