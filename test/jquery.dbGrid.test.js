beforeEach(() => {
    require('./polyfills/offsetParent.js');
    
    const filesystem = require('fs');
    const fragment = filesystem
          .readFileSync('./test/jquery.dbGrid.test.html');
    document.body.innerHTML = fragment;

    // Note - offsetWidth is used by jQuery's ":visible" pseudo-class
    // Needs to be non-zero for isCellEditable to work.
    $('tbody tr').each((i, row) => {
        $(row).find('td').each((j, cell) => {
            Object.defineProperty(cell, 'offsetWidth', {
                get() {
                    return [130,100,120][j];
                }
            });
        });
    });
});

afterEach(() => {
    $('body').off();
});

test('jquery.dbGrid initialFocus start', () => {
    $('#mygrid').dbGrid({
        initialFocus: "start"
    });

    $('body').trigger('pluginsReady');

    expect( $(':focus').val() ).toBe('Charlie');
});

test('jquery.dbGrid initialFocus end', () => {
    $('#mygrid').dbGrid({
        initialFocus: "end"
    });

    $('body').trigger('pluginsReady');

    expect( $(':focus').val() ).toBe('Bobby');
});

test('jquery.dbGrid not enabled', () => {
    $('#mygrid').dbGrid({
        initialFocus: "start",
        enabled: false
    });

    $('body').trigger('pluginsReady');

    expect( $(':focus').length ).toBe(0);
});

test('jquery.dbGrid message event', () => {
    var message;
    const mockCallback = jest.fn((event,additionalData) => {
        message = additionalData.html;
    });
    $('body').on('message',mockCallback);
    
    $('#mygrid').dbGrid({
        initialFocus: "start"
    });

    $('body').trigger('pluginsReady');

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(message).toBe("Record 1 of 3");
});

test('jquery.dbGrid cellChange', () => {
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
    
    expect( $(':focus').val() ).toBe('charlie@mymail.co.uk');
});

test('jquery.dbGrid save xml response', done => {
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

test('jquery.dbGrid save json response', done => {
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

test('jquery.dbGrid delete', done => {
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

test('jquery.dbGrid removeRow', () => {
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

test('jquery.dbGrid createBlankRow', () => {
    $('#mygrid').dbGrid({
        initialFocus: "start",
        updateURL: "/dummy-update"
    });
    $('body').trigger('pluginsReady');
    $('#mygrid').dbGrid('createBlankRow');

    expect( $('tbody tr').length ).toBe(4);
});

test('jquery.dbGrid createNewRow', () => {
    $('#mygrid').dbGrid({
        initialFocus: "start",
        updateURL: "/dummy-update"
    });
    $('body').trigger('pluginsReady');
    $('#mygrid').dbGrid('createNewRow');

    expect( $('tbody tr').length ).toBe(4);
});

test('jquery.dbGrid requery', () => {
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

test('jquery.dbGrid cellAbove', () => {
    $('#mygrid').dbGrid();
    $('body').trigger('pluginsReady');
    const middleCell = $('tbody tr').eq(1).find('td').find(1);
    const topCell = $('tbody tr').eq(0).find('td').find(1);
    expect(
        $('#mygrid').dbGrid('cellAbove', middleCell)[0]
    ).toBe(topCell[0]);
});

test('jquery.dbGrid cellRightOf', () => {
    $('#mygrid').dbGrid();
    $('body').trigger('pluginsReady');
    const middleCell = $('tbody tr').eq(1).find('td').find(1);
    const rightCell = $('tbody tr').eq(1).find('td').find(2);
    expect(
        $('#mygrid').dbGrid('cellRightOf', middleCell)[0]
    ).toBe(rightCell[0]);
});

test('jquery.dbGrid cellBelow', () => {
    $('#mygrid').dbGrid();
    $('body').trigger('pluginsReady');
    const middleCell = $('tbody tr').eq(1).find('td').find(1);
    const bottomCell = $('tbody tr').eq(2).find('td').find(1);
    expect(
        $('#mygrid').dbGrid('cellBelow', middleCell)[0]
    ).toBe(bottomCell[0]);
});

test('jquery.dbGrid cellLeftOf', () => {
    $('#mygrid').dbGrid();
    $('body').trigger('pluginsReady');
    const middleCell = $('tbody tr').eq(1).find('td').find(1);
    const leftCell = $('tbody tr').eq(1).find('td').find(0);
    expect(
        $('#mygrid').dbGrid('cellLeftOf', middleCell)[0]
    ).toBe(leftCell[0]);
});
