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

    it('Fires a message event', async () => {
        const logMessage = jest.fn();
        await page.exposeFunction("logMessage", logMessage);
        await page.evaluate(() => {
            return new Promise(resolve => {
                $('body').on('message', async (event,message) => {
                    await logMessage(message);
                    resolve();
                });
                $('#mygrid').dbGrid({
                    initialFocus: "start"
                });
                $('body').trigger('pluginsReady');
            });
        });

        expect(logMessage.mock.calls.length).toBe(1);
        expect(logMessage.mock.calls[0][0].html).toBe("Record 1 of 3");
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
            return new Promise(resolve => {
                jQuery.ajax = options => {
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
                    mockFunction(options)
                    resolve();
                };
                $('#mygrid').dbGrid({
                    initialFocus: "start",
                    updateURL: "/dummy-update"
                });
                $('body').trigger('pluginsReady');    
                $('#mygrid').dbGrid('save');
            });
        };
        
        it('Sends one xhr request', async () => {
            const mockFunction = jest.fn();
            
            await page.exposeFunction("mockFunction", mockFunction);
            await page.evaluate(save);
            
            expect( mockFunction.mock.calls.length ).toBe(1);
        });

        it('Uses the updateURL', async () => {
            const mockFunction = jest.fn();
            
            await page.exposeFunction("mockFunction", mockFunction);
            await page.evaluate(save);
            
            expect( mockFunction.mock.calls[0][0].url ).toBe('/dummy-update');
        });

        it('Supplies record data', async () => {
            const mockFunction = jest.fn();
            
            await page.exposeFunction("mockFunction", mockFunction);
            await page.evaluate(save);
            
            expect( mockFunction.mock.calls[0][0].data ).toEqual({
                name: 'Charlie',
                email: 'charlie@mymail.co.uk',
                highscore: '42'
            });
        });

        it('Updates record data', async () => {
            const mockFunction = jest.fn();
            
            await page.exposeFunction("mockFunction", mockFunction);
            await page.evaluate(save);
            const rowData = await page.evaluate(() => {
                return $('tbody tr').first().dbRow('getRowData')
            });
            
            expect(rowData).toEqual({
                name: 'Alice',
                email: 'alice@anemail.co.uk',
                highscore: '50'
            });
        });
    });

    describe('Saves via http/json', () => {
        const save = () => {
            return new Promise(resolve => {
                jQuery.ajax = options => {
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
                    mockFunction(options);
                    resolve();
                };
                $('#mygrid').dbGrid({
                    initialFocus: "start",
                    updateURL: "/dummy-update"
                });
                $('body').trigger('pluginsReady');    
                $('#mygrid').dbGrid('save');
            });
        };

        it('Sends one xhr request', async () => {
            const mockFunction = jest.fn();
            
            await page.exposeFunction("mockFunction", mockFunction);
            await page.evaluate(save);

            expect( mockFunction.mock.calls.length ).toBe(1);
        });

        it('Updates dbRow data', async () => {
            const mockFunction = jest.fn();
            
            await page.exposeFunction("mockFunction", mockFunction);
            await page.evaluate(save);
            const rowData = await page.evaluate(() => {
                return $('tbody tr').first().dbRow('getRowData')
            });
            
            expect(rowData).toEqual({
                name: 'Alice',
                email: 'alice@anemail.co.uk',
                highscore: '50'
            });
        });
    });

    it('Supports row delete', async () => {
        const mockFunction = jest.fn();
        await page.exposeFunction("mockFunction", mockFunction);

        await page.evaluate(() => {
            return new Promise(resolve => {
                jQuery.ajax = options => {
                    mockFunction(options);
                    resolve();
                };
            
                $('body').on('focusin', async event => {
                    $('dialog button').first().trigger('click');
                });
                
                $('#mygrid').dbGrid({
                    initialFocus: "start",
                    updateURL: "/dummy-update",
                    deleteURL: "/dummy-delete"
                });
                $('body').trigger('pluginsReady');
                
                $('#mygrid').dbGrid('delete');
            });
        });
        
        expect( mockFunction.mock.calls.length ).toBe(1);
        expect( mockFunction.mock.calls[0][0].url ).toBe('/dummy-delete');
    });

    it('Supports removeRow method', async () => {
        await page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "start",
                updateURL: "/dummy-update"
            });
            $('body').trigger('pluginsReady');
            $('#mygrid').dbGrid('removeRow',$('tbody tr').first());
        });
        const rows = await page.$$('tbody tr');
        expect(rows.length).toBe(2);
    });

    it('Supports createBlankRow method', async () => {
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
    });

    it('Supports createNewRow method', async () => {
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
    });

    it('Supports requery method', async () => {
        await page.evaluate(() => {
            jQuery.ajax = options => {
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
            };
            $('#mygrid').dbGrid({
                initialFocus: "start",
                dataURL: "/dummy-data"
            });
            $('body').trigger('pluginsReady');
            $('#mygrid').dbGrid('requery');
        });
        let rows = await page.$$('tbody tr');
        expect(rows.length).toBe(2);
    });

    it('Supports cellAbove method', async () => {
        expect(await page.evaluate(() => {
            $('#mygrid').dbGrid();
            $('body').trigger('pluginsReady');

            const rows = document.getElementsByTagName('tr');
            const middleCell = rows[1].getElementsByTagName('td')[0];
            const topCell = rows[0].getElementsByTagName('td')[0];

            return middleCell instanceof HTMLElement;
            
            return $('#mygrid').dbGrid('cellAbove', $(middleCell))[0]
                    == topCell;
        })).toBe(true);
    });

    /*it('Supports cellRightOf method', async done => {
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
