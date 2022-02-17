describe('qcode copyEvents', () => {
    let page;
    beforeEach(async () => {
        page = await ready_page('qcode.copyEvents.test.html');
    });
    afterEach( () => page.close() );

    it('copies events', async() => {
        const callback = jest.fn();
        await page.exposeFunction("callback", callback);
        const result = await page.evaluate(() => {
            const root = document.getElementById('main');
            const link = document.getElementById('test');
            const side = document.getElementById('side');

            qcode.addDelegatedEventListener(
                side, 'p', 'click', callback
            );

            qcode.copyEvents(root, side, ['click']);

            link.dispatchEvent(
                new MouseEvent('click', {
                    'bubbles': true,
                    'cancelable': true,
                    'composed': true,
                    'screenX': 100,
                    'screenY': 100
                })
            );
        });
        expect(callback.mock.calls.length).toBe(1);
    });

    it('maps target', async() => {
        const callback = jest.fn();
        await page.exposeFunction("callback", callback);
        const result = await page.evaluate(() => {
            const root = document.getElementById('main');
            const link = document.getElementById('test');
            const side = document.getElementById('side');

            qcode.addDelegatedEventListener(
                side, 'p', 'click', event => {
                    callback(event.target.innerText);
                }
            );

            qcode.copyEvents(root, side, ['click']);

            link.dispatchEvent(
                new MouseEvent('click', {
                    'bubbles': true,
                    'cancelable': true,
                    'composed': true,
                    'screenX': 100,
                    'screenY': 100
                })
            );
        });
        expect(callback.mock.calls[0][0]).toBe('Side');
    });
});
