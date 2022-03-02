describe('qcode.getID plugin',() => {
    let page;
    
    beforeEach(async () => {
        page = await ready_page('qcode.getID.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    it('gets a unique id for each element', async () => {
        const result = await page.evaluate(async () => {
            let ids = [];
            qcode.each(document.getElementsByTagName('p'),element => {
                ids.push(qcode.getID(element));
            });
            return ids;
        });        
        expect(result).toEqual(['qcode_ui_id_0','qcode_ui_id_1','third-para']);
    });
});
