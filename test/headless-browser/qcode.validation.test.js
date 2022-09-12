describe('qcode.validation plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.validation.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );

    it('can be initialised without error', async () => {
        const result = await page.evaluate(async () => {
            const validation = new qcode.Validation(
                document.getElementById('testForm'), {
                }
            );
            return "OK";
        });
        expect(result).toBe("OK");
    });
});
