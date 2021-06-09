test('jquery.navigate', () => {
    const filesystem = require('fs');
    const fragment = filesystem
          .readFileSync('./test/jquery.navigate.test.html');
    document.body.innerHTML = fragment;

    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    expect( $('#topLeft').offset() ).toEqual({
        top: 0,
        left: 0
    });
    $('#topRight')[0].getBoundingClientRect = function(){
        return {
            x: 51,
            y: 0,
            left: 51,
            top: 0,
            width: 50,
            height: 10,
            right: 0,
            bottom: 11
        };
    };
    $('#bottomLeft')[0].getBoundingClientRect = function(){
        return {
            x: 0,
            y: 11,
            left: 0,
            top: 11,
            width: 50,
            height: 10,
            right: 51,
            bottom: 0
        };
    };
    $('#bottomRight')[0].getBoundingClientRect = function(){
        return {
            x: 51,
            y: 11,
            left: 51,
            top: 11,
            width: 50,
            height: 10,
            right: 0,
            bottom: 0
        };
    };
    HTMLElement.prototype.getClientRects = function(){
        return [this.getBoundingClientRect()];
    };
    expect( $('#topRight').offset() ).toEqual({
        top: 0,
        left: 51
    });
    expect( $('#bottomLeft').offset() ).toEqual({
        top: 11,
        left: 0
    });
    expect( $('#bottomRight').offset() ).toEqual({
        top: 11,
        left: 51
    });

    $('#container').navigate('[tabindex]');

    expect( $('#topRight').attr('id') ).toBe('topRight');
    
    $('#topRight').focus();
    expect( $(':focus').attr('id') ).toBe('topRight');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { which: down }
    ));
    /*$(':focus')[0].dispatchEvent(new KeyboardEvent(
        'keydown',
        {
            key: "ArrowDown",
            code: "ArrowDown",
            which: down,
            keyCode: down
        }
    ));*/
    expect( $('#topRight').southOf('[tabindex]').attr('id') ).toBe('bottomRight');
    expect( $(':focus').attr('id') ).toBe('bottomRight');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { which: left }
    ));
    /*$(':focus')[0].dispatchEvent(new KeyboardEvent(
        'keydown',
        {
            key: "ArrowLeft",
            code: "ArrowLeft",
            which: left,
            keyCode: left
        }
    ));*/
    expect( $(':focus').attr('id') ).toBe('bottomLeft');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { which: up }
    ));
    /*$(':focus')[0].dispatchEvent(new KeyboardEvent(
        'keydown',
        {
            key: "ArrowUp",
            code: "ArrowUp",
            which: up,
            keyCode: up
        }
    ));*/
    expect( $(':focus').attr('id') ).toBe('topLeft');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { which: right }
    ));
    /*$(':focus')[0].dispatchEvent(new KeyboardEvent(
        'keydown',
        {
            key: "ArrowRight",
            code: "ArrowRight",
            which: right,
            keyCode: right
        }
    ));*/
    expect( $(':focus').attr('id') ).toBe('topRight');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { which: right }
    ));
    /*$(':focus')[0].dispatchEvent(new KeyboardEvent(
        'keydown',
        {
            key: "ArrowRight",
            code: "ArrowRight",
            which: right,
            keyCode: right
        }
    ));*/
    expect( $(':focus').attr('id') ).toBe('bottomLeft');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { which: left }
    ));
    /*$(':focus')[0].dispatchEvent(new KeyboardEvent(
        'keydown',
        {
            key: "ArrowLeft",
            code: "ArrowLeft",
            which: left,
            keyCode: left
        }
    ));*/
    expect( $(':focus').attr('id') ).toBe('topRight');
});
