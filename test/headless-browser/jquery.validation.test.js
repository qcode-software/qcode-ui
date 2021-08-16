describe('Validation plugin',() => {
    let page;
    beforeAll(async () => {
        page = await ready_page('jquery.validation.test.html');
        await page.setRequestInterception(true);
        await page.evaluate(
            () => $('form').validation()
        );
    });

    it('submits a validation request', async () => {
        const callback = jest.fn(request => request.respond({
            status: 200
        }));
        page.on('request', callback);
        await page.evaluate(() => {
            $('button').click();
        });
        await page.waitForTimeout(1000);
        page.off('request', callback);
        return expect(callback.mock.calls.length).toBe(1);
    });
});
