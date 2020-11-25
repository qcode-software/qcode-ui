beforeEach(() => {
    require('./polyfills/offsetParent.js');

    const filesystem = require('fs');
    const fragment = filesystem
          .readFileSync('./test/jquery.dbEditorCombo.test.html');
    document.body.innerHTML = fragment;
});

test('jquery.dbEditorCombo.js show',() => {
    // Mock offsetLeft for testing since jest doesn't do layout
    Object.defineProperty($('.editor')[0], 'offsetLeft', {
        get() {
            return 50;
        }
    });
    
    $('.container').dbEditorCombo(
        'show',
        $('.editor'),
        $('.editor').text(),
        "/dummy.xml"
    );
    
    expect( $('.container').children().length ).toBe(2);
    expect( $('.db-editor').val() ).toBe('Fruit...');
    expect( $('.editor')[0].offsetParent ).toBe( $('.container')[0] );
    expect( $('.editor')[0].offsetLeft ).toBe(50);
    expect( $('.db-editor').css('left') ).toBe("50px");
    expect( $('.db-editor').css('borderTopWidth') ).toBe("1px");
});

test('jquery.dbEditorCombo.js getCurrentElement',() => {
    $('.container').dbEditorCombo(
        'show',
        $('.editor'),
        $('.editor').text(),
        "/dummy.xml"
    );

    expect (
        $('.container').dbEditorCombo('getCurrentElement')[0]
    ).toBe( $('.editor')[0] );
});

test('jquery.dbEditorCombo.js getValue',() => {
    $('.container').dbEditorCombo(
        'show',
        $('.editor'),
        $('.editor').text(),
        "/dummy.xml"
    );

    expect(
        $('.container').dbEditorCombo('getValue')
    ).toBe('Fruit...');
});

test('jquery.dbEditorCombo.js setValue',() => {
    $('.container').dbEditorCombo(
        'show',
        $('.editor'),
        $('.editor').text(),
        "/dummy.xml"
    );
    $('.container').dbEditorCombo('setValue','oranges');

    expect(
        $('.container').dbEditorCombo('getValue')
    ).toBe('oranges');
});

test('jquery.dbEditorCombo.js hide',() => {
    $('.container').dbEditorCombo(
        'show',
        $('.editor'),
        $('.editor').text(),
        "/dummy.xml"
    );
    $('.container').dbEditorCombo('hide');

    expect(
        $('.db-editor').css('display')
    ).toBe('none');
});

test('jquery.dbEditorCombo.js search',() => {
    const mockRequest = jest.fn(options => {
        const xmlDoc = jQuery.parseXML(
            "<records>" +
                    "<record>" +
                    "<option>Apple</option>" +
                    "<option>Banana</option>" +
                    "<option>Pear</option>" +
                    "</record>" +
                    "</records>"
        );
        options.success(xmlDoc);
    })
    jQuery.ajax = mockRequest;
    
    $('.container').dbEditorCombo(
        'show',
        $('.editor'),
        $('.editor').text(),
        "/dummy.xml"
    );
    $('.container').dbEditorCombo('search');

    expect( mockRequest.mock.calls.length ).toBe(1);
});
