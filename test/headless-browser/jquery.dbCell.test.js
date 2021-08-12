describe('dbCell', () => {
    let page;
    beforeAll(async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:4444/test/headless-browser/jquery.dbCell.test.html',{
            waitUntil: "domcontentloaded"
        });
        await load_qcode_ui(page);
        await dom_ready(page);
        await page.evaluate(
            () => $('td').first().dbCell()
        );
    });

    it('gets parent row', async () => expect(
        page.evaluate(
            () => $('td').first().dbCell('getRow').attr('id')
        )
    ).resolves.toBe('firstRow') );

    it('gets parent table', async () => expect(
        page.evaluate(
            () => $('td').first().dbCell('getGrid').attr('id')
        )
    ).resolves.toBe('testTable') );
    
    it('gets column', async () => expect(
        page.evaluate(
            () => $('td').first().dbCell('getCol').attr('myAttribute')
        )
    ).resolves.toBe('hello') );

    it('gets cell type', async () => expect(
        page.evaluate(
            () => $('td').first().dbCell('getType')
        )
    ).resolves.toBe('text') );

    it('gets editor-plugin name', async () => expect(
        page.evaluate(
            () => $('td').first().dbCell('getEditorPluginName')
        )
    ).resolves.toBe('dbEditorText') );

    it('gets cell value', async () => expect(
        page.evaluate(
            () => $('td').first().dbCell('getValue')
        )
    ).resolves.toBe('January') );

    it('opens a focussed editor with cell value', async () => expect(
        page.evaluate(() => {
            $('td').first().dbCell('cellIn');
            return $(':focus').val();
        })
    ).resolves.toBe('January') );

    afterAll( () => page.close() );
});
