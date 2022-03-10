describe('qcode.theadFixed', () => {
    let page;
    
    beforeEach(async () => {
        page = await ready_page('qcode.textRange.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    it('sets/get textRange on an input', async () => {
        const result = await page.evaluate(() => {
            const input = document.getElementById('textInput');
            qcode.textRange.set(input, 2, 4);
            return qcode.textRange.get(input);
        });
        expect(result).toEqual({
            "selectionText": "ll",
            "selectionAtStart": false,
            "selectionAtEnd": false,
            "selectionStart": 2,
            "selectionEnd": 4,
            "text": "Hello World"
        });
    });

    it('sets/get textRange on a textarea', async () => {
        const result = await page.evaluate(() => {
            const input = document.getElementById('textArea');
            qcode.textRange.set(input, 2, 4);
            return qcode.textRange.get(input);
        });
        expect(result).toEqual({
            "selectionText": "o ",
            "selectionAtStart": false,
            "selectionAtEnd": false,
            "selectionStart": 2,
            "selectionEnd": 4,
            "text": "Foo bar"
        });
    });

    it('sets/get textRange on a content-editable element', async () => {
        const result = await page.evaluate(() => {
            const input = document.getElementById('editable');
            qcode.textRange.set(input, 2, 4);
            return qcode.textRange.get(input);
        });
        expect(result).toEqual({
            "selectionText": "it",
            "selectionAtStart": false,
            "selectionAtEnd": false,
            "selectionStart": 2,
            "selectionEnd": 4,
            "text": "Editable text"
        });
    });
});
