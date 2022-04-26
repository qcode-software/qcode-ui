describe('qcode.compass plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.navigate.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );

    it('navigates to left cell', async () => {
        const result = await page.evaluate(async () => {
            const table = document.getElementById('table');
            qcode.navigate(table, 'td');
            const middle = document.getElementById('e');
            middle.focus();
            middle.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowLeft',
                    bubbles: true,
                    cancelable: true
                })
            );
            return document.activeElement.getAttribute('id');
        });
        expect(result).toBe('d');
    });

    it('navigates to right cell', async () => {
        const result = await page.evaluate(async () => {
            const table = document.getElementById('table');
            qcode.navigate(table, 'td');
            const middle = document.getElementById('e');
            middle.focus();
            qcode.textRange.set(middle, 'selectionAtEnd', 'end', 'end');
            middle.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowRight',
                    bubbles: true,
                    cancelable: true
                })
            );
            return document.activeElement.getAttribute('id');
        });
        expect(result).toBe('f');
    });

    it('navigates to top cell', async () => {
        const result = await page.evaluate(async () => {
            const table = document.getElementById('table');
            qcode.navigate(table, 'td');
            const middle = document.getElementById('e');
            middle.focus();
            middle.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowUp',
                    bubbles: true,
                    cancelable: true
                })
            );
            return document.activeElement.getAttribute('id');
        });
        expect(result).toBe('b');
    });

    it('navigates to bottom cell', async () => {
        const result = await page.evaluate(async () => {
            const table = document.getElementById('table');
            qcode.navigate(table, 'td');
            const middle = document.getElementById('e');
            middle.focus();
            qcode.textRange.set(middle, 'selectionAtEnd', 'end', 'end');
            middle.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    bubbles: true,
                    cancelable: true
                })
            );
            return document.activeElement.getAttribute('id');
        });
        expect(result).toBe('h');
    });
});
