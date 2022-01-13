describe('Qcode dialog', () => {
    let page;
    beforeAll(async () => {
        page = await ready_page('qcode.dialog.test.html');
    });

    it('opens a dialog', async () => expect(
        page.evaluate(() => {
            let div = document.createElement('div');
            div.innerHTML = "This is a test";
            qcode.Dialog(div, {
                title: "Test dialog",
                buttons: {
                    OK: null
                }
            });
            let dialog = document.getElementsByClassName('dialog')[0];
            return dialog instanceof HTMLElement
        })
    ).resolves.toBe(true));

    afterAll( () => page.close() );
});
