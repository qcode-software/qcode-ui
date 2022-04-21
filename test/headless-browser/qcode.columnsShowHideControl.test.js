describe('qcode.columnsShowHideControl plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.columnsShowHideControl.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );
    
    it('hides columns for unchecked buttons', async () => {
        const result = await page.evaluate(async () => {
            qcode.columnsShowHideControl(document.getElementById('label'));
            const cell = document.getElementsByTagName('td')[1];
            return qcode.getStyle(cell,'display');
        });
        expect(result).toBe("none");
    });
    
    it('does not hide unrelated columns', async () => {
        const result = await page.evaluate(async () => {
            qcode.columnsShowHideControl(document.getElementById('label'));
            const cell = document.getElementsByTagName('td')[0];
            return qcode.getStyle(cell,'display');
        });
        expect(result).toBe("table-cell");
    });
    
    it('unhides columns on button check', async () => {
        const result = await page.evaluate(async () => {
            const label = document.getElementById('label');
            qcode.columnsShowHideControl(label);
            label.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                composed: true
            }));
            const cell = document.getElementsByTagName('td')[1];
            return qcode.getStyle(cell,'display');
        });
        expect(result).toBe("table-cell");
    });
    
    it('re-hides columns on button un-check', async () => {
        const result = await page.evaluate(async () => {
            const label = document.getElementById('label');
            qcode.columnsShowHideControl(label);
            label.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                composed: true
            }));
            label.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                composed: true
            }));
            const cell = document.getElementsByTagName('td')[1];
            return qcode.getStyle(cell,'display');
        });
        expect(result).toBe("none");
    });
});
