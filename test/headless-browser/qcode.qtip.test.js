describe('qcode.qtip plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.qtip.test.html');
        await page.setViewport({
            width: 480,
            height: 640
        });
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

    it('positions qtip above input', async () => {
        const result = await page.evaluate(async () => {
            window.scroll(0, 120);
            const input = document.getElementById('input');
            const qtip = new qcode.Qtip(input, {
                content: "Test",
                position: {
                    my: 'bottom left',
                    at: 'top left'
                }
            });
            return (input.getBoundingClientRect().top
                    - qtip.element.getBoundingClientRect().bottom);
        });
        expect(parseInt(result)).toBe(8);
    });
});
