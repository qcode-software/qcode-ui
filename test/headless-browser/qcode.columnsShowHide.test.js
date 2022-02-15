describe('qcode.columnsShowHide plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.columnsShowHide.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );
    
    it('hides a column', async () => {
        const result = await page.evaluate(async () => {
            qcode.columnsShowHide(
                document.getElementById('table'),
                '.second');
            const cell = document.getElementsByTagName('td')[1];
            return qcode.getStyle(cell,'display');
        });
        expect(result).toBe("none");
    });
    
    it('shows a hidden column', async () => {
        const result = await page.evaluate(async () => {
            qcode.columnsShowHide(
                document.getElementById('table'),
                '.second');
            qcode.columnsShowHide(
                document.getElementById('table'),
                '.second');
            const cell = document.getElementsByTagName('td')[1];
            return qcode.getStyle(cell,'display');
        });
        expect(result).toBe("table-cell");
    });
});
