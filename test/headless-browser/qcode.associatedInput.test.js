describe('qcode.associatedInput utility',() => {
    let page;
    
    beforeEach(async () => {
        page = await ready_page('qcode.associatedInput.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    it('uses for attribute to find associated element', async() => {
        const result = await page.evaluate(() => {
            return qcode.associatedInput(
                document.getElementById('usernameLabel')
            ).getAttribute('id');
        });
        expect(result).toBe('username');
    });

    it('looks for a descendant input element', async() => {
        const result = await page.evaluate(() => {
            return qcode.associatedInput(
                document.getElementById('telephoneLabel')
            ).getAttribute('id');
        });
        expect(result).toBe('telephone');
    });

    it('looks for a descendant button element', async() => {
        const result = await page.evaluate(() => {
            return qcode.associatedInput(
                document.getElementById('submitLabel')
            ).getAttribute('id');
        });
        expect(result).toBe('submit');
    });

    it('takes/returns an array of elements', async() => {
        const result = await page.evaluate(() => {
            return qcode.associatedInput(
                document.getElementsByTagName('label')
            ).length;
        });
        expect(result).toBe(3);
    });
});
