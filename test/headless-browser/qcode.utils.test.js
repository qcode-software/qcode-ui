let page;
    
beforeEach(async () => {
    page = await ready_page('qcode.utils.test.html');
    await page.setRequestInterception(true); 
});

afterEach( () => page.close() );

describe('qcode.closest',() => {
    it('gets the closest ancestor matching a selector', async () => {
        const result = await page.evaluate(() => {
            return qcode.closest(
                document.getElementById('link'),
                'section'
            ).id;
        });
        expect(result).toBe('section');
    });
    it('returns null if no match', async () => {
        const result = await page.evaluate(() => {
            return qcode.closest(
                document.getElementById('link'),
                'article'
            ) === null;
        });
        expect(result).toBe(true);
    });
});

describe('qcode.closestInArray', () => {
    it('gets the closest ancestor that is in the given array', async () => {
        const result = await page.evaluate(() => {
            return qcode.closestInArray(
                document.getElementById('link'),
                [document.getElementById('section')]
            ).id;
        });
        expect(result).toBe('section');
    });
});

describe('qcode.getStyle', () => {
    it('gets a computed style property of an element', async () => {
        expect(await page.evaluate(() => {
            return qcode.getStyle(
                document.getElementById('section'),
                'width'
            );
        })).toBe('300px');
    });
});

/*describe('qcode.addDelegatedEventListener', () => {
    it('adds a delegated event listener', async () => {
        const callback = jest.fn();
        await page.exposeFunction('callback', callback);
        await page.evaluate(() => {
            qcode.addDelegatedEventListener(
                document.getElementBy('section'),
                'p',
                'click',
                callback
            )
            document.getElementById('link').dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });
    });
});*/
