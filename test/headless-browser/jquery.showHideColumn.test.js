test('columnShowHide plugin', async () => {
    page.on('pageerror', message => console.log('Error: ' + message));
    
    await page.goto('http://localhost:4444/test/headless-browser/jquery.showHideColumn.test.html',{
        waitUntil: "domcontentloaded"
    });

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

    await page.evaluate(
        () => new Promise(
            resolve => $(resolve)
        )
    );

    await expect(
        page.evaluate(
            () => $('th').first().text()
        )
    ).resolves.toBe('Month');
    
    await expect(
        page.evaluate(
            () => $('td').first().css('display')
        )
    ).resolves.toBe('table-cell');

    await page.evaluate(
        () => $('table').columnsShowHide('td:first-child()', 'hide')
    );
    
    await expect(
        page.evaluate(
            () => $('td').first().css('display')
        )
    ).resolves.toBe('none');
});
