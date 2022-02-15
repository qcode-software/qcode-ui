describe('qcode.columnResize plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.columnResize.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );

    it('resizes a column', async () => {
        const result = await page.evaluate(async () => {
            qcode.columnResize(document.getElementById('table'));
            const th = document.querySelector('th');
            th.dispatchEvent(
                new MouseEvent('mousedown', {
                    'clientX': 200,
                    'clientY': 20,
                    'bubbles': true,
                    'cancelable': true,
                    'composed': true
                })
            );
            th.dispatchEvent(
                new MouseEvent('mousemove', {
                    'clientX': 300,
                    'clientY': 20,
                    'bubbles': true,
                    'cancelable': true,
                    'composed': true
                })
            );
            th.dispatchEvent(
                new MouseEvent('mouseup', {
                    'clientX': 300,
                    'clientY': 20,
                    'bubbles': true,
                    'cancelable': true,
                    'composed': true
                })
            );
            return parseInt(th.getBoundingClientRect().width);
        });
        expect(result).toBe(295);
    });
});
