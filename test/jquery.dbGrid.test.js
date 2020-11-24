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
        initialFocus: "start",
        enabled: false
    });
    $('body').trigger('pluginsReady');

    const cellTwo = $('#mygrid').dbGrid(
        'cellRightOf',
        $('tbody').find('tr').first().find('td').first()
    );
    
    expect(
        cellTwo.text()
    ).toBe('charlie@mymail.co.uk');

    expect( cellTwo.length ).toBe(1);
    
    cellTwo.trigger('mousedown');
    cellTwo.trigger('mouseup');
    
    expect( $(':focus').val() ).toBe('charlie@mymail.co.uk');
});
