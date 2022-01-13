describe('Qcode dialog', () => {
    let page;
    beforeAll(async () => {
        page = await ready_page('qcode.dialog.test.html');
    });

    it('opens a dialog', async () => {
        let div = document.createElement('div');
        div.innerHTML = "This is a test";
        qcode.Dialog(div, {
            title: "Test dialog",
            buttons: {
                OK: null
            }
        });
        let dialog = document.getElementsByClassName('dialog')[0];
        return expect(dialog instanceof HTMLElement).toBe(true);
    });
});
