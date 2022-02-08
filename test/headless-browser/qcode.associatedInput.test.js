describe('qcode.associatedInput utility',() => {
    let page;
    
    beforeEach(async () => {
        page = await ready_page('qcode.associatedInput.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    if('uses for attribute to find associated element', async() => {
        const result = await page.evaluate(() => {
            return qcode.associatedInput(
                document.getElementById('usernameLabel')
            );
        });
    });
});
