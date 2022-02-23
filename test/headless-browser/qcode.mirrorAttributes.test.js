describe('qcode.mirrorAttributes',() => {
    let page;
    
    beforeEach(async () => {
        page = await ready_page('qcode.mirrorAttributes.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    it('fires an event on attribute change', async () => {
        const callback = jest.fn();
        await page.exposeFunction('callback', callback);
        await page.evaluate(() => {
            const source = document.getElementById('section1');
            const target = document.getElementById('section2');
            source.addEventListener('attributeChange',callback);
            qcode.mirrorAttributes(
                source,
                target,
                ['class']
            );
            source.querySelector('p').classList.add('selected');
        });
        expect(callback.mock.calls.length).toBe(1);
    });

    it('syncs attribute changes on source to target', async () => {
        const result = await page.evaluate(() => {
            const source = document.getElementById('section1');
            const target = document.getElementById('section2');
            qcode.mirrorAttributes(
                source,
                target,
                ['class']
            );
            const result = new Promise(resolve => {
                source.addEventListener('attributeChange',() => {
                    resolve(target.getAttribute('class'));
                });
            });
            source.classList.add('selected');
            return result;
        });
        expect(result).toBe('selected');
    });

    it('syncs changes on descendants', async () => {
        const result = await page.evaluate(() => {
            const source = document.getElementById('section1');
            const target = document.getElementById('section2');
            qcode.mirrorAttributes(
                source,
                target,
                ['class']
            );
            const result = new Promise(resolve => {
                source.addEventListener('attributeChange',() => {
                    resolve(target.querySelector('p').getAttribute('class'));
                });
            });
            source.querySelector('p').classList.add('selected');
            return result;
        });
        expect(result).toBe('selected');
    });
});
