describe('Qcode uploader', () => {
    let page;
    beforeAll(async () => {
        page = await ready_page('qcode.uploader.test.html');
        await page.setRequestInterception(true);
    });

    it('uploads a file', async () => {
        const callback = jest.fn(request => request.respond({
            status: 200
        }));
        page.on('request', callback);
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('input')
        ]);
        await fileChooser.accept(['test/headless-browser/samples/hello_world.txt']);
        await page.evaluate(
            () => {
                const file = document.getElementsByTagName('input')[0].files[0];
                const uploader = new qcode.Uploader({
                    file: file,
                    url: "/upload"
                });
                uploader.start();
            }
        );
        await page.waitForTimeout(1000);
        page.off('request', callback);
        return expect(callback.mock.calls.length).toBe(1);
    });

    afterAll( () => page.close() );
});
