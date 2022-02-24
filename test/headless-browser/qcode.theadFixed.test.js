describe('qcode.theadFixed', () => {
    let page;
    
    beforeEach(async () => {
        page = await ready_page('qcode.theadFixed.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    it('runs without error on a table', async () => {
        await page.evaluate(() => {
            qcode.theadFixed(
                document.getElementById('table')
            );
        });
        expect(true).toBe(true);
    });
});
