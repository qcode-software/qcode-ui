describe('qcode indexPath', () => {
    let page;
    beforeEach(async () => {
        page = await ready_page('qcode.equivalentDescendant.test.html');
    });
    afterEach( () => page.close() );

    it('gets the index path from a root node to a descendant', async () => {
        const result = await page.evaluate(() => {
            const root = document.getElementById('main');
            const link = document.getElementById('test');
            return qcode.indexPath(root, link);
        });
        expect(result).toEqual([1,0]);
    });
});

describe('Qcode Equivalent Descendant', () => {
    let page;
    beforeEach(async () => {
        page = await ready_page('qcode.equivalentDescendant.test.html');
    });
    afterEach( () => page.close() );

    it('gets the equivalent descendant', async() => {
        const result = await page.evaluate(() => {
            const root = document.getElementById('main');
            const link = document.getElementById('test');
            const side = document.getElementById('side');
            return qcode.equivalentDescendant(
                root,
                link,
                side
            ).innerText;
        });
        expect(result).toBe("Side");
    });
    
    it('Returns otherRoot when target is root', async() => {
        const result = await page.evaluate(() => {
            const root = document.getElementById('main');
            const side = document.getElementById('side');
            return qcode.equivalentDescendant(
                root,
                root,
                side
            ).id;            
        });
        expect(result).toBe('side');
    });
});
