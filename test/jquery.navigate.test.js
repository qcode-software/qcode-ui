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
            x: 50,
            y: 0,
            left: 50,
            top: 0,
            width: 50,
            height: 10,
            right: 0,
            bottom: 10
        };
    };
    $('#bottomLeft')[0].getBoundingClientRect = function(){
        return {
            x: 50,
            y: 0,
            left: 50,
            top: 0,
            width: 50,
            height: 10,
            right: 0,
            bottom: 10
        };
    };
    $('#bottomRight')[0].getBoundingClientRect = function(){
        return {
            x: 50,
            y: 0,
            left: 50,
            top: 0,
            width: 50,
            height: 10,
            right: 0,
            bottom: 10
        };
    };
    HTMLElement.prototype.getClientRects = function(){
        return [this.getBoundingClientRect()];
    };
    expect( $('#topRight').offset() ).toEqual({
        top: 0,
        left: 50
    });
    expect( $('#bottomLeft').offset() ).toEqual({
        top: 10,
        left: 0
    });
    expect( $('#bottomRight').offset() ).toEqual({
        top: 10,
        left: 50
    });

    $('#container').navigate('[tabindex]');

    expect( $('#topRight').attr('id') ).toBe('topRight');
    
    $('#topRight').focus();
    expect( $(':focus').attr('id') ).toBe('topRight');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { keyCode: down }
    ));
    expect( $(':focus').attr('id') ).toBe('bottomRight');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { keyCode: left }
    ));
    expect( $(':focus').attr('id') ).toBe('bottomLeft');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { keyCode: up }
    ));
    expect( $(':focus').attr('id') ).toBe('topLeft');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { keyCode: right }
    ));
    expect( $(':focus').attr('id') ).toBe('topRight');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { keyCode: right }
    ));
    expect( $(':focus').attr('id') ).toBe('bottomLeft');
    
    $(':focus').trigger( jQuery.Event(
        "keydown", { keyCode: left }
    ));
    expect( $(':focus').attr('id') ).toBe('topRight');
});
