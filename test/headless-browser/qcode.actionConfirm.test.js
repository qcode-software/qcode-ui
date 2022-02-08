describe('qcode.actionConfirm plugin',() => {
    let page;
    
    beforeEach(async () => {
        page = await ready_page('qcode.actionConfirm.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    it('can be confirmed', async () => {
        const result = await page.evaluate(async () => {
            const link = document.getElementById('link');            
            qcode.actionConfirm(link);
            
            link.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                composed: true
            }));

            for (let button of document.getElementsByTagName('button')) {
                if ( button.innerHTML == 'Yes' ) {
                    button.dispatchEvent(
                        new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            composed: true
                        })
                    );
                    return window.location.hash;
                }
            }
            return "NOT FOUND";
        });
        
        expect(result).toBe('#test');
    });

    it('can be cancelled', async () => {
        const result = await page.evaluate(() => {
            const link = document.getElementById('link');
            qcode.actionConfirm(link);
            
            link.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    composed: true
                })
            );

            for (let button of document.getElementsByTagName('button')) {
                if ( button.innerHTML == 'No' ) {
                    button.dispatchEvent(new MouseEvent('click'));
                    return window.location.hash;
                }
            }
            return "NOT FOUND";
        });
        
        expect(result).toBe('');
    });
});
