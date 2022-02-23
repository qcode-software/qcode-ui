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

describe('qcode.addDelegatedEventListener', () => {
    it('calls callback when event matches selector', async () => {
        const callback = jest.fn();
        await page.exposeFunction('callback', callback);
        await page.evaluate(() => {
            qcode.addDelegatedEventListener(
                document.getElementById('section'),
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
        expect(callback.mock.calls.length).toBe(1);
    });

    it('does not call callback if event does not match selector', async () => {
        const callback = jest.fn();
        await page.exposeFunction('callback', callback);
        await page.evaluate(() => {
            qcode.addDelegatedEventListener(
                document.getElementById('section'),
                'p',
                'click',
                callback
            )
            document.getElementById('heading').dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });
        expect(callback.mock.calls.length).toBe(0);
    });
});

describe('qcode.index', () => {
    it('gets index of an element in its parent', async () => {
        const result = await page.evaluate(() => {
            return qcode.index(document.getElementById('p1'));
        });
        expect(result).toBe(1);
    });
});

describe('qcode.onClassChange', () => {
    it('runs callback when target element class changes', async () => {
        const callback = jest.fn();
        await page.exposeFunction('callback', callback);
        await page.evaluate(() => {
            const p = document.getElementById('p1');
            qcode.onClassChange(p,callback);
            p.classList.add('selected');
        });
        expect(callback.mock.calls.length).toBe(1);
    });
});
