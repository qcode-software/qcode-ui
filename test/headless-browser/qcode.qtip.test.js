describe('qcode.qtip plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.qtip.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );
});
