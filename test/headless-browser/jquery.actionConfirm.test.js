describe('jquery.actionConfirm plugin',() => {
    let page;
    
    beforeEach(async () => {
        page = await ready_page('jquery.actionConfirm.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    it('can be confirmed', async () => {
        const result = await page.evaluate(() => {
            $('#link').actionConfirm();

            document.getElementById('link').dispatchEvent(new MouseEvent('click'));

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
        });
        
        expect(result).toBe('#test');
    });

    it('can be cancelled', async () => {
        const result = await page.evaluate(() => {
            $('#link').actionConfirm();
            
            document.getElementById('link').dispatchEvent(
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
        });
        
        expect(result).toBe('');
    });
});
