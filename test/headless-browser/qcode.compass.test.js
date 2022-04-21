describe('qcode.compass plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.compass.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );

    it('finds the cell above the middle cell', async () => {
        const result = await page.evaluate(async () => {
            const cells = document.getElementsByTagName('td');
            const middle = document.getElementById('e');
            return qcode.northOf(middle, cells).getAttribute('id');
        });
        expect(result).toBe('b');
    });
});
