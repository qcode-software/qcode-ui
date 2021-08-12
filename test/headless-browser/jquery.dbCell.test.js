describe('dbCell', () => {
    let page;
    beforeAll(async () => {
        page = await ready_page('jquery.dbCell.test.html');
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
