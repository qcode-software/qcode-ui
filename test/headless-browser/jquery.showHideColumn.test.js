describe('columnShowHide plugin', () => {
    let page;
    beforeAll(async () => {
        page = await ready_page('jquery.showHideColumn.test.html');
    });

    it('changes a visible cell to a hidden cell', async () => {
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

    afterAll( () => page.close() );
});
