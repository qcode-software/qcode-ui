describe('dbRow', () => {
    let page;
    beforeAll(async () => {
        page = await ready_page('jquery.dbRow.test.html');
        await page.evaluate(
            () => $('tbody tr').first().dbRow()
        );
    });

    it('gets parent table', async () => expect(
        page.evaluate(
            () => $('tbody tr').first().dbRow('getGrid').attr('id')
        )
    ).resolves.toBe('testTable') );

    it('gets table colGroup', async () => expect(
        page.evaluate(
            () => $('tbody tr').first().dbRow('getColgroup').attr('id')
        )
    ).resolves.toBe('testColgroup') );

    it('gets current cell', async () => expect(
        page.evaluate(() => {
            $('table').dbGrid('setCurrentCell', $('td').first());
            return $('tbody tr').first().dbRow('getCurrentCell').text()
        })
    ).resolves.toBe('January') );

    it('has a state', async () => expect(
        page.evaluate(
            () => $('tbody tr').first().dbRow('getState')
        )
    ).resolves.toBe('current') );

    it('returns row data', async () => expect(
        page.evaluate(
            () => $('tbody tr').first().dbRow('getRowData')
        )
    ).resolves.toEqual({
        month: "January",
        days: "31",
        season: "Winter"
    }) );

    afterAll( () => page.close() );
});
