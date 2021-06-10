test('jquery.navigate', () => {
    const filesystem = require('fs');
    const fragment = filesystem
          .readFileSync('./test/jquery.navigate.test.html');
    document.body.innerHTML = fragment;

    // Imitate DOM behaviour
    document.getElementById('topRight').getBoundingClientRect = function(){
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
    document.getElementById('bottomLeft').getBoundingClientRect = function(){
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
    document.getElementById('bottomRight').getBoundingClientRect = function(){
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

    // Helper function to simulate arrow key events
    const which = {
        "ArrowLeft": 37,
        "ArrowUp": 38,
        "ArrowRight": 39,
        "ArrowDown": 40
    };
    function pressArrowKey(key) {
        document.activeElement.dispatchEvent(new KeyboardEvent(
            'keydown',
            {
                bubbles: true,
                key: key,
                code: key,
                which: which[key],
                keyCode: which[key]
            }
        ));
    }

    // Initialise navigate plugin
    $('#container').navigate('[tabindex]');

    // Tests:
    document.getElementById('topRight').focus();    
    expect( document.activeElement.id ).toBe('topRight');

    pressArrowKey("ArrowDown");
    expect( document.activeElement.id ).toBe('bottomRight');
    
    pressArrowKey("ArrowLeft");
    expect( document.activeElement.id ).toBe('bottomLeft');
    
    pressArrowKey("ArrowUp");
    expect( document.activeElement.id ).toBe('topLeft');
    
    pressArrowKey("ArrowRight");
    expect( document.activeElement.id ).toBe('topRight');

    pressArrowKey("ArrowRight");
    expect( document.activeElement.id ).toBe('bottomLeft');
    
    pressArrowKey("ArrowLeft");
    expect( document.activeElement.id ).toBe('topRight');
});
