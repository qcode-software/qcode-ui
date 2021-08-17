describe('fileUploadButton', () => {
    let page;
    beforeAll(async () => {
        page = await ready_page('jquery.fileUploadButton.test.html');
    });

    it('opens a file dialog', async () => {
        await page.evaluate(
            () => $('button').fileUploadButton()
        );
        const result = await new Promise((resolve, reject) => {
            page.waitForFileChooser().then(fileChooser => {
                fileChooser.cancel();
                resolve('OK');
            });
            page.waitForTimeout(1000).then(reject);
            page.click('button');
        });
        expect(result).toBe('OK');
    });

    afterAll( () => page.close() );
});
