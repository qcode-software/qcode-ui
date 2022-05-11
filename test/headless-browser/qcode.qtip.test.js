describe('qcode.qtip plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.qtip.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );

    it('runs without error', async () => {
        const result = await page.evaluate(async () => {
            const input = document.getElementById('input');
            const qtip = new qcode.Qtip(input, {
                content: "Test",
                position: {
                    my: 'left top',
                    at: 'bottom right'
                }
            });
            return qtip.is_showing();
        });
        expect(result).toBe(true);
    });
});
