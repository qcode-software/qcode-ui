describe('qcode.actionConfirm plugin',() => {
    let page;
    
    beforeEach(async () => {
        page = await ready_page('qcode.colInherit.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );
    
    it('applies styles from col to td', async () => {
        const result = await page.evaluate(async () => {
            qcode.colInherit( document.getElementById('testTable') );
            return window.getComputedStyle(
                document.getElementsByTagName('td')[0]
            ).getPropertyValue('width');
        });
        expect(result).toBe('130px');
    });
    
    it('copies class from col to td', async () => {
        const result = await page.evaluate(async () => {
            qcode.colInherit( document.getElementById('testTable') );
            return document.getElementsByTagName('td')[1].getAttribute('class');
        });
        expect(result).toBe('middle');
    });
    
    it('copies custom attributes from col to td', async () => {
        const result = await page.evaluate(async () => {
            qcode.colInherit(
                document.getElementById('testTable'),
                ['myAttribute']
            );
            return document
                    .getElementsByTagName('td')[0]
                    .getAttribute('myAttribute');
        });
        expect(result).toBe('hello');
    });
});
