describe('dbGrid plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('jquery.dbGrid.test.html');
        await page.setRequestInterception(true); 
    });

    afterEach( () => page.close() );

    it('Supports initialFocus at start', async () => expect(
        page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "start"
            });
            
            $('body').trigger('pluginsReady');

            return $(':focus').val();
        })
    ).resolves.toBe('Charlie'));

    it('Supports initialFocus at end', async () => expect(
        page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "end"
            });

            $('body').trigger('pluginsReady');

            return $(':focus').val();
        })
    ).resolves.toBe('Bobby'));

    it('Can be disabled', async () => expect(
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
        var message;
        const mockCallback = jest.fn((event,additionalData) => {
            message = additionalData.html;
        });
        page.on('message',mockCallback);
        await page.evaluate(() => {
            $('#mygrid').dbGrid({
                initialFocus: "start"
            });

            $('body').trigger('pluginsReady');
        });

        return expect(mockCallback.mock.calls.length).toBe(1)
                && expect(message).toBe("Record 1 of 3");
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

    it('Saves via xhr, with xml response', async () => expect(
        page.evaluate(() => {
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

            $('body').on('message',(event, additionalData) => {
                if ( additionalData.html === "Saved." ) {            
                    expect( jQuery.ajax.mock.calls.length ).toBe(1);
                    expect( jQuery.ajax.mock.calls[0][0].url ).toBe('/dummy-update');
                    expect( jQuery.ajax.mock.calls[0][0].data ).toEqual({
                        name: 'Charlie',
                        email: 'charlie@mymail.co.uk',
                        highscore: '42'
                    });
                    expect(
                        $('tbody tr').first().dbRow('getRowData')
                    ).toEqual({
                        name: 'Alice',
                        email: 'alice@anemail.co.uk',
                        highscore: '50'
                    });
                    done();
                }
            });
            
            $('#mygrid').dbGrid({
                initialFocus: "start",
                updateURL: "/dummy-update"
            });
            $('body').trigger('pluginsReady');    
            $('#mygrid').dbGrid('save');
    });

    it('Saves via xhr, with json response', done => {
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

        $('body').on('message',(event, additionalData) => {
            if ( additionalData.html === "Saved." ) {
                expect( jQuery.ajax.mock.calls.length ).toBe(1);
                expect( jQuery.ajax.mock.calls[0][0].url ).toBe('/dummy-update');
                expect( jQuery.ajax.mock.calls[0][0].data ).toEqual({
                    name: 'Charlie',
                    email: 'charlie@mymail.co.uk',
                    highscore: '42'
                });
                expect(
                    $('tbody tr').first().dbRow('getRowData')
                ).toEqual({
                    name: 'Alice',
                    email: 'alice@anemail.co.uk',
                    highscore: '50'
                });
                done();
            }
        });
        
        $('#mygrid').dbGrid({
            initialFocus: "start",
            updateURL: "/dummy-update"
        });
        $('body').trigger('pluginsReady');    
        $('#mygrid').dbGrid('save');
    });

    it('Supports row delete', done => {
        jQuery.ajax = jest.fn();
        
        $('#mygrid').dbGrid({
            initialFocus: "start",
            updateURL: "/dummy-update",
            deleteURL: "/dummy-delete"
        });
        $('body').trigger('pluginsReady');

        // Click "Yes" on confirm dialog
        $('body').one('focusin',event => {
            $('.ui-dialog-buttonset .ui-button').first().trigger('click');
            expect( jQuery.ajax.mock.calls.length ).toBe(1);
            expect( jQuery.ajax.mock.calls[0][0].url ).toBe('/dummy-delete');
            done();
        });
        
        $('#mygrid').dbGrid('delete');
    });

    it('Supports removeRow method', () => {
        $('#mygrid').dbGrid({
            initialFocus: "start",
            updateURL: "/dummy-update"
        });
        $('body').trigger('pluginsReady');
        $('#mygrid').dbGrid('removeRow',$('tbody tr').first());

        expect( $('tbody tr').length ).toBe(2);
        expect( $('#mygrid').dbGrid('getCurrentCell')[0] ).toBe(
            $('tbody tr td').first()[0]
        );
    });

    it('Supports createBlankRow method', () => {
        $('#mygrid').dbGrid({
            initialFocus: "start",
            updateURL: "/dummy-update"
        });
        $('body').trigger('pluginsReady');
        $('#mygrid').dbGrid('createBlankRow');

        expect( $('tbody tr').length ).toBe(4);
    });

    it('Supports createNewRow method', () => {
        $('#mygrid').dbGrid({
            initialFocus: "start",
            updateURL: "/dummy-update"
        });
        $('body').trigger('pluginsReady');
        $('#mygrid').dbGrid('createNewRow');

        expect( $('tbody tr').length ).toBe(4);
    });

    it('Supports requery method', () => {
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

        expect( $('tbody tr').length ).toBe(2);
    });

    it('Supports cellAbove method', () => {
        $('#mygrid').dbGrid();
        $('body').trigger('pluginsReady');
        const middleCell = $('tbody tr').eq(1).find('td').find(1);
        const topCell = $('tbody tr').eq(0).find('td').find(1);
        expect(
            $('#mygrid').dbGrid('cellAbove', middleCell)[0]
        ).toBe(topCell[0]);
    });

    it('Supports cellRightOf method', () => {
        $('#mygrid').dbGrid();
        $('body').trigger('pluginsReady');
        const middleCell = $('tbody tr').eq(1).find('td').find(1);
        const rightCell = $('tbody tr').eq(1).find('td').find(2);
        expect(
            $('#mygrid').dbGrid('cellRightOf', middleCell)[0]
        ).toBe(rightCell[0]);
    });

    it('Supports cellBelow method', () => {
        $('#mygrid').dbGrid();
        $('body').trigger('pluginsReady');
        const middleCell = $('tbody tr').eq(1).find('td').find(1);
        const bottomCell = $('tbody tr').eq(2).find('td').find(1);
        expect(
            $('#mygrid').dbGrid('cellBelow', middleCell)[0]
        ).toBe(bottomCell[0]);
    });

    it('Supports cellLeftOf method', () => {
        $('#mygrid').dbGrid();
        $('body').trigger('pluginsReady');
        const middleCell = $('tbody tr').eq(1).find('td').find(1);
        const leftCell = $('tbody tr').eq(1).find('td').find(0);
        expect(
            $('#mygrid').dbGrid('cellLeftOf', middleCell)[0]
        ).toBe(leftCell[0]);
    });
});
