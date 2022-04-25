describe('qcode.compass plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.compass.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );

    it('finds the cell above the middle cell', async () => {
        const result = await page.evaluate(async () => {
            const cells = document.getElementsByTagName('td');
            const middle = document.getElementById('e');
            const north = qcode.northOf(middle, cells)
            if ( ! (north instanceof HTMLElement) ) {
                return north;
            }
            return north.getAttribute('id');
        });
        expect(result).toBe('b');
    });

    it('finds the cell below the middle cell', async () => {
        const result = await page.evaluate(async () => {
            const cells = document.getElementsByTagName('td');
            const middle = document.getElementById('e');
            const south = qcode.southOf(middle, cells)
            if ( ! (south instanceof HTMLElement) ) {
                return south;
            }
            return south.getAttribute('id');
        });
        expect(result).toBe('h');
    });

    it('finds the cell left of the middle cell', async () => {
        const result = await page.evaluate(async () => {
            const cells = document.getElementsByTagName('td');
            const middle = document.getElementById('e');
            const west = qcode.westOf(middle, cells)
            if ( ! (west instanceof HTMLElement) ) {
                return west;
            }
            return west.getAttribute('id');
        });
        expect(result).toBe('d');
    });

    it('finds the cell right of the middle cell', async () => {
        const result = await page.evaluate(async () => {
            const cells = document.getElementsByTagName('td');
            const middle = document.getElementById('e');
            const east = qcode.eastOf(middle, cells)
            if ( ! (east instanceof HTMLElement) ) {
                return east;
            }
            return east.getAttribute('id');
        });
        expect(result).toBe('f');
    });

    it('wraps onto the previous row', async () => {
        const result = await page.evaluate(async () => {
            const cells = document.getElementsByTagName('td');
            const left = document.getElementById('d');
            const west = qcode.westOf(left, cells)
            if ( ! (west instanceof HTMLElement) ) {
                return west;
            }
            return west.getAttribute('id');
        });
        expect(result).toBe('c');
    });

    it('wraps onto the next row', async () => {
        const result = await page.evaluate(async () => {
            const cells = document.getElementsByTagName('td');
            const right = document.getElementById('f');
            const east = qcode.eastOf(right, cells)
            if ( ! (east instanceof HTMLElement) ) {
                return east;
            }
            return east.getAttribute('id');
        });
        expect(result).toBe('g');
    });

    it('wraps onto the previous column', async () => {
        const result = await page.evaluate(async () => {
            const cells = document.getElementsByTagName('td');
            const top = document.getElementById('b');
            const north = qcode.northOf(top, cells)
            if ( ! (north instanceof HTMLElement) ) {
                return north;
            }
            return north.getAttribute('id');
        });
        expect(result).toBe('g');
    });

    it('wraps onto the next column', async () => {
        const result = await page.evaluate(async () => {
            const cells = document.getElementsByTagName('td');
            const bottom = document.getElementById('h');
            const south = qcode.southOf(bottom, cells)
            if ( ! (south instanceof HTMLElement) ) {
                return south;
            }
            return south.getAttribute('id');
        });
        expect(result).toBe('c');
    });
});
