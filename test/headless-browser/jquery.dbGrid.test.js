describe('dbGrid plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('jquery.dbGrid.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    it('Supports initialFocus at start', () => expect(
        page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "start"
            });
            
            $('body').trigger('pluginsReady');

            return $(':focus').val();
        })
    ).resolves.toBe('Charlie'));

    it('Supports initialFocus at end', () => expect(
        page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "end"
            });

            $('body').trigger('pluginsReady');

            return $(':focus').val();
        })
    ).resolves.toBe('Bobby'));

    it('Can be disabled', () => expect(
        page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "start",
                enabled: false
            });

            $('body').trigger('pluginsReady');

            return $(':focus').length;
        })
    ).resolves.toBe(0));

    /*it('Fires a message event', async done => {
        var message;
        const logMessage = jest.fn((event,additionalData) => {
            message = additionalData.html;
        });
        await page.evaluate(log => {
            let logged = new Promise((resolve, reject) => {
                $('body').on('message',event => {
                    log(event);
                    resolve();
                });
            });
            $('#mygrid').dbGrid({
                initialFocus: "start"
            });

            $('body').trigger('pluginsReady');
            return logged;
        }, logMessage);

        expect(mockCallback.mock.calls.length).toBe(1);
        expect(message).toBe("Record 1 of 3");
        done();
    });

    it('Allows cell change', async () => expect(
        page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "start"
            });
            $('body').trigger('pluginsReady');

            const cellTwo = $('#mygrid').dbGrid(
                'cellRightOf',
                $('tbody').find('tr').first().find('td').first()
            );
            cellTwo.trigger('mousedown');    
            cellTwo.trigger('mouseup');

            return $(':focus').val();
        })
    ).resolves.toBe('charlie@mymail.co.uk'));

    describe('Saves via http/xml', () => {
        const save = () => {
            global.Cookies = {
                get() {
                    return "";
                }
            };
            jQuery.ajax = jest.fn(options => {
                const fakeResponse = jQuery.parseXML(
                    "<records>" +
                            "<record>" +
                            "<name>Alice</name>" +
                            "<email>alice@anemail.co.uk</email>" +
                            "<highscore>50</highscore>" +
                            "</record>" +
                            "</records>");
                const fakeStatus = "success";
                const fakeXHR = {
                    getResponseHeader() {
                        return "text/xml; charset=utf-8";
                    }
                }

                options.success(fakeResponse, fakeStatus, fakeXHR);
                return Promise.resolve(fakeResponse);
            });
            $('#mygrid').dbGrid({
                initialFocus: "start",
                updateURL: "/dummy-update"
            });
            $('body').trigger('pluginsReady');    
            $('#mygrid').dbGrid('save');
            return jQuery.ajax;
        };
        
        it('Sends one xhr request', async done => {
            let mock;
            page.on('message', () => {
                expect( mock.calls.length ).toBy(1);
                done();
            });
            mock = save();
        });

        it('Uses the updateURL', async done => {
            let mock;
            page.on('message', () => {
                expect( mock.calls[0][0].url ).toBe('/dummy-update');
                done();
            });
            mock.save();
        });

        it('Supplies record data', async done => {
            let mock;
            page.on('message', () => {
                expect( jQuery.ajax.mock.calls[0][0].data ).toEqual({
                    name: 'Charlie',
                    email: 'charlie@mymail.co.uk',
                    highscore: '42'
                });
                done()
            });
            mock.save();
        });

        it('Updates record data', async done => {
            let mock;
            page.on('message', () => {
                expect(
                    $('tbody tr').first().dbRow('getRowData')
                ).toEqual({
                    name: 'Alice',
                    email: 'alice@anemail.co.uk',
                    highscore: '50'
                });
                done();
            });
            mock.save();
        });
    });

    describe('Saves via http/json', () => {
        const save = () => {
            global.Cookies = {
                get() {
                    return "";
                }
            };
            jQuery.ajax = jest.fn(options => {
                const fakeResponse = {
                    status: "valid",
                    record: {
                        name: {value:"Alice"},
                        email: {value:"alice@anemail.co.uk"},
                        highscore: {value:"50"}
                    }
                }
                const fakeStatus = "success";
                const fakeXHR = {
                    getResponseHeader() {
                        return "application/json; charset=utf-8";
                    }
                }

                options.success(fakeResponse, fakeStatus, fakeXHR);
                return Promise.resolve(fakeResponse);
            });
            $('#mygrid').dbGrid({
                initialFocus: "start",
                updateURL: "/dummy-update"
            });
            $('body').trigger('pluginsReady');    
            $('#mygrid').dbGrid('save');
            return jQuery.ajax;
        };

        it('Sends one xhr request', async done => {
            let mock;
            page.on('message', (event, additionalData) => {
                expect( jQuery.ajax.mock.calls.length ).toBe(1);
                done();
            });
            mock = save();
        });

        it('Updates dbRow data', async done => {
            let mock;
            page.on('message', (event, additionalData) => {
                expect(
                    $('tbody tr').first().dbRow('getRowData')
                ).toEqual({
                    name: 'Alice',
                    email: 'alice@anemail.co.uk',
                    highscore: '50'
                });
                done();
            });
        });
    });

    it('Supports row delete', async done => {
        let request;
        page.on('focusin', async event => {
            await page.evaluate(() => {
                $('dialog button').first().trigger('click');
            });
            expect( request.mock.calls.length ).toBe(1);
            expect( request.mock.calls[0][0].url ).toBe('/dummy-delete');
            done();
        });
        request = await page.evaluate(async () => {
            jQuery.ajax = jest.fn();
            
            $('#mygrid').dbGrid({
                initialFocus: "start",
                updateURL: "/dummy-update",
                deleteURL: "/dummy-delete"
            });
            $('body').trigger('pluginsReady');
            
            $('#mygrid').dbGrid('delete');

            return jQuery.ajax;
        });
    });

    it('Supports removeRow method', async done => {
        await page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "start",
                updateURL: "/dummy-update"
            });
            $('body').trigger('pluginsReady');
            $('#mygrid').dbGrid('removeRow',$('tbody tr').first());
        });
        let rows = await page.$$('tbody tr');
        expect(rows.length).toBe(2);
        done();
    });

    it('Supports createBlankRow method', async done => {
        await page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "start",
                updateURL: "/dummy-update"
            });
            $('body').trigger('pluginsReady');
            $('#mygrid').dbGrid('createBlankRow');
        });
        let rows = await page.$$('tbody tr');
        expect(rows.length).toBe(4);
        done();
    });

    it('Supports createNewRow method', async done => {
        await page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "start",
                updateURL: "/dummy-update"
            });
            $('body').trigger('pluginsReady');
            $('#mygrid').dbGrid('createNewRow');
        });
        let rows = await page.$$('tbody tr');
        expect(rows.length).toBe(4);
        done();
    });

    it('Supports requery method', async done => {
        await page.evaluate(() => {
            jQuery.ajax = jest.fn(options => {
                const fakeResponse = jQuery.parseXML(
                    "<records>" +
                            "<record>" +
                            "<name>Alice</name>" +
                            "<email>alice@anemail.co.uk</email>" +
                            "<highscore>50</highscore>" +
                            "</record>" +
                            "<record>" +
                            "<name>Billy</name>" +
                            "<email>billy@anotheremail.com</email>" +
                            "<highscore>101</highscore>" +
                            "</record>" +
                            "</records>");

                options.success(fakeResponse);
                return Promise.resolve(fakeResponse);
            });
            $('#mygrid').dbGrid({
                initialFocus: "start",
                dataURL: "/dummy-data"
            });
            $('body').trigger('pluginsReady');
            $('#mygrid').dbGrid('requery');
        });
        let rows = await page.$$('tbody tr');
        expect(rows.length).toBe(2);
        done();
    });

    it('Supports cellAbove method', async done => {
        await page.evaluate(() => {
            $('#mygrid').dbGrid();
            $('body').trigger('pluginsReady');
        });
        const middleCell = await page.$(
            'tbody tr:nth-child(2) td:nth-child(1)');
        const topCell = await page.$(
            'tbody tr:nth-child(1) td:nth-child(1)');

        expect(middleCell).toBe(topCell);
        done();
    });

    it('Supports cellRightOf method', async done => {
        await page.evaluate(() => {
            $('#mygrid').dbGrid();
            $('body').trigger('pluginsReady');
        });
        const middleCell = await page.$(
            'tbody tr:nth-child(2) td:nth-child(1)');
        const rightCell = await page.$(
            'tbody tr:nth-child(1) td:nth-child(1)');

        expect(middleCell).toBe(rightCell);
        done();
    });

    it('Supports cellBelow method', async done => {
        await page.evaluate(() => {
            $('#mygrid').dbGrid();
            $('body').trigger('pluginsReady');
        });
        const middleCell = await page.$(
            'tbody tr:nth-child(1) td:nth-child(1)');
        const bottomCell = await page.$(
            'tbody tr:nth-child(2) td:nth-child(1)');

        expect(middleCell).toBe(bottomCell);
        done();
    });

    it('Supports cellLeftOf method', async done => {
        await page.evaluate(() => {
            $('#mygrid').dbGrid();
            $('body').trigger('pluginsReady');
        });
        const middleCell = await page.$(
            'tbody tr:nth-child(1) td:nth-child(2)');
        const leftCell = await page.$(
            'tbody tr:nth-child(1) td:nth-child(1)');

        expect(middleCell).toBe(leftCell);
        done();
    });*/
});
