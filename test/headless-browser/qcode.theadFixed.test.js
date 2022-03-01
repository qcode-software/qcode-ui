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

    describe('returned widget object', () => {
        it('references original table', async() => {
            const result = await page.evaluate(() => {
                let widget = qcode.theadFixed(
                    document.getElementById('table')
                );
                return widget.table == document.getElementById('table');
            });
            expect(result).toBe(true);
        });
        
        it('references wrapper', async() => {
            const result = await page.evaluate(() => {
                let widget = qcode.theadFixed(
                    document.getElementById('table')
                );
                return widget.wrapper.getAttribute('class');
            });
            expect(result).toBe('thead-fixed-wrapper');
        });
    });
});
