test('columnShowHide plugin', async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:4444/test/headless-browser/jquery.showHideColumn.test.html',{
        waitUntil: "domcontentloaded"
    });
    await load_qcode_ui(page);
    await dom_ready(page);

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

    return page.close();
});
