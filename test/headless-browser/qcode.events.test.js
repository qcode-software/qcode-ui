describe('qcode.events plugins',() => {
    let page;
    beforeEach(async () => {
        page = await ready_page('qcode.events.test.html');
        await page.setRequestInterception(true);
    });
    afterEach( () => page.close() );

    describe('qcode.on',() => {
        it('binds an event listener', async () => {
            const callback = jest.fn();
            await page.exposeFunction("callback", callback);
            await page.evaluate(() => {
                const input = document.getElementById('input');
                qcode.on(input,'click',callback);
                input.dispatchEvent(new MouseEvent('click'));
            });
            expect(callback.mock.calls.length).toBe(1);
        });
    });

    describe('qcode.trigger',() => {
        it('triggers an event', async () => {
            const callback = jest.fn();
            await page.exposeFunction("callback", callback);
            await page.evaluate(() => {
                const input = document.getElementById('input');
                qcode.on(input,'click',callback);
                qcode.trigger(input,new MouseEvent('click'));
            });
            expect(callback.mock.calls.length).toBe(1);
        });
        it('limits event to namespace', async () => {
            const callback = jest.fn();
            await page.exposeFunction("callback", callback);
            await page.evaluate(() => {
                const input = document.getElementById('input');
                qcode.on(input,'click.test',callback);
                qcode.trigger(input,new MouseEvent('click'),['nonsense']);
            });
            expect(callback.mock.calls.length).toBe(0);
        });
    });

    describe('qcode.off',() => {
        it('removes event listeners', async () => {
            const callback = jest.fn();
            await page.exposeFunction("callback", callback);
            await page.evaluate(() => {
                const input = document.getElementById('input');
                qcode.on(input,'click',callback);
                qcode.off(input,'click');
                input.dispatchEvent(new MouseEvent('click'));
            });
            expect(callback.mock.calls.length).toBe(0);
        });
    });
});
